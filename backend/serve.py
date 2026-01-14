from app.core.config import settings


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.LOCAL_API_DOMAIN, port=settings.LOCAL_API_PORT, reload=True)

