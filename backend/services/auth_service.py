"""Lógica de autenticación.
Autor: Kevin
Versión: 1.0.0
"""
from datetime import timedelta
import logging
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from backend.config import settings
from backend.core.security import create_token, hash_password
from backend.models.user import User

logger = logging.getLogger(__name__)
TOKEN_BLACKLIST: set[str] = set()


class AuthService:
    """Servicio para login y tokens."""

    @staticmethod
    async def login(db: AsyncSession, username: str, password: str) -> tuple[str, str, User]:
        """Autentica usuario y retorna tokens."""
        user = (await db.execute(select(User).where(User.username == username, User.is_active == True))).scalar_one_or_none()
        if not user or not user.authenticate(password):
            logger.error("Login fallido para usuario=%s", username)
            raise ValueError("Credenciales inválidas")
        access = create_token({"sub": str(user.id), "type": "access"}, timedelta(minutes=settings.access_token_expire_minutes))
        refresh = create_token({"sub": str(user.id), "type": "refresh"}, timedelta(days=settings.refresh_token_expire_days))
        logger.info("Login exitoso usuario=%s", username)
        return access, refresh, user

    @staticmethod
    async def create_user_password(password: str) -> str:
        """Hashea password de usuario."""
        return hash_password(password)
