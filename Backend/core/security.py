import hashlib

from passlib.context import CryptContext
from datetime import datetime, timedelta, timezone
from jose import jwt
from core.config import settings  

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")



def hash_password(password: str):
    pwd = hashlib.sha256(password.encode()).hexdigest()
    return pwd_context.hash(pwd)

def verify_password(plain: str, hashed: str):
    pwd = hashlib.sha256(plain.encode()).hexdigest()
    return pwd_context.verify(pwd, hashed)


def create_access_token(data: dict):
    to_encode = data.copy()
    
    expire = datetime.now(timezone.utc) + timedelta(
        minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES
    )
    
    to_encode.update({"exp": expire})
    
    return jwt.encode(
        to_encode,
        settings.SECRET_KEY,     
        algorithm=settings.ALGORITHM
    )