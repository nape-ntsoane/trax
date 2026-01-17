import asyncio
import random
import sys
import os
import uuid
from datetime import datetime, timedelta

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

        # Realistic Data Lists
        tag_names = ["Remote", "Hybrid", "On-site", "Python", "React", "FastAPI", "Startup", "FAANG", "Visa Sponsored", "Entry Level"]
        priority_names = ["Low", "Medium", "High", "Urgent"]
        status_names = ["Wishlist", "Applied", "Phone Screen", "Technical Interview", "On-site", "Offer", "Rejected", "Withdrawn"]
        folder_names = ["2024 Job Hunt", "Dream Companies", "Backups", "Internships"]
        
        companies = ["TechCorp", "Innovate Ltd", "Future Systems", "WebSolutions", "DataMinds", "CloudNine", "SoftServe", "AlphaBit", "OmegaInc", "CyberNet"]
        roles = ["Backend Developer", "Frontend Engineer", "Full Stack Developer", "DevOps Engineer", "Data Scientist", "Product Manager", "QA Engineer", "UI/UX Designer"]
        locations = ["New York, NY", "San Francisco, CA", "Austin, TX", "Remote", "London, UK", "Berlin, DE"]

        # Create Selects
        tags = []
        for name in tag_names:
            tag = Tag(title=name, color=random.choice(["red", "blue", "green", "yellow", "purple", "orange", "pink", "cyan"]), creator_id=user.id)
            session.add(tag)
            tags.append(tag)
        
        priorities = []
        for name in priority_names:
            priority = Priority(title=name, color=random.choice(["gray", "blue", "orange", "red"]), creator_id=user.id)
            session.add(priority)
            priorities.append(priority)
            
        statuses = []
        for name in status_names:
            status = Status(title=name, color=random.choice(["gray", "blue", "purple", "yellow", "green", "red", "black"]), creator_id=user.id)
            session.add(status)
            statuses.append(status)
            
        await session.commit()
        print("Created tags, priorities, and statuses")

        # Create Folders and Applications
        for i, folder_name in enumerate(folder_names):
            folder = Folder(title=folder_name, creator_id=user.id, position=i)
            session.add(folder)
            await session.commit()
            await session.refresh(folder)
            
            # Create 10-15 applications per folder
            for j in range(random.randint(10, 15)):
                app_tags = random.sample(tags, k=random.randint(1, 4))
                company = random.choice(companies)
                role = random.choice(roles)
                location = random.choice(locations)
                
                created_date = datetime.now() - timedelta(days=random.randint(0, 30))
                closing_date = datetime.now() + timedelta(days=random.randint(10, 60))
                
                status = random.choice(statuses)
                priority = random.choice(priorities)
                
                timeline_data = [
                    {"title": "Application Created", "date": created_date.isoformat(), "description": "Initial application entry created."}
                ]
                if status.title != "Wishlist":
                     timeline_data.append({"title": "Applied", "date": (created_date + timedelta(days=1)).isoformat(), "description": f"Applied via {company} careers page."})
                
                description_text = f"""
We are seeking a talented {role} to join our team at {company}.

Responsibilities:
- Develop and maintain software applications.
- Collaborate with cross-functional teams.
- Write clean, scalable code.

Requirements:
- Experience with Python, SQL, and Cloud platforms.
- Strong problem-solving skills.
- Excellent communication skills.
"""
                
                notes_text = f"Referral from a friend. {location} based position. Good work-life balance."
                
                app = Application(
                    title=role,
                    company=company,
                    folder_id=folder.id,
                    creator_id=user.id,
                    status_id=status.id,
                    priority_id=priority.id,
                    tags=app_tags,
                    closing_date=closing_date,
                    link=f"https://www.{company.lower().replace(' ', '')}.com/careers/{uuid.uuid4()}",
                    timeline=timeline_data,
                    description=description_text.strip(),
                    notes=notes_text,
                    role=role,
                    salary=f"${random.randint(80, 160)}k - ${random.randint(160, 200)}k",
                    position=j,
                    starred=random.choice([True, False]),
                    created_at=created_date,
                    updated_at=datetime.now()
                )
                session.add(app)
            
            await session.commit()
            print(f"Created folder {folder.title} with applications")

if __name__ == "__main__":
    asyncio.run(seed_db())
