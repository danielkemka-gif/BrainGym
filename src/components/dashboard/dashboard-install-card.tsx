"use client";

import { useState, useEffect } from "react";
import { Smartphone, Download, Share, PlusSquare, CheckCircle2 } from "lucide-react";

export function DashboardInstallCard() {
  const [isStandalone, setIsStandalone] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [installed, setInstalled] = useState(false);

  useEffect(() => {
    if (
      window.matchMedia("(display-mode: standalone)").matches ||
      (window.navigator as any).standalone === true
    ) {
      setIsStandalone(true);
      return;
    }

    const ua = window.navigator.userAgent.toLowerCase();
    setIsIOS(/iphone|ipad|ipod/.test(ua));

    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e);
    };

    window.addEventListener("beforeinstallprompt", handler);
    return () => window.removeEventListener("beforeinstallprompt", handler);
  }, []);

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      if (choice.outcome === "accepted") {
        setInstalled(true);
      }
      setDeferredPrompt(null);
    }
  };

  if (isStandalone || installed) return null;

  return (
    <div className="rounded-3xl border-2 border-primary/40 bg-gradient-to-r from-primary/10 via-card to-violet-500/10 p-4 sm:p-5 shadow-md space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-violet-600 text-white shadow-md shadow-primary/25">
            <Smartphone className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm sm:text-base font-black text-foreground">
              Install BrainGym App on Your Phone
            </h3>
            <p className="text-xs text-muted-foreground">
              Add to your home screen for 1-tap daily brain workouts
            </p>
          </div>
        </div>

        {deferredPrompt && (
          <button
            onClick={handleInstall}
            className="shrink-0 flex items-center gap-1.5 rounded-xl bg-primary px-3.5 py-2 text-xs font-black text-white shadow-md shadow-primary/25 hover:brightness-110 active:scale-95 transition touch-manipulation min-h-[40px]"
          >
            <Download className="h-4 w-4" />
            <span>Install</span>
          </button>
        )}
      </div>

      {/* Guide text */}
      <div className="rounded-xl bg-background/80 border border-border/80 p-2.5 text-xs text-muted-foreground">
        {isIOS ? (
          <p className="flex items-center gap-1">
            <span>iPhone / Safari: Tap</span>
            <Share className="inline h-3.5 w-3.5 text-primary" />
            <strong>Share</strong>
            <span>$\rightarrow$ tap</span>
            <PlusSquare className="inline h-3.5 w-3.5 text-primary" />
            <strong>Add to Home Screen</strong>
          </p>
        ) : (
          <p>
            <span>Android / Chrome: Tap browser menu</span> <strong>(⋮)</strong> $\rightarrow$ <span>tap</span> <strong>&ldquo;Install App&rdquo;</strong>
          </p>
        )}
      </div>
    </div>
  );
}
