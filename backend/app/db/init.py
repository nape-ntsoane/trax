from app.db.session import engine
from app.db.base import Base


# database & table creation
async def create_db_and_tables():
    # start the engine
    async with engine.begin() as conn:
        # finds all DeclarativeBase children and create them in the db
        await conn.run_sync(Base.metadata.create_all)