// ==============================================================
// app-core.js — 共通基盤 + ホームタブの土台（ジャーニー進行・設定・通知・音声マネージャー等）
// 【読み込み順】必ず1番目： index.htmlで <script src="/app/app-core.js"> を
// app-tabs.js / app-talk-content.js より先に読み込むこと。
// registerAudio() / renderJourneyNowPlaying() 等をこの2ファイルから呼ぶため。
// 【更新頻度】低い。ここはめったに触らない想定。
// ==============================================================

// ========================
// 招待制アクセスゲート：ロック画面フォームの送信ハンドラ
// （判定ロジック本体は<head>のwindow.__enverlyGateに実装済み）
// ========================
function handleGateSubmit() {
  var input = document.getElementById('gateCodeInput');
  var errorEl = document.getElementById('gateErrorMsg');
  var code = input ? input.value : '';
  var ok = window.__enverlyGate && window.__enverlyGate.tryUnlockWithCode(code);
  if (!ok) {
    if (errorEl) errorEl.textContent = 'コードが正しくありません。もう一度ご確認ください。';
  }
}
(function () {
  var input = document.getElementById('gateCodeInput');
  if (input) {
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') handleGateSubmit();
    });
  }
})();

// ========================
// ホーム画面追加デモアニメーション（start.htmlのガイドページと同一ロジックを移植）
// ========================
(function () {
  var screenEl = document.getElementById('gateDemoScreen');
  var popup = document.getElementById('gateDemoPopup');
  var sheet = document.getElementById('gateDemoSheet');
  var dot = document.getElementById('gateDemoDot');
  var caption = document.getElementById('gateDemoCaption');
  var dotsIcon = document.getElementById('gateDemoDots');
  if (!screenEl || !popup || !sheet || !dot || !caption || !dotsIcon) return;

  var shareHead = '<div class="gate-demo-share-head"><div class="gate-demo-share-icon"></div><div><div style="font-size:11px;font-weight:700;">Enverly</div><div style="font-size:9px;color:#aaa;">enverly.jp</div></div></div>';

  var actionsMore = '<div class="gate-demo-share-actions"><div>📄<br>コピー</div><div>🔖<br>ブックマーク</div><div>👓<br>リーディング</div><div class="accent" id="gateSheetMoreBtn">⌄<br>表示を増やす</div></div>';

  var actionsLess = '<div class="gate-demo-share-actions"><div>📄<br>コピー</div><div>🔖<br>ブックマーク</div><div>👓<br>リーディング</div><div class="accent">⌃<br>表示を減らす</div></div>' +
    '<div class="gate-demo-extra-list">' +
    '<div class="gate-demo-extra-item">🔖&nbsp; ブックマークの追加先</div>' +
    '<div class="gate-demo-extra-item">☆&nbsp; お気に入りに追加</div>' +
    '<div class="gate-demo-extra-item accent" id="gateSheetHomeItem">➕&nbsp; ホーム画面に追加</div>' +
    '</div>';

  var addScreen = '<div class="gate-demo-addscreen-head"><span>✕</span><span style="font-size:11px;font-weight:700;">ホーム画面に追加</span><span class="add-btn" id="gateSheetAddBtn">追加</span></div>' +
    '<div class="gate-demo-addscreen-row"><div class="gate-demo-share-icon"></div><div>Enverly</div></div>' +
    '<div class="gate-demo-toggle-row"><span>Webアプリとして開く</span><div class="gate-demo-toggle"></div></div>';

  var shareSvg = '<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-2px;"><path d="M12 3v13"/><path d="M7 8l5-5 5 5"/><rect x="4" y="13" width="16" height="8" rx="2"/></svg>';

  var popupList = '<div class="gate-demo-popup-item" id="gatePopupShareItem" style="color:#2D6A4F;font-weight:700;">' + shareSvg + '&nbsp; 共有</div>' +
    '<div class="gate-demo-popup-item">🔖&nbsp; ブックマークに追加</div>' +
    '<div class="gate-demo-popup-item">＋&nbsp; 新規タブ</div>';

  var steps = [
    { cap: '画面下の「…」をタップ', popup: false, sheet: false, targetEl: function(){ return dotsIcon; } },
    { cap: '「共有」を選択', popup: true, sheet: false, html: popupList, targetId: 'gatePopupShareItem' },
    { cap: '「表示を増やす」をタップ', popup: false, sheet: true, html: shareHead + actionsMore, targetId: 'gateSheetMoreBtn' },
    { cap: '「ホーム画面に追加」を選択', popup: false, sheet: true, html: shareHead + actionsLess, targetId: 'gateSheetHomeItem' },
    { cap: '右上の「追加」をタップして完了', popup: false, sheet: true, tall: true, html: addScreen, targetId: 'gateSheetAddBtn' },
    { cap: 'ホーム画面から、いつでも開けます', popup: false, sheet: false, done: true }
  ];

  var timers = [];
  var STEP_DURATION = 2600;
  var TALL_STEP_DURATION = 3200;
  var REVEAL_DELAY = 480;

  function placeDotOn(el) {
    if (!el) return;
    var screenRect = screenEl.getBoundingClientRect();
    var elRect = el.getBoundingClientRect();
    var cx = elRect.left - screenRect.left + elRect.width / 2;
    var cy = elRect.top - screenRect.top + elRect.height / 2;
    dot.style.left = (cx - 9) + 'px';
    dot.style.top = (cy - 9) + 'px';
  }

  function showDotOnTarget(s) {
    var target = s.targetEl ? s.targetEl() : (s.targetId ? document.getElementById(s.targetId) : null);
    if (!target) return;
    placeDotOn(target);
    dot.style.opacity = '1';
    dot.style.transform = 'scale(1)';
    timers.push(setTimeout(function () {
      dot.style.transform = 'scale(1.7)';
      dot.style.opacity = '0';
    }, 450));
  }

  function playStep(i) {
    var s = steps[i];
    caption.textContent = s.cap;
    popup.classList.toggle('show', s.popup);
    if (s.popup) popup.innerHTML = s.html;
    sheet.classList.toggle('show', s.sheet);
    sheet.classList.toggle('tall', !!s.tall);
    if (s.sheet) sheet.innerHTML = s.html; else sheet.innerHTML = '';

    if (s.done) {
      dot.style.opacity = '0';
    } else if (s.targetEl) {
      showDotOnTarget(s);
    } else {
      dot.style.opacity = '0';
      timers.push(setTimeout(function () { showDotOnTarget(s); }, REVEAL_DELAY));
    }

    var duration = s.tall ? TALL_STEP_DURATION : STEP_DURATION;
    var next = (i + 1) % steps.length;
    timers.push(setTimeout(function () { playStep(next); }, duration));
  }

  playStep(0);
})();

