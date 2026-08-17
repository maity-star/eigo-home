// Enverly サービスワーカー
// 配置場所：ドメインのルート（enverly.jp/sw.js）
// ルートに置く理由：scopeがそのパス以下に限定されるため、サイト全体でpushを受け取るには
// ルート直下に置く必要がある（/js/sw.js等に置くと /js/配下しかカバーできない）

// キャッシュバージョン：中身を変えたらこの数字を上げる（古いキャッシュは activate 時に自動削除）
const CACHE_NAME = 'enverly-shell-v1';
// 最低限のオフライン用プリキャッシュ対象（軽量なものだけ。音声mp3等は対象外）
const PRECACHE_URLS = [
  '/app',
  '/icons/icon_192.png',
  '/icons/icon_512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(PRECACHE_URLS))
  );
  self.skipWaiting();
});
self.addEventListener('activate', (event) => {
  event.waitUntil(
    Promise.all([
      // 古いバージョンのキャッシュを削除
      caches.keys().then((keys) =>
        Promise.all(keys.filter((key) => key !== CACHE_NAME).map((key) => caches.delete(key)))
      ),
      self.clients.claim(),
    ])
  );
});

// Chromeの「インストール可能」判定には fetch イベントハンドラの登録が必須。
// これが無いと Android Chrome のメニューに "Add to Home screen" / "Install app" が出ない。
self.addEventListener('fetch', (event) => {
  const { request } = event;

  // GET以外（POST等）はSWで触らずそのままネットワークへ
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // 他ドメインへのリクエストは素通し（Google Drive, Stripe等を巻き込まない）
  if (url.origin !== self.location.origin) return;

  // HTML本体（ナビゲーション）：network-first
  // 理由：Vercel edgeキャッシュとの二重キャッシュで更新が反映されない事故を避けるため、
  //       電波があれば常に最新のindex.htmlを優先し、オフライン時のみキャッシュにフォールバック
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          const clone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put('/app', clone));
          return response;
        })
        .catch(() => caches.match('/app'))
    );
    return;
  }

  // アイコン画像：cache-first（更新頻度が低く軽量なので安全にキャッシュ）
  if (url.pathname.startsWith('/icons/')) {
    event.respondWith(
      caches.match(request).then((cached) => cached || fetch(request))
    );
    return;
  }

  // それ以外（音声mp3、JS、CSS等）はSWを介さずそのままネットワークへ
});

// プッシュ通知の受信
self.addEventListener('push', (event) => {
  if (!event.data) return;
  let payload;
  try {
    payload = event.data.json();
  } catch (e) {
    payload = { title: 'Enverly', body: event.data.text() };
  }
  const title = payload.title || 'Enverly';
  const options = {
    body: payload.body || '',
    icon: payload.icon || '/icons/icon_192.png',
    badge: payload.badge || '/icons/icon_badge_72.png',
    tag: payload.tag || 'enverly-daily',
    // 同じtagの通知は上書きされる＝1日1通の運用と噛み合う（古い通知が積み重ならない）
    renotify: false,
    data: { url: payload.url || '/' },
  };
  event.waitUntil(self.registration.showNotification(title, options));
});
// 通知タップ時：既に開いているタブがあればフォーカス、なければ新規タブでアプリを開く
self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const targetUrl = (event.notification.data && event.notification.data.url) || '/app';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.navigate(targetUrl);
          return client.focus();
        }
      }
      if (self.clients.openWindow) {
        return self.clients.openWindow(targetUrl);
      }
    })
  );
});// JavaScript Document
