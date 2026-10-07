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
  ExternalLink,
  ShieldCheck,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface AppInstallCardProps {
  variant?: "banner" | "card" | "button" | "compact";
  className?: string;
}

export function AppInstallCard({
  variant = "banner",
  className = "",
}: AppInstallCardProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [isInAppBrowser, setIsInAppBrowser] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // 1. Detect standalone mode (already installed as PWA)
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true
      ) {
        setIsStandalone(true);
      }

      // 2. Detect iOS Safari
      const ua = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(ua);
      setIsIOS(isApple);

      // 3. Detect In-App WebViews (WhatsApp, Instagram, FB, Twitter/X, TikTok, Gmail)
      const isWebView =
        /fban|fbav|instagram|messenger|whatsapp|twitter|tiktok|snapchat|linkedin/i.test(ua) ||
        (isApple && !/safari/i.test(ua));
      setIsInAppBrowser(isWebView);

      // 4. Capture native Android / Chrome PWA install prompt
      const installHandler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      const openModalHandler = () => {
        setShowModal(true);
      };

      window.addEventListener("beforeinstallprompt", installHandler);
      window.addEventListener("akuche:open-install", openModalHandler);

      return () => {
        window.removeEventListener("beforeinstallprompt", installHandler);
        window.removeEventListener("akuche:open-install", openModalHandler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setDeferredPrompt(null);
          setShowModal(false);
          return;
        }
      } catch {
        setShowModal(true);
      }
    }
    setShowModal(true);
  };

  const handleForceRefresh = async () => {
    setRefreshing(true);
    try {
      if (typeof caches !== "undefined") {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
        const registrations = await navigator.serviceWorker.getRegistrations();
        for (const registration of registrations) {
          await registration.update().catch(() => {});
        }
      }
      localStorage.setItem("akuche_cache_purged_v7_master", "true");
      setRefreshSuccess(true);
      setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch {
      window.location.reload();
    }
  };

  // Button variant for topbar or inline trigger
  if (variant === "button") {
    return (
      <>
        <button
          type="button"
          onClick={handleInstallClick}
          aria-label="Install Akuche App on Phone"
          className={`inline-flex items-center gap-1.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 px-2.5 sm:px-3 py-1 text-xs font-bold transition active:scale-95 touch-manipulation min-h-[36px] ${className}`}
        >
          <Smartphone className="h-3.5 w-3.5 shrink-0 text-emerald-500" />
          <span className="text-[11px] font-black tracking-wide uppercase">
            {isStandalone ? "APP INSTALLED" : "INSTALL"}
          </span>
        </button>

        {showModal && renderModal()}
      </>
    );
  }

  // Compact variant
  if (variant === "compact") {
    return (
      <>
        <div className={`rounded-2xl border border-emerald-500/40 bg-emerald-500/10 p-3 flex items-center justify-between gap-3 ${className}`}>
          <div className="flex items-center gap-2.5 min-w-0">
            <AkucheBrandLogo variant="mark" size="xs" />
            <div className="min-w-0">
              <span className="text-xs font-bold text-foreground block truncate">
                {isStandalone ? "Akuche Mobile App Active" : "Install Akuche on Your Phone"}
              </span>
              <span className="text-[10px] text-muted-foreground truncate block">
                {isStandalone ? "Running in standalone mode" : "1-tap phone home screen access"}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleInstallClick}
            className="rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 text-xs font-black shadow-sm active:scale-95 transition shrink-0 touch-manipulation min-h-[38px]"
          >
            {isStandalone ? "Installed ✓" : "Install App"}
          </button>
        </div>

        {showModal && renderModal()}
      </>
    );
  }

  // Full Banner / Card variant (Default)
  return (
    <>
      <div className={`rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-card to-card p-4 sm:p-5 shadow-sm space-y-3 ${className}`}>
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
          <div className="flex items-center gap-3 min-w-0">
            <div className="shrink-0">
              <AkucheBrandLogo variant="mark" size="md" animate />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight">
                  Install AKUCHE on Your Phone
                </h3>
                <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300 shrink-0">
                  {isStandalone ? "ACTIVE" : "1-TAP"}
                </span>
              </div>
              <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                Add to your phone home screen for instant 1-tap launch, offline tools &amp; instant thinking exercises.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 text-xs sm:text-sm font-black shadow-md shadow-emerald-900/20 transition active:scale-95 min-h-[44px] touch-manipulation"
            >
              <Download className="h-4 w-4" />
              <span>{isStandalone ? "How App Works" : deferredPrompt ? "Install App Now" : "Install to Phone"}</span>
            </button>
          </div>
        </div>
      </div>

      {showModal && renderModal()}
    </>
  );

  function renderModal() {
    return (
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/80 backdrop-blur-md p-3 sm:p-4 animate-in fade-in duration-200">
        <div className="w-full max-w-md rounded-3xl border-2 border-emerald-500/40 bg-card p-5 sm:p-6 shadow-2xl space-y-5 relative max-h-[92vh] overflow-y-auto text-foreground">
          {/* Close Button */}
          <button
            type="button"
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
              Zero App Store hassle. Fast 1-tap home screen access &amp; complete offline thinking tools.
            </p>
          </div>

          {/* In-App Browser Warning (e.g. opened inside WhatsApp / Instagram) */}
          {isInAppBrowser && (
            <div className="rounded-2xl bg-amber-500/10 border border-amber-500/30 p-3.5 space-y-1.5 text-xs text-left">
              <div className="flex items-center gap-2 font-bold text-amber-600 dark:text-amber-400">
                <ExternalLink className="h-4 w-4 shrink-0" />
                <span>Opened Inside Another App</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">
                For 1-tap installation, tap the <strong>3 dots (⋮)</strong> at the top right of your screen and select <strong>&ldquo;Open in Chrome / Safari&rdquo;</strong>.
              </p>
            </div>
          )}

          {/* Native 1-Click Install Button if supported */}
          {deferredPrompt && (
            <button
              type="button"
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 px-4 text-xs sm:text-sm font-black shadow-lg active:scale-95 transition touch-manipulation min-h-[48px]"
            >
              <Download className="h-4 w-4" />
              <span>Tap Here to Install App Instantly</span>
            </button>
          )}

          {/* Step-by-Step Visual Platform Instructions */}
          {isIOS ? (
            /* iPhone Safari Guide */
            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-3 text-xs text-left">
              <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Smartphone className="h-3.5 w-3.5" />
                <span>iPhone / iPad Safari (2 Quick Steps):</span>
              </p>
              <ol className="space-y-2.5 text-foreground/90 text-xs">
                <li className="flex items-start gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    1
                  </span>
                  <div className="min-w-0">
                    <span>
                      Tap the <Share className="inline h-4 w-4 text-emerald-500 font-bold mx-1 align-sub" />{" "}
                      <strong>Share</strong> icon at the bottom of Safari.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    2
                  </span>
                  <div className="min-w-0">
                    <span>
                      Scroll down and tap{" "}
                      <PlusSquare className="inline h-4 w-4 text-emerald-500 font-bold mx-1 align-sub" />{" "}
                      <strong>&ldquo;Add to Home Screen&rdquo;</strong>, then tap <strong>Add</strong>.
                    </span>
                  </div>
                </li>
              </ol>
            </div>
          ) : (
            /* Android / Chrome Guide */
            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-4 space-y-3 text-xs text-left">
              <p className="font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 uppercase tracking-wider text-[11px]">
                <Smartphone className="h-3.5 w-3.5" />
                <span>Android / Chrome (2 Steps):</span>
              </p>
              <ol className="space-y-2.5 text-foreground/90 text-xs">
                <li className="flex items-start gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    1
                  </span>
                  <div className="min-w-0">
                    <span>
                      Tap the <MoreVertical className="inline h-4 w-4 text-emerald-500 font-bold mx-1 align-sub" />{" "}
                      <strong>3-dot menu</strong> at the top right of Chrome.
                    </span>
                  </div>
                </li>
                <li className="flex items-start gap-3 bg-card p-3 rounded-2xl border border-border/80 shadow-xs">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-xs">
                    2
                  </span>
                  <div className="min-w-0">
                    <span>
                      Tap <strong>&ldquo;Install App&rdquo;</strong> or{" "}
                      <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                    </span>
                  </div>
                </li>
              </ol>
            </div>
          )}

          {/* Direct Download Logo Asset & Cache Refresh Buttons */}
          <div className="pt-2 border-t border-border/60 space-y-2">
            <a
              href="/akuche-logo.png"
              download="akuche-logo.png"
              className="w-full flex items-center justify-center gap-2 rounded-2xl bg-emerald-600/10 hover:bg-emerald-600/20 border border-emerald-500/30 py-3 px-4 text-xs font-bold text-emerald-700 dark:text-emerald-300 transition active:scale-95 min-h-[44px]"
            >
              <Download className="h-4 w-4 text-emerald-500" />
              <span>Download Official Akuche Logo (HD PNG)</span>
            </a>

            <button
              type="button"
              onClick={handleForceRefresh}
              disabled={refreshing}
              className="w-full flex items-center justify-center gap-2 rounded-2xl border border-border bg-background hover:bg-muted py-2.5 px-4 text-xs font-semibold text-muted-foreground hover:text-foreground transition active:scale-95 min-h-[44px]"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-emerald-500" : ""}`} />
              <span>
                {refreshSuccess
                  ? "Cache Purged! Reloading..."
                  : refreshing
                  ? "Clearing Old Cache..."
                  : "Purge Stale Cache & Update Icons"}
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }
}
