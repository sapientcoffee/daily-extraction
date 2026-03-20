# Deployment Plan: Google Cloud Run & Firebase App Hosting

## Background & Motivation
The objective is to deploy the `daily-extraction` project to Google Cloud. The backend services (`mindset-service`, `origin-service`, `press-service`) will be deployed to Google Cloud Run utilizing Cloud Buildpacks (Source-based deployments, no Dockerfiles). The frontend Next.js application (`barista`) will be deployed using Firebase App Hosting. We will manage this using imperative Bash CLI scripts.

## Implementation Steps

### 1. Update Port Configuration in Backend Services

**File: `mindset-service/main.py`**
Modify the startup block to respect the `PORT` environment variable:
```python
if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)
```

**File: `origin-service/main.go`**
Modify the main function to use `os.Getenv("PORT")`:
```go
import (
	"fmt"
	"log"
	"net/http"
	"os"
	"origin-service/handlers"
)

// ... enableCORS ...

func main() {
	mux := http.NewServeMux()

	// Coffee domain endpoints
	mux.HandleFunc("/beans", enableCORS(handlers.GetBeans))
	mux.HandleFunc("/brew", enableCORS(handlers.GetBrewMethods))

	// Operations endpoint
	mux.HandleFunc("/health", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	}))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Printf("Origin Service running on :%s\n", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}
```

*(Note: `press-service/src/index.js` already respects `process.env.PORT`)*

### 2. Configure Firebase App Hosting
Create `firebase.json` at the root of the project with the following configuration:
```json
{
  "apphosting": {
    "backendId": "barista",
    "rootDir": "barista",
    "ignore": [
      "node_modules",
      ".git",
      "firebase-debug.log",
      "firebase-debug.*.log",
      "functions"
    ]
  }
}
```

### 3. Create Deployment Script
Create `deploy.sh` at the root of the project to automate deployments using `gcloud` and `firebase-tools`:

```bash
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

echo "====================================="
echo "1. Deploying Mindset Service..."
echo "====================================="
gcloud run deploy mindset-service \
  --source mindset-service \
  --region "$REGION" \
  --allow-unauthenticated \
  --project "$PROJECT_ID"

echo "====================================="
echo "2. Deploying Origin Service..."
echo "====================================="
gcloud run deploy origin-service \
  --source origin-service \
  --region "$REGION" \
  --allow-unauthenticated \
  --project "$PROJECT_ID"

echo "====================================="
echo "3. Deploying Press Service..."
echo "====================================="
gcloud run deploy press-service \
  --source press-service \
  --region "$REGION" \
  --allow-unauthenticated \
  --project "$PROJECT_ID"

echo "====================================="
echo "4. Deploying Barista (Next.js) via Firebase App Hosting..."
echo "====================================="
# Select project for firebase
npx -y firebase-tools@latest use "$PROJECT_ID" || npx -y firebase-tools@latest use --add "$PROJECT_ID"
# Deploy app hosting backend
npx -y firebase-tools@latest deploy --only apphosting
```

Make the script executable:
```bash
chmod +x deploy.sh
```

## Verification & Testing
1. Review the generated `deploy.sh` and `firebase.json` files for correctness.
2. Verify that the Python and Go backends can still run locally on their default ports.
3. During deployment, the Cloud Run buildpacks will stream logs to the terminal, and Firebase will deploy the frontend. Upon completion, endpoints should be accessible.