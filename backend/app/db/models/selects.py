from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from fastapi_users_db_sqlalchemy import GUID


class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    color = Column(String, nullable=True)
    
    creator_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    creator = relationship("app.db.models.user.User")

class Status(Base):
    __tablename__ = "statuses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    color = Column(String, nullable=True)

    creator_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    creator = relationship("app.db.models.user.User")

class Priority(Base):
    __tablename__ = "priorities"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
    color = Column(String, nullable=True)

    creator_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    creator = relationship("app.db.models.user.User")