// ========================
// グローバル音声マネージャー
// ========================
const AUDIO_REGISTRY = [];
function registerAudio(el) {
  if (!el || AUDIO_REGISTRY.includes(el)) return;
  AUDIO_REGISTRY.push(el);
  el.addEventListener('play', () => {
    AUDIO_REGISTRY.forEach(other => {
      if (other !== el && !other.paused) {
        try { other.pause(); } catch (e) {}
      }
    });
  });
}
registerAudio(document.getElementById('asoboTimerBgm'));
registerAudio(document.getElementById('asoboVoicePlayer'));
(function () {
  const se = document.getElementById('asoboSePlayer');
  const se2 = document.getElementById('asoboSePlayer2');
  if (se) se.volume = 0.45;
  if (se2) se2.volume = 0.5;
})();

// ========================
// データ
// ========================
const MONTH_PLAYLIST = [
  { type:'audio', title:"Swingin' From a Rainbow", sub:'Morning Talkのエンディングで使用中の曲。ゆったり揺れるようなリズムが心地いい一曲。', tag:'Morning Talkで使用中', src:'audio/monthly_playlist/mp_swingin_rainbow.mp3' },
  { type:'audio', title:'Little Dolphin', sub:'Morning Talkのエンディングで使用中の曲。海を泳ぐイルカをイメージした、やさしいメロディ。', tag:'Morning Talkで使用中', src:'audio/monthly_playlist/mp_little_dolphin.mp3' },
  { type:'audio', title:'Alphabet Song', sub:'Morning Talkのエンディングで使用中の曲。アルファベットを楽しく覚えられる定番ソング。', tag:'Morning Talkで使用中', src:'audio/monthly_playlist/mp_alphabet_song.mp3' },
  { type:'youtube', videoId:'KbrSWbuWtmc', title:'The Ice Cream Song', sub:'ice cream・scoopなど夏らしい単語がいっぱい。数を数えながら歌える定番曲。', age:'2〜5歳', ytUrl:'https://www.youtube.com/watch?v=KbrSWbuWtmc' },
  { type:'youtube', videoId:'hlzvrEfyL2Y', title:'Mr. Sun, Sun, Mr. Golden Sun', sub:'太陽に呼びかけるやさしいメロディ。今月のテーマ「Water &amp; Sun」にぴったりの一曲。', age:'1〜4歳', ytUrl:'https://www.youtube.com/watch?v=hlzvrEfyL2Y' },
  { type:'youtube', videoId:'cAMbqRWqLXQ', title:'Down By The Bay', sub:'watermelonなど夏の単語で韻を踏む遊び歌。テンポよく体を揺らしながら楽しめる。', age:'2〜5歳', ytUrl:'https://www.youtube.com/watch?v=cAMbqRWqLXQ' },
];

