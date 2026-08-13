// api/_notification-content.js
// ========================
// Enverly 通知コピー設定（2026年8月確定）
// ========================
// 運用ルール：1日1通のみ。優先順位は以下の通り。
//   1. 月初（JST基準で日付=1）        → 絵本告知（曜日を問わず朝cronのみが送る／夕cronは重複を避けて休止）
//   2. 月・水・金                     → Morning Talk（台本ベース、朝cron担当）
//   3. 火・木                         → Evening Talk（Bodyランダム、夕cron担当）
//   4. 土日                          → 通知なし（完全再放送日）
//
// 英語混入のルール：装飾的に全部へ混ぜるのではなく、
// 「Jayの感情・実際のセリフが自然に乗る場所」だけに使う（絵本告知のHooray!など）。
import { JOEL_ONE_LINERS } from './_joel-lines.js';

const NOTIFICATION_TAG = 'enverly-daily';
// ↑ 意図的に全パターン共通のtagにしている。
//   sw.js側で「同じtagの通知は上書きされる」仕様なので、
//   万一同じ日に朝・夕両方から送信されるバグが起きても、
//   端末の通知欄には1件しか残らない（1日1通ルールの保険）。

const MONTHLY_BOOK_NOTIFICATION = {
  title: '今月の新しい絵本が届いたよ！Hooray!',
  body: 'Jayはどんな新しいお話を読んでくれるのかな',
  tag: NOTIFICATION_TAG,
  url: '/',
};

const EVENING_TALK_TITLE = 'おつかれさまでした。今日も一緒に英語のひとときを。';
const EVENING_TALK_BODIES = [
  '今夜の「Did you know?」、Jayは何を話すかな',
  'JayとMaiは今日何をしたのかな',
];

// 台本(rawScript)ができ次第、Claudeが文言案を作成→Mai確認→GOの流れで、
// 配信日（JST, 'YYYY-MM-DD'）をキーにここへ追記していく運用。
// 未登録日はJayのひとこと（JOEL_ONE_LINERS）にフォールバックする。
const MORNING_TALK_NOTIFICATIONS = {
  // '2026-08-17': { title: '今日のフレーズ、届いたよ🎈', body: 'Jayが公園で見つけたのは…アヒルの"feathers"って何のこと？' },
};

function toJstDateKey(jstDate) {
  const y = jstDate.getUTCFullYear();
  const m = String(jstDate.getUTCMonth() + 1).padStart(2, '0');
  const d = String(jstDate.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function pickJoelLine(jstDate) {
  // クライアント側(index.html)と同じdayOfYearロジックで同期
  const startOfYear = new Date(Date.UTC(jstDate.getUTCFullYear(), 0, 0));
  const dayOfYear = Math.floor((jstDate - startOfYear) / 86400000);
  return JOEL_ONE_LINERS[dayOfYear % JOEL_ONE_LINERS.length];
}

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

/**
 * 朝cron（月・水・金／月初）が送るべきメッセージ。送らない日は null。
 * @param {Date} [now] JST変換済みでない通常のDate（省略時は現在時刻）
 */
export function getMorningSlotMessage(now = new Date()) {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);
  const dateKey = toJstDateKey(jst);
  const dayOfWeek = jst.getUTCDay(); // 0=日 1=月 2=火 3=水 4=木 5=金 6=土

  // 1. 月初は最優先（曜日を問わず）
  if (jst.getUTCDate() === 1) {
    return MONTHLY_BOOK_NOTIFICATION;
  }

  // 2. 月・水・金＝Morning Talk（台本ベース、未登録日はJayのひとことにフォールバック）
  if (dayOfWeek === 1 || dayOfWeek === 3 || dayOfWeek === 5) {
    const scripted = MORNING_TALK_NOTIFICATIONS[dateKey];
    if (scripted) {
      return { ...scripted, tag: NOTIFICATION_TAG, url: '/' };
    }
    const line = pickJoelLine(jst);
    return {
      title: '今日のフレーズ、届いたよ🎈',
      body: `Jayから: ${line.ja}`,
      tag: NOTIFICATION_TAG,
      url: '/',
    };
  }

  // 火・水・木・土・日は朝cronからは何も送らない
  return null;
}

/**
 * 夕cron（火・木）が送るべきメッセージ。送らない日は null。
 * @param {Date} [now] 省略時は現在時刻
 */
export function getEveningSlotMessage(now = new Date()) {
  const jst = new Date(now.getTime() + 9 * 60 * 60 * 1000);

  // 月初はすでに朝cronで送信済み。夕cronは重複を避けて休止する。
  if (jst.getUTCDate() === 1) {
    return null;
  }

  const dayOfWeek = jst.getUTCDay();
  if (dayOfWeek === 2 || dayOfWeek === 4) {
    return {
      title: EVENING_TALK_TITLE,
      body: pickRandom(EVENING_TALK_BODIES),
      tag: NOTIFICATION_TAG,
      url: '/',
    };
  }

  return null;
}
