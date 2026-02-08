from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from src.api.task_router import router as task_router
from src.api.auth_router import router as auth_router
from src.api.task_completion_router import router as task_completion_router
from src.api.user_router import router as user_router
from src.database.connection import create_db_and_tables
import uvicorn


def create_app() -> FastAPI:
    app = FastAPI(
        title="Todo App - Database API",
        description="API for user and task management with Neon PostgreSQL",
        version="1.0.0",
    )

    # Add CORS middleware
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],  # In production, replace with specific origins
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    # Include routers
    app.include_router(auth_router, prefix="/api")
    app.include_router(user_router, prefix="/api")
    app.include_router(task_router, prefix="/api")
    app.include_router(task_completion_router, prefix="/api")

    @app.on_event("startup")
    def on_startup():
        create_db_and_tables()

    @app.get("/")
    def read_root():
        return {"message": "Todo App Database Service"}

    @app.get("/health")
    def health_check():
        return {"status": "healthy"}

    return app


app = create_app()


if __name__ == "__main__":
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)