from logging.config import fileConfig
from alembic import context

import os
import sys
from dotenv import load_dotenv

# -------------------------------------------------------
# Make backend folder importable
# -------------------------------------------------------
BASE_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
sys.path.insert(0, BASE_DIR)

# -------------------------------------------------------
# Database
# -------------------------------------------------------
from app.database.db import Base

# -------------------------------------------------------
# Import models ONCE so SQLAlchemy discovers them
# -------------------------------------------------------
import app.models.user
import app.models.server
import app.models.attack
import app.models.prediction
import app.models.resource


config = context.config

if config.config_file_name is not None:
    fileConfig(config.config_file_name)

target_metadata = Base.metadata

# other values from the config, defined by the needs of env.py,
# can be acquired:
# my_important_option = config.get_main_option("my_important_option")
# ... etc.
load_dotenv()
DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://postgres:7193@localhost:5432/secure_cloud_ai")

# The following print statement is for debugging purposes during migration.
# It can be removed in production.
# import sys
# print(f"DATABASE_URL from env.py: {DATABASE_URL}", file=sys.stderr)
config.set_main_option("sqlalchemy.url", DATABASE_URL)

def run_migrations_offline() -> None:
    """Run migrations in 'offline' mode.

    This configures the context with just a URL
    and not an Engine, though an Engine is acceptable
    here as well.  By skipping the Engine creation
    we don't even need a DBAPI to be available.

    Calls to context.execute() here emit the given string to the
    script output.

    """
    url = config.get_main_option("sqlalchemy.url")
    context.configure(
        url=url,
        target_metadata=target_metadata,
        literal_binds=True,
        dialect_opts={"paramstyle": "named"},
    )

    with context.begin_transaction():
        context.run_migrations()


def run_migrations_online() -> None:
    """Run migrations in 'online' mode.

    In this scenario we need to create an Engine
    and associate a connection with the context.

    """
    from sqlalchemy import create_engine
    connectable = create_engine(DATABASE_URL)

    with connectable.connect() as connection:
        context.configure(
            connection=connection, target_metadata=target_metadata
        )

        with context.begin_transaction():
            context.run_migrations()


if context.is_offline_mode():
    run_migrations_offline()
else:
    run_migrations_online()
