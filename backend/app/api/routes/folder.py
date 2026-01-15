from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_async_session, require_owner
from app.core.auth import current_active_user
from app.db.models.user import User
from app.db.models.folder import Folder
from app.schemas.folder import FolderCreate, FolderUpdate, FolderRead
from app.services.folder import FolderService
from app.services.application import ApplicationService
from app.api.routes.limiter import limiter

folder_router = APIRouter()

@folder_router.post("/", response_model=FolderRead)
@limiter.limit("5/minute")
async def create_folder(
    request: Request,
    payload: FolderCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = FolderService(db)
    return await service.create_folder(payload, current_user)

@folder_router.put("/{resource_id}", response_model=FolderRead)
@limiter.limit("5/minute")
async def update_folder(
    request: Request,
    resource_id: int,
    payload: FolderUpdate,
    folder: Folder = Depends(require_owner(model=Folder)),
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = FolderService(db)
    return await service.update_folder(resource_id, payload, current_user)

@folder_router.delete("/{resource_id}")
@limiter.limit("5/minute")
async def delete_folder(
    request: Request,
    resource_id: int,
    folder: Folder = Depends(require_owner(model=Folder)),
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = FolderService(db)
    await service.delete_folder(resource_id, current_user)
    return {"message": "Folder deleted"}

@folder_router.get("/dashboard")
@limiter.limit("10/minute")
async def get_dashboard(
    request: Request,
    page: int = 1,
    per_page: int = 10,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = FolderService(db)
    return await service.list_folders_recent_applications(current_user, page, per_page)

@folder_router.get("/{folder_id}", response_model=FolderRead)
@limiter.limit("10/minute")
async def get_folder(
    request: Request,
    folder_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = FolderService(db)
    return await service.get_folder(folder_id, current_user)

@folder_router.get("/{folder_id}/applications")
@limiter.limit("10/minute")
async def get_folder_applications(
    request: Request,
    folder_id: int,
    page: int = 1,
    per_page: int = 10,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    app_service = ApplicationService(db)
    return await app_service.search_applications(current_user, query=None, filters={"folder_id": folder_id}, page=page, per_page=per_page)
