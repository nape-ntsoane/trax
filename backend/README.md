# Trax Backend API

This is the backend API for the Trax job application tracker. It is built with **FastAPI** and follows a layered architecture to ensure scalability, maintainability, and separation of concerns.

## Tech Stack

*   **Framework**: FastAPI
*   **Database**: PostgreSQL
*   **ORM**: SQLAlchemy (Async)
*   **Migrations**: Alembic
*   **Validation**: Pydantic
*   **Authentication**: FastAPI Users (JWT)
*   **Rate Limiting**: SlowAPI

## Project Structure

The project is organized into the following directories:

```
backend/
├── app/
│   ├── api/            # API routes and dependencies
│   │   ├── routes/     # Endpoint definitions (Controllers)
│   │   └── deps.py     # Dependency injection (e.g., DB session, User)
│   ├── core/           # Core configuration (Settings, Auth, Logging)
│   ├── db/             # Database models and session management
│   ├── schemas/        # Pydantic models (Data Transfer Objects)
│   ├── services/       # Business logic layer
│   ├── repositories/   # Data access layer
│   └── scripts/        # Utility scripts (e.g., seeding)
├── alembic/            # Database migration scripts
├── serve.py            # Entry point for running the server
└── ...
```

## Architecture

The API follows a **Controller-Service-Repository** pattern:

1.  **API Routes (Controllers)**:
    *   Located in `app/api/routes`.
    *   Handle HTTP requests and responses.
    *   Validate input using Pydantic schemas.
    *   Call the appropriate Service to perform business logic.

2.  **Services**:
    *   Located in `app/services`.
    *   Contain the business logic of the application.
    *   Orchestrate operations, handle complex rules, and interact with Repositories.

3.  **Repositories**:
    *   Located in `app/repositories`.
    *   Handle direct interactions with the database using SQLAlchemy.
    *   Abstract the database layer from the rest of the application.

4.  **Database Models**:
    *   Located in `app/db/models`.
    *   Define the database schema using SQLAlchemy ORM.

## Key Features

*   **Asynchronous**: Fully async database operations using `asyncpg`.
*   **User Management**: Comprehensive user registration, authentication, and management provided by `fastapi-users`.
*   **Authentication**: Secure JWT-based authentication.
*   **Rate Limiting**: API endpoints are protected against abuse using `SlowAPI`.
*   **Validation**: All incoming and outgoing data is validated using Pydantic models.
*   **CORS**: Configured to allow requests from the frontend application.
*   **Migrations**: Database schema changes are managed and versioned using `Alembic`.

## Setup & Usage

Refer to the main project `README.md` for setup and usage instructions.
