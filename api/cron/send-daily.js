// GET /api/cron/send-daily
// vercel.json の crons 設定から、毎朝7:00 JST（=22:00 UTC）に自動で呼ばれる想定。
// Vercelは CRON_SECRET という環境変数名を予約語として扱っていて、
// 設定しておくと Cron からのリクエストに自動で Authorization: Bearer <CRON_SECRET> を付けてくれる。
// なので、ここでその値を照合するだけで「Cron以外からの不正な起動」を防げる。

import { kv } from '@vercel/kv';
import webpush from 'web-push';
import { JOEL_ONE_LINERS } from '../_joel-lines.js';

webpush.setVapidDetails(
  process.env.VAPID_SUBJECT || 'mailto:hello@enverly.jp',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

// 日本時間で「今日」の日付情報を取り出す（Vercelの実行環境はUTCなので+9時間して読み替える）
function getJstDateParts() {
  const jst = new Date(Date.now() + 9 * 60 * 60 * 1000);
  return {
    date: jst.getUTCDate(),       // 1〜31
    day: jst.getUTCDay(),         // 0=日, 1=月, ...
    jstDate: jst,
  };
}

function buildTodayMessage() {
  const { date, day, jstDate } = getJstDateParts();

  // ①月初：新しいコンテンツのお知らせを最優先
  if (date === 1) {
    return {
      title: '🌱 今月の新しいコンテンツが届いたよ',
      body: '今月分のMorning Talk・絵本が更新されました。今日から一緒に始めよう。',
      tag: 'enverly-daily-month',
      url: '/',
    };
  }

  // ②週の始まり（月曜）：月初と被らない場合のみ
  if (day === 1) {
    return {
      title: '📖 今週の新しいトークが始まったよ',
      body: '今週分のMorning Talkが配信されました。',
      tag: 'enverly-daily-week',
      url: '/',
    };
  }

  // ③通常日：Joelのひとこと（クライアント側と同じdayOfYearロジックで同期）
  const startOfYear = new Date(Date.UTC(jstDate.getUTCFullYear(), 0, 0));
  const dayOfYear = Math.floor((jstDate - startOfYear) / 86400000);
  const line = JOEL_ONE_LINERS[dayOfYear % JOEL_ONE_LINERS.length];

  return {
    title: 'Morning Talkが始まったよ',
    body: `${line.en}\n${line.ja}`,
    tag: 'enverly-daily',
    url: '/',
  };
}

export default async function handler(req, res) {
  // Vercel Cronからの呼び出しかどうかを確認
  const authHeader = req.headers.authorization || '';
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const message = buildTodayMessage();
    const payload = JSON.stringify(message);

    const keys = await kv.smembers('push:sub:index');
    if (!keys || keys.length === 0) {
      return res.status(200).json({ ok: true, sent: 0, note: 'no subscribers' });
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

    return res.status(200).json({ ok: true, sent, pruned, message: message.title });
  } catch (err) {
    console.error('send-daily error', err);
    return res.status(500).json({ error: 'internal error' });
  }
}
