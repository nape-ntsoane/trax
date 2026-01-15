from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession
from app.api.deps import get_async_session
from app.core.auth import current_active_user
from app.db.models.user import User
from app.schemas.selects import TagCreate, TagUpdate, TagRead, StatusCreate, StatusUpdate, StatusRead, PriorityCreate, PriorityUpdate, PriorityRead
from app.services.selects import SelectsService
from app.api.routes.limiter import limiter

selects_router = APIRouter()

# Tags
@selects_router.post("/tags", response_model=TagRead)
@limiter.limit("5/minute")
async def create_tag(
    request: Request,
    payload: TagCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    return await service.create_tag(payload, current_user)

@selects_router.put("/tags/{tag_id}", response_model=TagRead)
@limiter.limit("5/minute")
async def update_tag(
    request: Request,
    tag_id: int,
    payload: TagUpdate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    return await service.update_tag(tag_id, payload, current_user)

@selects_router.delete("/tags/{tag_id}")
@limiter.limit("5/minute")
async def delete_tag(
    request: Request,
    tag_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    await service.delete_tag(tag_id, current_user)
    return {"message": "Tag deleted"}

# Statuses
@selects_router.post("/statuses", response_model=StatusRead)
@limiter.limit("5/minute")
async def create_status(
    request: Request,
    payload: StatusCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    return await service.create_status(payload, current_user)

@selects_router.put("/statuses/{status_id}", response_model=StatusRead)
@limiter.limit("5/minute")
async def update_status(
    request: Request,
    status_id: int,
    payload: StatusUpdate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    return await service.update_status(status_id, payload, current_user)

@selects_router.delete("/statuses/{status_id}")
@limiter.limit("5/minute")
async def delete_status(
    request: Request,
    status_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    await service.delete_status(status_id, current_user)
    return {"message": "Status deleted"}

# Priorities
@selects_router.post("/priorities", response_model=PriorityRead)
@limiter.limit("5/minute")
async def create_priority(
    request: Request,
    payload: PriorityCreate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    return await service.create_priority(payload, current_user)

@selects_router.put("/priorities/{priority_id}", response_model=PriorityRead)
@limiter.limit("5/minute")
async def update_priority(
    request: Request,
    priority_id: int,
    payload: PriorityUpdate,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    return await service.update_priority(priority_id, payload, current_user)

@selects_router.delete("/priorities/{priority_id}")
@limiter.limit("5/minute")
async def delete_priority(
    request: Request,
    priority_id: int,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    await service.delete_priority(priority_id, current_user)
    return {"message": "Priority deleted"}

@selects_router.get("/")
@limiter.limit("10/minute")
async def list_all_selects(
    request: Request,
    db: AsyncSession = Depends(get_async_session),
    current_user: User = Depends(current_active_user),
):
    service = SelectsService(db)
    tags = await service.list_tags(page=1, per_page=100)
    statuses = await service.list_statuses(page=1, per_page=100)
    priorities = await service.list_priorities(page=1, per_page=100)
    
    return {
        "tags": tags,
        "statuses": statuses,
        "priorities": priorities
    }
