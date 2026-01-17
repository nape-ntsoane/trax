from pydantic import BaseModel
from typing import Optional

class SelectBase(BaseModel):
    title: str
    color: Optional[str] = None

class SelectCreate(SelectBase):
    pass

class SelectUpdate(SelectBase):
    title: Optional[str] = None
    color: Optional[str] = None

class SelectRead(SelectBase):
    id: int
    
    class Config:
        from_attributes = True

class TagCreate(SelectCreate): pass
class TagUpdate(SelectUpdate): pass
class TagRead(SelectRead): pass

class StatusCreate(SelectCreate): pass
class StatusUpdate(SelectUpdate): pass
class StatusRead(SelectRead): pass

class PriorityCreate(SelectCreate): pass
class PriorityUpdate(SelectUpdate): pass
class PriorityRead(SelectRead): pass
