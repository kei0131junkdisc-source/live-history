// ============================================================
// LiveLog Service Worker
// SW_VERSION を APP_VERSION と揃えると古いキャッシュが自動削除されます
// ============================================================
const SW_VERSION = '1.2';                       // ← APP_VERSION と合わせる
const CACHE_NAME = `livelog-v${SW_VERSION}`;

const CACHE_ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

// ── インストール ──────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log(`[SW ${SW_VERSION}] install`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_ASSETS))
      .then(() => self.skipWaiting())
  );
});

// ── SKIP_WAITING メッセージ受信 ──────────────────────────────
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log(`[SW ${SW_VERSION}] skipWaiting via message`);
    self.skipWaiting();
  }
});

// ── アクティベート: 古いキャッシュを全削除 ──────────────────
self.addEventListener('activate', event => {
  console.log(`[SW ${SW_VERSION}] activate`);
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k.startsWith('livelog-') && k !== CACHE_NAME)
          .map(k => { console.log(`[SW] delete old cache: ${k}`); return caches.delete(k); })
      )
    ).then(() => self.clients.claim())
  );
});

// ── フェッチ ──────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // 外部リソース（CDN等）: ネットワーク優先
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ローカルアセット: キャッシュファースト
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res.ok) caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        return res;
      });
    })
  );
});