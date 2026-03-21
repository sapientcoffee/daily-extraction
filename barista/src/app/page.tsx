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

export default function Home() {
  const [refreshKey, setRefreshKey] = useState(0);

  const handleFeedsChanged = () => {
    console.log("Feeds changed");
    setRefreshKey(prev => prev + 1);
  };

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
