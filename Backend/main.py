from fastapi import FastAPI
from contextlib import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware
from db.database import create_db_and_tables
from api.routes import campaign, auth


@asynccontextmanager
async def lifespan(app: FastAPI):
    create_db_and_tables()
    yield


app = FastAPI(lifespan=lifespan)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(campaign.router, prefix="/campaigns", tags=["Campaigns"])
app.include_router(auth.router, tags=["Auth"])


@app.get("/")
async def root():
    return {"message": "Hello World"}