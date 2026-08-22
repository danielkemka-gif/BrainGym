'use client';

import { useEffect } from 'react';

export function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!('serviceWorker' in navigator)) return;

    // Register and immediately force-update service worker
    navigator.serviceWorker
      .register('/sw.js')
      .then((registration) => {
        // Trigger immediate check on page load
        registration.update();

        // Check for updates periodically
        const interval = setInterval(() => {
          registration.update();
        }, 15 * 60 * 1000);

        // When a new SW is installing, ask it to skip waiting
        registration.addEventListener('updatefound', () => {
          const installingWorker = registration.installing;
          if (installingWorker) {
            installingWorker.addEventListener('statechange', () => {
              if (installingWorker.state === 'installed' && navigator.serviceWorker.controller) {
                console.log('New BrainGym version available on mobile. Refreshing cache...');
                // Automatically take over
                installingWorker.postMessage({ type: 'SKIP_WAITING' });
              }
            });
          }
        });

        return () => clearInterval(interval);
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
