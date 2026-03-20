// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

/**
 * @module llm
 * @description Mock LLM service for text summarization and categorization.
 *
 * In production, these functions would call out to a real LLM service
 * (e.g., Vertex AI Gemini, OpenAI GPT). Currently provides deterministic
 * mock implementations with simulated latency for demo purposes.
 */

/**
 * Generates an SRE-focused summary of release note content.
 * Simulates ~300ms API latency to mimic real LLM call behavior.
 *
 * @param {string} content - Raw release note content or snippet
 * @returns {Promise<string>} SRE-focused TL;DR summary
 *
 * @example
 * const summary = await summarizeForSRE("Cloud SQL now supports...");
 * // → "[SRE TL;DR] Potential operational impact. Details: Cloud SQL now supports..."
 */
async function summarizeForSRE(content) {
    // Simulated LLM latency
    await new Promise(resolve => setTimeout(resolve, 300));
    
    // Fallback for minimal or missing content
    if (!content || content.length < 20) return "Minor update to services - monitor for unexpected metric bumps.";
    
    // Mock summary — truncate and wrap with SRE prefix
    const truncated = content.substring(0, 100) + '...';
    return `[SRE TL;DR] Potential operational impact. Details: ${truncated}`;
}

/**
 * Categorizes a release note by its title using keyword matching.
 *
 * Category mapping:
 *   - Compute:  "compute", "gke", "vm"
 *   - Database: "sql", "spanner", "database"
 *   - Network:  "vpc", "network"
 *   - AI/ML:    "ai", "vertex", "ml"
 *   - Other:    everything else
 *
 * @param {string} title - Release note title
 * @returns {Promise<'Compute'|'Database'|'Network'|'AI/ML'|'Other'>} Category string
 */
async function categorizeNote(title) {
    const lowerTitle = (title || '').toLowerCase();
    
    if (lowerTitle.includes('compute') || lowerTitle.includes('gke') || lowerTitle.includes('vm')) {
        return 'Compute';
    } else if (lowerTitle.includes('sql') || lowerTitle.includes('spanner') || lowerTitle.includes('database')) {
        return 'Database';
    } else if (lowerTitle.includes('vpc') || lowerTitle.includes('network')) {
        return 'Network';
    } else if (lowerTitle.includes('ai') || lowerTitle.includes('vertex') || lowerTitle.includes('ml')) {
        return 'AI/ML';
    }
    
    return 'Other';
}

module.exports = {
    summarizeForSRE,
    categorizeNote
};
