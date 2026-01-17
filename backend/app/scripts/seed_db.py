import asyncio
import random
import sys
import os
import uuid

# Add the parent directory to sys.path to allow importing 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from sqlalchemy.ext.asyncio import AsyncSession
from app.db.session import async_session_maker
from app.db.models.user import User
from app.db.models.folder import Folder
from app.db.models.application import Application
from app.db.models.selects import Tag, Priority, Status
from app.core.auth import get_password_hash

async def seed_db():
    async with async_session_maker() as session:
        # Create User
        user = User(
            email="user@example.com",
            hashed_password=get_password_hash("pass"),
            is_active=True,
            is_superuser=False,
            is_verified=True,
            id=uuid.uuid4()
        )
        session.add(user)
        await session.commit()
        await session.refresh(user)
        print(f"Created user: {user.email}")

        # Create Selects
        tags = []
        for i in range(10):
            tag = Tag(title=f"Tag {i+1}", color=random.choice(["red", "blue", "green", "yellow", "purple"]), creator_id=user.id)
            session.add(tag)
            tags.append(tag)
        
        priorities = []
        for i in range(4):
            priority = Priority(title=f"Priority {i+1}", color=random.choice(["red", "blue", "green", "yellow", "purple"]), creator_id=user.id)
            session.add(priority)
            priorities.append(priority)
            
        statuses = []
        for i in range(4):
            status = Status(title=f"Status {i+1}", color=random.choice(["red", "blue", "green", "yellow", "purple"]), creator_id=user.id)
            session.add(status)
            statuses.append(status)
            
        await session.commit()
        print("Created tags, priorities, and statuses")

        # Create Folders and Applications
        for i in range(25):
            folder = Folder(title=f"Folder {i+1}", creator_id=user.id)
            session.add(folder)
            await session.commit()
            await session.refresh(folder)
            
            for j in range(25):
                app_tags = random.sample(tags, k=random.randint(0, 3))
                app = Application(
                    title=f"Application {j+1} in {folder.title}",
                    company=f"Company {j+1}",
                    folder_id=folder.id,
                    creator_id=user.id,
                    status_id=random.choice(statuses).id,
                    priority_id=random.choice(priorities).id,
                    tags=app_tags
                )
                session.add(app)
            
            await session.commit()
            print(f"Created folder {folder.title} with 25 applications")

if __name__ == "__main__":
    asyncio.run(seed_db())
