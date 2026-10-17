"""
Drivora Configuration Module
Centralized settings management supporting environment variable overrides.
"""
import os
from typing import List


class Settings:
    PROJECT_NAME: str = "Drivora API"
    DESCRIPTION: str = "Drivora — Premium Car Rental Platform API. Drive. Rent. Explore."
    VERSION: str = "1.0.0"
    API_PREFIX: str = ""
    
    # Database Configuration
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./drivora.db")
    
    # CORS Configuration
    CORS_ORIGINS: List[str] = [
        origin.strip()
        for origin in os.getenv(
            "CORS_ORIGINS",
            "http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000,http://127.0.0.1:3000,http://localhost:8000,http://127.0.0.1:8000,*",
        ).split(",")
        if origin.strip()
    ]


settings = Settings()
