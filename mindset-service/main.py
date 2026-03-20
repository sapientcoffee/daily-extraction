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

app = FastAPI(
    title="The Mindset Service",
    description="Psychology-backed tips for AI adoption in engineering teams",
    version="1.0.0",
)

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
    return TIPS


@app.get("/tips/random")
def get_random_tip():
    """Return a single randomly selected tip from the catalog."""
    return random.choice(TIPS)


@app.get("/health")
def health_check():
    """Health check endpoint for monitoring and readiness probes."""
    return {"status": "ok"}


if __name__ == "__main__":
    import uvicorn
    import os
    port = int(os.environ.get("PORT", 8000))
    uvicorn.run(app, host="0.0.0.0", port=port)

