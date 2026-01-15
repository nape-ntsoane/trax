from typing import List, Optional, Tuple, Dict, Any
import uuid
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, func, and_, desc, or_
from sqlalchemy.orm import selectinload
from fastapi import HTTPException

from app.db.models.folder import Folder
from app.db.models.application import Application

class FolderRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, folder: Folder) -> Folder:
        self.session.add(folder)
        await self.session.commit()
        await self.session.refresh(folder)
        return folder

    async def update(self, folder: Folder) -> Folder:
        await self.session.commit()
        await self.session.refresh(folder)
        return folder

    async def delete(self, folder: Folder) -> None:
        await self.session.delete(folder)
        await self.session.commit()

    async def get_by_id(self, folder_id: int) -> Optional[Folder]:
        result = await self.session.execute(select(Folder).where(Folder.id == folder_id))
        return result.scalars().first()

    async def verify_ownership(self, folder_id: int, user_id: uuid.UUID) -> Folder:
        folder = await self.get_by_id(folder_id)
        if not folder:
            raise HTTPException(status_code=404, detail="Folder not found")
        if folder.creator_id != user_id:
            raise HTTPException(status_code=403, detail="Not authorized")
        return folder

    async def get_all(self, user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Folder]:
        query = select(Folder).where(Folder.creator_id == user_id).offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all()

    async def get_with_recent_applications(
        self, user_id: uuid.UUID, skip: int = 0, limit: int = 100
    ) -> Tuple[List[Tuple[Optional[Folder], List[Application], int]], int]:
        # Get folders
        folders_query = select(Folder).where(Folder.creator_id == user_id).offset(skip).limit(limit)
        folders_result = await self.session.execute(folders_query)
        folders = folders_result.scalars().all()
        
        # Count total folders
        count_query = select(func.count()).select_from(Folder).where(Folder.creator_id == user_id)
        total_folders = (await self.session.execute(count_query)).scalar_one()

        result = []
        for folder in folders:
            # Get app count
            app_count_query = select(func.count()).select_from(Application).where(
                and_(Application.folder_id == folder.id, Application.creator_id == user_id)
            )
            app_count = (await self.session.execute(app_count_query)).scalar_one()

            # Get recent apps
            recent_apps_query = (
                select(Application)
                .options(
                    selectinload(Application.tags),
                    selectinload(Application.status),
                    selectinload(Application.priority),
                    selectinload(Application.folder)
                )
                .where(and_(Application.folder_id == folder.id, Application.creator_id == user_id))
                .order_by(desc(Application.id))
                .limit(5)
            )
            recent_apps = (await self.session.execute(recent_apps_query)).scalars().all()
            result.append((folder, recent_apps, app_count))

        # Handle unfiled applications
        unfiled_count_query = select(func.count()).select_from(Application).where(
            and_(Application.folder_id.is_(None), Application.creator_id == user_id)
        )
        unfiled_count = (await self.session.execute(unfiled_count_query)).scalar_one()

        if unfiled_count > 0:
             recent_unfiled_query = (
                select(Application)
                .options(
                    selectinload(Application.tags),
                    selectinload(Application.status),
                    selectinload(Application.priority),
                    selectinload(Application.folder)
                )
                .where(and_(Application.folder_id.is_(None), Application.creator_id == user_id))
                .order_by(desc(Application.id))
                .limit(5)
            )
             recent_unfiled = (await self.session.execute(recent_unfiled_query)).scalars().all()
             result.insert(0, (None, recent_unfiled, unfiled_count))
             total_folders += 1

        return result, total_folders

    async def search(
        self, user_id: uuid.UUID, query_str: Optional[str] = None, filters: Optional[Dict[str, Any]] = None, skip: int = 0, limit: int = 100
    ) -> Tuple[List[Folder], int]:
        query = select(Folder).where(Folder.creator_id == user_id)
        
        if query_str:
            query = query.where(Folder.title.ilike(f"%{query_str}%"))
            
        if filters:
            # Implement filters if any
            pass
            
        # Count
        count_query = select(func.count()).select_from(query.subquery())
        total = (await self.session.execute(count_query)).scalar_one()

        # Paginate
        query = query.offset(skip).limit(limit)
        result = await self.session.execute(query)
        return result.scalars().all(), total
