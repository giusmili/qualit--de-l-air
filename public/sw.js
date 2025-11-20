/* Simple service worker for offline caching */
const SW_VERSION = "__BUILD_ID__";
const CACHE_NAME = `qda-cache-${SW_VERSION}`;

const PRECACHE_URLS = [
  '/',
  '/index.html',
  '/offline.html',
  '/css/main.css',
  '/favicon.svg',
  '/favicon-16x16.png',
  '/favicon-32x32.png',
  '/apple-touch-icon.png',
  '/site.webmanifest',
  // Open Graph image (optional but nice to have)
  '/og-image.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // Add URLs, tolerating missing ones
    await Promise.allSettled(PRECACHE_URLS.map(async (url) => {
      try {
        const res = await fetch(url, { cache: 'no-cache' });
        if (res && res.ok) await cache.put(url, res);
      } catch (_) {
        // ignore missing assets
      }
    }));
    // Activate immediately on install
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    // Clean up old caches
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => k.startsWith('qda-cache-') && k !== CACHE_NAME).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

function isHTML(request) {
  return request.mode === 'navigate' || (request.headers.get('accept') || '').includes('text/html');
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  // Ignore non-GET
  if (isHTML(request)) {
    event.respondWith((async () => {
      try {
        const netRes = await fetch(request);
        const cache = await caches.open(CACHE_NAME);
        cache.put('/index.html', netRes.clone());
        return netRes;
      } catch (_) {
        const cache = await caches.open(CACHE_NAME);
        const cached = await cache.match('/index.html');
        if (cached) return cached;
        const offline = await cache.match('/offline.html');
        return offline || new Response('Offline', { status: 503, statusText: 'Offline' });
      }
    })());
    return;
  }

  // Cross-origin requests (APIs/CDNs): network-only, no caching
  const sameOrigin = request.url.startsWith(self.location.origin);
  if (!sameOrigin) {
    event.respondWith(fetch(request));
    return;
  }

  // Cache-first for same-origin static assets
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request);
    if (cached) return cached;
    try {
      const netRes = await fetch(request);
      if (netRes && netRes.ok) {
        cache.put(request, netRes.clone());
      }
      return netRes;
    } catch (_) {
      return cached || Response.error();
    }
  })());
});