const JOEL_ONE_LINERS = [
  { en: "It's okay to make mistakes!", ja: '間違えても大丈夫だよ！' },
  { en: 'One word a day is enough.', ja: '1日1単語でじゅうぶん。' },
  { en: "You don't have to be perfect.", ja: '完璧じゃなくていいんだ。' },
  { en: 'Small steps still count.', ja: '小さな一歩も、ちゃんと前進だよ。' },
  { en: 'Have fun today, too!', ja: '今日も楽しんでいこうね！' },
  { en: 'Your voice matters.', ja: '君の声には価値があるよ。' },
  { en: "Let's take it easy today.", ja: '今日はゆっくりいこう。' },
  { en: 'Every little bit helps.', ja: 'ちょっとずつで大丈夫。' },
  { en: "It's okay to skip a day.", ja: 'お休みしてもいいんだよ。' },
  { en: 'No need to rush.', ja: '焦らなくていいんだよ。' },
  { en: 'Just showing up counts.', ja: '続けているだけで、もう十分だよ。' },
  { en: 'Laughing together is enough.', ja: '一緒に笑うだけで、もう十分だよ。' },
  { en: "You know your child best.", ja: '子供のことを一番知ってるのは、あなただよ。' },
  { en: 'Even five minutes is real.', ja: '5分だって、ちゃんと本物だよ。' },
  { en: "You're not alone in this.", ja: 'ひとりでがんばらなくていいんだよ。' },
  { en: 'One smile is enough today.', ja: '今日は笑顔ひとつで十分だよ。' },
  { en: "You're already doing enough.", ja: 'もう、じゅうぶんやれてるよ。' },
  { en: "Tomorrow's another chance.", ja: '明日、また新しいチャンスがあるよ。' },
  { en: "It doesn't have to look perfect.", ja: '見た目がキレイじゃなくていいんだ。' },
  { en: "You're not a teacher. You're something better.", ja: '先生じゃなくていい。あなたはもっと特別だから。' },
  { en: "Some days are just quiet, and that's fine.", ja: '静かな日があってもいいんだよ。' },
  { en: "You showed up. That's the whole thing.", ja: '今日もここに来てくれた。それで十分だよ。' },
  { en: 'Slow and steady still gets there.', ja: 'ゆっくりでも、ちゃんと進んでるよ。' },
  { en: 'I\'m proud of you today.', ja: '今日のあなたを、誇りに思うよ。' },
  {
    type: 'quote',
    en: 'Learning another language is not only learning different words for the same things, but learning another way to think about things.',
    ja: '外国語を学ぶというのは、同じものを違う単語で言い換えるだけじゃない。ものの考え方そのものを、もうひとつ手に入れることなんだ。',
    author: 'Flora Lewis',
    authorJa: 'アメリカのジャーナリスト',
  },
  {
    type: 'quote',
    en: 'Language is the road map of a culture. It tells you where its people come from and where they are going.',
    ja: '言語は、文化の地図だ。その言葉を話す人たちが、どこから来て、どこへ向かっているのかを教えてくれる。',
    author: 'Rita Mae Brown',
    authorJa: 'アメリカの作家',
  },
  {
    type: 'quote',
    en: 'Children learn as they play. Most importantly, in play children learn how to learn.',
    ja: '子供は遊びながら学ぶ。何より大切なのは、遊びの中で「学び方」そのものを学んでいくということ。',
    author: 'O. Fred Donaldson',
    authorJa: '遊びの研究者',
  },
  {
    type: 'quote',
    en: 'The way we talk to our children becomes their inner voice.',
    ja: '私たちが子供にかける言葉は、そのままその子の心の中の声になる。',
    author: "Peggy O'Mara",
    authorJa: '編集者・作家',
  },
  {
    type: 'quote',
    en: 'A journey of a thousand miles begins with a single step.',
    ja: '千里の道も、一歩から。',
    author: 'Lao Tzu',
    authorJa: '中国の思想家',
  },
  {
    type: 'quote',
    en: 'The limits of my language mean the limits of my world.',
    ja: '私の言葉の限界が、私の世界の限界を意味する。',
    author: 'Ludwig Wittgenstein',
    authorJa: 'オーストリアの哲学者',
  },
];

function renderJoelLine() {
  const el = document.getElementById('joelLineText');
  const bubble = document.getElementById('joelLineBubble');
  if (!el) return;
  const dayOfYear = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
  const line = JOEL_ONE_LINERS[dayOfYear % JOEL_ONE_LINERS.length];
  const isQuote = line.type === 'quote';
  if (bubble) bubble.classList.toggle('is-quote', isQuote);
  const eyebrow = isQuote ? `<div class="joel-line-eyebrow">Jayが選んだ言葉</div>` : '';
  const author = isQuote ? `<span class="author">— ${line.author}${line.authorJa ? `（${line.authorJa}）` : ''}</span>` : '';
  const enText = isQuote ? `"${line.en}"` : line.en;
  const jaText = isQuote ? `「${line.ja}」` : line.ja;
  el.innerHTML = `${eyebrow}<span class="en">${enText}</span><span class="ja">${jaText}</span>${author}`;
}

// ========================
// 通算のあゆみ（累計スタッツ・カードのリセットとは無関係に積み上がる）
// ========================
const LIFETIME_STATS_KEY = 'enverly_lifetime_stats';

function getLifetimeStats() {
  let s = null;
  try {
    const raw = localStorage.getItem(LIFETIME_STATS_KEY);
    s = raw ? JSON.parse(raw) : null;
  } catch (e) { s = null; }
  if (!s) {
    s = { totalStamps: 0, cardsCompleted: 0, talkCount: 0, morningTalkPlays: 0, asoboPlays: 0, journeyOpens: 0 };
    saveLifetimeStats(s);
  }
  return s;
}
function saveLifetimeStats(s) {
  try { localStorage.setItem(LIFETIME_STATS_KEY, JSON.stringify(s)); } catch (e) {}
}
function bumpLifetimeStat(key, amount) {
  const s = getLifetimeStats();
  s[key] = (s[key] || 0) + (amount || 1);
  saveLifetimeStats(s);
}

const STAMP_BADGES = [
  { min: 0,  img: 'illustrations/stamps/stamp_week_01.png', name: 'めがでたよ' },
  { min: 5,  img: 'illustrations/stamps/stamp_week_02.png', name: 'ふたばになったよ' },
  { min: 15, img: 'illustrations/stamps/stamp_week_03.png', name: 'はっぱもりもり' },
  { min: 30, img: 'illustrations/stamps/stamp_week_04.png', name: 'つぼみふくらんだ' },
  { min: 60, img: 'illustrations/stamps/stamp_week_05.png', name: 'はなさいたよ！' },
];
function getStampBadge(total) {
  let badge = STAMP_BADGES[0];
  for (const b of STAMP_BADGES) {
    if (total >= b.min) badge = b;
  }
  return badge;
}

