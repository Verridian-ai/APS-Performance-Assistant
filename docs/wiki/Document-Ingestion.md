# Document Ingestion Guide

This guide explains how to add new documents to the APS Performance Assistant knowledge base.

## 📁 The Documents Folder

All source documents are stored in the `documents/` folder at the project root:

```
documents/
├── APS1_Profile_ILS.pdf
├── APS2_Profile_ILS.pdf
├── APS3_Profile_ILS.pdf
├── APS4_Profile_ILS.pdf
├── APS5_Profile_ILS.pdf
├── APS6_Profile_ILS.pdf
├── EL1_Profile_ILS.pdf
├── EL2_Profile_ILS.pdf
├── SES1_Profile_ILS.pdf
├── SES2_Profile_ILS.pdf
├── SES3_Profile_ILS.pdf
├── ILS_SelfAssessment_Tool.pdf
├── ILS_Comparative_Guide.pdf
└── APS_Workbook_Template.docx
```

## 📥 Adding New Documents

### Step 1: Prepare Your Documents

Ensure your documents are in a supported format:

| Format | Extension | Notes |
|--------|-----------|-------|
| PDF | `.pdf` | Best for official documents |
| Word | `.docx`, `.doc` | For editable templates |
| Text | `.txt` | Plain text files |
| Markdown | `.md` | For structured content |

### Step 2: Copy to Documents Folder

```bash
# Copy a single file
cp /path/to/your/document.pdf documents/

# Copy multiple files
cp /path/to/folder/*.pdf documents/
```

### Step 3: Run the Ingestion Pipeline

```bash
cd backend

# Activate virtual environment
source venv/bin/activate  # or .\venv\Scripts\activate on Windows

# Run ingestion
python -m app.ingestion.pipeline_v2
```

### Step 4: Verify Ingestion

The pipeline will output progress:

```
✓ Loaded 15 documents
✓ Created 342 chunks
✓ Generated 342 embeddings
✓ Extracted 89 entities
✓ Built 156 relationships
✓ Ingestion complete!
```

## 🔄 Re-Ingesting Documents

To update the knowledge base after modifying documents:

```bash
# Option 1: Full re-ingestion (recommended)
python -m app.ingestion.pipeline_v2 --reset

# Option 2: Incremental (only new files)
python -m app.ingestion.pipeline_v2 --incremental
```

## 📋 Document Recommendations

### Best Practices

✅ **DO include:**
- Official APS ILS Profile documents
- Work Level Standards (WLS)
- Department-specific capability frameworks
- Role descriptions and duty statements
- Broadband advancement guides

❌ **DON'T include:**
- Personal performance reviews
- Confidential HR documents
- Documents with PII (personally identifiable information)
- Unrelated policy documents

### Document Quality Tips

1. **Clear Text**: Ensure PDFs have searchable text (not scanned images)
2. **Good Structure**: Documents with headings work better
3. **Relevant Content**: Only include APS performance-related material
4. **Version Control**: Use the latest versions of framework documents

## 🔧 Troubleshooting

### "No documents found"
```bash
# Check the documents folder
ls documents/

# Verify file permissions
chmod 644 documents/*
```

### "Failed to parse PDF"
- Ensure the PDF contains text (not scanned images)
- Try converting to a newer PDF format
- Use OCR software first if needed

### "Embedding failed"
- Check your OpenAI API key is valid
- Ensure you have API credits
- Verify network connectivity

### "Database connection error"
- Verify DATABASE_URL in .env
- Check PostgreSQL is running
- Test connection manually

## 🔬 Advanced: Custom Ingestion

For custom document processing, edit `backend/app/ingestion/pipeline_v2.py`:

```python
# Example: Add custom metadata extraction
async def process_documents():
    documents_path = Path(__file__).parent.parent.parent.parent / "documents"
    
    for file_path in documents_path.glob("*.pdf"):
        # Custom processing logic
        metadata = extract_aps_level(file_path.name)
        await cognee.add(str(file_path), metadata=metadata)
```

## 📊 Monitoring

### Check Ingestion Status
```python
import cognee
status = await cognee.status()
print(f"Documents: {status['document_count']}")
print(f"Embeddings: {status['embedding_count']}")
```

### View Indexed Content
```python
results = await cognee.search("APS 4", search_type=SearchType.CHUNKS)
for chunk in results:
    print(chunk.text[:200])
```

