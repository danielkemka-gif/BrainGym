'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Automatic 1-time aggressive cache purge for version 5
    const PURGE_KEY = 'akuche_cache_purged_v5_master';
    if (!localStorage.getItem(PURGE_KEY)) {
      if ('caches' in window) {
        caches.keys().then((keys) => {
          Promise.all(keys.map((key) => caches.delete(key))).then(() => {
            localStorage.setItem(PURGE_KEY, 'true');
          });
        });
      } else {
        localStorage.setItem(PURGE_KEY, 'true');
      }
    }

    if (!('serviceWorker' in navigator)) return;

    // Register and immediately force-update service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // If a worker is already waiting, tell it to skip waiting immediately
        if (registration.waiting) {
          registration.waiting.postMessage({ type: 'SKIP_WAITING' });
        }

        // Trigger immediate check on page load
        registration.update();

        // When user switches back to the app on mobile phone, check for updates
        const handleVisibilityChange = () => {
          if (document.visibilityState === 'visible') {
            registration.update();
          }
        };
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Check for updates periodically every 2 minutes
        const interval = setInterval(() => {
          registration.update();
        }, 2 * 60 * 1000);

        // When a new SW is installing, ask it to skip waiting
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('New Akuche version installed on mobile. Activating...');
                  installingWorker.postMessage({ type: 'SKIP_WAITING' });
                }
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
        console.warn('SW registration warning:', err);
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
