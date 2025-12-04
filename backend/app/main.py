from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os

# Load env variables
load_dotenv()

# --- Cognee Configuration (Must match Ingestion Pipeline) ---
# LLM: Native OpenAI (Flagship)
# Try standard env var first, then fallback to the one in credentials.md
os.environ["LLM_API_KEY"] = os.getenv("OPENAI_API_KEY") or os.getenv("OPEN_AI_API_KEY", "")
# Note: dotenv loads 'open_ai_api_key' but we standardizing to 'LLM_API_KEY'
os.environ["LLM_PROVIDER"] = "openai"
# os.environ["OPENAI_API_BASE"] = "https://api.openai.com/v1" # Default

# User requested "GPT-4.1".
os.environ["LLM_MODEL"] = "gpt-4o" 

os.environ["OPENAI_API_KEY"] = os.environ["LLM_API_KEY"]

# Embeddings: OpenAI Native
os.environ["EMBEDDING_PROVIDER"] = "openai"
os.environ["EMBEDDING_API_KEY"] = os.environ["LLM_API_KEY"]
os.environ["EMBEDDING_MODEL"] = "text-embedding-3-large"

# Database: Neon Postgres (Cloud)
# Using asyncpg driver for Cognee
os.environ["DB_PROVIDER"] = "postgres"
# Added port :5432 explicitely to avoid SQLAlchemy parsing error
os.environ["DB_CONNECTION_STRING"] = "postgresql+asyncpg://neondb_owner:npg_lFMfi7m9ySXw@ep-noisy-tooth-a7wi6ams-pooler.ap-southeast-2.aws.neon.tech:5432/neondb?ssl=require"

# Explicitly set components and variants to ensure connection
os.environ["DB_HOST"] = "ep-noisy-tooth-a7wi6ams-pooler.ap-southeast-2.aws.neon.tech"
os.environ["DB_PORT"] = "5432"
os.environ["DB_NAME"] = "neondb"
os.environ["DB_USER"] = "neondb_owner"
os.environ["DB_USERNAME"] = "neondb_owner"
os.environ["POSTGRES_USER"] = "neondb_owner"
os.environ["PGUSER"] = "neondb_owner"
os.environ["DB_PASSWORD"] = "npg_lFMfi7m9ySXw"
os.environ["POSTGRES_PASSWORD"] = "npg_lFMfi7m9ySXw"
os.environ["PGPASSWORD"] = "npg_lFMfi7m9ySXw"
os.environ["DB_SSL_MODE"] = "require"
os.environ["PGSSLMODE"] = "require"

if "EMBEDDING_ENDPOINT" in os.environ:
    del os.environ["EMBEDDING_ENDPOINT"]
os.environ["TIKTOKEN_ENCODING_NAME"] = "cl100k_base"

# Import Cognee AFTER config to ensure it picks up the new settings
try:
    import cognee
except ImportError:
    cognee = None
    print("Warning: Cognee not installed. RAG features will be limited.")

# Import API routers
from app.api.chat import router as chat_router
from app.api.auth import router as auth_router
from app.database import engine, Base
# Import models so they are registered with Base
from app.models import user as user_models

app = FastAPI(title="Broadband Advancement Assistant API", version="1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API routers
app.include_router(chat_router, prefix="/api", tags=["chat"])
app.include_router(auth_router, prefix="/api/auth", tags=["auth"])

@app.on_event("startup")
async def startup():
    # Create tables (Dev only - use Alembic for prod)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

@app.get("/")
async def root():
    return {"message": "Broadband Advancement Assistant API is running"}

@app.get("/health")
async def health():
    return {"status": "healthy", "cognee_available": cognee is not None}

@app.get("/debug-env")
async def debug_env():
    key = os.environ.get("OPENAI_API_KEY", "")
    return {
        "OPENAI_API_KEY_PRESENT": bool(key),
        "OPENAI_API_KEY_PREFIX": key[:10] if key else None,
        "LLM_MODEL": os.environ.get("LLM_MODEL")
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
