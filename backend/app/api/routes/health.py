from fastapi import APIRouter
from sqlalchemy import text

from app.core.config import settings
from app.db.session import engine

router = APIRouter(tags=["Health"])


@router.get("/health")
def health_check():
    if engine is None:
        database_status = "not_configured"
        overall_status = "setup_required"
    else:
        try:
            with engine.connect() as connection:
                connection.execute(text("SELECT 1"))

            database_status = "connected"
            overall_status = "healthy"
        except Exception:
            database_status = "unavailable"
            overall_status = "degraded"

    return {
        "status": overall_status,
        "service": settings.app_name,
        "version": "0.2.0",
        "database": database_status,
    }