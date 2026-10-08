"use client";

import React, { useState, useEffect } from "react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Smartphone,
  Download,
  CheckCircle2,
  Share,
  Sparkles,
  RefreshCw,
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
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Detect standalone mode (already installed as PWA)
      if (
        window.matchMedia("(display-mode: standalone)").matches ||
        (window.navigator as any).standalone === true
      ) {
        setIsStandalone(true);
      }

      // Detect iOS Safari
      const ua = window.navigator.userAgent.toLowerCase();
      const isApple = /iphone|ipad|ipod/.test(ua);
      setIsIOS(isApple);

      // Capture native Android / Chrome PWA install prompt
      const installHandler = (e: Event) => {
        e.preventDefault();
        setDeferredPrompt(e as BeforeInstallPromptEvent);
      };

      window.addEventListener("beforeinstallprompt", installHandler);
      return () => {
        window.removeEventListener("beforeinstallprompt", installHandler);
      };
    }
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === "accepted") {
          setInstalledSuccess(true);
          setDeferredPrompt(null);
          return;
        }
      } catch {
        // Continue
      }
    }

    if (isIOS) {
      setShowIOSHint(true);
      return;
    }

    // Attempt native browser fallback if possible
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await navigator.share({
          title: "Akuche App",
          url: window.location.origin,
        });
      } catch {}
    }
  };

  if (isStandalone || installedSuccess) {
    return (
      <div className={`rounded-3xl border-2 border-emerald-500/40 bg-emerald-500/10 p-4 sm:p-5 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-emerald-600 text-white shadow-xs">
            <CheckCircle2 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-black text-foreground">
              Akuche App Installed
            </h3>
            <p className="text-xs text-muted-foreground">
              Running directly on your device with instant 1-tap launch &amp; offline tools.
            </p>
          </div>
        </div>
        <span className="rounded-xl bg-emerald-600 text-white px-3 py-1.5 text-xs font-black shrink-0">
          Installed ✓
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border-2 border-emerald-500/40 bg-gradient-to-r from-emerald-500/15 via-card to-card p-4 sm:p-5 shadow-sm space-y-3 ${className}`}>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0">
            <AkucheBrandLogo variant="mark" size="md" animate />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight">
                Install AKUCHE to Your Phone
              </h3>
              <span className="rounded-md bg-emerald-500/20 px-2 py-0.5 text-[9px] font-black uppercase text-emerald-700 dark:text-emerald-300 shrink-0">
                1-TAP
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              Instant 1-tap launch, full screen display &amp; offline thinking tools.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={handleInstallClick}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 text-xs sm:text-sm font-black shadow-md shadow-emerald-900/20 transition active:scale-95 min-h-[44px] touch-manipulation"
          >
            <Download className="h-4 w-4" />
            <span>Install App</span>
          </button>
        </div>
      </div>

      {showIOSHint && (
        <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/30 p-3 flex items-center justify-between gap-2 text-xs animate-fade-in">
          <div className="flex items-center gap-2 text-foreground">
            <Share className="h-4 w-4 text-emerald-500 shrink-0" />
            <span>
              Tap Safari <strong>Share</strong> icon below $\rightarrow$ tap <strong>&ldquo;Add to Home Screen&rdquo;</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowIOSHint(false)}
            className="text-[11px] font-bold text-muted-foreground hover:text-foreground px-2 py-0.5 rounded-lg"
          >
            Done
          </button>
        </div>
      )}
    </div>
  );
}
