from sqlmodel import SQLModel
from pydantic import BaseModel

class UserCreate(SQLModel):
    email: str
    password: str

class UserLogin(SQLModel):
    email: str
    password: str

class UserResponse(BaseModel):
    id: int
    email: str

class Token(SQLModel):
    access_token: str
    token_type: str = "bearer"