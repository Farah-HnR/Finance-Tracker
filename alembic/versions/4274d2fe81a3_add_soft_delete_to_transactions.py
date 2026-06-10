"""add_soft_delete_to_transactions

Revision ID: 4274d2fe81a3
Revises: a83446c00537
Create Date: 2026-06-08 18:39:44.791974

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '4274d2fe81a3'
down_revision: Union[str, Sequence[str], None] = 'a83446c00537'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("transactions", sa.Column("deleted_at", sa.DateTime, nullable=True))


def downgrade() -> None:
    op.drop_column("transactions", "deleted_at")
