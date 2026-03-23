// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from 'react';

interface ReleaseNotesFeedProps {
  refreshKey?: number;
}

interface ReleaseNote {
  id: string;
  title: string;
  url: string;
  summary: string;
  publishedAt: string;
  category: string;
  feedSource: string;
  product?: string;
  icon?: string;
}

export default function ReleaseNotesFeed({ refreshKey = 0 }: ReleaseNotesFeedProps) {
  const [notes, setNotes] = useState<ReleaseNote[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('/api/release-notes')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) {
          setNotes(data);
        } else {
          console.error("Expected array for release notes, got:", data);
        }
        setLoading(false);
      })
      .catch(err => { console.error("Error fetching release notes.", err); setLoading(false); });
  }, [refreshKey]);

  return (
    <div className="border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-md p-6 rounded-[var(--radius)] transition-all">
      <h2 className="text-xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
        <span className="opacity-50 text-xs font-mono" style={{ opacity: 'var(--terminal-opacity)' }}>&gt;_</span>
        Release Notes (Aggregated)
      </h2>
      {loading ? (
        <p className="text-yellow-500 italic">Connecting to press-service...</p>
      ) : notes.length === 0 ? (
        <p className="text-gray-400 italic">No feeds configured. Add a feed source above to get started.</p>
      ) : (
        <ul className="space-y-4">
          {notes.map(n => (
            <li key={n.id} className="border-t border-gray-800 pt-4 pb-2">
              <div className="flex items-center gap-2 flex-wrap mb-1">
                <span className="text-xl" title={n.product}>{n.icon || '📝'}</span>
                <a href={n.url} target="_blank" rel="noreferrer" className="font-bold text-blue-400 hover:underline">{n.title}</a>
              </div>
              <div className="flex items-center gap-2 flex-wrap text-[10px] uppercase tracking-wider mb-2">
                <span className="px-2 py-0.5 bg-[var(--accent)]/10 border border-[var(--accent)]/30 text-[var(--accent)] rounded font-semibold">
                  {n.product || n.feedSource}
                </span>
                <span className="px-2 py-0.5 bg-gray-800 text-gray-400 rounded">{n.category}</span>
                <span className="text-gray-500 font-mono ml-auto">{new Date(n.publishedAt).toLocaleDateString()}</span>
              </div>
              <p className="text-sm text-gray-300 leading-relaxed">{n.summary}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
