import uuid
from datetime import date
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, extract

from app.db.session import get_db
from app.core.deps import get_current_user
from app.models.user import User
from app.models.account import Account
from app.models.category import Category
from app.models.transaction import Transaction
from app.schemas.transaction import TransactionCreate, TransactionResponse

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


@router.get("", response_model=list[TransactionResponse])
async def list_transactions(
    month: int | None = Query(None, ge=1, le=12),
    year: int | None = Query(None, ge=2000, le=2100),
    category_id: uuid.UUID | None = Query(None),
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    stmt = (
        select(Transaction)
        .join(Account, Transaction.account_id == Account.id)
        .where(Account.user_id == current_user.id)
    )

    if month is not None:
        stmt = stmt.where(extract("month", Transaction.date) == month)
    if year is not None:
        stmt = stmt.where(extract("year", Transaction.date) == year)
    if category_id is not None:
        stmt = stmt.where(Transaction.category_id == category_id)

    stmt = stmt.order_by(Transaction.date.desc())
    result = await db.execute(stmt)
    return result.scalars().all()
