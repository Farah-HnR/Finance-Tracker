"""
Realistic seed data for FinanceBudget — Jan 2026 to Jun 2026.

Run from project root:
    python scripts/seed.py
"""

import asyncio
import sys
import os
from datetime import date
from decimal import Decimal

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from sqlalchemy.ext.asyncio import create_async_engine, async_sessionmaker
from sqlalchemy import delete, select

from app.core.config import settings
from app.core.security import hash_password
from app.models.user import User
from app.models.account import Account
from app.models.category import Category
from app.models.budget import Budget
from app.models.transaction import Transaction
from app.models.enums import AccountType, CategoryType, TransactionType


# ---------------------------------------------------------------------------
# Raw data
# ---------------------------------------------------------------------------

ACCOUNTS = [
    {"name": "HDFC Savings",     "type": AccountType.bank,        "balance": Decimal("85000.00")},
    {"name": "Cash Wallet",      "type": AccountType.cash,         "balance": Decimal("5000.00")},
    {"name": "HDFC Credit Card", "type": AccountType.credit_card,  "balance": Decimal("0.00")},
]

CATEGORIES = [
    # expense
    {"name": "Groceries",    "type": CategoryType.expense, "colour": "#4caf50", "icon": "cart"},
    {"name": "Rent",         "type": CategoryType.expense, "colour": "#f44336", "icon": "home"},
    {"name": "Transport",    "type": CategoryType.expense, "colour": "#2196f3", "icon": "car"},
    {"name": "Dining Out",   "type": CategoryType.expense, "colour": "#ff9800", "icon": "fork"},
    {"name": "Utilities",    "type": CategoryType.expense, "colour": "#607d8b", "icon": "bolt"},
    {"name": "Entertainment","type": CategoryType.expense, "colour": "#9c27b0", "icon": "film"},
    {"name": "Healthcare",   "type": CategoryType.expense, "colour": "#00bcd4", "icon": "heart"},
    {"name": "Shopping",     "type": CategoryType.expense, "colour": "#e91e63", "icon": "bag"},
    # income
    {"name": "Salary",       "type": CategoryType.income,  "colour": "#43a047", "icon": "money"},
    {"name": "Freelance",    "type": CategoryType.income,  "colour": "#1e88e5", "icon": "laptop"},
    {"name": "Investments",  "type": CategoryType.income,  "colour": "#fb8c00", "icon": "chart"},
]

