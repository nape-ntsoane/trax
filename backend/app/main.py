from fastapi import FastAPI
from fastapi.routing import APIRoute
from starlette.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager

from app.api.routes.limiter import limiter
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from app.api.main import api_router
from app.core.config import settings
from app.db.init import create_db_and_tables


@asynccontextmanager
async def lifespan(app: FastAPI):
   await create_db_and_tables()
   yield


app = FastAPI(
    title=settings.PROJECT_NAME,
    lifespan=lifespan,

    docs_url = None if settings.ENVIRONMENT == "production" else "/docs",
    redoc_url = None if settings.ENVIRONMENT == "production" else "/redoc"
)

# Set all CORS enabled origins
if settings.all_cors_origins:
    app.add_middleware(
        CORSMiddleware,
        allow_origins=settings.all_cors_origins,
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

app.include_router(api_router, prefix=settings.API_PREFIX)


app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host=settings.LOCAL_API_DOMAIN, port=settings.LOCAL_API_PORT, reload=True)
