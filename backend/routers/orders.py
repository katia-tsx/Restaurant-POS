"""Orders routes.
Author: Josber
Version: 1.0.0
"""
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.menu_item import MenuItem
from backend.models.order import Order, OrderItem
from backend.schemas.order import OrderCreate, OrderOut

router = APIRouter(prefix='/orders', tags=['orders'])

@router.get('', response_model=list[OrderOut], status_code=200, summary='List orders', description='Get all orders')
async def list_orders(db: AsyncSession = Depends(get_db)) -> list[OrderOut]:
    return [OrderOut.model_validate(o) for o in (await db.execute(select(Order))).scalars().all()]

@router.post('', response_model=OrderOut, status_code=201, summary='Create order', description='Create order with items')
async def create_order(payload: OrderCreate, db: AsyncSession = Depends(get_db)) -> OrderOut:
    order = Order(table_id=payload.table_id, waiter_id=payload.waiter_id, order_type=payload.order_type, notes=payload.notes)
    db.add(order)
    await db.flush()
    subtotal = Decimal('0.00')
    for item in payload.items:
        menu_item = (await db.execute(select(MenuItem).where(MenuItem.id == item.menu_item_id))).scalar_one_or_none()
        if not menu_item:
            raise HTTPException(status_code=404, detail=f'Menu item {item.menu_item_id} not found')
        db.add(OrderItem(order_id=order.id, menu_item_id=menu_item.id, quantity=item.quantity, unit_price=menu_item.price, notes=item.notes))
        subtotal += menu_item.price * item.quantity
    order.subtotal = subtotal
    order.tax = (subtotal * Decimal('0.18')).quantize(Decimal('0.01'))
    order.total = order.subtotal + order.tax
    await db.commit(); await db.refresh(order)
    return OrderOut.model_validate(order)
