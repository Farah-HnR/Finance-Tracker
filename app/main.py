from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from fastapi.middleware.cors import CORSMiddleware
from starlette.exceptions import HTTPException

from app.core.config import settings
from app.core.errors import http_exception_handler, validation_exception_handler, internal_exception_handler
from app.api.v1.router import router

def _operation_id(route) -> str:
    return route.name


app = FastAPI(
    title=settings.APP_NAME,
    servers=[{"url": settings.BACKEND_URL, "description": "API server"}],
    generate_unique_id_function=_operation_id,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, internal_exception_handler)

app.include_router(router)


@app.get("/health")
def health():
    return {"status": "ok"}
