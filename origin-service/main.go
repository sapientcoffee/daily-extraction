// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

package main

import (
	"context"
	"fmt"
	"log"
	"log/slog"
	"net/http"
	"os"

	"origin-service/handlers"

	texporter "github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace"
	"go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/sdk/resource"
	sdktrace "go.opentelemetry.io/otel/sdk/trace"
	semconv "go.opentelemetry.io/otel/semconv/v1.24.0"
	"go.opentelemetry.io/otel/trace"
)

// enableCORS is a middleware that wraps an http.HandlerFunc to add
// cross-origin resource sharing headers.
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

// initTracer initializes the Google Cloud Trace exporter.
func initTracer() *sdktrace.TracerProvider {
	projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
	var exporter sdktrace.SpanExporter
	var err error

	if projectID != "" {
		exporter, err = texporter.New(texporter.WithProjectID(projectID))
		if err != nil {
			log.Fatalf("texporter.New: %v", err)
		}
	} else {
		log.Println("GOOGLE_CLOUD_PROJECT not set, using stdout or no-op exporter")
	}

	res := resource.NewWithAttributes(
		semconv.SchemaURL,
		semconv.ServiceNameKey.String("origin-service"),
	)

	tpOpts := []sdktrace.TracerProviderOption{
		sdktrace.WithResource(res),
	}
	if exporter != nil {
		tpOpts = append(tpOpts, sdktrace.WithBatcher(exporter))
	}

	tp := sdktrace.NewTracerProvider(tpOpts...)
	otel.SetTracerProvider(tp)
	return tp
}

// gcpSlogHandler wraps slog.JSONHandler to inject GCP-specific trace fields.
type gcpSlogHandler struct {
	slog.Handler
}

func (h *gcpSlogHandler) Handle(ctx context.Context, r slog.Record) error {
	span := trace.SpanFromContext(ctx)
	if span.SpanContext().IsValid() {
		projectID := os.Getenv("GOOGLE_CLOUD_PROJECT")
		if projectID != "" {
			traceID := span.SpanContext().TraceID().String()
			r.AddAttrs(
				slog.String("logging.googleapis.com/trace", fmt.Sprintf("projects/%s/traces/%s", projectID, traceID)),
				slog.String("logging.googleapis.com/spanId", span.SpanContext().SpanID().String()),
				slog.Bool("logging.googleapis.com/trace_sampled", span.SpanContext().IsSampled()),
			)
		}
	}
	// Map slog levels to GCP severity
	switch r.Level {
	case slog.LevelInfo:
		r.AddAttrs(slog.String("severity", "INFO"))
	case slog.LevelWarn:
		r.AddAttrs(slog.String("severity", "WARNING"))
	case slog.LevelError:
		r.AddAttrs(slog.String("severity", "ERROR"))
	}
	return h.Handler.Handle(ctx, r)
}

func main() {
	tp := initTracer()
	defer func() {
		if err := tp.Shutdown(context.Background()); err != nil {
			log.Fatalf("TracerProvider shutdown: %v", err)
		}
	}()

	// Setup structured JSON logging
	logger := slog.New(&gcpSlogHandler{
		Handler: slog.NewJSONHandler(os.Stdout, nil),
	})
	slog.SetDefault(logger)

	mux := http.NewServeMux()

	// Coffee domain endpoints wrapped with OTel HTTP
	mux.Handle("/beans", otelhttp.NewHandler(http.HandlerFunc(enableCORS(handlers.GetBeans)), "GetBeans"))
	mux.Handle("/brew", otelhttp.NewHandler(http.HandlerFunc(enableCORS(handlers.GetBrewMethods)), "GetBrewMethods"))

	// Operations endpoint
	mux.Handle("/health", otelhttp.NewHandler(http.HandlerFunc(enableCORS(func(w http.ResponseWriter, r *http.Request) {
		slog.InfoContext(r.Context(), "Health check executed")
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"ok"}`))
	})), "HealthCheck"))

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	slog.Info("Origin Service running", "port", port)
	if err := http.ListenAndServe(":"+port, mux); err != nil {
		slog.Error("could not start server", "error", err)
	}
}