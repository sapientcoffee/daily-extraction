/**
 * @module feedStore
 * @description In-memory store for managing RSS feed sources.
 *
 * Uses a JavaScript Map for O(1) lookups. Data is volatile — all feeds
 * are lost on server restart. Seeded with the GCP Release Notes feed
 * by default.
 *
 * @typedef {Object} Feed
 * @property {string} id   - UUID v4 identifier
 * @property {string} name - Human-readable feed name
 * @property {string} url  - RSS/Atom feed URL
 */

const crypto = require('crypto');

/** @type {Map<string, Feed>} */
const feeds = new Map();

// Seed the store with the default GCP Release Notes feed
const defaultId = crypto.randomUUID();
feeds.set(defaultId, {
    id: defaultId,
    name: 'GCP Release Notes',
    url: 'https://cloud.google.com/feeds/gcp-release-notes.xml'
});

/**
 * Returns all configured feeds as an array.
 * @returns {Feed[]} Array of all feed objects
 */
function listFeeds() {
    return Array.from(feeds.values());
}

/**
 * Creates and stores a new feed with a generated UUID.
 * @param {string} name - Human-readable feed name
 * @param {string} url  - RSS/Atom feed URL
 * @returns {Feed} The newly created feed object
 */
function addFeed(name, url) {
    const id = crypto.randomUUID();
    const feed = { id, name, url };
    feeds.set(id, feed);
    return feed;
}

/**
 * Removes a feed by its UUID.
 * @param {string} id - Feed UUID to remove
 * @returns {boolean} true if the feed existed and was removed, false otherwise
 */
function removeFeed(id) {
    const existed = feeds.has(id);
    feeds.delete(id);
    return existed;
}

/**
 * Retrieves a single feed by ID.
 * @param {string} id - Feed UUID to look up
 * @returns {Feed|null} The feed object, or null if not found
 */
function getFeed(id) {
    return feeds.get(id) || null;
}

module.exports = {
    listFeeds,
    addFeed,
    removeFeed,
    getFeed
};
