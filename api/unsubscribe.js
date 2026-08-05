// POST /api/unsubscribe
// 通知OFFにした時、または送信先が無効化された時に、KVから購読情報を削除する。

import { kv } from '@vercel/kv';
import crypto from 'crypto';

function keyFor(endpoint) {
  const hash = crypto.createHash('sha256').update(endpoint).digest('hex');
  return `push:sub:${hash}`;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { endpoint } = req.body || {};
    if (!endpoint) {
      return res.status(400).json({ error: 'endpoint is required' });
    }

    const key = keyFor(endpoint);
    await kv.del(key);
    await kv.srem('push:sub:index', key);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('unsubscribe error', err);
    return res.status(500).json({ error: 'internal error' });
  }
}
