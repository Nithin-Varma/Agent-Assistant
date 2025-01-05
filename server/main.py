import logging
from fastapi import Depends, FastAPI
from fastapi.concurrency import asynccontextmanager
from fastapi.middleware.cors import CORSMiddleware

from fastapi_cache import FastAPICache
from fastapi_cache.backends.inmemory import InMemoryBackend

from routers import chat
from routers import email
from routers import voice
from app_settings import settings


logger = logging.getLogger(__name__)

# App definition
app = FastAPI(
    title="Agent-Assistant Backend",
    description="CRUD endpoints for Agent-Assistant Backend"
)

# Adding CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.BACKEND_CORS_ORIGINS,  # You can restrict this to specific origins
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize the cache
    FastAPICache.init(InMemoryBackend())


    # Yield control back to FastAPI
    yield


# Health Check
@app.get("/", tags=["Health"])
def root():
    return {"message": "Welcome to Agent-Assistant Backend"}

# Routers
app.include_router(chat.router)
app.include_router(voice.router)
app.include_router(email.router)
