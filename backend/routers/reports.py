"""Reports routes.
Author: Josber
Version: 1.0.0
"""
from datetime import date
from sqlalchemy import func, select
from fastapi import APIRouter, Depends
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.order import Order
from backend.models.payment import Payment

router = APIRouter(prefix='/reports', tags=['reports'])

@router.get('/daily', status_code=200, summary='Daily report', description='Sales summary for current day')
async def daily(db: AsyncSession = Depends(get_db)) -> dict:
    row = (await db.execute(select(func.count(Order.id), func.coalesce(func.sum(Order.total), 0)).where(func.date(Order.created_at) == date.today()))).one()
    return {'date': str(date.today()), 'total_orders': row[0], 'total_sales': float(row[1])}

@router.get('/by-hour', status_code=200, summary='Sales by hour', description='Payment totals grouped by hour')
async def by_hour(db: AsyncSession = Depends(get_db)) -> list[dict]:
    rows = (await db.execute(select(func.strftime('%H', Payment.processed_at), func.coalesce(func.sum(Payment.amount), 0)).group_by(func.strftime('%H', Payment.processed_at)).order_by(func.strftime('%H', Payment.processed_at)))).all()
    return [{'hour': r[0], 'total': float(r[1])} for r in rows]
