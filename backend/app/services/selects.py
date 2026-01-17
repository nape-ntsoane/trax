from typing import List
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.selects import SelectsRepository
from app.schemas.selects import SelectCreate, SelectUpdate, SelectRead
from app.db.models.selects import Tag, Status, Priority
from app.db.models.user import User

class SelectsService:
    def __init__(self, session: AsyncSession):
        self.repo = SelectsRepository(session)

    # Tag
    async def create_tag(self, payload: SelectCreate, current_user: User) -> SelectRead:
        return await self.repo.create(Tag, user_id=current_user.id, **payload.model_dump())

    async def update_tag(self, tag_id: int, payload: SelectUpdate, current_user: User) -> SelectRead:
        return await self.repo.update(Tag, tag_id, current_user.id, **payload.model_dump(exclude_unset=True))

    async def delete_tag(self, tag_id: int, current_user: User) -> None:
        await self.repo.delete(Tag, tag_id, current_user.id)

    async def list_tags(self, current_user: User, page: int = 1, per_page: int = 10) -> List[SelectRead]:
        skip = (page - 1) * per_page
        return await self.repo.get_all(Tag, user_id=current_user.id, skip=skip, limit=per_page)

    # Status
    async def create_status(self, payload: SelectCreate, current_user: User) -> SelectRead:
        return await self.repo.create(Status, user_id=current_user.id, **payload.model_dump())

    async def update_status(self, status_id: int, payload: SelectUpdate, current_user: User) -> SelectRead:
        return await self.repo.update(Status, status_id, current_user.id, **payload.model_dump(exclude_unset=True))

    async def delete_status(self, status_id: int, current_user: User) -> None:
        await self.repo.delete(Status, status_id, current_user.id)

    async def list_statuses(self, current_user: User, page: int = 1, per_page: int = 10) -> List[SelectRead]:
        skip = (page - 1) * per_page
        return await self.repo.get_all(Status, user_id=current_user.id, skip=skip, limit=per_page)

    # Priority
    async def create_priority(self, payload: SelectCreate, current_user: User) -> SelectRead:
        return await self.repo.create(Priority, user_id=current_user.id, **payload.model_dump())

    async def update_priority(self, priority_id: int, payload: SelectUpdate, current_user: User) -> SelectRead:
        return await self.repo.update(Priority, priority_id, current_user.id, **payload.model_dump(exclude_unset=True))

    async def delete_priority(self, priority_id: int, current_user: User) -> None:
        await self.repo.delete(Priority, priority_id, current_user.id)

    async def list_priorities(self, current_user: User, page: int = 1, per_page: int = 10) -> List[SelectRead]:
        skip = (page - 1) * per_page
        return await self.repo.get_all(Priority, user_id=current_user.id, skip=skip, limit=per_page)
