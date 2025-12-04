import os
from pydantic import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "Broadband Advancement Assistant"
    API_V1_STR: str = "/api/v1"
    
    GOOGLE_API_KEY: str = os.getenv("GOOGLE_API_KEY", "")
    COGNEE_API_KEY: str = os.getenv("COGNEE_API_KEY", "")
    
    # Models
    REASONING_MODEL: str = "gemini-3-pro-preview"
    ROUTER_MODEL: str = "gemini-2.5-flash"
    EMBEDDING_MODEL: str = "text-embedding-004"

    class Config:
        case_sensitive = True

settings = Settings()
