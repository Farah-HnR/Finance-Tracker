from fastapi import APIRouter
from app.api.v1.endpoints import auth, categories, transactions

router = APIRouter(prefix="/api/v1")
router.include_router(auth.router)
router.include_router(categories.router)
router.include_router(transactions.router)
