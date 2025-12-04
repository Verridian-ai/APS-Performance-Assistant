# APS Performance Assistant

<p align="center">
  <img src="frontend/public/logo.png" alt="APS Performance Assistant Logo" width="150" height="150">
</p>

<p align="center">
  <strong>🎯 AI-Powered Career Advancement for Australian Public Service Employees</strong>
</p>

<p align="center">
  <a href="https://opensource.org/licenses/MIT"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT"></a>
  <a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-14-black" alt="Next.js"></a>
  <a href="https://fastapi.tiangolo.com/"><img src="https://img.shields.io/badge/FastAPI-0.109-009688" alt="FastAPI"></a>
  <a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.10+-blue" alt="Python"></a>
  <a href="https://cloud.google.com/run"><img src="https://img.shields.io/badge/Google-Cloud_Run-4285F4" alt="Cloud Run"></a>
</p>

<p align="center">
  <a href="#-quick-start">Quick Start</a> •
  <a href="#-user-guide">User Guide</a> •
  <a href="#-how-it-works">How It Works</a> •
  <a href="#-features">Features</a> •
  <a href="https://github.com/Verridian-ai/APS-Performance-Assistant/wiki">Wiki</a>
</p>

---

A sophisticated AI-powered assistant designed to help Australian Public Service (APS) employees navigate their career advancement. Leveraging the **APS Integrated Leadership System (ILS)** and **Work Level Standards (WLS)**, this tool provides evidence-based coaching, gap analysis, and rigorous assessment support.

---

## 🚀 Features

| Feature | Description |
|---------|-------------|
| 🎯 **Gap Analysis Engine** | Compares your current behaviors against target APS level standards |
| 🧠 **Deep Reasoning AI** | Chain-of-thought reasoning for nuanced, context-aware advice |
| 📚 **Evidence-Based Coaching** | Grounded in official ILS and WLS frameworks—no hallucinations |
| ✏️ **Canvas Interface** | Workspace for drafting pitches and refining STAR examples |
| 🔐 **Secure & Private** | Enterprise-grade authentication and data handling |

---

## 📖 User Guide

### Getting Started

After launching the application, you'll see the home screen with options to start a new chat or access your dashboard.

<!-- Screenshot placeholder: Add screenshot of home page -->
<!-- ![Home Page](docs/screenshots/home.png) -->

### Starting a Conversation

1. **Click "Start New Chat"** from the home page or sidebar
2. **Choose a suggestion** or type your own question
3. **Get AI-powered guidance** based on the ILS framework

### Example Prompts

Try asking the assistant:

| Use Case | Example Prompt |
|----------|----------------|
| 📝 **Writing Goals** | "Help me write SMART goals for my APS 5 performance agreement" |
| 📊 **Gap Analysis** | "What capabilities do I need to demonstrate to move from APS 4 to APS 5?" |
| 🎯 **STAR Examples** | "Help me write a STAR example for 'Achieves Results' at APS 6 level" |
| 📋 **Self-Assessment** | "Review my self-assessment draft for my performance cycle" |
| 🚀 **Career Planning** | "What's the difference between EL1 and EL2 leadership expectations?" |

### The Four AI Modes

The assistant automatically switches between these modes based on your needs:

```
┌─────────────────┬────────────────────────────────────────────────────────────┐
│ 🔍 The Auditor  │ Reviews your draft and scores it against the ILS Profile  │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 🎤 The Interview│ Asks probing questions to help you discover evidence      │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 🔄 The Translator│ Upgrades informal language to professional APS tone       │
├─────────────────┼────────────────────────────────────────────────────────────┤
│ 🏗️ The Architect │ Structures your document using STAR method               │
└─────────────────┴────────────────────────────────────────────────────────────┘
```

### Understanding the Response

Every response includes:
- **Clear Guidance**: Step-by-step advice aligned to your target level
- **ILS References**: Citations to specific capabilities and behavioral indicators
- **Gap Identification**: What's missing from your current evidence
- **Actionable Next Steps**: Concrete actions to bridge the gap

