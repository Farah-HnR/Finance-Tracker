import uuid
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, extract, func, case
from sqlalchemy.orm import aliased

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.budget import Budget
from app.models.category import Category
from app.models.transaction import Transaction
from app.models.enums import TransactionType
from app.schemas.budget import BudgetCreate, BudgetResponse, BudgetStatusItem, BudgetStatusResponse

router = APIRouter(prefix="/budgets", tags=["budgets"])


@router.post("", response_model=BudgetResponse, status_code=status.HTTP_201_CREATED)
async def create_budget(
    payload: BudgetCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Set a monthly spending limit for a category."""
    category = await db.scalar(
        select(Category).where(Category.id == payload.category_id, Category.user_id == current_user.id)
    )
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")

    existing = await db.scalar(
        select(Budget).where(
            Budget.user_id == current_user.id,
            Budget.category_id == payload.category_id,
            Budget.month == payload.month,
        )
    )
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Budget already exists for this category and month")

    budget = Budget(**payload.model_dump(), user_id=current_user.id)
    db.add(budget)
    await db.commit()
    await db.refresh(budget)
    return budget


@router.get("", response_model=list[BudgetResponse])
async def list_budgets(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000, le=2100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List all budgets, optionally filtered by month and year."""
    stmt = select(Budget).where(Budget.user_id == current_user.id)

    if month is not None:
        stmt = stmt.where(extract("month", Budget.month) == month)
    if year is not None:
        stmt = stmt.where(extract("year", Budget.month) == year)

    result = await db.execute(stmt)
    return result.scalars().all()


@router.get("/status", response_model=BudgetStatusResponse)
async def budget_status(
    month: int = Query(..., ge=1, le=12),
    year: int = Query(..., ge=2000, le=2100),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """
    Returns spending vs limit for every budget set in the given month.
    Includes amount spent, remaining, percentage used, and a status flag.
    """
    stmt = (
        select(
            Budget.id.label("budget_id"),
            Budget.category_id,
            Budget.limit_amount,
            Category.name.label("category_name"),
            func.coalesce(
                func.sum(
                    case(
                        (
                            (Transaction.type == TransactionType.expense) &
                            Transaction.deleted_at.is_(None),
                            Transaction.amount,
                        ),
                        else_=0,
                    )
                ),
                0,
            ).label("spent"),
        )
        .join(Category, Budget.category_id == Category.id)
        .outerjoin(
            Transaction,
            (Transaction.category_id == Budget.category_id)
            & (extract("month", Transaction.date) == month)
            & (extract("year", Transaction.date) == year)
            & Transaction.deleted_at.is_(None),
        )
        .where(
            Budget.user_id == current_user.id,
            extract("month", Budget.month) == month,
            extract("year", Budget.month) == year,
        )
        .group_by(Budget.id, Budget.category_id, Budget.limit_amount, Category.name)
    )

    rows = (await db.execute(stmt)).all()

    items = []
    for row in rows:
        spent = float(row.spent)
        limit = float(row.limit_amount)
        remaining = max(limit - spent, 0)
        pct = round((spent / limit) * 100, 1) if limit > 0 else 0.0

        if pct >= 100:
            flag = "exceeded"
        elif pct >= 80:
            flag = "warning"
        else:
            flag = "on_track"

        items.append(BudgetStatusItem(
            budget_id=row.budget_id,
            category_id=row.category_id,
            category_name=row.category_name,
            limit_amount=limit,
            spent=spent,
            remaining=remaining,
            percentage_used=pct,
            status=flag,
        ))

    total_budget = sum(i.limit_amount for i in items)
    total_spent = sum(i.spent for i in items)

    return BudgetStatusResponse(
        month=f"{year}-{month:02d}",
        items=items,
        total_budget=total_budget,
        total_spent=total_spent,
        total_remaining=max(total_budget - total_spent, 0),
    )


@router.delete("/{budget_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_budget(
    budget_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Remove a monthly budget limit."""
    budget = await db.scalar(
        select(Budget).where(Budget.id == budget_id, Budget.user_id == current_user.id)
    )
    if not budget:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Budget not found")

    await db.delete(budget)
    await db.commit()
