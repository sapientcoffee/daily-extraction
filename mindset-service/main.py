# Copyright 2026 Google LLC.
# SPDX-License-Identifier: Apache-2.0

"""
Mindset Service — AI Adoption Psychology Tips API

A FastAPI microservice that provides psychology-backed tips on AI adoption
for The Daily Extraction ecosystem. Tips cover human-AI collaboration,
prompt engineering mindset, and maintaining engineering sovereignty.

Endpoints:
    GET /tips        — Returns all available tips
    GET /tips/random — Returns a single randomly selected tip
    GET /health      — Health check for monitoring/readiness probes

Default port: 8000
Interactive docs: http://localhost:8000/docs
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import random
from tips import TIPS
import logging
from pythonjsonlogger import jsonlogger
from opentelemetry import trace
from opentelemetry.sdk.trace import TracerProvider
from opentelemetry.sdk.trace.export import BatchSpanProcessor
from opentelemetry.exporter.cloud_trace import CloudTraceSpanExporter
from opentelemetry.instrumentation.fastapi import FastAPIInstrumentor
import os

# ─────────────────────────────────────────────────────────────
# Observability Configuration: OpenTelemetry + Structured Logging
# ─────────────────────────────────────────────────────────────

class GCPLoggingFilter(logging.Filter):
    def filter(self, record):
        span = trace.get_current_span()
        # Default severity mapping
        record.severity = record.levelname
        
        if span.is_recording():
            ctx = span.get_span_context()
            project_id = os.environ.get("GOOGLE_CLOUD_PROJECT", "")
            if project_id:
                record.logging_googleapis_com_trace = f"projects/{project_id}/traces/{trace.format_trace_id(ctx.trace_id)}"
                record.logging_googleapis_com_spanId = trace.format_span_id(ctx.span_id)
                record.logging_googleapis_com_trace_sampled = ctx.trace_flags.sampled
        return True

# Initialize structured JSON logging
logger = logging.getLogger("mindset-service")
logger.setLevel(logging.INFO)
logHandler = logging.StreamHandler()
formatter = jsonlogger.JsonFormatter(
    fmt="%(asctime)s %(levelname)s %(message)s",
    rename_fields={
        "levelname": "severity",
        "logging_googleapis_com_trace": "logging.googleapis.com/trace",
        "logging_googleapis_com_spanId": "logging.googleapis.com/spanId",
        "logging_googleapis_com_trace_sampled": "logging.googleapis.com/trace_sampled"
    }
)
logHandler.setFormatter(formatter)
logger.addHandler(logHandler)
logger.addFilter(GCPLoggingFilter())

# Initialize Google Cloud Tracing
trace.set_tracer_provider(TracerProvider())
try:
    cloud_trace_exporter = CloudTraceSpanExporter()
    trace.get_tracer_provider().add_span_processor(BatchSpanProcessor(cloud_trace_exporter))
except Exception as e:
    logger.warning("Failed to initialize CloudTraceSpanExporter. Ensure GOOGLE_APPLICATION_CREDENTIALS are set.", extra={"error": str(e)})

app = FastAPI(
    title="The Mindset Service",
    description="Psychology-backed tips for AI adoption in engineering teams",
    version="1.0.0",
)

# Instrument the FastAPI app with OpenTelemetry
FastAPIInstrumentor.instrument_app(app)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/tips")
def get_all_tips():
    """Return the complete list of AI adoption mindset tips."""
    logger.info("Fetching all mindset tips")
    return TIPS


@app.get("/tips/random")
def get_random_tip():
    """Return a single randomly selected tip from the catalog."""
    tip = random.choice(TIPS)
    logger.info("Serving random mindset tip", extra={"tip_id": tip["id"]})
    return tip


@app.get("/health")
def health_check():
    """Health check endpoint for monitoring and readiness probes."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

