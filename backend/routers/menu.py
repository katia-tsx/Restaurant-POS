"""Menu routes.
Author: Katia
Version: 1.0.0
"""
import json
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.database import get_db
from backend.models.menu_item import Category, MenuItem
from backend.schemas.menu_item import CategoryCreate, CategoryOut, CategoryUpdate, MenuItemCreate, MenuItemOut, MenuItemUpdate

router = APIRouter(prefix='/menu', tags=['menu'])

@router.get('/categories', response_model=list[CategoryOut], status_code=200, summary='List categories', description='Get all categories')
async def list_categories(db: AsyncSession = Depends(get_db)) -> list[CategoryOut]:
    return [CategoryOut.model_validate(c) for c in (await db.execute(select(Category))).scalars().all()]

@router.post('/categories', response_model=CategoryOut, status_code=201, summary='Create category', description='Create menu category')
async def create_category(payload: CategoryCreate, db: AsyncSession = Depends(get_db)) -> CategoryOut:
    obj = Category(**payload.model_dump())
    db.add(obj)
    await db.commit(); await db.refresh(obj)
    return CategoryOut.model_validate(obj)


@router.put('/categories/{category_id}', response_model=CategoryOut, status_code=200, summary='Update category', description='Update category by id')
async def update_category(category_id: int, payload: CategoryUpdate, db: AsyncSession = Depends(get_db)) -> CategoryOut:
    obj = (await db.execute(select(Category).where(Category.id == category_id))).scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail='Category not found')
    data = payload.model_dump(exclude_unset=True)
    for key, value in data.items():
        setattr(obj, key, value)
    await db.commit()
    await db.refresh(obj)
    return CategoryOut.model_validate(obj)


@router.delete('/categories/{category_id}', status_code=204, summary='Delete category', description='Delete category by id')
async def delete_category(category_id: int, db: AsyncSession = Depends(get_db)) -> None:
    obj = (await db.execute(select(Category).where(Category.id == category_id))).scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail='Category not found')
    await db.delete(obj)
    await db.commit()

@router.get('/items', response_model=list[MenuItemOut], status_code=200, summary='List menu items', description='Get menu items')
async def list_items(category: int | None = None, db: AsyncSession = Depends(get_db)) -> list[MenuItemOut]:
    query = select(MenuItem)
    if category is not None:
        query = query.where(MenuItem.category_id == category)
    return [MenuItemOut.model_validate(m) for m in (await db.execute(query)).scalars().all()]


@router.get('/items/{item_id}', response_model=MenuItemOut, status_code=200, summary='Get menu item', description='Get one menu item by id')
async def get_item(item_id: int, db: AsyncSession = Depends(get_db)) -> MenuItemOut:
    obj = (await db.execute(select(MenuItem).where(MenuItem.id == item_id))).scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail='Menu item not found')
    return MenuItemOut.model_validate(obj)

@router.post('/items', response_model=MenuItemOut, status_code=201, summary='Create menu item', description='Create menu item')
async def create_item(payload: MenuItemCreate, db: AsyncSession = Depends(get_db)) -> MenuItemOut:
    data = payload.model_dump()
    data['allergens'] = json.dumps(data['allergens'])
    data['tags'] = json.dumps(data['tags'])
    obj = MenuItem(**data)
    db.add(obj)
    await db.commit(); await db.refresh(obj)
    return MenuItemOut.model_validate(obj)


@router.put('/items/{item_id}', response_model=MenuItemOut, status_code=200, summary='Update menu item', description='Update menu item by id')
async def update_item(item_id: int, payload: MenuItemUpdate, db: AsyncSession = Depends(get_db)) -> MenuItemOut:
    obj = (await db.execute(select(MenuItem).where(MenuItem.id == item_id))).scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail='Menu item not found')
    data = payload.model_dump(exclude_unset=True)
    if 'allergens' in data and data['allergens'] is not None:
        data['allergens'] = json.dumps(data['allergens'])
    if 'tags' in data and data['tags'] is not None:
        data['tags'] = json.dumps(data['tags'])
    for key, value in data.items():
        setattr(obj, key, value)
    await db.commit()
    await db.refresh(obj)
    return MenuItemOut.model_validate(obj)


@router.delete('/items/{item_id}', status_code=204, summary='Delete menu item', description='Delete menu item by id')
async def delete_item(item_id: int, db: AsyncSession = Depends(get_db)) -> None:
    obj = (await db.execute(select(MenuItem).where(MenuItem.id == item_id))).scalar_one_or_none()
    if not obj:
        raise HTTPException(status_code=404, detail='Menu item not found')
    await db.delete(obj)
    await db.commit()
