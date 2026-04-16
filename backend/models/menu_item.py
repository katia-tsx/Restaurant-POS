"""Category and menu item models.
Author: Raylin
Version: 1.0.0
"""
from decimal import Decimal
from sqlalchemy import ForeignKey, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.models.base import BaseModel


class Category(BaseModel):
    """Menu category."""

    __tablename__ = "categories"

    name: Mapped[str] = mapped_column(String(80), nullable=False, unique=True)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    icon: Mapped[str | None] = mapped_column(String(50), nullable=True)
    sort_order: Mapped[int] = mapped_column(Integer, default=0)


class MenuItem(BaseModel):
    """Sellable menu item."""

    __tablename__ = "menu_items"

    name: Mapped[str] = mapped_column(String(100), nullable=False)
    description: Mapped[str | None] = mapped_column(Text, nullable=True)
    price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    category_id: Mapped[int] = mapped_column(ForeignKey("categories.id"), index=True)
    image_url: Mapped[str | None] = mapped_column(String(255), nullable=True)
    is_available: Mapped[bool] = mapped_column(default=True)
    preparation_time: Mapped[int] = mapped_column(Integer, default=10)
    allergens: Mapped[str] = mapped_column(Text, default="[]")
    tags: Mapped[str] = mapped_column(Text, default="[]")

    category: Mapped[Category] = relationship()

    def apply_discount(self, pct: float) -> Decimal:
        """Return discounted price without persisting."""
        return (self.price * (Decimal("1") - Decimal(str(pct)) / Decimal("100"))).quantize(Decimal("0.01"))
