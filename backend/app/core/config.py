import secrets
from typing import Annotated, Any, Literal
from pydantic import AnyUrl, BeforeValidator, PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict
from dotenv import load_dotenv
import os

# Load .env for local dev only
if os.getenv("ENVIRONMENT") != "production":
    load_dotenv("../.env")


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",") if i.strip()]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)


class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # For local dev only; ignored if env vars are set
        env_file="../.env",
        env_ignore_empty=True,
        extra="ignore",
    )

    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8  # 8 days

    # Environment
    ENVIRONMENT: Literal["local", "test", "production"] = "local"

    # Frontend & CORS
    FRONTEND_HOST: str = "http://localhost:5173"
    BACKEND_CORS_ORIGINS: Annotated[list[AnyUrl] | str, BeforeValidator(parse_cors)] = []

    @computed_field
    @property
    def all_cors_origins(self) -> list[str]:
        return [str(origin).rstrip("/") for origin in self.BACKEND_CORS_ORIGINS] + [
            self.FRONTEND_HOST
        ]

    # Project info
    PROJECT_NAME: str

    # Postgres config (local/dev)
    POSTGRES_SERVER: str
    POSTGRES_PORT: int = 5432
    POSTGRES_USER: str
    POSTGRES_PASSWORD: str = ""
    POSTGRES_DB: str = ""

    @computed_field
    @property
    def SQLALCHEMY_DATABASE_URI(self) -> PostgresDsn:
        return PostgresDsn.build(
            scheme="postgresql+psycopg",
            username=self.POSTGRES_USER,
            password=self.POSTGRES_PASSWORD,
            host=self.POSTGRES_SERVER,
            port=self.POSTGRES_PORT,
            path=self.POSTGRES_DB,
        )

    # Production database
    PRODUCTION_DATABASE_URI: str | None = None

    @computed_field
    @property
    def DATABASE_URI(self) -> str:
        """
        Returns the correct database URI depending on ENVIRONMENT.
        - Production: use env-injected production DB (Supabase)
        - Test / Dev: use local Postgres
        """
        if self.ENVIRONMENT == "production":
            if not self.PRODUCTION_DATABASE_URI:
                raise ValueError("PRODUCTION_DATABASE_URI must be set in production!")
            return self.PRODUCTION_DATABASE_URI
        return self.SQLALCHEMY_DATABASE_URI

    # Logging
    LOGGING_LEVEL: str = "INFO"
    LOGGING_FILE: str = "app.log"

    # API
    API_PREFIX: str = ""

    # FastAPI host/port for dev (ignored in production)
    LOCAL_API_DOMAIN: str = "0.0.0.0"
    LOCAL_API_PORT: int = 5000


settings = Settings()
