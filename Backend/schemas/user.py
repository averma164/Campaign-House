from typing import Optional

from sqlmodel import SQLModel
from pydantic import BaseModel

class UserCreate(SQLModel):
    email: str
    password: str
    role: Optional[str] = "user"
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None
    

class UserLogin(SQLModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str
    role: str
    first_name: Optional[str] = None
    last_name: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    pincode: Optional[str] = None


class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"