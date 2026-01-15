from fastapi import Request
from app.core.logging import logger
import time


# on every request
async def log_middleware(
        request: Request,
        call_next
):
    start = time.time(

    )
    response = await call_next(request)
    # await asyncio.sleep(3)
    process_time = time.time() - start
    log_dict = {
        "url": request.url.path,
        "method": request.method,
        "process_time": process_time,
    }
    logger.info(log_dict, extra=log_dict) # extracting to top level keys

    return response