from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
import cognee
from cognee import SearchType
from app.agents.pydantic_agent import broadband_agent
from app.agents.prompt_enhancer import enhancer_agent, EnhancerDeps
from app.agents.agent_types import AgentDeps

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    messages: List[Message]
    conversation_id: Optional[str] = None

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
        
    # 3. Run Main Agent
    deps = AgentDeps(
        context=context,
        user_level="Unknown", # Could extract from history
        target_level="Unknown"
    )
    
    try:
        result = await broadband_agent.run(user_message, deps=deps)
        structured_response = result.data
        
        # 4. Format Output
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
        raise HTTPException(status_code=500, detail=f"Agent execution failed: {str(e)}")

@router.post("/enhance-prompt")
async def enhance_prompt_endpoint(request: EnhanceRequest):
    try:
        deps = EnhancerDeps(draft_prompt=request.prompt)
        result = await enhancer_agent.run(f"Enhance this prompt: {request.prompt}", deps=deps)
        return result.data
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Enhancement failed: {str(e)}")
