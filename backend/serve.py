import os
import uvicorn
from app.core.config import settings

if __name__ == "__main__":
    host = "0.0.0.0"
    port = int(os.getenv("PORT", settings.LOCAL_API_PORT))
    reload = settings.ENVIRONMENT == "local"

    uvicorn.run(
        "app.main:app",
        host=host,
        port=port,
        reload=reload
    )
