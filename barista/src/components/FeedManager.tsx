// Copyright 2026 Google LLC
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at https://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

"use client";

import { useState, useEffect, useCallback } from 'react';

interface Feed {
  id: string;
  name: string;
  url: string;
}

interface FeedManagerProps {
  onFeedsChanged?: () => void;
}

export default function FeedManager({ onFeedsChanged }: FeedManagerProps) {
  const [feeds, setFeeds] = useState<Feed[]>([]);
  const [name, setName] = useState('');
  const [url, setUrl] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [error, setError] = useState('');

  const fetchFeeds = useCallback(async () => {
    try {
      const res = await fetch('/api/feeds');
      const data = await res.json();
      if (Array.isArray(data)) {
        setFeeds(data);
      } else {
        console.error("Expected array for feeds, got:", data);
      }
    } catch {
      console.error('Failed to fetch feeds');
    }
  }, []);

  useEffect(() => {
    fetchFeeds();
  }, [fetchFeeds]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !url.trim()) return;
    setIsAdding(true);
    setError('');

    try {
      const res = await fetch('/api/feeds', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: name.trim(), url: url.trim() }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || 'Failed to add feed');
        return;
      }

      setName('');
      setUrl('');
      await fetchFeeds();
      onFeedsChanged?.();
    } catch {
      setError('Could not connect to press-service');
    } finally {
      setIsAdding(false);
    }
  };

  const handleRemove = async (id: string) => {
    try {
      await fetch(`/api/feeds/${id}`, { method: 'DELETE' });
      await fetchFeeds();
      onFeedsChanged?.();
    } catch {
      console.error('Failed to remove feed');
    }
  };

  return (
    <div className="feed-manager border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-md rounded-[var(--radius)] transition-all mb-6 overflow-hidden">
      {/* Header / toggle */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-4 cursor-pointer hover:bg-[var(--panel-border)] transition-colors text-left"
      >
        <h2 className="text-lg font-bold text-[var(--accent)] flex items-center gap-2">
          <span className="opacity-50 text-xs font-mono" style={{ opacity: 'var(--terminal-opacity)' }}>&gt;_</span>
          Feed Sources
          <span className="text-xs font-normal opacity-60 ml-1">({feeds.length})</span>
        </h2>
        <svg
          className={`w-4 h-4 text-[var(--foreground)] transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
          fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Collapsible content */}
      <div
        className={`feed-manager-body transition-all duration-300 ease-in-out ${isOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'} overflow-hidden`}
      >
        <div className="px-4 pb-4">
          {/* Feed list */}
          <ul className="space-y-2 mb-4">
            {feeds.map(feed => (
              <li
                key={feed.id}
                className="feed-item flex items-center justify-between gap-3 p-3 rounded-[var(--radius)] bg-[var(--background)] border border-[var(--panel-border)] group transition-all"
              >
                <div className="min-w-0 flex-1">
                  <p className="font-semibold text-sm text-[var(--foreground)] truncate">{feed.name}</p>
                  <p className="text-xs opacity-50 truncate font-mono">{feed.url}</p>
                </div>
                <button
                  onClick={() => handleRemove(feed.id)}
                  className="feed-remove-btn flex-shrink-0 px-3 py-1.5 text-xs rounded-[var(--radius)] border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:border-red-500/60 transition-all cursor-pointer opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Remove feed"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>

          {/* Add form */}
          <form onSubmit={handleAdd} className="feed-add-form flex flex-col gap-2">
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Feed name"
                value={name}
                onChange={e => setName(e.target.value)}
                className="feed-input flex-1 min-w-0 px-3 py-2 text-sm rounded-[var(--radius)] bg-[var(--background)] border border-[var(--panel-border)] text-[var(--foreground)] placeholder:opacity-40 focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
              <input
                type="url"
                placeholder="RSS feed URL"
                value={url}
                onChange={e => setUrl(e.target.value)}
                className="feed-input flex-[2] min-w-0 px-3 py-2 text-sm rounded-[var(--radius)] bg-[var(--background)] border border-[var(--panel-border)] text-[var(--foreground)] placeholder:opacity-40 focus:outline-none focus:border-[var(--accent)] transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={isAdding || !name.trim() || !url.trim()}
              className="feed-add-btn self-end px-4 py-2 text-sm font-semibold rounded-[var(--radius)] bg-[var(--accent)] text-[var(--background)] hover:brightness-110 disabled:opacity-30 disabled:cursor-not-allowed transition-all cursor-pointer"
            >
              {isAdding ? 'Adding…' : '+ Add Feed'}
            </button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
          </form>
        </div>
      </div>
    </div>
  );
}
