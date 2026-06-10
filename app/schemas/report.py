from pydantic import BaseModel


class MonthlySummaryResponse(BaseModel):
    month: str
    total_income: float
    total_expenses: float
    net_savings: float
    transaction_count: int
