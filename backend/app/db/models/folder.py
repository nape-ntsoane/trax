from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from app.db.base import Base


class Folder(Base):
    __tablename__ = "folders"

    id = Column(Integer, primary_key=True, index=True)
    title = Column(String, index=True)
    position = Column(Integer, default=0)

    applications = relationship("app.db.models.application.Application", back_populates="folder")

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
