const CACHE_VERSION = 'braingym-v2026-live-v3';
const STATIC_CACHE = `braingym-static-${CACHE_VERSION}`;
const DYNAMIC_CACHE = `braingym-dynamic-${CACHE_VERSION}`;

const STATIC_ASSETS = [
  '/',
  '/dashboard',
  '/manifest.json',
  '/favicon.png',
  '/logo.png',
];

// Install: immediately take over
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      return cache.addAll(STATIC_ASSETS).catch(() => {
        console.log('Static asset caching completed with partial fallbacks');
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

// Fetch: Network-First for everything when online to guarantee live updates reflect on smartphones
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') return;

  // Skip Supabase API calls (always network)
  if (url.hostname.includes('supabase')) return;

  // Skip OpenAI / AI API calls
  if (url.hostname.includes('openai') || url.hostname.includes('anthropic') || url.hostname.includes('googleapis')) return;

  // Skip Chrome extension requests
  if (url.protocol === 'chrome-extension:') return;

  // Network-First strategy: Always fetch latest from server, fallback to cache when offline
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
            return caches.match('/offline.html');
          }
          return new Response('Offline', { status: 503, statusText: 'Offline' });
        });
      })
  );
});

// Background sync for offline actions
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-workout') {
    event.waitUntil(syncWorkouts());
  }
});

async function syncWorkouts() {
  // Get pending workouts from IndexedDB and sync
  // This would be implemented with a proper IndexedDB wrapper
  console.log('Background sync: workouts');
}

// Push notifications
self.addEventListener('push', (event) => {
  const data = event.data?.json() ?? {};
  const title = data.title || 'BrainGym';
  const body = data.body || 'Time for your brain workout!';
  const icon = '/icons/icon-192.png';
  const badge = '/icons/badge-72.png';

  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      icon,
      badge,
      vibrate: [100, 50, 100],
      data: data.url || '/dashboard',
      actions: [
        { action: 'workout', title: 'Start Workout' },
        { action: 'dismiss', title: 'Later' },
      ],
    })
  );
});

// Notification click
self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  if (event.action === 'dismiss') return;

  const url = event.notification.data || '/dashboard';

  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window or open new one
      for (const client of clients) {
        if (client.url.includes(url) && 'focus' in client) {
          return client.focus();
        }
      }
      return self.clients.openWindow(url);
    })
  );
});
