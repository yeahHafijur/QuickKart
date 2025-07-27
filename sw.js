// sw.js (Service Worker)

const CACHE_NAME = 'quickkart-v1';

// Yahan un sabhi files ka path daalein jinhe aap offline available karana chahte hain
const urlsToCache = [
  '/',
  'index.html',
  'style.css',
  'main.js',
  'store.js',
  'cart.js',
  'location.js',
  'firebase-config.js',
  'utils.js',
  'admin.html',
  'admin.js',
  'images/emptyCart.webp',
  'images/placeholder.png',
  'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css',
  'https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap'
];

// Service Worker ko install karte waqt cache mein files daalna
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Cache खोला गया');
        return cache.addAll(urlsToCache);
      })
  );
});

// Network requests ko handle karna
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Agar request cache mein mil jaati hai, to wahan se return karo
        if (response) {
          return response;
        }
        // Varna, network se fetch karo
        return fetch(event.request);
      })
  );
});

// Purane cache ko delete karna
self.addEventListener('activate', event => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});