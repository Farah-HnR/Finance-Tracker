"""initial_migration

Revision ID: 7b499e936359
Revises:
Create Date: 2026-05-25 18:33:18.643039

"""
from typing import Sequence, Union

import sqlalchemy as sa
from sqlalchemy.dialects import postgresql
from alembic import op

revision: str = '7b499e936359'
down_revision: Union[str, Sequence[str], None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("email", sa.String(255), nullable=False, unique=True),
        sa.Column("hashed_password", sa.Text, nullable=False),
        sa.Column("full_name", sa.String(100), nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    op.create_table(
        "accounts",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("type", sa.Enum("cash", "bank", "credit_card", "savings", name="accounttype"), nullable=False),
        sa.Column("balance", sa.Numeric(12, 2), nullable=False, server_default="0.00"),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    op.create_table(
        "categories",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(50), nullable=False),
        sa.Column("type", sa.Enum("income", "expense", name="categorytype"), nullable=False),
        sa.Column("icon", sa.String(50), nullable=True),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    op.create_table(
        "budgets",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("category_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("categories.id", ondelete="CASCADE"), nullable=False),
        sa.Column("month", sa.Date, nullable=False),
        sa.Column("limit_amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
        sa.UniqueConstraint("user_id", "category_id", "month", name="uq_budget_user_category_month"),
    )

    op.create_table(
        "recurring_templates",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("account_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("category_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("categories.id", ondelete="CASCADE"), nullable=False),
        sa.Column("name", sa.String(100), nullable=False),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("frequency", sa.Enum("daily", "weekly", "monthly", "yearly", name="frequency"), nullable=False),
        sa.Column("next_due_date", sa.Date, nullable=False),
        sa.Column("is_active", sa.Boolean, nullable=False, server_default="true"),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    op.create_table(
        "transactions",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True),
        sa.Column("account_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("accounts.id", ondelete="CASCADE"), nullable=False),
        sa.Column("category_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("categories.id", ondelete="SET NULL"), nullable=True),
        sa.Column("recurring_template_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("recurring_templates.id", ondelete="SET NULL"), nullable=True),
        sa.Column("amount", sa.Numeric(12, 2), nullable=False),
        sa.Column("type", sa.Enum("income", "expense", name="transactiontype"), nullable=False),
        sa.Column("description", sa.Text, nullable=True),
        sa.Column("date", sa.Date, nullable=False),
        sa.Column("created_at", sa.DateTime, nullable=False),
    )

    # Indexes for fast user-scoped queries
    op.create_index("ix_accounts_user_id", "accounts", ["user_id"])
    op.create_index("ix_categories_user_id", "categories", ["user_id"])
    op.create_index("ix_budgets_user_id_month", "budgets", ["user_id", "month"])
    op.create_index("ix_transactions_account_id_date", "transactions", ["account_id", "date"])
    op.create_index("ix_recurring_templates_user_id", "recurring_templates", ["user_id"])


def downgrade() -> None:
    op.drop_index("ix_recurring_templates_user_id", "recurring_templates")
    op.drop_index("ix_transactions_account_id_date", "transactions")
    op.drop_index("ix_budgets_user_id_month", "budgets")
    op.drop_index("ix_categories_user_id", "categories")
    op.drop_index("ix_accounts_user_id", "accounts")

    op.drop_table("transactions")
    op.drop_table("recurring_templates")
    op.drop_table("budgets")
    op.drop_table("categories")
    op.drop_table("accounts")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS transactiontype")
    op.execute("DROP TYPE IF EXISTS frequency")
    op.execute("DROP TYPE IF EXISTS categorytype")
    op.execute("DROP TYPE IF EXISTS accounttype")
