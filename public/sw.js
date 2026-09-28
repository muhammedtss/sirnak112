/* ════════════════════════════════════════════════════════════════
   Şırnak 112 — Service Worker (çevrimdışı mimari)

   Önbellekler
     pages-<version> : sayfa HTML'leri (her build'in kendi sürümü)
     static-v1       : /_next/static (hash'li, değişmez) — kullanılmayanlar budanır
     assets-v1       : public dosyaları (rev hash ile güncellenir)
     meta-v1         : durum, son manifest ve asset indeksi

   Akış
     install  → /offline ve / sayfalarını kaydet, hemen etkinleş
     activate → eski önbellekleri sil, sekmeleri devral, senkronize et
     sync     → /sw-manifest'i al; eksik sayfaları, chunk'ları ve
                değişen dosyaları indir; tamamlanınca eski sürümü sil
     message  → SYNC | GET_STATUS | DOWNLOAD_PACK | REMOVE_PACK

   İstek stratejileri
     navigasyon   : ağ öncelikli (zaman aşımlı) → önbellek → /offline
     RSC (_rsc)   : ağ; başarısızsa 503 → Next.js tam sayfa yüklemesine
                    düşer ve HTML önbellekten gelir
     /_next/static: önbellek öncelikli
     public dosya : önbellek öncelikli (görüntülenen dosya kaydedilir)
   ════════════════════════════════════════════════════════════════ */

const SW_VERSION = 'v6';
const MANIFEST_URL = '/sw-manifest';
const OFFLINE_URL = '/offline';
const PAGES_PREFIX = 'pages-';
const RUNTIME_PAGES = PAGES_PREFIX + 'runtime';
const STATIC_CACHE = 'static-v1';
const ASSETS_CACHE = 'assets-v1';
const META_CACHE = 'meta-v1';
const NETWORK_TIMEOUT_MS = 4000;
const RSC_TIMEOUT_MS = 8000;
const CONCURRENCY = 6;

/* ───────────── Yardımcılar ───────────── */

const metaKey = (name) => `/__sw/${name}`;

async function readMeta(name) {
  const res = await (await caches.open(META_CACHE)).match(metaKey(name));
  return res ? res.json() : null;
}

async function writeMeta(name, value) {
  await (await caches.open(META_CACHE)).put(
    metaKey(name),
    new Response(JSON.stringify(value), { headers: { 'Content-Type': 'application/json' } })
  );
}

/** Sayfa önbellek anahtarı: sorgu parametresiz, sondaki "/" olmadan. */
function pageKey(input) {
  const url = new URL(input, self.location.origin);
  let p = url.pathname;
  if (p.length > 1 && p.endsWith('/')) p = p.slice(0, -1);
  return p;
}

function isHtmlResponse(res) {
  return !!res && res.ok && res.type === 'basic' && (res.headers.get('Content-Type') || '').includes('text/html');
}

/** Yönlendirilmiş yanıtlar navigasyonda SW'den dönülemez (Safari) → temiz kopya. */
async function cleanResponse(res) {
  if (!res.redirected) return res;
  const body = await res.blob();
  return new Response(body, { status: res.status, statusText: res.statusText, headers: res.headers });
}

function withTimeout(promise, ms) {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('timeout')), ms);
    promise.then(
      (v) => { clearTimeout(timer); resolve(v); },
      (e) => { clearTimeout(timer); reject(e); }
    );
  });
}

/** Sınırlı eşzamanlılıkla görev havuzu. */
async function pool(items, limit, worker) {
  let i = 0;
  const runners = Array.from({ length: Math.min(limit, items.length) }, async () => {
    while (i < items.length) {
      const item = items[i++];
      try { await worker(item); } catch (e) { /* tek öğe hatası tüm senkronu durdurmaz */ }
    }
  });
  await Promise.all(runners);
}

