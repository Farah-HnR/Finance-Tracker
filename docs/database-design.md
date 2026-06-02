# Database Design — FinanceBudget App

---

## Tables

| Table               | Purpose                                              |
|---------------------|------------------------------------------------------|
| users               | Registered accounts                                  |
| accounts            | User's wallets — cash, bank, credit card             |
| categories          | Income / expense labels owned by user                |
| transactions        | Every income or expense entry                        |
| budgets             | Monthly spending cap — junction of users & categories|
| recurring_templates | Bill / subscription / rent templates                 |

---

## Relationships

```
users            has many    accounts
users            has many    categories
users            has many    recurring_templates

accounts         has many    transactions
accounts         has many    recurring_templates

categories       has many    transactions
categories       has many    recurring_templates
categories       has many    budgets

users            has many    budgets
budgets          belongs to  users        ──┐  (junction — many-to-many
budgets          belongs to  categories   ──┘   with payload: month + limit)

recurring_templates  has many    transactions
```

---

## Graphical View

```
┌──────────────┐
│    users     │
└──┬───────┬───┘
   │       │
   │1      │1
   │       │
   │M      │M
┌──▼──────┐ ┌▼────────────┐
│accounts │ │ categories  │
└──┬───┬──┘ └──┬───┬──────┘
   │   │       │   │
   │   │       │   │
   │   └───┐   │   └────────────────────┐
   │       │   │                        │
   │1      │   │1                       │1
   │       │   │                        │
   │M      │   │M                       │M
   │   ┌───▼───▼──────────┐       ┌─────▼──────┐
   │   │   transactions   │       │  budgets   │
   │   └──────────────────┘       │ (junction) │
   │                              │ user_id FK │
   │1                             │ cat_id FK  │
   │                              │ month      │
   │M                             │ limit_amt  │
┌──▼────────────────┐             └────────────┘
│recurring_templates│──(1)──────(M)──► transactions
│ category_id FK    │
│ account_id  FK    │
│ user_id     FK    │
│ frequency         │
└───────────────────┘
```

---

## Budget — Why It Is a Junction / Middle Table

```
users ──────────────────────────────────────── categories
  │                                                 │
  │              ┌───────────┐                      │
  └──────(1)────►│  budgets  │◄────────(1)──────────┘
                 │           │
                 │ month     │   ← extra payload
                 │ limit_amt │     makes it many-to-many
                 └───────────┘     with data, not a
                                   pure junction
```

A user can have budgets for many categories.
A category can have budgets set by many users (their own rows).
Budget is the relationship itself — carrying the limit and month.

---

## Recurring Templates — How It Connects

```
users  ──(1)──(M)──  recurring_templates  ──(M)──(1)──  categories
                              │
                              │──(M)──(1)──  accounts
                              │
                              └──(1)──(M)──  transactions
```

A template knows: which account it draws from, which category it belongs to,
and how often it fires. Each time it fires, it creates a new transaction.

---

## Final Association List

| Table A             | Relationship | Table B       | Note                          |
|---------------------|--------------|---------------|-------------------------------|
| users               | has many     | accounts      |                               |
| users               | has many     | categories    |                               |
| users               | has many     | budgets       | via junction                  |
| users               | has many     | recurring_templates |                         |
| accounts            | has many     | transactions  |                               |
| accounts            | has many     | recurring_templates |                         |
| categories          | has many     | transactions  |                               |
| categories          | has many     | budgets       | via junction                  |
| categories          | has many     | recurring_templates |                         |
| budgets             | belongs to   | users         | junction with month + limit   |
| budgets             | belongs to   | categories    | junction with month + limit   |
| recurring_templates | has many     | transactions  | template spawns transactions  |
| recurring_templates | belongs to   | users         |                               |
| recurring_templates | belongs to   | accounts      |                               |
| recurring_templates | belongs to   | categories    |                               |
