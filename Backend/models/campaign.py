from typing import Optional
from sqlmodel import Relationship, SQLModel, Field
from datetime import datetime, timezone

class Campaign(SQLModel, table=True):
    __tablename__ = "campaign"
    campaign_id: Optional[int] = Field(default=None, primary_key=True)
    name: str
    due_date: datetime | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    description: str | None = None
    status: str = Field(default="active")
    owner_id: int = Field(foreign_key="user.id")
    category_id: Optional[int] = Field(default=None, foreign_key="category.id")
    city: str | None = None
    state: str | None = None
    pincode: str | None = None
    origin_page_url: Optional[str] = Field(default=None, max_length=500)
    poster_image: Optional[str] = Field(default=None, max_length=500)
    owner: Optional["User"] = Relationship(back_populates="campaigns")