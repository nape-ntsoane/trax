from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_async_session
from app.core.auth import current_active_user
from app.db.models.user import User
from app.services.folder import FolderService
from app.services.application import ApplicationService
from app.api.routes.limiter import limiter

search_router = APIRouter()

@search_router.get("/")
@limiter.limit("10/minute")
async def search(
    request: Request,
    query: str = None,
    page: int = 1,
    per_page: int = 10,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    folder_service = FolderService(db)
    app_service = ApplicationService(db)
    
    folders = await folder_service.search_folders(current_user, query, filters=None, page=page, per_page=per_page)
    applications = await app_service.search_applications(current_user, query, filters=None, page=page, per_page=per_page)
    
    return {
        "folders": folders,
        "applications": applications
    }
