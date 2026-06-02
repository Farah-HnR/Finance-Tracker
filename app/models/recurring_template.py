import uuid
from datetime import datetime, date
from sqlalchemy import String, Date, DateTime, Numeric, Boolean, ForeignKey, Enum as SAEnum
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import UUID
from app.db.base import Base
from app.models.enums import Frequency


class RecurringTemplate(Base):
    __tablename__ = "recurring_templates"

    id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False)
    account_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False)
    category_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("categories.id", ondelete="CASCADE"), nullable=False)
    name: Mapped[str] = mapped_column(String(100), nullable=False)
    amount: Mapped[float] = mapped_column(Numeric(12, 2), nullable=False)
    frequency: Mapped[Frequency] = mapped_column(SAEnum(Frequency), nullable=False)
    next_due_date: Mapped[date] = mapped_column(Date, nullable=False)
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow)

    user = relationship("User", back_populates="recurring_templates")
    account = relationship("Account", back_populates="recurring_templates")
    category = relationship("Category", back_populates="recurring_templates")
    transactions = relationship("Transaction", back_populates="recurring_template")
