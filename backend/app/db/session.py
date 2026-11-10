import logging
from collections.abc import Generator

from fastapi import HTTPException, status
from sqlalchemy import create_engine, text
from sqlalchemy.orm import Session, sessionmaker

from app.core.config import settings
from app.db.base import Base

logger = logging.getLogger("shroomtalk")


def _normalize_database_url(database_url: str) -> str:
    database_url = database_url.strip()

    if database_url.startswith("postgres://"):
        return "postgresql+psycopg://" + database_url[len("postgres://") :]

    if database_url.startswith("postgresql://"):
        return "postgresql+psycopg://" + database_url[len("postgresql://") :]

    return database_url


_database_url = _normalize_database_url(settings.database_url)

engine = (
    create_engine(
        _database_url,
        pool_pre_ping=True,
        connect_args={"prepare_threshold": None},
    )
    if _database_url
    else None
)

SessionLocal = (
    sessionmaker(
        bind=engine,
        autoflush=False,
        autocommit=False,
        expire_on_commit=False,
    )
    if engine is not None
    else None
)


def init_db() -> bool:
    """Create the vector extension (if allowed) and all tables."""
    if engine is None:
        return False

    # Import models so they are registered on Base.metadata.
    from app.db import models, user  # noqa: F401

    try:
        with engine.begin() as connection:
            connection.execute(text("CREATE EXTENSION IF NOT EXISTS vector"))
    except Exception:
        logger.exception("Could not create the vector extension (it may already exist)")

    Base.metadata.create_all(bind=engine)
    return True


def get_db() -> Generator[Session, None, None]:
    if SessionLocal is None:
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="PostgreSQL is not configured. Set DATABASE_URL in backend/.env.",
        )

    db = SessionLocal()

    try:
        yield db
    finally:
        db.close()