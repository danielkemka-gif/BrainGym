'use client';

import { useEffect, useState, useCallback } from 'react';
import { RefreshCw, Sparkles, X } from 'lucide-react';
import {
  AKUCHE_APP_VERSION,
  AKUCHE_BUILD_ID,
  AKUCHE_SW_CACHE_VERSION,
} from '@/lib/version';

export function ServiceWorkerRegistration() {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [waitingWorker, setWaitingWorker] = useState<ServiceWorker | null>(null);
  const [remoteVersion, setRemoteVersion] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const checkServerVersion = useCallback(async () => {
    try {
      const res = await fetch(`/api/version?t=${Date.now()}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          Pragma: 'no-cache',
        },
      });
      if (!res.ok) return;
      const data = await res.json();
      if (
        data &&
        ((data.version && data.version !== AKUCHE_APP_VERSION) ||
          (data.buildId && data.buildId !== AKUCHE_BUILD_ID))
      ) {
        setRemoteVersion(data.version || data.buildId);
        setUpdateAvailable(true);
      }
    } catch {
      // Offline or unreachable — ignore silently
    }
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Controlled one-time cache invalidation for v16 mobile-web sync release.
    // Preserves all authentication tokens, Supabase sessions, user progress, and localStorage data!
    const PURGE_KEY = `akuche_cache_purged_${AKUCHE_SW_CACHE_VERSION}`;
    if (!localStorage.getItem(PURGE_KEY)) {
      if (typeof caches !== 'undefined') {
        caches
          .keys()
          .then((keys) => {
            const legacyKeys = keys.filter(
              (key) => !key.includes(AKUCHE_SW_CACHE_VERSION)
            );
            return Promise.all(legacyKeys.map((key) => caches.delete(key)));
          })
          .finally(() => {
            localStorage.setItem(PURGE_KEY, 'true');
          });
      } else {
        localStorage.setItem(PURGE_KEY, 'true');
      }
    }

    // Store active build version in window for easy inspection on mobile & desktop
    (window as any).__AKUCHE_VERSION__ = {
      version: AKUCHE_APP_VERSION,
      buildId: AKUCHE_BUILD_ID,
      swCacheVersion: AKUCHE_SW_CACHE_VERSION,
    };

    // Capture PWA beforeinstallprompt globally
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as any).__akuche_deferred_prompt = e;
      window.dispatchEvent(new CustomEvent('akuche:installpromptready'));
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    // Check server version on mount
    checkServerVersion();

    if (!('serviceWorker' in navigator)) {
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    let registrationRef: ServiceWorkerRegistration | null = null;

    navigator.serviceWorker
      .register(`/sw.js?v=${AKUCHE_APP_VERSION}`)
      .then((registration) => {
        registrationRef = registration;

        // 1. If a new worker is already waiting, notify user to safely activate it
        if (registration.waiting) {
          setWaitingWorker(registration.waiting);
          setUpdateAvailable(true);
        }

        // 2. Listen for newly installed updates
        registration.addEventListener('updatefound', () => {
          const newWorker = registration.installing;
          if (!newWorker) return;

          newWorker.addEventListener('statechange', () => {
            if (
              newWorker.state === 'installed' &&
              navigator.serviceWorker.controller
            ) {
              setWaitingWorker(newWorker);
              setUpdateAvailable(true);
              window.dispatchEvent(new CustomEvent('akuche:sw-update-ready'));
            }
          });
        });

        // 3. Check for updates on mount
        registration.update().catch(() => {});
      })
      .catch((err) => {
        console.warn('SW registration info:', err);
      });

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        if (registrationRef) {
          registrationRef.update().catch(() => {});
        }
        checkServerVersion();
      }
    };

    let hadPreviousController = !!navigator.serviceWorker.controller;
    const handleControllerChange = () => {
      // Only reload if this is an actual upgrade from a previous service worker,
      // not an initial install, and only once per session to avoid reload cycles.
      if (hadPreviousController && !sessionStorage.getItem('akuche_sw_reloaded')) {
        const isTyping =
          document.activeElement &&
          (document.activeElement.tagName === 'INPUT' ||
            document.activeElement.tagName === 'TEXTAREA');
        if (!isTyping) {
          sessionStorage.setItem('akuche_sw_reloaded', 'true');
          window.location.reload();
          return;
        }
      }
      setUpdateAvailable(true);
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    navigator.serviceWorker.addEventListener('controllerchange', handleControllerChange);

    // Periodic version check every 3 minutes while app is open
    const interval = window.setInterval(checkServerVersion, 3 * 60 * 1000);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      navigator.serviceWorker.removeEventListener('controllerchange', handleControllerChange);
      window.clearInterval(interval);
    };
  }, [checkServerVersion]);

  const handleApplyUpdate = async () => {
    setIsUpdating(true);
    try {
      if (waitingWorker) {
        waitingWorker.postMessage({ type: 'SKIP_WAITING' });
      }
      if (typeof caches !== 'undefined') {
        const keys = await caches.keys();
        await Promise.all(keys.map((key) => caches.delete(key)));
      }
    } catch {
      // Ignore cache deletion errors
    }
    window.location.reload();
  };

  if (!updateAvailable) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed top-3 inset-x-3 sm:left-auto sm:right-4 sm:max-w-sm z-[120] animate-in fade-in slide-in-from-top-3 duration-200"
    >
      <div className="rounded-2xl border border-primary/30 bg-card/95 backdrop-blur-xl p-3.5 shadow-xl ring-1 ring-black/5">
        <div className="flex items-start gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary/15 text-primary">
            <Sparkles className="h-4 w-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-foreground">
              New Akuche Update Ready {remoteVersion ? `(v${remoteVersion})` : ''}
            </p>
            <p className="mt-0.5 text-[11px] leading-relaxed text-muted-foreground">
              A newer version of Akuche has been downloaded. Refresh safely to load the latest features—your session and progress are preserved.
            </p>
            <div className="mt-2.5 flex items-center gap-2">
              <button
                type="button"
                onClick={handleApplyUpdate}
                disabled={isUpdating}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-3 py-1.5 text-xs font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90 disabled:opacity-60"
              >
                <RefreshCw className={`h-3.5 w-3.5 ${isUpdating ? 'animate-spin' : ''}`} />
                {isUpdating ? 'Updating...' : 'Refresh Now'}
              </button>
              <button
                type="button"
                onClick={() => setUpdateAvailable(false)}
                className="rounded-xl px-2.5 py-1.5 text-[11px] font-semibold text-muted-foreground hover:bg-muted hover:text-foreground transition"
              >
                Later
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={() => setUpdateAvailable(false)}
            aria-label="Dismiss update notification"
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