function renderLifetimeStats() {
  const s = getLifetimeStats();
  const map = {
    lifetimeTotalStamps: s.totalStamps,
    lifetimeCardsCompleted: s.cardsCompleted,
    lifetimeTalkCount: s.talkCount,
    lifetimeMorningTalkPlays: s.morningTalkPlays,
    lifetimeAsoboPlays: s.asoboPlays,
  };
  Object.keys(map).forEach(id => {
    const el = document.getElementById(id);
    if (el) el.textContent = map[id];
  });

  const badgeEl = document.getElementById('ayumiBadge');
  if (badgeEl) {
    const badge = getStampBadge(s.totalStamps);
    badgeEl.innerHTML = `
      <img src="${badge.img}" alt="${badge.name}">
      <div>
        <div class="ayumi-badge-name">${badge.name}</div>
        <div class="ayumi-badge-sub">通算${s.totalStamps}スタンプ</div>
      </div>
    `;
  }
}


const STAMP_CARD_KEY = 'enverly_stamp_card';
const STAMP_CARD_MAX = 5;

function getStampCardState() {
  let state = null;
  try {
    const raw = localStorage.getItem(STAMP_CARD_KEY);
    state = raw ? JSON.parse(raw) : null;
  } catch (e) { state = null; }
  if (!state) {
    state = { count: 0, days: {}, celebrated: false };
    saveStampCardState(state);
  }
  return state;
}

function saveStampCardState(state) {
  try { localStorage.setItem(STAMP_CARD_KEY, JSON.stringify(state)); } catch (e) {}
}

function earnStamp(category) {
  const state = getStampCardState();
  const todayKey = new Date().toISOString().slice(0, 10);
  if (!state.days[todayKey]) state.days[todayKey] = {};
  if (state.days[todayKey][category]) return;
  if (state.count >= STAMP_CARD_MAX) return;
  state.days[todayKey][category] = true;
  state.count += 1;
  saveStampCardState(state);
  bumpLifetimeStat('totalStamps');
  showStampToast(state.count);
  renderStampCard(true);
  if (state.count >= STAMP_CARD_MAX && !state.celebrated) {
    state.celebrated = true;
    saveStampCardState(state);
    bumpLifetimeStat('cardsCompleted');
    setTimeout(() => openStampCelebrate(), 550);
  }
}

