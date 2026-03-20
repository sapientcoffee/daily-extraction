# ☕ The Barista — Frontend Service

> The Daily Extraction's frontend dashboard, built with **Next.js 16**, **React 19**, and **TailwindCSS 4**.

## Overview

The Barista is a single-page dashboard that aggregates data from all backend services into a unified, coffee-themed SRE command center. It features a dual-theme system (Terminal vs. Modern), live RSS feed aggregation, and a chaos engineering button.

## Quick Start

```bash
# Install dependencies
npm install

# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

> **Prerequisite:** The [Press Service](../press-service/) must be running on port `8081` for data to load.

## Scripts

| Script | Command | Description |
|--------|---------|-------------|
| `dev` | `npm run dev` | Start Next.js dev server with hot reload |
| `build` | `npm run build` | Create production build |
| `start` | `npm run start` | Serve production build |
| `lint` | `npm run lint` | Run ESLint |

## Architecture

```
src/
├── app/
│   ├── globals.css           # Theme system: CSS custom properties for terminal + modern themes
│   ├── layout.tsx            # Root layout — wraps app in ThemeProvider
│   └── page.tsx              # Main dashboard — grid layout of all panels
│
└── components/
    ├── ThemeProvider.tsx      # React context for theme state + localStorage persistence
    ├── ThemeToggle.tsx        # Toggle button with animated terminal/sparkle icons
    ├── BrewingGuide.tsx       # Displays brewing methods from /brew endpoint
    ├── TipOfTheDay.tsx        # Shows random AI adoption tip from /tips/random
    ├── ReleaseNotesFeed.tsx   # Renders aggregated release notes from /release-notes
    ├── FeedManager.tsx        # CRUD interface for RSS feed management via /feeds
    └── ChaosButton.tsx        # Simulated chaos engineering trigger
```

## Components

### `ThemeProvider`
A React Context provider that manages the application-wide theme state. Supports two themes:
- **Terminal** — Green-on-black with monospace font, sharp corners, `>_` prompt indicators
- **Modern** — Slate/indigo palette with glassmorphism, rounded corners, sans-serif

Theme preference is persisted to `localStorage` and applied via `data-theme` attribute on `<html>`.

### `ThemeToggle`
A button component that toggles between themes. Renders an animated icon transition (terminal prompt ↔ sparkle) and displays the current mode name.

### `BrewingGuide`
Fetches brewing methods from `GET /brew` (port 8081) and displays them in a list. Shows a loading state while the backend is unreachable.

### `TipOfTheDay`
Fetches a random AI adoption mindset tip from `GET /tips/random` (port 8081). Displays the tip title, body, and author attribution.

### `ReleaseNotesFeed`
Fetches and renders aggregated release notes from `GET /release-notes` (port 8081). Each note displays:
- Title (as a link to the original)
- Category badge (Compute, Database, Network, AI/ML, Other)
- Feed source badge
- SRE-focused summary
- Publication date

Accepts a `refreshKey` prop to trigger re-fetching when feed sources change.

### `FeedManager`
A collapsible panel providing full CRUD operations for RSS feed sources:
- **List** — Shows all configured feeds with name and URL
- **Add** — Form to add a new feed with name and RSS URL
- **Remove** — Per-feed delete button (visible on hover)

Communicates with the Press Service's `/feeds` endpoints and notifies the parent when feeds change via `onFeedsChanged` callback.

### `ChaosButton`
A simulated chaos engineering trigger. On click, shows a browser alert and enters a "SYSTEM DEGRADED" state for 5 seconds. Demonstrates SRE resilience testing patterns.

## Theme System

The theme system uses CSS custom properties defined in `globals.css`:

| Variable | Terminal Value | Modern Value | Usage |
|----------|---------------|--------------|-------|
| `--background` | `#0a0a0a` | `#0f172a` | Page background |
| `--foreground` | `#00ff00` | `#f8fafc` | Primary text color |
| `--panel-bg` | `#111111` | `rgba(30,41,59,0.7)` | Card/panel background |
| `--panel-border` | `#333333` | `rgba(255,255,255,0.1)` | Panel border color |
| `--accent` | `#ffb86c` (amber) | `#6366f1` (indigo) | Headings, highlights |
| `--font-main` | Geist Mono | Geist Sans | Primary font |
| `--radius` | `0px` | `12px` | Border radius |
| `--terminal-opacity` | `1` | `0` | Controls `>_` prompt visibility |

## Backend Endpoints Used

All API calls target `http://localhost:8081` (Press Service):

| Endpoint | Used By | Purpose |
|----------|---------|---------|
| `GET /brew` | `BrewingGuide` | Fetch brewing methods |
| `GET /tips/random` | `TipOfTheDay` | Fetch random mindset tip |
| `GET /release-notes` | `ReleaseNotesFeed` | Fetch aggregated release notes |
| `GET /feeds` | `FeedManager` | List all feed sources |
| `POST /feeds` | `FeedManager` | Add a new feed source |
| `DELETE /feeds/:id` | `FeedManager` | Remove a feed source |

## Tech Stack

- **Next.js** 16.2.0
- **React** 19.2.4
- **TailwindCSS** 4.x (via PostCSS plugin)
- **TypeScript** 5.x
- **Geist font family** (Sans + Mono)
