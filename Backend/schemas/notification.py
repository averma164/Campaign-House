import datetime

from sqlmodel import SQLModel


class NotificationRead(SQLModel):
    id: int
    user_id: int
    message: str
    is_read: bool
    created_at: datetime