// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

// Package models defines the data structures used by the Origin Service.
// These types are serialized to JSON and served via the HTTP API.
// They correspond to the TypeScript interfaces in shared/types.ts.
package models

// CoffeeBean represents a single coffee bean variety in the catalog.
// JSON field names use camelCase to match the TypeScript interface contract.
type CoffeeBean struct {
	ID          string   `json:"id"`          // Unique identifier
	Name        string   `json:"name"`        // Bean name (e.g., "Ethiopia Yirgacheffe")
	Origin      string   `json:"origin"`      // Country of origin
	RoastLevel  string   `json:"roastLevel"`  // Roast level: "Light", "Medium", or "Dark"
	FlavorNotes []string `json:"flavorNotes"` // Array of tasting notes
}

// BrewMethod represents a coffee brewing technique with its parameters.
type BrewMethod struct {
	ID               string `json:"id"`               // Unique identifier (e.g., "v60")
	Name             string `json:"name"`              // Display name (e.g., "Hario V60")
	Description      string `json:"description"`       // Brief description of the method
	WaterTempCelsius int    `json:"waterTempCelsius"`  // Optimal water temperature in °C
	BrewTimeSeconds  int    `json:"brewTimeSeconds"`   // Recommended brew time in seconds
}

