"use client";

import React, { useState } from "react";
import { useBrand, BRAND_DEFINITIONS } from "@/lib/brand-context";
import { Sparkles, CheckCircle2, RefreshCw, Smartphone, Download, Share, PlusSquare } from "lucide-react";

export function BrandSwitcherSection() {
  const { brandKey, setBrandKey, brand } = useBrand();
  const [refreshing, setRefreshing] = useState(false);
  const [refreshed, setRefreshed] = useState(false);

  const handleClearCacheAndRefresh = async () => {
    setRefreshing(true);
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((c) => caches.delete(c)));
      }
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
      }
      setRefreshed(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch {
      window.location.reload();
    }
  };

  return (
    <section className="rounded-2xl border border-border bg-card p-4 sm:p-6 space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold text-foreground">App Brand & Home Screen Icon</h2>
          <p className="text-xs text-muted-foreground">
            Switch between AKUCHE and BrainGym or update your phone&apos;s home screen icon.
          </p>
        </div>
        <span className="rounded-full bg-emerald-500/10 px-2.5 py-1 text-[10px] font-black uppercase text-emerald-500">
          Instant Switch
        </span>
      </div>

      {/* Brand Selection Cards */}
      <div className="grid gap-3 sm:grid-cols-2">
        {/* AKUCHE Card */}
        <button
          type="button"
          onClick={() => setBrandKey("akuche")}
          className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
            brandKey === "akuche"
              ? "border-emerald-500 bg-emerald-500/10 shadow-sm ring-1 ring-emerald-500"
              : "border-border bg-card hover:border-muted-foreground/40"
          }`}
        >
          <img
            src="/akuche-logo.png"
            alt="AKUCHE Logo"
            className="h-11 w-11 rounded-xl object-contain shadow-xs bg-card p-1 border border-border shrink-0"
          />
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-foreground">AKUCHE</h3>
              {brandKey === "akuche" && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
            </div>
            <p className="text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              Train Your Mind for Real Life.
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              ASK → THINK → SOLVE → ACT → GROW
            </p>
          </div>
        </button>

        {/* BrainGym Card */}
        <button
          type="button"
          onClick={() => setBrandKey("braingym")}
          className={`flex items-start gap-3 rounded-2xl border p-4 text-left transition-all active:scale-[0.98] ${
            brandKey === "braingym"
              ? "border-primary bg-primary/10 shadow-sm ring-1 ring-primary"
              : "border-border bg-card hover:border-muted-foreground/40"
          }`}
        >
          <img
            src="/braingym-logo.png"
            alt="BrainGym Logo"
            className="h-11 w-11 rounded-xl object-contain shadow-xs bg-card p-1 border border-border shrink-0"
          />
          <div className="space-y-1 min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-black text-foreground">BrainGym</h3>
              {brandKey === "braingym" && (
                <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
              )}
            </div>
            <p className="text-xs font-semibold text-primary">
              Train Your Mind. Solve Real Problems.
            </p>
            <p className="text-[11px] text-muted-foreground leading-tight">
              THINK → DECIDE → ACT → REFLECT
            </p>
          </div>
        </button>
      </div>

      {/* How phone icons work & Cache refresh */}
      <div className="rounded-xl bg-muted/50 p-3.5 text-xs text-muted-foreground space-y-2 border border-border">
        <p className="font-bold text-foreground flex items-center gap-1.5">
          <Smartphone className="h-4 w-4 text-primary" />
          <span>How to update the logo on your phone screen:</span>
        </p>
        <p className="leading-relaxed">
          When you switch brands or when a new logo is deployed, phones cache the original shortcut icon. To see the new logo on your home screen:
        </p>
        <ul className="list-disc list-inside space-y-1 text-[11px] pl-1">
          <li><strong>iOS (Safari):</strong> Delete the old shortcut, tap <strong>Share</strong> ➔ <strong>Add to Home Screen</strong>.</li>
          <li><strong>Android (Chrome):</strong> Tap <strong>3 dots (menu)</strong> ➔ <strong>Install App</strong> or <strong>Add to Home screen</strong>.</li>
        </ul>
        <div className="pt-2">
          <button
            type="button"
            onClick={handleClearCacheAndRefresh}
            disabled={refreshing}
            className="inline-flex items-center gap-2 rounded-xl bg-background border border-border px-3.5 py-2 text-xs font-bold text-foreground hover:bg-accent transition active:scale-95 touch-manipulation"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
            <span>
              {refreshed ? "Updated! Reloading..." : refreshing ? "Refreshing..." : "Force Refresh Phone Icon Cache"}
            </span>
          </button>
        </div>
      </div>
    </section>
  );
}
