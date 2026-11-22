"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, RefreshCw, Sparkles } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const [isClearing, setIsClearing] = useState(false);

  useEffect(() => {
    console.error("Global error:", error);
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
      // Ignore cache clearing errors
    }
    window.location.href = "/dashboard";
  };

  return (
    <html lang="en" className="dark">
      <body className="flex min-h-screen items-center justify-center bg-[#03251D] text-[#F7F9F5] p-6">
        <div className="max-w-md w-full text-center rounded-3xl border border-emerald-500/20 bg-emerald-950/40 p-8 backdrop-blur-xl shadow-2xl">
          <div className="mb-6 inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/15 text-amber-400">
            <AlertTriangle className="h-8 w-8" />
          </div>
          <h1 className="mb-2 text-2xl font-black tracking-tight text-white">
            Connection &amp; Startup Recovery
          </h1>
          <p className="mb-6 text-sm text-emerald-200/80 leading-relaxed">
            {error?.message?.includes("chunk") || error?.message?.includes("dynamically imported module")
              ? "A newer version of Akuche was published. Resetting cached assets will bring your app right back up."
              : "Akuche encountered a startup hiccup. Your personal context, goals, and commitments remain safely preserved."}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <button
              onClick={reset}
              className="inline-flex h-11 items-center justify-center rounded-xl bg-emerald-600 px-5 text-sm font-bold text-white shadow-md hover:bg-emerald-500 transition"
            >
              Try Again
            </button>
            <button
              onClick={handlePurgeAndReload}
              disabled={isClearing}
              className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-900/50 px-5 text-sm font-bold text-emerald-300 hover:bg-emerald-850 hover:text-white transition disabled:opacity-60"
            >
              <RefreshCw className={`h-4 w-4 ${isClearing ? "animate-spin" : ""}`} />
              {isClearing ? "Resetting Cache..." : "Reset Cache & Reopen"}
            </button>
          </div>
        </div>
      </body>
    </html>
  );
}
