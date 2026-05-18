from datetime import datetime
from sqlmodel import SQLModel

class CampaignCreate(SQLModel):
    name: str
    due_date: datetime | None = None