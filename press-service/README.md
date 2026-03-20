# 📰 Press Service — Backend API Gateway

> The Daily Extraction's primary backend, built with **Node.js** and **Express.js**. Acts as the unified API gateway in demo mode, aggregating RSS feeds and mocking downstream services.

## Overview

The Press Service serves multiple roles:

1. **RSS Aggregator** — Fetches, parses, and summarizes RSS feed content (defaulting to GCP Release Notes)
2. **Feed Manager** — In-memory CRUD store for managing RSS feed sources
3. **Mock LLM Engine** — Simulates AI-powered summarization and categorization
4. **Service Gateway** — Mocks the Origin Service (beans, brew) and Mindset Service (tips) endpoints for simplified demo deployment

## Quick Start

```bash
# Install dependencies
npm install

# Start with hot-reload (nodemon)
npm run dev

# Or start without hot-reload
npm start
```

The service runs on [http://localhost:8081](http://localhost:8081) by default.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `start` | `npm start` | Start the server (`node src/index.js`) |
| `dev` | `npm run dev` | Start with hot-reload via nodemon |

## Architecture

```
src/
├── index.js        # Express server, routes, CORS, mocked endpoints
├── scraper.js      # RSS feed fetcher + aggregation pipeline
├── llm.js          # Mock LLM for summarization + categorization
└── feedStore.js    # In-memory feed source store with CRUD operations
```

## API Endpoints

### Feed Management

#### `GET /feeds`
Returns all configured RSS feed sources.

**Response:** `200 OK`
```json
[
  {
    "id": "uuid-string",
    "name": "GCP Release Notes",
    "url": "https://cloud.google.com/feeds/gcp-release-notes.xml"
  }
]
```

#### `POST /feeds`
Add a new RSS feed source.

**Request Body:**
```json
{
  "name": "My Custom Feed",
  "url": "https://example.com/feed.xml"
}
```

**Response:** `201 Created`
```json
{
  "id": "generated-uuid",
  "name": "My Custom Feed",
  "url": "https://example.com/feed.xml"
}
```

**Error:** `400 Bad Request` — if `name` or `url` is missing.

#### `DELETE /feeds/:id`
Remove a feed source by its UUID.

**Response:** `204 No Content`

**Error:** `404 Not Found` — if the feed ID doesn't exist.

### Content Endpoints

#### `GET /release-notes`
Fetches and aggregates the top entries from all configured RSS feeds. Each entry is processed through the mock LLM for summarization and categorization.

**Response:** `200 OK`
```json
[
  {
    "id": "guid-or-generated-id",
    "title": "Cloud Spanner: New pricing model",
    "publishedAt": "2026-03-19T10:00:00Z",
    "summary": "[SRE TL;DR] Potential operational impact. Details: ...",
    "category": "Database",
    "url": "https://cloud.google.com/...",
    "feedSource": "GCP Release Notes"
  }
]
```

- Returns up to **10** notes, sorted by publication date (newest first)
- Takes up to **5** items per feed
- Categories: `Compute`, `Database`, `Network`, `AI/ML`, `Other`

#### `GET /beans` *(Mocked)*
Returns the coffee bean catalog. Mocks the Origin Service's `/beans` endpoint.

**Response:** `200 OK`
```json
[
  {
    "id": "1",
    "name": "Ethiopia Yirgacheffe",
    "origin": "Ethiopia",
    "roastLevel": "Light",
    "flavorNotes": ["Jasmine", "Blueberry", "Citrus"]
  }
]
```

#### `GET /brew` *(Mocked)*
Returns brewing methods. Mocks the Origin Service's `/brew` endpoint.

**Response:** `200 OK`
```json
[
  {
    "id": "v60",
    "name": "Hario V60",
    "description": "Pour over method for clean cup",
    "waterTempCelsius": 93,
    "brewTimeSeconds": 180
  }
]
```

#### `GET /tips/random` *(Mocked)*
Returns a random AI adoption mindset tip. Mocks the Mindset Service's `/tips/random` endpoint.

**Response:** `200 OK`
```json
{
  "id": "1",
  "title": "The Neuro-Coder",
  "tip": "Embrace LLMs as an extension of your working memory...",
  "author": "Cognitive Architecture of AI Adoption"
}
```

### Operations

#### `GET /health`
Health check endpoint.

**Response:** `200 OK`
```json
{ "status": "ok" }
```

## Modules

### `feedStore.js` — Feed Source Management
An in-memory store backed by a JavaScript `Map`. Provides CRUD operations for RSS feed sources. Seeded with the GCP Release Notes feed by default.

**Exported functions:**
| Function | Signature | Description |
|----------|-----------|-------------|
| `listFeeds()` | `() → Feed[]` | Returns all feeds as an array |
| `addFeed(name, url)` | `(string, string) → Feed` | Creates and stores a new feed |
| `removeFeed(id)` | `(string) → boolean` | Deletes a feed; returns `true` if it existed |
| `getFeed(id)` | `(string) → Feed \| null` | Retrieves a single feed by ID |

> ⚠️ Data is stored in-memory and is lost on server restart.

### `scraper.js` — RSS Feed Aggregation
Fetches all configured feeds in parallel using `rss-parser`, takes the top 5 items per feed, processes each through the mock LLM, and returns the 10 most recent entries across all feeds.

Error handling is per-feed — if one feed fails, it returns a placeholder error entry while the others continue normally.

### `llm.js` — Mock LLM Engine
Simulates AI-powered text processing. In production, these functions would call a service like Vertex AI or OpenAI.

| Function | Description |
|----------|-------------|
| `summarizeForSRE(content)` | Generates an SRE-focused TL;DR summary (mock: truncates to 100 chars) |
| `categorizeNote(title)` | Categorizes by keyword matching (compute, sql, network, ai, etc.) |

Both functions include simulated latency (~300ms) to mimic real API calls.

## Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `PORT` | `8081` | HTTP server port |

## Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `express` | ^4.19.0 | HTTP server framework |
| `cors` | ^2.8.5 | Cross-origin request support |
| `rss-parser` | ^3.13.0 | RSS/Atom feed parsing |
| `nodemon` | ^3.1.0 | Dev-mode hot-reload *(devDependency)* |
