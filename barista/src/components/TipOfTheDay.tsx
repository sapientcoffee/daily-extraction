// Copyright 2026 Google LLC.
// SPDX-License-Identifier: Apache-2.0

"use client";

import { useState, useEffect } from 'react';

export default function TipOfTheDay() {
  const [tip, setTip] = useState<any>(null);

  useEffect(() => {
    fetch('http://localhost:8081/tips/random')
      .then(res => res.json())
      .then(data => setTip(data))
      .catch(err => console.error("Error fetching tip.", err));
  }, []);

  return (
    <div className="border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-md p-6 rounded-[var(--radius)] transition-all">
      <h2 className="text-xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
        <span className="opacity-50 text-xs font-mono" style={{ opacity: 'var(--terminal-opacity)' }}>&gt;_</span>
        Cognitive Architecture
      </h2>
      {!tip ? (
        <p className="text-yellow-500 italic">Connecting to mindset-service...</p>
      ) : (
        <div>
          <h3 className="font-bold text-white uppercase text-sm mb-1">{tip.title}</h3>
          <p className="text-sm">"{tip.tip}"</p>
          <p className="text-xs text-gray-500 mt-2">-- {tip.author}</p>
        </div>
      )}
    </div>
  );
}
