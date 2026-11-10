import pytest
from pydantic import ValidationError

from app.schemas import LoanIn, RegisterIn
from app.security import (
    create_access_token,
    decode_access_token,
    hash_password,
    verify_password,
)


def test_password_roundtrip():
    stored = hash_password("correct horse 123")
    assert verify_password("correct horse 123", stored)
    assert not verify_password("wrong password", stored)


def test_token_roundtrip():
    token = create_access_token("user-123")
    assert decode_access_token(token) == "user-123"
    assert decode_access_token("not-a-token") is None


def test_register_validation():
    with pytest.raises(ValidationError):
        RegisterIn(email="not-an-email", password="longenough1")
    with pytest.raises(ValidationError):
        RegisterIn(email="a@b.com", password="short")
    assert RegisterIn(email="a@b.com", password="longenough1").preferred_language == "en"


def test_loan_validation():
    with pytest.raises(ValidationError):
        LoanIn(principal=0, annual_rate_percent=10, tenure_months=12)
    assert LoanIn(principal=1000, annual_rate_percent=10, tenure_months=12).tenure_months == 12