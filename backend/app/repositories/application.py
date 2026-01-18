from typing import List, Optional, Dict, Any, Tuple, Literal
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, or_, desc, asc
from sqlalchemy.orm import selectinload
from fastapi import HTTPException

from app.db.models.application import Application
from app.db.models.selects import Status, Priority

class ApplicationRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, application: Application) -> Application:
        self.session.add(application)
        await self.session.commit()
        # Re-fetch with eager loading
        return await self.get_by_id(application.id)

    async def update(self, application: Application) -> Application:
        await self.session.commit()
        # Re-fetch with eager loading
        return await self.get_by_id(application.id)

    async def delete(self, application: Application) -> None:
        await self.session.delete(application)
        await self.session.commit()

    async def get_by_id(self, application_id: int) -> Optional[Application]:
        query = (
            select(Application)
            .options(
                selectinload(Application.tags),
                selectinload(Application.status),
                selectinload(Application.priority),
                selectinload(Application.folder)
            )
            .where(Application.id == application_id)
        )
        result = await self.session.execute(query)
        return result.scalars().first()

    async def verify_ownership(self, application_id: int, user_id: uuid.UUID) -> Application:
        application = await self.get_by_id(application_id)
        if not application:
            raise HTTPException(status_code=404, detail="Application not found")
        if application.creator_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
        return application

    async def get_all(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100, sort_by: str = "updated_at", sort_order: Literal["asc", "desc"] = "desc") -> List[Application]:
        query = (
            select(Application)
            .options(
                selectinload(Application.tags),
                selectinload(Application.status),
                selectinload(Application.priority),
                selectinload(Application.folder)
            )
            .where(Application.creator_id == user_id)
        )
        
        if sort_by == "status":
            query = query.join(Status, Application.status_id == Status.id, isouter=True)
            sort_column = Status.title
        elif sort_by == "priority":
            query = query.join(Priority, Application.priority_id == Priority.id, isouter=True)
            sort_column = Priority.title
        else:
            sort_column = getattr(Application, sort_by, None)

        if sort_column is not None:
            if sort_order == "asc":
                query = query.order_by(asc(sort_column))
            else:
                query = query.order_by(desc(sort_column))

        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def search(
        self, user_id: uuid.UUID, query_str: Optional[str] = None, filters: Optional[Dict[str, Any]] = None, skip: int = 0, limit: int = 100, sort_by: str = "updated_at", sort_order: Literal["asc", "desc"] = "desc"
    ) -> Tuple[List[Application], int]:
        query = (
            select(Application)
            .options(
                selectinload(Application.tags),
                selectinload(Application.status),
                selectinload(Application.priority),
                selectinload(Application.folder)
            )
            .where(Application.creator_id == user_id)
        )

        if query_str:
            search_filter = or_(
                Application.title.ilike(f"%{query_str}%"),
                Application.company.ilike(f"%{query_str}%"),
                Application.description.ilike(f"%{query_str}%"),
                Application.role.ilike(f"%{query_str}%")
            )
            query = query.where(search_filter)

        if filters:
            if "status_id" in filters:
                query = query.where(Application.status_id == filters["status_id"])
            if "priority_id" in filters:
                query = query.where(Application.priority_id == filters["priority_id"])
            if "folder_id" in filters:
                query = query.where(Application.folder_id == filters["folder_id"])
            if "starred" in filters:
                query = query.where(Application.starred == filters["starred"])
            
        # Count
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_query)).scalar_one()

        if sort_by == "status":
            query = query.join(Status, Application.status_id == Status.id, isouter=True)
            sort_column = Status.title
        elif sort_by == "priority":
            query = query.join(Priority, Application.priority_id == Priority.id, isouter=True)
            sort_column = Priority.title
        else:
            sort_column = getattr(Application, sort_by, None)

        if sort_column is not None:
            if sort_order == "asc":
                query = query.order_by(asc(sort_column))
            else:
                query = query.order_by(desc(sort_column))

        # Paginate
        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all(), total
