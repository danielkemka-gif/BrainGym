const CACHE_VERSION = 'akuche-v7-instant-sync';
const STATIC_CACHE = `akuche-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `akuche-dynamic-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/dashboard/think',
  '/dashboard/ask',
  '/dashboard/move',
  '/dashboard/surprise',
  '/dashboard/progress',
  '/dashboard/profile',
  '/dashboard/journeys',
  '/dashboard/decisions',
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

// Message listener to trigger immediate activation & full cache purge
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
  if (event.data && event.data.type === 'FORCE_PURGE') {
    caches.keys().then((keys) => {
      return Promise.all(keys.map((k) => caches.delete(k)));
    }).then(() => {
      self.skipWaiting();
    });
  }
});

// Install: pre-cache all core static assets
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

// Activate: clean and delete ALL previous cache versions immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys
          .filter((key) => key !== STATIC_CACHE && key !== DYNAMIC_CACHE)
          .map((key) => {
            console.log('Purging legacy cache version:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network-First for Navigation & HTML, Stale-While-Revalidate for Static Assets
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Supabase auth, Paystack, and external AI API calls
  if (url.hostname.includes('supabase.co') && url.pathname.includes('/auth/v1/')) return;
  if (url.hostname.includes('paystack.co') || url.hostname.includes('api.paystack.co')) return;
  if (url.hostname.includes('openai') || url.hostname.includes('anthropic') || url.hostname.includes('googleapis')) return;

  // Skip browser extension requests
  if (url.protocol === 'chrome-extension:' || url.protocol === 'moz-extension:') return;

  // 1. For Page Navigations (HTML): Strict Network-First so changes ALWAYS reflect immediately
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
          // Offline fallback
          return caches.match(request).then((cachedResponse) => {
            if (cachedResponse) return cachedResponse;
            return caches.match('/dashboard').then((dashMatch) => {
              return dashMatch || caches.match('/offline.html');
            });
          });
        })
    );
    return;
  }

  // 2. For Static Assets (images, fonts, stylesheets, scripts): Network First with Cache Fallback
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
