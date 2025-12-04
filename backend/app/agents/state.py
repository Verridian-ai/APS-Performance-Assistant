from typing import TypedDict, Annotated, List, Union
import operator
from langchain_core.messages import BaseMessage

class AgentState(TypedDict):
    messages: Annotated[List[BaseMessage], operator.add]
    next_step: str
    reasoning_trace: List[str]
    current_doc_context: str
