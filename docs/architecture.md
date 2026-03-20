# Architecture — The Daily Extraction

This document provides a detailed technical overview of The Daily Extraction's architecture, design decisions, and data flow.

## System Design

### Design Philosophy

The Daily Extraction is intentionally built as a **polyglot microservices application** to demonstrate:

1. **Language diversity** — Go, Node.js, Python, and TypeScript each serve where they excel
2. **Simplified demo mode** — A single Node.js service can mock all backends, reducing operational overhead for demos
3. **SRE-first thinking** — Every service includes a `/health` endpoint, structured error handling, and observability hooks
4. **Theme-driven UX** — The frontend showcases both retro (terminal) and modern (glassmorphism) aesthetics

### Deployment Modes

```
┌─────────────────────────────────────────────────────────────────┐
│                      DEMO MODE (2 processes)                    │
│                                                                 │
│   Barista ──→ Press Service (mocks all backends)                │
│   :3000       :8081                                             │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   DISTRIBUTED MODE (4 processes)                │
│                                                                 │
│   Barista ──→ Press Service ──→ (RSS feeds)                     │
│   :3000       :8081                                             │
│           ──→ Origin Service                                    │
│               :8080                                             │
│           ──→ Mindset Service                                   │
│               :8000                                             │
└─────────────────────────────────────────────────────────────────┘
```

## Service Details

### Barista (Frontend)

| Attribute | Value |
|-----------|-------|
| **Runtime** | Next.js 16 (App Router) |
| **Language** | TypeScript |
| **Rendering** | Client-side (`"use client"` directives) |
| **Styling** | TailwindCSS 4 + CSS custom properties |
| **State** | React `useState` / `useEffect` hooks + Context API |
| **Port** | 3000 |

**Key design decisions:**
- All components use `"use client"` since they fetch data and manage state
- The theme system uses CSS custom properties rather than Tailwind dark mode to support arbitrary theme variants
- `ThemeProvider` wraps the entire app in the root layout for global access
- The `FeedManager` communicates changes upstream to `page.tsx` via callbacks, which triggers `ReleaseNotesFeed` re-rendering via a `refreshKey` prop

### Press Service (Backend Gateway)

| Attribute | Value |
|-----------|-------|
| **Runtime** | Node.js |
| **Framework** | Express.js 4.x |
| **Language** | JavaScript (CommonJS) |
| **Storage** | In-memory (`Map`) |
| **Port** | 8081 |

**Key design decisions:**
- Serves as a unified API gateway to simplify demo setup
- RSS parsing uses the `rss-parser` library with parallel fetch across all feeds
- The mock LLM includes artificial latency (300ms per call) to simulate real API behavior
- Error handling is per-feed — a single feed failure doesn't break the entire response
- Feed store is seeded with the GCP Release Notes feed on startup

**Data flow for `GET /release-notes`:**
```
Client Request
    │
    ▼
feedStore.listFeeds()  →  Get configured feeds
    │
    ▼
Promise.all(feeds.map(fetchSingleFeed))  →  Parallel RSS fetch
    │
    ▼
For each feed item:
    ├─ llm.summarizeForSRE(content)  →  Mock TL;DR
    └─ llm.categorizeNote(title)     →  Keyword categorization
    │
    ▼
Flatten → Sort by date → Take top 10 → Return JSON
```

### Origin Service (Coffee Data)

| Attribute | Value |
|-----------|-------|
| **Runtime** | Go 1.22 |
| **Framework** | `net/http` (standard library) |
| **Storage** | In-memory (Go slices) |
| **Port** | 8080 |

**Key design decisions:**
- Zero external dependencies — uses only the Go standard library
- CORS middleware is implemented as a higher-order function wrapping handlers
- Data is hardcoded in handler files for simplicity
- Clean separation: `models/` for types, `handlers/` for HTTP logic

### Mindset Service (Psychology Tips)

| Attribute | Value |
|-----------|-------|
| **Runtime** | Python 3.10+ |
| **Framework** | FastAPI 0.110.0 |
| **Server** | Uvicorn 0.27.1 |
| **Storage** | In-memory (Python list) |
| **Port** | 8000 |

**Key design decisions:**
- FastAPI was chosen for automatic OpenAPI documentation and type validation
- Tips are defined in a separate `tips.py` module for easy editing
- The `/tips/random` endpoint uses Python's `random.choice` for simplicity

## Shared Types

The `shared/types.ts` file defines the canonical TypeScript interfaces used across the system:

```typescript
CoffeeBean     {id, name, origin, roastLevel, flavorNotes}
BrewMethod     {id, name, description, waterTempCelsius, brewTimeSeconds}
ReleaseNote    {id, title, publishedAt, summary, category, url}
MindsetTip     {id, title, tip, author}
```

These types serve as the contract between services. The Go and Python services implement compatible JSON shapes.

## Data Flow

### Page Load Sequence

```
Browser loads http://localhost:3000
    │
    ├─ ThemeProvider reads localStorage('theme')
    │   └─ Sets data-theme attribute on <html>
    │
    ├─ BrewingGuide → GET /brew → Renders brewing methods
    │
    ├─ TipOfTheDay → GET /tips/random → Renders random tip
    │
    ├─ FeedManager → GET /feeds → Renders feed list
    │
    └─ ReleaseNotesFeed → GET /release-notes → Renders aggregated notes
```

### Feed Management Flow

```
User adds a feed in FeedManager
    │
    ├─ POST /feeds {name, url} → Press Service stores in Map
    │
    ├─ FeedManager re-fetches GET /feeds → Updates feed list
    │
    ├─ onFeedsChanged() callback → page.tsx increments refreshKey
    │
    └─ ReleaseNotesFeed re-fetches GET /release-notes with new feed
```

## SRE Patterns

### Health Checks
Every service exposes `GET /health` returning `{"status": "ok"}`. These endpoints are designed for:
- Kubernetes liveness/readiness probes
- Load balancer health checks
- Service mesh circuit breaker integration

### Chaos Engineering
The ChaosButton component demonstrates the chaos engineering concept:
- Triggers a visual "SYSTEM DEGRADED" state
- 5-second simulated outage window
- Currently client-side only; designed to be extended with real backend chaos injection

### Error Resilience
The RSS scraper implements per-feed error isolation:
- If one feed fails to parse, it generates an error placeholder
- Other feeds continue processing normally
- The frontend gracefully handles empty states and loading states

## Security Considerations

> ⚠️ This is a demo application. The following items should be addressed for production use:

- **CORS:** All services use `Access-Control-Allow-Origin: *` — restrict to known origins in production
- **Input validation:** The feed URL field accepts any URL — validate and sanitize in production
- **Rate limiting:** No rate limiting is implemented — add middleware for production
- **Authentication:** No auth layer — add API keys or OAuth for production
- **Data persistence:** All data is in-memory — use a database for production

## Future Extension Points

| Area | Current | Possible Enhancement |
|------|---------|---------------------|
| LLM Summarization | Mock (truncation + delay) | Vertex AI / Gemini API integration |
| Feed Storage | In-memory `Map` | Cloud Firestore or PostgreSQL |
| Authentication | None | Firebase Auth or Cloud IAP |
| Deployment | Local `npm run dev` | Cloud Run + Artifact Registry |
| Monitoring | `/health` endpoints | Cloud Monitoring + OpenTelemetry |
| Chaos Engineering | Client-side alert | Litmus Chaos or custom fault injection |
