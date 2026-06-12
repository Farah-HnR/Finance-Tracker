from sqlalchemy.ext.asyncio import async_sessionmaker, create_async_engine
from sqlalchemy.pool import NullPool
from app.core.config import settings

_is_local = "localhost" in settings.DATABASE_URL or "127.0.0.1" in settings.DATABASE_URL
_connect_args = {} if _is_local else {"ssl": "require"}
_poolclass = None if _is_local else NullPool

engine = create_async_engine(
    settings.DATABASE_URL,
    echo=False,
    connect_args=_connect_args,
    poolclass=_poolclass,
)

AsyncSessionLocal = async_sessionmaker(engine, expire_on_commit=False)


async def get_db():
    async with AsyncSessionLocal() as session:
        yield session
