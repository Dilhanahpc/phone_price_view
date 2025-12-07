from pydantic import BaseModel, EmailStr
from datetime import datetime
from typing import Optional

class SubscriberBase(BaseModel):
    email: EmailStr
    name: Optional[str] = None

class SubscriberCreate(SubscriberBase):
    pass

class SubscriberResponse(SubscriberBase):
    id: int
    is_active: bool
    created_at: datetime
    
    class Config:
        from_attributes = True
