from pydantic import BaseModel
from typing import Optional, List
from app.schemas.application import ApplicationRead, ApplicationReadBrief

class FolderBase(BaseModel):
    title: str
    position: Optional[int] = 0

class FolderCreate(FolderBase):
    pass

class FolderUpdate(BaseModel):
    title: Optional[str] = None
    position: Optional[int] = None

class FolderRead(FolderBase):
    id: int
    
    class Config:
        from_attributes = True

class FolderWithRecentApplications(BaseModel):
    folder: Optional[FolderRead] # Optional for unfiled
    recent_applications: List[ApplicationRead]
    application_count: int
