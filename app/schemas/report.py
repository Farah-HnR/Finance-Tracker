import uuid
from pydantic import BaseModel


class MonthlySummaryResponse(BaseModel):
    month: str
    total_income: float
    total_expenses: float
    net_savings: float
    transaction_count: int


class CategoryBreakdownItem(BaseModel):
    category_id: uuid.UUID
    category_name: str
    colour: str
    total: float
    percentage: float


class CategoryBreakdownResponse(BaseModel):
    month: str
    total_expenses: float
    items: list[CategoryBreakdownItem]
