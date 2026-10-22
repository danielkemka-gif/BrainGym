'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Automatic aggressive cache purge for mobile release v14
    const PURGE_KEY = 'akuche_cache_purged_v14_mobile_refresh';
    if (!localStorage.getItem(PURGE_KEY)) {
      if (typeof caches !== 'undefined') {
        caches.keys().then((keys) => {
          Promise.all(keys.map((key) => caches.delete(key))).then(() => {
            localStorage.setItem(PURGE_KEY, 'true');
          }).catch(() => {
            localStorage.setItem(PURGE_KEY, 'true');
          });
        });
      } else {
        localStorage.setItem(PURGE_KEY, 'true');
      }
    }

    // Capture PWA beforeinstallprompt globally
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      (window as any).__akuche_deferred_prompt = e;
      window.dispatchEvent(new CustomEvent('akuche:installpromptready'));
    };
    window.addEventListener('beforeinstallprompt', handleBeforeInstall);

    if (!('serviceWorker' in navigator)) {
      return () => {
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      };
    }

    // Register service worker gracefully without disruptive reload loops
    navigator.serviceWorker
      .register('/sw.js?v=14.0.0')
      .then((registration) => {
        // If a worker is waiting, activate it
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // Check for updates once on mount and on visibility change only
        registration.update().catch(() => {});

        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            registration.update().catch(() => {});
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        return () => {
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      })
      .catch((err) => {
        console.warn('SW registration info:', err);
      });

    // Notify listeners when controller changes, without forcing a disruptive page reload
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.dispatchEvent(new CustomEvent('akuche:sw-updated'));
    });
  }, []);

  return null;
}