/** HTML/CSS içindeki /_next/static referansları (RSC verisindeki kaçışlı \"...\" dahil). */
function extractStaticUrls(text) {
  const found = new Set();
  const re = /\/_next\/static\/[^"'\\\s<>()]+/g;
  let m;
  while ((m = re.exec(text)) !== null) {
    const u = m[0].replace(/[,;]+$/, '');
    if (/\.[a-z0-9]+$/i.test(u)) found.add(u);
  }
  return found;
}

async function currentPagesCacheName() {
  const state = await readMeta('state');
  return state && state.version ? PAGES_PREFIX + state.version : RUNTIME_PAGES;
}

/* ───────────── Durum yayını ───────────── */

// Sunucuya gerçekten ulaşılabiliyor mu? navigator.onLine "internetsiz Wi-Fi"yi
// yakalayamaz; SW'nin gördüğü ağ hataları istemciye bildirilir.
let reachable = null;
function reportNetwork(ok) {
  if (reachable === ok) return;
  reachable = ok;
  postAll({ type: 'SW_NETWORK', reachable: ok });
}

let progress = null; // { phase, done, total, pack? }
let lastProgressPost = 0;

async function postAll(message) {
  const clients = await self.clients.matchAll({ includeUncontrolled: true, type: 'window' });
  clients.forEach((c) => c.postMessage(message));
}

function reportProgress(next, force) {
  progress = next;
  const now = Date.now();
  if (force || now - lastProgressPost > 150) {
    lastProgressPost = now;
    postAll({ type: 'SW_PROGRESS', progress });
  }
}

async function computeStatus() {
  const [state, manifest, index] = await Promise.all([readMeta('state'), readMeta('manifest'), readMeta('asset-index')]);
  const idx = index || {};
  const packs = {};
  if (manifest) {
    for (const [name, pack] of Object.entries(manifest.packs || {})) {
      let cached = 0, cachedBytes = 0;
      for (const f of pack.files) {
        if (idx[f.url] === f.rev) { cached++; cachedBytes += f.size; }
      }
      packs[name] = {
        label: pack.label,
        files: pack.files.length,
        bytes: pack.bytes,
        cached,
        cachedBytes,
        enabled: !!(state && state.packs && state.packs[name]),
      };
    }
  }
  return {
    swVersion: SW_VERSION,
    reachable,
    version: state ? state.version : null,
    complete: !!(state && state.complete && manifest && state.version === manifest.version),
    pagesCached: state ? state.pagesCached || 0 : 0,
    pagesTotal: manifest ? manifest.pages.length : 0,
    lastSync: state ? state.lastSync || null : null,
    syncing: !!syncPromise,
    progress: syncPromise ? progress : null,
    packs,
  };
}

async function broadcastStatus() {
  postAll({ type: 'SW_STATUS', status: await computeStatus() });
}

/* ───────────── Senkronizasyon ───────────── */

let syncPromise = null;
let resyncRequested = false;

function requestSync() {
  if (syncPromise) {
    resyncRequested = true;
    return syncPromise;
  }
  syncPromise = (async () => {
    do {
      resyncRequested = false;
      try { await runSync(); } catch (e) { console.warn('[sw] senkron hatası', e); }
    } while (resyncRequested);
  })().finally(() => {
    syncPromise = null;
    progress = null;
    broadcastStatus();
  });
  broadcastStatus();
  return syncPromise;
}

async function fetchManifest() {
  try {
    const res = await fetch(MANIFEST_URL, { cache: 'no-store' });
    reportNetwork(true);
    if (!res.ok) return null;
    const manifest = await res.json();
    return manifest && manifest.version && Array.isArray(manifest.pages) ? manifest : null;
  } catch (e) {
    reportNetwork(false);
    return null; // çevrimdışı
  }
}

/** Bir sayfanın HTML'ini (önbellekten veya ağdan) sağlar ve içindeki static URL'leri döner. */
async function ensurePage(cache, path) {
  let res = await cache.match(path);
  if (!res) {
    const net = await fetch(path, { cache: 'no-cache', credentials: 'same-origin' });
    if (!isHtmlResponse(net)) throw new Error(`sayfa alınamadı: ${path} (${net.status})`);
    res = await cleanResponse(net);
    await cache.put(path, res.clone());
  }
  return extractStaticUrls(await res.text());
}

/** Static dosyayı önbelleğe al; CSS ise içindeki font/görsel referanslarını da döner. */
async function ensureStatic(cache, url) {
  let res = await cache.match(url);
  if (!res) {
    const net = await fetch(url);
    if (!net.ok) return new Set();
    res = net;
    await cache.put(url, res.clone());
  }
  return url.endsWith('.css') ? extractStaticUrls(await res.text()) : new Set();
}

async function runSync() {
  const manifest = await fetchManifest();
  if (!manifest) return;
  await writeMeta('manifest', manifest);

  const state = (await readMeta('state')) || {};
  state.packs = state.packs || {};

  /* 1) Sayfalar */
  const pagesCacheName = PAGES_PREFIX + manifest.version;
  const pagesCache = await caches.open(pagesCacheName);
  const staticRefs = new Set();
  let pagesOk = 0;
  let pagesFailed = 0;
  const total = manifest.pages.length;
  reportProgress({ phase: 'pages', done: 0, total }, true);

  await pool(manifest.pages, CONCURRENCY, async (path) => {
    try {
      (await ensurePage(pagesCache, path)).forEach((u) => staticRefs.add(u));
      pagesOk++;
    } catch (e) {
      pagesFailed++;
    }
    reportProgress({ phase: 'pages', done: pagesOk + pagesFailed, total });
  });

  /* 2) Sayfaların kullandığı JS/CSS/font dosyaları */
  const staticCache = await caches.open(STATIC_CACHE);
  let queue = [...staticRefs];
  let staticFailed = 0;
  while (queue.length) {
    const nested = new Set();
    await pool(queue, CONCURRENCY, async (url) => {
      try {
        (await ensureStatic(staticCache, url)).forEach((u) => { if (!staticRefs.has(u)) nested.add(u); });
      } catch (e) {
        staticFailed++;
      }
    });
    nested.forEach((u) => staticRefs.add(u));
    queue = [...nested];
  }

  /* 3) Public dosyalar: çekirdek + etkin paketler + daha önce görüntülenenler */
  const assetsCache = await caches.open(ASSETS_CACHE);
  const index = (await readMeta('asset-index')) || {};
  const wanted = [...manifest.core];
  const optional = [];
  for (const [name, pack] of Object.entries(manifest.packs || {})) {
    (state.packs[name] ? wanted : optional).push(...pack.files.map((f) => ({ ...f, pack: name })));
  }
  for (const f of optional) {
    // Pakete dahil değil ama kullanıcı görüntülemiş → güncel tut
    if (index[f.url] !== f.rev && (await assetsCache.match(f.url))) wanted.push(f);
  }

  const toFetch = wanted.filter((f) => index[f.url] !== f.rev);
  let assetsDone = 0;
  let assetsFailed = 0;
  reportProgress({ phase: 'assets', done: 0, total: toFetch.length }, true);
  await pool(toFetch, CONCURRENCY, async (f) => {
    try {
      const res = await fetch(f.url, { cache: 'no-cache' });
      if (!res.ok) throw new Error(String(res.status));
      await assetsCache.put(f.url, res);
      index[f.url] = f.rev;
    } catch (e) {
      assetsFailed++;
    }
    assetsDone++;
    reportProgress({ phase: 'assets', done: assetsDone, total: toFetch.length, pack: f.pack });
    if (assetsDone % 20 === 0) await writeMeta('asset-index', index); // büyük indirmelerde ilerlemeyi koru
  });
  await writeMeta('asset-index', index);

  // Build'e göre üretilen küçük dosyalar (favicon, web manifest) — her senkronda tazelenir
  await pool(manifest.extra || [], CONCURRENCY, async (url) => {
    const res = await fetch(url, { cache: 'no-cache' });
    if (res.ok) await assetsCache.put(url, res);
  });

  /* 4) Sonlandırma */
  state.pagesCached = pagesOk;
  state.lastSync = new Date().toISOString();
  if (pagesFailed === 0 && staticFailed === 0) {
    state.version = manifest.version;
    state.complete = assetsFailed === 0;
    await writeMeta('state', state);

    // Eski sayfa sürümlerini ve kullanılmayan chunk'ları temizle
    for (const name of await caches.keys()) {
      if (name.startsWith(PAGES_PREFIX) && name !== pagesCacheName) await caches.delete(name);
    }
    for (const req of await staticCache.keys()) {
      if (!staticRefs.has(new URL(req.url).pathname)) await staticCache.delete(req);
    }
    // Manifestten kaldırılmış public dosyaları sil
    const known = new Set(manifest.core.map((f) => f.url));
    Object.values(manifest.packs || {}).forEach((p) => p.files.forEach((f) => known.add(f.url)));
    for (const req of await assetsCache.keys()) {
      const path = new URL(req.url).pathname;
      // Yalnızca manifestte izlenmiş ama artık bulunmayan dosyalar (favicon vb. runtime kayıtlar kalır)
      if (index[path] && !known.has(path)) { await assetsCache.delete(req); delete index[path]; }
    }
    await writeMeta('asset-index', index);
  } else {
    state.complete = false;
    await writeMeta('state', state);
  }
}

async function removePack(name) {
  const manifest = await readMeta('manifest');
  const state = (await readMeta('state')) || {};
  state.packs = state.packs || {};
  delete state.packs[name];
  await writeMeta('state', state);
  const pack = manifest && manifest.packs && manifest.packs[name];
  if (pack) {
    const cache = await caches.open(ASSETS_CACHE);
    const index = (await readMeta('asset-index')) || {};
    await pool(pack.files, CONCURRENCY, async (f) => {
      await cache.delete(f.url);
      delete index[f.url];
    });
    await writeMeta('asset-index', index);
  }
  await broadcastStatus();
}

async function enablePack(name) {
  const state = (await readMeta('state')) || {};
  state.packs = { ...(state.packs || {}), [name]: true };
  await writeMeta('state', state);
  return requestSync();
}

/* ───────────── Yaşam döngüsü ───────────── */

self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil((async () => {
    // Minimum kabuk: çevrimdışı sayfası ve ana sayfa (tam liste activate sonrası senkronda)
    const pages = await caches.open(RUNTIME_PAGES);
    const staticCache = await caches.open(STATIC_CACHE);
    await Promise.all([OFFLINE_URL, '/'].map(async (path) => {
      try {
        const urls = await ensurePage(pages, path);
        await Promise.all([...urls].map((u) => ensureStatic(staticCache, u).catch(() => {})));
      } catch (e) { /* çevrimdışı kurulum: senkron sonra tamamlar */ }
    }));
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = (name) =>
      name.startsWith(PAGES_PREFIX) || name === STATIC_CACHE || name === ASSETS_CACHE || name === META_CACHE;
    for (const name of await caches.keys()) {
      if (!keep(name)) await caches.delete(name); // eski 'sirnak112-offline-vN' önbellekleri
    }
    await self.clients.claim();
    // Senkron beklenmez: activate uzarsa tüm fetch olayları bekletilir.
    // Sayfa yüklenince istemci de SYNC gönderir (yarıda kalırsa devam eder).
    requestSync();
  })());
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  switch (data.type) {
    case 'SYNC':
      event.waitUntil(requestSync());
      break;
    case 'GET_STATUS':
      event.waitUntil(broadcastStatus());
      break;
    case 'DOWNLOAD_PACK':
      if (typeof data.pack === 'string') event.waitUntil(enablePack(data.pack));
      break;
    case 'REMOVE_PACK':
      if (typeof data.pack === 'string') event.waitUntil(removePack(data.pack));
      break;
  }
});

