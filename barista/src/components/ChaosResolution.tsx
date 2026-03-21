"use client";

import { useState, useEffect } from 'react';

export default function ChaosResolution() {
  const [chaosState, setChaosState] = useState<boolean>(false);
  const [resolvedMessage, setResolvedMessage] = useState<string | null>(null);

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const res = await fetch('/api/chaos/status');
        if (res.ok) {
          const data = await res.json();
          
          if (data.isChaosActive) {
            setChaosState(true);
            setResolvedMessage(null);
          } else if (chaosState && !data.isChaosActive) {
             // transitioned from active to inactive
             setChaosState(false);
             setResolvedMessage("AI Mitigation Successful! 1.21 Gigawatts delivered.");
             setTimeout(() => setResolvedMessage(null), 10000); // clear after 10s
          }
        }
      } catch (err) {
        console.error("Failed to check chaos status", err);
      }
    };

    const intervalId = setInterval(checkStatus, 2000);
    return () => clearInterval(intervalId);
  }, [chaosState]);

  if (!chaosState && !resolvedMessage) return null;

  return (
    <div className={`mt-6 p-4 rounded border transition-colors ${chaosState ? 'bg-red-950/50 border-red-500/50' : 'bg-green-950/50 border-green-500/50'}`}>
      <h3 className={`font-bold flex items-center gap-2 ${chaosState ? 'text-red-400' : 'text-green-400'}`}>
        {chaosState ? '⚠️ SYSTEM DEGRADED: FLUX CAPACITY ERROR' : '✅ SYSTEM RESTORED'}
      </h3>
      <p className="text-sm mt-2 text-gray-300">
        {chaosState ? 'Awaiting AI agent mitigation... Activate the chaos-mitigation skill.' : resolvedMessage}
      </p>
    </div>
  );
}