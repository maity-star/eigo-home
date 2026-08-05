// POST /api/subscribe
// クライアントから届いた購読情報(PushSubscription)をVercel KVに保存する。
// キーはendpoint（購読ごとに一意）のハッシュ値にして、同じ端末からの再購読は上書きにする。

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
    const { subscription } = req.body || {};
    if (!subscription || !subscription.endpoint) {
      return res.status(400).json({ error: 'subscription.endpoint is required' });
    }

    const key = keyFor(subscription.endpoint);
    await kv.set(key, subscription);
    // 全購読キーを一覧できるように、専用のセットにも登録しておく
    await kv.sadd('push:sub:index', key);

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error('subscribe error', err);
    return res.status(500).json({ error: 'internal error' });
  }
}
