from fastapi_users import schemas
import uuid
from pydantic import EmailStr, Field


class UserRead(schemas.BaseUser[uuid.UUID]):
    is_active: bool = Field(default=True, exclude=True)
    is_superuser: bool = Field(default=False, exclude=True)
    is_verified: bool = Field(default=False, exclude=True)

class UserCreate(schemas.CreateUpdateDictModel):
    email: EmailStr
    password: str

class UserUpdate(schemas.CreateUpdateDictModel):
    password: str | None = None
    email: EmailStr | None = None
