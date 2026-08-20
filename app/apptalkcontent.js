// ==============================================================
// app-talk-content.js — Morning Talk / 放送アーカイブ / Evening Talk
// 毎週の新しい台本・セリフを追加する更新はここだけを触ればOK。
// 【読み込み順】必ず app-core.js より後（registerAudio/renderJourneyNowPlaying
// をapp-core.jsから借りているため）。app-tabs.jsとの前後関係は無し。
// 【更新頻度】高い。ここが一番よく編集される想定のファイル。
// ==============================================================

// ========================
// Family Talk（ポッドキャスト＝Morning Talk）
// ========================
let ftPlaying = false, ftProg = 0;

const MORNING_TALK_MONTH = 'aug';
const MORNING_TALK_WEEKS = {
  w1: {
    theme: '基本｜暑い日・プール開き',
    days: {
      mon: {
        title: "It's hot!",
        phrases: [{ en: "It's hot!", ja: "暑いね！" }, { en: "Let's swim!", ja: "泳ごう！" }],
        rawScript: `
Joel: Good morning, Mai! | おはよう、マイ！
Mai: Good morning! Wow, it's already so hot today. | おはよう！わあ、今日はもうこんなに暑いね。
Joel: I know! It's summer time. | だよね！夏だもん。
Joel: Hey, did you look outside this morning? | ねえ、今朝外を見た？
Joel: How is the weather? | お天気どう？
Mai: Yes! It's so sunny and hot outside. | うん！外はすごく晴れてて暑いよ。
Joel: It's hot, it's hot! I think we need to drink lots of water today. | 暑い、暑い！今日はたくさん水を飲まなきゃね。
Mai: Good idea. Maybe we can go swimming later? | いいね。あとでプールに行こうか？
Joel: Yes! Let's swim! That sounds perfect for a hot day like this. | いいね！泳ごう！こんな暑い日にはぴったりだ。
Mai: I can't wait. It's hot, but swimming makes it fun. | 待ちきれない。暑いけど、泳ぐと楽しくなるね。
Joel: Hey kids, can you say it with me? | ねえみんな、一緒に言ってみよう。
Joel: "How's the weather? | 「お天気どう？
Joel: It's sunny and hot!" | 晴れてて暑いよ！」
Joel: Great job! It's hot, it's hot! It's sunny and hot! | よくできました！暑い、暑い！晴れてて暑い！
(Mai) Okay, let's go swimming and cool down! — ハイライト対象外（Maiの日本語解説の後に続く、音楽前のクロージング）
(Joel) See you tomorrow! Bye bye! — ハイライト対象外
        `,
        talkDuration: 150,
        maiTalk: '今日は "It\'s hot!"（暑いね！）というフレーズを話したよ。あと "Let\'s swim!"（泳ごう！）も出てきたね。夏はお子さんが「暑い！」って感じる場面、結構多いと思うから、そんな時にぜひ真似して言ってみてください。',
      },
      tue: {
        title: "「Let's + 動詞」で広げよう",
        phrases: [{ en: "Let's eat!", ja: "一緒に食べよう！" }],
        rawScript: `
Joel: Good morning, Mai! | おはよう、マイ！
Mai: Good morning! Wow, it's already so hot today. | おはよう！わあ、今日はもうこんなに暑いね。
Joel: I know! It's summer time. | だよね！夏だもん。
Joel: Hey, did you look outside this morning? | ねえ、今朝外を見た？
Joel: How is the weather? | お天気どう？
Mai: Yes! It's so sunny and hot outside. | うん！外はすごく晴れてて暑いよ。
Joel: It's hot, it's hot! I think we need to drink lots of water today. | 暑い、暑い！今日はたくさん水を飲まなきゃね。
Mai: Good idea. Maybe we can go swimming later? | いいね。あとでプールに行こうか？
Joel: Yes! Let's swim! That sounds perfect for a hot day like this. | いいね！泳ごう！こんな暑い日にはぴったりだ。
Mai: I can't wait. It's hot, but swimming makes it fun. | 待ちきれない。暑いけど、泳ぐと楽しくなるね。
Joel: Hey kids, can you say it with me? | ねえみんな、一緒に言ってみよう。
Joel: "How's the weather? | 「お天気どう？
Joel: It's sunny and hot!" | 晴れてて暑いよ！」
Joel: Great job! It's hot, it's hot! It's sunny and hot! | よくできました！暑い、暑い！晴れてて暑い！
(Mai) Okay, let's go swimming and cool down! — ハイライト対象外（Maiの日本語解説の後に続く、音楽前のクロージング）
(Joel) See you tomorrow! Bye bye! — ハイライト対象外
        `,
        maiTalk: '月曜日の会話に出てきた "Let\'s swim!"、覚えてるかな？実はこの "Let\'s"、「一緒に〜しよう」って誘う時に使えるフレーズなんだよ。例えば "Let\'s eat!"（一緒に食べよう！）とか "Let\'s dance!"（一緒に踊ろう！）みたいに、いろんな言葉と組み合わせられるの。今日はぜひお子さんを "Let\'s eat!" って誘ってみてください。',
      },
      wed: {
        title: 'I like ice cream!',
        phrases: [{ en: 'I like ice cream!', ja: 'アイスクリームが好き！' }],
        rawScript: `
Jay: Good morning, Mai! | おはよう、Mai！
Mai: Good morning, Joel! Hey, I had a great dream last night. | おはよう、Jay！ねえ、昨日の夜すごくいい夢を見たんだ。
Jay: What was your dream about? | どんな夢だったの？
Mai: It was about ice cream! | アイスクリームの夢だったよ！
Jay: That's a perfect dream for summer! | 夏にぴったりの夢だね！
Mai: Yes. And now I want to eat ice cream. | うん。それで今アイスクリームが食べたくなっちゃった。
Jay: Haha that sounds nice. Ice cream is delicious. | ははは、いいね。アイスクリームっておいしいよね。
Mai: I like ice cream. | アイスクリームが好き。
Jay: I like ice cream, too! | 僕もアイスクリームが好きだよ！
Jay: Can you say it with me? I like ice cream. | 一緒に言ってみよう。I like ice cream。
Mai: Hey Joel, I'm getting hungry. | ねえJay、お腹すいてきた。
Jay: Okay let's eat breakfast and then go get some ice cream. | よし、朝ごはん食べてからアイスクリーム買いに行こう。
        `,
        maiTalk: '今日は私が "I like ice cream!" って言ってたね。好きなものを伝えるときに "I like ○○!" って言うよ。バナナが好きなら "I like bananas!"、車が好きなら "I like cars!" だよ。お父さん、お母さん、朝ご飯の時に "I like ○○!" って好きなものを英語で言ってみるのはいかがですか。それだけで朝から英語が生活の一部になります。',
      },
      thu: {
        title: '"too" をつけて広げよう',
        phrases: [{ en: 'I like ice cream, too!', ja: '私もアイスクリームが好き！' }],
        rawScript: `
Jay: Good morning, Mai! | おはよう、Mai！
Mai: Good morning, Joel! Hey, I had a great dream last night. | おはよう、Jay！ねえ、昨日の夜すごくいい夢を見たんだ。
Jay: What was your dream about? | どんな夢だったの？
Mai: It was about ice cream! | アイスクリームの夢だったよ！
Jay: That's a perfect dream for summer! | 夏にぴったりの夢だね！
Mai: Yes. And now I want to eat ice cream. | うん。それで今アイスクリームが食べたくなっちゃった。
Jay: Haha that sounds nice. Ice cream is delicious. | ははは、いいね。アイスクリームっておいしいよね。
Mai: I like ice cream. | アイスクリームが好き。
Jay: I like ice cream, too! | 僕もアイスクリームが好きだよ！
Jay: Can you say it with me? I like ice cream. | 一緒に言ってみよう。I like ice cream。
Mai: Hey Joel, I'm getting hungry. | ねえJay、お腹すいてきた。
Jay: Okay let's eat breakfast and then go get some ice cream. | よし、朝ごはん食べてからアイスクリーム買いに行こう。
        `,
        maiTalk: '水曜日のアイスクリームの夢のお話、覚えてる?私が"I like ice cream!"って言った後に、Jayもアイスクリームが大好きだから"I like ice cream, too!"って言ってたね。もし同じ気持ちだったら最後に"too"をつけるんだよ。例えば"I\'m hungry, too."とか"Me too!"って言うんだよ。',
      },
      fri: {
        title: 'I am ready!',
        phrases: [{ en: 'It will be fun!', ja: '楽しくなるはず！' }, { en: 'I am ready!', ja: '準備できた！' }],
        rawScript: `
Jay: Good morning, Mai! Ready for the day? | おはよう、Mai！今日の準備はいい？
Mai: Yes! I heard we're going to the pool again today. | うん！今日もプールに行くって聞いたよ。
Jay: That's right! It will be fun. Let's say it together: It will be fun! | そうだよ！楽しくなるはず。一緒に言ってみよう。It will be fun！
Jay: Hey Mai, what should we bring to the pool? | ねえMai、プールに何を持っていく？
Mai: Good question. Of course we need towels. | いい質問だね。もちろんタオルはいるね。
Jay: Yes, we can't forget to bring a towel. And it's so sunny and hot today | うん、タオルは忘れちゃいけないね。それに今日はすごく晴れてて暑いから
Jay: so we need to be careful. I'll bring a hat, sunscreen and my water bottle. | 気をつけないと。帽子と日焼け止めと水筒を持っていくよ。
Mai: But Jay, are you forgetting something? | でもJay、何か忘れてない？
Jay: Hmmmm I don't think so? | うーん、そんなことないと思うけど？
Mai: What about your swimsuit! | 水着は！？
Jay: Oh that's so silly. Yes, we need to bring our swimsuits. | あ、しまった。そうだ、水着を持っていかなきゃ。
Jay: OK I think I'm ready to go. I am ready! | よし、準備できたと思う。I am ready！
Jay: Let's say it together. I am ready! | 一緒に言ってみよう。I am ready！
        `,
        maiTalk: '今日はJayとMaiが「一緒に言ってみよう」ってやってたフレーズ、覚えてるかな？"It will be fun!"（楽しくなるはず！）と、最後の"I am ready!"（準備できた！）の2つだったね。あと、プールに行くのに水着を忘れかけてたJayが面白かったよね。swimsuit（水着）って単語、覚えられたかな？タオルは"towel"、日焼け止めは"sunscreen"も出てきたよ。お父さんお母さん、おはようございます！お出かけ前に「Are you ready?」と聞いてみてください。「うん」って答えたら、「OK! We are ready!」とテンション高めに言ってみてください。それだけでお子様には英語って楽しいという気持ちが芽生えます。',
      },
    }
  },
  w2: {
    theme: '夏の締めくくり｜ビーチ・雨の日',
    days: {
      mon: {
        title: "It's a big day today!",
        phrases: [{ en: "It's a big day today!", ja: '今日は特別な日！' }],
        rawScript: `
Jay: Good morning, Mai! It's a big day today. | おはよう、Mai！今日は特別な日だね。
Mai: Good morning! I'm so excited. We're going to the beach! | おはよう！すごくワクワクしてる。海に行くんだもん！
Jay: It's sunny and hot today. Let's say it together, it's sunny and hot. | 今日は晴れてて暑いね。一緒に言ってみよう、It's sunny and hot。
Jay: OK, time to get ready. It's a long drive to the beach. | よし、準備の時間だ。海までは長いドライブになるよ。
Mai: Let's listen to music on the way. | 道中は音楽を聴こうよ。
Jay: Perfect! I have my towel, sunscreen and hat. Let's go! | いいね！タオルと日焼け止めと帽子、準備できたよ。行こう！
Mai: But Jay, are you forgetting something? | でもJay、何か忘れてない？
Jay: That's so silly. I forgot my swimsuit! | やだ、水着を忘れてた！
Mai: Again! OK, we are ready for the beach. | また！？よし、これで海に行く準備できたね。
Jay: Let's go! Now it's your turn. 1, 2, 3…Let's go! | 行こう！今度は君の番だよ。1、2、3…Let's go!
Mai: OK everyone, we'll see you later. | それじゃあみんな、また後でね。
Jay: Bye bye! | バイバイ！
Mai: Bye bye! | バイバイ！
        `,
        maiTalk: null,
      },
      tue: {
        title: "It's a big day today!（仮・要文言追加）",
        phrases: [{ en: "It's a big day today!", ja: '今日は特別な日！' }],
        maiTalk: null,
      },
      wed: {
        title: "It's so rainy today!",
        phrases: [{ en: "It's so rainy today!", ja: '雨が降ってるね！' }],
        rawScript: `
Jay: Good morning, Mai! How's the weather today? | おはよう、Mai！今日の天気はどう？
Mai: It's so rainy and windy today! | 今日はすごく雨風が強いよ！
Jay: I know. What should we do on a rainy day? | だよね。雨の日は何しようか？
Mai: It's a great day to stay inside. Let's do a puzzle! | おうちで過ごすのにぴったりの日だね。パズルしよう！
Jay: That's a great idea. I like puzzles. Let's say it together. I like puzzles. | いいアイデアだね。パズル好きなんだ。一緒に言ってみよう、I like puzzles。
Jay: After the puzzle, let's go outside and jump in the puddles! | パズルが終わったら、外に出て水たまりでジャンプしよう！
Mai: That's a nice idea. But it's pretty rainy… | いいね。でも結構降ってるよ…
Jay: Don't worry. We can wear our raincoats and rainboots. | 大丈夫。レインコートと長靴を履けばいいよ。
Mai: Perfect! That way we won't get wet. | いいね！それなら濡れないね。
Jay: Just like a duck's feathers! | アヒルの羽根と同じだね！
Mai: Haha that's silly. | ふふ、おもしろい。
Jay: Okay let's have fun in the rain! | よし、雨の日を楽しもう！
Jay: Bye bye! | バイバイ！
Mai: Bye bye! | バイバイ！
        `,
        maiTalk: null,
      },
      thu: {
        title: "It's so rainy today!（仮・要文言追加）",
        phrases: [{ en: "It's so rainy today!", ja: '雨が降ってるね！' }],
        maiTalk: null,
      },
      fri: {
        title: "It's so sunny today!",
        phrases: [{ en: "It's so sunny today!", ja: '晴れてるね！' }],
        rawScript: `
Jay: Good morning, Mai! Look at that blue sky. | おはよう、Mai！見て、青い空だよ。
Mai: Good morning! It's so sunny today. | おはよう！今日はすごく晴れてるね。
Jay: It's great to see the sun again after a rainy, gloomy day. | 雨の暗い日の後に太陽が見えるとうれしいね。
Mai: It's so bright! | すごく明るいね！
Jay: Yes! It's so sunny, I need my sunglasses. | うん！すごく晴れてるからサングラスがいるよ。
Mai: Me too! Sunny days are the best for the beach. Can we go to the beach again? | 私も！晴れの日は海に行くのに最高だね。また海に行ける？
Jay: Sorry, I can't go today. I have a soccer game. | ごめん、今日は行けないんだ。サッカーの試合があるから。
Mai: That's too bad! I hope you have fun. | 残念！楽しんできてね。
Jay: Thank you! I will do my best. Let's say it together. I will do my best! | ありがとう！がんばるよ。一緒に言ってみよう、I will do my best!
Jay: Mai, I hope you have fun at the beach. | Mai、海楽しんできてね。
Mai: I'm excited to swim in the ocean again! | また海で泳げるの楽しみ！
Jay: See you later! | またあとでね！
Mai: Bye for now! | それじゃあね！
        `,
        maiTalk: null,
      },
    }
  },
};
const MORNING_TALK_WEEK_STARTS = { w1: '2026-08-24' };
const MORNING_TALK_WEEK_ORDER = ['w1', 'w2'];
const DAY_KEY_BY_INDEX = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'];
const DAY_LABEL_JA = { mon: '月', tue: '火', wed: '水', thu: '木', fri: '金', sat: '土', sun: '日' };
const DAY_LABEL_EN = { mon: 'MON', tue: 'TUE', wed: 'WED', thu: 'THU', fri: 'FRI', sat: 'SAT', sun: 'SUN' };
function setTalkDateHead(prefix, now, dayKey, title) {
  const monthEl = document.getElementById(prefix + 'DateMonth');
  const dayEl = document.getElementById(prefix + 'DateDay');
  const dowEl = document.getElementById(prefix + 'DateDow');
  const titleEl = document.getElementById(prefix + 'HeaderTitle');
  if (monthEl) monthEl.textContent = String(now.getMonth() + 1).padStart(2, '0');
  if (dayEl) dayEl.textContent = String(now.getDate()).padStart(2, '0');
  if (dowEl) dowEl.textContent = DAY_LABEL_EN[dayKey] || '';
  if (titleEl) titleEl.textContent = title;
}
const NEW_DAY_KEYS = ['mon', 'wed', 'fri'];

