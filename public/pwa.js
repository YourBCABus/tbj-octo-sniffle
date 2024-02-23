const CACHE_NAME = 'tablejet-v1';

// Use the install event to pre-cache all initial resources.
// eslint-disable-next-line no-undef
self.addEventListener('install', event => {
    const precache = async () => {
        // eslint-disable-next-line no-undef
        const cache = await caches.open(CACHE_NAME);
        cache.addAll([
            '/',
            '/index.html',
            '/bundle.web.js',
            'bundle.web.js.LICENSE.txt',

            '/favicon.ico',
            'manifest.json',
            'pwa.js',

            '/icons/apple-touch-icon.png',
            '/icons/homescreen48.png',
            '/icons/homescreen72.png',
            '/icons/homescreen96.png',
            '/icons/homescreen144.png',
            '/icons/homescreen168.png',
            '/icons/homescreen192.png',
        ]);
    };
    event.waitUntil(precache());
});

// eslint-disable-next-line no-undef
self.addEventListener('fetch', event => {
    const callback = async () => {
        // eslint-disable-next-line no-undef
        const cache = await caches.open(CACHE_NAME);

        const isApiRequest =
            event.request.url.includes('api') ||
            event.request.url.includes('tbjtest');

        // Get the resource from the cache.
        const cachedResponse = await cache.match(event.request);

        if (cachedResponse && !isApiRequest) {
            return cachedResponse;
        } else {
            try {
                // If the resource was not in the cache, try the network.
                const fetchResponse = await fetch(event.request);

                // Save the resource in the cache and return it.
                cache.put(event.request, fetchResponse.clone());
                return fetchResponse;
            } catch (e) {
                // // If the resource was not in the cache and the network is down, return the cached resource.
                // if (cachedResponse) {
                //     return cachedResponse;
                // }
            }
        }
    };
    event.respondWith(callback());
});
