"use client";

import { useState } from 'react';

export default function ChaosButton() {
  const [chaosActive, setChaosActive] = useState(false);

  const activateChaos = () => {
    setChaosActive(true);
    alert("Chaos Engineering Initiated: Simulating latency across services...");
    setTimeout(() => setChaosActive(false), 5000);
  };

  return (
    <div className="border border-[var(--panel-border)] bg-[var(--panel-bg)] backdrop-blur-md p-6 rounded-[var(--radius)] transition-all mt-4">
      <h2 className="text-xl font-bold text-[var(--accent)] mb-4 flex items-center gap-2">
        <span className="opacity-50 text-xs font-mono" style={{ opacity: 'var(--terminal-opacity)' }}>&gt;_</span>
        Chaos Engineering
      </h2>
      <p className="mb-4 text-sm text-gray-400">Inject failure into the system to test resilience.</p>
      <button 
        onClick={activateChaos}
        className={`px-4 py-2 border font-bold transition-all rounded-[var(--radius)] ${chaosActive ? 'bg-red-900 border-red-500 text-white' : 'border-red-500 text-red-500 hover:bg-red-950'}`}
      >
        {chaosActive ? 'SYSTEM DEGRADED...' : 'INITIATE CHAOS'}
      </button>
    </div>
  );
}
