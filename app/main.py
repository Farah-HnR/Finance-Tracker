from fastapi import FastAPI
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException

from app.core.config import settings
from app.core.errors import http_exception_handler, validation_exception_handler, internal_exception_handler
from app.api.v1.router import router

app = FastAPI(title=settings.APP_NAME)

app.add_exception_handler(HTTPException, http_exception_handler)
app.add_exception_handler(RequestValidationError, validation_exception_handler)
app.add_exception_handler(Exception, internal_exception_handler)

app.include_router(router)


@app.get("/health")
def health():
    return {"status": "ok"}