# Each entry: (category_name, account_name, amount, type, date, description)
TRANSACTIONS = [
    # ── January 2026 ────────────────────────────────────────────────────────
    ("Salary",        "HDFC Savings",     85000, "income",  date(2026, 1,  1), "January salary"),
    ("Rent",          "HDFC Savings",     25000, "expense", date(2026, 1,  5), "Monthly rent - January"),
    ("Utilities",     "HDFC Savings",      1800, "expense", date(2026, 1,  6), "Electricity bill"),
    ("Utilities",     "HDFC Savings",       999, "expense", date(2026, 1,  7), "Internet bill"),
    ("Groceries",     "HDFC Savings",      3200, "expense", date(2026, 1,  8), "Big grocery haul"),
    ("Transport",     "Cash Wallet",        450, "expense", date(2026, 1,  9), "Auto rickshaw weekly"),
    ("Dining Out",    "HDFC Credit Card",  1200, "expense", date(2026, 1, 11), "Dinner with friends"),
    ("Groceries",     "Cash Wallet",        850, "expense", date(2026, 1, 15), "Local market"),
    ("Entertainment", "HDFC Credit Card",  1500, "expense", date(2026, 1, 16), "Movie + popcorn"),
    ("Transport",     "Cash Wallet",        380, "expense", date(2026, 1, 18), "Cab rides"),
    ("Dining Out",    "HDFC Credit Card",   650, "expense", date(2026, 1, 20), "Lunch with colleagues"),
    ("Shopping",      "HDFC Credit Card",  3500, "expense", date(2026, 1, 22), "Winter jacket"),
    ("Groceries",     "HDFC Savings",      2100, "expense", date(2026, 1, 25), "Supermarket run"),
    ("Transport",     "Cash Wallet",        200, "expense", date(2026, 1, 27), "Bus pass top-up"),
    ("Dining Out",    "Cash Wallet",        400, "expense", date(2026, 1, 29), "Street food"),

    # ── February 2026 ───────────────────────────────────────────────────────
    ("Salary",        "HDFC Savings",     85000, "income",  date(2026, 2,  1), "February salary"),
    ("Freelance",     "HDFC Savings",     12000, "income",  date(2026, 2,  3), "Logo design project"),
    ("Rent",          "HDFC Savings",     25000, "expense", date(2026, 2,  5), "Monthly rent - February"),
    ("Utilities",     "HDFC Savings",      1650, "expense", date(2026, 2,  6), "Electricity bill"),
    ("Utilities",     "HDFC Savings",       999, "expense", date(2026, 2,  7), "Internet bill"),
    ("Groceries",     "HDFC Savings",      2800, "expense", date(2026, 2,  9), "Weekly groceries"),
    ("Transport",     "Cash Wallet",        420, "expense", date(2026, 2, 10), "Petrol"),
    ("Dining Out",    "HDFC Credit Card",  2200, "expense", date(2026, 2, 14), "Valentine's dinner"),
    ("Entertainment", "HDFC Credit Card",   499, "expense", date(2026, 2, 15), "Netflix subscription"),
    ("Groceries",     "Cash Wallet",        950, "expense", date(2026, 2, 17), "Fruits and vegetables"),
    ("Healthcare",    "HDFC Savings",      2500, "expense", date(2026, 2, 19), "Doctor consultation + meds"),
    ("Transport",     "Cash Wallet",        340, "expense", date(2026, 2, 21), "Weekly cabs"),
    ("Shopping",      "HDFC Credit Card",  1800, "expense", date(2026, 2, 23), "Shoes"),
    ("Groceries",     "HDFC Savings",      2200, "expense", date(2026, 2, 25), "Month-end grocery"),
    ("Dining Out",    "Cash Wallet",        550, "expense", date(2026, 2, 27), "Cafe with friends"),

    # ── March 2026 ──────────────────────────────────────────────────────────
    ("Salary",        "HDFC Savings",     85000, "income",  date(2026, 3,  1), "March salary"),
    ("Rent",          "HDFC Savings",     25000, "expense", date(2026, 3,  5), "Monthly rent - March"),
    ("Utilities",     "HDFC Savings",      2100, "expense", date(2026, 3,  6), "Electricity bill"),
    ("Utilities",     "HDFC Savings",       999, "expense", date(2026, 3,  7), "Internet bill"),
    ("Groceries",     "HDFC Savings",      3100, "expense", date(2026, 3,  8), "Big monthly shop"),
    ("Investments",   "HDFC Savings",      5000, "income",  date(2026, 3, 10), "Mutual fund dividend"),
    ("Transport",     "Cash Wallet",        510, "expense", date(2026, 3, 11), "Monthly travel"),
    ("Dining Out",    "HDFC Credit Card",   980, "expense", date(2026, 3, 13), "Birthday dinner"),
    ("Entertainment", "HDFC Credit Card",  1200, "expense", date(2026, 3, 15), "Concert tickets"),
    ("Groceries",     "Cash Wallet",       1100, "expense", date(2026, 3, 17), "Organic store"),
    ("Shopping",      "HDFC Credit Card",  4500, "expense", date(2026, 3, 20), "Holi shopping"),
    ("Transport",     "Cash Wallet",        290, "expense", date(2026, 3, 22), "Cab rides"),
    ("Healthcare",    "HDFC Savings",       800, "expense", date(2026, 3, 24), "Pharmacy"),
    ("Groceries",     "HDFC Savings",      2400, "expense", date(2026, 3, 26), "End of month groceries"),
    ("Freelance",     "HDFC Savings",      8500, "income",  date(2026, 3, 28), "Content writing gig"),
    ("Dining Out",    "Cash Wallet",        750, "expense", date(2026, 3, 30), "Weekend brunch"),

    # ── April 2026 ──────────────────────────────────────────────────────────
    ("Salary",        "HDFC Savings",     85000, "income",  date(2026, 4,  1), "April salary"),
    ("Rent",          "HDFC Savings",     25000, "expense", date(2026, 4,  5), "Monthly rent - April"),
    ("Utilities",     "HDFC Savings",      1900, "expense", date(2026, 4,  6), "Electricity bill"),
    ("Utilities",     "HDFC Savings",       999, "expense", date(2026, 4,  7), "Internet bill"),
    ("Groceries",     "HDFC Savings",      2700, "expense", date(2026, 4,  8), "Weekly groceries"),
    ("Transport",     "Cash Wallet",        480, "expense", date(2026, 4,  9), "Fuel + auto"),
    ("Entertainment", "HDFC Credit Card",   499, "expense", date(2026, 4, 10), "Netflix subscription"),
    ("Dining Out",    "HDFC Credit Card",  1350, "expense", date(2026, 4, 12), "Team lunch"),
    ("Groceries",     "Cash Wallet",        920, "expense", date(2026, 4, 15), "Vegetables and fruits"),
    ("Healthcare",    "HDFC Savings",      3200, "expense", date(2026, 4, 17), "Dental checkup"),
    ("Transport",     "Cash Wallet",        360, "expense", date(2026, 4, 19), "Cab rides"),
    ("Shopping",      "HDFC Credit Card",  2200, "expense", date(2026, 4, 21), "Summer clothes"),
    ("Investments",   "HDFC Savings",      3500, "income",  date(2026, 4, 23), "Stock dividend"),
    ("Groceries",     "HDFC Savings",      2500, "expense", date(2026, 4, 25), "Month-end groceries"),
    ("Dining Out",    "Cash Wallet",        600, "expense", date(2026, 4, 27), "Sunday dinner"),
    ("Entertainment", "HDFC Credit Card",   800, "expense", date(2026, 4, 29), "IPL match tickets"),

    # ── May 2026 ────────────────────────────────────────────────────────────
    ("Salary",        "HDFC Savings",     85000, "income",  date(2026, 5,  1), "May salary"),
    ("Rent",          "HDFC Savings",     25000, "expense", date(2026, 5,  5), "Monthly rent - May"),
    ("Utilities",     "HDFC Savings",      2400, "expense", date(2026, 5,  6), "Electricity bill - AC season"),
    ("Utilities",     "HDFC Savings",       999, "expense", date(2026, 5,  7), "Internet bill"),
    ("Groceries",     "HDFC Savings",      3400, "expense", date(2026, 5,  8), "Groceries"),
    ("Transport",     "Cash Wallet",        520, "expense", date(2026, 5,  9), "Monthly commute"),
    ("Freelance",     "HDFC Savings",     15000, "income",  date(2026, 5, 10), "Mobile app UI project"),
    ("Entertainment", "HDFC Credit Card",   499, "expense", date(2026, 5, 12), "Netflix subscription"),
    ("Dining Out",    "HDFC Credit Card",  1800, "expense", date(2026, 5, 14), "Mother's Day dinner"),
    ("Groceries",     "Cash Wallet",       1050, "expense", date(2026, 5, 16), "Local market"),
    ("Transport",     "Cash Wallet",        410, "expense", date(2026, 5, 18), "Cab rides"),
    ("Shopping",      "HDFC Credit Card",  5500, "expense", date(2026, 5, 20), "Summer electronics"),
    ("Healthcare",    "HDFC Savings",      1200, "expense", date(2026, 5, 22), "Lab tests"),
    ("Groceries",     "HDFC Savings",      2600, "expense", date(2026, 5, 24), "End of month groceries"),
    ("Dining Out",    "Cash Wallet",        480, "expense", date(2026, 5, 26), "Lunch out"),
    ("Entertainment", "HDFC Credit Card",  1100, "expense", date(2026, 5, 28), "OTT annual subscription"),

    # ── June 2026 ───────────────────────────────────────────────────────────
    ("Salary",        "HDFC Savings",     85000, "income",  date(2026, 6,  1), "June salary"),
    ("Rent",          "HDFC Savings",     25000, "expense", date(2026, 6,  5), "Monthly rent - June"),
    ("Utilities",     "HDFC Savings",      2700, "expense", date(2026, 6,  6), "Electricity bill - peak summer"),
    ("Utilities",     "HDFC Savings",       999, "expense", date(2026, 6,  7), "Internet bill"),
    ("Groceries",     "HDFC Savings",      3000, "expense", date(2026, 6,  8), "Weekly groceries"),
    ("Transport",     "Cash Wallet",        540, "expense", date(2026, 6,  9), "Petrol + auto"),
    ("Entertainment", "HDFC Credit Card",   499, "expense", date(2026, 6, 10), "Netflix subscription"),
    ("Dining Out",    "HDFC Credit Card",  1100, "expense", date(2026, 6, 12), "Team outing"),
    ("Investments",   "HDFC Savings",      7500, "income",  date(2026, 6, 15), "Quarterly dividend"),
    ("Groceries",     "Cash Wallet",        890, "expense", date(2026, 6, 16), "Vegetables"),
    ("Transport",     "Cash Wallet",        390, "expense", date(2026, 6, 18), "Weekly cabs"),
    ("Shopping",      "HDFC Credit Card",  3200, "expense", date(2026, 6, 20), "Monsoon wardrobe"),
    ("Groceries",     "HDFC Savings",      2300, "expense", date(2026, 6, 22), "Mid-month groceries"),
    ("Dining Out",    "Cash Wallet",        700, "expense", date(2026, 6, 25), "Weekend dinner"),
    ("Healthcare",    "HDFC Savings",       950, "expense", date(2026, 6, 27), "Vitamins and supplements"),
]


