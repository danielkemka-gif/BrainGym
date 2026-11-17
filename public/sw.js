const CACHE_VERSION = 'akuche-v21-clarity-pwa';
const STATIC_CACHE = `akuche-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `akuche-dynamic-${CACHE_VERSION}`;

// Only pre-cache true static assets (icons, manifest, offline fallback).
// NEVER pre-cache dynamic Next.js HTML routes during install, so mobile and PWA
// clients never receive stale HTML shells or mismatched React Server Component payloads.
const STATIC_ASSETS = [
  '/manifest.json',
  '/favicon.svg',
  '/favicon.png',
  '/akuche-logo.svg',
  '/akuche-logo.png',
  '/logo.png',
  '/icons/akuche-192.png',
  '/icons/akuche-512.png',
  '/icons/akuche-apple-touch.png',
  '/icons/icon-192.png',
  '/icons/icon-512.png',
  '/icons/icon-192.svg',
  '/icons/icon-512.svg',
  '/offline.html',
];

// Controlled message listener for safe updates & cache invalidation
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

// Install: pre-cache core static assets only and skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.log('Static asset caching completed with partial fallbacks', err);
      });
    })
  );
});

// Activate: purge all legacy cache versions immediately and claim clients
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => {
        return Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
            .map((key) => {
              console.log('Purging legacy cache version:', key);
              return caches.delete(key);
            })
        );
      })
      .then(() => self.clients.claim())
  );
});

// Fetch: Strict Network-First for Navigation/HTML, Pass-Through for API & RSC, Network-First with Cache Fallback for Static Assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // 1. Skip non-GET requests
  if (request.method !== 'GET') return;

  // 2. Skip browser extension requests
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') return;

  // 3. Skip external auth, payment, and AI API endpoints
  if (url.hostname.includes('supabase.co')) return;
  if (url.hostname.includes('paystack.co') || url.hostname.includes('api.paystack.co')) return;
  if (url.hostname.includes('openai') || url.hostname.includes('anthropic') || url.hostname.includes('googleapis')) return;

  // 4. NEVER cache internal API routes, Service Worker, Manifest, or Next.js RSC / flight data requests
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

  // 5. For Page Navigations (HTML): Strict Network-First with cache: 'no-cache' so mobile/PWA always gets live HTML
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response && response.status === 200) {
            const responseClone = response.clone();
            caches.open(DYNAMIC_CACHE).then((cache) => {
              cache.put(request, responseClone);
            });
          }
          return response;
        })
        .catch(() => {
          // Offline fallback only when network is genuinely unreachable
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('/offline.html');
          });
        })
    );
    return;
  }

  // 6. For Static Assets (images, fonts, hashed _next/static bundles): Network-First with Cache Fallback
  event.respondWith(
    fetch(request)
      .then((response) => {
        if (response && response.status === 200 && response.type === 'basic') {
          const responseToCache = response.clone();
          caches.open(DYNAMIC_CACHE).then((cache) => {
            cache.put(request, responseToCache);
          });
        }
        return response;
      })
      .catch(() => {
        return caches.match(request).then((cached) => {
          if (cached) return cached;
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
