from typing import List, Optional
from dotenv import load_dotenv
import os
from pydantic import AnyHttpUrl, PostgresDsn, computed_field
from pydantic_core import MultiHostUrl
from pydantic_settings import BaseSettings

class AppSettings(BaseSettings):
    load_dotenv()

    # Modify to restrict to origin of your choice
    BACKEND_CORS_ORIGINS: List[AnyHttpUrl | str] = [
        "*",
        # "http://localhost:3000"
    ]

    # Ollama API settings
    USE_OLLAMA: bool = os.getenv("USE_OLLAMA", True)
    OLLAMA_ENDPOINT: str = os.getenv("OLLAMA_ENDPOINT", "http://localhost:11434/")
    OLLAMA_MODEL: str = os.getenv("OLLAMA_MODEL", "llama3.2:3b")

    # OpenAI API settings
    OPENAI_API_KEY: str = os.getenv("OPENAI_API_KEY", "")
    OPENAI_EMBEDDING_MODEL: str = os.getenv("OPENAI_EMBEDDING_MODEL", "text-embedding-3-small")
    OPENAI_MODEL: str = os.getenv("OPENAI_MODEL", "gpt-4o-mini")

    # Redis connection settings
    REDIS_HOST: str = os.getenv("REDIS_HOST", "localhost")
    REDIS_PORT: int = os.getenv("REDIS_PORT", 6379)
    REDIS_USER: Optional[str] = os.getenv("REDIS_USER", "user")
    REDIS_DB: int = os.getenv("REDIS_DB", 0)
    REDIS_PASSWORD: Optional[str] = os.getenv("REDIS_PASSWORD", None)  # Optional password for Redis

    # Database URL settings
    DB_USER: str = os.getenv("DB_USER", "user")
    DB_PASS: str = os.getenv("DB_PASS", "password")
    DB_HOST: str = os.getenv("DB_HOST", "localhost")
    DB_PORT: int = os.getenv("DB_PORT", 5432)
    DB_NAME: str = os.getenv("DB_NAME", "my_postgres")
    
    # Mailer Send for Emails
    MAILER_SEND_API_KEY: str = os.getenv("MAILER_SEND_API_KEY", "")
    MAILER_SEND_DOMAIN: str = os.getenv("MAILER_SEND_DOMAIN", "")


    @computed_field
    @property
    def DATABASE_URL(self) -> PostgresDsn:
        return f"postgresql://{self.DB_USER}:{self.DB_PASS}@{self.DB_HOST}:{self.DB_PORT}/{self.DB_NAME}"

# Exporting for use
settings = AppSettings()