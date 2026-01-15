from fastapi_users.db import SQLAlchemyUserDatabase, SQLAlchemyBaseUserTableUUID
from app.db.base import Base
from sqlalchemy.orm import relationship


class User(SQLAlchemyBaseUserTableUUID, Base):
    __tablename__ = "users"

    applications = relationship("app.db.models.application.Application", back_populates="creator")
    folders = relationship("app.db.models.folder.Folder", back_populates="creator")
