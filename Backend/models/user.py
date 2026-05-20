from typing import List, Optional
# from models.campaign import Campaign    
from sqlmodel import Relationship, SQLModel, Field
from datetime import datetime, timezone

class User(SQLModel, table=True):
    __tablename__ = "user"  
    id: Optional[int] = Field(default=None, primary_key=True)
    email: str
    hashed_password: str
    role: str = Field(default="user")
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    campaigns: List["Campaign"] = Relationship(back_populates="owner")
