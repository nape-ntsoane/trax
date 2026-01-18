import secrets
from typing import Annotated, Any, Literal
from pydantic import AnyUrl, BeforeValidator, PostgresDsn, computed_field
from pydantic_settings import BaseSettings, SettingsConfigDict


def parse_cors(v: Any) -> list[str] | str:
    if isinstance(v, str) and not v.startswith("["):
        return [i.strip() for i in v.split(",") if i.strip()]
    elif isinstance(v, list | str):
        return v
    raise ValueError(v)

class Settings(BaseSettings):
    model_config = SettingsConfigDict(
        # Only for local/dev, ignored if env vars are set (e.g., in Render)
        env_file="../.env",
        env_ignore_empty=False,
        extra="ignore",
    )

    # Security
    SECRET_KEY: str = secrets.token_urlsafe(32)
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24 * 8

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
    PROJECT_NAME: str = ""

    # Production
    DATABASE_URL: str = ""

    # Logging
    LOGGING_LEVEL: str = "INFO"
    LOGGING_FILE: str = "app.log"

    # API
    API_PREFIX: str = ""

    # FastAPI host/port for dev (ignored in production)
    LOCAL_API_DOMAIN: str = "0.0.0.0"
    LOCAL_API_PORT: int = 5000


settings = Settings()
