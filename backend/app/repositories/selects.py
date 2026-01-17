from typing import List, Optional, Type
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from fastapi import HTTPException
import uuid

from app.db.base import Base
from app.db.models.selects import Tag, Status, Priority
from app.db.models.application import Application

class SelectsRepository:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create(self, model: Type[Base], user_id: uuid.UUID, **kwargs) -> Base:
        instance = model(creator_id=user_id, **kwargs)
        self.session.add(instance)
        try:
            await self.session.commit()
            await self.session.refresh(instance)
        except Exception as e:
            await self.session.rollback()
            raise HTTPException(status_code=400, detail=f"Could not create {model.__name__}: {str(e)}")
        return instance

    async def update(self, model: Type[Base], item_id: int, user_id: uuid.UUID, **kwargs) -> Base:
        instance = await self.get_by_id(model, item_id)
        if not instance:
            raise HTTPException(status_code=404, detail=f"{model.__name__} not found")

        # Verify ownership
        if instance.creator_id != user_id:
            raise HTTPException(status_code=403, detail=f"You do not own this {model.__name__}")

        for key, value in kwargs.items():
            setattr(instance, key, value)
        
        await self.session.commit()
        await self.session.refresh(instance)
        return instance

    async def delete(self, model: Type[Base], item_id: int, user_id: uuid.UUID) -> None:
        instance = await self.get_by_id(model, item_id)
        if not instance:
            raise HTTPException(status_code=404, detail=f"{model.__name__} not found")

        # Verify ownership
        if instance.creator_id != user_id:
            raise HTTPException(status_code=403, detail=f"You do not own this {model.__name__}")

        await self.session.delete(instance)
        await self.session.commit()

    async def get_by_id(self, model: Type[Base], item_id: int) -> Optional[Base]:
        result = await self.session.execute(select(model).where(model.id == item_id))
        return result.scalars().first()

    async def get_all(self, model: Type[Base], user_id: uuid.UUID, skip: int = 0, limit: int = 100) -> List[Base]:
        result = await self.session.execute(select(model).where(model.creator_id == user_id).offset(skip).limit(limit))
        return result.scalars().all()
