from pydantic_settings import BaseSettings
from typing import List


class Settings(BaseSettings):
    APP_NAME: str = "Bhramhlekh API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    DATABASE_URL: str = "postgresql+asyncpg://jyotish_user:jyotish_secret@localhost:5432/jyotish_darshan"
    REDIS_URL: str = "redis://localhost:6379/0"
    SECRET_KEY: str = "your-secret-key-change-in-production"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    ALLOWED_ORIGINS: List[str] = ["http://localhost:3000", "http://localhost:5173"]
    JAVA_SERVICE_URL: str = "http://localhost:8080"
    DEFAULT_AYANAMSA: str = "lahiri"

    # ── Groq AI Configuration ────────────────────────────────
    # Free API key from: https://console.groq.com
    GROQ_API_KEY: str = ""
    GROQ_MODEL: str = "openai/gpt-oss-120b"   # Best quality on free tier
    GROQ_MAX_TOKENS: int = 2048

    class Config:
        env_file = ".env"


settings = Settings()
