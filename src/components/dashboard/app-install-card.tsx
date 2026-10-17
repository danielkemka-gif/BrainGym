"use client";

import React, { useState, useEffect } from "react";
import { AkucheBrandLogo } from "@/components/brand/akuche-brand-logo";
import {
  Download,
  CheckCircle2,
  Share,
  X,
} from "lucide-react";

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

export interface AppInstallCardProps {
  variant?: "banner" | "card" | "button" | "compact";
  className?: string;
  dismissible?: boolean;
}

export function AppInstallCard({
  variant = "banner",
  className = "",
  dismissible = false,
}: AppInstallCardProps) {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [showIOSHint, setShowIOSHint] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      // Check if previously dismissed on this device
      if (dismissible && localStorage.getItem("akuche_install_card_dismissed") === "true") {
        setIsDismissed(true);
      }

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

      // Check if prompt was already captured globally
      if ((window as any).__akuche_deferred_prompt) {
        setDeferredPrompt((window as any).__akuche_deferred_prompt);
      }

      window.addEventListener("beforeinstallprompt", installHandler);
      window.addEventListener("akuche:installpromptready", () => {
        if ((window as any).__akuche_deferred_prompt) {
          setDeferredPrompt((window as any).__akuche_deferred_prompt);
        }
      });

      return () => {
        window.removeEventListener("beforeinstallprompt", installHandler);
      };
    }
  }, [dismissible]);

  const handleInstallClick = async () => {
    // 1. Check local deferred prompt or globally captured prompt
    const promptEvent =
      deferredPrompt ||
      (typeof window !== "undefined" ? (window as any).__akuche_deferred_prompt : null);

    if (promptEvent) {
      try {
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        if (outcome === "accepted") {
          setInstalledSuccess(true);
          setDeferredPrompt(null);
          if (typeof window !== "undefined") {
            (window as any).__akuche_deferred_prompt = null;
          }
          return;
        }
      } catch {
        // Fallback to native share
      }
    }

    // 2. On iOS Safari or other mobile environments without beforeinstallprompt,
    // trigger native system sheet directly with zero obstructive instructions
    if (typeof navigator !== "undefined" && (navigator as any).share) {
      try {
        await navigator.share({
          title: "AKUCHE — Train Your Mind. Transform Your Life.",
          text: "Install Akuche to your smart phone.",
          url: window.location.origin,
        });
        return;
      } catch {}
    }
  };

  const handleDismiss = () => {
    setIsDismissed(true);
    if (typeof window !== "undefined") {
      localStorage.setItem("akuche_install_card_dismissed", "true");
    }
  };

  if (isDismissed) return null;

  if (variant === "button") {
    if (isStandalone || installedSuccess) return null;
    return (
      <button
        type="button"
        onClick={handleInstallClick}
        className={`inline-flex items-center gap-1.5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-4 py-2 text-xs font-bold shadow-xs transition active:scale-95 touch-manipulation cursor-pointer ${className}`}
      >
        <Download className="h-3.5 w-3.5" />
        <span>Install App</span>
      </button>
    );
  }

  if (variant === "compact") {
    if (isStandalone || installedSuccess) return null;
    return (
      <div className={`rounded-2xl border border-primary/30 bg-primary/10 p-3 flex items-center justify-between gap-2.5 ${className}`}>
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary text-primary-foreground shrink-0">
            <Download className="h-4 w-4" />
          </div>
          <div className="min-w-0 text-left">
            <span className="text-xs font-bold text-foreground block truncate">
              Install Akuche to Your Phone
            </span>
            <span className="text-[10px] text-muted-foreground block truncate">
              Instant 1-tap launch &amp; offline thinking tools
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={handleInstallClick}
          className="rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground px-3.5 py-1.5 text-xs font-bold shadow-xs transition active:scale-95 shrink-0"
        >
          Install
        </button>
      </div>
    );
  }

  if (isStandalone || installedSuccess) {
    if (dismissible) return null;

    return (
      <div className={`rounded-3xl border-2 border-primary/40 bg-primary/10 p-4 sm:p-5 flex items-center justify-between gap-3 ${className}`}>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-xs">
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
        <span className="rounded-xl bg-primary text-primary-foreground px-3 py-1.5 text-xs font-black shrink-0">
          Installed ✓
        </span>
      </div>
    );
  }

  return (
    <div className={`rounded-3xl border-2 border-primary/40 bg-gradient-to-r from-primary/15 via-card to-card p-4 sm:p-5 shadow-sm space-y-3 relative ${className}`}>
      {dismissible && (
        <button
          type="button"
          onClick={handleDismiss}
          className="absolute top-3 right-3 p-1 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition"
          title="Dismiss banner"
          aria-label="Dismiss banner"
        >
          <X className="h-4 w-4" />
        </button>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 pr-6 sm:pr-0">
        <div className="flex items-center gap-3 min-w-0">
          <div className="shrink-0">
            <AkucheBrandLogo variant="mark" size="md" animate />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h3 className="text-sm sm:text-base font-black text-foreground tracking-tight">
                Install AKUCHE to Your Phone
              </h3>
              <span className="rounded-md bg-primary/20 px-2 py-0.5 text-[9px] font-black uppercase text-primary shrink-0">
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground px-6 py-3 text-xs sm:text-sm font-black shadow-md transition active:scale-95 min-h-[44px] touch-manipulation cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Install App</span>
          </button>
        </div>
      </div>
    </div>
  );
}
