from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.api.routes.health import router as health_router
from app.core.config import settings

app = FastAPI(
    title="ShroomTalk API",
    description="Backend API for the ShroomTalk rural mushroom micro-entrepreneur assistant.",
    version="0.1.0",
)

# Add your deployed frontend URL to FRONTEND_ORIGINS in backend/.env.
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.frontend_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health_router, prefix="/api/v1")


@app.get("/", tags=["Root"])
def root():
    return {
        "message": "Welcome to ShroomTalk API",
        "docs": "/docs",
        "health": "/api/v1/health",
    }
