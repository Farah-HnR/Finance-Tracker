"""add_colour_to_categories

Revision ID: a83446c00537
Revises: 7b499e936359
Create Date: 2026-06-03 21:35:31.353870

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'a83446c00537'
down_revision: Union[str, Sequence[str], None] = '7b499e936359'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("categories", sa.Column("colour", sa.String(7), nullable=False, server_default="#ffffff"))


def downgrade() -> None:
    op.drop_column("categories", "colour")
