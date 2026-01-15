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

    async def create(self, model: Type[Base], **kwargs) -> Base:
        instance = model(**kwargs)
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
        await self.verify_ownership(model, item_id, user_id)

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
        await self.verify_ownership(model, item_id, user_id)

        await self.session.delete(instance)
        await self.session.commit()

    async def get_by_id(self, model: Type[Base], item_id: int) -> Optional[Base]:
        result = await self.session.execute(select(model).where(model.id == item_id))
        return result.scalars().first()

    async def get_all(self, model: Type[Base], skip: int = 0, limit: int = 100) -> List[Base]:
        result = await self.session.execute(select(model).offset(skip).limit(limit))
        return result.scalars().all()

    async def verify_ownership(self, model: Type[Base], item_id: int, user_id: uuid.UUID):
        query = select(Application).where(Application.creator_id == user_id)
        
        if model == Tag:
            query = query.join(Application.tags).where(Tag.id == item_id)
        elif model == Status:
            query = query.where(Application.status_id == item_id)
        elif model == Priority:
            query = query.where(Application.priority_id == item_id)
        else:
             raise HTTPException(status_code=400, detail="Unknown model type")

        result = await self.session.execute(query)
        app = result.scalars().first()
        
        if not app:
             raise HTTPException(status_code=403, detail=f"You do not own any application using this {model.__name__}")
