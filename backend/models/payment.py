"""Payment model.
Author: Raylin
Version: 1.0.0
"""
from datetime import datetime
from decimal import Decimal
from sqlalchemy import Boolean, DateTime, ForeignKey, Index, Numeric, String
from sqlalchemy.orm import Mapped, mapped_column
from backend.models.base import BaseModel


class Payment(BaseModel):
    """Payment transaction."""

    __tablename__ = "payments"
    __table_args__ = (Index("ix_payments_processed_at", "processed_at"),)

    order_id: Mapped[int] = mapped_column(ForeignKey("orders.id"), nullable=False)
    method: Mapped[str] = mapped_column(String(20), nullable=False)
    amount: Mapped[Decimal] = mapped_column(Numeric(10, 2), nullable=False)
    received_amount: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    change_amount: Mapped[Decimal | None] = mapped_column(Numeric(10, 2), nullable=True)
    processed_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)
    is_voided: Mapped[bool] = mapped_column(Boolean, default=False)
    voided_by_id: Mapped[int | None] = mapped_column(ForeignKey("users.id"), nullable=True)
    voided_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    processed_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), default=datetime.utcnow)
