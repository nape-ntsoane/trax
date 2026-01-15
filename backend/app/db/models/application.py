from sqlalchemy import Column, Integer, String, DateTime, Boolean, ForeignKey, Table, Text, JSON
from sqlalchemy.orm import relationship
from app.db.base import Base
from fastapi_users_db_sqlalchemy import GUID


# Association table for many-to-many relationship between Application and Tag
application_tags = Table(
    'application_tags',
    Base.metadata,
    Column('application_id', Integer, ForeignKey('applications.id')),
    Column('tag_id', Integer, ForeignKey('tags.id'))
)

class Application(Base):
    __tablename__ = "applications"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    company = Column(String, index=True)
    closing_date = Column(DateTime, nullable=True)
    
    priority_id = Column(Integer, ForeignKey("priorities.id"), nullable=True)
    priority = relationship("app.db.models.selects.Priority")
    
    link = Column(String, nullable=True)
    
    status_id = Column(Integer, ForeignKey("statuses.id"), nullable=True)
    status = relationship("app.db.models.selects.Status")
    
    timeline = Column(JSON, nullable=True)
    
    description = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    role = Column(String, nullable=True)

    tags = relationship("app.db.models.selects.Tag", secondary=application_tags)
    
    salary = Column(String, nullable=True)
    position = Column(Integer, default=0)
    starred = Column(Boolean, default=False)

    folder_id = Column(Integer, ForeignKey("folders.id"), nullable=True)
    folder = relationship("app.db.models.folder.Folder", back_populates="applications")

    creator_id = Column(GUID, ForeignKey("users.id"))
    creator = relationship("app.db.models.user.User", back_populates="applications")
