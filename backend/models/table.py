"""Restaurant table model.
Author: Raylin
Version: 1.0.0
"""
from sqlalchemy import Integer, String
from sqlalchemy.orm import Mapped, mapped_column
from backend.models.base import BaseModel


class RestaurantTable(BaseModel):
    """Physical table in restaurant layout."""

    __tablename__ = "tables"

    number: Mapped[int] = mapped_column(Integer, unique=True, nullable=False)
    capacity: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="available")
    location: Mapped[str] = mapped_column(String(50), default="Interior")
