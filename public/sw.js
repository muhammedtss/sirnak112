const CACHE_NAME = 'ekg-cache-v2';

const PRECACHE_ASSETS = [
  '/',
  '/ekg-fallback.svg',
  '/ekg/slide-17.png',
  '/ekg/slide-18.png',
  '/ekg/slide-22.png',
  '/ekg/slide-23.png',
  '/ekg/slide-25.png',
  '/ekg/slide-26.png',
  '/ekg/slide-30.png',
  '/ekg/slide-32.png',
  '/ekg/slide-33.png',
  '/ekg/slide-34.png',
  '/ekg/slide-35.png',
  '/ekg/slide-36.png',
  '/ekg-egitim',
  '/ilac-doz'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        PRECACHE_ASSETS.map((url) => cache.add(url).catch((err) => console.error(`Failed to cache ${url}:`, err)))
      );
    })
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  // Sadece GET isteklerini önbelleğe al ve sadece aynı kökenden gelenleri işle
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  // EKG ve public dosyaları için Stale-While-Revalidate stratejisi
  if (url.pathname.startsWith('/ekg/') || url.pathname.match(/\.(png|jpg|jpeg|svg|gif|webp)$/)) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, networkResponse.clone());
            });
          }
          return networkResponse.clone();
        }).catch(() => {
          // Görüntü yüklenemezse ve cache'de de yoksa fallback dön
          if (event.request.destination === 'image') {
            return caches.match('/ekg-fallback.svg');
          }
        });

        return cachedResponse || fetchPromise;
      })
    );
  } else {
    // Diğer tüm rotalar için Network-First stratejisi (Next.js client-side routing için)
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200 && networkResponse.type === 'basic') {
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, networkResponse.clone());
          });
        }
        return networkResponse;
      }).catch(() => caches.match(event.request))
    );
  }
});
