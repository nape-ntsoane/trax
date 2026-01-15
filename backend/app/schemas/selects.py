from pydantic import BaseModel
from typing import Optional

class SelectBase(BaseModel):
    title: str

class SelectCreate(SelectBase):
    pass

class SelectUpdate(SelectBase):
    pass

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
