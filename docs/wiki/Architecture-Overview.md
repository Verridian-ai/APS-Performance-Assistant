# Architecture Overview

This document describes the technical architecture of the APS Performance Assistant.

---

## 🏗️ System Architecture

```mermaid
flowchart TB
    subgraph CLIENT["🖥️ Client Layer"]
        WEB["🌐 Web Browser<br/>(Next.js 14)"]
        IOS["📱 iOS App<br/>(Future)"]
        AND["📱 Android App<br/>(Future)"]
    end

    subgraph API["⚡ API Layer"]
        FASTAPI["FastAPI Backend"]
        subgraph ROUTERS["Routers"]
            AUTH_R["🔐 Auth Router<br/>/api/auth/*"]
            CHAT_R["💬 Chat Router<br/>/api/chat/*"]
            DOC_R["📄 Documents Router<br/>/api/documents/*"]
        end
        subgraph SERVICES["Services"]
            AUTH_S["Auth Service<br/>(JWT/OAuth)"]
            AGENT_S["Agent Service<br/>(PydanticAI)"]
            DOC_S["Document Service<br/>(Ingestion)"]
        end
    end

    subgraph AI["🤖 AI Layer"]
        PYDANTIC["PydanticAI Agent"]
        PROMPT["System Prompt<br/>(ILS Framework + 4 Modes)"]
        GPT["🧠 GPT-5.0<br/>(Generation)"]
        ENHANCER["Prompt Enhancer"]
        PARSER["Response Parser"]
    end

    subgraph KNOWLEDGE["📚 Knowledge Layer"]
        COGNEE["Cognee RAG Engine"]
        VECTOR["🧮 Vector Store<br/>(LanceDB)"]
        GRAPH["🕸️ Graph Store<br/>(Relations)"]
        DOCSTORE["📄 Document Store<br/>(Raw Chunks)"]
    end

    subgraph DATA["💾 Data Layer"]
        NEON["🐘 Neon Postgres<br/>(Users, Sessions)"]
        FILES["📁 Document Files<br/>(documents/)"]
        INDEX["🔍 Vector Index<br/>(LanceDB)"]
    end

    WEB --> FASTAPI
    IOS -.-> FASTAPI
    AND -.-> FASTAPI

    FASTAPI --> ROUTERS
    ROUTERS --> SERVICES

    AGENT_S --> PYDANTIC
    PYDANTIC --> PROMPT
    PROMPT --> GPT
    ENHANCER --> GPT
    GPT --> PARSER

    GPT <--> COGNEE
    COGNEE --> VECTOR
    COGNEE --> GRAPH
    COGNEE --> DOCSTORE

    SERVICES --> NEON
    DOCSTORE --> FILES
    VECTOR --> INDEX
```

---

## 🔄 Request Flow

```mermaid
sequenceDiagram
    participant U as 👤 User
    participant F as 🌐 Frontend
    participant B as ⚡ Backend
    participant A as 🤖 PydanticAI
    participant C as 📚 Cognee RAG
    participant G as 🧠 GPT-5.0

    U->>F: Types message
    F->>B: POST /api/chat/send
    B->>B: Authenticate (JWT)
    B->>A: Process message
    A->>C: Search knowledge base
    C->>C: Vector search + Graph lookup
    C-->>A: Retrieved context
    A->>G: Prompt + Context
    G-->>A: Generated response
    A-->>B: Structured response
    B-->>F: JSON response
    F-->>U: Display message
```

---

## 🔧 Technology Stack

### Frontend

```mermaid
graph LR
    subgraph Frontend["🖥️ Frontend Stack"]
        NEXT["Next.js 14"] --> REACT["React 18"]
        REACT --> TS["TypeScript"]
        NEXT --> TAILWIND["Tailwind CSS"]
        NEXT --> FRAMER["Framer Motion"]
        NEXT --> SHADCN["shadcn/ui"]
    end
```

| Technology | Purpose |
|------------|---------|
| **Next.js 14** | React framework with App Router |
| **TypeScript** | Type safety |
| **Tailwind CSS** | Styling |
| **Framer Motion** | Animations |
| **shadcn/ui** | UI components |

### Backend

```mermaid
graph LR
    subgraph Backend["⚡ Backend Stack"]
        FASTAPI["FastAPI"] --> PYDANTIC["PydanticAI"]
        PYDANTIC --> GPT5["GPT-5.0"]
        FASTAPI --> COGNEE["Cognee RAG"]
        FASTAPI --> SQLA["SQLAlchemy"]
        SQLA --> NEON["Neon Postgres"]
    end
```

