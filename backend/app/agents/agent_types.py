from pydantic import BaseModel, Field
from typing import List, Optional

class GapAnalysisResponse(BaseModel):
    """Structured response for the Gap Analysis Engine."""
    
    analysis_mode: str = Field(..., description="The mode used: Auditor, Interviewer, Translator, or Architect")
    
    # For Auditor/Gap Analysis
    target_level: Optional[str] = Field(None, description="The target APS level identified (e.g. APS 6)")
    capabilities_addressed: List[str] = Field(default_factory=list, description="List of ILS Capabilities identified in the user's text")
    
    gap_analysis: Optional[str] = Field(None, description="Explanation of the delta between current evidence and target requirements")
    
    # The actual content (Draft, Question, or Refinement)
    response_content: str = Field(..., description="The main response text, formatted in Markdown/STAR method as appropriate")
    
    # Checklist simulation
    critical_behaviors_missed: List[str] = Field(default_factory=list, description="List of critical behaviors missing from the draft")

class AgentDeps(BaseModel):
    """Dependencies injected into the agent at runtime."""
    context: str = Field(..., description="Retrieved context from the Knowledge Graph (Cognee)")
    user_level: str = Field(default="Unknown", description="User's current APS level")
    target_level: str = Field(default="Unknown", description="User's target advancement level")
