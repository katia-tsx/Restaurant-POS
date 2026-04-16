"""Order and order item models.
Author: Raylin
Version: 1.0.0
"""
from decimal import Decimal
from sqlalchemy import ForeignKey, Index, Integer, Numeric, String, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship
from backend.models.base import BaseModel


class Order(BaseModel):
    """Order entity."""

    __tablename__ = "orders"
    __table_args__ = (
        Index("ix_orders_status", "status"),
        Index("ix_orders_created_at", "created_at"),
        Index("ix_orders_table_id", "table_id"),
    )

    table_id: Mapped[int | None] = mapped_column(ForeignKey("tables.id"), nullable=True)
    waiter_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    status: Mapped[str] = mapped_column(String(20), default="pending")
    order_type: Mapped[str] = mapped_column(String(20), default="dine_in")
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    subtotal: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"))
    tax: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"))
    total: Mapped[Decimal] = mapped_column(Numeric(10, 2), default=Decimal("0.00"))

    items: Mapped[list["OrderItem"]] = relationship(back_populates="order", cascade="all, delete-orphan")

    def recalc_totals(self) -> None:
        """Recalculate order totals from items."""
        self.subtotal = sum((item.unit_price * item.quantity for item in self.items), Decimal("0.00"))
        self.tax = (self.subtotal * Decimal("0.18")).quantize(Decimal("0.01"))
        self.total = self.subtotal + self.tax


class OrderItem(BaseModel):
    """Line item in order."""

    __tablename__ = "order_items"
    __table_args__ = (Index("ix_order_items_order_id", "order_id"),)

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    menu_item_id: Mapped[int] = mapped_column(ForeignKey("menu_items.id"), nullable=False)
    quantity: Mapped[int] = mapped_column(Integer, nullable=False)
    unit_price: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    notes: Mapped[str | None] = mapped_column(Text, nullable=True)
    status: Mapped[str] = mapped_column(String(20), default="pending")

    order: Mapped[Order] = relationship(back_populates="items")
