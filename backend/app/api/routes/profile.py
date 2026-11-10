from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.models import Profile
from app.db.session import get_db
from app.db.user import User
from app.schemas import ProfileIn, ProfileOut

router = APIRouter(prefix="/profile", tags=["Profile"])


def _get_or_create(db: Session, user: User) -> Profile:
    profile = db.get(Profile, user.id)
    if profile is None:
        profile = Profile(id=user.id, preferred_language="en")
        db.add(profile)
        db.commit()
        db.refresh(profile)
    return profile


@router.get("", response_model=ProfileOut)
def read_profile(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    return _get_or_create(db, user)


@router.put("", response_model=ProfileOut)
def update_profile(
    body: ProfileIn,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    profile = _get_or_create(db, user)

    for field, value in body.model_dump().items():
        setattr(profile, field, value)

    db.commit()
    db.refresh(profile)
    return profile