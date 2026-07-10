from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from dotenv import load_dotenv
import os

load_dotenv()

DATABASE_URL = os.getenv("DATABASE_URL")

engine = create_engine(
    DATABASE_URL,
    echo=True
)

print("=" * 50)
print("DATABASE_URL =", DATABASE_URL)
print("=" * 50)

SessionLocal = sessionmaker(
    autoflush=False,
    autocommit=False,
    bind=engine
)

# SQLAlchemy Base
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()