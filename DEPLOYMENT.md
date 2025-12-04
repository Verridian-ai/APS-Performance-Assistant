# Deployment Guide (Google Cloud Run)

This guide details how to deploy the APS Performance Assistant to Google Cloud Run.

## Prerequisites

1.  **Google Cloud Project**: Ensure you have a project created.
2.  **Billing Enabled**: Cloud Run requires billing.
3.  **Google Cloud SDK**: Installed and authenticated (`gcloud auth login`).

## 1. Infrastructure Setup

Set your project ID:
```bash
gcloud config set project [YOUR_PROJECT_ID]
```

Enable required APIs:
```bash
gcloud services enable run.googleapis.com containerregistry.googleapis.com cloudbuild.googleapis.com
```

## 2. Backend Deployment

The backend connects to Neon Postgres. We will pass the connection string as an environment variable.

### Build
```bash
cd backend
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/aps-backend
```

### Deploy
Replace the values in brackets with your actual keys (from `backend/.env`).

```bash
gcloud run deploy aps-backend \
  --image gcr.io/[YOUR_PROJECT_ID]/aps-backend \
  --platform managed \
  --region australia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "LLM_PROVIDER=openai" \
  --set-env-vars "LLM_MODEL=gpt-4o" \
  --set-env-vars "DB_PROVIDER=postgres" \
  --set-env-vars "DB_CONNECTION_STRING=postgresql+asyncpg://neondb_owner:..." \
  --set-env-vars "OPENAI_API_KEY=sk-..." \
  --set-env-vars "COGNEE_API_KEY=..."
```

*Note: For production, it is recommended to use Google Secret Manager for API keys.*

## 3. Frontend Deployment

The frontend needs to know the URL of the deployed backend.

### Build
```bash
cd frontend
gcloud builds submit --tag gcr.io/[YOUR_PROJECT_ID]/aps-frontend
```

### Deploy
Get the backend URL from the previous step (e.g., `https://aps-backend-xyz.a.run.app`).

```bash
gcloud run deploy aps-frontend \
  --image gcr.io/[YOUR_PROJECT_ID]/aps-frontend \
  --platform managed \
  --region australia-southeast1 \
  --allow-unauthenticated \
  --set-env-vars "NEXT_PUBLIC_API_URL=https://aps-backend-xyz.a.run.app/api"
```

## 4. Domain Mapping (Optional)

To map a custom domain (e.g., `aps-assistant.com`):

```bash
gcloud beta run domain-mappings create \
  --service aps-frontend \
  --domain aps-assistant.com \
  --region australia-southeast1
```

## 5. Continuous Deployment

The `.github/workflows/ci-cd.yaml` can be extended to deploy automatically on push to `main`. You will need to:
1.  Create a Service Account in GCP with `Cloud Run Admin` and `Service Account User` roles.
2.  Export the JSON key.
3.  Add it to GitHub Secrets as `GCP_SA_KEY`.

```