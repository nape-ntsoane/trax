from fastapi import APIRouter
from app.api.routes.auth import auth_router
from app.api.routes.folder import folder_router
from app.api.routes.application import application_router
from app.api.routes.selects import selects_router
from app.api.routes.search import search_router

api_router = APIRouter()

api_router.include_router(auth_router)
api_router.include_router(folder_router, prefix="/folders", tags=["folders"])
api_router.include_router(application_router, prefix="/applications", tags=["applications"])
api_router.include_router(selects_router, prefix="/selects", tags=["selects"])
api_router.include_router(search_router, prefix="/search", tags=["search"])

@api_router.get("/")
async def root():
    return {"message": "Hello World"}
