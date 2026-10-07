'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share, PlusSquare, MoreVertical, Sparkles, CheckCircle2 } from 'lucide-react';
import { AkucheBrandLogo } from '@/components/brand/akuche-brand-logo';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY_DISMISSED = 'akuche_pwa_prompt_dismissed_v3';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone mode (already installed as PWA on home screen)
    const standalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true;

    if (standalone) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // Check if dismissed recently
    const dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
    if (!dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 1200);
      return () => clearTimeout(timer);
    }

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
        try {
          localStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
        } catch {}
      }
      setDeferredPrompt(null);
    } else {
      setShowAndroidInstructions((prev) => !prev);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    try {
      localStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
    } catch {}
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-[420px] z-50 pointer-events-auto"
      >
        <div className="rounded-3xl bg-background/95 border-2 border-emerald-500/40 shadow-2xl p-4 sm:p-5 backdrop-blur-xl space-y-3.5 text-foreground">
          {/* Header with Akuche Vector Mark */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3 min-w-0">
              <AkucheBrandLogo variant="mark" size="sm" animate />
              <div className="min-w-0">
                <div className="flex items-center gap-1.5">
                  <h4 className="font-black text-foreground text-sm sm:text-base tracking-tight truncate">
                    Install AKUCHE on Phone
                  </h4>
                  <span className="rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 text-[9px] font-black uppercase">
                    PWA App
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground truncate">
                  Instant 1-tap access · Full offline workouts
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:text-foreground transition"
              aria-label="Dismiss installation prompt"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Android 1-Click Install or Manual Guide */}
          {!isIOS && (
            <div className="space-y-2">
              <button
                onClick={handleInstall}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-black shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition touch-manipulation min-h-[46px]"
              >
                <Download className="w-4 h-4" />
                <span>{deferredPrompt ? 'Tap to Install App' : 'Add to Home Screen'}</span>
              </button>

              {showAndroidInstructions && (
                <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-3 text-xs text-foreground/90 text-left space-y-1.5 animate-fade-in">
                  <p className="font-bold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider">
                    Quick Android Install (2 Steps):
                  </p>
                  <p className="text-[11px] flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[9px] font-bold">1</span>
                    Tap browser menu <MoreVertical className="inline h-3.5 w-3.5 text-emerald-500" /> (3 dots at top-right).
                  </p>
                  <p className="text-[11px] flex items-center gap-1.5">
                    <span className="flex h-4 w-4 items-center justify-center rounded-full bg-emerald-600 text-white text-[9px] font-bold">2</span>
                    Select <strong>&ldquo;Install App&rdquo;</strong> or <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* iOS Safari Step-by-Step Instructions */}
          {isIOS && (
            <div className="rounded-2xl bg-emerald-500/5 border border-emerald-500/20 p-3.5 text-xs space-y-2 text-left">
              <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider">
                <Smartphone className="h-3.5 w-3.5" />
                <span>Install on iPhone in 2 Taps:</span>
              </div>
              <div className="space-y-1.5 text-foreground/90 text-[11px]">
                <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border/60">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    1
                  </span>
                  <span>
                    Tap the <Share className="inline h-3.5 w-3.5 text-emerald-500 font-bold" /> <strong>Share</strong> icon in Safari toolbar.
                  </span>
                </div>
                <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border/60">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                    2
                  </span>
                  <span>
                    Scroll down and select <PlusSquare className="inline h-3.5 w-3.5 text-emerald-500 font-bold" /> <strong>Add to Home Screen</strong>.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
