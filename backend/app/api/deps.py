from uuid import UUID

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer

from app.db.session import SessionLocal
from app.db.user import User
from app.security import decode_access_token

bearer_scheme = HTTPBearer(auto_error=False)


def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
) -> User | None:
    if credentials is None or SessionLocal is None:
        return None

    subject = decode_access_token(credentials.credentials)
    if subject is None:
        return None

    try:
        user_id = UUID(subject)
    except ValueError:
        return None

    try:
        with SessionLocal() as db:
            return db.get(User, user_id)
    except Exception:
        return None


def get_current_user(user: User | None = Depends(get_optional_user)) -> User:
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Please sign in again.",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return user