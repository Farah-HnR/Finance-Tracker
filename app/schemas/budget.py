import uuid
from datetime import date
from pydantic import BaseModel, field_validator


class BudgetCreate(BaseModel):
    category_id: uuid.UUID
    month: date
    limit_amount: float

    @field_validator("month")
    @classmethod
    def month_must_be_first_day(cls, v: date) -> date:
        if v.day != 1:
            raise ValueError("month must be the first day of the month e.g. 2026-06-01")
        return v

    @field_validator("limit_amount")
    @classmethod
    def limit_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("limit_amount must be greater than zero")
        return v


class BudgetResponse(BaseModel):
    id: uuid.UUID
    category_id: uuid.UUID
    month: date
    limit_amount: float

    model_config = {"from_attributes": True}


class BudgetStatusItem(BaseModel):
    budget_id: uuid.UUID
    category_id: uuid.UUID
    category_name: str
    limit_amount: float
    spent: float
    remaining: float
    percentage_used: float
    status: str


class BudgetStatusResponse(BaseModel):
    month: str
    items: list[BudgetStatusItem]
    total_budget: float
    total_spent: float
    total_remaining: float
