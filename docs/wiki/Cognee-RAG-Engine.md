# Cognee RAG Engine

This document explains how the APS Performance Assistant uses Cognee for Retrieval-Augmented Generation (RAG).

## 🧠 What is RAG?

**Retrieval-Augmented Generation (RAG)** is a technique that combines:
1. **Retrieval**: Finding relevant information from a knowledge base
2. **Generation**: Using an LLM to generate responses based on that information

This ensures the AI's responses are grounded in factual source material, not just its training data.

## 📚 How Cognee Works

Cognee is an advanced RAG engine that goes beyond simple vector search by building a **knowledge graph** of relationships between concepts.

### The Three Storage Layers

```
┌─────────────────────────────────────────────────────────────┐
│                     COGNEE ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────┤
│  📄 Document Store    │  Raw text chunks from source docs   │
├───────────────────────┼─────────────────────────────────────│
│  🧮 Vector Store      │  Semantic embeddings for similarity  │
│     (LanceDB)         │  search using text-embedding-3-large │
├───────────────────────┼─────────────────────────────────────│
│  🕸️ Graph Store       │  Entity relationships (APS Level →  │
│     (PostgreSQL)      │  Capability → Behavioral Indicator)  │
└─────────────────────────────────────────────────────────────┘
```

## 🔄 Document Processing Pipeline

When you run the ingestion pipeline, here's what happens:

### Step 1: Document Parsing
```python
# Supported formats
files = ["*.pdf", "*.docx", "*.doc", "*.txt", "*.md"]
```

The parser extracts text from:
- APS Level Profiles (APS1-SES3)
- Self-Assessment Tools
- Comparative Guides
- Broadband Workbooks

### Step 2: Chunking
Documents are split into semantic chunks of ~500 tokens each, with overlap to maintain context.

### Step 3: Embedding
Each chunk is converted to a 3072-dimensional vector using OpenAI's `text-embedding-3-large` model.

### Step 4: Graph Extraction
Cognee analyzes the text to extract:

| Entity Type | Example |
|-------------|---------|
| APS Level | "APS 4", "EL 1", "SES Band 2" |
| Capability Cluster | "Shapes Strategic Thinking" |
| Specific Capability | "Inspires a sense of purpose" |
| Behavioral Indicator | "Translates goals into actionable tasks" |

### Step 5: Relationship Building
The system creates relationships:

```
APS Level ──requires──▶ Capability Cluster
Capability Cluster ──contains──▶ Specific Capability  
Specific Capability ──demonstrated_by──▶ Behavioral Indicator
Behavioral Indicator ──is_critical_for──▶ APS Level
```

## 🔍 Query Processing

When a user asks a question:

### 1. Semantic Search
```
User Query: "What capabilities do I need for APS 5?"
                    │
                    ▼
            ┌───────────────┐
            │ Embed Query   │
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ Vector Search │ ──▶ Top 5 similar chunks
            └───────┬───────┘
                    │
                    ▼
            ┌───────────────┐
            │ Graph Lookup  │ ──▶ Related entities
            └───────────────┘
```

### 2. Context Assembly
The system combines:
- Relevant text chunks from vector search
- Related entities from the knowledge graph
- User's current and target APS level

### 3. Prompt Augmentation
```python
prompt = f"""
{SYSTEM_PROMPT}

### Retrieved ILS Knowledge (Source of Truth)
{retrieved_context}

### User Query
{user_question}
"""
```

### 4. LLM Generation
GPT-4o generates a response grounded in the retrieved context.

## 📥 Adding New Documents

### Manual Ingestion
```bash
cd backend
python -m app.ingestion.pipeline_v2
```

### Custom Documents
Add your documents to the `documents/` folder:
```
documents/
├── APS1_Profile_ILS.pdf      # Official profiles
├── APS2_Profile_ILS.pdf
├── Custom_Policy.pdf          # Your custom docs
└── Department_Guidelines.docx
```

Then run ingestion again.

## ⚙️ Configuration

### Environment Variables
```env
# LLM Settings
LLM_PROVIDER=openai
LLM_MODEL=gpt-4o
OPENAI_API_KEY=sk-...

# Embedding Settings
EMBEDDING_PROVIDER=openai
EMBEDDING_MODEL=text-embedding-3-large

# Database
DB_PROVIDER=postgres
DB_CONNECTION_STRING=postgresql+asyncpg://...
```

## 🔬 Debugging

### Check Cognee Status
```python
import cognee
await cognee.status()
```

### View Knowledge Graph
```python
# Search the graph
results = await cognee.search("APS 4 capabilities", search_type=SearchType.GRAPH)
```

## 📊 Performance Tips

1. **Batch Documents**: Ingest multiple files at once
2. **Use SSD Storage**: Vector operations are I/O intensive
3. **Increase Memory**: Large document sets need more RAM
4. **GPU Acceleration**: Enable CUDA for faster embeddings

