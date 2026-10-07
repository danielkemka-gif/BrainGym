'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Automatic aggressive cache purge for version 7
    const PURGE_KEY = 'akuche_cache_purged_v7_master';
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

    if (!('serviceWorker' in navigator)) return;

    // Register service worker with force update check
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // If a worker is waiting, activate it immediately
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // Trigger immediate registration update check
        registration.update().catch(() => {});

        // Re-check when mobile app gains visibility (e.g. user opens phone screen)
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            registration.update().catch(() => {});
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Periodically check for updates
        const interval = setInterval(() => {
          registration.update().catch(() => {});
        }, 60 * 1000);

        // On new update found, tell installing worker to skip waiting
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New Akuche version ready. Activating...');
                installingWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });

        return () => {
          clearInterval(interval);
          document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
      })
      .catch((err) => {
        console.warn('SW registration info:', err);
      });

    // Listen for controllerchange so the mobile client picks up the new bundle seamlessly
    let refreshing = false;
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      if (!refreshing) {
        refreshing = true;
        window.location.reload();
      }
    });
  }, []);

  return null;
}
