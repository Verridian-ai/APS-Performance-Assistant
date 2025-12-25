import os
from dotenv import load_dotenv
import traceback

# Load env and configure BEFORE importing cognee
load_dotenv()

# --- LLM Configuration (Native OpenAI) ---
# Load API key from environment variable
os.environ["LLM_API_KEY"] = os.getenv("OPENAI_API_KEY", "")
os.environ["LLM_PROVIDER"] = "openai"
# os.environ["OPENAI_API_BASE"] = "https://api.openai.com/v1" 

# Use GPT-4o as the model (gpt-4.1 is not a valid OpenAI model ID)
os.environ["LLM_MODEL"] = "gpt-4o" 
os.environ["OPENAI_API_KEY"] = os.environ["LLM_API_KEY"]

# --- Embedding Configuration ---
os.environ["EMBEDDING_PROVIDER"] = "openai"
os.environ["EMBEDDING_API_KEY"] = os.environ["LLM_API_KEY"]
os.environ["EMBEDDING_MODEL"] = "text-embedding-3-large"
# os.environ["OPENAI_API_BASE"] = "https://api.openai.com/v1"

# --- Database Configuration (Neon Postgres) ---
os.environ["DB_PROVIDER"] = "postgres"

# Restore explicit components to fix "ValueError: None" port issue
os.environ["DB_HOST"] = "ep-noisy-tooth-a7wi6ams-pooler.ap-southeast-2.aws.neon.tech"
os.environ["DB_PORT"] = "5432"
os.environ["DB_NAME"] = "neondb"

# Set all common user/pass variants to catch what Cognee expects
os.environ["DB_USER"] = "neondb_owner"
os.environ["DB_USERNAME"] = "neondb_owner"
os.environ["POSTGRES_USER"] = "neondb_owner"
os.environ["PGUSER"] = "neondb_owner"

os.environ["DB_PASSWORD"] = "npg_lFMfi7m9ySXw"
os.environ["POSTGRES_PASSWORD"] = "npg_lFMfi7m9ySXw"
os.environ["PGPASSWORD"] = "npg_lFMfi7m9ySXw"

os.environ["DB_SSL_MODE"] = "require"
os.environ["PGSSLMODE"] = "require"

# Full connection string with SSL
os.environ["DB_CONNECTION_STRING"] = "postgresql+asyncpg://neondb_owner:npg_lFMfi7m9ySXw@ep-noisy-tooth-a7wi6ams-pooler.ap-southeast-2.aws.neon.tech:5432/neondb?ssl=require"

print(f"DEBUG: DB_CONNECTION_STRING={os.environ.get('DB_CONNECTION_STRING')}")

# Ensure standard tokenizer is set just in case
os.environ["TIKTOKEN_ENCODING_NAME"] = "cl100k_base" 

import cognee
from typing import List
from pathlib import Path

# --- Custom Cognify Prompt for APS ILS Framework ---
APS_COGNIFY_PROMPT = """
You are an expert Knowledge Graph Engineer for the Australian Public Service (APS).
Your task is to extract structured knowledge from the provided text.

**Extract the following Entities:**
1.  **APS Level**: (e.g., "APS 3", "APS 4", "EL 1", "SES Band 1").
2.  **Capability Cluster**: (e.g., "Shapes Strategic Thinking", "Achieves Results").
3.  **Specific Capability**: (e.g., "Inspires a sense of purpose", "Nurtures internal relationships").
4.  **Behavioral Indicator**: Specific actions or observable behaviors described in the text (e.g., "Translates high-level goals into tasks").
5.  **Role**: (e.g., "Team Leader", "Policy Officer").

**Extract the following Relationships:**
-   `APS Level` -- *requires* --> `Capability Cluster`
-   `Capability Cluster` -- *contains* --> `Specific Capability`
-   `Specific Capability` -- *demonstrated_by* --> `Behavioral Indicator`
-   `Behavioral Indicator` -- *is_critical_for* --> `APS Level`
"""

async def list_files(directory_path: str) -> List[Path]:
    p = Path(directory_path)
    files = []
    for ext in ["*.pdf", "*.docx", "*.md", "*.txt"]:
        files.extend(list(p.rglob(ext)))
    return files

async def ingest_aps_docs(directory_path: str):
    print(f"Starting ingestion from {directory_path}...")
    
    # Optional: Prune if needed
    # try:
    #     print("Pruning old data...")
    #     await cognee.prune.prune_data()
    # except Exception as e:
    #     print(f"Prune warning (safe to ignore): {e}")

    files = await list_files(directory_path)
    
    if not files:
        print("No files found to ingest.")
        return

    file_paths = [str(f.resolve()) for f in files]
    print(f"Found {len(file_paths)} files.")
    
    try:
        # Add files to Cognee
        print("Adding files to Cognee (Relational + Vector Store)...")
        await cognee.add(file_paths, dataset_name="aps_ils_framework")
        print("Successfully added files to Cognee.")
        
    except Exception as e:
        print(f"CRITICAL ERROR adding files: {e}")
        traceback.print_exc()
        return

    # Cognify (Build Relations) with custom APS prompt
    print("Cognifying data with Custom APS Prompt (Graph Store)...")
    try:
        # Pass the custom APS prompt for better entity/relationship extraction
        await cognee.cognify(graph_model_prompt=APS_COGNIFY_PROMPT)
        print("Ingestion Complete.")
    except Exception as e:
        print(f"CRITICAL ERROR during Cognify: {e}")
        traceback.print_exc()

def get_documents_path() -> str:
    """Get the documents path relative to the project root."""
    # First try relative path from this file
    current_dir = Path(__file__).parent.parent.parent.parent  # Go up to project root
    docs_path = current_dir / "documents"
    if docs_path.exists():
        return str(docs_path)

    # Fallback to environment variable
    env_path = os.getenv("DOCUMENTS_PATH")
    if env_path and os.path.exists(env_path):
        return env_path

    # Final fallback - check common locations
    common_paths = [
        "/home/user/APS-Performance-Assistant/documents",
        "./documents",
        "../documents",
    ]
    for path in common_paths:
        if os.path.exists(path):
            return path

    return "./documents"  # Default

if __name__ == "__main__":
    import asyncio
    docs_path = get_documents_path()
    print(f"Using documents path: {docs_path}")
    if os.path.exists(docs_path):
        asyncio.run(ingest_aps_docs(docs_path))
    else:
        print(f"Directory not found: {docs_path}")
        print("Please set DOCUMENTS_PATH environment variable or place documents in the 'documents' folder.")
