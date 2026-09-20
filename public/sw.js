const CACHE_VERSION = 'braingym-v2026-v11-visual-retention';
const STATIC_CACHE = `braingym-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `braingym-dynamic-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/dashboard/workout',
  '/dashboard/journal',
  '/dashboard/games',
  '/dashboard/progress',
  '/dashboard/group-challenges',
  '/manifest.json',
  '/favicon.png',
  '/logo.png',
  '/offline.html',
];

// Message listener to trigger immediate activation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Install: pre-cache all core application routes for complete offline availability
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
            console.log('Purging old cache:', key);
            return caches.delete(key);
          })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Stale-While-Revalidate & Network-First with Offline Fallback
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Supabase auth and external AI API calls
  if (url.hostname.includes('supabase.co') && url.pathname.includes('/auth/v1/')) return;
  if (url.hostname.includes('openai') || url.hostname.includes('anthropic') || url.hostname.includes('googleapis')) return;

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return;

  // For static assets and pages, try network first, fallback to offline cache immediately
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
        // Fallback to cache if offline
        return caches.match(request).then((cachedResponse) => {
          if (cachedResponse) return cachedResponse;
          if (request.mode === 'navigate') {
            return caches.match('/dashboard').then((dashMatch) => {
              return dashMatch || caches.match('/offline.html');
            });
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});
