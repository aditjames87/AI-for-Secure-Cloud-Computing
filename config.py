import os
from dotenv import load_dotenv

# Load environment variables from .env
load_dotenv()


class Settings:
    """Application configuration."""

    # Application
    PROJECT_NAME: str = "AI for Secure Cloud Computing"
    PROJECT_VERSION: str = "1.0.0"

    # Database
    DATABASE_URL: str = os.getenv(
        "DATABASE_URL",
        "postgresql://postgres:password@localhost:5432/appdb",
    )

    # Security
    SECRET_KEY: str = os.getenv(
        "SECRET_KEY",
        "change_this_secret_key_in_production",
    )
    ALGORITHM: str = os.getenv("ALGORITHM", "HS256")

    ACCESS_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("ACCESS_TOKEN_EXPIRE_MINUTES", "30")
    )

    REFRESH_TOKEN_EXPIRE_MINUTES: int = int(
        os.getenv("REFRESH_TOKEN_EXPIRE_MINUTES", "10080")  # 7 days
    )

    # Machine Learning
    MODEL_PATH: str = os.getenv(
        "MODEL_PATH",
        "models/model.pkl",
    )


# Global settings instance
settings = Settings()