let stampToastTimer = null;
function showStampToast(count) {
  const el = document.getElementById('stampToast');
  if (!el) return;
  const img = document.getElementById('stampToastImg');
  const text = document.getElementById('stampToastText');
  if (img) img.src = `illustrations/stamps/stamp_week_0${count}.png`;
  if (text) text.textContent = count >= STAMP_CARD_MAX ? 'カード完成！' : 'スタンプゲット！';
  el.classList.add('show');
  clearTimeout(stampToastTimer);
  stampToastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

function advanceStampCard() {
  const state = { count: 0, days: {}, celebrated: false };
  saveStampCardState(state);
  renderStampCard();
  closeStampCelebrate();
}

function renderStampCard(justEarned) {
  const wrap = document.getElementById('stampCardSlots');
  if (!wrap) return;
  const state = getStampCardState();
  const slotsHtml = [];
  for (let i = 1; i <= STAMP_CARD_MAX; i++) {
    const filled = i <= state.count;
    const isNew = justEarned && i === state.count;
    const cls = ['stamp-card-slot'];
    if (filled) cls.push('filled');
    if (i === STAMP_CARD_MAX) cls.push('slot-5');
    if (isNew) cls.push('pop');
    const img = filled
      ? `<img src="illustrations/stamps/stamp_week_0${i}.png" alt="スタンプ${i}">`
      : '';
    slotsHtml.push(`<div class="${cls.join(' ')}">${img}</div>`);
  }
  wrap.innerHTML = slotsHtml.join('');
}

function openStampCelebrate() {
  const el = document.getElementById('stampCelebrateOverlay');
  if (el) el.classList.add('show');
}
function closeStampCelebrate() {
  const el = document.getElementById('stampCelebrateOverlay');
  if (el) el.classList.remove('show');
}

function recordIeta() {
  bumpLifetimeStat('talkCount');
  earnStamp('talk');
}

function recordAsoboPlayed() {
  bumpLifetimeStat('asoboPlays');
  earnStamp('asobo');
}

const YT_DATA = [
  { icon:'talk', videoId:'zwL2o4jZxbc', title:'Ms. Rachel', when:'発語・語りかけ', age:'0〜4歳', interest:'ことば・発話', tip:'一番のお気に入り。うちの子はこれを見て育ちました。ゆったりした発音と、子どもの反応を引き出す間の取り方が心地いい。', url:'https://www.youtube.com/@msrachel' },
  { icon:'music', videoId:'9UasekNr8KI', title:'Super Simple Songs', when:'いつでも・BGMに', age:'0〜4歳', interest:'うた・音楽', tip:'小さい頃からずっとお世話になってる定番。CGに頼らない、良質な英語の歌がたくさん。', url:'https://www.youtube.com/channel/UCLsooMJoIpl_7ux2jvdPB-Q' },
  { icon:'search', videoId:'2Rd-QIj91FU', title:'Blippi', when:'おでかけ気分・知育タイム', age:'2〜6歳', interest:'たんけん・知育', tip:'正直、最初は「うるさいお兄さん」だと思ってました。でも4歳を過ぎた娘が夢中になって、内容をちゃんと見たら教育的な部分が多いことに気づいた一本。', url:'https://www.youtube.com/channel/UC5PYHgAzJ1wLEidB58SK6Xw' },
  { icon:'run', videoId:'DsUPVERZFlI', title:'Danny Go', when:'体を動かしたい時', age:'3〜6歳', interest:'からだを動かす', tip:'体を動かしながら英語に触れられるチャンネル。音楽の質もよくて、うちの4歳はこれしか見ません。', url:'https://www.youtube.com/@DannyGo' },
];

const SCENE_DATA = [
  { tag:'寝る前', color:'night', channel:'Ms. Rachel', videoId:'fqINYZwVXV4', note:'静かな語りかけとねんねルーティンで、そのまま眠りに向かえる。', age:'0〜3歳', url:'https://www.youtube.com/watch?v=fqINYZwVXV4' },
  { tag:'朝の支度中', color:'morning', channel:'Super Simple Songs', videoId:'K53J44ioDxI', note:'元気が出る定番ソングをかけ流して、支度のテンションを上げる。', age:'1〜5歳', url:'https://www.youtube.com/watch?v=K53J44ioDxI' },
  { tag:'おでかけ・車の中', color:'out', channel:'Blippi', videoId:'DhJ5Ld-LpUE', note:'乗り物を実況しながら紹介。移動中の暇つぶしにもぴったり。', age:'2〜6歳', url:'https://www.youtube.com/watch?v=DhJ5Ld-LpUE' },
  { tag:'食事中', color:'meal', channel:'Super Simple Songs', videoId:'frN3nvhIHUk', note:'子どもが好きな定番の食べ物ソング。食卓のBGMに。', age:'1〜5歳', url:'https://www.youtube.com/watch?v=frN3nvhIHUk' },
];

const SCENE_COLORS = {
  night: { bg:'#EEEDFE', text:'#4C3F8C' },
  morning: { bg:'#FAEEDA', text:'#92400E' },
  out: { bg:'#EDF6F1', text:'#3B6D11' },
  meal: { bg:'#FDE8E8', text:'#9C3131' },
};

function renderScenes() {
  const container = document.getElementById('sceneCards');
  if (!container) return;
  container.innerHTML = SCENE_DATA.map(s => {
    const c = SCENE_COLORS[s.color];
    return `
    <a class="scene-card" href="${s.url}" target="_blank" rel="noopener">
      <div class="scene-card-thumb"><img src="https://img.youtube.com/vi/${s.videoId}/hqdefault.jpg" alt="${s.tag}"></div>
      <div class="scene-card-tag" style="background:${c.bg};color:${c.text};">${s.tag}</div>
      <div class="scene-card-channel">${s.channel}</div>
      <div class="scene-card-note">${s.note}</div>
      <div class="scene-card-cta"><span>▶</span>見る</div>
    </a>
  `;
  }).join('');
}

// ========================
// 状態
// ========================
let carouselIndex = 0;
let carouselSwipeGuard = false;
const CAROUSEL_CARD_W = 268;
const CAROUSEL_GAP = 12;
let musicProg = 0, musicTimer = null;
let activeMode = null;

// ========================
// モニター利用ログ（Google Apps Script Webhook → スプレッドシート）
// ========================
const TRACKING_ENDPOINT = 'https://script.google.com/macros/s/AKfycbxCqYkySVMwhrrFUt_uAQYV-0V1HXm7VXMw6WHzM8qV2xYap1Ujo4qUc_DrC9PWK_ET/exec';

let trackingSessionId = null;
function getTrackingSessionId() {
  if (trackingSessionId) return trackingSessionId;
  try {
    trackingSessionId = sessionStorage.getItem('enverly_session_id');
    if (!trackingSessionId) {
      trackingSessionId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
      sessionStorage.setItem('enverly_session_id', trackingSessionId);
    }
  } catch (e) {
    trackingSessionId = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  }
  return trackingSessionId;
}

function trackEvent(eventName, extra) {
  try {
    if (!TRACKING_ENDPOINT || TRACKING_ENDPOINT.indexOf('PASTE_') === 0) return;
    var raw = localStorage.getItem('enverly_access');
    var access = raw ? JSON.parse(raw) : null;
    if (!access || !access.code) return;
    var payload = {
      code: access.code,
      type: access.type || '',
      event: eventName,
      extra: extra || '',
      session: getTrackingSessionId(),
      ts: new Date().toISOString(),
      ua: navigator.userAgent
    };
    var body = JSON.stringify(payload);
    if (navigator.sendBeacon) {
      navigator.sendBeacon(TRACKING_ENDPOINT, new Blob([body], { type: 'text/plain;charset=UTF-8' }));
    } else {
      fetch(TRACKING_ENDPOINT, { method: 'POST', mode: 'no-cors', body: body }).catch(() => {});
    }
  } catch (e) {}
}

// ========================
// アプリ初期化
// ========================
function initApp() {
  renderYT();
  renderScenes();
  renderMonthlyPlaylist();
  renderJoelLine();
  renderStampCard();
  initPushNotification();
  trackEvent('app_open');
}
initApp();

// ========================
// 毎日の通知（Web Push）
// ========================
const VAPID_PUBLIC_KEY = 'BDBTE8D67Pooo2ClU3adPkAWYC9jw7aKFc7CXzTtyQcL2yRtRoFr6JXJAhopiP5rZcUmrRE0RXAu8gqRZCwqCS0';

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) outputArray[i] = rawData.charCodeAt(i);
  return outputArray;
}

