// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from 'react';

interface ReleaseNotesFeedProps {
  refreshKey?: number;
}

export default function ReleaseNotesFeed({ refreshKey = 0 }: ReleaseNotesFeedProps) {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch('http://localhost:8081/release-notes')
      .then(res => res.json())
      .then(data => { setNotes(data); setLoading(false); })
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
            <li key={n.id} className="border-t border-gray-800 pt-2">
              <div className="flex items-center gap-2 flex-wrap">
                <a href={n.url} target="_blank" rel="noreferrer" className="font-bold text-blue-400 hover:underline">{n.title}</a>
                <span className="px-2 py-0.5 text-xs bg-gray-800 rounded">{n.category}</span>
                {n.feedSource && (
                  <span className="px-2 py-0.5 text-xs rounded border border-[var(--accent)]/30 text-[var(--accent)] opacity-70">{n.feedSource}</span>
                )}
              </div>
              <p className="text-sm text-gray-300 mt-1">{n.summary}</p>
              <p className="text-xs text-gray-500">{new Date(n.publishedAt).toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
