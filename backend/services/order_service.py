"""Lógica de pedidos.
Autor: Kevin
Versión: 1.0.0
"""
import logging
from decimal import Decimal
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.menu_item import MenuItem
from backend.models.order import Order, OrderItem

logger = logging.getLogger(__name__)


class OrderService:
    """Operaciones de creación y edición de pedidos."""

    @staticmethod
    async def create_order(db: AsyncSession, order: Order, items: list[tuple[int, int, str | None]]) -> Order:
        """Crea una orden con sus detalles."""
        db.add(order)
        await db.flush()
        for menu_item_id, qty, notes in items:
            menu_item = (await db.execute(select(MenuItem).where(MenuItem.id == menu_item_id))).scalar_one()
            db.add(OrderItem(order_id=order.id, menu_item_id=menu_item.id, quantity=qty, unit_price=menu_item.price, notes=notes))
        await db.flush()
        await db.refresh(order)
        subtotal = sum((i.unit_price * i.quantity for i in order.items), Decimal('0.00'))
        order.subtotal = subtotal
        order.tax = (subtotal * Decimal('0.18')).quantize(Decimal('0.01'))
        order.total = order.subtotal + order.tax
        logger.info("Order creada id=%s total=%s", order.id, order.total)
        await db.commit()
        await db.refresh(order)
        return order
