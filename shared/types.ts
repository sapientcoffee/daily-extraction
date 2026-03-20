/**
 * Shared type definitions for The Daily Extraction ecosystem.
 *
 * These interfaces define the data contracts between all services.
 * The Go (Origin Service) and Python (Mindset Service) implementations
 * produce JSON payloads conforming to these shapes.
 *
 * @module shared/types
 */

/** Represents a coffee bean variety in the catalog. */
export interface CoffeeBean {
    /** Unique identifier */
    id: string;
    /** Bean name (e.g., "Ethiopia Yirgacheffe") */
    name: string;
    /** Country of origin */
    origin: string;
    /** Roast level classification */
    roastLevel: 'Light' | 'Medium' | 'Dark';
    /** Array of tasting/flavor notes */
    flavorNotes: string[];
}

/** Represents a coffee brewing method with its parameters. */
export interface BrewMethod {
    /** Unique identifier (e.g., "v60", "espresso") */
    id: string;
    /** Display name (e.g., "Hario V60") */
    name: string;
    /** Brief description of the brewing technique */
    description: string;
    /** Optimal water temperature in degrees Celsius */
    waterTempCelsius: number;
    /** Recommended brew time in seconds */
    brewTimeSeconds: number;
}

/** Represents an aggregated and summarized release note from an RSS feed. */
export interface ReleaseNote {
    /** Unique identifier (GUID from RSS feed or auto-generated) */
    id: string;
    /** Release note title */
    title: string;
    /** ISO 8601 publication date */
    publishedAt: string;
    /** SRE-focused LLM-generated summary */
    summary: string;
    /** Service area category */
    category: 'Compute' | 'Database' | 'Network' | 'AI/ML' | 'Other';
    /** URL link to the original release note */
    url: string;
}

/** Represents a psychology-backed AI adoption tip. */
export interface MindsetTip {
    /** Unique identifier */
    id: string;
    /** Short, memorable tip title */
    title: string;
    /** Full tip text with psychological insight */
    tip: string;
    /** Attribution / source */
    author: string;
}

