from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, extract, func, case

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.account import Account
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.enums import TransactionType
from app.schemas.report import MonthlySummaryResponse, CategoryBreakdownItem, CategoryBreakdownResponse

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


@router.get("/category-breakdown", response_model=CategoryBreakdownResponse)
async def category_breakdown(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000, le=2100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Expense spending grouped by category for a given month — use for charts."""
    stmt = (
        select(
            Category.id.label("category_id"),
            Category.name.label("category_name"),
            Category.colour.label("colour"),
            func.coalesce(func.sum(Transaction.amount), 0).label("total"),
        )
        .join(Transaction, Transaction.category_id == Category.id)
        .join(Account, Transaction.account_id == Account.id)
        .where(Account.user_id == current_user.id)
        .where(Category.user_id == current_user.id)
        .where(Transaction.type == TransactionType.expense)
        .where(Transaction.deleted_at.is_(None))
        .where(extract("month", Transaction.date) == month)
        .where(extract("year", Transaction.date) == year)
        .group_by(Category.id, Category.name, Category.colour)
        .order_by(func.sum(Transaction.amount).desc())
    )

    rows = (await db.execute(stmt)).all()

    total_expenses = sum(float(r.total) for r in rows)

    items = [
        CategoryBreakdownItem(
            category_id=r.category_id,
            category_name=r.category_name,
            colour=r.colour,
            total=round(float(r.total), 2),
            percentage=round((float(r.total) / total_expenses) * 100, 1) if total_expenses > 0 else 0.0,
        )
        for r in rows
    ]

    return CategoryBreakdownResponse(
        month=f"{year}-{month:02d}",
        total_expenses=round(total_expenses, 2),
        items=items,
    )