| Technology | Purpose |
|------------|---------|
| **FastAPI** | Python web framework |
| **PydanticAI** | Structured AI agent framework |
| **Cognee** | RAG engine with knowledge graphs |
| **SQLAlchemy** | ORM for database access |
| **JWT** | Authentication tokens |

### AI/ML

| Technology | Purpose |
|------------|---------|
| **GPT-5.0** | Main language model (via PydanticAI) |
| **text-embedding-3-large** | Document embeddings |
| **LanceDB** | Vector storage |

### Infrastructure

```mermaid
graph TB
    subgraph Infra["☁️ Infrastructure"]
        GH["GitHub"] --> GHA["GitHub Actions"]
        GHA --> DOCKER["Docker Build"]
        DOCKER --> GCR["Google Cloud Run"]
        GCR --> NEON["Neon Postgres"]
        GCR --> OPENAI["OpenAI API"]
    end
```

| Technology | Purpose |
|------------|---------|
| **Neon** | Serverless Postgres |
| **Google Cloud Run** | Container hosting |
| **Docker** | Containerization |
| **GitHub Actions** | CI/CD |

---

## 📁 Project Structure

```mermaid
graph TD
    ROOT["📦 APS-Performance-Assistant"]

    ROOT --> BACKEND["📂 backend/"]
    ROOT --> FRONTEND["📂 frontend/"]
    ROOT --> DOCS["📂 documents/"]
    ROOT --> WIKI["📂 docs/wiki/"]

    BACKEND --> APP["📂 app/"]
    APP --> AGENTS["🤖 agents/"]
    APP --> API["⚡ api/"]
    APP --> AUTH["🔐 auth/"]
    APP --> INGESTION["📥 ingestion/"]
    APP --> MODELS["📊 models/"]
    APP --> MAIN["main.py"]

    FRONTEND --> APPDIR["📂 app/"]
    FRONTEND --> COMPONENTS["📂 components/"]
    FRONTEND --> CONTEXT["📂 context/"]
```

```
APS-Performance-Assistant/
├── backend/
│   ├── app/
│   │   ├── agents/           # PydanticAI agent logic
│   │   ├── api/              # REST endpoints
│   │   ├── auth/             # Authentication
│   │   ├── ingestion/        # Document processing
│   │   ├── models/           # Database models
│   │   └── main.py           # FastAPI app
│   ├── Dockerfile
│   └── requirements.txt
├── frontend/
│   ├── app/                  # Next.js pages
│   ├── components/           # React components
│   ├── context/              # State management
│   └── package.json
├── documents/                # Source documents
├── docs/wiki/                # Documentation
└── .env.example
```

---

## 🔐 Security Architecture

```mermaid
flowchart LR
    subgraph Security["🔐 Security Layers"]
        direction TB
        AUTH["Authentication<br/>(OAuth2 + JWT)"]
        AUTHZ["Authorization<br/>(Role-Based)"]
        ENCRYPT["Encryption<br/>(TLS + At Rest)"]
        SECRETS["Secrets<br/>(Env Variables)"]
    end

    USER["👤 User"] --> AUTH
    AUTH --> AUTHZ
    AUTHZ --> ENCRYPT
    ENCRYPT --> DATA["💾 Data"]
```

- **Authentication**: OAuth2 + JWT tokens
- **Authorization**: Role-based access control
- **Data**: Encrypted at rest and in transit
- **Secrets**: Environment variables, never in code

---

## 🧠 AI Agent Architecture

```mermaid
flowchart TB
    subgraph Agent["🤖 PydanticAI Agent"]
        INPUT["📥 User Input"]
        ROUTER["🔀 Mode Router"]

        subgraph Modes["4 Operating Modes"]
            COACH["🎯 Coach Mode"]
            INTERVIEW["🎤 Interviewer Mode"]
            WRITER["✍️ Writer Mode"]
            ANALYZER["📊 Analyzer Mode"]
        end

        CONTEXT["📚 Context Assembly"]
        GPT5["🧠 GPT-5.0"]
        OUTPUT["📤 Structured Output"]
    end

    INPUT --> ROUTER
    ROUTER --> COACH
    ROUTER --> INTERVIEW
    ROUTER --> WRITER
    ROUTER --> ANALYZER

    COACH --> CONTEXT
    INTERVIEW --> CONTEXT
    WRITER --> CONTEXT
    ANALYZER --> CONTEXT

    CONTEXT --> GPT5
    GPT5 --> OUTPUT
```

