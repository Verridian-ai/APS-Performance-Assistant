from pydantic_ai import Agent, RunContext
from app.agents.agent_types import AgentDeps, GapAnalysisResponse
from app.agents.prompts import SYSTEM_PROMPT
import os

# Debug: Check API Key availability
api_key = os.environ.get("OPENAI_API_KEY") or os.environ.get("LLM_API_KEY")
# Ensure OPENAI_API_KEY is set for the underlying library
if api_key and not os.environ.get("OPENAI_API_KEY"):
    os.environ["OPENAI_API_KEY"] = api_key

print(f"DEBUG: pydantic_agent loading... API Key available: {bool(api_key)}")
if api_key:
    print(f"DEBUG: API Key prefix: {api_key[:8]}...")

# Define the PydanticAI Agent
# Use the model ID directly. pydantic-ai will use the OPENAI_API_KEY env var.
model_id = os.environ.get("LLM_MODEL", "gpt-4o")

# Initialize the agent
broadband_agent = Agent[AgentDeps, GapAnalysisResponse](
    model=model_id
)

@broadband_agent.system_prompt
def add_ils_context(ctx: RunContext[AgentDeps]) -> str:
    """
    Dynamic system prompt that injects the retrieved ILS context and user metadata.
    This implements the 'Gap Analysis Engine' logic by ensuring the AI always has the 
    source of truth and the user's specific scenario.
    """
    # We inject the static rigorous prompt instructions but augment them with dynamic data
    # We strip the placeholder from the raw string to avoid confusion
    base_prompt = SYSTEM_PROMPT.replace("{context}", "")
    
    formatted_prompt = f"""
    {base_prompt}
    
    ### 🔍 Current Session Context
    - **User Current Level**: {ctx.deps.user_level}
    - **Target Level**: {ctx.deps.target_level}
    
    ### 📚 Retrieved ILS Knowledge (Source of Truth)
    {ctx.deps.context}
    
    ### 🛡️ Strict Output Requirement
    You MUST return your response in the structured JSON format defined by the schema.
    Ensure 'response_content' contains the helpful text (Draft/Coaching) in Markdown.
    If you identify a gap, fill 'gap_analysis' with a clear explanation.
    """
    return formatted_prompt
