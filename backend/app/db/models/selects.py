from sqlalchemy import Column, Integer, String
from app.db.base import Base


class Tag(Base):
    __tablename__ = "tags"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)

class Status(Base):
    __tablename__ = "statuses"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)

class Priority(Base):
    __tablename__ = "priorities"
    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, unique=True, index=True)
