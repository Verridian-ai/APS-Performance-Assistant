import { NextRequest, NextResponse } from "next/server";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost:8000";

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

export interface ChatRequest {
  messages: ChatMessage[];
  conversation_id?: string;
}

export interface ChatResponse {
  message: ChatMessage;
  conversation_id: string;
  artifact?: {
    id: string;
    title: string;
    type: string;
  };
}

export async function POST(request: NextRequest) {
  try {
    const body: ChatRequest = await request.json();

    // Try to call the backend API
    try {
      const backendResponse = await fetch(`${BACKEND_URL}/api/chat/simple`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      if (backendResponse.ok) {
        const data: ChatResponse = await backendResponse.json();
        return NextResponse.json(data);
      }
    } catch (backendError) {
      console.log("Backend not available, using fallback response");
    }

    // Fallback response when backend is not available
    const lastUserMessage = body.messages.filter((m) => m.role === "user").pop();
    const userQuery = lastUserMessage?.content || "";

    // Generate contextual fallback response
    const fallbackResponse = generateFallbackResponse(userQuery);

    const response: ChatResponse = {
      message: {
        role: "assistant",
        content: fallbackResponse.content,
      },
      conversation_id: body.conversation_id || `conv_${Date.now()}`,
      artifact: fallbackResponse.hasArtifact
        ? {
            id: `artifact_${Date.now()}`,
            title: fallbackResponse.artifactTitle || "Generated Document",
            type: "document",
          }
        : undefined,
    };

    return NextResponse.json(response);
  } catch (error) {
    console.error("Chat API error:", error);
    return NextResponse.json(
      { error: "Failed to process chat request" },
      { status: 500 }
    );
  }
}

function generateFallbackResponse(query: string): {
  content: string;
  hasArtifact: boolean;
  artifactTitle?: string;
} {
  const lowerQuery = query.toLowerCase();

  // Budget related queries
  if (lowerQuery.includes("budget") || lowerQuery.includes("cost") || lowerQuery.includes("estimate")) {
    return {
      content: `I'd be happy to help you with budget planning for your broadband project.\n\nBased on typical APS guidelines, here are the key budget components to consider:\n\n• **Infrastructure Costs** - Fiber optic cables, conduits, and network equipment\n• **Labor & Installation** - Professional installation and testing services\n• **Permits & Compliance** - Regulatory fees and compliance documentation\n• **Project Management** - Oversight and coordination costs\n• **Contingency** - Typically 10-15% buffer for unexpected expenses\n\nI've prepared a draft budget document for your review.`,
      hasArtifact: true,
      artifactTitle: "Budget Estimate Draft",
    };
  }

  // APS/Assessment queries
  if (lowerQuery.includes("aps") || lowerQuery.includes("assessment") || lowerQuery.includes("workbook")) {
    return {
      content: `I can help you with your APS assessment workbook.\n\nThe APS framework includes several key areas:\n\n• **Work Level Standards (WLS)** - Define the expected complexity and responsibility at each level\n• **Integrated Leadership System (ILS)** - Outlines behavioral capabilities for public service\n• **Self-Assessment** - Helps identify your current capabilities and development areas\n\nWould you like me to help you with a specific section of the assessment?`,
      hasArtifact: false,
    };
  }

  // Compliance/Regulatory queries
  if (lowerQuery.includes("compliance") || lowerQuery.includes("regulation") || lowerQuery.includes("requirement")) {
    return {
      content: `I can help you understand the compliance requirements for your broadband project.\n\nKey regulatory considerations include:\n\n• **Federal Communications Guidelines** - Baseline requirements for infrastructure projects\n• **State & Local Permits** - Specific requirements vary by jurisdiction\n• **Environmental Assessments** - May be required for certain project types\n• **Safety Standards** - Ensure installations meet safety requirements\n\nLet me know which specific area you'd like to explore further.`,
      hasArtifact: false,
    };
  }

  // Default response
  return {
    content: `Thank you for your question about "${query}".\n\nI'm your APS Assistant, here to help with:\n\n• **Broadband Advancement Workbooks** - Guidance on completing your assessments\n• **Budget Planning** - Help with project cost estimates\n• **Regulatory Compliance** - Understanding requirements and guidelines\n• **Document Generation** - Creating drafts and reports\n\nHow can I assist you further with your specific needs?`,
    hasArtifact: false,
  };
}

