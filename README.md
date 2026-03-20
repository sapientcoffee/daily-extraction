# ☕ The Daily Extraction

> **AI-Assisted Development & SRE Rituals** — A distributed microservices demo application showcasing modern cloud-native development, AI-assisted workflows, and Site Reliability Engineering patterns.

---

## Overview

The Daily Extraction is a coffee-themed ecosystem designed to demonstrate:

- **Microservices architecture** — Four independent services written in different languages (Go, Node.js, Python, TypeScript/React)
- **AI-assisted development** — Built collaboratively with AI coding assistants to showcase the "Human + AI" workflow
- **SRE patterns** — Health checks, chaos engineering hooks, monitoring-ready endpoints, and resilience testing
- **RSS aggregation** — Real-time GCP release notes with mock LLM summarization for SRE teams

## Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         The Barista (Frontend)                  │
│                     Next.js 16 / React 19 / TailwindCSS 4      │
│                          Port: 3000                             │
│  ┌──────────┐ ┌──────────┐ ┌─────────────┐ ┌───────────────┐  │
│  │ Brewing  │ │ Tip of   │ │ Release     │ │ Feed          │  │
│  │ Guide    │ │ the Day  │ │ Notes Feed  │ │ Manager       │  │
│  └────┬─────┘ └────┬─────┘ └──────┬──────┘ └───────┬───────┘  │
│       │             │              │                │           │
└───────┼─────────────┼──────────────┼────────────────┼───────────┘
        │             │              │                │
        ▼             ▼              ▼                ▼
┌───────────────────────────────────────────────────────────────┐
│                    Press Service (Node.js)                      │
│               Express.js — Port: 8081                          │
│                                                                │
│  Serves as the unified API gateway in demo mode.               │
│  Mocks Origin Service & Mindset Service endpoints.             │
│  ┌────────────┐  ┌──────────┐  ┌─────────────┐               │
│  │ RSS Scraper│  │ Mock LLM │  │ Feed Store  │               │
│  └────────────┘  └──────────┘  └─────────────┘               │
└───────────────────────────────────────────────────────────────┘

┌────────────────────────┐    ┌────────────────────────────────┐
│  Origin Service (Go)   │    │  Mindset Service (Python)      │
│  net/http — Port: 8080 │    │  FastAPI/Uvicorn — Port: 8000  │
│                        │    │                                │
│  • GET /beans          │    │  • GET /tips                   │
│  • GET /brew           │    │  • GET /tips/random            │
│  • GET /health         │    │  • GET /health                 │
└────────────────────────┘    └────────────────────────────────┘
```

> **Note:** In the current demo configuration, the **Press Service** acts as a unified backend, mocking the endpoints of both the Origin Service and Mindset Service. This simplifies running the demo to just two processes (frontend + press-service). The Go and Python services exist as standalone implementations for distributed deployment scenarios.

## Quick Start

### Prerequisites

- **Node.js** ≥ 18
- **Go** ≥ 1.22 *(optional — only needed for standalone Origin Service)*
- **Python** ≥ 3.10 *(optional — only needed for standalone Mindset Service)*

### Running the Demo (Minimal — 2 Processes)

```bash
# Terminal 1: Start the Press Service (unified backend)
cd press-service
npm install
npm run dev
# → Runs on http://localhost:8081

# Terminal 2: Start the Barista (frontend)
cd barista
npm install
npm run dev
# → Runs on http://localhost:3000
```

Open [http://localhost:3000](http://localhost:3000) to see The Daily Extraction.

### Running All Services (Full Distributed Mode)

```bash
# Terminal 1: Origin Service (Go)
cd origin-service
go run main.go
# → Runs on http://localhost:8080

# Terminal 2: Mindset Service (Python)
cd mindset-service
pip install -r requirements.txt
python main.py
# → Runs on http://localhost:8000

# Terminal 3: Press Service (Node.js)
cd press-service
npm install
npm run dev
# → Runs on http://localhost:8081

# Terminal 4: Barista Frontend (Next.js)
cd barista
npm install
npm run dev
# → Runs on http://localhost:3000
```

## Project Structure

```
daily-extraction/
├── barista/                  # Frontend — Next.js 16 / React 19
│   ├── src/
│   │   ├── app/
│   │   │   ├── globals.css       # Theme system (terminal + modern)
│   │   │   ├── layout.tsx        # Root layout with ThemeProvider
│   │   │   └── page.tsx          # Main dashboard page
│   │   └── components/
│   │       ├── BrewingGuide.tsx       # Coffee brew method display
│   │       ├── ChaosButton.tsx        # SRE chaos engineering trigger
│   │       ├── FeedManager.tsx        # RSS feed CRUD management
│   │       ├── ReleaseNotesFeed.tsx   # Aggregated release notes display
│   │       ├── ThemeProvider.tsx      # Terminal/Modern theme context
│   │       ├── ThemeToggle.tsx        # Theme switch UI component
│   │       └── TipOfTheDay.tsx        # AI adoption mindset tip
│   ├── package.json
│   ├── next.config.ts
│   └── tsconfig.json
│
├── press-service/            # Backend API — Node.js / Express.js
│   ├── src/
│   │   ├── index.js              # Express server + route definitions
│   │   ├── scraper.js            # RSS feed parser + aggregation
│   │   ├── llm.js                # Mock LLM summarization engine
│   │   └── feedStore.js          # In-memory feed store (CRUD)
│   └── package.json
│
├── origin-service/           # Coffee data API — Go
│   ├── main.go                   # HTTP server + CORS middleware
│   ├── handlers/
│   │   ├── beans.go              # GET /beans handler
│   │   └── brew.go               # GET /brew handler
│   ├── models/
│   │   └── types.go              # CoffeeBean + BrewMethod structs
│   └── go.mod
│
├── mindset-service/          # Psychology tips API — Python / FastAPI
│   ├── main.py                   # FastAPI app + route definitions
│   ├── tips.py                   # Tips data store
│   └── requirements.txt
│
├── shared/                   # Shared TypeScript type definitions
│   └── types.ts                  # CoffeeBean, BrewMethod, ReleaseNote, MindsetTip
│
├── README.md                 # ← You are here
├── CONTRIBUTING.md           # Contributor guidelines
└── docs/
    └── architecture.md       # Detailed architecture documentation
