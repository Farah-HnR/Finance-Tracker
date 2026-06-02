from fastapi import Request, status
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException


def error_response(status_code: int, error: str, message: str) -> JSONResponse:
    return JSONResponse(
        status_code=status_code,
        content={"status_code": status_code, "error": error, "message": message},
    )


async def http_exception_handler(request: Request, exc: HTTPException) -> JSONResponse:
    messages = {
        status.HTTP_400_BAD_REQUEST: "Bad Request",
        status.HTTP_401_UNAUTHORIZED: "Unauthorized",
        status.HTTP_403_FORBIDDEN: "Forbidden",
        status.HTTP_404_NOT_FOUND: "Not Found",
        status.HTTP_409_CONFLICT: "Conflict",
    }
    error = messages.get(exc.status_code, "Error")
    return error_response(exc.status_code, error, str(exc.detail))


async def validation_exception_handler(request: Request, exc: RequestValidationError) -> JSONResponse:
    errors = exc.errors()
    first = errors[0]
    field = " -> ".join(str(loc) for loc in first["loc"] if loc != "body")
    message = f"{field}: {first['msg']}" if field else first["msg"]
    return error_response(status.HTTP_422_UNPROCESSABLE_ENTITY, "Validation Error", message)


async def internal_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    return error_response(status.HTTP_500_INTERNAL_SERVER_ERROR, "Internal Server Error", "An unexpected error occurred")
