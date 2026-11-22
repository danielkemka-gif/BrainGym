'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share, PlusSquare, MoreVertical, Sparkles, CheckCircle2 } from 'lucide-react';
import { AkucheBrandLogo } from '@/components/brand/akuche-brand-logo';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

const STORAGE_KEY_DISMISSED = 'akuche_pwa_dismissed_v4';

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Check if running in standalone mode (already installed on home screen)
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

    // Capture native PWA install event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Custom event to trigger prompt manually (e.g. from Settings)
    const handleManualOpen = () => {
      setShowPrompt(true);
    };
    window.addEventListener('akuche:open-install-prompt', handleManualOpen);

    // Check if user just registered in this session
    const justRegistered = sessionStorage.getItem('akuche_just_registered');
    if (justRegistered === 'true') {
      sessionStorage.removeItem('akuche_just_registered');
      const timer = setTimeout(() => setShowPrompt(true), 800);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('akuche:open-install-prompt', handleManualOpen);
      };
    }

    // Otherwise check persistent dismissal
    const dismissed = localStorage.getItem(STORAGE_KEY_DISMISSED);
    if (!dismissed) {
      const timer = setTimeout(() => setShowPrompt(true), 1600);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('akuche:open-install-prompt', handleManualOpen);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('akuche:open-install-prompt', handleManualOpen);
    };
  }, []);

  const handleInstallClick = async () => {
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          setShowPrompt(false);
          localStorage.setItem(STORAGE_KEY_DISMISSED, 'true');
        }
      } catch (err) {
        console.warn('Install prompt error:', err);
        setShowManualGuide(true);
      }
      setDeferredPrompt(null);
    } else {
      // If native prompt is unavailable (e.g., iOS Safari or non-Chromium)
      setShowManualGuide((prev) => !prev);
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
      <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-3 sm:p-4 bg-background/60 backdrop-blur-sm animate-in fade-in">
        <motion.div
          initial={{ opacity: 0, y: 40, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.96 }}
          transition={{ duration: 0.25, ease: 'easeOut' }}
          className="w-full max-w-md rounded-3xl bg-card border border-border shadow-2xl p-5 sm:p-6 space-y-4 text-foreground relative overflow-hidden"
          role="dialog"
          aria-labelledby="pwa-prompt-title"
          aria-describedby="pwa-prompt-desc"
        >
          {/* Subtle Accent Glow */}
          <div className="absolute -top-16 -right-16 w-32 h-32 rounded-full bg-emerald-500/10 blur-2xl pointer-events-none" />

          {/* Header Row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <AkucheBrandLogo variant="mark" size="sm" animate />
              <div>
                <span className="rounded-full bg-emerald-500/15 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider">
                  Mobile App
                </span>
                <h3 id="pwa-prompt-title" className="text-xl font-bold tracking-tight text-foreground mt-0.5">
                  Make Akuche Yours
                </h3>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted/80 text-muted-foreground hover:text-foreground transition"
              aria-label="Close dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Exact Required Copy */}
          <div className="space-y-2">
            <p id="pwa-prompt-desc" className="text-sm text-foreground/85 leading-relaxed">
              Take Akuche with you wherever you go. Install it on your phone for quicker access, a more convenient experience, and a space to build your thinking every day.
            </p>
            <p className="text-xs text-muted-foreground">
              Add Akuche to your home screen and open it anytime, just like your other apps.
            </p>
          </div>

          {/* Action Buttons */}
          <div className="space-y-2 pt-1">
            <button
              onClick={handleInstallClick}
              className="w-full flex items-center justify-center gap-2 px-5 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-sm font-bold shadow-lg shadow-emerald-900/20 transition touch-manipulation min-h-[48px]"
            >
              <Download className="w-4 h-4" />
              <span>Install Akuche</span>
            </button>

            <button
              onClick={handleDismiss}
              className="w-full flex items-center justify-center py-2.5 rounded-xl text-xs font-semibold text-muted-foreground hover:text-foreground transition"
            >
              Maybe later
            </button>
          </div>

          {/* Step-by-Step Instructions if native prompt unavailable */}
          {(showManualGuide || isIOS) && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="pt-2 border-t border-border/60"
            >
              {isIOS ? (
                <div className="rounded-2xl bg-muted/60 p-3.5 text-xs space-y-2 text-left">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider">
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>How to add on iPhone:</span>
                  </div>
                  <div className="space-y-1.5 text-foreground/90 text-xs">
                    <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border/50">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                        1
                      </span>
                      <span>
                        Tap the <Share className="inline h-3.5 w-3.5 text-emerald-500 font-bold mx-0.5" /> <strong>Share</strong> button at bottom of Safari.
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border/50">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                        2
                      </span>
                      <span>
                        Scroll down and tap <PlusSquare className="inline h-3.5 w-3.5 text-emerald-500 font-bold mx-0.5" /> <strong>Add to Home Screen</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="rounded-2xl bg-muted/60 p-3.5 text-xs space-y-2 text-left">
                  <div className="flex items-center gap-1.5 font-bold text-emerald-600 dark:text-emerald-400 text-[11px] uppercase tracking-wider">
                    <Smartphone className="h-3.5 w-3.5" />
                    <span>How to install on Android Chrome:</span>
                  </div>
                  <div className="space-y-1.5 text-foreground/90 text-xs">
                    <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border/50">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                        1
                      </span>
                      <span>
                        Tap the browser menu <MoreVertical className="inline h-3.5 w-3.5 text-emerald-500 mx-0.5" /> (3 dots at top-right).
                      </span>
                    </div>
                    <div className="flex items-center gap-2 bg-card p-2 rounded-xl border border-border/50">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-600 text-white font-bold text-[10px]">
                        2
                      </span>
                      <span>
                        Select <strong>&ldquo;Install App&rdquo;</strong> or <strong>&ldquo;Add to Home Screen&rdquo;</strong>.
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
