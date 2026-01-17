FROM python:3.12-slim

WORKDIR /app

# Install system dependencies (needed for psycopg / Postgres)
RUN apt-get update && apt-get install -y \
    build-essential \
    libpq-dev \
    && rm -rf /var/lib/apt/lists/*

# Install uv
COPY --from=ghcr.io/astral-sh/uv:latest /uv /bin/uv

# Copy dependency files
COPY pyproject.toml uv.lock ./

# Install dependencies (no project install, just deps)
RUN uv sync --frozen --no-install-project

# Copy application code
COPY . .

# Cloud Run listens on 8080
EXPOSE 8080

# Run the application (production-safe)
CMD ["uv", "run", "uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8080"]
