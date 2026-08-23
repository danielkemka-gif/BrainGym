'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Download, X, Smartphone, Share, PlusSquare, MoreVertical } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isStandalone, setIsStandalone] = useState(false);
  const [showAndroidInstructions, setShowAndroidInstructions] = useState(false);

  useEffect(() => {
    // Check if already running in standalone mode (already installed)
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

    // Show prompt after 1.5 seconds for all users
    const timer = setTimeout(() => setShowPrompt(true), 1500);

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setShowPrompt(true);
    };

    window.addEventListener('beforeinstallprompt', handler);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      if (outcome === 'accepted') {
        setShowPrompt(false);
      }
      setDeferredPrompt(null);
    } else {
      setShowAndroidInstructions(true);
    }
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
                  Install BrainGym on Phone
                </h4>
                <p className="text-[11px] text-muted-foreground">
                  Train faster with 1-tap instant access
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

          {/* Android 1-Click Install or Manual Guide */}
          {!isIOS && (
            <div className="space-y-2">
              <button
                onClick={handleInstall}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-gradient-to-r from-primary via-violet-600 to-indigo-600 text-white text-xs sm:text-sm font-black shadow-lg shadow-primary/25 active:scale-[0.98] transition touch-manipulation min-h-[44px]"
              >
                <Download className="w-4 h-4" />
                <span>Install BrainGym App</span>
              </button>

              {showAndroidInstructions && !deferredPrompt && (
                <div className="rounded-2xl bg-muted/70 border border-border p-2.5 text-xs text-muted-foreground text-left space-y-1">
                  <p className="font-bold text-foreground">How to install on Android:</p>
                  <p>
                    1. Tap the <MoreVertical className="inline h-3.5 w-3.5 text-primary" /> <strong>3 dots (menu)</strong> in your browser.
                  </p>
                  <p>
                    2. Tap <strong>&ldquo;Install App&rdquo;</strong> or <strong>&ldquo;Add to Home screen&rdquo;</strong>.
                  </p>
                </div>
              )}
            </div>
          )}

          {/* iOS Safari Instructions */}
          {isIOS && (
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
