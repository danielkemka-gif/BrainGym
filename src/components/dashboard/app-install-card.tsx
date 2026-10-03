"use client";

import React, { useState, useEffect } from "react";
import { useBrand } from "@/lib/brand-context";
import {
  Smartphone,
  Download,
  RefreshCw,
  Sparkles,
  Share,
  PlusSquare,
  X,
  CheckCircle2,
  MoreVertical,
  ExternalLink,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export function AppInstallCard() {
  const { brand, brandKey, setBrandKey } = useBrand();
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [refreshSuccess, setRefreshSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Detect standalone mode
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
      }, 1000);
    } catch {
      window.location.reload();
    }
  };

  return (
    <>
      <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-primary/5 p-3.5 sm:p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <Smartphone className="h-5 w-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5">
                <h3 className="text-xs sm:text-sm font-black text-foreground truncate">
                  {brand.name} Phone App
                </h3>
                <span className="rounded-md bg-primary/10 px-1.5 py-0.2 text-[9px] font-bold text-primary shrink-0">
                  PWA
                </span>
              </div>
              <p className="text-[11px] text-muted-foreground truncate">
                1-Tap access & instant icon on your phone
              </p>
            </div>
          </div>

          {/* Quick Install/Manage Button */}
          <button
            onClick={() => setShowModal(true)}
            className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-bold text-primary-foreground shadow-xs hover:bg-primary/90 active:scale-95 transition touch-manipulation shrink-0 min-h-[38px]"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Install / Switch</span>
          </button>
        </div>
      </div>

      {/* Modal Guide & Switcher */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/70 backdrop-blur-sm p-3 sm:p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md rounded-3xl border-2 border-primary/30 bg-card p-5 sm:p-6 shadow-2xl space-y-5 relative max-h-[90vh] overflow-y-auto">
            {/* Close Button */}
            <button
              onClick={() => setShowModal(false)}
              className="absolute right-4 top-4 rounded-full p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground transition"
            >
              <X className="h-5 w-5" />
            </button>

            {/* Header */}
            <div className="text-center space-y-2 pt-1">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 border border-primary/20 p-2 shadow-inner">
                <img
                  src={brand.logoUrl}
                  alt={brand.name}
                  className="h-full w-full object-contain"
                />
              </div>
              <h2 className="text-lg sm:text-xl font-black text-foreground tracking-tight">
                App Icon & Phone Installation
              </h2>
              <p className="text-xs text-muted-foreground max-w-xs mx-auto">
                Customize your brand theme or re-install the icon on your phone without losing any progress.
              </p>
            </div>

            {/* 1. Brand Switcher (AKUCHE vs BrainGym) */}
            <div className="rounded-2xl border border-border bg-muted/40 p-3 space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                Choose App Brand & Icon:
              </span>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setBrandKey("akuche")}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition active:scale-95 touch-manipulation ${
                    brandKey === "akuche"
                      ? "border-emerald-500 bg-emerald-500/10 text-foreground ring-1 ring-emerald-500"
                      : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  <img
                    src="/akuche-logo.png"
                    alt="AKUCHE"
                    className="h-7 w-7 rounded-lg object-contain shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-black block text-foreground">AKUCHE</span>
                    <span className="text-[9px] text-emerald-500 font-bold block truncate">
                      New / Global
                    </span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setBrandKey("braingym")}
                  className={`flex items-center gap-2.5 rounded-xl border p-2.5 text-left transition active:scale-95 touch-manipulation ${
                    brandKey === "braingym"
                      ? "border-primary bg-primary/10 text-foreground ring-1 ring-primary"
                      : "border-border bg-card text-muted-foreground hover:border-muted-foreground/40"
                  }`}
                >
                  <img
                    src="/braingym-logo.png"
                    alt="BrainGym"
                    className="h-7 w-7 rounded-lg object-contain shadow-xs shrink-0"
                  />
                  <div className="min-w-0">
                    <span className="text-xs font-black block text-foreground">BrainGym</span>
                    <span className="text-[9px] text-primary font-bold block truncate">
                      Classic Theme
                    </span>
                  </div>
                </button>
              </div>
            </div>

            {/* 2. Download / Re-install instructions */}
            <div className="space-y-2">
              <span className="text-[10px] font-black uppercase tracking-wider text-muted-foreground block">
                How To Install or Update Phone Icon:
              </span>

              {deferredPrompt && (
                <button
                  onClick={handleInstallClick}
                  className="w-full flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 via-teal-600 to-cyan-600 text-white py-3 px-4 text-xs font-black shadow-md active:scale-95 transition touch-manipulation min-h-[46px]"
                >
                  <Download className="h-4 w-4" />
                  <span>Download / Install {brand.name} App</span>
                </button>
              )}

              {/* iOS Safari Guide */}
              {isIOS ? (
                <div className="rounded-2xl bg-card border border-border/80 p-3.5 text-xs space-y-2 text-left">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <span>On iPhone / iPad:</span>
                  </p>
                  <ol className="space-y-1.5 text-muted-foreground text-[11px]">
                    <li className="flex items-start gap-1.5">
                      <span className="font-black text-primary">1.</span>
                      <span>
                        Tap the <Share className="inline h-3.5 w-3.5 text-primary mx-0.5" />{" "}
                        <strong>Share</strong> button at the bottom of Safari.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-black text-primary">2.</span>
                      <span>
                        Scroll down and tap{" "}
                        <PlusSquare className="inline h-3.5 w-3.5 text-primary mx-0.5" />{" "}
                        <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                      </span>
                    </li>
                  </ol>
                  <p className="text-[10px] text-muted-foreground/80 italic pt-1">
                    Tip: If an older icon is still cached, delete the old home screen shortcut and tap &ldquo;Add to Home Screen&rdquo; again.
                  </p>
                </div>
              ) : (
                /* Android / Chrome Guide */
                <div className="rounded-2xl bg-card border border-border/80 p-3.5 text-xs space-y-2 text-left">
                  <p className="font-bold text-foreground flex items-center gap-1.5">
                    <span>On Android / Chrome:</span>
                  </p>
                  <ol className="space-y-1.5 text-muted-foreground text-[11px]">
                    <li className="flex items-start gap-1.5">
                      <span className="font-black text-primary">1.</span>
                      <span>
                        Tap the <MoreVertical className="inline h-3.5 w-3.5 text-primary mx-0.5" />{" "}
                        <strong>3-dot menu</strong> at top right of Chrome.
                      </span>
                    </li>
                    <li className="flex items-start gap-1.5">
                      <span className="font-black text-primary">2.</span>
                      <span>
                        Tap <strong>&ldquo;Install App&rdquo;</strong> or{" "}
                        <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                      </span>
                    </li>
                  </ol>
                </div>
              )}
            </div>

            {/* 3. Force Cache Refresh button */}
            <div className="pt-1 border-t border-border/60">
              <button
                type="button"
                onClick={handleForceRefresh}
                disabled={refreshing}
                className="w-full flex items-center justify-center gap-2 rounded-xl border border-border bg-background hover:bg-muted py-2.5 px-4 text-xs font-semibold text-muted-foreground hover:text-foreground transition active:scale-95 touch-manipulation min-h-[42px]"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? "animate-spin text-primary" : ""}`} />
                <span>
                  {refreshSuccess
                    ? "Updated! Reloading..."
                    : refreshing
                    ? "Clearing Cache & Updating..."
                    : "Force Refresh App Cache & Icons"}
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