const MORNING_TALK_AUDIO = {
  aug_w1_mon: 'morning_talk/mor_aug_w1_mon.mp3',
  aug_w1_tue: 'morning_talk/mor_aug_w1_tue.mp3',
  aug_w1_wed: 'morning_talk/mor_aug_w1_wed.mp3',
  aug_w1_thu: 'morning_talk/mor_aug_w1_thu.mp3',
  aug_w1_fri: 'morning_talk/mor_aug_w1_fri.mp3',
};

const MORNING_TALK_LINE_TIMINGS = {
  aug_w1_mon: [0.454, 8.188, 13.545, 19.022, 21.969, 23.505, 28.689, 36.105, 40.426, 47.121, 53.720, 59.282, 63.387, 73.166],
  aug_w1_wed: [6.0, 8.782, 14.950, 17.545, 22.024, 25.819, 29.929, 35.793, 38.646, 41.909, 50.510, 54.758],
  aug_w1_fri: [4.996, 10.236, 15.630, 29.492, 34.529, 40.417, 49.383, 59.255, 63.813, 68.211, 71.703, 79.124, 86.903],
};

const MORNING_TALK_REPLAY_OFFSET = {
  aug_w1_tue: 33.352,
  aug_w1_thu: 38.218,
};

function resolveMorningTalkReplayBaseKey(audioKey) {
  const m = /^(.+_w\d)_(tue|thu)$/.exec(audioKey);
  if (!m) return null;
  const baseDayKey = m[2] === 'tue' ? 'mon' : 'wed';
  return `${m[1]}_${baseDayKey}`;
}

