#!/bin/bash
# ===========================================
# APS Performance Assistant - Cloud Run Deployment Script
# ===========================================
#
# This script deploys the app to Google Cloud Run
#
# Prerequisites:
#   1. Google Cloud SDK installed (gcloud)
#   2. Authenticated: gcloud auth login
#   3. Project set: gcloud config set project YOUR_PROJECT_ID
#   4. APIs enabled (script will enable them)
#
# Usage:
#   chmod +x deploy-cloudrun.sh
#   ./deploy-cloudrun.sh

set -e  # Exit on error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}=========================================="
echo "APS Performance Assistant - Cloud Run Deploy"
echo -e "==========================================${NC}"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}Error: gcloud CLI not found. Please install Google Cloud SDK.${NC}"
    echo "Visit: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Get project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}Error: No GCP project set.${NC}"
    echo "Run: gcloud config set project YOUR_PROJECT_ID"
    exit 1
fi
echo -e "${GREEN}Project: $PROJECT_ID${NC}"

# Configuration
REGION="${GCP_REGION:-australia-southeast1}"
BACKEND_SERVICE="aps-backend"
FRONTEND_SERVICE="aps-frontend"

echo -e "${YELLOW}Region: $REGION${NC}"

# Enable required APIs
echo -e "\n${BLUE}Enabling required APIs...${NC}"
gcloud services enable \
    cloudbuild.googleapis.com \
    run.googleapis.com \
    containerregistry.googleapis.com \
    secretmanager.googleapis.com \
    --quiet

# Check for OpenAI API key
echo -e "\n${BLUE}Checking secrets...${NC}"
if ! gcloud secrets describe OPENAI_API_KEY &>/dev/null; then
    echo -e "${YELLOW}OPENAI_API_KEY secret not found in Secret Manager.${NC}"
    read -p "Enter your OpenAI API Key: " OPENAI_KEY
    echo -n "$OPENAI_KEY" | gcloud secrets create OPENAI_API_KEY --data-file=-
    echo -e "${GREEN}Secret created successfully.${NC}"
else
    echo -e "${GREEN}OPENAI_API_KEY secret exists.${NC}"
fi

# Grant Cloud Run access to secrets
echo -e "\n${BLUE}Configuring secret access...${NC}"
PROJECT_NUMBER=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud secrets add-iam-policy-binding OPENAI_API_KEY \
    --member="serviceAccount:${PROJECT_NUMBER}-compute@developer.gserviceaccount.com" \
    --role="roles/secretmanager.secretAccessor" \
    --quiet 2>/dev/null || true

# Build and deploy using Cloud Build
echo -e "\n${BLUE}Starting Cloud Build deployment...${NC}"
echo "This may take 5-10 minutes..."

gcloud builds submit --config=cloudbuild.yaml --substitutions=SHORT_SHA=$(git rev-parse --short HEAD 2>/dev/null || echo "latest")

# Get deployed URLs
echo -e "\n${GREEN}=========================================="
echo "Deployment Complete!"
echo -e "==========================================${NC}"

BACKEND_URL=$(gcloud run services describe $BACKEND_SERVICE --region=$REGION --format='value(status.url)' 2>/dev/null || echo "Not deployed")
FRONTEND_URL=$(gcloud run services describe $FRONTEND_SERVICE --region=$REGION --format='value(status.url)' 2>/dev/null || echo "Not deployed")

echo -e "${BLUE}Backend API:${NC}  $BACKEND_URL"
echo -e "${BLUE}Frontend App:${NC} $FRONTEND_URL"
echo ""
echo -e "${GREEN}Your app is now live!${NC}"
echo -e "Open ${YELLOW}$FRONTEND_URL${NC} in your browser."
