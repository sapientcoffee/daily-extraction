// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

// Package handlers contains the HTTP request handlers for the Origin Service.
package handlers

import (
	"encoding/json"
	"net/http"
	"origin-service/models"
)

// beans is the in-memory coffee bean catalog, seeded with sample data.
var beans = []models.CoffeeBean{
	{ID: "1", Name: "Ethiopia Yirgacheffe", Origin: "Ethiopia", RoastLevel: "Light", FlavorNotes: []string{"Jasmine", "Blueberry", "Citrus"}},
	{ID: "2", Name: "Colombia Supremo", Origin: "Colombia", RoastLevel: "Medium", FlavorNotes: []string{"Chocolate", "Caramel", "Orange"}},
}

// GetBeans handles GET /beans requests.
// Returns the complete coffee bean catalog as a JSON array.
func GetBeans(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(beans)
}

