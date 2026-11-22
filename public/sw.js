/**
 * AKUCHE RESILIENT MOBILE PWA SERVICE WORKER — v24
 *
 * Engineered for 100% reliable mobile browser & Android WebAPK startup:
 * - Natural Network-First HTML navigations without premature timeouts
 * - Immediate bypass and self-unregister on reset/clear query parameters
 * - Guaranteed offline fallback with styled UI and retry action (never raw text)
 * - Clean cache-first for immutable hashed Next.js static assets (_next/static/*)
 * - Automatic purge of obsolete cache generations on activate
 * - Isolated bypass for auth, payments, API routes, and RSC flight data
 * - Background push notifications and notification deep-linking
 */

const CACHE_VERSION = 'akuche-v24-mobile-network-first';
const STATIC_CACHE = `akuche-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `akuche-dynamic-${CACHE_VERSION}`;

// Pre-cache verified static assets with /offline.html as highest priority
const STATIC_ASSETS = [
  '/offline.html',
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
];

// Rich fallback HTML if both network and cached offline page are inaccessible
const OFFLINE_FALLBACK_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Akuche — Offline</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      background: #03251D;
      color: #F7F9F5;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      display: flex;
      align-items: center;
      justify-content: center;
      min-height: 100vh;
      padding: 1.5rem;
      text-align: center;
    }
    .card {
      max-width: 400px;
      width: 100%;
      background: rgba(4, 47, 36, 0.85);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 24px;
      padding: 2.25rem 1.75rem;
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    }
    h1 { font-size: 1.35rem; font-weight: 800; margin-bottom: 0.5rem; color: #FFFFFF; }
    p { color: #A7F3D0; font-size: 0.9rem; line-height: 1.5; margin-bottom: 1.5rem; }
    .btn {
      display: block;
      width: 100%;
      padding: 0.85rem 1.5rem;
      background: linear-gradient(135deg, #059669, #10B981);
      color: #03251D;
      border: none;
      border-radius: 14px;
      font-size: 0.95rem;
      font-weight: 800;
      cursor: pointer;
      text-decoration: none;
    }
    .btn-sub {
      display: inline-block;
      margin-top: 1rem;
      color: #6EE7B7;
      font-size: 0.82rem;
      background: none;
      border: none;
      cursor: pointer;
      text-decoration: underline;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Personal Clarity Intact</h1>
    <p>You appear to be temporarily offline or experiencing a slow network connection. Your local progress is safely stored.</p>
    <button class="btn" onclick="window.location.reload()">Retry Connection</button>
    <button class="btn-sub" onclick="window.location.href='/api/reset'">Reset Cache & Reconnect</button>
  </div>
</body>
</html>`;

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

// 2. Install: Pre-cache offline page & verified static assets and skip waiting immediately
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

  // Dedicated fail-safe: bypass and unregister if requested by query params or reset route
  if (
    url.searchParams.has('reset') ||
    url.searchParams.has('clear') ||
    url.searchParams.has('bypass') ||
    url.pathname.startsWith('/api/reset')
  ) {
    self.registration.unregister().catch(() => {});
    return; // Pass through to server directly
  }

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

  // A. Page Navigations (HTML): True Network-First WITHOUT premature timeout
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, clone);
            });
          }
          return response;
        })
        .catch(async () => {
          // Truly offline or network dropped: serve cached page or offline fallback
          try {
            const cached = await caches.match(request);
            if (cached) return cached;
            const offline = await caches.match('/offline.html');
            if (offline) return offline;
          } catch {
            // Cache lookup failed
          }
          return new Response(OFFLINE_FALLBACK_HTML, {
            headers: { 'Content-Type': 'text/html; charset=utf-8' },
            status: 200,
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
