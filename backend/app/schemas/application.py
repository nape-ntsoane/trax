from pydantic import BaseModel, field_validator
from typing import Optional, List, Dict, Any
from datetime import datetime, date
from app.schemas.selects import TagRead, StatusRead, PriorityRead

class ApplicationBase(BaseModel):
    title: str
    company: str
    closing_date: Optional[date] = None
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

    @field_validator('closing_date', mode='before')
    @classmethod
    def parse_closing_date(cls, v: Any) -> Optional[date]:
        if v is None or v == "":
            return None
        if isinstance(v, date) and not isinstance(v, datetime):
            return v
        if isinstance(v, datetime):
            return v.date()
        if isinstance(v, str):
            v = v.strip()
            # Try parsing ISO format first (which handles YYYY-MM-DD)
            try:
                return date.fromisoformat(v)
            except ValueError:
                pass
            
            # Try parsing datetime strings and extract date
            try:
                return datetime.fromisoformat(v.replace('Z', '+00:00')).date()
            except ValueError:
                pass

            formats = [
                "%Y-%m-%d",
                "%Y/%m/%d",
                "%d-%m-%Y",
                "%d/%m/%Y",
                "%m-%d-%Y",
                "%m/%d/%Y",
                "%Y-%m-%dT%H:%M:%S",
                "%Y-%m-%d %H:%M:%S"
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(v, fmt).date()
                except ValueError:
                    continue
        return v

class ApplicationCreate(ApplicationBase):
    tag_ids: Optional[List[int]] = []

class ApplicationUpdate(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    closing_date: Optional[date] = None
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

    @field_validator('closing_date', mode='before')
    @classmethod
    def parse_closing_date(cls, v: Any) -> Optional[date]:
        if v is None or v == "":
            return None
        if isinstance(v, date) and not isinstance(v, datetime):
            return v
        if isinstance(v, datetime):
            return v.date()
        if isinstance(v, str):
            v = v.strip()
            try:
                return date.fromisoformat(v)
            except ValueError:
                pass
            
            try:
                return datetime.fromisoformat(v.replace('Z', '+00:00')).date()
            except ValueError:
                pass

            formats = [
                "%Y-%m-%d",
                "%Y/%m/%d",
                "%d-%m-%Y",
                "%d/%m/%Y",
                "%m-%d-%Y",
                "%m/%d/%Y",
                "%Y-%m-%dT%H:%M:%S",
                "%Y-%m-%d %H:%M:%S"
            ]
            
            for fmt in formats:
                try:
                    return datetime.strptime(v, fmt).date()
                except ValueError:
                    continue
        return v

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
    closing_date: Optional[date] = None

    class Config:
        from_attributes = True
