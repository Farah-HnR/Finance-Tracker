import uuid
from math import ceil
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, extract, func

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.account import Account
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse, PaginatedTransactions

router = APIRouter(prefix="/transactions", tags=["transactions"])


async def _get_user_account(account_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession) -> Account:
    account = await db.scalar(
        select(Account).where(Account.id == account_id, Account.user_id == user_id)
    )
    if not account:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Account not found")
    return account


async def _get_user_category(category_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession) -> Category:
    category = await db.scalar(
        select(Category).where(Category.id == category_id, Category.user_id == user_id)
    )
    if not category:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Category not found")
    return category


async def _get_transaction_with_ownership(
    transaction_id: uuid.UUID, user_id: uuid.UUID, db: AsyncSession
) -> Transaction:
    transaction = await db.scalar(
        select(Transaction).where(Transaction.id == transaction_id)
    )
    if not transaction:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Transaction not found")

    account = await db.scalar(select(Account).where(Account.id == transaction.account_id))
    if account.user_id != user_id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="You do not have permission to modify this transaction")

    return transaction


def _base_stmt(user_id: uuid.UUID):
    return (
        select(Transaction)
        .join(Account, Transaction.account_id == Account.id)
        .where(Account.user_id == user_id)
        .where(Transaction.deleted_at.is_(None))
    )


@router.post("", response_model=TransactionResponse, status_code=status.HTTP_201_CREATED)
async def create_transaction(
    payload: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    await _get_user_account(payload.account_id, current_user.id, db)
    await _get_user_category(payload.category_id, current_user.id, db)

    transaction = Transaction(**payload.model_dump())
    db.add(transaction)
    await db.commit()
    await db.refresh(transaction)
    return transaction


@router.get("", response_model=PaginatedTransactions)
async def list_transactions(
    page: int = Query(1, ge=1),
    page_size: int = Query(20, ge=1, le=100),
    sort: str = Query("desc", pattern="^(asc|desc)$"),
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000, le=2100),
    category_id: uuid.UUID | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = _base_stmt(current_user.id)

    if month is not None:
        stmt = stmt.where(extract("month", Transaction.date) == month)
    if year is not None:
        stmt = stmt.where(extract("year", Transaction.date) == year)
    if category_id is not None:
        stmt = stmt.where(Transaction.category_id == category_id)

    count_stmt = select(func.count()).select_from(stmt.subquery())
    total = await db.scalar(count_stmt)

    order = Transaction.date.asc() if sort == "asc" else Transaction.date.desc()
    stmt = stmt.order_by(order).offset((page - 1) * page_size).limit(page_size)

    result = await db.execute(stmt)
    items = result.scalars().all()

    return PaginatedTransactions(
        items=items,
        total=total,
        page=page,
        page_size=page_size,
        total_pages=ceil(total / page_size) if total > 0 else 1,
    )


@router.delete("/{transaction_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_transaction(
    transaction_id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    transaction = await _get_transaction_with_ownership(transaction_id, current_user.id, db)
    transaction.deleted_at = datetime.utcnow()
    await db.commit()
