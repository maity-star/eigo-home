// ==============================================================
// app-tabs.js — あそぼ／Active Time／ルーティン／しる／絵本ビューワー／YouTube
// 「トーク以外の各タブ」をまとめたファイル。
// 【読み込み順】2番目でOK（app-core.jsの後。app-talk-content.jsとの前後関係は無し）。
// 【更新頻度】低〜中。新コンテンツ追加はあるが週次更新ではない。
// 注：AT_FIND等のActive Timeデータは、あそぼタブの関数から参照されるため
// このファイル内に同居させている（あえてMorning/Evening Talk側には置かない）。
// ==============================================================

// ========================
// あそぼタブ
// ========================
let asoboOpenAxis = null;

const AXIS_META = {
  'カラー': { cls: 'tile-color', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 3a9 9 0 1 0 0 18c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3 0-1.1.9-2 2-2h2.3c1.8 0 3.2-1.4 3.2-3.2C20.5 6.6 16.7 3 12 3Z"/><circle cx="7.5" cy="10.5" r="1" fill="currentColor" stroke="none"/><circle cx="11" cy="7" r="1" fill="currentColor" stroke="none"/><circle cx="15.5" cy="8" r="1" fill="currentColor" stroke="none"/></svg>' },
  'カウント': { cls: 'tile-count', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><line x1="6" y1="18" x2="6" y2="14"/><line x1="12" y1="18" x2="12" y2="10"/><line x1="18" y1="18" x2="18" y2="6"/></svg>' },
  'サウンド': { cls: 'tile-sound', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 10v4h4l5 4V6l-5 4H4Z"/><path d="M17 9a4 4 0 0 1 0 6"/><path d="M19.5 6.5a8 8 0 0 1 0 11"/></svg>' },
  'ロケーション': { cls: 'tile-location', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 21s7-6.6 7-11.5A7 7 0 0 0 5 9.5C5 14.4 12 21 12 21Z"/><circle cx="12" cy="9.5" r="2.3"/></svg>' },
  'テクスチャー': { cls: 'tile-texture', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 11V6.5a1.5 1.5 0 0 1 3 0V11"/><path d="M10 10.5V5a1.5 1.5 0 0 1 3 0v5.5"/><path d="M13 10.5V6a1.5 1.5 0 0 1 3 0v7"/><path d="M16 12v-1a1.5 1.5 0 0 1 3 0v4a5.5 5.5 0 0 1-5.5 5.5h-2A6 6 0 0 1 6 15l-1.6-3a1.4 1.4 0 0 1 2.4-1.4"/></svg>' },
  'カテゴリー': { cls: 'tile-category', icon: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3.5 7.5 12 3l8.5 4.5L12 12 3.5 7.5Z"/><path d="M3.5 7.5V16L12 20.5V12"/><path d="M20.5 7.5V16L12 20.5"/></svg>' }
};
const ICON_CHEVRON = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"/></svg>';

function renderAsoboContent() {
  renderAsoboAxisList();
}

function renderAsoboAxisList() {
  const wrap = document.getElementById('asoboAxisList');
  if (!wrap) return;
  const axes = Object.keys(AXIS_META);
  wrap.innerHTML = axes.map(axis => {
    const meta = AXIS_META[axis];
    const missions = AT_FIND.filter(d => d.axis === axis);
    const cards = missions.map(m => `
        <div class="at-archive-card">
          <button class="at-archive-play" onclick="playAtArchiveItem(this); event.stopPropagation();">▶</button>
          <div class="at-archive-body">
            <div class="at-archive-en">${m.en}</div>
            <div class="at-archive-ja">${m.ja}</div>
          </div>
        </div>`).join('');
    return `
    <div class="asobo-axis-frame ${meta.cls}" id="axisFrame-${meta.cls}" data-axis="${axis}">
      <div class="asobo-axis-frame-head" onclick="toggleAxisFrame('${axis}')">
        <div class="asobo-axis-icon">${meta.icon}</div>
        <div class="asobo-axis-info">
          <div class="asobo-axis-label">${axis}</div>
          <div class="asobo-axis-count">${missions.length}このミッション</div>
        </div>
        <div class="asobo-axis-chevron">${ICON_CHEVRON}</div>
      </div>
      <div class="asobo-axis-body-wrap">
        <div class="asobo-axis-body">
          <div class="asobo-axis-body-inner">${cards}</div>
        </div>
      </div>
    </div>`;
  }).join('');
}

function toggleAxisFrame(axis) {
  const isOpen = asoboOpenAxis === axis;
  document.querySelectorAll('.asobo-axis-frame.open').forEach(f => f.classList.remove('open'));
  asoboOpenAxis = isOpen ? null : axis;
  if (!isOpen) {
    const meta = AXIS_META[axis];
    const frame = document.getElementById('axisFrame-' + meta.cls);
    if (frame) frame.classList.add('open');
  }
}

let asoboTimerTimeout = null;
const ASOBO_TIMER_CIRCUMFERENCE = 175.9;
let currentFindItem = null;

function playAsoboSe(src) {
  const se = document.getElementById('asoboSePlayer');
  if (!se || !src) return;
  try {
    let isSameSrc = false;
    try { isSameSrc = se.src === new URL(src, window.location.href).href; } catch (e2) {}
    if (isSameSrc) { se.currentTime = 0; } else { se.src = src; }
    se.play().catch(() => {});
  } catch (e) {}
}

function playAsoboSe2(src) {
  const se = document.getElementById('asoboSePlayer2');
  if (!se || !src) return;
  try {
    let isSameSrc = false;
    try { isSameSrc = se.src === new URL(src, window.location.href).href; } catch (e2) {}
    if (isSameSrc) { se.currentTime = 0; } else { se.src = src; }
    se.play().catch(() => {});
  } catch (e) {}
}

function playAsoboVoice(src, onEnded, onError) {
  const voice = document.getElementById('asoboVoicePlayer');
  if (!voice || !src) { if (onEnded) onEnded(); return; }
  voice.onended = null;
  try {
    if (onEnded) voice.onended = onEnded;
    let isSameSrc = false;
    try { isSameSrc = voice.src === new URL(src, window.location.href).href; } catch (e2) {}
    if (isSameSrc) {
      voice.currentTime = 0;
    } else {
      voice.src = src;
    }
    voice.play().catch((err) => {
      if (onError) onError(err);
      if (onEnded) onEnded();
    });
  } catch (err) {
    if (onError) onError(err);
    if (onEnded) onEnded();
  }
}

function drawAsoboGacha() {
  const pick = AT_FIND[Math.floor(Math.random() * AT_FIND.length)];
  currentFindItem = pick;
  playAsoboSe(ASOBO_SFX.gachaDraw);
  document.getElementById('asoboGachaEn').textContent = pick.en;
  document.getElementById('asoboGachaJa').textContent = pick.ja;
  document.getElementById('asoboGachaResult').classList.add('show');
  resetAsoboTimer();
  const meta = AXIS_META[pick.axis];
  const frame = document.getElementById('axisFrame-' + meta.cls);
  if (frame) {
    frame.classList.remove('asobo-axis-frame-ring');
    void frame.offsetWidth;
    frame.classList.add('asobo-axis-frame-ring');
    setTimeout(() => frame.classList.remove('asobo-axis-frame-ring'), 650);
  }
}

let asoboTimerRunning = false;

function resetAsoboTimer() {
  clearTimeout(asoboTimerTimeout);
  asoboTimerRunning = false;
  const ring = document.getElementById('asoboTimerRingFg');
  const icon = document.getElementById('asoboTimerPlayIcon');
  const joelLine = document.getElementById('asoboJoelLine');
  const bgm = document.getElementById('asoboTimerBgm');
  if (!ring) return;
  ring.style.transition = 'none';
  ring.style.strokeDashoffset = String(ASOBO_TIMER_CIRCUMFERENCE);
  icon.classList.remove('playing');
  icon.textContent = '▶';
  joelLine.classList.remove('show');
  try { bgm.pause(); } catch (e) {}
  const voice = document.getElementById('asoboVoicePlayer');
  try { voice.pause(); voice.onended = null; } catch (e) {}
}

function toggleAsoboTimer() {
  if (asoboTimerRunning) {
    completeAsoboTimer();
  } else {
    startAsoboTimer();
  }
}

function completeAsoboTimer() {
  clearTimeout(asoboTimerTimeout);
  asoboTimerRunning = false;
  const icon = document.getElementById('asoboTimerPlayIcon');
  const joelLine = document.getElementById('asoboJoelLine');
  const bgm = document.getElementById('asoboTimerBgm');
  const ring = document.getElementById('asoboTimerRingFg');
  icon.classList.remove('playing');
  icon.textContent = '▶';
  joelLine.classList.add('show');
  try { bgm.pause(); } catch (e) {}
  ring.style.transition = 'none';
  ring.style.strokeDashoffset = '0';
  playAsoboSe(ASOBO_SFX.timerEnd);
  playAsoboVoice(pickAtFindDoneAudio());
  recordAsoboPlayed();
}

function startAsoboTimer() {
  const ring = document.getElementById('asoboTimerRingFg');
  const icon = document.getElementById('asoboTimerPlayIcon');
  const joelLine = document.getElementById('asoboJoelLine');
  const bgm = document.getElementById('asoboTimerBgm');
  if (!ring) return;
  joelLine.classList.remove('show');
  icon.classList.add('playing');
  icon.textContent = '⏸';
  ring.style.transition = 'none';
  ring.style.strokeDashoffset = String(ASOBO_TIMER_CIRCUMFERENCE);
  void ring.offsetWidth;
  clearTimeout(asoboTimerTimeout);
  asoboTimerRunning = true;
  const startCountdown = () => {
    if (!asoboTimerRunning) return;
    ring.style.transition = 'stroke-dashoffset 60s linear';
    ring.style.strokeDashoffset = '0';
    try { bgm.src = ASOBO_SFX.timerBgm; bgm.currentTime = 0; bgm.play().catch(() => {}); } catch (e) {}
    asoboTimerTimeout = setTimeout(() => {
      completeAsoboTimer();
    }, 60000);
  };
  playAsoboVoice(currentFindItem ? currentFindItem.audio : null, startCountdown);
}

let asoboRiddleTimeout = null;
let currentRiddleItem = null;

function drawAsoboRiddle() {
  const wrap = document.getElementById('asoboRiddleResult');
  const inner = document.getElementById('asoboRiddleResultInner');
  wrap.classList.add('show');
  inner.innerHTML = '<div class="asobo-riddle-thinking">考え中<span>.</span><span>.</span><span>.</span></div>';
  clearTimeout(asoboRiddleTimeout);
  asoboRiddleTimeout = setTimeout(() => {
    const r = AT_RIDDLE[Math.floor(Math.random() * AT_RIDDLE.length)];
    currentRiddleItem = r;
    inner.innerHTML = `
    <div class="at-riddle-flip" onclick="toggleRiddleFlip(this)">
      <div class="at-riddle-flip-inner">
        <div class="at-riddle-face front">
          <div class="at-riddle-q">${r.en}</div>
          <div class="at-riddle-ja">${r.ja}</div>
          <div class="at-riddle-hint">タップしてこたえを見る</div>
          <button class="at-riddle-play" onclick="playAtRiddle(this,event)">▶</button>
        </div>
        <div class="at-riddle-face back">
          <div class="at-riddle-answer-label">こたえ</div>
          <div class="at-riddle-answer">${r.answer}</div>
        </div>
      </div>
    </div>`;
    autoPlayAtRiddleQuestion(r);
  }, 800);
}

function autoPlayAtRiddleQuestion(r) {
  const btn = document.querySelector('#asoboRiddleResultInner .at-riddle-play');
  const setPlaying = (playing) => {
    if (!btn) return;
    btn.classList.toggle('playing', playing);
    btn.textContent = playing ? '⏸' : '▶';
  };
  setPlaying(true);
  if (r && r.audio) {
    playAsoboVoice(r.audio, () => setPlaying(false));
  } else {
    setTimeout(() => setPlaying(false), 3500);
  }
}

function toggleRiddleFlip(card) {
  card.classList.toggle('flipped');
  if (card.classList.contains('flipped')) {
    card.classList.remove('at-riddle-flip-ring');
    void card.offsetWidth;
    card.classList.add('at-riddle-flip-ring');
    setTimeout(() => card.classList.remove('at-riddle-flip-ring'), 650);
    const se = document.getElementById('asoboSePlayer');
    try { se.pause(); se.currentTime = 0; } catch (e) {}
    playAsoboSe(ASOBO_SFX.riddleFlip);
    recordAsoboPlayed();
    if (currentRiddleItem) {
      playAsoboSe2(ASOBO_SFX.riddleCorrect);
      const answerSrc = currentRiddleItem.answerAudio;
      playAsoboVoice(answerSrc, null, (err) => {
        console.error('answerAudio再生失敗', answerSrc, err);
        showToast('音声エラー: ' + (err && err.name ? err.name : 'unknown') + ' / ' + answerSrc.split('/').pop());
      });
    }
  }
}

function playAtArchiveItem(btn) {
  const wasPlaying = btn.classList.contains('playing');
  document.querySelectorAll('.at-archive-play.playing, .at-riddle-play.playing').forEach(b => {
    b.classList.remove('playing'); b.textContent = '▶';
  });
  if (!wasPlaying) {
    btn.classList.add('playing'); btn.textContent = '⏸';
    setTimeout(() => { btn.classList.remove('playing'); btn.textContent = '▶'; }, 4000);
  }
}

function playAtRiddle(btn, evt) {
  if (evt) evt.stopPropagation();
  const wasPlaying = btn.classList.contains('playing');
  document.querySelectorAll('.at-archive-play.playing, .at-riddle-play.playing').forEach(b => {
    b.classList.remove('playing'); b.textContent = '▶';
  });
  const voice = document.getElementById('asoboVoicePlayer');
  if (wasPlaying) {
    try { voice.pause(); voice.onended = null; } catch (e) {}
    return;
  }
  btn.classList.add('playing'); btn.textContent = '⏸';
  const reset = () => { btn.classList.remove('playing'); btn.textContent = '▶'; };
  const src = currentRiddleItem ? currentRiddleItem.audio : null;
  if (src) {
    playAsoboVoice(src, reset);
  } else {
    setTimeout(reset, 3500);
  }
}


// Active Time（探し物ミッション／なぞなぞクイズ）
// ========================
const AT_FIND = [
  { axis: 'カラー', en: 'Find something red!', ja: '赤いものを探してみよう', audio: 'audio/asobo_audio/find_red.mp3' },
  { axis: 'カラー', en: 'Find something blue!', ja: '青いものを探してみよう', audio: 'audio/asobo_audio/find_blue.mp3' },
  { axis: 'カラー', en: 'Find something yellow!', ja: '黄色いものを探してみよう', audio: 'audio/asobo_audio/find_yellow.mp3' },
  { axis: 'カラー', en: 'Find something green!', ja: '緑のものを探してみよう', audio: 'audio/asobo_audio/find_green.mp3' },
  { axis: 'カウント', en: 'Find three round things!', ja: '丸いものを3つ探してみよう', audio: 'audio/asobo_audio/find_three_round.mp3' },
  { axis: 'カウント', en: 'Find two little things!', ja: '小さいものを2つ探してみよう', audio: 'audio/asobo_audio/find_two_little.mp3' },
  { axis: 'カウント', en: 'Find one big thing!', ja: '大きいものを1つ探してみよう', audio: 'audio/asobo_audio/find_one_big.mp3' },
  { axis: 'サウンド', en: 'Find something that makes a sound!', ja: '音が出るものを探してみよう', audio: 'audio/asobo_audio/find_sound.mp3' },
  { axis: 'サウンド', en: 'Find something loud!', ja: '大きな音が出るものを探してみよう', audio: 'audio/asobo_audio/find_loud.mp3' },
  { axis: 'サウンド', en: 'Find something quiet!', ja: '小さな音が出るものを探してみよう', audio: 'audio/asobo_audio/find_quiet.mp3' },
  { axis: 'ロケーション', en: 'Find something under the table!', ja: 'テーブルの下にあるものを探してみよう', audio: 'audio/asobo_audio/find_under_table.mp3' },
  { axis: 'ロケーション', en: 'Find something near the window!', ja: '窓のそばにあるものを探してみよう', audio: 'audio/asobo_audio/find_near_window.mp3' },
  { axis: 'ロケーション', en: 'Find something on the floor!', ja: '床の上にあるものを探してみよう', audio: 'audio/asobo_audio/find_floor.mp3' },
  { axis: 'テクスチャー', en: 'Find something soft!', ja: 'やわらかいものを探してみよう', audio: 'audio/asobo_audio/find_soft.mp3' },
  { axis: 'テクスチャー', en: 'Find something hard!', ja: 'かたいものを探してみよう', audio: 'audio/asobo_audio/find_hard.mp3' },
  { axis: 'テクスチャー', en: 'Find something smooth!', ja: 'つるつるしているものを探してみよう', audio: 'audio/asobo_audio/find_smooth.mp3' },
  { axis: 'カテゴリー', en: 'Find something you can eat!', ja: '食べられるものを探してみよう', audio: 'audio/asobo_audio/find_eat.mp3' },
  { axis: 'カテゴリー', en: 'Find something you can wear!', ja: '着られるものを探してみよう', audio: 'audio/asobo_audio/find_wear.mp3' },
  { axis: 'カテゴリー', en: 'Find something you can read!', ja: '読めるものを探してみよう', audio: 'audio/asobo_audio/find_read.mp3' },
];
const AT_FIND_DONE_AUDIO = [
  'audio/asobo_audio/find_done_1.mp3',
  'audio/asobo_audio/find_done_2.mp3',
  'audio/asobo_audio/find_done_3.mp3',
  'audio/asobo_audio/find_done_4.mp3',
  'audio/asobo_audio/find_done_5.mp3',
  'audio/asobo_audio/find_done_6.mp3',
];
function pickAtFindDoneAudio() {
  return AT_FIND_DONE_AUDIO[Math.floor(Math.random() * AT_FIND_DONE_AUDIO.length)];
}
const AT_RIDDLE = [
  { axis: 'なぞなぞ', en: 'I say moo. What am I?', ja: 'モーって鳴くよ。私は誰？', answer: 'cow', audio: 'audio/asobo_audio/riddle_cow.mp3', answerAudio: 'audio/asobo_audio/riddle_ans_cow.mp3' },
  { axis: 'なぞなぞ', en: 'I say woof. What am I?', ja: 'ワンって鳴くよ。私は誰？', answer: 'dog', audio: 'audio/asobo_audio/riddle_dog.mp3', answerAudio: 'audio/asobo_audio/riddle_ans_dog.mp3' },
  { axis: 'なぞなぞ', en: 'I am yellow and I can fly. I also say bzzz. What am I?', ja: '黄色くて飛べるよ。ブーンって鳴くよ。私は誰？', answer: 'bee', audio: 'audio/asobo_audio/riddle_bee.mp3', answerAudio: 'audio/asobo_audio/riddle_ans_bee.mp3' },
  { axis: 'なぞなぞ', en: 'I am big and gray. I have a long nose. What am I?', ja: '大きくて灰色。長いお鼻があるよ。私は誰？', answer: 'elephant', audio: 'audio/asobo_audio/riddle_elephant.mp3', answerAudio: 'audio/asobo_audio/riddle_ans_elephant.mp3' },
  { axis: 'なぞなぞ', en: 'I am orange with black stripes. What am I?', ja: 'オレンジ色に黒いしましまがあるよ。私は誰？', answer: 'tiger', audio: 'audio/asobo_audio/riddle_tiger.mp3', answerAudio: 'audio/asobo_audio/riddle_ans_tiger.mp3' },
];
const ASOBO_SFX = {
  gachaDraw: 'audio/asobo_audio/se_gacha_draw.mp3',
  timerBgm: 'audio/asobo_audio/bgm_timer_loop.mp3',
  timerEnd: 'audio/asobo_audio/se_timer_end.mp3',
  riddleFlip: 'audio/asobo_audio/se_riddle_flip.mp3',
  riddleCorrect: 'audio/asobo_audio/se_riddle_correct.mp3',
};
let atMode = 'find';
let atIndex = 0;
let atPlaying = false;
let atDoneToday = false;

function getAtData() { return atMode === 'find' ? AT_FIND : AT_RIDDLE; }

function renderAtQuestion() {
  const data = getAtData();
  const item = data[atIndex % data.length];
  document.getElementById('atAxisTag').textContent = item.axis;
  document.getElementById('atQuestion').textContent = item.en;
  document.getElementById('atQuestionJa').textContent = item.ja;
}

function switchAtMode(mode) {
  atMode = mode;
  atIndex = 0;
  document.getElementById('atModeFind').classList.toggle('active', mode === 'find');
  document.getElementById('atModeRiddle').classList.toggle('active', mode === 'riddle');
  renderAtQuestion();
}

function nextAtQuestion() {
  atIndex++;
  renderAtQuestion();
}

function toggleActiveTime() {
  atPlaying = !atPlaying;
  const icon = document.getElementById('atPlayIcon');
  const title = document.getElementById('atPlayTitle');
  if (atPlaying) {
    icon.textContent = '⏸';
    title.textContent = '再生中…';
    setTimeout(() => {
      if (!atPlaying) return;
      atPlaying = false;
      icon.textContent = '▶';
      title.textContent = 'Jayの声を聞く';
    }, 1800);
  } else {
    icon.textContent = '▶';
    title.textContent = 'Jayの声を聞く';
  }
}

function completeActiveTime() {
  const btn = document.getElementById('atDoneBtn');
  if (atDoneToday) {
    showToast('また明日も遊んでね！');
    return;
  }
  atDoneToday = true;
  btn.classList.add('done');
  btn.innerHTML = '<span><img class="icon-img" style="width:20px;height:20px;" src="icons/icon_func_check.png" alt="チェック"></span><span>今日もできたね！</span>';
  showToast('Jayからの褒め声、再生中… 🎉');
}

// ========================
// ルーティン：困った時のフレーズ集
// ========================
const ROUTINE_CATEGORIES = [
  {
    id: 'morning', icon: '🌅', image: 'routine_images/routine_morning.jpg', title: 'Morning Time', sub: '朝の支度タイムに使うフレーズ',
    scenes: [
      { label: '起床直後', en: 'Good morning! Did you sleep well?', reply: '"Yes!" / "I\'m sleepy."', audio: 'audio/routine_audio/morning_01.mp3' },
      { label: '着替え中', en: "Let's get dressed! Where's your shirt?", reply: '"Here!" / "I found it!"', audio: 'audio/routine_audio/morning_02.mp3' },
      { label: '朝ごはん中', en: 'Are you hungry? What do you want to eat?', reply: '"Yes!" / "Eggs, please!"', audio: 'audio/routine_audio/morning_03.mp3' },
      { label: '歯磨き・洗顔', en: 'Time to brush your teeth!', reply: '"Okay!" / "I don\'t want to!"', audio: 'audio/routine_audio/morning_04.mp3' },
      { label: '出発前のあいさつ', en: 'Have a good day! See you later!', reply: '"See you!" / "Bye bye!"', audio: 'audio/routine_audio/morning_05.mp3' },
    ],
  },
  {
    id: 'beforebed', icon: '🌙', image: 'routine_images/routine_bedtime.jpg', title: 'Before Bed', sub: '寝る前の時間に使うフレーズ',
    scenes: [
      { label: '絵本を読む前', en: 'Let\'s read a book together!', reply: '"Yay!" / "This one!"', audio: 'audio/routine_audio/beforebed_01.mp3' },
      { label: '歯磨き確認', en: 'Did you brush your teeth?', reply: '"Yes!" / "Not yet!"', audio: 'audio/routine_audio/beforebed_02.mp3' },
      { label: 'おやすみのあいさつ', en: 'Good night! Sweet dreams!', reply: '"Good night!" / "Love you!"', audio: 'audio/routine_audio/beforebed_03.mp3' },
    ],
  },
  {
    id: 'afterschool', icon: '🎒', image: 'routine_images/routine_homecoming.jpg', title: 'おかえり', sub: '保育園・幼稚園から帰った後に使うフレーズ',
    scenes: [
      { label: 'ただいまのあいさつ', en: 'Welcome home! How was your day?', reply: '"Good!" / "Fun!"', audio: 'audio/routine_audio/afterschool_01.mp3' },
      { label: '今日は何した？', en: 'What did you do today?', reply: '"I played!" / "We sang songs!"', audio: 'audio/routine_audio/afterschool_02.mp3' },
      { label: 'おやつ前', en: 'Do you want a snack?', reply: '"Yes please!" / "I\'m hungry!"', audio: 'audio/routine_audio/afterschool_03.mp3' },
    ],
  },
  {
    id: 'mealtime', icon: '🍽', image: 'routine_images/routine_mealtime.jpg', title: '食事タイム', sub: '食事の時間に使うフレーズ',
    scenes: [
      { label: '食事前のあいさつ', en: "Let's eat!", reply: '"Yay!" / "I\'m hungry!"', audio: 'audio/routine_audio/mealtime_01.mp3' },
      { label: 'もっと食べる？', en: 'Do you want more?', reply: '"Yes please!" / "No, thank you!"', audio: 'audio/routine_audio/mealtime_02.mp3' },
      { label: 'ごちそうさま', en: 'All done! Great job eating!', reply: '"All done!" / "Yummy!"', audio: 'audio/routine_audio/mealtime_03.mp3' },
    ],
  },
];

function renderRoutineCatGrid() {
  const grid = document.getElementById('routineCatGrid');
  if (!grid) return;
  grid.innerHTML = ROUTINE_CATEGORIES.map(cat => `
    <div class="routine-cat-card" onclick="openRoutineModal('${cat.id}')">
      <img class="routine-cat-image" src="${cat.image}" alt="${cat.title}">
      <div class="routine-cat-body">
        <div class="routine-cat-title">${cat.title}</div>
        <div class="routine-cat-sub">${cat.sub}</div>
        <div class="routine-cat-count"><img class="icon-img" style="width:18px;height:18px;" src="icons/icon_func_list.png" alt="リスト"> ${cat.scenes.length}フレーズ</div>
      </div>
    </div>
  `).join('');
}

function openRoutineModal(catId) {
  const cat = ROUTINE_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;
  document.getElementById('routineModalImage').src = cat.image;
  document.getElementById('routineModalImage').alt = cat.title;
  document.getElementById('routineModalTitle').textContent = cat.title;
  document.getElementById('routineModalSub').textContent = cat.sub;
  document.getElementById('routineModalBody').innerHTML = cat.scenes.map(s => `
    <div class="routine-scene-card">
      <div class="routine-scene-label">${s.label}</div>
      <div class="routine-scene-row">
        <div class="routine-scene-play" onclick="playRoutineScene(this, '${s.audio}')">▶</div>
        <div class="routine-scene-phrase">${s.en}</div>
      </div>
      <div class="routine-scene-reply">キッズの返答例：<span>${s.reply}</span></div>
    </div>
  `).join('');
  document.getElementById('routineModal').classList.add('open');
}

function closeRoutineModal() {
  document.getElementById('routineModal').classList.remove('open');
  routineAudioEl.pause();
  if (routineActiveBtn) { routineActiveBtn.textContent = '▶'; routineActiveBtn.dataset.playing = '0'; routineActiveBtn = null; }
}

const routineAudioEl = new Audio();
registerAudio(routineAudioEl);
let routineActiveBtn = null;

function playRoutineScene(btn, src) {
  if (routineActiveBtn && routineActiveBtn !== btn) {
    routineActiveBtn.textContent = '▶';
    routineActiveBtn.dataset.playing = '0';
  }
  if (btn.dataset.playing === '1') {
    routineAudioEl.pause();
    btn.textContent = '▶';
    btn.dataset.playing = '0';
    routineActiveBtn = null;
    return;
  }
  routineActiveBtn = btn;
  btn.dataset.playing = '1';
  btn.textContent = '⏸';
  routineAudioEl.onended = null;
  routineAudioEl.onerror = null;
  routineAudioEl.pause();
  routineAudioEl.src = src;
  routineAudioEl.currentTime = 0;
  const reset = () => {
    btn.textContent = '▶';
    btn.dataset.playing = '0';
    if (routineActiveBtn === btn) routineActiveBtn = null;
  };
  routineAudioEl.onended = reset;
  routineAudioEl.onerror = reset;
  try {
    const p = routineAudioEl.play();
    if (p && typeof p.catch === 'function') { p.catch(reset); }
  } catch (e) { reset(); }
}


// ========================
// しる：Jayの発見（Animal / Food / 天気）本のUI
// ========================
// フォルダ構成：shiru_book/audio/{category}/{topicId}.mp3、shiru_book/illustration/covers/（本の表紙、既存ファイル名のまま移動）、
// shiru_book/illustration/topics/{topicId}/{topicId}_cover.png（トピック表紙・カード用フォールバック）、
// shiru_book/illustration/topics/{topicId}/{topicId}_1.png〜（各Did you know？のイラスト、factsの並び順と対応）。
// カテゴリが増えても同じ規則で置ける。イラストが未整備のトピックはtopic.imageのみでOK（fact.imageは省略可、topic.imageにフォールバックする）。
const SHIRU_CATEGORIES = [
  { id: 'animal', title: 'Animal', sub: 'どうぶつ', image: 'shiru_book/illustration/covers/shiru_animal.png' },
  { id: 'food', title: 'Food', sub: 'たべもの', image: 'shiru_book/illustration/covers/shiru_food.png' },
  { id: 'weather', title: '天気', sub: 'てんき', image: 'shiru_book/illustration/covers/shiru_weather.png' },
];

const SHIRU_TOPICS = [
  {
    id: 'duck', category: 'animal', titleEn: 'Duck', titleJa: 'アヒル', dateAdded: '2026-08-18',
    image: 'shiru_book/illustration/topics/duck/duck_cover.png',
    audio: 'shiru_book/audio/animal/duck.mp3',
    facts: [
      { en: "A duck's feathers never get wet.", ja: 'アヒルの羽根は、水に濡れないんだって。', start: 6.558, image: 'shiru_book/illustration/topics/duck/duck_1.png' },
      { en: 'Ducks can swim and fly really fast.', ja: 'アヒルは泳げるし、すごく速く飛べるんだって。', start: 17.050, image: 'shiru_book/illustration/topics/duck/duck_2.png' },
      { en: 'Ducks eat grass, leaves, bugs, and even small fish!', ja: 'アヒルは草や葉っぱ、虫や小さな魚まで食べるんだって。', start: 28.394, image: 'shiru_book/illustration/topics/duck/duck_3.png' },
      { en: 'A duck says "Quack, Quack."', ja: 'アヒルは「クワッ、クワッ」って鳴くよ。', start: 38.929, image: 'shiru_book/illustration/topics/duck/duck_4.png' },
    ],
  },
  {
    id: 'turtle', category: 'animal', titleEn: 'Turtle', titleJa: 'カメ', dateAdded: '2026-08-25',
    image: 'shiru_book/illustration/topics/turtle.png',
    audio: 'shiru_book/audio/animal/turtle.mp3',
    facts: [
      { en: 'Turtles come in many different sizes.', ja: 'カメには小さい子も、すごく大きい子もいるんだって。', start: 0 },
      { en: 'Turtles can live for up to 150 years!', ja: 'カメは150歳まで生きることもあるんだって。', start: 10 },
      { en: 'Turtles love vegetables, small fish, and worms.', ja: 'カメは野菜や小さな魚、ミミズが好きなんだって。', start: 20 },
    ],
  },
  {
    id: 'icecream', category: 'food', titleEn: 'Ice Cream', titleJa: 'アイスクリーム', dateAdded: '2026-08-20',
    image: 'shiru_book/illustration/topics/icecream.png',
    audio: 'shiru_book/audio/food/icecream.mp3',
    facts: [
      { en: 'It takes about 50 licks to finish one scoop.', ja: 'アイス1スクープを食べ終わるまで、なめる回数は約50回なんだって。', start: 0 },
      { en: "Eat it too fast and your head might hurt!", ja: '急いで食べると頭が痛くなっちゃうから気をつけて。', start: 10 },
      { en: 'Some people even eat bacon ice cream!', ja: 'ベーコン味のアイスを食べる人もいるんだって。', start: 20 },
    ],
  },
];

function getTodayShiruDateKey() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

function getShiruTopicsByCategory(catId) {
  return SHIRU_TOPICS.filter(t => t.category === catId).sort((a, b) => b.dateAdded.localeCompare(a.dateAdded));
}

const SHIRU_OPENED_KEY_PREFIX = 'enverly_shiru_opened_';
function getShiruOpenedSet() {
  const key = SHIRU_OPENED_KEY_PREFIX + getTodayShiruDateKey();
  try {
    const raw = localStorage.getItem(key);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) { return new Set(); }
}
function markShiruOpened(catId) {
  const key = SHIRU_OPENED_KEY_PREFIX + getTodayShiruDateKey();
  const set = getShiruOpenedSet();
  if (set.has(catId)) return;
  set.add(catId);
  try { localStorage.setItem(key, JSON.stringify([...set])); } catch (e) {}
}

const SHIRU_REVEALED_KEY = 'enverly_shiru_revealed';
function getShiruRevealedSet() {
  try {
    const raw = localStorage.getItem(SHIRU_REVEALED_KEY);
    return raw ? new Set(JSON.parse(raw)) : new Set();
  } catch (e) { return new Set(); }
}
function markShiruFactRevealed(factKey) {
  const set = getShiruRevealedSet();
  if (set.has(factKey)) return;
  set.add(factKey);
  try { localStorage.setItem(SHIRU_REVEALED_KEY, JSON.stringify([...set])); } catch (e) {}
}

function renderShiruCatGrid() {
  const grid = document.getElementById('shiruCatGrid');
  if (!grid) return;
  const todayKey = getTodayShiruDateKey();
  const opened = getShiruOpenedSet();
  const cardsHtml = SHIRU_CATEGORIES.map(cat => {
    const topics = getShiruTopicsByCategory(cat.id);
    const factCount = topics.reduce((sum, t) => sum + t.facts.length, 0);
    const isNewToday = topics.length > 0 && topics[0].dateAdded === todayKey && !opened.has(cat.id);
    const ribbon = isNewToday ? '<div class="shiru-cat-ribbon"></div>' : '';
    return `
      <div class="shiru-cat-card" onclick="openShiruBookModal('${cat.id}')">
        <div class="shiru-cat-spine spine-${cat.id}"></div>
        ${ribbon}
        <div class="shiru-cat-frame">
          <div class="shiru-cat-frame-inner">
            <img class="shiru-cat-image" src="${cat.image}" alt="${cat.title}">
          </div>
        </div>
        <div class="shiru-cat-body">
          <div class="shiru-cat-title">${cat.title}</div>
          <div class="shiru-cat-sub">${cat.sub}</div>
          <div class="shiru-cat-count"><img class="icon-img" style="width:18px;height:18px;" src="icons/icon_func_list.png" alt="リスト"> ${factCount}個知った</div>
        </div>
      </div>
    `;
  }).join('');
  const soonCard = `
    <div class="shiru-cat-card soon">
      <div class="shiru-cat-spine"></div>
      <div class="shiru-cat-frame">
        <div class="shiru-cat-frame-inner">
          <div class="shiru-cat-image"><span class="shiru-cat-image-mark">？</span></div>
        </div>
      </div>
      <div class="shiru-cat-body">
        <div class="shiru-cat-title">また今度</div>
        <div class="shiru-cat-sub">新しいジャンル準備中</div>
      </div>
    </div>
  `;
  grid.innerHTML = cardsHtml + soonCard;
}

let shiruCurrentCategory = null;
let shiruCurrentTopic = null;

function openShiruBookModal(catId) {
  const cat = SHIRU_CATEGORIES.find(c => c.id === catId);
  if (!cat) return;
  shiruCurrentCategory = cat;
  markShiruOpened(catId);
  renderShiruCatGrid();
  earnStamp('shiru');

  document.getElementById('shiruBookHeaderTitle').textContent = cat.title;
  document.getElementById('shiruCoverImage').src = cat.image;
  document.getElementById('shiruCoverTitle').textContent = cat.title;
  document.getElementById('shiruCoverSub').textContent = cat.sub;
  document.getElementById('shiruCoverSpine').className = 'shiru-cover-spine spine-' + catId;

  ['shiruCoverPage', 'shiruPage1', 'shiruPage2', 'shiruPage3', 'shiruPage4', 'shiruPage5'].forEach(id => {
    document.getElementById(id).style.transform = 'rotateY(0deg)';
  });
  const tocEl = document.getElementById('shiruTocScreen');
  const gridEl = document.getElementById('shiruGridScreen');
  tocEl.style.opacity = '0'; tocEl.style.pointerEvents = 'none';
  gridEl.style.opacity = '0'; gridEl.style.pointerEvents = 'none';

  document.getElementById('shiruBookModal').classList.add('open');

  requestAnimationFrame(() => {
    setTimeout(() => {
      document.getElementById('shiruCoverPage').style.transform = 'rotateY(-170deg)';
      ['shiruPage1', 'shiruPage2', 'shiruPage3', 'shiruPage4', 'shiruPage5'].forEach((id, i) => {
        setTimeout(() => {
          document.getElementById(id).style.transform = `rotateY(${-160 - i * 4}deg)`;
        }, i * 90);
      });
      setTimeout(() => renderShiruToc(cat), 560);
    }, 80);
  });
}

function topicHasNewToday(topic) {
  const todayKey = getTodayShiruDateKey();
  if (topic.dateAdded === todayKey) return true;
  return topic.facts.some(f => f.dateAdded === todayKey);
}

function renderShiruToc(cat) {
  const topics = getShiruTopicsByCategory(cat.id);
  const opened = getShiruOpenedSet();
  document.getElementById('shiruTocTitle').textContent = `${cat.title} のもくじ`;
  const listEl = document.getElementById('shiruTocList');
  listEl.innerHTML = topics.length > 0 ? topics.map(t => {
    const isNew = topicHasNewToday(t) && !opened.has(cat.id + '_' + t.id);
    return `
    <div class="shiru-toc-item" onclick="openShiruTopic('${t.id}')">
      <div class="shiru-toc-text-wrap">
        <div class="shiru-toc-text">${t.titleEn}</div>
        <div class="shiru-toc-text-ja">${t.titleJa}</div>
      </div>
      ${isNew ? '<div class="shiru-toc-new">New</div>' : ''}
      <div class="shiru-toc-count">${t.facts.length}個</div>
    </div>
  `;
  }).join('') : `<div class="hint-box">まだこのジャンルの発見はないよ。火・木のお楽しみに。</div>`;
  const tocEl = document.getElementById('shiruTocScreen');
  tocEl.style.opacity = '1';
  tocEl.style.pointerEvents = 'auto';
}

function openShiruTopic(topicId) {
  const topic = SHIRU_TOPICS.find(t => t.id === topicId);
  if (!topic) return;
  shiruCurrentTopic = topic;
  markShiruOpened(topic.category + '_' + topic.id);
  const tocEl = document.getElementById('shiruTocScreen');
  const gridEl = document.getElementById('shiruGridScreen');
  tocEl.style.opacity = '0'; tocEl.style.pointerEvents = 'none';
  document.getElementById('shiruGridTitle').textContent = topic.titleEn;
  document.getElementById('shiruGridTitleJa').textContent = topic.titleJa;
  renderShiruFactGrid(topic);
  setTimeout(() => {
    gridEl.style.opacity = '1';
    gridEl.style.pointerEvents = 'auto';
  }, 220);
}

function renderShiruFactGrid(topic) {
  const revealed = getShiruRevealedSet();
  const gridEl = document.getElementById('shiruFactGrid');
  gridEl.innerHTML = topic.facts.map((f, i) => {
    const factKey = `${topic.id}_${i}`;
    const isRevealed = revealed.has(factKey);
    const imgSrc = f.image || topic.image;
    return `
      <div class="shiru-fact-card ${isRevealed ? 'revealed' : ''}" data-fact-key="${factKey}" onclick="revealShiruFact('${topic.id}', ${i}, this)">
        <div class="shiru-fact-card-inner">
          <div class="shiru-fact-card-face shiru-fact-card-front">
            <img src="${imgSrc}" alt="">
          </div>
          <div class="shiru-fact-card-face shiru-fact-card-back">
            <img src="${imgSrc}" alt="">
          </div>
        </div>
        <div class="shiru-fact-card-play">▶</div>
      </div>
    `;
  }).join('');
}

function backToShiruToc() {
  document.getElementById('shiruGridScreen').style.opacity = '0';
  document.getElementById('shiruGridScreen').style.pointerEvents = 'none';
  shiruAudioEl.pause();
  setTimeout(() => {
    document.getElementById('shiruTocScreen').style.opacity = '1';
    document.getElementById('shiruTocScreen').style.pointerEvents = 'auto';
  }, 220);
}

function closeShiruBookModal() {
  document.getElementById('shiruBookModal').classList.remove('open');
  shiruAudioEl.pause();
}

const shiruAudioEl = new Audio();
registerAudio(shiruAudioEl);

function revealShiruFact(topicId, factIndex, cardEl) {
  const topic = SHIRU_TOPICS.find(t => t.id === topicId);
  if (!topic) return;
  const fact = topic.facts[factIndex];
  const factKey = `${topicId}_${factIndex}`;

  markShiruFactRevealed(factKey);
  cardEl.classList.add('revealed');

  shiruAudioEl.onended = null;
  shiruAudioEl.onerror = null;
  shiruAudioEl.ontimeupdate = null;
  shiruAudioEl.pause();

  if (fact.audio) {
    shiruAudioEl.src = fact.audio;
    shiruAudioEl.currentTime = 0;
  } else {
    const nextFact = topic.facts[factIndex + 1];
    const endTime = fact.end || (nextFact ? nextFact.start : null);
    shiruAudioEl.src = topic.audio;
    shiruAudioEl.currentTime = fact.start || 0;
    if (endTime) {
      shiruAudioEl.ontimeupdate = () => {
        if (shiruAudioEl.currentTime >= endTime) { shiruAudioEl.pause(); shiruAudioEl.ontimeupdate = null; }
      };
    }
  }
  try {
    const p = shiruAudioEl.play();
    if (p && typeof p.catch === 'function') { p.catch(() => {}); }
  } catch (e) {}
}


// ========================
// 絵本ビューワー
// ========================
const BOOK_DATA = {
  title: 'Sunny Day!',
  levels: ['todler'],
  pagesByLevel: {
    todler: [
      { img: 'books/aug/monthly_book/p1.jpg', phrase: 'This is a duck. Today is a sunny day.', talkPhrase: null, talkPause: 6500, audio: 'audio/book_audio/sunnyday/sunnyday_01.mp3' },
      { img: 'books/aug/monthly_book/p2.jpg', phrase: "It's hot.", talkPhrase: "It's hot.", audio: 'audio/book_audio/sunnyday/sunnyday_02.mp3' },
      { img: 'books/aug/monthly_book/p3.jpg', phrase: "Let's swim!", talkPhrase: "Let's swim!", audio: 'audio/book_audio/sunnyday/sunnyday_03.mp3' },
      { img: 'books/aug/monthly_book/p4.jpg', phrase: 'SPLASH!', talkPhrase: 'SPLASH!', audio: 'audio/book_audio/sunnyday/sunnyday_04.mp3' },
      { img: 'books/aug/monthly_book/p5.jpg', phrase: "It's so fun!", talkPhrase: "It's so fun!", audio: 'audio/book_audio/sunnyday/sunnyday_05.mp3' },
      { img: 'books/aug/monthly_book/p6.jpg', phrase: 'So Sunny!', talkPhrase: 'So Sunny!', audio: 'audio/book_audio/sunnyday/sunnyday_06.mp3' },
      { img: 'books/aug/monthly_book/p7.jpg', phrase: 'Uh oh! Here comes the rain!', talkPhrase: null, talkPause: 6000, audio: 'audio/book_audio/sunnyday/sunnyday_07.mp3' },
      { img: 'books/aug/monthly_book/p8.jpg', phrase: "But that's OK. I'm already wet.", talkPhrase: "But that's OK. I'm already wet.", talkPause: 6500, audio: 'audio/book_audio/sunnyday/sunnyday_08.mp3' },
    ]
  }
};
Object.defineProperty(BOOK_DATA, 'pages', {
  get() {
    return BOOK_DATA.pagesByLevel[getBookLevel()] || BOOK_DATA.pagesByLevel[BOOK_DATA.levels[0]];
  }
});

// ========================
// 絵本レベル（とどらー/きんだー）
// ========================
const BOOK_LEVEL_LABELS = { todler: { label: 'とどらー', badgeClass: 'book-level-badge-todler' }, kinder: { label: 'きんだー', badgeClass: 'book-level-badge-kinder' } };
const BOOK_LEVEL_STORAGE_KEY = 'enverly_book_level';

function getBookLevel() {
  let stored = null;
  try { stored = localStorage.getItem(BOOK_LEVEL_STORAGE_KEY); } catch (e) {}
  if (stored && BOOK_DATA.levels.includes(stored)) return stored;
  return BOOK_DATA.levels[0];
}
function setBookLevel(level) {
  if (!BOOK_DATA.levels.includes(level)) return;
  try { localStorage.setItem(BOOK_LEVEL_STORAGE_KEY, level); } catch (e) {}
  bvCurrentPage = 0;
  renderBookLevelToggles();
  if (document.getElementById('bookViewerModal') && document.getElementById('bookViewerModal').classList.contains('open')) {
    bvRenderPage();
    bvBuildIndicator();
  }
}
function renderBookLevelToggles() {
  document.querySelectorAll('.book-level-toggle').forEach(wrap => {
    if (BOOK_DATA.levels.length <= 1) { wrap.style.display = 'none'; return; }
    wrap.style.display = 'flex';
    const current = getBookLevel();
    wrap.querySelectorAll('.book-level-pill').forEach(pill => {
      pill.classList.toggle('active', pill.dataset.level === current);
    });
  });
}

const bvAudioEl = new Audio();
registerAudio(bvAudioEl);
function bvPlayAudio(src, onEnded) {
  bvAudioEl.onended = null;
  bvAudioEl.onerror = null;
  try { bvAudioEl.pause(); } catch (e) {}
  if (!src) { if (onEnded) onEnded(); return; }
  bvAudioEl.src = src;
  bvAudioEl.currentTime = 0;
  bvAudioEl.onended = () => { if (onEnded) onEnded(); };
  bvAudioEl.onerror = () => {
    console.warn('[Enverly] 絵本の音声読み込みに失敗:', src);
    if (onEnded) onEnded();
  };
  try {
    const p = bvAudioEl.play();
    if (p && typeof p.catch === 'function') {
      p.catch(() => { if (onEnded) onEnded(); });
    }
  } catch (e) {
    if (onEnded) onEnded();
  }
}
function bvStopAudio() {
  bvAudioEl.onended = null;
  bvAudioEl.onerror = null;
  bvAudioEl.pause();
}

let bvCurrentPage = 0;
let bvMode = null;
let bvTalkTimer = null;
let bvTalkDone = [];
let bvTalkToken = 0;

function openBookModal(mode) {
  bvCurrentPage = 0;
  bvMode = mode;
  bvTalkDone = [];
  document.getElementById('bookViewerModal').classList.add('open');
  bvRenderPage();
  bvBuildIndicator();
  trackEvent('book_open', mode);
  if (mode === 'talk') {
    setTimeout(() => bvStartTalk(), 300);
  } else {
    setTimeout(() => bvStartRead(), 300);
  }
}

function closeBookModal() {
  document.getElementById('bookViewerModal').classList.remove('open');
  if (bvTalkTimer) clearTimeout(bvTalkTimer);
  bvStopAudio();
  bvReadToken++;
  bvTalkToken++;
  document.getElementById('bvTalkBar').classList.remove('active');
  document.getElementById('bvIetaBtn').classList.remove('show');
  document.getElementById('bvModeRow').style.display = 'flex';
}

function bvRenderPage() {
  const page = BOOK_DATA.pages[bvCurrentPage];
  if (!page) return;
  const img = document.getElementById('bvPageImg');
  img.src = page.img;
  document.getElementById('bvTitle').textContent = `Sunny Day!  ${bvCurrentPage + 1} / ${BOOK_DATA.pages.length}`;
  document.getElementById('bvPrev').disabled = bvCurrentPage === 0;
  document.getElementById('bvNext').disabled = bvCurrentPage === BOOK_DATA.pages.length - 1;
  document.querySelectorAll('.bv-dot').forEach((d, i) => {
    d.classList.toggle('active', i === bvCurrentPage);
  });
  bvSyncNavToImage(img);
}

function bvSyncNavToImage(img) {
  const area = document.getElementById('bvPageArea');
  if (!img || !area) return;
  const apply = () => {
    if (!img.naturalWidth || !img.naturalHeight) return;
    const areaW = area.clientWidth, areaH = area.clientHeight;
    const containerRatio = areaW / areaH;
    const imgRatio = img.naturalWidth / img.naturalHeight;
    let top = 0, bottom = 0;
    if (imgRatio > containerRatio) {
      const renderedH = areaW / imgRatio;
      top = bottom = Math.max(0, (areaH - renderedH) / 2);
    }
    document.querySelectorAll('.bv-nav').forEach(btn => {
      btn.style.top = top + 'px';
      btn.style.bottom = bottom + 'px';
    });
  };
  if (img.complete && img.naturalWidth) { apply(); }
  else { img.onload = apply; }
}
window.addEventListener('resize', () => bvSyncNavToImage(document.getElementById('bvPageImg')));

function bvBuildIndicator() {
  const ind = document.getElementById('bvIndicator');
  ind.innerHTML = BOOK_DATA.pages.map((_, i) =>
    `<div class="bv-dot${i === 0 ? ' active' : ''}"></div>`
  ).join('');
}

function bvChangePage(dir) {
  const next = bvCurrentPage + dir;
  if (next < 0 || next >= BOOK_DATA.pages.length) return;
  bvCurrentPage = next;
  bvRenderPage();
  if (bvMode === 'read') {
    if (bvTalkTimer) clearTimeout(bvTalkTimer);
    bvReadToken++;
    bvPlayPageThenAdvance(bvReadToken);
  }
}

let bvTouchStartX = 0;
document.getElementById('bvPageArea').addEventListener('touchstart', e => {
  bvTouchStartX = e.touches[0].clientX;
}, { passive: true });
document.getElementById('bvPageArea').addEventListener('touchend', e => {
  const diff = bvTouchStartX - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) bvChangePage(diff > 0 ? 1 : -1);
});

let bvReadToken = 0;

function bvStartRead() {
  bvMode = 'read';
  bvCurrentPage = 0;
  bvRenderPage();
  document.getElementById('bvTalkBar').classList.remove('active');
  document.getElementById('bvIetaBtn').classList.remove('show');
  document.getElementById('bvModeRow').style.display = 'flex';
  if (bvTalkTimer) clearTimeout(bvTalkTimer);
  bvReadToken++;
  bvPlayPageThenAdvance(bvReadToken);
}

function bvPlayPageThenAdvance(token) {
  const page = BOOK_DATA.pages[bvCurrentPage];
  if (!page) return;
  bvPlayAudio(page.audio, () => {
    if (bvMode !== 'read' || token !== bvReadToken) return;
    if (bvCurrentPage < BOOK_DATA.pages.length - 1) {
      bvTalkTimer = setTimeout(() => {
        if (token !== bvReadToken) return;
        bvCurrentPage++;
        bvRenderPage();
        bvPlayPageThenAdvance(token);
      }, 700);
    } else {
      trackEvent('book_complete', 'read');
    }
  });
}

function bvStartTalk() {
  bvMode = 'talk';
  bvTalkDone = [];
  if (bvTalkTimer) clearTimeout(bvTalkTimer);
  bvStopAudio();
  document.getElementById('bvModeRow').style.display = 'none';
  document.getElementById('bvTalkBar').classList.add('active');
  document.getElementById('bvIetaBtn').classList.remove('show');
  bvCurrentPage = 0;
  bvRenderPage();
  bvTalkToken++;
  bvUpdateTalkProgress();
  bvRunTalkStep(bvTalkToken);
}

let bvAudioCtx = null;
function bvGetAudioCtx() {
  if (!bvAudioCtx) bvAudioCtx = new (window.AudioContext || window.webkitAudioContext)();
  if (bvAudioCtx.state === 'suspended') bvAudioCtx.resume();
  return bvAudioCtx;
}
const bvSfxEl = new Audio();
registerAudio(bvSfxEl);
function bvPlayChime() {
  try {
    bvSfxEl.pause();
    bvSfxEl.src = 'audio/sfx/talking_start.mp3';
    bvSfxEl.currentTime = 0;
    bvSfxEl.onerror = () => bvPlaySynthChime();
    const p = bvSfxEl.play();
    if (p && typeof p.catch === 'function') p.catch(() => bvPlaySynthChime());
  } catch (e) { bvPlaySynthChime(); }
}
function bvPlaySynthChime() {
  try {
    const ctx = bvGetAudioCtx();
    const now = ctx.currentTime;
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.value = freq;
      const start = now + i * 0.1;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(0.32, start + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.001, start + 0.22);
      osc.connect(gain).connect(ctx.destination);
      osc.start(start);
      osc.stop(start + 0.25);
    });
  } catch (e) {}
}
function bvPlayReadyChime() {
  try {
    bvSfxEl.pause();
    bvSfxEl.src = 'audio/sfx/joel_again.mp3';
    bvSfxEl.currentTime = 0;
    bvSfxEl.onerror = () => bvPlaySynthReadyChime();
    const p = bvSfxEl.play();
    if (p && typeof p.catch === 'function') p.catch(() => bvPlaySynthReadyChime());
  } catch (e) { bvPlaySynthReadyChime(); }
}
function bvPlaySynthReadyChime() {
  try {
    const ctx = bvGetAudioCtx();
    const now = ctx.currentTime;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(660, now);
    osc.frequency.exponentialRampToValueAtTime(440, now + 0.18);
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(0.3, now + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + 0.32);
  } catch (e) {}
}

function bvRunTalkStep(token) {
  const page = BOOK_DATA.pages[bvCurrentPage];
  if (!page) return;

  document.getElementById('bvTalkPhrase').textContent = page.talkPhrase || page.phrase;
  document.getElementById('bvTalkStatus').textContent = '🎧 Jayの声を聞いてね';
  bvUpdateTalkProgress();

  bvPlayAudio(page.audio, () => {
    if (bvMode !== 'talk' || token !== bvTalkToken) return;
    bvPlayChime();
    document.getElementById('bvTalkStatus').textContent = '🎤 Your turn! 言ってみよう';
    bvTalkTimer = setTimeout(() => {
      if (token !== bvTalkToken) return;
      bvPlayReadyChime();
      document.getElementById('bvTalkStatus').textContent = '✅ Great! もう一度Jayと一緒に';
      if (!bvTalkDone.includes(bvCurrentPage)) bvTalkDone.push(bvCurrentPage);
      bvUpdateTalkProgress();

      bvPlayAudio(page.audio, () => {
        if (bvMode !== 'talk' || token !== bvTalkToken) return;
        bvTalkTimer = setTimeout(() => {
          if (token !== bvTalkToken) return;
          bvAdvanceTalkPage(token);
        }, 900);
      });
    }, page.talkPause || 4000);
  });
}

function bvAdvanceTalkPage(token) {
  if (bvCurrentPage >= BOOK_DATA.pages.length - 1) {
    document.getElementById('bvTalkPhrase').textContent = '🌟 全部言えたね！';
    document.getElementById('bvTalkStatus').textContent = 'すごい！今日もよく頑張ったよ！';
    document.getElementById('bvIetaBtn').classList.add('show');
    trackEvent('book_complete', 'talk');
    return;
  }
  bvCurrentPage++;
  bvRenderPage();
  bvRunTalkStep(token);
}

function bvUpdateTalkProgress() {
  const prog = document.getElementById('bvTalkProgress');
  prog.innerHTML = BOOK_DATA.pages.map((_, i) => {
    const cls = bvTalkDone.includes(i) ? 'done' : i === bvCurrentPage ? 'current' : '';
    return `<div class="bv-talk-dot ${cls}"></div>`;
  }).join('');
}

function bvIeta() {
  const btn = document.getElementById('bvIetaBtn');
  btn.textContent = '✅ 記録したよ！';
  btn.disabled = true;
  if (typeof recordIeta === 'function') recordIeta();
  setTimeout(() => closeBookModal(), 1500);
}

// ========================
// YouTubeキュレーション
// ========================
function renderYT() {
  const container = document.getElementById('ytCards');
  if (!container) return;
  container.innerHTML = YT_DATA.map(d => `
    <div class="yt-card">
      <div class="yt-card-top">
        <div class="yt-thumb">
          <img src="https://img.youtube.com/vi/${d.videoId}/hqdefault.jpg" alt="${d.title}">
        </div>
        <div class="yt-body">
          <div class="yt-title">${d.title}</div>
          <div class="yt-channel">${d.when} ・ ${d.age}</div>
        </div>
        <a class="yt-cta" href="${d.url}" target="_blank" rel="noopener">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="#E24B4A"><path d="M8 5v14l11-7z"/></svg>
          <span>見る</span>
        </a>
      </div>
      <div class="yt-tip"><img class="icon-img" style="width:16px;height:16px;flex-shrink:0;" src="icons/icon_func_idea.png" alt="ヒント">${d.tip}</div>
    </div>
  `).join('');
}
