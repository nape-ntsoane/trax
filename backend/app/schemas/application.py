from pydantic import BaseModel
from typing import Optional, List, Dict, Any
from datetime import datetime
from app.schemas.selects import TagRead, StatusRead, PriorityRead

class ApplicationBase(BaseModel):
    title: str
    company: str
    closing_date: Optional[datetime] = None
    priority_id: Optional[int] = None
    link: Optional[str] = None
    status_id: Optional[int] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    role: Optional[str] = None
    salary: Optional[str] = None
    position: Optional[int] = 0
    starred: Optional[bool] = False
    folder_id: Optional[int] = None

class ApplicationCreate(ApplicationBase):
    tag_ids: Optional[List[int]] = []

class ApplicationUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    closing_date: Optional[datetime] = None
    priority_id: Optional[int] = None
    link: Optional[str] = None
    status_id: Optional[int] = None
    timeline: Optional[List[Dict[str, Any]]] = None
    description: Optional[str] = None
    notes: Optional[str] = None
    role: Optional[str] = None
    salary: Optional[str] = None
    position: Optional[int] = None
    starred: Optional[bool] = None
    folder_id: Optional[int] = None
    tag_ids: Optional[List[int]] = None

class ApplicationRead(ApplicationBase):
    id: int
    tags: List[TagRead] = []
    status: Optional[StatusRead] = None
    priority: Optional[PriorityRead] = None
    
    class Config:
        from_attributes = True

class ApplicationReadBrief(BaseModel):
    id: int
    title: str
    company: str
    status: Optional[StatusRead] = None
    priority: Optional[PriorityRead] = None
    closing_date: Optional[datetime] = None

    class Config:
        from_attributes = True
