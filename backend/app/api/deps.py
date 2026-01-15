from typing import Type

from fastapi import Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.auth import current_active_user
from app.db.models.user import User
from app.db.session import get_async_session


def require_superuser(current_user: User = Depends(current_active_user)) -> User:
    """Check if the current user is a superuser."""

    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user


def require_owner(*, model: Type, owner_field: str = "creator_id"):
    async def _require_owner(
        resource_id: int,
        session: AsyncSession = Depends(get_async_session),
        current_user: User = Depends(current_active_user),
    ):
        obj = await session.get(model, resource_id)

        if not obj:
            raise HTTPException(status_code=404, detail="Resource not found")

        # grant modification privileges if the user is a superuser
        if current_user.is_superuser:
            return obj

        if getattr(obj, owner_field) != current_user.id:
            raise HTTPException(status_code=403, detail="You cannot update/delete this resource")

        return obj

    return _require_owner
