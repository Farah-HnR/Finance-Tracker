from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, extract, func, case

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.account import Account
from app.models.transaction import Transaction
from app.models.enums import TransactionType
from app.schemas.report import MonthlySummaryResponse

router = APIRouter(prefix="/reports", tags=["reports"])


@router.get("/monthly-summary", response_model=MonthlySummaryResponse)
async def monthly_summary(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000, le=2100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Total income, total expenses, and net savings for a given month/year."""
    stmt = (
        select(
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.type == TransactionType.income, Transaction.amount),
                        else_=0,
                    )
                ),
                0,
            ).label("total_income"),
            func.coalesce(
                func.sum(
                    case(
                        (Transaction.type == TransactionType.expense, Transaction.amount),
                        else_=0,
                    )
                ),
                0,
            ).label("total_expenses"),
            func.count(Transaction.id).label("transaction_count"),
        )
        .join(Account, Transaction.account_id == Account.id)
        .where(Account.user_id == current_user.id)
        .where(Transaction.deleted_at.is_(None))
        .where(extract("month", Transaction.date) == month)
        .where(extract("year", Transaction.date) == year)
    )

    row = (await db.execute(stmt)).one()

    total_income = float(row.total_income)
    total_expenses = float(row.total_expenses)

    return MonthlySummaryResponse(
        month=f"{year}-{month:02d}",
        total_income=total_income,
        total_expenses=total_expenses,
        net_savings=round(total_income - total_expenses, 2),
        transaction_count=row.transaction_count,
    )