async function initPushNotification() {
  const switchEl = document.getElementById('notifySwitch');
  const subEl = document.getElementById('notifyToggleSub');
  if (!switchEl) return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    subEl.textContent = 'このブラウザは通知に対応していません';
    return;
  }
  try {
    const reg = await navigator.serviceWorker.register('/sw.js');
    const existing = await reg.pushManager.getSubscription();
    setNotifySwitchUI(!!existing && Notification.permission === 'granted');
  } catch (e) {
    console.error('SW登録失敗', e);
  }
}

function setNotifySwitchUI(on) {
  const switchEl = document.getElementById('notifySwitch');
  const subEl = document.getElementById('notifyToggleSub');
  if (!switchEl) return;
  switchEl.classList.toggle('on', on);
  subEl.textContent = on ? '朝、Morning Talkの配信をお知らせ中' : '朝、Morning Talkの配信をお知らせ';
}

async function toggleDailyNotification() {
  const switchEl = document.getElementById('notifySwitch');
  if (!switchEl) return;
  if (switchEl.classList.contains('pending')) return;
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
    alert('お使いのブラウザは通知に対応していません。');
    return;
  }
  switchEl.classList.add('pending');
  var step = 'init';
  try {
    step = 'getRegistrations（既存の登録を確認）';
    const allRegs = await navigator.serviceWorker.getRegistrations();
    if (allRegs.length > 0) {
      console.log('既存のSW登録を解除:', allRegs.map(function (r) { return r.scope; }));
      for (const r of allRegs) {
        await r.unregister();
      }
    }

    step = 'serviceWorker.register';
    await navigator.serviceWorker.register('/sw.js');

    step = 'serviceWorker.ready';
    const reg = await Promise.race([
      navigator.serviceWorker.ready,
      new Promise((_, reject) => setTimeout(() => reject(new Error('serviceWorker.ready がタイムアウトしました（5秒待っても解決しませんでした）')), 5000))
    ]);

    step = 'getSubscription';
    const existing = await reg.pushManager.getSubscription();

    if (existing && Notification.permission === 'granted') {
      step = 'unsubscribe fetch';
      await fetch('/api/unsubscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ endpoint: existing.endpoint }),
      }).catch(() => {});
      step = 'unsubscribe';
      await existing.unsubscribe();
      setNotifySwitchUI(false);
      return;
    }

    step = 'requestPermission';
    const permission = await Notification.requestPermission();
    if (permission !== 'granted') {
      setNotifySwitchUI(false);
      if (permission === 'denied') {
        alert('通知がブロックされています。ブラウザの設定から許可してください。');
      }
      return;
    }
    step = 'pushManager.subscribe';
    var activeReg = reg;
    for (var i = 0; i < 5 && !activeReg.active; i++) {
      await new Promise(function (r) { setTimeout(r, 400); });
      activeReg = await navigator.serviceWorker.getRegistration('/') || activeReg;
    }
    if (!activeReg.active) {
      throw new Error('サービスワーカーがactiveになりませんでした（2秒待っても）。');
    }
    const sub = await activeReg.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: urlBase64ToUint8Array(VAPID_PUBLIC_KEY),
    });
    step = 'subscribe fetch';
    const res = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subscription: sub }),
    });
    if (!res.ok) {
      var bodyText = '';
      try { bodyText = await res.text(); } catch (e2) {}
      throw new Error('subscribe API failed: HTTP ' + res.status + ' ' + bodyText);
    }
    setNotifySwitchUI(true);
  } catch (e) {
    console.error('通知購読エラー [' + step + ']', e);
    alert('通知の設定に失敗しました。\n\n失敗した処理: ' + step + '\nエラー内容: ' + (e && e.message ? e.message : e));
    setNotifySwitchUI(false);
  } finally {
    switchEl.classList.remove('pending');
  }
}

// ========================
// Monthly Playlist カルーセル
// ========================
function renderMonthlyPlaylist() {
  const container = document.getElementById('monthlyPlaylist');
  if (!container) return;

  container.innerHTML = `
    <div class="carousel-outer" id="carouselOuter">
      <div class="carousel-track" id="carouselTrack">
        ${MONTH_PLAYLIST.map((s, i) => `
          <div class="carousel-card${i === 0 ? ' active' : ''}${s.type === 'audio' ? ' audio-card' : ''}" data-index="${i}" id="carouselCard${i}" onclick="handleCarouselCardTap(${i})">
            ${s.type === 'audio' ? `
              <div class="carousel-thumb-area audio-thumb audio-thumb-${i % 3}">
                <div class="audio-thumb-play" id="audioThumbPlay${i}">
                  <svg class="audio-thumb-icon-play" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  <svg class="audio-thumb-icon-pause" viewBox="0 0 24 24" fill="currentColor" style="display:none;"><rect x="6" y="5" width="4" height="14"/><rect x="14" y="5" width="4" height="14"/></svg>
                </div>
              </div>
              <div class="carousel-card-info">
                <div class="carousel-card-title">${s.title}</div>
                <div class="carousel-card-age carousel-card-tag-audio">${s.tag}</div>
                <div class="carousel-card-sub">${s.sub}</div>
                <div class="carousel-card-yt carousel-card-listen">
                  <span>♪</span>きく
                </div>
              </div>
            ` : `
              <div class="carousel-thumb-area">
                <img src="https://img.youtube.com/vi/${s.videoId}/hqdefault.jpg" alt="${s.title}">
              </div>
              <div class="carousel-card-info">
                <div class="carousel-card-title">${s.title}</div>
                <div class="carousel-card-age">${s.age}</div>
                <div class="carousel-card-sub">${s.sub}</div>
                <div class="carousel-card-yt">
                  <span>▶</span>見る
                </div>
              </div>
            `}
          </div>
        `).join('')}
      </div>
      <div class="carousel-dots">
        ${MONTH_PLAYLIST.map((_, i) => `
          <div class="carousel-dot${i === 0 ? ' active' : ''}" onclick="goCarousel(${i})"></div>
        `).join('')}
      </div>
    </div>
  `;

  carouselIndex = 0;
  setTimeout(() => initCarousel(), 0);
}

