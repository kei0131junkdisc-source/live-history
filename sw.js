// LiveLog Service Worker v1
const CACHE_NAME = 'livelog-v1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
];

// インストール: 静的アセットをキャッシュ
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

// アクティベート: 古いキャッシュを削除
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// フェッチ: キャッシュファースト戦略
// 画像など大きなリソースはネットワーク優先
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // CDNリソース (Tesseract.js等) はネットワーク優先
  if (url.hostname !== self.location.hostname) {
    event.respondWith(
      fetch(event.request).catch(() => caches.match(event.request))
    );
    return;
  }

  // ローカルファイルはキャッシュファースト
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