/* ───────────── İstek yönetimi ───────────── */

async function handleNavigation(event) {
  const request = event.request;
  const key = pageKey(request.url);

  const network = fetch(request).then(async (res) => {
    reportNetwork(true);
    if (isHtmlResponse(res)) {
      const copy = await cleanResponse(res.clone());
      const cache = await caches.open(await currentPagesCacheName());
      await cache.put(key, copy);
    }
    return res;
  });
  event.waitUntil(network.catch(() => reportNetwork(false)));

  try {
    return await withTimeout(network, NETWORK_TIMEOUT_MS);
  } catch (e) {
    const cached = await caches.match(key);
    if (cached) return cached;
    try {
      return await network; // önbellekte yok: yavaş da olsa ağı bekle
    } catch (err) {
      // Kayıtlı olmayan sayfa: /offline'a yönlendir. HTML'i farklı bir URL'de
      // sunmak React hydration hatasına (#418) yol açar.
      if (key !== OFFLINE_URL && (await caches.match(OFFLINE_URL))) {
        return Response.redirect(`${OFFLINE_URL}?from=${encodeURIComponent(key)}`, 302);
      }
      return new Response(
        '<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width">' +
          '<title>Çevrimdışı</title><h1>Çevrimdışı</h1><p>İnternet bağlantısı yok.</p>',
        { status: 503, headers: { 'Content-Type': 'text/html; charset=utf-8' } }
      );
    }
  }
}

