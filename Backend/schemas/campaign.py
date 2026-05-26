from datetime import datetime
from typing import Optional
from sqlmodel import SQLModel

class CampaignCreate(SQLModel):
    name: str
    due_date: datetime | None = None
    description: Optional[str] | None = None
    status: Optional[str] = "active"
    category_id: int | None = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    origin_page_url: Optional[str] = None
    poster_image: Optional[str] = None
    
class CampaignUpdate(SQLModel):
    name: Optional[str] = None
    due_date: Optional[datetime] = None
    description: Optional[str] = None
    category_id: Optional[int] = None
    origin_page_url: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    poster_image: Optional[str] = None

class CampaignRead(SQLModel):
    campaign_id: int
    name: str
    description: Optional[str] = None
    status: str
    due_date: Optional[datetime] = None
    created_at: datetime
    owner_id: int
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    category_id: int | None = None
    origin_page_url: Optional[str] = None
    poster_image: Optional[str] = None