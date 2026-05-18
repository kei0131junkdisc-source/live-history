// ============================================================
// LiveLog Service Worker v1.4
// SW_VERSION を APP_VERSION と合わせると古いキャッシュが自動削除されます
//
// ── キャッシュ戦略 ──────────────────────────────────────────
//  index.html    → Network First（常に最新版を取得、失敗時キャッシュ）
//  その他ローカル → Cache First（オフライン対応）
//  外部CDN等      → Network First（Tesseract.js等、失敗時キャッシュ）
//
// index.html を Network First にすることで、アプリをキルして
// 再起動するだけで新バージョンのHTMLが読み込まれます。
// ============================================================
const SW_VERSION = '1.4';                       // ← APP_VERSION と合わせる
const CACHE_NAME = `livelog-v${SW_VERSION}`;

const CACHE_ASSETS = [
  './manifest.json',
  // index.html は Network First のためプリキャッシュしない
];

// ── インストール ──────────────────────────────────────────────
self.addEventListener('install', event => {
  console.log(`[SW ${SW_VERSION}] install`);
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(CACHE_ASSETS))
      .then(() => {
        console.log(`[SW ${SW_VERSION}] skipWaiting on install`);
        return self.skipWaiting();  // 即座に待機をスキップ
      })
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
          .map(k => {
            console.log(`[SW] deleting old cache: ${k}`);
            return caches.delete(k);
          })
      )
    ).then(() => {
      console.log(`[SW ${SW_VERSION}] clients.claim`);
      return self.clients.claim();  // 既存タブも即座に新SWの管理下に
    })
  );
});

// ── フェッチ ──────────────────────────────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET') return;

  // ── index.html: Network First ────────────────────────────
  // 常にネットワークから最新版を取得。オフライン時のみキャッシュを使用。
  // これによりアプリキル→再起動で新バージョンが確実に反映される。
  if (url.pathname === '/' ||
      url.pathname.endsWith('/index.html') ||
      url.pathname.endsWith('/')) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) {
            // 取得成功: キャッシュを更新してレスポンスを返す
            const clone = res.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return res;
        })
        .catch(() => {
          // オフライン時: キャッシュから返す
          console.log('[SW] offline, serving index.html from cache');
          return caches.match(event.request);
        })
    );
    return;
  }

  // ── 外部リソース (CDN等): Network First ──────────────────
  if (url.origin !== self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then(res => {
          if (res.ok) {
            caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
          }
          return res;
        })
        .catch(() => caches.match(event.request))
    );
    return;
  }

  // ── その他ローカルアセット: Cache First ──────────────────
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(res => {
        if (res.ok) {
          caches.open(CACHE_NAME).then(c => c.put(event.request, res.clone()));
        }
        return res;
      });
    })
  );
});