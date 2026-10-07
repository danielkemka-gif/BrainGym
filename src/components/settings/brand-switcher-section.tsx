"use client";

import React, { useState } from "react";
import { useBrand } from "@/lib/brand-context";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import { CheckCircle2, RefreshCw, Smartphone, Download, Sparkles } from "lucide-react";

export function BrandSwitcherSection() {
  const { brand } = useBrand();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const handleClearCacheAndRefresh = async () => {
    setRefreshing(true);
    try {
      if (typeof caches !== "undefined") {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((c) => caches.delete(c)));
      }
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update().catch(() => {});
        }
      }
      setRefreshed(true);
      setTimeout(() => {
        window.location.reload();
      }, 700);
    } catch {
      window.location.reload();
    }
  };

  return (
    <section className="rounded-3xl border border-border bg-card p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">Official AKUCHE Brand &amp; Mobile Icon</h2>
          <p className="text-xs text-muted-foreground">
            Official Ako + Uche identity: Think Better. Decide Better. Live Better.
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400">
          OFFICIAL
        </span>
      </div>

      {/* Official AKUCHE Brand Card */}
      <div className="flex items-start gap-3 rounded-2xl border border-emerald-500 bg-emerald-500/10 p-4 text-left shadow-sm ring-1 ring-emerald-500">
        <div className="shrink-0 p-1 bg-card rounded-2xl border border-border">
          <AkucheBrandLogo variant="mark" size="md" />
        </div>
        <div className="space-y-1 min-w-0 flex-1">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-black text-foreground">AKUCHE</h3>
            <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
          </div>
          <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
            Think Better. Decide Better. Live Better.
          </p>
          <p className="text-[11px] text-muted-foreground leading-tight">
            Assess → Know → Understand → Consider → Choose → Execute
          </p>
        </div>
      </div>

      {/* Direct Asset Actions & Cache refresh */}
      <div className="rounded-2xl bg-muted/40 p-4 text-xs text-muted-foreground space-y-3 border border-border/80">
        <p className="font-bold text-foreground flex items-center gap-1.5">
          <Smartphone className="h-4 w-4 text-emerald-500" />
          <span>How to update the new logo on your phone home screen:</span>
        </p>
        <ul className="list-disc list-inside space-y-1 text-[11px] pl-1">
          <li><strong>iOS (Safari):</strong> If an older shortcut exists, remove it, then tap <strong>Share</strong> ➔ <strong>Add to Home Screen</strong>.</li>
          <li><strong>Android (Chrome):</strong> Tap <strong>3 dots (⋮)</strong> ➔ <strong>Install App</strong> or <strong>Add to Home screen</strong>.</li>
        </ul>

        <div className="flex flex-col sm:flex-row gap-2 pt-1">
          <a
            href="/akuche-logo.png"
            download="akuche-logo.png"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-bold shadow-sm transition active:scale-95 touch-manipulation min-h-[42px]"
          >
            <Download className="h-4 w-4" />
            <span>Download Official Akuche Logo (HD PNG)</span>
          </a>

          <button
            type="button"
            onClick={handleClearCacheAndRefresh}
            disabled={refreshing}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-background border border-border px-4 py-2.5 text-xs font-bold text-foreground hover:bg-accent transition active:scale-95 touch-manipulation min-h-[42px]"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald-500" : ""}`} />
            <span>
              {refreshed ? "Updated! Reloading..." : refreshing ? "Refreshing..." : "Force Refresh Phone Icon Cache"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
