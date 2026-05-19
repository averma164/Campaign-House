from sqlmodel import Column, SQLModel, Field, String
from datetime import datetime, timezone

class Campaign(SQLModel, table=True):
    campaign_id: int = Field(default=None, primary_key=True)
    name: str
    due_date: datetime | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    description: str | None = None
    status: str = Column(String, default="active")
