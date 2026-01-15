import logging
import sys
from app.core.config import settings


logger = logging.getLogger() # root logger
LOG_FORMAT = "%(asctime)s | %(levelname)s | %(name)s | %(message)s"

formatter = logging.Formatter(
    fmt=LOG_FORMAT
)

#handlers
# stream_handler = logging.StreamHandler(stream=sys.stdout)
file_handler = logging.FileHandler(filename=settings.LOGGING_FILE)

# set the formats
# stream_handler.setFormatter(formatter)
file_handler.setFormatter(formatter)

# add handlers to the root logger
# logger.addHandler(stream_handler)
logger.addHandler(file_handler)

logger.setLevel(settings.LOGGING_LEVEL)