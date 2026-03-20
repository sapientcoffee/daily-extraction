package handlers

import (
	"encoding/json"
	"net/http"
	"origin-service/models"
)

// methods is the in-memory brewing method catalog, seeded with sample data.
var methods = []models.BrewMethod{
	{ID: "v60", Name: "Hario V60", Description: "Pour over method for clean cup", WaterTempCelsius: 93, BrewTimeSeconds: 180},
	{ID: "espresso", Name: "Espresso", Description: "Concentrated strong brew", WaterTempCelsius: 92, BrewTimeSeconds: 30},
}

// GetBrewMethods handles GET /brew requests.
// Returns all available brewing methods as a JSON array.
func GetBrewMethods(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.Header().Set("Access-Control-Allow-Origin", "*")
	json.NewEncoder(w).Encode(methods)
}

