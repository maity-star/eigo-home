// Enverly サービスワーカー
// 配置場所：ドメインのルート（enverly.jp/sw.js）
// ルートに置く理由：scopeがそのパス以下に限定されるため、サイト全体でpushを受け取るには
// ルート直下に置く必要がある（/js/sw.js等に置くと /js/配下しかカバーできない）

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
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
  const targetUrl = (event.notification.data && event.notification.data.url) || '/';

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