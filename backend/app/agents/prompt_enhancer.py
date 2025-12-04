from pydantic import BaseModel, Field
from pydantic_ai import Agent, RunContext
import cognee
from cognee import SearchType
from app.agents.agent_types import AgentDeps
import os

class PromptEnhancerResponse(BaseModel):
    """Response from the Prompt Enhancement Agent."""
    original_prompt: str = Field(..., description="The user's original draft prompt")
    enhanced_prompt: str = Field(..., description="The refined, specific, and context-aware prompt")
    enhancement_logic: str = Field(..., description="Explanation of why the changes were made (e.g. 'Added STAR method requirements')")
    context_used: str = Field(..., description="Summary of the Cognee context that influenced the enhancement")

class EnhancerDeps(BaseModel):
    draft_prompt: str

# Define the Agent
model_id = os.environ.get("LLM_MODEL", "openai/google/gemini-pro-1.5")

enhancer_agent = Agent[EnhancerDeps, PromptEnhancerResponse](
    model=model_id
)

@enhancer_agent.system_prompt
def prompt_architect_instructions(ctx: RunContext[EnhancerDeps]) -> str:
    return """
    You are the **Prompt Architect**, a meta-agent designed to help users write perfect prompts for the **Broadband Advancement Assistant**.
    
    ### 🎯 Your Goal
    Take a user's vague or simple request (e.g., "Write a story about leadership") and transform it into a precise, high-fidelity instruction that leverages the full power of the APS ILS Framework.
    
    ### 🧠 Process
    1.  **Analyze**: Identify the core intent of the draft. Is it a claim? A budget? A risk assessment?
    2.  **Retrieve Context**: You have access to the `cognee` tool. Use it to find the specific *Behavioral Indicators* or *Templates* relevant to the user's topic.
    3.  **Structure**: Apply the **STAR Method** (Situation, Task, Action, Result) requirements if it's a behavioral claim.
    4.  **Refine**:
        *   Be specific about the APS Level (ask the user or infer from context).
        *   Reference specific documents (e.g., "Refer to the APS 6 Profile").
        *   Specify the output format (e.g., "Format this for the Canvas").
    
    ### 🛠️ Tool Usage
    You must use the `retrieve_context` tool to get the ground truth before rewriting the prompt.
    """

@enhancer_agent.tool
async def retrieve_context(ctx: RunContext[EnhancerDeps], query: str) -> str:
    """
    Search the Cognee Knowledge Graph for context relevant to the prompt.
    """
    try:
        # Use graph completion to get a synthesized answer/context about the topic
        results = await cognee.search(query_text=query, query_type=SearchType.GRAPH_COMPLETION)
        return str(results)
    except Exception as e:
        return f"Error retrieving context: {str(e)}"
