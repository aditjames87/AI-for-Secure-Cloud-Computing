import os
from sqlalchemy import create_engine, text
from sqlalchemy.exc import OperationalError
from dotenv import load_dotenv

def verify_connection():
    """Loads DATABASE_URL from .env and attempts to connect to the database."""
    load_dotenv()
    db_url = os.getenv("DATABASE_URL")

    if not db_url:
        print("❌ DATABASE_URL not found in .env file.")
        return

    try:
        engine = create_engine(db_url)
        with engine.connect() as connection:
            result = connection.execute(text("SELECT 1"))
            print("✅ Successfully connected to the database and executed a test query.")
    except OperationalError as e:
        print(f"❌ Failed to connect to the database. Error: {e}")

if __name__ == "__main__":
    verify_connection()