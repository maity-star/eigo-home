// api/_send-push.js
// 朝・夕どちらのcronからも呼び出す共通処理。
// 「全購読者へpayloadを送る／失効した購読をKVから掃除する」部分だけを担当する。
// 何を送るか（title/body）は呼び出し側（send-morning.js / send-evening.js）が決める。
import { kv } from '@vercel/kv';
import webpush from 'web-push';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:hello@enverly.jp',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

export async function sendToAllSubscribers(message) {
  const payload = JSON.stringify(message);
  const keys = await kv.smembers('push:sub:index');
  if (!keys || keys.length === 0) {
    return { sent: 0, pruned: 0, note: 'no subscribers' };
  }

  let sent = 0;
  let pruned = 0;

  await Promise.all(
    keys.map(async (key) => {
      const subscription = await kv.get(key);
      if (!subscription) {
        await kv.srem('push:sub:index', key);
        return;
      }
      try {
        await webpush.sendNotification(subscription, payload);
        sent += 1;
      } catch (err) {
        // 410 Gone / 404 Not Found ＝ 端末側で購読が失効している。KVから掃除する。
        if (err.statusCode === 410 || err.statusCode === 404) {
          await kv.del(key);
          await kv.srem('push:sub:index', key);
          pruned += 1;
        } else {
          console.error('send failed for', key, err.statusCode, err.body);
        }
      }
    })
  );

  return { sent, pruned };
}
