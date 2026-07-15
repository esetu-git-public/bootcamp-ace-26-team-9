from pydantic import BaseModel
from datetime import datetime


class UserSessionCreate(BaseModel):
    session_token: str


class UserSessionResponse(BaseModel):
    id: int
    user_id: str
    session_token: str
    login_time: datetime
    last_activity: datetime
    is_active: bool

    class Config:
        from_attributes = True
