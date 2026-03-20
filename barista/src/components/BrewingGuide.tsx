"use client";

import { useState, useEffect } from 'react';

export default function BrewingGuide() {
  const [methods, setMethods] = useState<any[]>([]);

  useEffect(() => {
    fetch('http://localhost:8081/brew')
      .then(res => res.json())
      .then(data => setMethods(data))
      .catch(err => console.error("Error fetching brew methods.", err));
  }, []);

  return (
    <div className="border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-md p-6 rounded-[var(--radius)] transition-all">
      <h2 className="text-xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
        <span className="opacity-50 text-xs font-mono" style={{ opacity: 'var(--terminal-opacity)' }}>&gt;_</span>
        The Barista Protocol
      </h2>
      {methods.length === 0 ? (
        <p className="text-yellow-500 italic">Connecting to origin-service...</p>
      ) : (
        <ul className="space-y-4">
          {methods.map(m => (
            <li key={m.id} className="border-l-2 border-gray-600 pl-4">
              <span className="font-bold text-white">{m.name}</span>
              <p className="text-sm text-gray-300">{m.description} | {m.waterTempCelsius}°C | {m.brewTimeSeconds}s</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
