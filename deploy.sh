#!/bin/bash
set -e

# Default region, can be overridden by env variable
REGION="${REGION:-us-central1}"
PROJECT_ID=$(gcloud config get-value project)

if [ -z "$PROJECT_ID" ]; then
  echo "Error: No Google Cloud project configured. Run 'gcloud config set project <PROJECT_ID>'."
  exit 1
fi

echo "Deploying to Project: $PROJECT_ID in Region: $REGION"

APP_HOSTING_SA="serviceAccount:firebase-app-hosting-compute@$PROJECT_ID.iam.gserviceaccount.com"

echo "====================================="
echo "1. Deploying Mindset Service (Private)..."
echo "====================================="
gcloud run deploy mindset-service \
  --source mindset-service \
  --region "$REGION" \
  --no-allow-unauthenticated \
  --project "$PROJECT_ID"

gcloud run services add-iam-policy-binding mindset-service \
  --region "$REGION" \
  --member "$APP_HOSTING_SA" \
  --role "roles/run.invoker" \
  --project "$PROJECT_ID"

echo "====================================="
echo "2. Deploying Origin Service (Private)..."
echo "====================================="
gcloud run deploy origin-service \
  --source origin-service \
  --region "$REGION" \
  --no-allow-unauthenticated \
  --project "$PROJECT_ID"

gcloud run services add-iam-policy-binding origin-service \
  --region "$REGION" \
  --member "$APP_HOSTING_SA" \
  --role "roles/run.invoker" \
  --project "$PROJECT_ID"

echo "====================================="
echo "3. Deploying Press Service (Private)..."
echo "====================================="
gcloud run deploy press-service \
  --source press-service \
  --region "$REGION" \
  --no-allow-unauthenticated \
  --project "$PROJECT_ID"

gcloud run services add-iam-policy-binding press-service \
  --region "$REGION" \
  --member "$APP_HOSTING_SA" \
  --role "roles/run.invoker" \
  --project "$PROJECT_ID"

echo "====================================="
echo "4. Deploying Barista (Next.js) via Firebase App Hosting..."
echo "====================================="
# Select project for firebase
npx -y firebase-tools@latest use "$PROJECT_ID" || npx -y firebase-tools@latest use --add "$PROJECT_ID"
# Deploy app hosting backend
npx -y firebase-tools@latest deploy --only apphosting
