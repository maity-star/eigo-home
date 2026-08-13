// GET /api/cron/send-evening
// vercel.json の crons 設定から、毎日17:00 JST（=08:00 UTC）に自動で呼ばれる想定。
// 対象：火・木のEvening Talk。それ以外の曜日（月初含む）はメッセージがnullで返ってくるので、
// その場合は何も送らずに終了する（1日1通ルールを守るため、朝cronと重複しない設計）。
import { getEveningSlotMessage } from '../_notification-content.js';
import { sendToAllSubscribers } from '../_send-push.js';

export default async function handler(req, res) {
  const authHeader = req.headers.authorization || '';
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  try {
    const message = getEveningSlotMessage();
    if (!message) {
      return res.status(200).json({ ok: true, sent: 0, note: 'no message for today (evening slot skipped)' });
    }
    const result = await sendToAllSubscribers(message);
    return res.status(200).json({ ok: true, ...result, message: message.title });
  } catch (err) {
    console.error('send-evening error', err);
    return res.status(500).json({ error: 'internal error' });
  }
}
