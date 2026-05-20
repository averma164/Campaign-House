import datetime

from sqlmodel import SQLModel


class HistoryRead(SQLModel):
    id: int
    campaign_id: int
    action: str
    changed_by: int
    time_stamp: datetime