from fastapi import APIRouter, HTTPException, Request
from app.core.auth import fastapi_users
from app.core.auth import auth_backend
from app.schemas.user import UserRead, UserCreate, UserUpdate

auth_router = APIRouter(
    prefix="",
)

# endpoints included with fastapi users available
auth_router.include_router(fastapi_users.get_auth_router(auth_backend), prefix="/auth/jwt", tags=["auth"])
auth_router.include_router(fastapi_users.get_register_router(UserRead, UserCreate), prefix="/auth", tags=["auth"] )
auth_router.include_router(fastapi_users.get_users_router(UserRead, UserUpdate), prefix="/users", tags=["users"])
# auth_router.include_router(fastapi_users.get_reset_password_router(), prefix="/auth", tags=["auth"])
# auth_router.include_router(fastapi_users.get_verify_router(UserRead), prefix="/auth", tags=["auth"])
