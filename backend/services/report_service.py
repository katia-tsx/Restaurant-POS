"""Generación de reportes.
Autor: Kevin
Versión: 1.0.0
"""
from datetime import date
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.models.order import Order


class ReportService:
    """Calcula métricas agregadas para dashboard/reportes."""

    @staticmethod
    async def daily_summary(db: AsyncSession) -> dict:
        """Retorna resumen de ventas del día."""
        q = await db.execute(select(func.count(Order.id), func.coalesce(func.sum(Order.total), 0)).where(func.date(Order.created_at) == date.today()))
        total_orders, total_sales = q.one()
        return {"total_orders": total_orders, "total_sales": float(total_sales)}
