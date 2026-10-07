"use client";

import React, { useState, useEffect } from "react";
import {
  Sparkles,
  Smartphone,
  Share,
  PlusSquare,
  X,
  CheckCircle2,
  RefreshCw,
  ArrowRight,
  Download,
  AlertCircle,
} from "lucide-react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const STORAGE_KEY_DISMISSED = "akuche_rebrand_banner_dismissed_v2";

export function RebrandUpdateBanner() {
  const [visible, setVisible] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isAndroid, setIsAndroid] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [syncDone, setSyncDone] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    // Check if dismissed before
    const dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
    if (!dismissed) {
      setVisible(true);
    }

    // Detect standalone mode
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true;
    setIsStandalone(standalone);

    // Detect platform
    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));
    setIsAndroid(/android/.test(ua));

    // Capture install prompt if available
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    setShowModal(false);
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSED, "true");
    } catch {
      // ignore
    }
  };

  const handleOpenUpdate = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
        handleDismiss();
        return;
      }
    }
    setShowModal(true);
  };

  const handleCacheSync = async () => {
    setRefreshing(true);
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const reg of registrations) {
          await reg.update();
        }
      }
      setSyncDone(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      window.location.reload();
    }
  };

  if (!visible) return null;

  return (
    <>
      {/* ─── IN-APP MIGRATION BANNER ────────────────────────────────────────── */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-primary/40 bg-gradient-to-r from-primary/20 via-card to-purple-600/15 p-3.5 sm:p-4 shadow-lg animate-in fade-in slide-in-from-top-2 duration-300">
        <button
          onClick={handleDismiss}
          aria-label="Dismiss upgrade banner"
          className="absolute right-2.5 top-2.5 rounded-full p-1 text-muted-foreground hover:bg-muted hover:text-foreground transition min-h-[32px] min-w-[32px] flex items-center justify-center"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pr-6 sm:pr-0">
          <div className="flex items-start gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white shadow-md shadow-primary/25">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs sm:text-sm font-black text-foreground">
                  BrainGym is now Akuche 🎉
                </span>
                <span className="rounded-full bg-primary/20 px-2 py-0.5 text-[9px] font-black uppercase text-primary">
                  v2.0 Upgrade
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Your app has a new name, identity and smarter experience. Update now to get the latest Akuche experience on your home screen.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 pt-1 sm:pt-0 shrink-0">
            <button
              onClick={handleDismiss}
              className="rounded-xl px-3 py-2 text-xs font-semibold text-muted-foreground hover:bg-muted transition min-h-[38px] touch-manipulation"
            >
              Later
            </button>
            <button
              onClick={handleOpenUpdate}
              className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-black text-primary-foreground shadow-sm hover:bg-primary/90 active:scale-95 transition touch-manipulation min-h-[38px]"
            >
              <Download className="h-3.5 w-3.5" />
              <span>Update Now</span>
            </button>
          </div>
        </div>
      </div>

      {/* ─── SIMPLE GUIDED UPGRADE MODAL ─────────────────────────────────────── */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 shadow-2xl space-y-4 relative max-h-[90vh] overflow-y-auto">
            {/* Close */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2 pt-1">
              <div className="mx-auto flex justify-center">
                <AkucheBrandLogo variant="mark" size="lg" />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                Welcome to the All-New AKUCHE
              </h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Your intelligent thinking and decision-making companion. All your progress, memories, and streak are preserved.
              </p>
            </div>

            {/* Platform-Specific Step-by-Step Guide */}
            {isIOS ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3 text-xs">
                <span className="font-black text-primary flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                  <Smartphone className="h-3.5 w-3.5" />
                  iPhone / iOS Safari Update (2 Steps)
                </span>
                <div className="space-y-2 text-foreground/90">
                  <div className="flex items-start gap-2 bg-card p-2.5 rounded-xl border border-border/60">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px]">
                      1
                    </span>
                    <span>
                      Tap the <strong>Share</strong> button <Share className="inline h-3.5 w-3.5 text-primary mx-0.5" /> at the bottom of Safari.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-card p-2.5 rounded-xl border border-border/60">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px]">
                      2
                    </span>
                    <span>
                      Scroll down and tap <strong>Add to Home Screen</strong> <PlusSquare className="inline h-3.5 w-3.5 text-primary mx-0.5" />, then tap <strong>Add</strong>.
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground bg-muted/60 p-2 rounded-lg italic">
                  💡 Note: Once the new Akuche icon appears on your home screen, you can safely remove the old BrainGym shortcut.
                </p>
              </div>
            ) : isAndroid ? (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3 text-xs">
                <span className="font-black text-primary flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                  <Smartphone className="h-3.5 w-3.5" />
                  Android / Chrome Update (2 Steps)
                </span>
                <div className="space-y-2 text-foreground/90">
                  <div className="flex items-start gap-2 bg-card p-2.5 rounded-xl border border-border/60">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px]">
                      1
                    </span>
                    <span>
                      Tap the Chrome menu <strong>(⋮)</strong> in the top right corner.
                    </span>
                  </div>
                  <div className="flex items-start gap-2 bg-card p-2.5 rounded-xl border border-border/60">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground font-bold text-[10px]">
                      2
                    </span>
                    <span>
                      Tap <strong>&ldquo;Install Akuche&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong> and confirm.
                    </span>
                  </div>
                </div>
                <p className="text-[11px] text-muted-foreground bg-muted/60 p-2 rounded-lg italic">
                  💡 Note: Chrome will automatically place the Akuche icon on your home screen.
                </p>
              </div>
            ) : (
              <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4 space-y-3 text-xs">
                <span className="font-black text-primary flex items-center gap-1.5 uppercase tracking-wide text-[10px]">
                  <Sparkles className="h-3.5 w-3.5" />
                  Desktop & Browser Update
                </span>
                <p className="text-foreground/90">
                  Akuche is running live. Tap the button below to refresh all cached icons and offline assets.
                </p>
              </div>
            )}

            {/* Sync Cache & Reload Button */}
            <div className="pt-2 space-y-2">
              <button
                onClick={handleCacheSync}
                disabled={refreshing}
                className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-primary text-primary-foreground py-3 text-xs sm:text-sm font-black shadow-md hover:bg-primary/90 active:scale-95 transition touch-manipulation min-h-[46px]"
              >
                <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
                <span>{refreshing ? "Syncing Akuche Assets..." : syncDone ? "Updated! Reloading..." : "Sync New Akuche Icon & Refresh"}</span>
              </button>

              <button
                onClick={handleDismiss}
                className="w-full rounded-xl py-2 text-xs font-semibold text-muted-foreground hover:text-foreground transition text-center"
              >
                I&apos;ve completed the update · Dismiss
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
