import logging
from config import settings


def setup_logging():
    logging.basicConfig(
        level=settings.LOGGING_LEVEL,
        format="%(asctime)s | %(levelname)s | %(name)s | %(message)s",
    )