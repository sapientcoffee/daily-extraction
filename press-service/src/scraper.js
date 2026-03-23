// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

/**
 * @module scraper
 * @description RSS feed aggregation pipeline.
 *
 * Fetches all configured feeds in parallel, takes the top 5 items from each,
 * processes them through the mock LLM for summarization and categorization,
 * and returns the 10 most recent entries across all feeds.
 *
 * Error handling is per-feed: if one feed fails, a placeholder error entry
 * is returned while the others continue processing normally.
 */

const Parser = require('rss-parser');
const llm = require('./llm');
const feedStore = require('./feedStore');
const logger = require('./logger');

const parser = new Parser();

/**
 * Fetches and summarizes release notes from all configured RSS feeds.
 *
 * @returns {Promise<Array<Object>>} Array of up to 10 release notes,
 *   sorted by publication date (newest first). Each note includes:
 *   - id, title, publishedAt, summary, category, url, feedSource
 */
async function fetchAndSummarizeNotes() {
    const feeds = feedStore.listFeeds();

    if (feeds.length === 0) {
        logger.info('No feeds configured.');
        return [];
    }

    logger.info(`Fetching from ${feeds.length} feed(s)...`);

    const allNotes = await Promise.all(feeds.map(feed => fetchSingleFeed(feed)));
    // Flatten, sort by date descending, take latest 10
    const merged = allNotes
        .flat()
        .sort((a, b) => new Date(b.publishedAt) - new Date(a.publishedAt))
        .slice(0, 10);

    return merged;
}

/**
 * Fetches and processes a single RSS feed.
 * Takes the top 5 items, summarizes each via the mock LLM, and categorizes by title.
 * On failure, returns a single error placeholder entry instead of throwing.
 *
 * @param {Object} feed - Feed source object from feedStore
 * @param {string} feed.id - Feed UUID
 * @param {string} feed.name - Human-readable feed name
 * @param {string} feed.url - RSS/Atom feed URL
 * @returns {Promise<Array<Object>>} Processed release notes from this feed
 */
async function fetchSingleFeed(feed) {
    try {
        logger.info(`Fetching feed`, { feedName: feed.name, url: feed.url });
        const parsed = await parser.parseURL(feed.url);
        const topItems = parsed.items.slice(0, 5);

        const processedNotes = await Promise.all(topItems.map(async (item, index) => {
            const summary = await llm.summarizeForSRE(item.contentSnippet || item.content);
            const category = await llm.categorizeNote(item.title);

            return {
                id: item.guid || `note-${feed.id}-${index}`,
                title: item.title,
                publishedAt: item.isoDate || item.pubDate,
                summary: summary,
                category: category,
                url: item.link,
                feedSource: feed.name,
                product: feed.product,
                icon: feed.icon
            };
        }));

        return processedNotes;
    } catch (err) {
        logger.error(`Error parsing feed`, { feedName: feed.name, error: err.message });
        return [{
            id: `error-${feed.id}`,
            title: `⚠ Could not fetch: ${feed.name}`,
            publishedAt: new Date().toISOString(),
            summary: `Failed to load feed from ${feed.url}. The feed may be unavailable or the URL may be invalid.`,
            category: 'Other',
            url: feed.url,
            feedSource: feed.name,
            product: feed.product,
            icon: feed.icon
        }];
    }
}

module.exports = {
    fetchAndSummarizeNotes
};
