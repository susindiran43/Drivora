import os

class Settings:
    PROJECT_NAME: str = "Drivora API"
    VERSION: str = "1.0.0"
    API_PREFIX: str = ""
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./drivora.db")
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "http://localhost:8000",
        "http://127.0.0.1:8000",
        "*",
    ]

settings = Settings()
