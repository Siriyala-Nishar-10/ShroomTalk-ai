import logging
from datetime import datetime, timedelta, timezone

from fastapi import APIRouter, Depends
from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_optional_user
from app.db.models import ChatMessage, ChatSession
from app.db.session import SessionLocal, get_db
from app.db.user import User
from app.schemas import Language
from app.services.rag import answer_question

logger = logging.getLogger("shroomtalk")

router = APIRouter(prefix="/chat", tags=["Chat"])


class ChatIn(BaseModel):
    model_config = ConfigDict(str_strip_whitespace=True)

    message: str = Field(min_length=1, max_length=1000)
    language: Language = "en"


def _save_exchange(user: User | None, message: str, language: str, reply: dict) -> bool:
    """Save the question and answer for a signed-in user. Never blocks the answer."""
    if user is None or SessionLocal is None:
        return False

    try:
        with SessionLocal() as db:
            session = db.scalar(
                select(ChatSession)
                .where(ChatSession.profile_id == user.id)
                .order_by(ChatSession.created_at.desc())
                .limit(1)
            )
            if session is None:
                session = ChatSession(
                    profile_id=user.id,
                    title="Assistant",
                    language_code=language,
                )
                db.add(session)
                db.flush()

            now = datetime.now(timezone.utc)
            db.add(
                ChatMessage(
                    session_id=session.id,
                    role="user",
                    content=message,
                    sources=[],
                    created_at=now,
                )
            )
            db.add(
                ChatMessage(
                    session_id=session.id,
                    role="assistant",
                    content=reply["answer"],
                    sources=reply["sources"],
                    created_at=now + timedelta(milliseconds=1),
                )
            )
            db.commit()
        return True
    except Exception:
        logger.exception("Could not save chat messages")
        return False


@router.post("")
def chat(
    body: ChatIn,
    user: User | None = Depends(get_optional_user),
    db: Session = Depends(get_db),
):
    reply = answer_question(db, body.message, body.language)
    saved = _save_exchange(user, body.message, body.language, reply)
    return {**reply, "saved": saved}


@router.get("/history")
def history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = list(
        db.scalars(
            select(ChatMessage)
            .join(ChatSession, ChatMessage.session_id == ChatSession.id)
            .where(ChatSession.profile_id == user.id)
            .order_by(ChatMessage.created_at.desc())
            .limit(50)
        ).all()
    )
    rows.reverse()

    result = []
    for row in rows:
        stored = row.sources or []
        mode = None
        if row.role == "assistant":
            mode = stored[0].get("mode") if stored else "no_match"

        result.append(
            {
                "id": str(row.id),
                "role": row.role,
                "content": row.content,
                "mode": mode,
                "sources": [
                    {key: value for key, value in source.items() if key != "mode"}
                    for source in stored
                ],
                "created_at": row.created_at,
            }
        )

    return result