const MORNING_TALK_REPLAY_SKIP_FIRST_LINE = new Set(['aug_w1_tue']);

function resolveMorningTalkLineStarts(audioKey) {
  const offset = MORNING_TALK_REPLAY_OFFSET[audioKey];
  if (offset == null) return MORNING_TALK_LINE_TIMINGS[audioKey];
  const baseKey = resolveMorningTalkReplayBaseKey(audioKey);
  const baseStarts = baseKey ? MORNING_TALK_LINE_TIMINGS[baseKey] : null;
  if (!baseStarts) return MORNING_TALK_LINE_TIMINGS[audioKey];
  const shifted = baseStarts.map(t => t + offset);
  if (MORNING_TALK_REPLAY_SKIP_FIRST_LINE.has(audioKey) && shifted.length > 1) {
    shifted[0] = shifted[1];
  }
  return shifted;
}

const FT_MOUTH_FRAMES = {
  joel: [
    'illustrations/joel/joel_mouth_closed.png',
    'illustrations/joel/joel_mouth_open1.png',
    'illustrations/joel/joel_mouth_open2.png',
  ],
  mai: [
    'illustrations/mai/mai_mouth_closed.png',
    'illustrations/mai/mai_mouth_open1.png',
    'illustrations/mai/mai_mouth_open2.png',
  ],
};

function resolveMorningTalkWeekKey(date) {
  const w1Start = new Date(MORNING_TALK_WEEK_STARTS.w1 + 'T00:00:00');
  const daysSince = Math.floor((date - w1Start) / 86400000);
  let idx = Math.floor(daysSince / 7);
  if (idx < 0) idx = 0;
  if (idx > MORNING_TALK_WEEK_ORDER.length - 1) idx = MORNING_TALK_WEEK_ORDER.length - 1;
  return MORNING_TALK_WEEK_ORDER[idx];
}

const FAMILY_PREVIEW_PARAM = (typeof window !== 'undefined' && window.location)
  ? new URLSearchParams(window.location.search).get('familypreview')
  : null;
const FAMILY_PREVIEW = !!FAMILY_PREVIEW_PARAM;

const FT_DEBUG = (typeof window !== 'undefined' && window.location)
  ? new URLSearchParams(window.location.search).get('ftdebug') === '1'
  : false;

function parseFamilyPreviewKey(param) {
  if (!param) return null;
  if (param === '1') return { weekKey: 'w1', dayKey: 'mon' };
  const m = /^(w[1-4])_(mon|tue|wed|thu|fri)$/.exec(param);
  if (!m) return null;
  const weekKey = m[1], dayKey = m[2];
  if (!MORNING_TALK_WEEKS[weekKey] || !MORNING_TALK_WEEKS[weekKey].days[dayKey]) return null;
  return { weekKey, dayKey };
}

let ftArchiveOverride = null;
const MORNING_TALK_DAY_OFFSET = { mon: 0, tue: 1, wed: 2, thu: 3, fri: 4 };
function dateForMorningTalkDay(weekKey, dayKey) {
  const w1Start = new Date(MORNING_TALK_WEEK_STARTS.w1 + 'T00:00:00');
  const weekIdx = Math.max(0, MORNING_TALK_WEEK_ORDER.indexOf(weekKey));
  const daysSinceStart = weekIdx * 7 + (MORNING_TALK_DAY_OFFSET[dayKey] || 0);
  return new Date(w1Start.getTime() + daysSinceStart * 86400000);
}

function getTodayMorningTalkInfo() {
  const now = new Date();
  if (ftArchiveOverride) {
    const { weekKey, dayKey } = ftArchiveOverride;
    const content = MORNING_TALK_WEEKS[weekKey].days[dayKey];
    const audioKey = `${MORNING_TALK_MONTH}_${weekKey}_${dayKey}`;
    return {
      now: dateForMorningTalkDay(weekKey, dayKey), dayKey, weekKey,
      isNew: false, isWeekend: false, isPreLaunch: false, content, audioKey, isArchive: true,
    };
  }
  if (FAMILY_PREVIEW) {
    const parsed = parseFamilyPreviewKey(FAMILY_PREVIEW_PARAM) || { weekKey: 'w1', dayKey: 'mon' };
    const { weekKey, dayKey } = parsed;
    const content = MORNING_TALK_WEEKS[weekKey].days[dayKey];
    const audioKey = `${MORNING_TALK_MONTH}_${weekKey}_${dayKey}`;
    const isNew = NEW_DAY_KEYS.includes(dayKey);
    return { now, dayKey, weekKey, isNew, isWeekend: false, isPreLaunch: false, content, audioKey };
  }
  const dayKey = DAY_KEY_BY_INDEX[now.getDay()];
  const weekKey = resolveMorningTalkWeekKey(now);
  const isWeekend = (dayKey === 'sat' || dayKey === 'sun');
  const contentDayKey = isWeekend ? 'fri' : dayKey;
  const isNew = NEW_DAY_KEYS.includes(dayKey);
  const content = MORNING_TALK_WEEKS[weekKey].days[contentDayKey];
  const audioKey = `${MORNING_TALK_MONTH}_${weekKey}_${contentDayKey}`;
  const w1Start = new Date(MORNING_TALK_WEEK_STARTS.w1 + 'T00:00:00');
  const isPreLaunch = now < w1Start;
  return { now, dayKey, weekKey, isNew, isWeekend, isPreLaunch, content, audioKey };
}

