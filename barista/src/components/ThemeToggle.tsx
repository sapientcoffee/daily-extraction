// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useTheme } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 px-3 py-2 border border-[var(--panel-border)] bg-[var(--panel-bg)] hover:bg-[var(--accent)] hover:text-black transition-all rounded-[var(--radius)] group"
      aria-label="Toggle Theme"
    >
      <div className="relative w-5 h-5">
        {/* Terminal Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 transition-opacity duration-300 ${theme === 'terminal' ? 'opacity-100' : 'opacity-0'}`}
        >
          <polyline points="4 17 10 11 4 5" />
          <line x1="12" y1="19" x2="20" y2="19" />
        </svg>

        {/* Modern/Sparkles Icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className={`absolute inset-0 transition-opacity duration-300 ${theme === 'modern' ? 'opacity-100' : 'opacity-0'}`}
        >
          <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
          <path d="M5 3v4" />
          <path d="M19 17v4" />
          <path d="M3 5h4" />
          <path d="M17 19h4" />
        </svg>
      </div>
      <span className="text-xs font-bold uppercase tracking-wider">
        {theme === 'terminal' ? 'Terminal Mode' : 'Modern Mode'}
      </span>
    </button>
  );
}
