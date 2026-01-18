from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.repositories.application import ApplicationRepository
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationRead

from app.db.models.application import Application
from app.db.models.user import User
from app.db.models.selects import Tag
from typing import Literal

class ApplicationService:
    def __init__(self, session: AsyncSession):
        self.repo = ApplicationRepository(session)
        self.session = session

    async def create_application(self, payload: ApplicationCreate, current_user: User) -> ApplicationRead:
        data = payload.model_dump(exclude={"tag_ids"})
        application = Application(**data, creator=current_user, creator_id=current_user.id)
        
        if payload.tag_ids:
            result = await self.session.execute(select(Tag).where(Tag.id.in_(payload.tag_ids)))
            tags = result.scalars().all()
            application.tags = list(tags)
        
        created_application = await self.repo.create(application)
        return created_application

    async def update_application(self, application_id: int, payload: ApplicationUpdate, current_user: User) -> ApplicationRead:
        application = await self.repo.verify_ownership(application_id, current_user.id)
        update_data = payload.model_dump(exclude_unset=True, exclude={"tag_ids"})
        for key, value in update_data.items():
            setattr(application, key, value)
            
        if payload.tag_ids is not None:
            result = await self.session.execute(select(Tag).where(Tag.id.in_(payload.tag_ids)))
            tags = result.scalars().all()
            application.tags = list(tags)

        updated_application = await self.repo.update(application)
        return updated_application

    async def delete_application(self, application_id: int, current_user: User) -> None:
        application = await self.repo.verify_ownership(application_id, current_user.id)
        await self.repo.delete(application)

    async def get_application(self, application_id: int, current_user: User) -> ApplicationRead:
        application = await self.repo.verify_ownership(application_id, current_user.id)
        return application

    async def list_applications(self, current_user: User, page: int = 1, per_page: int = 10, sort_by: str = "updated_at", sort_order: Literal["asc", "desc"] = "desc"):
        # Use search with empty query to get paginated results with total count
        return await self.search_applications(current_user, query=None, filters=None, page=page, per_page=per_page, sort_by=sort_by, sort_order=sort_order)

    async def search_applications(self, current_user: User, query: str | None, filters: dict | None, page: int = 1, per_page: int = 10, sort_by: str = "updated_at", sort_order: Literal["asc", "desc"] = "desc"):
        skip = (page - 1) * per_page
        applications, total = await self.repo.search(current_user.id, query, filters, skip, per_page, sort_by, sort_order)
        return {"items": applications, "total": total, "page": page, "per_page": per_page}
