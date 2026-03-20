# 🫘 Origin Service — Coffee Data API

> A lightweight Go HTTP service providing coffee bean and brewing method data for The Daily Extraction ecosystem.

## Overview

The Origin Service is the coffee domain data provider, offering RESTful endpoints for querying the coffee bean catalog and available brewing methods. It's built with Go's standard library `net/http` — no external frameworks required.

> **Note:** In the current demo configuration, these endpoints are mocked within the [Press Service](../press-service/). This standalone Go service is available for full distributed deployments.

## Quick Start

```bash
# Run the service
go run main.go
```

The service runs on [http://localhost:8080](http://localhost:8080).

## API Endpoints

### `GET /beans`
Returns the complete coffee bean catalog.

**Response:** `200 OK`
```json
[
  {
    "id": "1",
    "name": "Ethiopia Yirgacheffe",
    "origin": "Ethiopia",
    "roastLevel": "Light",
    "flavorNotes": ["Jasmine", "Blueberry", "Citrus"]
  },
  {
    "id": "2",
    "name": "Colombia Supremo",
    "origin": "Colombia",
    "roastLevel": "Medium",
    "flavorNotes": ["Chocolate", "Caramel", "Orange"]
  }
]
```

### `GET /brew`
Returns all available brewing methods.

**Response:** `200 OK`
```json
[
  {
    "id": "v60",
    "name": "Hario V60",
    "description": "Pour over method for clean cup",
    "waterTempCelsius": 93,
    "brewTimeSeconds": 180
  },
  {
    "id": "espresso",
    "name": "Espresso",
    "description": "Concentrated strong brew",
    "waterTempCelsius": 92,
    "brewTimeSeconds": 30
  }
]
```

### `GET /health`
Health check endpoint for monitoring and readiness probes.

**Response:** `200 OK`
```json
{ "status": "ok" }
```

## Architecture

```
origin-service/
├── main.go              # HTTP server setup, CORS middleware, route registration
├── handlers/
│   ├── beans.go         # GET /beans — returns coffee bean catalog
│   └── brew.go          # GET /brew — returns brewing method catalog
├── models/
│   └── types.go         # CoffeeBean and BrewMethod struct definitions
└── go.mod               # Go module definition (go 1.22)
```

## Data Models

### `CoffeeBean`
```go
type CoffeeBean struct {
    ID          string   `json:"id"`
    Name        string   `json:"name"`
    Origin      string   `json:"origin"`
    RoastLevel  string   `json:"roastLevel"`
    FlavorNotes []string `json:"flavorNotes"`
}
```

### `BrewMethod`
```go
type BrewMethod struct {
    ID               string `json:"id"`
    Name             string `json:"name"`
    Description      string `json:"description"`
    WaterTempCelsius int    `json:"waterTempCelsius"`
    BrewTimeSeconds  int    `json:"brewTimeSeconds"`
}
```

## CORS

The service includes a `enableCORS` middleware that sets the following headers on all responses:
- `Access-Control-Allow-Origin: *`
- `Access-Control-Allow-Methods: GET, OPTIONS`
- `Access-Control-Allow-Headers: Content-Type`

Preflight `OPTIONS` requests are handled automatically.

## Requirements

- **Go** ≥ 1.22
- No external dependencies (standard library only)
