"use client";

import React, { useState, useEffect } from "react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Smartphone,
  Download,
  RefreshCw,
  Share,
  PlusSquare,
  X,
  CheckCircle2,
  MoreVertical,
  Sparkles,
  ArrowRight,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function AppInstallCard() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Detect standalone mode (already installed on phone home screen)
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true
      ) {
        setIsStandalone(true);
      }

      // Detect iOS
      const ua = window.navigator.userAgent.toLowerCase();
      setIsIOS(/iphone|ipad|ipod/.test(ua));

      const handler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      window.addEventListener("beforeinstallprompt", handler);
      return () => window.removeEventListener("beforeinstallprompt", handler);
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === "accepted") {
        setDeferredPrompt(null);
      }
    } else {
      setShowModal(true);
    }
  };

  const handleForceRefresh = async () => {
    setRefreshing(true);
    try {
      if ("caches" in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if ("serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.update();
        }
      }
      setRefreshSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch {
      window.location.reload();
    }
  };

  // If already running as installed standalone app on phone
  if (isStandalone) {
    return (
      <div className="rounded-2xl sm:rounded-3xl border border-emerald-500/30 bg-emerald-500/5 p-3.5 sm:p-4 shadow-xs flex items-center justify-between gap-3">
        <div className="flex items-center gap-2.5 min-w-0">
          <AkucheBrandLogo variant="mark" size="xs" />
          <div className="min-w-0">
            <span className="text-xs font-black text-foreground flex items-center gap-1.5 truncate">
              <span>AKUCHE App Active</span>
              <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0 inline" />
            </span>
            <p className="text-[11px] text-muted-foreground truncate">
              Running in standalone mobile mode
            </p>
          </div>
        </div>

        <button
          onClick={handleForceRefresh}
          disabled={refreshing}
          className="inline-flex items-center gap-1.5 rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition active:scale-95 shrink-0"
          title="Sync Cache"
        >
          <RefreshCw className={`h-3 w-3 ${refreshing ? "animate-spin text-emerald-500" : ""}`} />
          <span>{refreshSuccess ? "Refreshed!" : "Sync"}</span>
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="rounded-2xl sm:rounded-3xl border-2 border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 via-card to-card p-4 sm:p-5 shadow-sm space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <AkucheBrandLogo variant="mark" size="md" animate />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight truncate">
                  Install AKUCHE on Your Phone
                </h3>
                <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-600 dark:text-emerald-400 shrink-0">
                  1-Tap App
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5">
                Instant home screen access, offline thinking tools &amp; fast performance.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleInstallClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-4 py-2.5 text-xs font-bold shadow-md shadow-emerald-900/20 transition active:scale-95 min-h-[42px] touch-manipulation"
            >
              <Download className="h-4 w-4" />
              <span>{deferredPrompt ? "Install App Now" : "Install Guide"}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Installation Guide Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/75 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border-2 border-emerald-500/40 bg-card p-5 sm:p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto text-foreground">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-full p-2 text-muted-foreground hover:bg-muted hover:text-foreground transition"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header with Akuche Logo */}
            <div className="text-center space-y-2 pt-1">
              <div className="mx-auto flex justify-center">
                <AkucheBrandLogo variant="mark" size="lg" animate />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                Add AKUCHE to Your Phone
              </h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
                Enjoy a full native app experience with zero app store download required.
              </p>
            </div>

            {/* Native 1-Click Install Button if supported */}
            {deferredPrompt && (
              <button
                onClick={handleInstallClick}
                className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 text-xs sm:text-sm font-black shadow-lg active:scale-95 transition touch-manipulation min-h-[48px]"
              >
                <Download className="h-4 w-4" />
                <span>Tap Here to Install App</span>
              </button>
            )}

            {/* Step-by-Step Platform Guides */}
            {isIOS ? (
              /* iOS Safari Guide */
              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-3 text-xs text-left">
                <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>iPhone / iPad Safari (2 Taps):</span>
                </p>
                <ol className="space-y-2 text-foreground/90 text-xs">
                  <li className="flex items-start gap-2 bg-card p-2.5 rounded-xl border border-border/60">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                      1
                    </span>
                    <span>
                      Tap the <Share className="inline h-3.5 w-3.5 text-emerald-500 font-bold mx-0.5" />{" "}
                      <strong>Share</strong> button at the bottom of Safari.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 bg-card p-2.5 rounded-xl border border-border/60">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                      2
                    </span>
                    <span>
                      Scroll down and tap{" "}
                      <PlusSquare className="inline h-3.5 w-3.5 text-emerald-500 font-bold mx-0.5" />{" "}
                      <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                    </span>
                  </li>
                </ol>
                <p className="text-[10px] text-muted-foreground italic pt-1">
                  Tip: If an older version was installed previously, remove the old shortcut and add this new version.
                </p>
              </div>
            ) : (
              /* Android / Chrome Guide */
              <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-3 text-xs text-left">
                <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                  <Smartphone className="h-3.5 w-3.5" />
                  <span>Android / Chrome (2 Steps):</span>
                </p>
                <ol className="space-y-2 text-foreground/90 text-xs">
                  <li className="flex items-start gap-2 bg-card p-2.5 rounded-xl border border-border/60">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                      1
                    </span>
                    <span>
                      Tap the <MoreVertical className="inline h-3.5 w-3.5 text-emerald-500 font-bold mx-0.5" />{" "}
                      <strong>3-dot menu</strong> at the top right of Chrome.
                    </span>
                  </li>
                  <li className="flex items-start gap-2 bg-card p-2.5 rounded-xl border border-border/60">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                      2
                    </span>
                    <span>
                      Tap <strong>&ldquo;Install App&rdquo;</strong> or{" "}
                      <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                    </span>
                  </li>
                </ol>
              </div>
            )}

            {/* Cache Refresh Button */}
            <div className="pt-2 border-t border-border/60">
              <button
                type="button"
                onClick={handleForceRefresh}
                disabled={refreshing}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:bg-muted py-2.5 px-4 text-xs font-semibold text-muted-foreground hover:text-foreground transition active:scale-95 min-h-[42px]"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald-500" : ""}`} />
                <span>
                  {refreshSuccess
                    ? "Updated! Reloading..."
                    : refreshing
                    ? "Clearing Cache..."
                    : "Force Refresh App & Icons"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
