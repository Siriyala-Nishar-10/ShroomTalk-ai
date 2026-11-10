import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.auth import router as auth_router
from app.api.routes.calculators import router as calculators_router
from app.api.routes.chat import router as chat_router
from app.api.routes.health import router as health_router
from app.api.routes.profile import router as profile_router
from app.api.routes.schemes import router as schemes_router
from app.core.config import settings
from app.db.session import SessionLocal, init_db
from app.services.rag import embed_missing, gemini_enabled
from app.services.schemes import seed_schemes

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger("shroomtalk")


@asynccontextmanager
async def lifespan(_: FastAPI):
    try:
        if init_db() and SessionLocal is not None:
            with SessionLocal() as db:
                seed_schemes(db)
                if gemini_enabled():
                    count = embed_missing(db)
                    logger.info("Embedded %d scheme documents", count)
                else:
                    logger.info("No GEMINI_API_KEY set: assistant will show scheme excerpts only")
    except Exception:
        logger.exception("Startup database setup failed")
    yield


app = FastAPI(
    title=settings.app_name,
    description=(
        "Backend API for mushroom-growing entrepreneurs, "
        "financial tools, and scheme information."
    ),
    version="0.5.0",
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")
app.include_router(auth_router, prefix="/api/v1")
app.include_router(profile_router, prefix="/api/v1")
app.include_router(schemes_router, prefix="/api/v1")
app.include_router(calculators_router, prefix="/api/v1")
app.include_router(chat_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to ShroomTalk-AI API",
        "docs": "/docs",
        "health": "/api/v1/health",
    }