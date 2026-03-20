// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

// Package main implements the Origin Service for The Daily Extraction.
//
// The Origin Service is a lightweight HTTP server that provides coffee
// bean catalog and brewing method data. It uses only the Go standard
// library with no external dependencies.
//
// Endpoints:
//   - GET /beans  — Returns the coffee bean catalog
//   - GET /brew   — Returns available brewing methods
//   - GET /health — Health check for monitoring/readiness probes
//
// Default port: 8080
package main

import (
	"fmt"
	"log"
	"net/http"
	"origin-service/handlers"
)

// enableCORS is a middleware that wraps an http.HandlerFunc to add
// cross-origin resource sharing headers. It allows all origins (*),
// GET and OPTIONS methods, and Content-Type headers.
// Preflight OPTIONS requests are handled with a 200 OK response.
func enableCORS(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
			return
		}
		next(w, r)
	}
}

func main() {
	mux := http.NewServeMux()

	// Coffee domain endpoints
	mux.HandleFunc("/beans", enableCORS(handlers.GetBeans))
	mux.HandleFunc("/brew", enableCORS(handlers.GetBrewMethods))

	// Operations endpoint
	mux.HandleFunc("/health", enableCORS(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	}))

	fmt.Println("Origin Service running on :8080")
	if err := http.ListenAndServe(":8080", mux); err != nil {
		log.Fatalf("could not start server: %v", err)
	}
}