# ---------------------------------------------------------------------------
# Budgets — (category_name, month_date, limit_amount)
#
# Limits set to produce a realistic mix of on_track / warning / exceeded:
#
#   Groceries     ₹7000  → warning most months, exceeded in May
#   Rent          ₹25000 → always exactly met (exceeded)
#   Transport     ₹1200  → on_track most months, warning in Jan
#   Dining Out    ₹2500  → exceeded in Feb, warning in Jan & May
#   Utilities     ₹3000  → exceeded in Mar/May/Jun (AC season)
#   Entertainment ₹1200  → exceeded in Jan/Mar/Apr/May
#   Healthcare    ₹2000  → exceeded in Feb & Apr
#   Shopping      ₹4000  → exceeded in Mar & May, warning in Jan & Jun
# ---------------------------------------------------------------------------

BUDGETS = [
    # January 2026 — actual: Groceries 6150, Rent 25000, Transport 1030,
    #                        Dining 2250, Utilities 2799, Entertain 1500,
    #                        Healthcare 0, Shopping 3500
    ("Groceries",     date(2026, 1, 1), 7000),   # 87.9% → warning
    ("Rent",          date(2026, 1, 1), 25000),  # 100%  → exceeded
    ("Transport",     date(2026, 1, 1), 1200),   # 85.8% → warning
    ("Dining Out",    date(2026, 1, 1), 2500),   # 90.0% → warning
    ("Utilities",     date(2026, 1, 1), 3000),   # 93.3% → warning
    ("Entertainment", date(2026, 1, 1), 1200),   # 125%  → exceeded
    ("Healthcare",    date(2026, 1, 1), 2000),   # 0%    → on_track
    ("Shopping",      date(2026, 1, 1), 4000),   # 87.5% → warning

    # February 2026 — actual: Groceries 5950, Rent 25000, Transport 760,
    #                         Dining 2750, Utilities 2649, Entertain 499,
    #                         Healthcare 2500, Shopping 1800
    ("Groceries",     date(2026, 2, 1), 7000),   # 85.0% → warning
    ("Rent",          date(2026, 2, 1), 25000),  # 100%  → exceeded
    ("Transport",     date(2026, 2, 1), 1200),   # 63.3% → on_track
    ("Dining Out",    date(2026, 2, 1), 2500),   # 110%  → exceeded
    ("Utilities",     date(2026, 2, 1), 3000),   # 88.3% → warning
    ("Entertainment", date(2026, 2, 1), 1200),   # 41.6% → on_track
    ("Healthcare",    date(2026, 2, 1), 2000),   # 125%  → exceeded
    ("Shopping",      date(2026, 2, 1), 4000),   # 45.0% → on_track

    # March 2026 — actual: Groceries 6600, Rent 25000, Transport 800,
    #                      Dining 1730, Utilities 3099, Entertain 1200,
    #                      Healthcare 800, Shopping 4500
    ("Groceries",     date(2026, 3, 1), 7000),   # 94.3% → warning
    ("Rent",          date(2026, 3, 1), 25000),  # 100%  → exceeded
    ("Transport",     date(2026, 3, 1), 1200),   # 66.7% → on_track
    ("Dining Out",    date(2026, 3, 1), 2500),   # 69.2% → on_track
    ("Utilities",     date(2026, 3, 1), 3000),   # 103%  → exceeded
    ("Entertainment", date(2026, 3, 1), 1200),   # 100%  → exceeded
    ("Healthcare",    date(2026, 3, 1), 2000),   # 40.0% → on_track
    ("Shopping",      date(2026, 3, 1), 4000),   # 112%  → exceeded

    # April 2026 — actual: Groceries 6120, Rent 25000, Transport 840,
    #                      Dining 1950, Utilities 2899, Entertain 1299,
    #                      Healthcare 3200, Shopping 2200
    ("Groceries",     date(2026, 4, 1), 7000),   # 87.4% → warning
    ("Rent",          date(2026, 4, 1), 25000),  # 100%  → exceeded
    ("Transport",     date(2026, 4, 1), 1200),   # 70.0% → on_track
    ("Dining Out",    date(2026, 4, 1), 2500),   # 78.0% → on_track
    ("Utilities",     date(2026, 4, 1), 3000),   # 96.6% → warning
    ("Entertainment", date(2026, 4, 1), 1200),   # 108%  → exceeded
    ("Healthcare",    date(2026, 4, 1), 2000),   # 160%  → exceeded
    ("Shopping",      date(2026, 4, 1), 4000),   # 55.0% → on_track

    # May 2026 — actual: Groceries 7050, Rent 25000, Transport 930,
    #                    Dining 2280, Utilities 3399, Entertain 1599,
    #                    Healthcare 1200, Shopping 5500
    ("Groceries",     date(2026, 5, 1), 7000),   # 100.7% → exceeded
    ("Rent",          date(2026, 5, 1), 25000),  # 100%   → exceeded
    ("Transport",     date(2026, 5, 1), 1200),   # 77.5%  → on_track
    ("Dining Out",    date(2026, 5, 1), 2500),   # 91.2%  → warning
    ("Utilities",     date(2026, 5, 1), 3000),   # 113%   → exceeded
    ("Entertainment", date(2026, 5, 1), 1200),   # 133%   → exceeded
    ("Healthcare",    date(2026, 5, 1), 2000),   # 60.0%  → on_track
    ("Shopping",      date(2026, 5, 1), 4000),   # 137%   → exceeded

    # June 2026 — actual: Groceries 6190, Rent 25000, Transport 930,
    #                     Dining 1800, Utilities 3699, Entertain 499,
    #                     Healthcare 950, Shopping 3200
    ("Groceries",     date(2026, 6, 1), 7000),   # 88.4% → warning
    ("Rent",          date(2026, 6, 1), 25000),  # 100%  → exceeded
    ("Transport",     date(2026, 6, 1), 1200),   # 77.5% → on_track
    ("Dining Out",    date(2026, 6, 1), 2500),   # 72.0% → on_track
    ("Utilities",     date(2026, 6, 1), 3000),   # 123%  → exceeded
    ("Entertainment", date(2026, 6, 1), 1200),   # 41.6% → on_track
    ("Healthcare",    date(2026, 6, 1), 2000),   # 47.5% → on_track
    ("Shopping",      date(2026, 6, 1), 4000),   # 80.0% → warning
]


