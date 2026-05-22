import os
from dotenv import load_dotenv

load_dotenv()

class Settings:
    PROJECT_NAME: str = "Campaign House API"

    DATABASE_URL: str = os.getenv("DATABASE_URL", "")

    SECRET_KEY: str = os.getenv("SECRET_KEY", "supersecretkey")
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    def __init__(self) -> None:
        if not self.DATABASE_URL:
            raise RuntimeError(
                "DATABASE_URL is not set. Define it in Backend/.env "
                "(see .env.example for the expected format)."
            )


settings = Settings()
