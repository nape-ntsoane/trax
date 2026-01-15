from typing import List, Optional, Dict, Any
from sqlalchemy.ext.asyncio import AsyncSession
from app.repositories.folder import FolderRepository
from app.schemas.folder import FolderCreate, FolderUpdate, FolderRead, FolderWithRecentApplications
from app.db.models.folder import Folder
from app.db.models.user import User

class FolderService:
    def __init__(self, session: AsyncSession):
        self.repo = FolderRepository(session)

    async def create_folder(self, payload: FolderCreate, current_user: User) -> FolderRead:
        folder = Folder(**payload.model_dump(), creator=current_user, creator_id=current_user.id)
        created_folder = await self.repo.create(folder)
        return created_folder

    async def update_folder(self, folder_id: int, payload: FolderUpdate, current_user: User) -> FolderRead:
        folder = await self.repo.verify_ownership(folder_id, current_user.id)
        update_data = payload.model_dump(exclude_unset=True)
        for key, value in update_data.items():
            setattr(folder, key, value)
        updated_folder = await self.repo.update(folder)
        return updated_folder

    async def delete_folder(self, folder_id: int, current_user: User) -> None:
        folder = await self.repo.verify_ownership(folder_id, current_user.id)
        await self.repo.delete(folder)

    async def get_folder(self, folder_id: int, current_user: User) -> FolderRead:
        folder = await self.repo.verify_ownership(folder_id, current_user.id)
        return folder

    async def list_folders_recent_applications(self, current_user: User, page: int = 1, per_page: int = 10):
        skip = (page - 1) * per_page
        data, total = await self.repo.get_with_recent_applications(current_user.id, skip, per_page)
        
        result = []
        for folder, applications, count in data:
            result.append(FolderWithRecentApplications(
                folder=folder,
                recent_applications=applications,
                application_count=count
            ))
        return {"items": result, "total": total, "page": page, "per_page": per_page}

    async def list_folders_brief(self, current_user: User, page: int = 1, per_page: int = 10):
        skip = (page - 1) * per_page
        folders = await self.repo.get_all(current_user.id, skip, per_page)
        # Assuming get_all returns just list. If we need total, we need to update repo.
        # For now, returning list.
        return folders

    async def search_folders(self, current_user: User, query: str | None, filters: dict | None, page: int = 1, per_page: int = 10):
        skip = (page - 1) * per_page
        folders, total = await self.repo.search(current_user.id, query, filters, skip, per_page)
        return {"items": folders, "total": total, "page": page, "per_page": per_page}
