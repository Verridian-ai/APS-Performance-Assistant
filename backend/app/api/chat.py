from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import logging
import traceback
import cognee
from cognee import SearchType
from app.agents.pydantic_agent import broadband_agent
from app.agents.prompt_enhancer import enhancer_agent, EnhancerDeps
from app.agents.agent_types import AgentDeps, GapAnalysisResponse

# Configure logging
logger = logging.getLogger(__name__)

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    conversation_id: Optional[str] = None
    user_level: Optional[str] = None
    target_level: Optional[str] = None

class EnhanceRequest(BaseModel):
    prompt: str

@router.post("/chat")
async def chat_endpoint(request: ChatRequest):
    # 1. Extract user query
    if not request.messages:
        raise HTTPException(status_code=400, detail="No messages provided")
        
    user_message = request.messages[-1].content
    
    # 2. Retrieve Context (RAG)
    context = "No context retrieved."
    try:
        # Use GRAPH_COMPLETION for rich context
        results = await cognee.search(query_text=user_message, query_type=SearchType.GRAPH_COMPLETION)
        if results:
            context = str(results)
    except Exception as e:
        print(f"Context retrieval error: {e}")
        # Continue without context rather than failing
        
    # 3. Run Main Agent - use provided levels or extract from message context
    user_level = request.user_level or "Unknown"
    target_level = request.target_level or "Unknown"

    # Try to infer levels from conversation if not provided
    if user_level == "Unknown" or target_level == "Unknown":
        full_context = " ".join([m.content.lower() for m in request.messages])
        aps_levels = ["aps 1", "aps 2", "aps 3", "aps 4", "aps 5", "aps 6", "el 1", "el 2", "ses"]
        for level in aps_levels:
            if f"i am {level}" in full_context or f"i'm {level}" in full_context or f"currently {level}" in full_context:
                user_level = level.upper()
            if f"to {level}" in full_context or f"for {level}" in full_context or f"target {level}" in full_context:
                target_level = level.upper()

    deps = AgentDeps(
        context=context,
        user_level=user_level,
        target_level=target_level
    )
    
    try:
        result = await broadband_agent.run(user_message, deps=deps)
        structured_response = result.data

        # 4. Format Output - validate response data
        if not structured_response or not structured_response.response_content:
            logger.warning("Agent returned empty response, using fallback")
            return {
                "message": {"role": "assistant", "content": "I apologize, but I couldn't generate a proper response. Please try rephrasing your question."},
                "artifact": None
            }

        final_output = structured_response.response_content

        if structured_response.gap_analysis:
            final_output += f"\n\n---\n**Gap Analysis Insight:**\n{structured_response.gap_analysis}"

        if structured_response.critical_behaviors_missed:
            final_output += f"\n\n**Critical Behaviors Missing:**\n" + "\n".join([f"- {b}" for b in structured_response.critical_behaviors_missed])

        return {
            "message": {"role": "assistant", "content": final_output},
            "artifact": None
        }
    except Exception as e:
        logger.error(f"Agent execution failed: {str(e)}")
        logger.error(traceback.format_exc())

        # Provide a helpful fallback response instead of crashing
        fallback_response = generate_fallback_response(user_message)
        return {
            "message": {"role": "assistant", "content": fallback_response},
            "artifact": None
        }


def generate_fallback_response(query: str) -> str:
    """Generate a helpful fallback response when the AI agent fails."""
    query_lower = query.lower()

    if any(word in query_lower for word in ["aps", "level", "promotion", "advancement"]):
        return """I'm here to help with your APS career advancement questions.

The Australian Public Service uses the Integrated Leadership System (ILS) to define capabilities at each level. Key areas include:

• **Shapes Strategic Thinking** - Vision, strategic focus, and innovation
• **Achieves Results** - Delivery, business acumen, and decision making
• **Cultivates Productive Working Relationships** - Communication and collaboration
• **Exemplifies Personal Drive and Integrity** - Personal accountability and self-management

Could you please provide more details about:
- Your current APS level
- Your target level for advancement
- Specific capabilities or behaviors you'd like help with?"""

    if any(word in query_lower for word in ["goal", "kpi", "performance", "smart"]):
        return """I can help you with performance goals and KPIs.

For effective APS performance goals, consider the SMART framework:
• **S**pecific - Clear and well-defined objectives
• **M**easurable - Quantifiable outcomes
• **A**chievable - Realistic within your role
• **R**elevant - Aligned with team and agency priorities
• **T**ime-bound - Clear deadlines

What specific aspect of performance goal-setting would you like help with?"""

    return """Thank you for your question. I'm your APS Performance Assistant, designed to help with:

• **Career Advancement** - Understanding ILS capabilities and behavioral indicators
• **Performance Goals** - Creating SMART goals aligned with APS frameworks
• **Self-Assessment** - Drafting responses using the STAR method
• **Gap Analysis** - Identifying areas for development

Please try rephrasing your question with more specific details, and I'll do my best to assist you."""

@router.post("/enhance-prompt")
async def enhance_prompt_endpoint(request: EnhanceRequest):
    try:
        if not request.prompt or not request.prompt.strip():
            raise HTTPException(status_code=400, detail="Prompt cannot be empty")

        deps = EnhancerDeps(draft_prompt=request.prompt)
        result = await enhancer_agent.run(f"Enhance this prompt: {request.prompt}", deps=deps)

        if not result or not result.data:
            logger.warning("Enhancer returned empty response")
            return {
                "original_prompt": request.prompt,
                "enhanced_prompt": request.prompt,
                "enhancement_logic": "Could not enhance the prompt at this time",
                "context_used": "None"
            }

        return result.data
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Enhancement failed: {str(e)}")
        logger.error(traceback.format_exc())
        # Return original prompt if enhancement fails
        return {
            "original_prompt": request.prompt,
            "enhanced_prompt": request.prompt,
            "enhancement_logic": f"Enhancement unavailable: {str(e)}",
            "context_used": "None"
        }
