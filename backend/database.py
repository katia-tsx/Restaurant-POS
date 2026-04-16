"""Conexión y sesión async de base de datos.
Autor: Johan
Versión: 1.0.0
"""
from collections.abc import AsyncGenerator

from sqlalchemy.ext.asyncio import AsyncSession, async_sessionmaker, create_async_engine
from sqlalchemy.orm import DeclarativeBase

from backend.config import settings


class Base(DeclarativeBase):
    """Clase base declarativa de SQLAlchemy."""


engine = create_async_engine(settings.database_url, future=True, echo=False)
AsyncSessionLocal = async_sessionmaker(bind=engine, expire_on_commit=False, class_=AsyncSession)


async def get_db() -> AsyncGenerator[AsyncSession, None]:
    """Provee una sesión async para dependencias FastAPI."""
    async with AsyncSessionLocal() as session:
        yield session
