"""Base ORM model definitions.
Author: Raylin
Version: 1.0.0
"""
from datetime import datetime
from sqlalchemy import Boolean, DateTime, Integer, func
from sqlalchemy.orm import Mapped, mapped_column
from backend.database import Base


class BaseModel(Base):
    """Abstract base class for all ORM models."""

    __abstract__ = True
    id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())
    updated_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now(), onupdate=func.now())
    is_active: Mapped[bool] = mapped_column(Boolean, default=True)

    def to_dict(self) -> dict:
        """Serialize columns to dictionary."""
        return {col.name: getattr(self, col.name) for col in self.__table__.columns}