function renderMorningTalkContent() {
  const info = getTodayMorningTalkInfo();
  setTalkDateHead('ft', info.now, info.dayKey, info.isPreLaunch ? '配信準備中' : `"${info.content.title}"`);

  const backBtn = document.getElementById('ftArchiveBackBtn');
  if (backBtn) backBtn.style.display = info.isArchive ? 'flex' : 'none';

  const tag = document.getElementById('ftStatusTag');
  const note = document.getElementById('ftReplayNote');

  if (info.isPreLaunch) {
    tag.textContent = '近日公開';
    tag.className = 'ft-status-tag replay';
    note.textContent = '配信は8月中旬スタート予定です';
    note.style.display = 'block';
    document.getElementById('ftQuestion').textContent = 'Coming soon!';
    document.getElementById('ftQuestionJa').textContent = 'もうすぐ配信スタート';
    document.getElementById('ftPlayTitle').textContent = '配信準備中';
    const body = document.getElementById('ftPhrasesBody');
    if (body) body.innerHTML = '';
    ftCurrentPhrases = [];
    ftPhraseTimings = [];
    return null;
  }

  if (info.isArchive) {
    tag.textContent = 'アーカイブ再生中';
    tag.className = 'ft-status-tag replay';
    note.textContent = `${DAY_LABEL_JA[info.dayKey]}曜日の放送をもう一度お届け中`;
    note.style.display = 'block';
  } else if (info.isNew) {
    tag.textContent = 'NEW';
    tag.className = 'ft-status-tag new';
    note.style.display = 'none';
  } else {
    tag.className = 'ft-status-tag replay';
    if (info.isWeekend) {
      tag.textContent = '今週の再放送';
      note.textContent = '金曜日の回をもう一度お届け中';
    } else {
      tag.textContent = 'Maiのひとこと';
      note.textContent = '会話パートは直近の回を再利用、Maiの新しい解説つき';
    }
    note.style.display = 'block';
  }

  const c = info.content;
  document.getElementById('ftQuestion').textContent = `"${c.title}"`;
  document.getElementById('ftQuestionJa').textContent = c.phrases.map(p => p.ja).join(' / ');
  document.getElementById('ftPlayTitle').textContent = `${DAY_LABEL_JA[info.dayKey]} · ${c.title}`;

  const lines = c.rawScript ? parseMorningTalkScript(c.rawScript)
    : c.phrases.map(p => ({ speaker: null, en: p.en, ja: p.ja }));

  const body = document.getElementById('ftPhrasesBody');
  if (body) {
    const rowsHtml = lines.map((l, i) => {
      const speakerTag = l.speaker
        ? `<span class="ft-phrase-speaker ${l.speaker}">${l.speaker === 'joel' ? 'Jay' : 'Mai'}</span>` : '';
      const jaSpan = l.ja ? `<span class="ft-phrase-ja">${l.ja}</span>` : '';
      return `<div class="ft-phrase-row" id="ftPhraseRow${i}">${speakerTag}<span class="ft-phrase-en">"${l.en}"</span>${jaSpan}</div>`;
    }).join('');
    const maiTalkHtml = c.maiTalk
      ? `<div class="ft-maitalk" id="ftMaiTalk"><div class="ft-maitalk-label">💬 Maiのひとこと解説</div>${c.maiTalk}</div>`
      : `<div class="ft-maitalk" id="ftMaiTalk" style="display:none;"></div>`;
    body.innerHTML = rowsHtml + maiTalkHtml;
  }
  ftCurrentPhrases = lines;
  ftCurrentTalkDuration = c.talkDuration || null;
  ftPhraseTimings = [];

  return info.audioKey;
}

function parseMorningTalkScript(raw) {
  if (!raw) return [];
  return raw.split('\n')
    .map(l => l.trim())
    .map(l => /^(Joel|Jay|Mai)\s*[:：]\s*(.+)$/.exec(l))
    .filter(Boolean)
    .map(m => {
      const speakerRaw = m[1].toLowerCase();
      const speaker = speakerRaw === 'jay' ? 'joel' : speakerRaw;
      const rest = m[2].trim();
      const pipeIdx = rest.indexOf('|');
      if (pipeIdx === -1) return { speaker, en: rest, ja: null };
      return { speaker, en: rest.slice(0, pipeIdx).trim(), ja: rest.slice(pipeIdx + 1).trim() };
    });
}

// ========================
// Morning Talk カラオケハイライト
// ========================
let ftCurrentPhrases = [];
let ftCurrentTalkDuration = null;
let ftPhraseTimings = [];
const FT_MIN_PHRASE_SEC = 1.6;
const FT_CHARS_PER_SEC = 9;

function computeFtPhraseTimings(phrases, totalDuration) {
  if (!phrases || !phrases.length || !totalDuration || !isFinite(totalDuration)) return [];
  const rawDurations = phrases.map(p => Math.max(FT_MIN_PHRASE_SEC, (p.en || '').length / FT_CHARS_PER_SEC));
  const rawTotal = rawDurations.reduce((a, b) => a + b, 0);
  const scale = rawTotal ? totalDuration / rawTotal : 1;
  let acc = 0;
  return rawDurations.map(d => {
    const scaled = d * scale;
    const seg = { start: acc, end: acc + scaled };
    acc += scaled;
    return seg;
  });
}

function buildFtLineSegmentsFromStarts(starts, totalDuration, phrases) {
  return starts.map((s, i) => {
    if (i < starts.length - 1) return { start: s, end: starts[i + 1] };
    const lastText = (phrases && phrases[i] && phrases[i].en) || '';
    const estimated = Math.max(FT_MIN_PHRASE_SEC, lastText.length / FT_CHARS_PER_SEC);
    const end = isFinite(totalDuration) && totalDuration > s ? Math.min(totalDuration, s + estimated) : s + estimated;
    return { start: s, end };
  });
}

function resolveFtPhraseTimings(audioKey, phrases, totalDuration) {
  const starts = resolveMorningTalkLineStarts(audioKey);
  if (starts && starts.length === phrases.length) {
    return buildFtLineSegmentsFromStarts(starts, totalDuration, phrases);
  }
  return computeFtPhraseTimings(phrases, totalDuration);
}

function updateFtPhraseHighlight(t) {
  try {
    if (FT_DEBUG) renderFtDebugOverlay(t);
    if (!ftPhraseTimings.length) { setFtActiveSpeaker(null); updateFtBubble(null, null); return; }
    let activeIdx = -1;
    for (let i = 0; i < ftPhraseTimings.length; i++) {
      if (t >= ftPhraseTimings[i].start && t < ftPhraseTimings[i].end) { activeIdx = i; break; }
    }
    ftPhraseTimings.forEach((_, i) => {
      const row = document.getElementById('ftPhraseRow' + i);
      if (!row) return;
      row.classList.remove('active', 'done');
      if (activeIdx === -1 || i < activeIdx) row.classList.add('done');
      else if (i === activeIdx) row.classList.add('active');
    });
    const activeLine = activeIdx !== -1 ? ftCurrentPhrases[activeIdx] : null;
    const speaker = activeLine ? activeLine.speaker : null;
    setFtActiveSpeaker(speaker);
    updateFtBubble(activeLine, speaker);
  } catch (e) {
    if (FT_DEBUG) {
      const el = document.getElementById('ftDebugOverlay');
      if (el) el.textContent = 'updateFtPhraseHighlight ERROR: ' + (e && e.message);
    }
  }
}

function renderFtDebugOverlay(t) {
  const el = document.getElementById('ftDebugOverlay');
  if (!el) return;
  el.style.display = 'block';
  let activeIdx = -1;
  if (ftPhraseTimings.length) {
    for (let i = 0; i < ftPhraseTimings.length; i++) {
      if (t >= ftPhraseTimings[i].start && t < ftPhraseTimings[i].end) { activeIdx = i; break; }
    }
  }
  const lines = [
    `currentTime: ${t.toFixed(2)}s / duration: ${(ftAudioEl.duration || 0).toFixed(2)}s`,
    `ftCurrentPhrases.length: ${ftCurrentPhrases.length} / ftPhraseTimings.length: ${ftPhraseTimings.length}`,
    `activeIdx: ${activeIdx}`,
    ftPhraseTimings[activeIdx] ? `active row range: ${ftPhraseTimings[activeIdx].start.toFixed(2)} - ${ftPhraseTimings[activeIdx].end.toFixed(2)}` : '(該当区間なし＝イントロ中 or 終了後)',
  ];
  el.textContent = lines.join('\n');
}

function clearFtPhraseHighlight() {
  ftPhraseTimings.forEach((_, i) => {
    const row = document.getElementById('ftPhraseRow' + i);
    if (row) row.classList.remove('active', 'done');
  });
  setFtActiveSpeaker(null);
  updateFtBubble(null, null);
}

function updateFtBubble(line, speaker) {
  const bubble = document.getElementById('ftBubble');
  const enEl = document.getElementById('ftBubbleEn');
  const jaEl = document.getElementById('ftBubbleJa');
  if (!bubble || !enEl || !jaEl) return;
  if (!line || !speaker) {
    bubble.classList.remove('show');
    return;
  }
  enEl.textContent = `"${line.en}"`;
  if (line.ja) {
    jaEl.textContent = line.ja;
    jaEl.style.display = '';
  } else {
    jaEl.textContent = '';
    jaEl.style.display = 'none';
  }
  bubble.classList.toggle('from-mai', speaker === 'mai');
  bubble.classList.remove('compact', 'compact2');
  const totalLen = (line.en || '').length + (line.ja || '').length;
  if (totalLen > 70) bubble.classList.add('compact2');
  else if (totalLen > 45) bubble.classList.add('compact');
  bubble.classList.add('show');
}

// ========================
// Jay/Mai 口パクアバター
// ========================
let ftActiveSpeaker = null;
let ftMouthTimer = null;
let ftMouthCycleIdx = 0;
const FT_MOUTH_CYCLE = [0, 1, 0, 2];

function setFtMouthFrame(speaker, frameIdx) {
  const frames = FT_MOUTH_FRAMES[speaker];
  if (!frames) return;
  const img = document.getElementById(speaker === 'joel' ? 'ftAvatarJoelImg' : 'ftAvatarMaiImg');
  if (img) img.src = frames[frameIdx] || frames[0];
}

