/**
 * AKUCHE ROBUST MOBILE PWA SERVICE WORKER — v23
 *
 * Designed for reliable Android WebAPK & mobile browser startup:
 * - Ultra-fast 3.5s network timeout on HTML navigations so mobile never hangs on blank screens
 * - Clean cache-first for immutable hashed Next.js static assets (_next/static/*)
 * - Safe network-first with offline fallback for HTML routes
 * - Automatic purge of obsolete cache generations on activate
 * - Isolated bypass for auth, payments, API routes, and RSC flight data
 * - Background push notifications and notification deep-linking
 */

const CACHE_VERSION = 'akuche-v23-mobile-pwa-recovery';
const STATIC_CACHE = `akuche-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `akuche-dynamic-${CACHE_VERSION}`;

// Only pre-cache verified static assets that physically exist
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.svg',
  '/favicon.png',
  '/akuche-logo.svg',
  '/akuche-logo.png',
  '/logo.png',
  '/icons/akuche-192.png',
  '/icons/icon-maskable-192.png',
  '/icons/akuche-512.png',
  '/icons/icon-maskable-512.png',
  '/icons/akuche-apple-touch.png',
  '/icons/apple-touch-icon.png',
  '/offline.html',
];

// Helper: timeout wrapper to prevent mobile devices from hanging on stalled networks
function fetchWithTimeout(request, timeoutMs = 3500) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error('Akuche network timeout'));
    }, timeoutMs);

    fetch(request)
      .then((response) => {
        clearTimeout(timer);
        resolve(response);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

// 1. Message listener: Skip waiting, force cache purges, inspect version
self.addEventListener('message', (event) => {
  if (!event.data) return;

  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }

  if (event.data.type === 'GET_VERSION') {
    if (event.source && typeof event.source.postMessage === 'function') {
      event.source.postMessage({
        type: 'SW_VERSION_INFO',
        cacheVersion: CACHE_VERSION,
      });
    }
  }

  if (event.data.type === 'FORCE_PURGE') {
    caches
      .keys()
      .then((keys) => Promise.all(keys.map((k) => caches.delete(k))))
      .then(() => {
        self.skipWaiting();
      });
  }
});

// 2. Install: Pre-cache verified static assets and skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return Promise.allSettled(
        STATIC_ASSETS.map((url) =>
          cache.add(url).catch((err) => {
            console.warn('[Akuche SW] Pre-cache skipped for:', url, err.message);
          })
        )
      );
    })
  );
});

// 3. Activate: Delete all previous cache versions immediately and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => {
              console.log('[Akuche SW] Purging obsolete cache:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// 4. Fetch: Resilient mobile routing
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip browser extensions
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') return;

  // Bypass external APIs (Supabase, Paystack, AI providers, Google fonts)
  if (
    url.hostname.includes('supabase.co') ||
    url.hostname.includes('paystack.co') ||
    url.hostname.includes('openai.com') ||
    url.hostname.includes('anthropic.com') ||
    url.hostname.includes('posthog.com')
  ) {
    return;
  }

  // Bypass internal API routes and RSC flight payload data requests
  const isApiRoute = url.pathname.startsWith('/api/');
  const isRscRequest =
    request.headers.get('RSC') === '1' ||
    request.headers.get('Next-Router-State-Tree') !== null ||
    request.headers.get('Next-Router-Prefetch') !== null ||
    url.searchParams.has('_rsc') ||
    url.pathname.startsWith('/_next/data/');
  const isSwOrManifest =
    url.pathname === '/sw.js' ||
    url.pathname === '/manifest.json' ||
    url.pathname === '/manifest.webmanifest';

  if (isApiRoute || isRscRequest || isSwOrManifest) {
    return;
  }

  // A. Page Navigations (HTML): Fast Network-First with 3.5s timeout, falling back to cached page or /offline.html
  if (request.mode === 'navigate') {
    event.respondWith(
      fetchWithTimeout(request, 3500)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(() => {
          // If network failed or timed out, attempt cache match or offline fallback
          return caches.match(request).then((cached) => {
            if (cached) return cached;
            return caches.match('/offline.html').then((offline) => {
              return (
                offline ||
                new Response('Akuche Offline. Please reconnect to the internet.', {
                  headers: { 'Content-Type': 'text/plain' },
                })
              );
            });
          });
        })
    );
    return;
  }

  // B. Next.js Hashed Static Assets (_next/static/*): Cache-First because hashes are immutable
  if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(request).then((cached) => {
        if (cached) return cached;
        return fetch(request).then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        });
      })
    );
    return;
  }

  // C. Other Static Assets (icons, images): Network-First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const clone = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, clone);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          return new Response('Asset unavailable offline', {
            status: 503,
            statusText: 'Offline',
          });
        });
      })
  );
});

// 5. Background Web Push Delivery
self.addEventListener('push', (event) => {
  let payload = {
    title: 'Akuche Check-In',
    body: 'You have a gentle clarity follow-up waiting.',
    url: '/dashboard',
    tag: 'akuche-reminder',
  };

  if (event.data) {
    try {
      const parsed = event.data.json();
      payload = {
        title: parsed.title || payload.title,
        body: parsed.body || payload.body,
        url: parsed.url || payload.url,
        tag: parsed.tag || payload.tag,
      };
    } catch {
      const text = event.data.text();
      if (text) payload.body = text;
    }
  }

  event.waitUntil(
    self.registration.showNotification(payload.title, {
      body: payload.body,
      icon: '/icons/akuche-192.png',
      badge: '/icons/akuche-192.png',
      tag: payload.tag,
      renotify: false,
      data: { url: payload.url },
    })
  );
});

// 6. Deep link notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((windowClients) => {
      for (const client of windowClients) {
        if ('focus' in client) {
          client.focus();
          if ('navigate' in client) {
            return client.navigate(targetUrl).catch(() => client);
          }
          return client;
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
      return undefined;
    })
  );
});
