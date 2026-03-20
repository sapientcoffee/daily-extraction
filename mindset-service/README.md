# 🧠 Mindset Service — AI Adoption Psychology Tips

> A Python FastAPI service providing psychology-backed tips on AI adoption for The Daily Extraction ecosystem.

## Overview

The Mindset Service delivers curated tips rooted in cognitive psychology to help developers navigate the cultural and psychological shift of adopting AI-assisted development. Tips cover topics like human-AI collaboration, prompt engineering mindset, and maintaining engineering sovereignty.

> **Note:** In the current demo configuration, these endpoints are mocked within the [Press Service](../press-service/). This standalone Python service is available for full distributed deployments.

## Quick Start

```bash
# Install dependencies
pip install -r requirements.txt

# Start the service
python main.py
```

The service runs on [http://localhost:8000](http://localhost:8000).

Alternatively, with Uvicorn directly:

```bash
uvicorn main:app --host 0.0.0.0 --port 8000 --reload
```

## API Endpoints

### `GET /tips`
Returns all available mindset tips.

**Response:** `200 OK`
```json
[
  {
    "id": "1",
    "title": "The Neuro-Coder",
    "tip": "Embrace LLMs as an extension of your working memory. Instead of memorizing syntax, focus on cultivating high-level architectural intent.",
    "author": "Cognitive Architecture of AI Adoption"
  },
  {
    "id": "2",
    "title": "Sovereignty in the Loop",
    "tip": "AI generates the code, but you own the system. Never blindly deploy. Maintain your sovereignty by understanding the 'why' behind the generated 'how'.",
    "author": "Cognitive Architecture of AI Adoption"
  },
  {
    "id": "3",
    "title": "Prompt as Programming",
    "tip": "Writing a good prompt is equivalent to writing a good compiler constraint. Be specific, define the boundaries, and provide clear contexts.",
    "author": "Cognitive Architecture of AI Adoption"
  }
]
```

### `GET /tips/random`
Returns a single randomly selected tip.

**Response:** `200 OK`
```json
{
  "id": "2",
  "title": "Sovereignty in the Loop",
  "tip": "AI generates the code, but you own the system...",
  "author": "Cognitive Architecture of AI Adoption"
}
```

### `GET /health`
Health check endpoint for monitoring and readiness probes.

**Response:** `200 OK`
```json
{ "status": "ok" }
```

### Interactive API Documentation

FastAPI automatically generates interactive API docs:

- **Swagger UI:** [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc:** [http://localhost:8000/redoc](http://localhost:8000/redoc)

## Architecture

```
mindset-service/
├── main.py              # FastAPI app, CORS middleware, route handlers
├── tips.py              # Tips data store (list of tip dictionaries)
└── requirements.txt     # Python dependencies
```

## Data Model

### `MindsetTip`
```python
{
    "id": str,           # Unique identifier
    "title": str,        # Short, memorable tip title
    "tip": str,          # Full tip text with psychological insight
    "author": str        # Attribution / source
}
```

## CORS

The service uses FastAPI's `CORSMiddleware` with the following configuration:
- `allow_origins: ["*"]` — All origins permitted
- `allow_methods: ["*"]` — All HTTP methods
- `allow_headers: ["*"]` — All headers
- `allow_credentials: True`

## Requirements

- **Python** ≥ 3.10
- **fastapi** 0.110.0
- **uvicorn** 0.27.1