# ---------------------------------------------------------------------------
# Seed runner
# ---------------------------------------------------------------------------

async def seed():
    engine = create_async_engine(settings.DATABASE_URL, echo=False)
    Session = async_sessionmaker(engine, expire_on_commit=False)

    async with Session() as db:
        # Wipe existing data in dependency order
        await db.execute(delete(Transaction))
        await db.execute(delete(Budget))
        await db.execute(delete(Account))
        await db.execute(delete(Category))
        await db.execute(delete(User))
        await db.commit()
        print("Cleared existing data.")

        # User
        user = User(
            email="maki@example.com",
            hashed_password=hash_password("secret123"),
            full_name="Maki Test",
        )
        db.add(user)
        await db.flush()
        print(f"Created user: {user.email}")

        # Accounts
        account_map = {}
        for a in ACCOUNTS:
            acc = Account(**a, user_id=user.id)
            db.add(acc)
            await db.flush()
            account_map[a["name"]] = acc
        print(f"Created {len(ACCOUNTS)} accounts.")

        # Categories
        category_map = {}
        for c in CATEGORIES:
            cat = Category(**c, user_id=user.id)
            db.add(cat)
            await db.flush()
            category_map[c["name"]] = cat
        print(f"Created {len(CATEGORIES)} categories.")

        # Transactions
        for cat_name, acc_name, amount, tx_type, tx_date, desc in TRANSACTIONS:
            tx = Transaction(
                account_id=account_map[acc_name].id,
                category_id=category_map[cat_name].id,
                amount=Decimal(str(amount)),
                type=TransactionType(tx_type),
                date=tx_date,
                description=desc,
            )
            db.add(tx)

        # Budgets
        for cat_name, month, limit in BUDGETS:
            budget = Budget(
                user_id=user.id,
                category_id=category_map[cat_name].id,
                month=month,
                limit_amount=Decimal(str(limit)),
            )
            db.add(budget)

        await db.commit()
        print(f"Created {len(TRANSACTIONS)} transactions.")
        print(f"Created {len(BUDGETS)} budgets (8 categories × 6 months).")
        print("\nSeed complete.")
        print("  Email   : maki@example.com")
        print("  Password: secret123")

    await engine.dispose()


if __name__ == "__main__":
    asyncio.run(seed())
