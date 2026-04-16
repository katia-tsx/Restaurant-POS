"""Configuración central de la aplicación.
Autor: Johan
Versión: 1.0.0
"""
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Variables de entorno del sistema POS."""

    app_name: str = "POS Restaurante"
    app_version: str = "1.0.0"
    debug: bool = True
    host: str = "0.0.0.0"
    port: int = 8000
    database_url: str = "sqlite+aiosqlite:///./database/pos_restaurant.db"
    secret_key: str = "change-me"
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 480
    refresh_token_expire_days: int = 7
    allowed_origins: str = "http://localhost:5173,http://localhost:3000"

    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origins(self) -> list[str]:
        """Retorna los orígenes CORS permitidos."""
        return [o.strip() for o in self.allowed_origins.split(",") if o.strip()]


settings = Settings()
