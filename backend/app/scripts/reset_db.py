import asyncio
from app.db.session import async_engine
from app.db.base import Base
from app.scripts.seed_db import seed_db

async def reset_db():
    async with async_engine.begin() as conn:
        await conn.run_sync(Base.metadata.drop_all)
        await conn.run_sync(Base.metadata.create_all)
    print("Database reset complete")
    
    await seed_db()

if __name__ == "__main__":
    asyncio.run(reset_db())
