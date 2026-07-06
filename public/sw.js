const CACHE_NAME = 'sfe-cache-v4';
const MAP_CACHE_NAME = 'leaflet-tiles-cache';

self.addEventListener('install', (event) => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME && cacheName !== MAP_CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => clients.claim())
    );
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Cache Map Tiles specifically
    if (url.hostname.includes('tile.openstreetmap.org')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                if (response) {
                    return response;
                }
                return fetch(event.request).then((networkResponse) => {
                    return caches.open(MAP_CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // Vite dev-server module graph (/@vite/, /@fs/, HMR) must NEVER be cached -
    // these are live, constantly-changing source transforms. Caching them
    // cache-first (as this used to do) permanently freezes the app on
    // whatever was loaded at first cache-fill, silently defeating every
    // subsequent code change until the cache is manually cleared.
    if (url.pathname.includes('/@vite/') || url.pathname.includes('/@fs/') || url.pathname.includes('/@react-refresh')) {
        return; // let the browser fetch it normally, uncached
    }

    // Cache production build assets only (hashed filenames make this safe -
    // a new build produces new filenames, so there's nothing to go stale).
    if (url.pathname.startsWith('/build/')) {
        event.respondWith(
            caches.match(event.request).then((response) => {
                return response || fetch(event.request).then((networkResponse) => {
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                });
            })
        );
        return;
    }

    // Network First, Cache Fallback for HTML shell and Inertia Requests
    // Only GET requests are cacheable (the Cache API throws on non-GET), so
    // POST/PUT/DELETE Inertia actions (e.g. favorite toggle) must skip the
    // cache.put() step entirely - caching them would throw, reject the
    // fetch promise, and mask a successful server response with a fake
    // offline 503, breaking Inertia's response handling.
    if (event.request.mode === 'navigate' || event.request.destination === 'document' || event.request.headers.get('X-Inertia')) {
        const isCacheable = event.request.method === 'GET';
        event.respondWith(
            fetch(event.request)
                .then((networkResponse) => {
                    if (!isCacheable) {
                        return networkResponse;
                    }
                    return caches.open(CACHE_NAME).then((cache) => {
                        cache.put(event.request, networkResponse.clone());
                        return networkResponse;
                    });
                })
                .catch(async () => {
                    if (isCacheable) {
                        const cachedResponse = await caches.match(event.request);
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                    }
                    // Optional: Return a custom offline fallback HTML here if everything fails
                    return new Response('Offline - Server is unreachable', { status: 503 });
                })
        );
        return;
    }

    // Default fetch
    event.respondWith(fetch(event.request));
});
