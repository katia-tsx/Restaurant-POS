"""Tables routes.
Author: Katia
Version: 1.0.0
"""
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.table import RestaurantTable

router = APIRouter(prefix='/tables', tags=['tables'])

MAX_TABLES = 5


class TableCreate(BaseModel):
    number: int
    capacity: int
    location: str = 'Interior'


class TableUpdate(BaseModel):
    number: int | None = None
    capacity: int | None = None
    status: str | None = None
    location: str | None = None
    is_active: bool | None = None

@router.get('/{table_id}', status_code=200, summary='Get table', description='Get one table by id')
async def get_table(table_id: int, db: AsyncSession = Depends(get_db)) -> dict:
    table = (await db.execute(select(RestaurantTable).where(RestaurantTable.id == table_id))).scalar_one_or_none()
    if not table:
        raise HTTPException(status_code=404, detail='Table not found')
    return table.to_dict()


@router.get('', status_code=200, summary='List tables', description='Get all restaurant tables')
async def list_tables(db: AsyncSession = Depends(get_db)) -> list[dict]:
    rows = (await db.execute(select(RestaurantTable))).scalars().all()
    return [r.to_dict() for r in rows]

@router.post('', status_code=201, summary='Create table', description='Create a restaurant table')
async def create_table(payload: TableCreate, db: AsyncSession = Depends(get_db)) -> dict:
    count = (await db.execute(select(func.count()).select_from(RestaurantTable))).scalar_one()
    if count >= MAX_TABLES:
        raise HTTPException(status_code=400, detail=f'Maximum {MAX_TABLES} tables allowed')
    table = RestaurantTable(**payload.model_dump())
    db.add(table)
    await db.commit(); await db.refresh(table)
    return table.to_dict()


@router.put('/{table_id}', status_code=200, summary='Update table', description='Update table by id')
async def update_table(table_id: int, payload: TableUpdate, db: AsyncSession = Depends(get_db)) -> dict:
    table = (await db.execute(select(RestaurantTable).where(RestaurantTable.id == table_id))).scalar_one_or_none()
    if not table:
        raise HTTPException(status_code=404, detail='Table not found')
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(table, key, value)
    await db.commit()
    await db.refresh(table)
    return table.to_dict()


@router.delete('/{table_id}', status_code=204, summary='Delete table', description='Delete table by id')
async def delete_table(table_id: int, db: AsyncSession = Depends(get_db)) -> None:
    table = (await db.execute(select(RestaurantTable).where(RestaurantTable.id == table_id))).scalar_one_or_none()
    if not table:
        raise HTTPException(status_code=404, detail='Table not found')
    await db.delete(table)
    await db.commit()
