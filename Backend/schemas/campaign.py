from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel

class CampaignCreate(SQLModel):
    name: str
    due_date: datetime | None = None
    description: Optional[str] | None = None
    status: Optional[str] = "active"