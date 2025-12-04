from langgraph.graph import StateGraph, END
from app.agents.state import AgentState
from app.agents.nodes import router_node, retriever_node, thinking_node, generator_node

workflow = StateGraph(AgentState)

workflow.add_node("router", router_node)
workflow.add_node("retriever", retriever_node)
workflow.add_node("thinking", thinking_node)
workflow.add_node("generator", generator_node)

workflow.set_entry_point("router")

def route_decision(state):
    return state["next_step"]

workflow.add_conditional_edges(
    "router",
    route_decision,
    {
        "retriever": "retriever",
        "thinking": "thinking"
    }
)

workflow.add_edge("retriever", "thinking")
workflow.add_edge("thinking", "generator")
workflow.add_edge("generator", END)

agent_graph = workflow.compile()
