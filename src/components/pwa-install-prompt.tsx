'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share, PlusSquare } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);

  useEffect(() => {
    // Check if already in standalone (installed) mode
    if (
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    // Detect iOS
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIosDevice = /iphone|ipad|ipod/.test(userAgent);
    setIsIOS(isIosDevice);

    // If iOS and not standalone, show prompt after 2 seconds
    if (isIosDevice) {
      const timer = setTimeout(() => setShowPrompt(true), 2000);
      return () => clearTimeout(timer);
    }

    // For Android / Chrome
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstall = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setShowPrompt(false);
    }
    setDeferredPrompt(null);
  };

  const handleDismiss = () => {
    setShowPrompt(false);
  };

  if (isStandalone || !showPrompt) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        className="fixed bottom-16 sm:bottom-6 left-3 right-3 sm:left-auto sm:right-6 sm:w-96 z-50 pointer-events-auto"
      >
        <div className="rounded-3xl bg-card border-2 border-primary/40 shadow-2xl p-4 sm:p-5 backdrop-blur-lg space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-primary to-violet-600 flex items-center justify-center shrink-0 text-white shadow-md shadow-primary/25">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-black text-foreground text-sm sm:text-base">
                  Install BrainGym App
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Install on your smartphone for faster daily training
                </p>
              </div>
            </div>

            <button
              onClick={handleDismiss}
              className="flex h-7 w-7 items-center justify-center rounded-full bg-muted text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Android 1-Click Install */}
          {deferredPrompt && (
            <button
              onClick={handleInstall}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white text-xs sm:text-sm font-black shadow-lg shadow-primary/25 active:scale-[0.98] transition touch-manipulation min-h-[44px]"
            >
              <Download className="w-4 h-4" />
              <span>Install to Home Screen Now</span>
            </button>
          )}

          {/* iOS Safari Instructions */}
          {isIOS && !deferredPrompt && (
            <div className="rounded-2xl bg-muted/60 border border-border p-3 text-xs space-y-1.5 text-left">
              <div className="flex items-center gap-1.5 font-bold text-foreground">
                <span>To install on iPhone / iPad:</span>
              </div>
              <ol className="list-decimal list-inside text-muted-foreground space-y-1 text-[11px]">
                <li>
                  Tap the <Share className="inline h-3.5 w-3.5 text-primary" /> <strong>Share</strong> button at the bottom of Safari.
                </li>
                <li>
                  Scroll down and tap <PlusSquare className="inline h-3.5 w-3.5 text-primary" /> <strong>Add to Home Screen</strong>.
                </li>
              </ol>
            </div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
