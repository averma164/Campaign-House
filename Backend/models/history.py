from datetime import datetime, timezone

from typing import Optional

from sqlmodel import Field, SQLModel


class History(SQLModel, table=True):
    __tablename__ = "history"
    id: Optional[int] = Field(default=None, primary_key=True)
    campaign_id: int = Field(foreign_key="campaign.campaign_id")
    action: str
    changed_by: int = Field(foreign_key="user.id")
    time_stamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))