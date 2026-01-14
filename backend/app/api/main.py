from fastapi import APIRouter
from app.api.routes.auth import auth_router

api_router = APIRouter()

api_router.include_router(auth_router)

@api_router.get("/")
async def root():
    return {"message": "Hello World"}
