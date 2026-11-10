import logging

from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.api.deps import get_current_user, get_optional_user
from app.db.models import CalculationRecord
from app.db.session import SessionLocal, get_db
from app.db.user import User
from app.schemas import BusinessIn, CultivationIn, LoanIn
from app.services.finance import calculate_business, calculate_cultivation, calculate_loan

logger = logging.getLogger("shroomtalk")

router = APIRouter(prefix="/calculations", tags=["Calculators"])


def _save(user: User | None, kind: str, inputs: dict, result: dict) -> bool:
    """Save a calculation for a signed-in user. Never blocks the calculation itself."""
    if user is None or SessionLocal is None:
        return False

    try:
        with SessionLocal() as db:
            db.add(
                CalculationRecord(
                    profile_id=user.id,
                    calculation_type=kind,
                    input_data=inputs,
                    result_data=result,
                )
            )
            db.commit()
        return True
    except Exception:
        logger.exception("Could not save calculation")
        return False


@router.post("/loan")
def loan(body: LoanIn, user: User | None = Depends(get_optional_user)):
    inputs = body.model_dump()
    result = calculate_loan(**inputs)
    return {"result": result, "saved": _save(user, "loan", inputs, result)}


@router.post("/cultivation")
def cultivation(body: CultivationIn, user: User | None = Depends(get_optional_user)):
    inputs = body.model_dump()
    result = calculate_cultivation(**inputs)
    return {"result": result, "saved": _save(user, "cultivation", inputs, result)}


@router.post("/business")
def business(body: BusinessIn, user: User | None = Depends(get_optional_user)):
    inputs = body.model_dump()
    result = calculate_business(**inputs)
    return {"result": result, "saved": _save(user, "business", inputs, result)}


@router.get("/history")
def history(user: User = Depends(get_current_user), db: Session = Depends(get_db)):
    rows = db.scalars(
        select(CalculationRecord)
        .where(CalculationRecord.profile_id == user.id)
        .order_by(CalculationRecord.created_at.desc())
        .limit(20)
    ).all()

    return [
        {
            "id": str(row.id),
            "type": row.calculation_type,
            "input": row.input_data,
            "result": row.result_data,
            "created_at": row.created_at,
        }
        for row in rows
    ]