function handleRsc(request) {
  const network = fetch(request);
  network.then(() => reportNetwork(true), () => reportNetwork(false));
  return withTimeout(network, RSC_TIMEOUT_MS).catch(
    // Flight olmayan / başarısız yanıt → Next.js tam sayfa yüklemesi yapar,
    // o istek de navigasyon olarak önbellekten karşılanır.
    () => new Response('', { status: 503, headers: { 'Content-Type': 'text/plain' } })
  );
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request, { ignoreSearch: true });
  if (cached) return cached;
  try {
    const res = await fetch(request);
    if (res.ok && res.type === 'basic' && res.status === 200) {
      await cache.put(new URL(request.url).pathname, res.clone());
    }
    return res;
  } catch (e) {
    return new Response('', { status: 504 });
  }
}

async function networkFirst(request) {
  try {
    const res = await fetch(request);
    if (res.ok && res.type === 'basic') {
      const cache = await caches.open(ASSETS_CACHE);
      await cache.put(request, res.clone());
    }
    return res;
  } catch (e) {
    return (await caches.match(request, { ignoreSearch: true })) || new Response('', { status: 504 });
  }
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (url.pathname === '/sw.js' || url.pathname === MANIFEST_URL) return;
  if (request.headers.has('range')) return; // kısmi içerik isteklerini tarayıcıya bırak

  const isRsc = request.headers.get('RSC') === '1' || url.searchParams.has('_rsc');

  if (isRsc) {
    event.respondWith(handleRsc(request));
  } else if (request.mode === 'navigate') {
    event.respondWith(handleNavigation(event));
  } else if (url.pathname.startsWith('/_next/static/')) {
    event.respondWith(cacheFirst(request, STATIC_CACHE));
  } else if (/\.[a-z0-9]+$/i.test(url.pathname) && !url.pathname.startsWith('/_next/') && !url.pathname.endsWith('.webmanifest')) {
    event.respondWith(cacheFirst(request, ASSETS_CACHE));
  } else {
    event.respondWith(networkFirst(request));
  }
});