---

## 🧠 How It Works

### The Knowledge Engine (Cognee RAG)

The assistant is powered by **Cognee**, an advanced Retrieval-Augmented Generation (RAG) engine that:

```mermaid
flowchart LR
    A[📄 APS Documents] -->|Ingestion| B[🔄 Document Parser]
    B -->|Chunking| C[📦 Text Chunks]
    C -->|Embedding| D[🧮 Vector Store]
    C -->|Analysis| E[🕸️ Knowledge Graph]

    F[💬 User Question] -->|Query| G[🔍 Semantic Search]
    G --> D
    G --> E
    D -->|Top-K Results| H[📋 Context Assembly]
    E -->|Related Entities| H
    H -->|Augmented Prompt| I[🤖 GPT-4o]
    I -->|Response| J[✨ AI Answer]
```

### Document Processing Pipeline

When documents are added to the `documents/` folder, Cognee processes them:

1. **📥 Ingestion**: PDFs, DOCX, and text files are parsed
2. **✂️ Chunking**: Documents are split into semantic chunks
3. **🧮 Embedding**: Each chunk is converted to a vector using `text-embedding-3-large`
4. **🕸️ Graph Building**: Relationships between APS levels, capabilities, and behaviors are extracted
5. **💾 Storage**: Vectors stored in LanceDB, relationships in PostgreSQL

### What Gets Extracted

The system builds a knowledge graph with:

| Entity Type | Examples |
|-------------|----------|
| **APS Level** | APS 3, APS 4, EL 1, SES Band 1 |
| **Capability Cluster** | "Shapes Strategic Thinking", "Achieves Results" |
| **Specific Capability** | "Inspires a sense of purpose", "Nurtures relationships" |
| **Behavioral Indicator** | "Translates high-level goals into tasks" |

### Adding Your Own Documents

To add more reference materials:

```bash
# 1. Add files to the documents folder
cp your-document.pdf documents/

# 2. Run the ingestion pipeline
cd backend
python -m app.ingestion.pipeline_v2
```

Supported formats: `.pdf`, `.docx`, `.doc`, `.txt`, `.md`

---

## 🏗️ Architecture

The system is built on a modern microservices architecture, separating the high-performance React frontend from the intelligent Python backend.

```mermaid
graph TD
    User[👤 User] -->|HTTPS| FE[Frontend - Next.js]
    FE -->|REST API| BE[Backend - FastAPI]

    subgraph Backend Services
        BE --> Auth[🔐 Auth Service]
        BE --> Agent[🤖 PydanticAI Agent]
        Agent --> RAG[📚 Cognee RAG]
    end

    subgraph Data Layer
        Auth --> DB[(🗄️ Neon Postgres)]
        RAG --> Vec[(Vector Store)]
        RAG --> Docs[ILS Framework]
    end
```

## 🛠️ Tech Stack

### Frontend
-   **Framework**: Next.js 14 (App Router)
-   **Styling**: Tailwind CSS, Framer Motion
-   **Components**: Aceternity UI, Custom Glassmorphism System
-   **State**: React Context API

### Backend
-   **Framework**: FastAPI
-   **AI Orchestration**: LangGraph, PydanticAI
-   **RAG Engine**: Cognee
-   **Database**: PostgreSQL (Neon Cloud), SQLAlchemy (Async)
-   **LLM**: OpenAI GPT-4o / Google Gemini 1.5 Pro

---

## ⚡ Quick Start

```bash
# Clone the repository
git clone https://github.com/Verridian-ai/APS-Performance-Assistant.git
cd APS-Performance-Assistant

# Backend setup
cd backend
python -m venv venv && source venv/bin/activate  # or .\venv\Scripts\activate on Windows
pip install -r requirements.txt
cp ../.env.example .env  # Edit with your API keys

# Frontend setup (new terminal)
cd frontend
npm install

# Run both servers
# Terminal 1 (backend):
uvicorn app.main:app --reload --port 8000

# Terminal 2 (frontend):
npm run dev

# Open http://localhost:3000
```

---

