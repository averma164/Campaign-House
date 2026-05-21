from datetime import datetime
from typing import Optional

from sqlmodel import SQLModel


class NotificationRead(SQLModel):
    id: int
    user_id: int
    campaign_id: Optional[int] = None
    message: str
    is_read: bool
    created_at: datetime
