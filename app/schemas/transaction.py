import uuid
from datetime import date
from pydantic import BaseModel, field_validator
from app.models.enums import TransactionType


class TransactionCreate(BaseModel):
    account_id: uuid.UUID
    category_id: uuid.UUID
    amount: float
    type: TransactionType
    date: date
    description: str | None = None

    @field_validator("amount")
    @classmethod
    def amount_must_be_positive(cls, v: float) -> float:
        if v <= 0:
            raise ValueError("amount must be greater than zero")
        return v


class TransactionResponse(BaseModel):
    id: uuid.UUID
    account_id: uuid.UUID
    category_id: uuid.UUID | None
    amount: float
    type: TransactionType
    date: date
    description: str | None

    model_config = {"from_attributes": True}