```

## Services

| Service | Language | Port | Purpose |
|---------|----------|------|---------|
| **Barista** | TypeScript (Next.js 16) | `3000` | Frontend dashboard — UI for brewing, tips, release notes, and feed management |
| **Press Service** | JavaScript (Express.js) | `8081` | Unified backend API — RSS scraping, mock LLM summarization, feed CRUD, and mocked service endpoints |
| **Origin Service** | Go (`net/http`) | `8080` | Coffee bean catalog and brew method data *(standalone mode)* |
| **Mindset Service** | Python (FastAPI) | `8000` | AI adoption psychology tips *(standalone mode)* |

## API Reference

### Press Service — `http://localhost:8081`

#### Feed Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/feeds` | List all configured RSS feed sources |
| `POST` | `/feeds` | Add a new RSS feed. Body: `{ "name": string, "url": string }` |
| `DELETE` | `/feeds/:id` | Remove a feed by ID |

#### Content

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/release-notes` | Fetch aggregated & summarized release notes from all feeds |
| `GET` | `/beans` | Get coffee bean catalog *(mocked from Origin Service)* |
| `GET` | `/brew` | Get brew method catalog *(mocked from Origin Service)* |
| `GET` | `/tips/random` | Get a random AI adoption mindset tip *(mocked from Mindset Service)* |

#### Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/health` | Health check — returns `{ "status": "ok" }` |

### Origin Service — `http://localhost:8080`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/beans` | Returns the coffee bean catalog (JSON array of `CoffeeBean`) |
| `GET` | `/brew` | Returns brewing methods (JSON array of `BrewMethod`) |
| `GET` | `/health` | Health check — returns `{ "status": "ok" }` |

### Mindset Service — `http://localhost:8000`

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/tips` | Returns all AI adoption tips |
| `GET` | `/tips/random` | Returns a single random tip |
| `GET` | `/health` | Health check — returns `{ "status": "ok" }` |

## Themes

The Barista frontend supports two visual themes, toggled via the UI button in the header:

| Theme | Aesthetic | Description |
|-------|-----------|-------------|
| **Terminal** *(default)* | Green-on-black, monospace, sharp corners | Retro terminal/hacker aesthetic with `>_` prompt prefixes |
| **Modern** | Slate/indigo, glassmorphism, rounded corners | Clean modern UI with backdrop blur and soft gradients |

Theme selection persists across page refreshes via `localStorage`.

## Key Features

### ☕ Brewing Guide
Displays available coffee brewing methods (V60, Espresso) sourced from the Origin Service, including water temperature and brew time.

### 🧠 Cognitive Architecture (Tip of the Day)
Shows psychology-backed tips on AI adoption from the Mindset Service. Tips rotate randomly on each page load.

### 📰 Release Notes Feed
Aggregates RSS feeds (defaulting to GCP Release Notes), parses entries, and applies mock LLM summarization with SRE-focused TL;DR summaries. Notes are categorized by service area (Compute, Database, Network, AI/ML, Other).

### 📡 Feed Manager
Full CRUD interface for managing RSS feed sources. Add custom feeds, remove existing ones, and see changes reflected immediately in the Release Notes panel.

### 💥 Chaos Engineering
A simulated chaos engineering button that triggers a visual "system degraded" state for 5 seconds — demonstrating SRE resilience testing patterns.

## Environment Variables

| Variable | Service | Default | Description |
|----------|---------|---------|-------------|
| `PORT` | Press Service | `8081` | HTTP server port |

## Tech Stack

| Technology | Version | Usage |
|------------|---------|-------|
| Next.js | 16.2.0 | Frontend framework |
| React | 19.2.4 | UI library |
| TailwindCSS | 4.x | Utility-first CSS |
| Express.js | 4.19.x | Press Service HTTP framework |
| rss-parser | 3.13.x | RSS/Atom feed parsing |
| Go | 1.22+ | Origin Service runtime |
| FastAPI | 0.110.0 | Mindset Service framework |
| Uvicorn | 0.27.1 | ASGI server for Python |

## License

This project is a demonstration application built for educational and showcase purposes.
