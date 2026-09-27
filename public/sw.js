const CACHE_NAME = 'sirnak112-offline-v4';

const PRECACHE_PAGES = [
  '/', 
  '/ekg-egitim', 
  '/ilac-doz', 
  '/ilac-doz/cocuk', 
  '/ilac-doz/eriskin', 
  '/ilac-doz/yenidogan', 
  '/skalalar', 
  '/skalalar/apgar', 
  '/skalalar/avpu', 
  '/skalalar/best-guess', 
  '/skalalar/cabuk', 
  '/skalalar/dispne', 
  '/skalalar/ett', 
  '/skalalar/geri-dondurulebilir', 
  '/skalalar/glasgow-bebek', 
  '/skalalar/glasgow-pediatri', 
  '/skalalar/glasgow-yetiskin', 
  '/skalalar/kas-gucu', 
  '/skalalar/lma', 
  '/skalalar/onaysiz-ilaclar', 
  '/skalalar/parkland', 
  '/skalalar/pat', 
  '/skalalar/ventilator', 
  '/skalalar/yanik', 
  '/algoritmalar', 
  '/algoritmalar/cocuk', 
  '/algoritmalar/eriskin', 
  '/algoritmalar/yenidogan', 
  '/algoritmalar-gorsel', 
  '/vaka-protokolleri', 
  '/vaka-protokolleri/cocuk', 
  '/vaka-protokolleri/eriskin', 
  '/vaka-protokolleri/yenidogan', 
  '/envanter', 
  '/evraklar', 
  '/icd10'
];

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then(async (cache) => {
      await Promise.allSettled(
        PRECACHE_PAGES.map(async (url) => {
          try {
            const response = await fetch(url);
            if (response.ok) {
              await cache.put(url, response.clone());
              // Deep precache JS/CSS chunks from HTML
              const html = await response.text();
              const staticMatches = html.match(/\/_next\/static\/[^"'\s>]+/g) || [];
              const uniqueUrls = [...new Set(staticMatches)];
              
              await Promise.allSettled(
                uniqueUrls.map(async (staticUrl) => {
                  try {
                    const staticRes = await fetch(staticUrl);
                    if (staticRes.ok) {
                      await cache.put(staticUrl, staticRes.clone());
                    }
                  } catch (e) {
                    console.error('Static precache failed:', staticUrl, e);
                  }
                })
              );
            }
          } catch (e) {
            console.error('Page precache failed:', url, e);
          }
        })
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

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'CACHE_LOADED_RESOURCES' && event.data.urls) {
    caches.open(CACHE_NAME).then((cache) => {
      event.data.urls.forEach(async (url) => {
        try {
          // Zaten cache'te var mı kontrolü yapılabilir, basitlik adına overwrite
          const res = await fetch(url);
          if (res.ok) {
            await cache.put(url, res.clone());
          }
        } catch (e) {
          console.error('Failed to cache loaded resource:', url, e);
        }
      });
    });
  }
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);
  
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) return;

  const isRSC = url.searchParams.has('_rsc') || event.request.headers.get('RSC') === '1';
  const isNavigate = event.request.mode === 'navigate';
  const isStatic = url.pathname.startsWith('/_next/static/') || url.pathname.startsWith('/ekg/');

  if (isStatic) {
    // Cache-First Strategy for static assets
    event.respondWith(
      caches.match(event.request, { ignoreSearch: true }).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(event.request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  if (isRSC) {
    // RSC requests: Network first, fallback to cache, if no cache return Response.error() 
    // to force Next.js to do a full navigation
    event.respondWith(
      fetch(event.request).catch(() => {
        return caches.match(event.request).then((res) => {
          if (res) return res;
          return Response.error();
        });
      })
    );
    return;
  }

  if (isNavigate) {
    event.respondWith(
      fetch(event.request).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
           const clone = networkResponse.clone();
           caches.open(CACHE_NAME).then((cache) => cache.put(url.pathname, clone));
        }
        return networkResponse;
      }).catch(async () => {
        const cache = await caches.open(CACHE_NAME);
        const res1 = await cache.match(url.pathname, { ignoreSearch: true });
        if (res1) return res1;
        const res2 = await cache.match(event.request, { ignoreSearch: true });
        if (res2) return res2;
        return cache.match('/');
      })
    );
    return;
  }

  // Default Network-First for anything else
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      if (networkResponse && networkResponse.status === 200) {
        const clone = networkResponse.clone();
        caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
      }
      return networkResponse;
    }).catch(() => caches.match(event.request, { ignoreSearch: true }))
  );
});
