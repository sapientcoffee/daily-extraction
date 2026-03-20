# 📦 Shared Types

> Canonical TypeScript type definitions shared across The Daily Extraction services.

## Overview

This directory contains the TypeScript interface definitions that serve as the **data contract** between all services in the ecosystem. While the backend services are written in different languages (Go, Python, JavaScript), they all produce JSON payloads conforming to these shapes.

## Types

### `CoffeeBean`
Represents a coffee bean variety in the catalog.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Bean name (e.g., "Ethiopia Yirgacheffe") |
| `origin` | `string` | Country of origin |
| `roastLevel` | `'Light' \| 'Medium' \| 'Dark'` | Roast level enum |
| `flavorNotes` | `string[]` | Array of tasting notes |

### `BrewMethod`
Represents a coffee brewing method.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `name` | `string` | Method name (e.g., "Hario V60") |
| `description` | `string` | Brief description |
| `waterTempCelsius` | `number` | Optimal water temperature in °C |
| `brewTimeSeconds` | `number` | Recommended brew time in seconds |

### `ReleaseNote`
Represents an aggregated and summarized release note.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier (GUID from RSS or generated) |
| `title` | `string` | Release note title |
| `publishedAt` | `string` | ISO 8601 publication date |
| `summary` | `string` | SRE-focused LLM-generated summary |
| `category` | `'Compute' \| 'Database' \| 'Network' \| 'AI/ML' \| 'Other'` | Service category |
| `url` | `string` | Link to the original release note |

### `MindsetTip`
Represents a psychology-backed AI adoption tip.

| Field | Type | Description |
|-------|------|-------------|
| `id` | `string` | Unique identifier |
| `title` | `string` | Short, memorable title |
| `tip` | `string` | Full tip text |
| `author` | `string` | Attribution / source |

## Usage

These types can be imported by any TypeScript service in the monorepo:

```typescript
import { CoffeeBean, BrewMethod, ReleaseNote, MindsetTip } from '../shared/types';
```

## Cross-Language Compatibility

| TypeScript Interface | Go Struct | Python Dict Keys |
|---------------------|-----------|-------------------|
| `CoffeeBean` | `models.CoffeeBean` | `id`, `name`, `origin`, `roastLevel`, `flavorNotes` |
| `BrewMethod` | `models.BrewMethod` | `id`, `name`, `description`, `waterTempCelsius`, `brewTimeSeconds` |
| `ReleaseNote` | *(not implemented)* | *(returned by scraper)* |
| `MindsetTip` | *(not implemented)* | `id`, `title`, `tip`, `author` |