function handleCarouselCardTap(idx) {
  if (carouselSwipeGuard) return;
  const item = MONTH_PLAYLIST[idx];
  if (!item) return;
  if (item.type === 'audio') {
    toggleMonthlyAudio(idx);
    return;
  }
  if (item.ytUrl) window.open(item.ytUrl, '_blank', 'noopener');
}

const monthlyPlaylistAudioEl = new Audio();
registerAudio(monthlyPlaylistAudioEl);
let monthlyPlayingIndex = null;

function setMonthlyCardPlayingUI(idx, playing) {
  const playIcon = document.querySelector(`#audioThumbPlay${idx} .audio-thumb-icon-play`);
  const pauseIcon = document.querySelector(`#audioThumbPlay${idx} .audio-thumb-icon-pause`);
  const card = document.getElementById(`carouselCard${idx}`);
  if (playIcon) playIcon.style.display = playing ? 'none' : '';
  if (pauseIcon) pauseIcon.style.display = playing ? '' : 'none';
  if (card) card.classList.toggle('playing', playing);
}

function toggleMonthlyAudio(idx) {
  const item = MONTH_PLAYLIST[idx];
  if (!item || item.type !== 'audio') return;

  const isSameTrack = monthlyPlayingIndex === idx &&
    monthlyPlaylistAudioEl.currentSrc &&
    monthlyPlaylistAudioEl.currentSrc.indexOf(item.src) !== -1;

  if (isSameTrack && !monthlyPlaylistAudioEl.paused) {
    monthlyPlaylistAudioEl.pause();
    return;
  }

  if (!isSameTrack) {
    monthlyPlaylistAudioEl.src = item.src;
    monthlyPlaylistAudioEl.currentTime = 0;
  }
  monthlyPlayingIndex = idx;
  try { monthlyPlaylistAudioEl.play().catch(() => {}); } catch (e) {}
}

monthlyPlaylistAudioEl.addEventListener('play', () => {
  if (monthlyPlayingIndex !== null) setMonthlyCardPlayingUI(monthlyPlayingIndex, true);
});
monthlyPlaylistAudioEl.addEventListener('pause', () => {
  if (monthlyPlayingIndex !== null) setMonthlyCardPlayingUI(monthlyPlayingIndex, false);
});
monthlyPlaylistAudioEl.addEventListener('ended', () => {
  if (monthlyPlayingIndex !== null) setMonthlyCardPlayingUI(monthlyPlayingIndex, false);
  monthlyPlayingIndex = null;
});

function initCarousel() {
  const outer = document.getElementById('carouselOuter');
  const track = document.getElementById('carouselTrack');
  if (!outer || !track) return;

  const containerW = outer.offsetWidth;
  const offset = (containerW - CAROUSEL_CARD_W) / 2;
  track.style.paddingLeft = offset + 'px';
  track.style.paddingRight = offset + 'px';

  updateCarousel(0, false);

  let startX = 0, startY = 0, moved = false;
  track.addEventListener('touchstart', e => {
    startX = e.touches[0].clientX;
    startY = e.touches[0].clientY;
    moved = false;
  }, { passive: true });
  track.addEventListener('touchmove', e => { moved = true; }, { passive: true });
  track.addEventListener('touchend', e => {
    if (!moved) return;
    const dx = e.changedTouches[0].clientX - startX;
    const dy = e.changedTouches[0].clientY - startY;
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 38) {
      goCarousel(carouselIndex + (dx < 0 ? 1 : -1));
    }
    carouselSwipeGuard = true;
    setTimeout(() => { carouselSwipeGuard = false; }, 350);
  }, { passive: true });
}

function goCarousel(idx) {
  idx = Math.max(0, Math.min(idx, MONTH_PLAYLIST.length - 1));
  updateCarousel(idx, true);
}

function updateCarousel(idx, animate) {
  carouselIndex = idx;
  const track = document.getElementById('carouselTrack');
  if (!track) return;

  if (!animate) {
    track.style.transition = 'none';
  } else {
    track.style.transition = 'transform 0.42s cubic-bezier(0.4, 0, 0.2, 1)';
  }
  track.style.transform = `translateX(${-(idx * (CAROUSEL_CARD_W + CAROUSEL_GAP))}px)`;
  if (!animate) {
    track.offsetHeight;
    track.style.transition = '';
  }

  document.querySelectorAll('.carousel-card').forEach((c, i) => {
    c.classList.toggle('active', i === idx);
  });
  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === idx);
  });
}

// ========================
// トースト
// ========================
function showToast(msg) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 2000);
}

// ========================
// タブ
// ========================
function switchTab(name, el) {
  ['home', 'shiru', 'asobo', 'routine', 'playlist'].forEach(t => {
    document.getElementById('tab-' + t).style.display = t === name ? 'block' : 'none';
  });
  document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
  el.classList.add('active');
  if (name === 'asobo') renderAsoboContent();
  trackEvent('tab_view', name);
}

