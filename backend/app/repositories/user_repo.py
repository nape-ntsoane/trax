from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.user import User
from sqlalchemy import select

class UserRepo:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def get_by_email(self, email: str):
        result = await self.session.execute(select(User).where(User.email == email))
        return result.scalar_one_or_none()

    async def create(self, user: User):
        self.session.add(user)
        await self.session.flush()  # don't commit here
        return user