function setFtActiveSpeaker(speaker) {
  if (speaker !== 'joel' && speaker !== 'mai') speaker = null;
  if (speaker === ftActiveSpeaker) return;
  ['joel', 'mai'].forEach(s => {
    const avatarEl = document.getElementById(s === 'joel' ? 'ftAvatarJoel' : 'ftAvatarMai');
    if (avatarEl) avatarEl.classList.toggle('speaking', s === speaker);
    if (s !== speaker) setFtMouthFrame(s, 0);
  });
  ftActiveSpeaker = speaker;
  ftMouthCycleIdx = 0;
  if (speaker) setFtMouthFrame(speaker, FT_MOUTH_CYCLE[0]);
}

function startFtMouthLoop() {
  stopFtMouthLoop();
  ftMouthTimer = setInterval(() => {
    if (!ftActiveSpeaker) return;
    ftMouthCycleIdx = (ftMouthCycleIdx + 1) % FT_MOUTH_CYCLE.length;
    setFtMouthFrame(ftActiveSpeaker, FT_MOUTH_CYCLE[ftMouthCycleIdx]);
  }, 220);
}

function stopFtMouthLoop() {
  if (ftMouthTimer) { clearInterval(ftMouthTimer); ftMouthTimer = null; }
}

let ftPhrasesManualToggle = false;
function openFtPhrasesAuto() {
  if (ftPhrasesManualToggle) return;
  const b = document.getElementById('ftPhrasesBody');
  const c = document.getElementById('ftPhrasesChevron');
  if (!b || !c) return;
  b.classList.add('open');
  c.classList.add('open');
}

let ftCurrentAudioKey = null;

const ftAudioEl = new Audio();
registerAudio(ftAudioEl);
let ftAudioLoaded = false;
let ftTrackedPlayKey = null;
ftAudioEl.addEventListener('play', () => {
  if (ftTrackedPlayKey === ftCurrentAudioKey) return;
  ftTrackedPlayKey = ftCurrentAudioKey;
  trackEvent('morning_talk_play', ftCurrentAudioKey || '');
});

function fmtFtTime(sec) {
  if (!isFinite(sec) || sec < 0) sec = 0;
  const s = Math.floor(sec);
  return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0');
}

function initFtAudio() {
  ftCurrentAudioKey = renderMorningTalkContent();
  const src = MORNING_TALK_AUDIO[ftCurrentAudioKey];
  const playBtn = document.getElementById('ftPlayBtn');
  if (!src) {
    if (playBtn) { playBtn.disabled = true; playBtn.style.opacity = '0.4'; }
    const lenEl = document.getElementById('ftPlayLen');
    if (lenEl) lenEl.textContent = '収録準備中';
    return;
  }
  if (playBtn) { playBtn.disabled = false; playBtn.style.opacity = ''; }
  ftAudioEl.src = src;
  ftAudioEl.addEventListener('loadedmetadata', () => {
    ftAudioLoaded = true;
    const lenEl = document.getElementById('ftPlayLen');
    if (lenEl) lenEl.textContent = fmtFtTime(ftAudioEl.duration);
    ftPhraseTimings = resolveFtPhraseTimings(ftCurrentAudioKey, ftCurrentPhrases, ftCurrentTalkDuration || ftAudioEl.duration);
  });
  ftAudioEl.addEventListener('durationchange', () => {
    if (!isFinite(ftAudioEl.duration)) return;
    const lenEl = document.getElementById('ftPlayLen');
    if (lenEl) lenEl.textContent = fmtFtTime(ftAudioEl.duration);
    ftPhraseTimings = resolveFtPhraseTimings(ftCurrentAudioKey, ftCurrentPhrases, ftCurrentTalkDuration || ftAudioEl.duration);
  });
  ftAudioEl.addEventListener('timeupdate', () => {
    if (!ftAudioEl.duration) return;
    ftProg = (ftAudioEl.currentTime / ftAudioEl.duration) * 100;
    document.getElementById('ftFill').style.width = ftProg.toFixed(1) + '%';
    updateFtWaveProgress(ftProg);
    document.getElementById('ftTime').textContent = fmtFtTime(ftAudioEl.currentTime);
    updateFtPhraseHighlight(ftAudioEl.currentTime);
  });
  ftAudioEl.addEventListener('ended', () => {
    ftPlaying = false;
    setFtWavePlaying(false);
    document.getElementById('ftPlayIcon').textContent = '▶';
    clearFtPhraseHighlight();
    stopFtMouthLoop();
    bumpLifetimeStat('morningTalkPlays');
    showFtAutoNext();
  });
  ftAudioEl.addEventListener('error', () => {
    ftPlaying = false;
    setFtWavePlaying(false);
    const icon = document.getElementById('ftPlayIcon');
    if (icon) icon.textContent = '▶';
    showToast('音声の読み込みに失敗しました');
  });
}

function renderFtWave() {
  const wave = document.getElementById('ftWave');
  if (!wave) return;
  let bars = '';
  for (let i = 0; i < 40; i++) {
    const h = 6 + Math.round(Math.sin(i * 0.7) * 6 + Math.random() * 10);
    const delay = (Math.random() * 0.9).toFixed(2);
    bars += `<div class="ft-wave-bar" style="height:${Math.max(4, h)}px; animation-delay:${delay}s;"></div>`;
  }
  wave.innerHTML = bars;
}

function updateFtWaveProgress(pct) {
  const wave = document.getElementById('ftWave');
  if (!wave) return;
  const bars = wave.querySelectorAll('.ft-wave-bar');
  const playedCount = Math.round((pct / 100) * bars.length);
  bars.forEach((bar, i) => bar.classList.toggle('played', i < playedCount));
}

function setFtWavePlaying(isPlaying) {
  const wave = document.getElementById('ftWave');
  if (wave) wave.classList.toggle('is-playing', isPlaying);
}

