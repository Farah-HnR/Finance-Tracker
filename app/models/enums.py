import enum


class AccountType(str, enum.Enum):
    cash = "cash"
    bank = "bank"
    credit_card = "credit_card"
    savings = "savings"


class CategoryType(str, enum.Enum):
    income = "income"
    expense = "expense"


class TransactionType(str, enum.Enum):
    income = "income"
    expense = "expense"


class Frequency(str, enum.Enum):
    daily = "daily"
    weekly = "weekly"
    monthly = "monthly"
    yearly = "yearly"
