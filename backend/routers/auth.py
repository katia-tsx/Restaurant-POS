"""Authentication routes.
Author: Josber
Version: 1.0.0
"""
from datetime import timedelta
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.config import settings
from backend.core.security import create_token
from backend.database import get_db
from backend.models.user import User
from backend.schemas.auth import LoginRequest, TokenResponse

router = APIRouter(prefix="/auth", tags=["auth"])

@router.post('/login', response_model=TokenResponse, status_code=status.HTTP_200_OK, summary='Login', description='Authenticate user and return JWT tokens')
async def login(payload: LoginRequest, db: AsyncSession = Depends(get_db)) -> TokenResponse:
    user = (await db.execute(select(User).where(User.username == payload.username, User.is_active == True))).scalar_one_or_none()
    if not user or not user.authenticate(payload.password):
        raise HTTPException(status_code=401, detail='Invalid credentials')
    access = create_token({'sub': str(user.id), 'role': user.role, 'type': 'access'}, timedelta(minutes=settings.access_token_expire_minutes))
    refresh = create_token({'sub': str(user.id), 'type': 'refresh'}, timedelta(days=settings.refresh_token_expire_days))
    return TokenResponse(access_token=access, refresh_token=refresh)
