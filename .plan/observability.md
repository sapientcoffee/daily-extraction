# Implementation Plan: Google Cloud Observability via OpenTelemetry

## Background & Motivation
The `daily-extraction` project is a distributed microservices application designed to demonstrate SRE patterns. Currently, the services use basic standard output for logging (`console.log`, `fmt.Println`, `print`) and lack any form of distributed tracing or business metrics. To achieve production-grade visibility, we need robust observability capabilities integrated directly into the services.

## Scope & Impact
This plan covers the instrumentation of all four services:
- **Barista (Next.js/React):** Client-side and server-side traces, structured logging.
- **Press Service (Node.js/Express):** Request tracing, latency metrics, structured logging.
- **Origin Service (Go):** Request tracing, custom metrics, structured logging.
- **Mindset Service (Python/FastAPI):** Request tracing, latency metrics, structured logging.

Impact:
- Adding OpenTelemetry dependencies to `package.json`, `go.mod`, and `requirements.txt`.
- Modifying service initialization to configure OpenTelemetry providers and exporters.
- Updating logging statements to emit JSON-structured logs with W3C Trace Context IDs.
- Emitting traces and metrics to Google Cloud Operations Suite (Trace, Monitoring, Logging).

## Proposed Solution
We will standardize on **OpenTelemetry (OTel)** across all services, aligning with modern SRE best practices and Google Cloud's recommendations for distributed tracing and metrics.

1. **Logging**: Migrate all services to structured JSON logging to `stdout`/`stderr`. Cloud Run/App Hosting automatically captures these and ingests them into Cloud Logging. We will inject the OTel Trace ID into the log payload to correlate logs with traces in GCP.
2. **Tracing**: Instrument all incoming HTTP requests and outgoing external calls with OTel Tracing. Export traces to Google Cloud Trace using the GCP OTel Exporters.
3. **Metrics**: Instrument key endpoints to emit latency histograms, request counters, and error rates using OTel Metrics. Export to Google Cloud Monitoring.

## Alternatives Considered
- **GCP Native SDKs**: Rejected in favor of OpenTelemetry to avoid vendor lock-in and adopt industry-standard instrumentation patterns across different languages.
- **Service Mesh (e.g., Istio/Anthos)**: While a mesh could provide network-level observability without code changes, it does not provide code-level traces, custom business metrics, or structured application logging with trace correlation.

## Implementation Plan

### Phase 1: Shared Definitions & Setup
1. Define a standard JSON log format across all languages.
    - Fields: `severity`, `message`, `logging.googleapis.com/trace`, `logging.googleapis.com/spanId` (for GCP log-trace correlation).
2. Ensure `GOOGLE_CLOUD_PROJECT` environment variable is available to all services during deployment.

### Phase 2: Press Service (Node.js/Express)
1. Add dependencies: `@opentelemetry/api`, `@opentelemetry/sdk-node`, `@opentelemetry/auto-instrumentations-node`, `@google-cloud/opentelemetry-cloud-trace-exporter`, `@google-cloud/opentelemetry-cloud-monitoring-exporter`, `winston`.
2. Create `src/tracing.js` to initialize the OTel NodeSDK before `index.js` loads.
3. Configure `winston` to output JSON and automatically append the current active trace ID and span ID to logs.
4. Replace `console.log` statements with the new `winston` logger.

### Phase 3: Mindset Service (Python/FastAPI)
1. Add dependencies: `opentelemetry-api`, `opentelemetry-sdk`, `opentelemetry-instrumentation-fastapi`, `opentelemetry-exporter-gcp-trace`, `opentelemetry-exporter-gcp-monitoring`, `python-json-logger`.
2. Update `main.py` to initialize OTel TracerProvider and MeterProvider with GCP exporters.
3. Instrument the FastAPI app using `FastAPIInstrumentor.instrument_app(app)`.
4. Configure Python's standard `logging` to use `python-json-logger` and inject trace context using a custom log filter.

### Phase 4: Origin Service (Go)
1. Add dependencies: `go.opentelemetry.io/otel`, `go.opentelemetry.io/contrib/instrumentation/net/http/otelhttp`, `github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/trace`, `github.com/GoogleCloudPlatform/opentelemetry-operations-go/exporter/metric`.
2. Update `main.go` to initialize the OTel SDK with GCP exporters.
3. Wrap HTTP handlers using `otelhttp.NewHandler`.
4. Implement a structured logger using Go 1.21+ `slog` that extracts trace IDs from the request context and formats output as JSON.

### Phase 5: Barista (Next.js/React)
1. Add dependencies: `@opentelemetry/api`, `@opentelemetry/sdk-trace-node` (for API routes), `@google-cloud/opentelemetry-cloud-trace-exporter`.
2. Configure Next.js experimental OpenTelemetry support (`instrumentation.ts` or custom setup).
3. Ensure trace context is propagated from Barista to Press Service using W3C Trace Context headers.

## Verification & Testing
1. **Local Verification**: Run all services locally. Verify that structured JSON logs are emitted to the console and contain `logging.googleapis.com/trace` IDs.
2. **Integration Testing**: Hit the Barista frontend. Verify that a single request generates a distributed trace visible in Google Cloud Trace, spanning Barista -> Press -> Origin/Mindset.
3. **Metrics Validation**: Check Google Cloud Monitoring Metrics Explorer to confirm custom metrics (e.g., request count, latency) are appearing under the `custom.googleapis.com/opentelemetry/` prefix.
4. **Error Reporting**: Trigger an error (e.g., using the existing ChaosButton) and verify the exception is captured in Google Cloud Error Reporting with associated trace contexts.

## Migration & Rollback
- **Migration**: Deploy the updated services. The changes are purely additive (observability sidecars/libraries) and do not alter the core business logic.
- **Rollback**: If instrumentation causes significant performance degradation or crashes, revert the commits introducing the OTel SDK initialization in each service, falling back to the previous un-instrumented state.