## 🏁 Installation Guide

### Prerequisites

| Requirement | Version | Purpose |
|-------------|---------|---------|
| Node.js | 18+ | Frontend runtime |
| Python | 3.10+ | Backend runtime |
| PostgreSQL | Any (or Neon) | User data storage |
| OpenAI API Key | - | LLM and embeddings |

### Step 1: Clone & Configure

```bash
git clone https://github.com/Verridian-ai/APS-Performance-Assistant.git
cd APS-Performance-Assistant
```

Create your environment file:

```bash
cp .env.example backend/.env
```

Edit `backend/.env` with your credentials:

```env
OPENAI_API_KEY=sk-your-key-here
DATABASE_URL=postgresql+asyncpg://user:pass@host:5432/dbname
SECRET_KEY=your-random-secret-key
```

### Step 2: Backend Setup

```bash
cd backend
python -m venv venv

# Activate virtual environment
# Windows:
.\venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Ingest APS Documents

Before using the assistant, you need to process the ILS framework documents:

```bash
# Still in backend/ with venv activated
python -m app.ingestion.pipeline_v2
```

This will:
- ✅ Parse all PDFs in `documents/`
- ✅ Create vector embeddings
- ✅ Build the knowledge graph
- ✅ Store everything in your database

### Step 4: Frontend Setup

```bash
cd ../frontend
npm install
```

### Step 5: Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
source venv/bin/activate  # or .\venv\Scripts\activate
uvicorn app.main:app --reload --port 8000
```

**Terminal 2 - Frontend:**
```bash
cd frontend
npm run dev
```

**Open your browser:** http://localhost:3000

---

## 📁 Project Structure

```
APS-Performance-Assistant/
├── 📂 backend/
│   ├── 📂 app/
│   │   ├── 📂 agents/          # AI agent logic
│   │   │   ├── pydantic_agent.py   # Main GPT-4o agent
│   │   │   ├── prompts.py          # System prompts
│   │   │   └── agent_types.py      # Type definitions
│   │   ├── 📂 api/             # REST endpoints
│   │   │   ├── auth.py             # Authentication
│   │   │   └── chat.py             # Chat endpoint
│   │   ├── 📂 ingestion/       # Document processing
│   │   │   └── pipeline_v2.py      # Cognee ingestion
│   │   └── main.py             # FastAPI app
│   ├── Dockerfile
│   └── requirements.txt
├── 📂 frontend/
│   ├── 📂 app/                 # Next.js pages
│   ├── 📂 components/          # React components
│   ├── 📂 context/             # Auth context
│   └── package.json
├── 📂 documents/               # APS ILS source documents
│   ├── APS1_Profile_ILS.pdf
│   ├── APS2_Profile_ILS.pdf
│   └── ... (all level profiles)
├── .env.example
└── README.md
```

---

## ☁️ Deployment

### Docker (Recommended)

```bash
# Build containers
docker build -t aps-backend ./backend
docker build -t aps-frontend ./frontend

# Run with docker-compose
docker-compose up
```

### Google Cloud Run

```bash
# Backend
gcloud run deploy aps-backend \
  --image gcr.io/[PROJECT_ID]/aps-backend \
  --platform managed \
  --set-env-vars "OPENAI_API_KEY=sk-..."

# Frontend
gcloud run deploy aps-frontend \
  --image gcr.io/[PROJECT_ID]/aps-frontend \
  --platform managed
```

See [DEPLOYMENT.md](DEPLOYMENT.md) for detailed instructions.

---

## 📚 Documentation

| Document | Description |
|----------|-------------|
| [User Guide](#-user-guide) | How to use the assistant |
| [How It Works](#-how-it-works) | Technical architecture |
| [DEPLOYMENT.md](DEPLOYMENT.md) | Cloud deployment guide |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Contribution guidelines |
| [Wiki](https://github.com/Verridian-ai/APS-Performance-Assistant/wiki) | Full documentation |

---

## 🤝 Contributing

We welcome contributions! Please see [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">
  Made with ❤️ for the Australian Public Service
</p>