from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_async_session, require_owner
from app.core.auth import current_active_user
from app.db.models.user import User
from app.db.models.application import Application
from app.schemas.application import ApplicationCreate, ApplicationUpdate, ApplicationRead
from app.services.application import ApplicationService
from app.api.routes.limiter import limiter
from typing import Literal

application_router = APIRouter()

@application_router.post("/", response_model=ApplicationRead)
@limiter.limit("5/minute")
async def create_application(
    request: Request,
    payload: ApplicationCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = ApplicationService(db)
    return await service.create_application(payload, current_user)

@application_router.put("/{resource_id}", response_model=ApplicationRead)
@limiter.limit("5/minute")
async def update_application(
    request: Request,
    resource_id: int,
    payload: ApplicationUpdate,
    application: Application = Depends(require_owner(model=Application)),
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = ApplicationService(db)
    return await service.update_application(resource_id, payload, current_user)

@application_router.delete("/{resource_id}")
@limiter.limit("5/minute")
async def delete_application(
    request: Request,
    resource_id: int,
    application: Application = Depends(require_owner(model=Application)),
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = ApplicationService(db)
    await service.delete_application(resource_id, current_user)
    return {"message": "Application deleted"}

@application_router.get("/{application_id}", response_model=ApplicationRead)
@limiter.limit("10/minute")
async def get_application(
    request: Request,
    application_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = ApplicationService(db)
    return await service.get_application(application_id, current_user)

@application_router.get("/")
@limiter.limit("10/minute")
async def list_applications(
    request: Request,
    page: int = 1,
    per_page: int = 10,
    sort_by: str = "updated_at",
    sort_order: Literal["asc", "desc"] = "desc",
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = ApplicationService(db)
    return await service.list_applications(current_user, page, per_page, sort_by, sort_order)
