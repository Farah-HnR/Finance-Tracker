import uuid
from datetime import datetime
from sqlalchemy import String, DateTime, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
from app.models.enums import CategoryType


class Category(Base):
    __tablename__ = "categories"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(50), nullable=False)
    type: Mapped[CategoryType] = mapped_column(SAEnum(CategoryType), nullable=False)
    icon: Mapped[str] = mapped_column(String(50), nullable=True)
    colour: Mapped[str] = mapped_column(String(7), nullable=False, default="#ffffff")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="categories")
    transactions = relationship("Transaction", back_populates="category")
    recurring_templates = relationship("RecurringTemplate", back_populates="category")
    budgets = relationship("Budget", back_populates="category", cascade="all, delete-orphan")
