"""Payments routes.
Author: Josber
Version: 1.0.0
"""
from decimal import Decimal
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.order import Order
from backend.models.payment import Payment
from backend.schemas.payment import PaymentCreate, PaymentOut, PaymentUpdate

router = APIRouter(prefix='/payments', tags=['payments'])

@router.post('', response_model=PaymentOut, status_code=201, summary='Process payment', description='Process order payment')
async def process_payment(payload: PaymentCreate, db: AsyncSession = Depends(get_db)) -> PaymentOut:
    order = (await db.execute(select(Order).where(Order.id == payload.order_id))).scalar_one_or_none()
    if not order:
        raise HTTPException(status_code=404, detail='Order not found')
    change = Decimal('0.00')
    if payload.method == 'cash' and payload.received_amount is not None:
        change = (payload.received_amount - order.total).quantize(Decimal('0.01'))
    payment = Payment(order_id=order.id, method=payload.method, amount=order.total, received_amount=payload.received_amount, change_amount=change, processed_by_id=payload.processed_by_id)
    order.status = 'paid'
    db.add(payment)
    await db.commit(); await db.refresh(payment)
    return PaymentOut.model_validate(payment)

@router.get('', response_model=list[PaymentOut], status_code=200, summary='List payments', description='Get payment history')
async def list_payments(db: AsyncSession = Depends(get_db)) -> list[PaymentOut]:
    return [PaymentOut.model_validate(p) for p in (await db.execute(select(Payment))).scalars().all()]


@router.put('/{payment_id}', response_model=PaymentOut, status_code=200, summary='Update payment', description='Update payment by id')
async def update_payment(payment_id: int, payload: PaymentUpdate, db: AsyncSession = Depends(get_db)) -> PaymentOut:
    payment = (await db.execute(select(Payment).where(Payment.id == payment_id))).scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail='Payment not found')
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(payment, key, value)
    await db.commit()
    await db.refresh(payment)
    return PaymentOut.model_validate(payment)


@router.delete('/{payment_id}', status_code=204, summary='Delete payment', description='Delete payment by id')
async def delete_payment(payment_id: int, db: AsyncSession = Depends(get_db)) -> None:
    payment = (await db.execute(select(Payment).where(Payment.id == payment_id))).scalar_one_or_none()
    if not payment:
        raise HTTPException(status_code=404, detail='Payment not found')
    await db.delete(payment)
    await db.commit()
