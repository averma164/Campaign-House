from pydantic import BaseModel
from typing import Generic, TypeVar, Optional

T = TypeVar("T")

class Response(BaseModel, Generic[T]):
    data: T

class PaginatedResponse(BaseModel, Generic[T]):
    data: T
    next: Optional[str]