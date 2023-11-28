// const CACHE_NAME = 'devtools-tips-v3';

// // list of requests whose responses will be pre-cached at install
// const INITIAL_CACHED_RESOURCES = [
//     '/',
//     '/browser/chrome/',
//     '/css/style.css',
//     '/js/app.js',
//     '/icons/consola.png',
// ];

const CACHE_NAME = 'my-app-cache-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll([
        '/',
        // '/browser/chrome/',
        '/css/style.css',
        '/js/app.v1.js',
        '/js/hammer.js',
        '/js/sw.js',
        '/js/swreg.js',
        '/icons/consola.png',
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request).then((response) => {
        // If the request is in the cache, return the cached version
        if (response) {
          return response;
        }
  
        // If not in cache, fetch it from the network
        return fetch(event.request).then((response) => {
          // Cache a copy of the response for future use
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, responseClone);
          });
  
          return response;
        });
      })
    );
  });
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== CACHE_NAME) {
              // Delete old caches
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });
  
  self.addEventListener('message', (event) => {
    if (event.data.action === 'skipWaiting') {
      self.skipWaiting();
    }
  });