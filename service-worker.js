const CACHE_NAME = 'photoapp-v1';
const urlsToCache = [
  './',
  './index.html',
  './style.css',
  './script.js',
  './frames/frame.png',
  './icons/icon-192.png',
  './icons/icon-512.png'
  // aggiungi qui tutte le risorse che vuoi siano disponibili offline
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener('activate', event => {
  // qui potresti gestire versioni obsolete della cache
  event.waitUntil(
    caches.keys().then(keyList => {
      return Promise.all(keyList.map(key => {
        if(key !== CACHE_NAME) {
          return caches.delete(key);
        }
      }));
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      // Se il file è in cache, lo restituiamo, altrimenti lo prendiamo dalla rete
      return response || fetch(event.request);
    })
  );
});
