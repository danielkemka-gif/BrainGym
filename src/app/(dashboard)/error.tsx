"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

export default function DashboardError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    console.error("Dashboard error:", error);
  }, [error]);

  const handlePurgeAndReload = async () => {
    setIsClearing(true);
    try {
      if (typeof window !== "undefined" && "caches" in window) {
        const keys = await caches.keys();
        await Promise.all(keys.map((k) => caches.delete(k)));
      }
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        await Promise.all(registrations.map((r) => r.unregister()));
      }
    } catch {
      // Ignore
    }
    window.location.href = "/dashboard";
  };

  return (
    <div className="flex min-h-[60vh] items-center justify-center p-4">
      <div className="max-w-md w-full text-center rounded-3xl border border-emerald-500/20 bg-card/90 p-8 shadow-xl backdrop-blur-xl">
        <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-500">
          <AlertTriangle className="h-8 w-8" />
        </div>
        <h2 className="mb-2 text-xl font-black text-foreground">
          Temporary Loading Interruption
        </h2>
        <p className="mb-6 text-sm text-muted-foreground leading-relaxed">
          {error?.message?.includes("chunk") || error?.message?.includes("dynamically imported module")
            ? "A newer build was deployed to the cloud. Resetting cached assets will reconnect you immediately."
            : error.message || "An unexpected error occurred while loading this page."}
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex h-11 items-center justify-center rounded-xl bg-primary px-5 text-sm font-bold text-primary-foreground shadow-md hover:bg-primary/90 transition"
          >
            Try Again
          </button>
          <button
            onClick={handlePurgeAndReload}
            disabled={isClearing}
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-muted/60 px-5 text-sm font-semibold text-foreground hover:bg-muted transition disabled:opacity-60"
          >
            <RefreshCw className={`h-4 w-4 ${isClearing ? "animate-spin" : ""}`} />
            {isClearing ? "Resetting..." : "Reset Cache & Reconnect"}
          </button>
        </div>
      </div>
    </div>
  );
}
