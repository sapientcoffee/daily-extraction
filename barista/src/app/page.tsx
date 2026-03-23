// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

"use client";

import ChaosButton from '../components/ChaosButton';
import BrewingGuide from '../components/BrewingGuide';
import TipOfTheDay from '../components/TipOfTheDay';
import ReleaseNotesFeed from '../components/ReleaseNotesFeed';
import FeedManager from '../components/FeedManager';
import ThemeToggle from '../components/ThemeToggle';
import { useState } from 'react';
import { useTheme } from '../components/ThemeProvider';

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);
  const { theme, mounted } = useTheme();

  const handleFeedsChanged = () => {
    console.log("Feeds changed");
    setRefreshKey(prev => prev + 1);
  };

  if (!mounted) {
    return <div className="min-h-screen bg-[var(--background)]"></div>; // Prevents hydration mismatch
  }

  if (theme === 'modern') {
    return (
      <main className="min-h-screen relative overflow-hidden text-slate-100">
        {/* Modern Background Effects */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-600/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-pink-600/20 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="max-w-[1400px] mx-auto p-6 md:p-10 relative z-10">
          <header className="flex flex-col md:flex-row items-center justify-between gap-6 mb-12 bg-white/5 border border-white/10 backdrop-blur-xl p-6 rounded-3xl shadow-[var(--shadow-lg)]">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/30">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <h1 className="text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">
                  Daily Extraction
                </h1>
                <p className="text-sm font-medium text-slate-400 mt-0.5">AI-Assisted Development & SRE Hub</p>
              </div>
            </div>
            <ThemeToggle />
          </header>

          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8 flex flex-col gap-8 order-2 xl:order-1">
              <div className="p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent shadow-[var(--shadow-md)] relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-purple-500/30 to-pink-500/30 rounded-[24px] blur opacity-30 group-hover:opacity-60 transition duration-500"></div>
                <div className="relative bg-[#0f172a]/90 backdrop-blur-xl rounded-[22px] p-6 h-full">
                  <FeedManager onFeedsChanged={handleFeedsChanged} />
                </div>
              </div>
              <div className="p-1 rounded-3xl bg-gradient-to-br from-white/10 to-transparent shadow-[var(--shadow-md)]">
                <div className="bg-[#0f172a]/80 backdrop-blur-xl rounded-[22px] p-6">
                  <ReleaseNotesFeed refreshKey={refreshKey} />
                </div>
              </div>
            </div>

            <div className="xl:col-span-4 flex flex-col gap-8 order-1 xl:order-2">
              <div className="transform hover:-translate-y-1 transition-transform duration-300">
                <TipOfTheDay />
              </div>
              <div className="transform hover:-translate-y-1 transition-transform duration-300">
                <BrewingGuide />
              </div>
              <div className="transform hover:-translate-y-1 transition-transform duration-300">
                <ChaosButton />
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }

  // Terminal Layout (Original)
  return (
    <main className="min-h-screen p-8 max-w-6xl mx-auto">
      <header className="mb-8 border-b border-[var(--panel-border)] pb-6 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight text-[var(--foreground)]">THE DAILY EXTRACTION</h1>
          <p className="text-sm text-gray-400 mt-1 uppercase tracking-widest opacity-80">AI-Assisted Development &amp; SRE Rituals</p>
        </div>
        <ThemeToggle />
      </header>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1 flex flex-col gap-6">
          <BrewingGuide />
          <TipOfTheDay />
          <ChaosButton />
        </div>
        
        <div className="md:col-span-2">
          <FeedManager onFeedsChanged={handleFeedsChanged} />
          <ReleaseNotesFeed refreshKey={refreshKey} />
        </div>
      </div>
    </main>
  );
}