// ========================
// トップ：今日のジャーニー（Now Playing型／Morning・Eveningは時間帯で主役交代、えほんタイムは常時展開）
// ========================
const JOURNEY_SLOTS = ['morning', 'evening', 'night'];
let journeyManualFocus = null;

function getJourneyTimeSlot() {
  const h = new Date().getHours();
  if (h >= 5 && h < 11) return 'morning';
  if (h >= 11 && h < 17) return 'teaser';
  if (h >= 17 && h < 19) return 'evening';
  return 'night';
}

function getBigSlot(h) {
  return (h >= 5 && h < 13) ? 'morning' : 'evening';
}
function journeyBigSlot() {
  if (journeyManualFocus === 'morning' || journeyManualFocus === 'evening') return journeyManualFocus;
  return getBigSlot(new Date().getHours());
}
function journeyOtherSlot() {
  return journeyBigSlot() === 'morning' ? 'evening' : 'morning';
}

function journeyStorageKey() {
  return 'enverly_journey_opened_' + new Date().toISOString().slice(0, 10);
}
function getJourneyOpenedSet() {
  try {
    const raw = localStorage.getItem(journeyStorageKey());
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) { return new Set(); }
}
function markJourneyOpened(slot) {
  const set = getJourneyOpenedSet();
  if (set.has(slot)) return;
  set.add(slot);
  try { localStorage.setItem(journeyStorageKey(), JSON.stringify([...set])); } catch (e) {}
  bumpLifetimeStat('journeyOpens');
  earnStamp('journey');
}

function applyJourneyState() {
  const timeSlot = getJourneyTimeSlot();
  if (timeSlot !== 'teaser') markJourneyOpened(timeSlot);

  const big = journeyBigSlot();
  ['morning', 'evening'].forEach(slot => {
    const block = document.getElementById('jblock-' + slot);
    if (block) block.classList.toggle('collapsed', slot !== big);
  });

  renderJourneyNowPlaying();
}

function focusJourneyBlock(slot) {
  if (slot === 'morning' || slot === 'evening') journeyManualFocus = slot;
  markJourneyOpened(slot);
  applyJourneyState();
  const block = document.getElementById('jblock-' + slot);
  if (block && typeof block.scrollIntoView === 'function') block.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

const JOURNEY_TALK_META = {
  morning: { label: 'Morning talk', smallLabel: 'モーニングトーク', sub: '朝のひとときに', img: 'illustrations/talks/morning_talk_hero.png', qId: 'ftQuestion', titleId: 'ftPlayTitle', tagId: 'ftStatusTag' },
  evening: { label: 'Evening talk', smallLabel: 'イブニングトーク', sub: 'おかえりのひとときに', img: 'illustrations/talks/evening_talk_hero.png', qId: 'etQuestion', titleId: 'etPlayTitle', tagId: 'etStatusTag' }
};
function renderJourneyNowPlaying() {
  const big = journeyBigSlot();
  const other = journeyOtherSlot();
  const bigMeta = JOURNEY_TALK_META[big];
  const otherMeta = JOURNEY_TALK_META[other];

  const bigLabelEl = document.getElementById('journeyNowBigLabel');
  const bigImgEl = document.getElementById('journeyNowBigImg');
  const bigTitleEl = document.getElementById('journeyNowBigTitle');
  const bigSubEl = document.getElementById('journeyNowBigSub');
  const smallLabelEl = document.getElementById('journeyNowSmallLabel');
  const smallImgEl = document.getElementById('journeyNowSmallImg');
  const smallSubEl = document.getElementById('journeyNowSmallSub');
  const smallTitleEl = document.getElementById('journeyNowSmallTitle');
  const bookTitleEl = document.getElementById('journeyNowBookTitle');

  if (bigLabelEl) bigLabelEl.textContent = bigMeta.label;
  if (bigSubEl) bigSubEl.textContent = bigMeta.sub;
  if (bigImgEl) bigImgEl.src = bigMeta.img;
  if (bigTitleEl) {
    const q = document.getElementById(bigMeta.qId);
    if (q && q.textContent) bigTitleEl.textContent = q.textContent;
  }
  if (smallLabelEl) smallLabelEl.textContent = otherMeta.smallLabel;
  if (smallSubEl) smallSubEl.textContent = otherMeta.sub;
  if (smallImgEl) smallImgEl.src = otherMeta.img;
  if (smallTitleEl) {
    const q = document.getElementById(otherMeta.qId);
    if (q && q.textContent) smallTitleEl.textContent = q.textContent;
  }
  if (bookTitleEl) {
    const mt = document.querySelector('.month-title');
    if (mt && mt.textContent) bookTitleEl.textContent = mt.textContent;
  }
}

applyJourneyState();


// ========================
// 設定モーダル
// ========================
function openSettingsModal() {
  renderLifetimeStats();
  renderStampCard();
  document.getElementById('settingsModal').classList.add('open');
}
function closeSettingsModal() {
  document.getElementById('settingsModal').classList.remove('open');
}
function logoutEnverly() {
  alert('ログアウト機能は認証実装後に接続予定です');
}



// ========================
// アコーディオン
// ========================
function toggleWhy() {
  const b = document.getElementById('whyBody'); const c = document.getElementById('whyChevron');
  const o = b.classList.toggle('open'); c.classList.toggle('open', o);
}
function toggleLyrics() {
  const b = document.getElementById('lyricsBody'); const c = document.getElementById('lyricsChevron');
  const o = b.classList.toggle('open');
  c.style.transform = o ? 'rotate(180deg)' : 'rotate(0deg)';
}

