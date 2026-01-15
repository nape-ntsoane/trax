from typing import AsyncGenerator
from sqlalchemy.ext.asyncio import AsyncSession

from fastapi import Depends, HTTPException, status

from app.core.auth import current_active_user
from app.db.models.user import User
from app.db.session import async_session_maker


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Get a database session."""
    async with async_session_maker() as session:
        yield session


def require_superuser(current_user: User = Depends(current_active_user)) -> User:
    """Check if the current user is a superuser."""

    if not current_user.is_superuser:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="The user doesn't have enough privileges",
        )
    return current_user
