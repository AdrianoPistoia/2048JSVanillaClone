

const CACHE_NAME = '2048-clone';
self.addEventListener('install', function (event) {
  event.waitUntil(
      caches.open(CACHE_NAME).then(function (cache) {
          return cache.addAll([
              '/',
              '/index.html',
              '/icons/consola.png',
              '/css/style.css',
              '/js/app.js',
              '/js/hammer.js',
              '/js/sw.js',
              // Agregar más recursos que quieras que se almacenen en caché
          ]);
      })
  );
});

// Activación del Service Worker
self.addEventListener('activate', function (event) {
  //(chequear versionado) 
  // Realizar acciones de limpieza si es necesario
});

// Intercepta las solicitudes y sirve desde el caché si está disponible
self.addEventListener("fetch", (e) => {
  const url = e.request.url;
  console.log("pasp por el fetch");
  const response =
      fetch(e.request)
          .then((res) => {
            return caches.open(CACHE_NAME).then(cache => {
                cache.put(e.request, res.clone());
                return res;
            })
          })
          .catch((err) => {
              return caches.match(e.request);
          })
  e.respondWith(response);

});



self.addEventListener("fetch-cache-only", (e) => {
  const url = e.request.url;
  console.log("paso por aca o no?");

  const cacheResponse = caches.match(e.request);

  e.respondWith(cacheResponse);

});

self.addEventListener("fetch-and-network", (e) => {
  const url = e.request.url;
  console.log("paso por el fetch n net");

  const cacheResponse = caches.match(e.request).then(response => {
      if(!response) {
          return fetch(e.request);
      }
      return response;
  });

  e.respondWith(cacheResponse);

});