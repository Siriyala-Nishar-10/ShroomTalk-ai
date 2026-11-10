from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, ConfigDict, Field

Language = Literal["en", "hi", "kn"]
EMAIL_PATTERN = r"^[^@\s]+@[^@\s]+\.[^@\s]+$"


class RegisterIn(BaseModel):
    email: str = Field(max_length=254, pattern=EMAIL_PATTERN)
    password: str = Field(min_length=8, max_length=128)
    display_name: str | None = Field(default=None, max_length=120)
    preferred_language: Language = "en"


class LoginIn(BaseModel):
    email: str = Field(max_length=254)
    password: str = Field(min_length=1, max_length=128)


class UserOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    email: str


class TokenOut(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserOut


class ProfileIn(BaseModel):
    display_name: str | None = Field(default=None, max_length=120)
    farm_name: str | None = Field(default=None, max_length=160)
    village: str | None = Field(default=None, max_length=120)
    district: str | None = Field(default=None, max_length=120)
    state: str | None = Field(default=None, max_length=120)
    preferred_language: Language = "en"


class ProfileOut(ProfileIn):
    model_config = ConfigDict(from_attributes=True)

    id: UUID
    created_at: datetime


class LoanIn(BaseModel):
    principal: float = Field(gt=0, le=1_000_000_000)
    annual_rate_percent: float = Field(ge=0, le=60)
    tenure_months: int = Field(ge=1, le=600)


class CultivationIn(BaseModel):
    number_of_bags: int = Field(ge=1, le=100_000)
    substrate_cost_per_bag: float = Field(ge=0, le=100_000)
    spawn_cost_per_bag: float = Field(ge=0, le=100_000)
    labour_cost: float = Field(default=0, ge=0, le=1_000_000_000)
    utilities_cost: float = Field(default=0, ge=0, le=1_000_000_000)
    other_costs: float = Field(default=0, ge=0, le=1_000_000_000)
    expected_yield_kg_per_bag: float = Field(gt=0, le=100)
    wastage_percent: float = Field(default=0, ge=0, le=100)
    selling_price_per_kg: float = Field(ge=0, le=100_000)


class BusinessIn(BaseModel):
    monthly_revenue: float = Field(ge=0, le=1_000_000_000)
    monthly_operating_costs: float = Field(ge=0, le=1_000_000_000)
    monthly_loan_emi: float = Field(default=0, ge=0, le=1_000_000_000)
    initial_investment: float = Field(default=0, ge=0, le=1_000_000_000)