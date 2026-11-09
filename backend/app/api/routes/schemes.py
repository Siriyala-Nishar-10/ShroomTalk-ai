from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.schemas import Language
from app.services.schemes import list_schemes

router = APIRouter(prefix="/schemes", tags=["Schemes"])


@router.get("")
def schemes(
    q: str = Query(default="", max_length=100),
    lang: Language = "en",
    db: Session = Depends(get_db),
):
    return list_schemes(db, lang, q)