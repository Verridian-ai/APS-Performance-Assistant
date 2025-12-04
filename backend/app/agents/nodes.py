from app.core.config import settings
from app.agents.state import AgentState
from app.agents.agent_types import AgentDeps
from app.agents.pydantic_agent import broadband_agent
import cognee
from cognee import SearchType
import os

async def router_node(state: AgentState):
    # Logic to classify intent
    if not state["messages"]:
        return {"next_step": "thinking"}
        
    last_message = state["messages"][-1].content.lower()
    
    # Always retrieve context for APS questions to ensure evidence-based answers
    if any(k in last_message for k in ["aps", "story", "example", "kpi", "wls", "ils", "level", "band", "pay", "rise"]):
        return {"next_step": "retriever"}
    
    if "search" in last_message or "find" in last_message:
        return {"next_step": "retriever"}
    else:
        # Default to retrieval to be safe, or thinking if context is present
        return {"next_step": "retriever"}

async def retriever_node(state: AgentState):
    # Query Cognee
    query = state["messages"][-1].content
    try:
        # Use GRAPH_COMPLETION or INSIGHTS to get relevant nodes
        results = await cognee.search(query_text=query, query_type=SearchType.GRAPH_COMPLETION)
        # Format results as a string
        context = str(results) if results else "No specific documents found in knowledge base."
    except Exception as e:
        context = f"Error retrieving documents: {str(e)}"
        
    return {"current_doc_context": context}

async def thinking_node(state: AgentState):
    # Deep think with Gemini 3 Pro (Optional step for complex reasoning)
    # For now, pass through to generator, but this is where we'd add a "Reasoning" step
    return {"reasoning_trace": ["Analyzing against APS Work Level Standards", "Checking ILS alignment"]}

async def generator_node(state: AgentState):
    # Generate final response using PydanticAI Agent
    messages = state["messages"]
    user_input = messages[-1].content
    context = state.get("current_doc_context", "No context retrieved.")
    
    # Prepare Dependencies
    # We default levels to "Unknown" but a smarter router could extract them
    deps = AgentDeps(
        context=context,
        user_level="Unknown (Assume APS 3/4 based on context)",
        target_level="Unknown (Assume next level up)"
    )
    
    try:
        # Call PydanticAI Agent
        result = await broadband_agent.run(user_input, deps=deps)
        structured_response = result.data
        
        # Format the final response for the chat UI
        # We combine the gap analysis (if any) with the main content
        final_output = structured_response.response_content
        
        if structured_response.gap_analysis:
            final_output += f"\n\n---\n**Gap Analysis Insight:**\n{structured_response.gap_analysis}"
            
        if structured_response.critical_behaviors_missed:
            final_output += f"\n\n**Critical Behaviors Missing:**\n" + "\n".join([f"- {b}" for b in structured_response.critical_behaviors_missed])
            
        return {"messages": [("ai", final_output)]}
        
    except Exception as e:
        return {"messages": [("ai", f"I encountered an error generating the response: {str(e)}")]}
