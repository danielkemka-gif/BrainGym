"use client";

import { useEffect, useState } from "react";
import { WifiOff, CheckCircle2, Sparkles } from "lucide-react";

export function OfflineStatusBanner() {
  const [isOffline, setIsOffline] = useState(false);
  const [showReconnected, setShowReconnected] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const handleOnline = () => {
      setIsOffline(false);
      setShowReconnected(true);
      setTimeout(() => setShowReconnected(false), 4000);
    };

    const handleOffline = () => {
      setIsOffline(true);
    };

    setIsOffline(!navigator.onLine);

    window.addEventListener("online", handleOnline);
    window.addEventListener("offline", handleOffline);

    // Register service worker if supported
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          reg.update().catch(() => {});
          if (reg.waiting) {
            reg.waiting.postMessage({ type: "SKIP_WAITING" });
          }
        })
        .catch((err) => {
          console.warn("Service worker registration failed:", err);
        });
    }

    return () => {
      window.removeEventListener("online", handleOnline);
      window.removeEventListener("offline", handleOffline);
    };
  }, []);

  if (showReconnected) {
    return (
      <div className="rounded-2xl border border-emerald-500/40 bg-emerald-500/15 p-3 flex items-center justify-between text-xs font-bold text-emerald-600 dark:text-emerald-400 shadow-md animate-in fade-in">
        <div className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          <span>Back Online! Your offline workouts and reflections are safely synced.</span>
        </div>
      </div>
    );
  }

  if (!isOffline) return null;

  return (
    <div className="rounded-2xl border border-amber-500/40 bg-amber-500/15 p-3 flex items-center justify-between text-xs font-bold text-amber-700 dark:text-amber-300 shadow-md animate-in fade-in">
      <div className="flex items-center gap-2">
        <WifiOff className="h-4 w-4 shrink-0" />
        <span>Offline Mode Active — You can still complete workouts, read scenarios, and write journal entries offline.</span>
      </div>
    </div>
  );
}
