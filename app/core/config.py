from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    APP_NAME: str = "FinanceBudget"
    APP_ENV: str = "development"
    SECRET_KEY: str
    DATABASE_URL: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"
    BACKEND_URL: str = "http://127.0.0.1:8000"

    class Config:
        env_file = ".env"


settings = Settings()
