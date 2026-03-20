# Copyright 2026 Google LLC.
# SPDX-License-Identifier: Apache-2.0

"""
Tips data store for the Mindset Service.

Each tip is a dictionary with the following keys:
    - id (str):     Unique identifier
    - title (str):  Short, memorable title
    - tip (str):    Full tip text with psychological insight
    - author (str): Attribution / source

In production, this could be backed by a database (e.g., Cloud Firestore).
"""

TIPS = [
    {
        "id": "1",
        "title": "The Neuro-Coder",
        "tip": "Embrace LLMs as an extension of your working memory. Instead of memorizing syntax, focus on cultivating high-level architectural intent.",
        "author": "Cognitive Architecture of AI Adoption"
    },
    {
        "id": "2",
        "title": "Sovereignty in the Loop",
        "tip": "AI generates the code, but you own the system. Never blindly deploy. Maintain your sovereignty by understanding the 'why' behind the generated 'how'.",
        "author": "Cognitive Architecture of AI Adoption"
    },
    {
        "id": "3",
        "title": "Prompt as Programming",
        "tip": "Writing a good prompt is equivalent to writing a good compiler constraint. Be specific, define the boundaries, and provide clear contexts.",
        "author": "Cognitive Architecture of AI Adoption"
    }
]
