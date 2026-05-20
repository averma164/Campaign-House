from sqlmodel import SQLModel, create_engine, Session
from core.config import settings
from models.user import User
from models.campaign import Campaign
from models.category import Category
from models.notification import Notification
from models.history import History

engine = create_engine(
    settings.DATABASE_URL,
    echo = True,
)
def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