function toggleFamilyTalk() {
  if (!MORNING_TALK_AUDIO[ftCurrentAudioKey]) return;
  activeMode = 'familytalk';
  ftPlaying = !ftPlaying;
  const icon = document.getElementById('ftPlayIcon');
  setFtWavePlaying(ftPlaying);
  if (ftPlaying) {
    icon.textContent = '⏸';
    openFtPhrasesAuto();
    startFtMouthLoop();
    const p = ftAudioEl.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        ftPlaying = false;
        icon.textContent = '▶';
        setFtWavePlaying(false);
        stopFtMouthLoop();
        showToast('再生できませんでした');
      });
    }
  } else {
    icon.textContent = '▶';
    ftAudioEl.pause();
    stopFtMouthLoop();
  }
}
function showFtAutoNext() {
  const el = document.getElementById('ftAutoNext');
  if (!el) return;
  el.classList.add('show');
  showToast('🎵 そのまま朝の音楽に切り替わります');
}
function stopFtAutoNext() {
  const el = document.getElementById('ftAutoNext');
  if (!el) return;
  el.classList.remove('show');
}
function seekFamilyTalk(e) {
  if (!MORNING_TALK_AUDIO[ftCurrentAudioKey] || !ftAudioEl.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
  ftAudioEl.currentTime = (pct / 100) * ftAudioEl.duration;
  ftProg = pct;
  document.getElementById('ftFill').style.width = ftProg + '%';
  updateFtWaveProgress(ftProg);
}
function toggleFtPhrases() {
  ftPhrasesManualToggle = true;
  const b = document.getElementById('ftPhrasesBody'); const c = document.getElementById('ftPhrasesChevron');
  const o = b.classList.toggle('open'); c.classList.toggle('open', o);
}

// ========================
// 放送アーカイブ（これまでの放送）
// ========================
function getAiredMorningTalkDays() {
  const order = ['mon', 'tue', 'wed', 'thu', 'fri'];
  let weekKey, previewUptoIdx = null;
  if (FAMILY_PREVIEW) {
    const parsed = parseFamilyPreviewKey(FAMILY_PREVIEW_PARAM) || { weekKey: 'w1', dayKey: 'mon' };
    weekKey = parsed.weekKey;
    previewUptoIdx = order.indexOf(parsed.dayKey);
  } else {
    const now = new Date();
    const w1Start = new Date(MORNING_TALK_WEEK_STARTS.w1 + 'T00:00:00');
    if (now < w1Start) return [];
    weekKey = resolveMorningTalkWeekKey(now);
  }
  const now = new Date();
  const days = [];
  order.forEach((dayKey, idx) => {
    if (previewUptoIdx !== null && idx > previewUptoIdx) return;
    const audioKey = `${MORNING_TALK_MONTH}_${weekKey}_${dayKey}`;
    const dayDate = dateForMorningTalkDay(weekKey, dayKey);
    if (previewUptoIdx === null && dayDate > now) return;
    if (MORNING_TALK_AUDIO[audioKey] && MORNING_TALK_WEEKS[weekKey].days[dayKey]) {
      days.push({ weekKey, dayKey, content: MORNING_TALK_WEEKS[weekKey].days[dayKey], date: dayDate });
    }
  });
  return days.reverse();
}

function renderArchiveModalBody() {
  const body = document.getElementById('archiveBody');
  if (!body) return;
  const days = getAiredMorningTalkDays();
  if (!days.length) {
    body.innerHTML = `<div class="archive-empty">まだ配信された放送がありません</div>`;
    return;
  }
  const theme = MORNING_TALK_WEEKS[days[0].weekKey].theme || '';
  const rowsHtml = days.map(d => `
    <div class="archive-ep-row" onclick="playArchivedMorningTalk('${d.weekKey}','${d.dayKey}')">
      <div class="archive-ep-date">${DAY_LABEL_JA[d.dayKey]}</div>
      <div class="archive-ep-q">${d.content.title}</div>
      <div class="archive-ep-play">▶</div>
    </div>
  `).join('');
  body.innerHTML = `
    <div class="archive-section-label"><span>すべての放送</span><div class="archive-section-line"></div></div>
    <div class="archive-month-group">
      <div class="archive-month-title">${theme}</div>
      ${rowsHtml}
    </div>
  `;
}

function openArchiveModal() {
  renderArchiveModalBody();
  document.getElementById('archiveModal').classList.add('open');
}
function closeArchiveModal() {
  document.getElementById('archiveModal').classList.remove('open');
}

function playArchivedMorningTalk(weekKey, dayKey) {
  const audioKey = `${MORNING_TALK_MONTH}_${weekKey}_${dayKey}`;
  if (!MORNING_TALK_AUDIO[audioKey]) return;
  if (ftPlaying) {
    ftAudioEl.pause();
    ftPlaying = false;
    stopFtMouthLoop();
    setFtWavePlaying(false);
  }
  ftArchiveOverride = { weekKey, dayKey };
  ftCurrentAudioKey = renderMorningTalkContent();
  ftAudioEl.src = MORNING_TALK_AUDIO[ftCurrentAudioKey];
  ftAudioEl.currentTime = 0;
  ftProg = 0;
  document.getElementById('ftFill').style.width = '0%';
  document.getElementById('ftTime').textContent = '0:00';
  clearFtPhraseHighlight();
  const playBtn = document.getElementById('ftPlayBtn');
  if (playBtn) { playBtn.disabled = false; playBtn.style.opacity = ''; }
  closeArchiveModal();
  toggleFamilyTalk();
  const wrapEl = document.getElementById('ftWrap');
  if (wrapEl && typeof wrapEl.scrollIntoView === 'function') {
    wrapEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }
}

function returnToTodayMorningTalk() {
  if (ftPlaying) {
    ftAudioEl.pause();
    ftPlaying = false;
    const icon = document.getElementById('ftPlayIcon');
    if (icon) icon.textContent = '▶';
    setFtWavePlaying(false);
    stopFtMouthLoop();
  }
  ftArchiveOverride = null;
  ftCurrentAudioKey = renderMorningTalkContent();
  const src = MORNING_TALK_AUDIO[ftCurrentAudioKey];
  const playBtn = document.getElementById('ftPlayBtn');
  if (src) {
    ftAudioEl.src = src;
    if (playBtn) { playBtn.disabled = false; playBtn.style.opacity = ''; }
  } else if (playBtn) {
    playBtn.disabled = true; playBtn.style.opacity = '0.4';
  }
  ftAudioEl.currentTime = 0;
  ftProg = 0;
  document.getElementById('ftFill').style.width = '0%';
  document.getElementById('ftTime').textContent = '0:00';
  clearFtPhraseHighlight();
}

renderFtWave();
initFtAudio();

// ========================
// Evening Talk（帰宅後の一言＋Did you know?）
// ========================
const EVENING_TALK_WEEKS = {
  w1: {
    theme: 'プール・暑い日',
    days: {
      mon: {
        title: "How was your day?",
        phrases: [{ en: "How was your day?", ja: "今日どうだった？" }, { en: "It was fun!", ja: "楽しかった！" }],
        rawScript: `
Mai: Hey Joel! You're home! How was your day? | ねえJoel！おかえり！今日どうだった？
Joel: It was great! I went swimming! | 最高だったよ！泳ぎに行ったんだ！
Mai: Wow! That's perfect on a hot day like this. | わあ！こんな暑い日にはぴったりだね。
Joel: Yeah. It was a splashy, swimmy kind of day. | うん。水しぶきと水泳の一日だったよ。
Mai: That's so silly. Was it fun? | もう、おかしいなあ。楽しかった？
Joel: It was fun! Let's say it together. It was fun! | 楽しかったよ！一緒に言ってみよう。It was fun！
Joel: So Mai, what did you do today? | それでMai、今日は何したの？
Mai: I went to the park! | 公園に行ったよ！
Joel: How was it? | どうだった？
Mai: It was tooooo hot. Even the ducks looked tired. It was not fun. | 暑すぎたよ〜。アヒルたちも疲れてるみたいだった。楽しくなかったよ。
Joel: Let's say it together. It was not fun! | 一緒に言ってみよう。It was not fun！
Joel: But hey Mai, did you know... a duck's feathers never get wet? Isn't that cool? | でもねMai、知ってた？アヒルの羽根って濡れないんだよ？すごくない？
Mai: That's amazing! I didn't know that. | それはすごい！知らなかったよ。
Joel: Let's learn more about ducks tomorrow! Quack quack | 明日はもっとアヒルのこと学ぼうね！クワックワッ
Mai: That's so silly. | もう、おかしいなあ。
Joel: OK. Time to say goodbye. Have a great night! | よし。そろそろバイバイの時間だね。良い夜を！
Mai: Bye bye! | バイバイ！
        `,
        talkDuration: 65,
        maiTalk: '今日の会話でJoelが "It was fun!" って言ってたよね。逆にMaiは公園が暑すぎて "It was not fun." って答えてた——同じ"It was..."の形で、楽しかった/楽しくなかったが言えちゃうんだよね。<br><br>あと、アヒルの<strong>feathers</strong>(羽根)って単語も出てきたよ。覚えてる？さっきの"アヒルの羽根は濡れない"って話、面白かったよね。みんなはアヒルのおもちゃ持ってる？Duckのおもちゃを見つけたら、パパやママに"Look! a duck!"って言ってみてね。<br><br>お母さん、お父さん今日も1日お疲れ様です。寝る前に"It was fun!"か"It was not fun."だけ真似してみてください。例えば、『今日は幼稚園楽しかった？ダックのお話面白かった？』てお子さんに聞いて『うん』って答えたら『It was fun』だね！とか伝えてみたら、それだけで十分お子様の耳に英語が届いています。',
      },
    }
  },
  w2: {
    theme: 'ビーチ・雨の日',
    days: {
      mon: {
        title: "What a great day!",
        phrases: [{ en: "I saw a turtle!", ja: "カメを見たよ！" }],
        rawScript: `
Joel: Phew. What a great day at the beach! | ふう。海で最高の一日だったね！
Mai: It was so fun! | すごく楽しかった！
Joel: I know. We went swimming and made a sandcastle. I like swimming in the ocean. | だよね。泳いで、砂のお城も作ったね。海で泳ぐの好きなんだ。
Mai: Me too! Did you see any fish? | 私も！魚見た？
Joel: Yes, I saw so many fish. | うん、たくさん魚を見たよ。
Mai: Wow that's great. | わあ、すごいね。
Joel: And I saw a turtle! | それにカメも見たよ！
Mai: Amazing! | すごい！
Joel: Let's say it together. I saw a turtle. | 一緒に言ってみよう。I saw a turtle。
Joel: Turtles are really great swimmers. | カメって泳ぐの本当に上手なんだよ。
Mai: I wish I could swim like a turtle. | カメみたいに泳げたらいいのに。
Joel: Me too. I wish I could fly like a bird! | 僕も。鳥みたいに飛べたらいいな！
Mai: That would be so cool! | それすごくかっこいいね！
Joel: Hey, what should we do tomorrow? | ねえ、明日は何しようか？
Mai: I think it will rain tomorrow. Maybe we should go to the beach again! | 明日は雨が降ると思う。また海に行こうか！
Joel: No way! It's not fun to go to the beach on a rainy day. Let's say it together. It's not fun! | え〜！雨の日に海に行っても楽しくないよ。一緒に言ってみよう。It's not fun!
Mai: I'm tired. It's time for bed. | 疲れたな。もう寝る時間だね。
Mai: Goodnight! | おやすみ！
        `,
        maiTalk: null,
      },
    }
  },
};

const EVENING_TALK_MONTH = 'aug';
const EVENING_TALK_AUDIO = {
  aug_w1_mon: 'evening_talk/ev_aug_w1_mon.mp3',
  aug_w1_tue: 'evening_talk/ev_aug_w1_tue.mp3',
};

const EVENING_TALK_LINE_TIMINGS = {
  aug_w1_mon: [1.974, 5.664, 9.580, 14.325, 19.385, 22.348, 32.665, 36.255, 38.563, 40.332, 49.106, 58.882, 69.412, 73.554, 79.001],
};

const EVENING_TALK_REPLAY_OFFSET = {
  aug_w1_tue: 34,
};

function resolveEveningTalkReplayBaseKey(audioKey) {
  const m = /^(.+_w\d)_(tue|thu)$/.exec(audioKey);
  if (!m) return null;
  const baseDayKey = m[2] === 'tue' ? 'mon' : 'wed';
  return `${m[1]}_${baseDayKey}`;
}

function resolveEveningTalkLineStarts(audioKey) {
  const offset = EVENING_TALK_REPLAY_OFFSET[audioKey];
  if (offset == null) return EVENING_TALK_LINE_TIMINGS[audioKey];
  const baseKey = resolveEveningTalkReplayBaseKey(audioKey);
  const baseStarts = baseKey ? EVENING_TALK_LINE_TIMINGS[baseKey] : null;
  if (!baseStarts) return EVENING_TALK_LINE_TIMINGS[audioKey];
  return baseStarts.map(t => t + offset);
}

function resolveEtPhraseTimings(audioKey, phrases, totalDuration) {
  const starts = resolveEveningTalkLineStarts(audioKey);
  if (starts && starts.length > 0 && starts.length <= phrases.length) {
    return buildFtLineSegmentsFromStarts(starts, totalDuration, phrases.slice(0, starts.length));
  }
  return computeFtPhraseTimings(phrases, totalDuration);
}

function getTodayEveningTalkInfo() {
  const now = new Date();
  if (FAMILY_PREVIEW) {
    const parsed = parseFamilyPreviewKey(FAMILY_PREVIEW_PARAM) || { weekKey: 'w1', dayKey: 'mon' };
    const { weekKey, dayKey } = parsed;
    const weekData = EVENING_TALK_WEEKS[weekKey];
    const content = (weekData && weekData.days[dayKey]) ? weekData.days[dayKey] : null;
    const audioKey = content ? `${EVENING_TALK_MONTH}_${weekKey}_${dayKey}` : null;
    const isNew = NEW_DAY_KEYS.includes(dayKey);
    return { now, dayKey, weekKey, isNew, isWeekend: false, isPreLaunch: false, content, audioKey };
  }
  const dayKey = DAY_KEY_BY_INDEX[now.getDay()];
  const weekKey = resolveMorningTalkWeekKey(now);
  const isWeekend = (dayKey === 'sat' || dayKey === 'sun');
  const contentDayKey = isWeekend ? 'fri' : dayKey;
  const isNew = NEW_DAY_KEYS.includes(dayKey);
  const weekData = EVENING_TALK_WEEKS[weekKey];
  const content = (weekData && weekData.days[contentDayKey]) ? weekData.days[contentDayKey] : null;
  const audioKey = content ? `${EVENING_TALK_MONTH}_${weekKey}_${contentDayKey}` : null;
  const w1Start = new Date(MORNING_TALK_WEEK_STARTS.w1 + 'T00:00:00');
  const isPreLaunch = now < w1Start;
  return { now, dayKey, weekKey, isNew, isWeekend, isPreLaunch, content, audioKey };
}

function renderEveningTalkContent() {
  const info = getTodayEveningTalkInfo();
  setTalkDateHead('et', info.now, info.dayKey, (info.isPreLaunch || !info.content) ? '配信準備中' : `"${info.content.title}"`);

  const tag = document.getElementById('etStatusTag');
  const note = document.getElementById('etReplayNote');

  if (info.isPreLaunch || !info.content) {
    if (tag) { tag.textContent = info.isPreLaunch ? '近日公開' : '準備中'; tag.className = 'ft-status-tag replay'; }
    if (note) {
      note.textContent = info.isPreLaunch ? '配信は8月中旬スタート予定です' : 'この曜日の回は準備中です';
      note.style.display = 'block';
    }
    const q = document.getElementById('etQuestion'); if (q) q.textContent = 'Coming soon!';
    const qj = document.getElementById('etQuestionJa'); if (qj) qj.textContent = 'もうすぐ配信スタート';
    const pt = document.getElementById('etPlayTitle'); if (pt) pt.textContent = '配信準備中';
    const body = document.getElementById('etPhrasesBody'); if (body) body.innerHTML = '';
    etCurrentPhrases = [];
    etPhraseTimings = [];
    return null;
  }

  if (info.isNew) {
    tag.textContent = 'NEW'; tag.className = 'ft-status-tag new'; note.style.display = 'none';
  } else {
    tag.className = 'ft-status-tag replay';
    if (info.isWeekend) { tag.textContent = '今週の再放送'; note.textContent = '金曜日の回をもう一度お届け中'; }
    else { tag.textContent = 'Maiのひとこと'; note.textContent = '会話パートは直近の回を再利用、Maiの新しい解説つき'; }
    note.style.display = 'block';
  }

  const c = info.content;
  document.getElementById('etQuestion').textContent = `"${c.title}"`;
  document.getElementById('etQuestionJa').textContent = c.phrases.map(p => p.ja).join(' / ');
  document.getElementById('etPlayTitle').textContent = `${DAY_LABEL_JA[info.dayKey]} · ${c.title}`;

  const lines = c.rawScript ? parseMorningTalkScript(c.rawScript)
    : c.phrases.map(p => ({ speaker: null, en: p.en, ja: p.ja }));

  const body = document.getElementById('etPhrasesBody');
  if (body) {
    const rowsHtml = lines.map((l, i) => {
      const speakerTag = l.speaker
        ? `<span class="ft-phrase-speaker ${l.speaker}">${l.speaker === 'joel' ? 'Jay' : 'Mai'}</span>` : '';
      const jaSpan = l.ja ? `<span class="ft-phrase-ja">${l.ja}</span>` : '';
      return `<div class="ft-phrase-row" id="etPhraseRow${i}">${speakerTag}<span class="ft-phrase-en">"${l.en}"</span>${jaSpan}</div>`;
    }).join('');
    const maiTalkHtml = c.maiTalk
      ? `<div class="ft-maitalk" id="etMaiTalk"><div class="ft-maitalk-label">💬 Maiのひとこと解説</div>${c.maiTalk}</div>`
      : `<div class="ft-maitalk" id="etMaiTalk" style="display:none;"></div>`;
    body.innerHTML = rowsHtml + maiTalkHtml;
  }
  etCurrentPhrases = lines;
  etCurrentTalkDuration = c.talkDuration || null;
  etPhraseTimings = [];

  return info.audioKey;
}

let etCurrentPhrases = [];
let etCurrentTalkDuration = null;
let etPhraseTimings = [];
let etCurrentAudioKey = null;
let etActiveSpeaker = null;
let etMouthTimer = null;
let etMouthCycleIdx = 0;
let etPlaying = false, etProg = 0;
let etPhrasesManualToggle = false;

function updateEtPhraseHighlight(t) {
  try {
    if (!etPhraseTimings.length) { setEtActiveSpeaker(null); updateEtBubble(null, null); return; }
    let activeIdx = -1;
    for (let i = 0; i < etPhraseTimings.length; i++) {
      if (t < etPhraseTimings[i].end) { activeIdx = i; break; }
    }
    etPhraseTimings.forEach((_, i) => {
      const row = document.getElementById('etPhraseRow' + i);
      if (!row) return;
      row.classList.remove('active', 'done');
      if (activeIdx === -1 || i < activeIdx) row.classList.add('done');
      else if (i === activeIdx) row.classList.add('active');
    });
    const activeLine = activeIdx !== -1 ? etCurrentPhrases[activeIdx] : null;
    const speaker = activeLine ? activeLine.speaker : null;
    setEtActiveSpeaker(speaker);
    updateEtBubble(activeLine, speaker);
  } catch (e) {}
}

function clearEtPhraseHighlight() {
  etPhraseTimings.forEach((_, i) => {
    const row = document.getElementById('etPhraseRow' + i);
    if (row) row.classList.remove('active', 'done');
  });
  setEtActiveSpeaker(null);
  updateEtBubble(null, null);
}

function updateEtBubble(line, speaker) {
  const bubble = document.getElementById('etBubble');
  const enEl = document.getElementById('etBubbleEn');
  const jaEl = document.getElementById('etBubbleJa');
  if (!bubble || !enEl || !jaEl) return;
  if (!line || !speaker) { bubble.classList.remove('show'); return; }
  enEl.textContent = `"${line.en}"`;
  if (line.ja) { jaEl.textContent = line.ja; jaEl.style.display = ''; }
  else { jaEl.textContent = ''; jaEl.style.display = 'none'; }
  bubble.classList.toggle('from-mai', speaker === 'mai');
  bubble.classList.remove('compact', 'compact2');
  const totalLen = (line.en || '').length + (line.ja || '').length;
  if (totalLen > 70) bubble.classList.add('compact2');
  else if (totalLen > 45) bubble.classList.add('compact');
  bubble.classList.add('show');
}

function setEtMouthFrame(speaker, frameIdx) {
  const frames = FT_MOUTH_FRAMES[speaker];
  if (!frames) return;
  const img = document.getElementById(speaker === 'joel' ? 'etAvatarJoelImg' : 'etAvatarMaiImg');
  if (img) img.src = frames[frameIdx] || frames[0];
}

function setEtActiveSpeaker(speaker) {
  if (speaker !== 'joel' && speaker !== 'mai') speaker = null;
  if (speaker === etActiveSpeaker) return;
  ['joel', 'mai'].forEach(s => {
    const avatarEl = document.getElementById(s === 'joel' ? 'etAvatarJoel' : 'etAvatarMai');
    if (avatarEl) avatarEl.classList.toggle('speaking', s === speaker);
    if (s !== speaker) setEtMouthFrame(s, 0);
  });
  etActiveSpeaker = speaker;
  etMouthCycleIdx = 0;
  if (speaker) setEtMouthFrame(speaker, FT_MOUTH_CYCLE[0]);
}

function startEtMouthLoop() {
  stopEtMouthLoop();
  etMouthTimer = setInterval(() => {
    if (!etActiveSpeaker) return;
    etMouthCycleIdx = (etMouthCycleIdx + 1) % FT_MOUTH_CYCLE.length;
    setEtMouthFrame(etActiveSpeaker, FT_MOUTH_CYCLE[etMouthCycleIdx]);
  }, 220);
}
function stopEtMouthLoop() {
  if (etMouthTimer) { clearInterval(etMouthTimer); etMouthTimer = null; }
}

function openEtPhrasesAuto() {
  if (etPhrasesManualToggle) return;
  const b = document.getElementById('etPhrasesBody');
  const c = document.getElementById('etPhrasesChevron');
  if (!b || !c) return;
  b.classList.add('open'); c.classList.add('open');
}

const etAudioEl = new Audio();
registerAudio(etAudioEl);
let etAudioLoaded = false;
let etTrackedPlayKey = null;
etAudioEl.addEventListener('play', () => {
  if (etTrackedPlayKey === etCurrentAudioKey) return;
  etTrackedPlayKey = etCurrentAudioKey;
  trackEvent('evening_talk_play', etCurrentAudioKey || '');
});

function initEtAudio() {
  etCurrentAudioKey = renderEveningTalkContent();
  const src = EVENING_TALK_AUDIO[etCurrentAudioKey];
  const playBtn = document.getElementById('etPlayBtn');
  if (!src) {
    if (playBtn) { playBtn.disabled = true; playBtn.style.opacity = '0.4'; }
    const lenEl = document.getElementById('etPlayLen');
    if (lenEl) lenEl.textContent = '収録準備中';
    return;
  }
  if (playBtn) { playBtn.disabled = false; playBtn.style.opacity = ''; }
  etAudioEl.src = src;
  etAudioEl.addEventListener('loadedmetadata', () => {
    etAudioLoaded = true;
    const lenEl = document.getElementById('etPlayLen');
    if (lenEl) lenEl.textContent = fmtFtTime(etAudioEl.duration);
    etPhraseTimings = resolveEtPhraseTimings(etCurrentAudioKey, etCurrentPhrases, etCurrentTalkDuration || etAudioEl.duration);
  });
  etAudioEl.addEventListener('durationchange', () => {
    if (!isFinite(etAudioEl.duration)) return;
    const lenEl = document.getElementById('etPlayLen');
    if (lenEl) lenEl.textContent = fmtFtTime(etAudioEl.duration);
    etPhraseTimings = resolveEtPhraseTimings(etCurrentAudioKey, etCurrentPhrases, etCurrentTalkDuration || etAudioEl.duration);
  });
  etAudioEl.addEventListener('timeupdate', () => {
    if (!etAudioEl.duration) return;
    etProg = (etAudioEl.currentTime / etAudioEl.duration) * 100;
    const fill = document.getElementById('etFill'); if (fill) fill.style.width = etProg.toFixed(1) + '%';
    updateEtWaveProgress(etProg);
    const timeEl = document.getElementById('etTime'); if (timeEl) timeEl.textContent = fmtFtTime(etAudioEl.currentTime);
    updateEtPhraseHighlight(etAudioEl.currentTime);
  });
  etAudioEl.addEventListener('ended', () => {
    etPlaying = false;
    setEtWavePlaying(false);
    const icon = document.getElementById('etPlayIcon'); if (icon) icon.textContent = '▶';
    clearEtPhraseHighlight();
    stopEtMouthLoop();
    bumpLifetimeStat('eveningTalkPlays');
  });
  etAudioEl.addEventListener('error', () => {
    etPlaying = false;
    setEtWavePlaying(false);
    const icon = document.getElementById('etPlayIcon'); if (icon) icon.textContent = '▶';
    showToast('音声の読み込みに失敗しました');
  });
}

function renderEtWave() {
  const wave = document.getElementById('etWave');
  if (!wave) return;
  let bars = '';
  for (let i = 0; i < 40; i++) {
    const h = 6 + Math.round(Math.sin(i * 0.7) * 6 + Math.random() * 10);
    const delay = (Math.random() * 0.9).toFixed(2);
    bars += `<div class="ft-wave-bar" style="height:${Math.max(4, h)}px; animation-delay:${delay}s;"></div>`;
  }
  wave.innerHTML = bars;
}
function updateEtWaveProgress(pct) {
  const wave = document.getElementById('etWave');
  if (!wave) return;
  const bars = wave.querySelectorAll('.ft-wave-bar');
  const playedCount = Math.round((pct / 100) * bars.length);
  bars.forEach((bar, i) => bar.classList.toggle('played', i < playedCount));
}
function setEtWavePlaying(isPlaying) {
  const wave = document.getElementById('etWave');
  if (wave) wave.classList.toggle('is-playing', isPlaying);
}

function toggleEveningTalk() {
  if (!EVENING_TALK_AUDIO[etCurrentAudioKey]) return;
  activeMode = 'eveningtalk';
  etPlaying = !etPlaying;
  const icon = document.getElementById('etPlayIcon');
  setEtWavePlaying(etPlaying);
  if (etPlaying) {
    icon.textContent = '⏸';
    openEtPhrasesAuto();
    startEtMouthLoop();
    const p = etAudioEl.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => {
        etPlaying = false;
        icon.textContent = '▶';
        setEtWavePlaying(false);
        stopEtMouthLoop();
        showToast('再生できませんでした');
      });
    }
  } else {
    icon.textContent = '▶';
    etAudioEl.pause();
    stopEtMouthLoop();
  }
}

function seekEveningTalk(e) {
  if (!EVENING_TALK_AUDIO[etCurrentAudioKey] || !etAudioEl.duration) return;
  const rect = e.currentTarget.getBoundingClientRect();
  const pct = Math.min(100, Math.max(0, ((e.clientX - rect.left) / rect.width) * 100));
  etAudioEl.currentTime = (pct / 100) * etAudioEl.duration;
  etProg = pct;
  const fill = document.getElementById('etFill'); if (fill) fill.style.width = etProg + '%';
  updateEtWaveProgress(etProg);
}

function toggleEtPhrases() {
  etPhrasesManualToggle = true;
  const b = document.getElementById('etPhrasesBody'); const c = document.getElementById('etPhrasesChevron');
  const o = b.classList.toggle('open'); c.classList.toggle('open', o);
}

renderEtWave();
initEtAudio();
renderJourneyNowPlaying();

// ========================
