/**
 * @module press-service
 * @description The Press Service — unified backend API for The Daily Extraction.
 *
 * In demo mode, this service acts as the single API gateway, serving:
 *   1. RSS feed aggregation with mock LLM summarization (native)
 *   2. Feed source CRUD management (native)
 *   3. Coffee bean & brew method data (mocked from Origin Service)
 *   4. AI adoption mindset tips (mocked from Mindset Service)
 *
 * @see {@link ../README.md} for full API documentation
 */

const express = require('express');
const cors = require('cors');
const scraper = require('./scraper');
const feedStore = require('./feedStore');

const app = express();
const PORT = process.env.PORT || 8081;

app.use(cors());
app.use(express.json());

// ─────────────────────────────────────────────────────────────
// Feed Management CRUD — native endpoints for managing RSS sources
// ─────────────────────────────────────────────────────────────

/** GET /feeds — List all configured RSS feed sources */
app.get('/feeds', (req, res) => {
    res.json(feedStore.listFeeds());
});

/**
 * POST /feeds — Add a new RSS feed source
 * @body {string} name - Human-readable feed name
 * @body {string} url  - RSS/Atom feed URL
 * @returns {201} Created feed object with generated UUID
 * @returns {400} If name or url is missing
 */
app.post('/feeds', (req, res) => {
    const { name, url } = req.body;
    if (!name || !url) {
        return res.status(400).json({ error: 'name and url are required' });
    }
    const feed = feedStore.addFeed(name, url);
    res.status(201).json(feed);
});

/**
 * DELETE /feeds/:id — Remove a feed source by UUID
 * @param {string} id - Feed UUID
 * @returns {204} Successfully deleted
 * @returns {404} Feed not found
 */
app.delete('/feeds/:id', (req, res) => {
    const removed = feedStore.removeFeed(req.params.id);
    if (!removed) {
        return res.status(404).json({ error: 'Feed not found' });
    }
    res.status(204).send();
});

// ─────────────────────────────────────────────────────────────
// Content Aggregation — RSS scraping with mock LLM processing
// ─────────────────────────────────────────────────────────────

/**
 * GET /release-notes — Fetch and summarize release notes from all feeds.
 * Aggregates up to 5 items per feed, processes through mock LLM,
 * returns the 10 most recent entries sorted by date descending.
 */
app.get('/release-notes', async (req, res) => {
    try {
        const notes = await scraper.fetchAndSummarizeNotes();
        res.json(notes);
    } catch (error) {
        console.error('Error fetching release notes:', error);
        res.status(500).json({ error: 'Failed to fetch release notes' });
    }
});

// ─────────────────────────────────────────────────────────────
// Mocked Origin Service (Go) — Coffee domain data
// In distributed mode, these would be served by the Go service on :8080
// ─────────────────────────────────────────────────────────────

/** GET /beans — Returns the coffee bean catalog (mocked from Origin Service) */
app.get('/beans', (req, res) => {
    res.json([
        { id: "1", name: "Ethiopia Yirgacheffe", origin: "Ethiopia", roastLevel: "Light", flavorNotes: ["Jasmine", "Blueberry", "Citrus"] },
        { id: "2", name: "Colombia Supremo", origin: "Colombia", roastLevel: "Medium", flavorNotes: ["Chocolate", "Caramel", "Orange"] }
    ]);
});

/** GET /brew — Returns brewing methods (mocked from Origin Service) */
app.get('/brew', (req, res) => {
    res.json([
        { id: "v60", name: "Hario V60", description: "Pour over method for clean cup", waterTempCelsius: 93, brewTimeSeconds: 180 },
        { id: "espresso", name: "Espresso", description: "Concentrated strong brew", waterTempCelsius: 92, brewTimeSeconds: 30 }
    ]);
});

// ─────────────────────────────────────────────────────────────
// Mocked Mindset Service (Python) — AI adoption psychology tips
// In distributed mode, these would be served by the FastAPI service on :8000
// ─────────────────────────────────────────────────────────────

/** @type {Array<{id: string, title: string, tip: string, author: string}>} */
const TIPS = [
    { id: "1", title: "The Neuro-Coder", tip: "Embrace LLMs as an extension of your working memory. Instead of memorizing syntax, focus on cultivating high-level architectural intent.", author: "Cognitive Architecture of AI Adoption" },
    { id: "2", title: "Sovereignty in the Loop", tip: "AI generates the code, but you own the system. Never blindly deploy. Maintain your sovereignty by understanding the 'why' behind the generated 'how'.", author: "Cognitive Architecture of AI Adoption" },
    { id: "3", title: "Prompt as Programming", tip: "Writing a good prompt is equivalent to writing a good compiler constraint. Be specific, define the boundaries, and provide clear contexts.", author: "Cognitive Architecture of AI Adoption" }
];

/** GET /tips/random — Returns a randomly selected mindset tip (mocked from Mindset Service) */
app.get('/tips/random', (req, res) => {
    const tip = TIPS[Math.floor(Math.random() * TIPS.length)];
    res.json(tip);
});

// ─────────────────────────────────────────────────────────────
// Operations — health checks and monitoring
// ─────────────────────────────────────────────────────────────

/** GET /health — Liveness probe. Returns { status: 'ok' } */
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Start server
app.listen(PORT, () => {
    console.log(`Press Service running on port ${PORT}`);
});
