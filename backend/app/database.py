import os
from sqlalchemy.ext.asyncio import AsyncSession, create_async_engine
from sqlalchemy.orm import sessionmaker, declarative_base

# Get DB URL from env (set in main.py or env vars)
DATABASE_URL = os.getenv("DB_CONNECTION_STRING")
if not DATABASE_URL:
    # Fallback for safety if env var not loaded yet
    DATABASE_URL = "postgresql+asyncpg://neondb_owner:npg_lFMfi7m9ySXw@ep-noisy-tooth-a7wi6ams-pooler.ap-southeast-2.aws.neon.tech:5432/neondb?ssl=require"

engine = create_async_engine(
    DATABASE_URL,
    echo=True,
    pool_pre_ping=True,  # Verify connection before usage
    pool_recycle=300,    # Recycle connections every 5 minutes to avoid stale timeouts
    pool_size=20,
    max_overflow=10
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine,
    class_=AsyncSession
)

Base = declarative_base()

async def get_db():
    print("DEBUG: get_db called")
    async with SessionLocal() as session:
        try:
            print("DEBUG: Session created")
            yield session
        except Exception as e:
            print(f"DEBUG: Error in session: {e}")
            raise
        finally:
            print("DEBUG: Closing session")
            await session.close()
