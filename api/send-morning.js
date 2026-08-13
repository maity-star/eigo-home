// GET /api/cron/send-morning
// vercel.json の crons 設定から、毎朝7:00 JST（=22:00 UTC）に自動で呼ばれる想定。
// 対象：月・水・金のMorning Talk、および月初の絵本告知。
// 火・木・土・日はメッセージがnullで返ってくるので、その場合は何も送らずに終了する。
//
// Vercelは CRON_SECRET という環境変数名を予約語として扱っていて、
// 設定しておくと Cron からのリクエストに自動で Authorization: Bearer <CRON_SECRET> を付けてくれる。
// なので、ここでその値を照合するだけで「Cron以外からの不正な起動」を防げる。
import { getMorningSlotMessage } from '../_notification-content.js';
import { sendToAllSubscribers } from '../_send-push.js';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const message = getMorningSlotMessage();
    if (!message) {
      return res.status(200).json({ ok: true, sent: 0, note: 'no message for today (morning slot skipped)' });
    }
    const result = await sendToAllSubscribers(message);
    return res.status(200).json({ ok: true, ...result, message: message.title });
  } catch (err) {
    console.error('send-morning error', err);
    return res.status(500).json({ error: 'internal error' });
  }
}
