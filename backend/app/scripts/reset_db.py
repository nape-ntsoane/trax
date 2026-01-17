import asyncio
import sys
import os

# Add the parent directory to sys.path to allow importing 'app'
sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))

from app.db.session import engine
from app.db.base import Base
from app.scripts.seed_db import seed_db

async def reset_db():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Database reset complete")
    
    await seed_db()

if __name__ == "__main__":
    asyncio.run(reset_db())
