from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base
from fastapi_users_db_sqlalchemy import GUID


class Folder(Base):
    __tablename__ = "folders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    position = Column(Integer, default=0)

    applications = relationship("app.db.models.application.Application", back_populates="folder")

    creator_id = Column(GUID, ForeignKey("users.id"), nullable=False)
    creator = relationship("app.db.models.user.User", back_populates="folders")

    @property
    def count(self):
        return len(self.applications)

    @property
    def counts_per_status(self):
        counts = {}
        for app in self.applications:
            status_title = app.status.title if app.status else "Unassigned"
            counts[status_title] = counts.get(status_title, 0) + 1
        return counts
