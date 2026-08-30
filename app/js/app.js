// ══════════════════════════════════════════════════════════════════════════════
// Living Motion Coach PWA — v2
// ══════════════════════════════════════════════════════════════════════════════

// ── Daily motivational quotes ─────────────────────────────────────────────────
const DAILY_QUOTES = [
  { text: 'Не важно, как медленно ты идёшь — главное, что ты не останавливаешься.', author: '— Конфуций', emoji: '🐢' },
  { text: 'Боль, которую ты чувствуешь сегодня — это сила, которую ты почувствуешь завтра.', author: '— Arnold Schwarzenegger', emoji: '💪' },
  { text: 'Результат не приходит за ночь. Каждый день — это вклад в будущую версию себя.', author: '— Living Motion', emoji: '📈' },
  { text: 'Лучшее вложение — вложение в себя. Тренируй тело, и оно отблагодарит тебя.', author: '— Warren Buffett', emoji: '🏆' },
  { text: 'Твоё тело способно на это. Убеди в этом свой разум.', author: '— Unknown', emoji: '🧠' },
  { text: 'Успех — это сумма небольших усилий, повторяемых день за днём.', author: '— Robert Collier', emoji: '✨' },
  { text: 'Если устал — отдохни. Но не сдавайся.', author: '— Unknown', emoji: '🌙' },
  { text: 'Чемпионы — не те, кто никогда не падает, а те, кто встаёт каждый раз.', author: '— Muhammad Ali', emoji: '🥊' },
  { text: 'Дисциплина важнее мотивации. Мотивация приходит и уходит — дисциплина остаётся.', author: '— Jocko Willink', emoji: '⚡' },
  { text: 'Один год усердных тренировок изменит тебя до неузнаваемости.', author: '— Living Motion', emoji: '🔥' },
  { text: 'Привычки формируют характер, а характер — судьбу.', author: '— Aristotle', emoji: '🌟' },
  { text: 'Не сравнивай себя с другими. Сравнивай себя со вчерашней версией себя.', author: '— Unknown', emoji: '🪞' },
  { text: 'Каждая тренировка — это победа над прокрастинацией.', author: '— Living Motion', emoji: '🎯' },
  { text: 'Сила не измеряется весом штанги. Она измеряется тем, сколько раз ты пришёл, когда не хотел.', author: '— Unknown', emoji: '🏋️' },
];

function renderDailyQuote() {
  const dayIdx = Math.floor(Date.now() / 86400000) % DAILY_QUOTES.length;
  const q = DAILY_QUOTES[dayIdx];
  const el = document.getElementById('quote-text');
  const ae = document.getElementById('quote-author');
  const ee = document.getElementById('quote-emoji');
  if (el) el.textContent = q.text;
  if (ae) ae.textContent = q.author;
  if (ee) ee.textContent = q.emoji;
}

// ── State ─────────────────────────────────────────────────────────────────────
const S = {
  tab:          'dashboard',
  userName:     localStorage.getItem('lmc_name')   || '',
  weekGoal:     +localStorage.getItem('lmc_wg')    || 4,
  waterGoalMl:  +localStorage.getItem('lmc_wg_ml') || 2500,
  kcalGoal:     +localStorage.getItem('lmc_kcal_goal') || 2000,
  heightCm:     +localStorage.getItem('lmc_height')    || 0,
  waterMl:      0,
  streak:       +localStorage.getItem('lmc_streak')|| 0,
  weekWorkouts: 0,
  allWorkouts:  [],
  bodyStats:    [],
  nutritionItems: [],
  deferredPrompt: null,
  log: {
    exerciseName: '', exerciseEmoji: '💪',
    sets: [], restSec: 0, restTimer: null, restPresetSec: 90,
    prevSets: [],   // last session's sets for this exercise
  },
};

// ── Exercise catalogue ────────────────────────────────────────────────────────
const EXERCISES = [
  // Грудь
  { name:'Жим лёжа',             emoji:'🏋️', cat:'Грудь',   bg:'#1A2A4A' },
  { name:'Жим гантелей лёжа',    emoji:'🏋️', cat:'Грудь',   bg:'#1A2A4A' },
  { name:'Разводка гантелей',    emoji:'🏋️', cat:'Грудь',   bg:'#1A2A4A' },
  { name:'Жим на наклон. скамье',emoji:'🏋️', cat:'Грудь',   bg:'#1A2A4A' },
  { name:'Отжимания',            emoji:'🤸', cat:'Грудь',   bg:'#1A2A4A' },
  { name:'Кроссовер в блоке',    emoji:'💪', cat:'Грудь',   bg:'#1A2A4A' },
  // Спина
  { name:'Становая тяга',        emoji:'💪', cat:'Спина',   bg:'#3A1A1A' },
  { name:'Подтягивания',         emoji:'🤸', cat:'Спина',   bg:'#3A1A1A' },
  { name:'Тяга верхнего блока',  emoji:'💪', cat:'Спина',   bg:'#3A1A1A' },
  { name:'Тяга к поясу',         emoji:'🤸', cat:'Спина',   bg:'#3A1A1A' },
  { name:'Тяга гантели в наклоне',emoji:'💪',cat:'Спина',   bg:'#3A1A1A' },
  { name:'Гиперэкстензия',       emoji:'🤸', cat:'Спина',   bg:'#3A1A1A' },
  // Ноги
  { name:'Приседания',           emoji:'🦵', cat:'Ноги',    bg:'#1A3A1A' },
  { name:'Жим ногами',           emoji:'🦵', cat:'Ноги',    bg:'#1A3A1A' },
  { name:'Выпады',               emoji:'🦵', cat:'Ноги',    bg:'#1A3A1A' },
  { name:'Румынская тяга',       emoji:'🦵', cat:'Ноги',    bg:'#1A3A1A' },
  { name:'Разгибание ног',       emoji:'🦵', cat:'Ноги',    bg:'#1A3A1A' },
  { name:'Сгибание ног',         emoji:'🦵', cat:'Ноги',    bg:'#1A3A1A' },
  { name:'Подъём на носки',      emoji:'🦵', cat:'Ноги',    bg:'#1A3A1A' },
  { name:'Ягодичный мост',       emoji:'🦵', cat:'Ноги',    bg:'#1A3A1A' },
  // Плечи
  { name:'Жим штанги стоя',      emoji:'🏋️', cat:'Плечи',  bg:'#2A1A3A' },
  { name:'Жим гантелей сидя',    emoji:'🏋️', cat:'Плечи',  bg:'#2A1A3A' },
  { name:'Тяга к подбородку',    emoji:'💪', cat:'Плечи',  bg:'#2A1A3A' },
  { name:'Махи в стороны',       emoji:'🏋️', cat:'Плечи',  bg:'#2A1A3A' },
  { name:'Махи вперёд',          emoji:'🏋️', cat:'Плечи',  bg:'#2A1A3A' },
  { name:'Обратные разводки',    emoji:'💪', cat:'Плечи',  bg:'#2A1A3A' },
  // Бицепс
  { name:'Сгибание со штангой',  emoji:'💪', cat:'Бицепс',  bg:'#1A2A4A' },
  { name:'Сгибание с гантелями', emoji:'💪', cat:'Бицепс',  bg:'#1A2A4A' },
  { name:'Молотки',              emoji:'💪', cat:'Бицепс',  bg:'#1A2A4A' },
  { name:'Концентрированные',    emoji:'💪', cat:'Бицепс',  bg:'#1A2A4A' },
  // Трицепс
  { name:'Французский жим',      emoji:'💪', cat:'Трицепс', bg:'#2A2A1A' },
  { name:'Разгибание в блоке',   emoji:'💪', cat:'Трицепс', bg:'#2A2A1A' },
  { name:'Отжимания от скамьи',  emoji:'🤸', cat:'Трицепс', bg:'#2A2A1A' },
  { name:'Жим узким хватом',     emoji:'🏋️', cat:'Трицепс', bg:'#2A2A1A' },
  // Кор
  { name:'Планка',               emoji:'🧘', cat:'Кор',    bg:'#1A3A2A' },
  { name:'Скручивания',          emoji:'🧘', cat:'Кор',    bg:'#1A3A2A' },
  { name:'Подъём ног лёжа',      emoji:'🧘', cat:'Кор',    bg:'#1A3A2A' },
  { name:'Русские скручивания',  emoji:'🧘', cat:'Кор',    bg:'#1A3A2A' },
  { name:'Велосипед',            emoji:'🧘', cat:'Кор',    bg:'#1A3A2A' },
  // Кардио
  { name:'Бег',                  emoji:'🏃', cat:'Кардио', bg:'#2A1A2A' },
  { name:'Прыжки на скакалке',   emoji:'🤸', cat:'Кардио', bg:'#2A1A2A' },
  { name:'Берпи',                emoji:'🤸', cat:'Кардио', bg:'#2A1A2A' },
  { name:'Прыжки с разведением', emoji:'🤸', cat:'Кардио', bg:'#2A1A2A' },
];

const MUSCLES = ['Все','Грудь','Спина','Ноги','Плечи','Бицепс','Трицепс','Кор','Кардио'];

const FOOD_DB = [
  { name:'Куриная грудка',    kcal:165, p:31,  c:0,   f:3.6 },
  { name:'Говядина',          kcal:250, p:26,  c:0,   f:17  },
  { name:'Лосось',            kcal:208, p:20,  c:0,   f:13  },
  { name:'Тунец',             kcal:132, p:28,  c:0,   f:1.3 },
  { name:'Яйцо (1 шт)',       kcal:74,  p:6,   c:0.6, f:5   },
  { name:'Творог 5%',         kcal:121, p:17,  c:3,   f:5   },
  { name:'Греческий йогурт',  kcal:97,  p:9,   c:6,   f:5   },
  { name:'Молоко 2.5%',       kcal:52,  p:2.8, c:4.8, f:2.5 },
  { name:'Протеин (порция)',  kcal:120, p:24,  c:4,   f:1.5 },
  { name:'Гречка',            kcal:313, p:12,  c:62,  f:3.3 },
  { name:'Овсянка',           kcal:371, p:13,  c:67,  f:7   },
  { name:'Рис белый',         kcal:344, p:7,   c:78,  f:0.7 },
  { name:'Макароны',          kcal:338, p:12,  c:67,  f:1.8 },
  { name:'Хлеб цельнозерновой',kcal:247,p:9,   c:45,  f:3.4 },
  { name:'Банан',             kcal:89,  p:1,   c:23,  f:0.3 },
  { name:'Яблоко',            kcal:52,  p:0.3, c:14,  f:0.2 },
  { name:'Апельсин',          kcal:47,  p:0.9, c:12,  f:0.1 },
  { name:'Оливковое масло',   kcal:884, p:0,   c:0,   f:100 },
  { name:'Арахисовая паста',  kcal:588, p:25,  c:20,  f:50  },
  { name:'Миндаль',           kcal:579, p:21,  c:22,  f:50  },
];

const TIPS = [
  'Каждое повторение — инвестиция в себя завтрашнего. 💪',
  'Боль сегодня — сила завтра. 🔥',
  'Дисциплина — мост между целями и достижениями. 🎯',
  'Твоё тело способно на многое — убеди в этом свой мозг. 🧠',
  'Не важно, как медленно ты идёшь — главное не останавливаться. 🐢',
  'Успех — это сумма маленьких ежедневных усилий. 📈',
  'Сравнивай себя только с собой вчерашним. 📅',
  'Лучший момент начать был вчера. Второй лучший — сейчас. ⚡',
  'Мотивация начинает. Дисциплина заканчивает. 🛡️',
  'Один плохой день не разрушит прогресс. Продолжай. 💡',
  'Ни одна тренировка не бывает зря — тело запоминает всё. 🏅',
  'Самый тяжёлый подход — первый шаг из дома. 🚪',
  'Результаты приходят к тем, кто не ищет причин. 🏆',
  'Изменения некомфортны — это и есть рост. 🌱',
  'Прогрессивная нагрузка — ключ к росту мышц. Добавляй +2.5кг каждые 2 недели. 📊',
  'Протеин важен! 1.6–2.2 г на кг веса тела для роста мышц. 🥩',
  'Сон — лучший спортпит. 7–9 часов = максимальное восстановление. 😴',
  'Кардио 20 минут утром запустит метаболизм на весь день. 🏃',
  'Не пропускай разминку — 5 минут сохранят здоровье суставов на годы. 🔄',
  'Деперессовка: сделай подход с меньшим весом — это тоже тренировка! 💡',
  'Пей воду во время тренировки — даже лёгкое обезвоживание снижает силу. 💧',
  'Медленные негативные повторения (4 сек вниз) дают +30% нагрузки. ⏱️',
  'Суперсеты экономят время и увеличивают интенсивность тренировки. ⚡',
  'Слушай тело: мышечная боль — хорошо; боль в суставах — стоп. 🛑',
  'Фиксируй тренировки — прогресс виден только в цифрах. 📝',
  'Тренировка в парке или дома считается! Главное — сделать. 🌳',
  'Предтренировочная еда за 1–2 часа: углеводы + небольшой белок. 🍌',
  'Отдых между подходами: 60–90 сек для гипертрофии, 2–3 мин для силы. ⏰',
];

// ── Init ──────────────────────────────────────────────────────────────────────
async function init() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('/app/sw.js').catch(() => {});
  }

  // Pre-fill profile inputs from saved values
  const nameInput = document.getElementById('prof-name');
  if (nameInput && S.userName) nameInput.value = S.userName;
  const goalInput = document.getElementById('prof-goal');
  if (goalInput) goalInput.value = S.weekGoal;
  const wgoalInput = document.getElementById('prof-wgoal');
  if (wgoalInput) wgoalInput.value = S.waterGoalMl;
  const heightInput = document.getElementById('prof-height');
  if (heightInput && S.heightCm) heightInput.value = S.heightCm;
  const twInput = document.getElementById('prof-target-weight');
  const savedTw = +localStorage.getItem('lmc_target_weight') || 0;
  if (twInput && savedTw) twInput.value = savedTw;

  // Load data
  await Promise.all([
    loadWater(),
    loadWorkouts(),
    loadBodyStats(),
    loadNutrition(),
  ]);

  // Render all screens
  renderDashboard();
  renderProgress();
  renderNutrition();
  renderProfile();
  renderHistory();

  // Tip of day
  const tipEl = document.getElementById('tip-of-day');
  if (tipEl) {
    // Rotate by day-of-year for variety
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    tipEl.textContent = TIPS[dayOfYear % TIPS.length];
  }

  setupNav();
  setupInstallBanner();
  setupQuickLog();
  setupFoodForm();

  // Animate water wave
  animateWater();
}

// ── Navigation ────────────────────────────────────────────────────────────────
function setupNav() {
  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });
}

function switchTab(tab, silent = false) {
  S.tab = tab;
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const scr = document.getElementById(`screen-${tab}`);
  const btn = document.querySelector(`.nav-btn[data-tab="${tab}"]`);
  if (scr) { scr.classList.add('active'); if (!silent) scr.scrollTo({ top: 0 }); }
  if (btn) btn.classList.add('active');

  // Refresh on switch
  if (tab === 'progress')      renderProgress();
  if (tab === 'nutrition')     renderNutrition();
  if (tab === 'history')       renderHistory();
  if (tab === 'templates')     renderTemplates();
  if (tab === 'sleep')         renderSleep();
  if (tab === 'measurements')  renderMeasurements();
  if (tab === 'achievements')  renderAchievements();
  if (tab === 'stretching')    stretchInit();
  if (tab === 'habits')        renderHabits();
  // highlight more-tab for sub-screens
  const moreTabs = ['templates','sleep','measurements','achievements','tdee','stretching','habits'];
  if (moreTabs.includes(tab)) {
    const moreBtn = document.querySelector('.nav-btn[data-tab="more"]');
    if (moreBtn) moreBtn.classList.add('active');
  }
}

// ── Toast ─────────────────────────────────────────────────────────────────────
function showToast(msg, dur = 2200) {
  const t = document.getElementById('toast');
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), dur);
}

// ── Dashboard ─────────────────────────────────────────────────────────────────
async function loadWorkouts() {
  try {
    S.allWorkouts = await WDB.getWorkouts();
    const weekStart = getWeekStart();
    S.weekWorkouts = S.allWorkouts.filter(w => new Date(w.date) >= weekStart).length;
  } catch (e) { S.allWorkouts = []; }
}

function getWeekStart() {
  const d = new Date();
  const day = d.getDay() || 7;
  d.setHours(0,0,0,0);
  d.setDate(d.getDate() - day + 1);
  return d;
}

function renderDashboard() {
  renderDailyQuote();
  const h = new Date().getHours();
  const gr = h < 12 ? 'Доброе утро' : h < 18 ? 'Добрый день' : 'Добрый вечер';
  const name = S.userName;

  setEl('dash-greeting', name ? `Привет, ${name}` : gr);
  setEl('dash-sub', new Date().toLocaleDateString('ru-RU', { weekday:'long', day:'numeric', month:'long' }));
  setEl('dash-streak', `${S.streak} дн.`);
  setEl('dash-week', `${S.weekWorkouts}/${S.weekGoal} нед.`);
  setEl('qs-water', `${(S.waterMl/1000).toFixed(1)}л`);
  setEl('qs-workouts', S.allWorkouts.length);

  // Latest weight
  const lastWeight = S.bodyStats.filter(s => s.weightKg > 0).at(-1);
  setEl('qs-weight', lastWeight ? `${lastWeight.weightKg} кг` : '—');

  // Today card
  const isRest = S.weekWorkouts >= S.weekGoal;
  setEl('today-status', isRest ? 'День отдыха' : 'Время тренироваться');
  setEl('today-sub', `Неделя: ${S.weekWorkouts}/${S.weekGoal}  •  Серия: ${S.streak} дн.`);

  // Streak at-risk banner
  const streakBanner = document.getElementById('streak-risk-banner');
  if (streakBanner && S.streak > 0) {
    const lastWorkoutDate = localStorage.getItem('lmc_last_workout');
    const trainedToday    = lastWorkoutDate === todayStr();
    const h2              = new Date().getHours();
    if (!trainedToday && h2 >= 15) {
      streakBanner.style.display = '';
      const sb = document.getElementById('streak-risk-text');
      if (sb) sb.textContent = `Серия ${S.streak} дн. под угрозой. Потренируйся сегодня, чтобы сохранить её.`;
    } else {
      streakBanner.style.display = 'none';
    }
  } else if (streakBanner) {
    streakBanner.style.display = 'none';
  }

  // Activity heatmap (12 weeks)
  const heatmapEl = document.getElementById('activity-heatmap');
  const heatmapCount = document.getElementById('heatmap-count-label');
  if (heatmapEl) {
    const now = new Date();
    const MS_DAY = 86400000;
    // Start of 12-week window aligned to Monday
    const todayMs = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
    const dow = (now.getDay() + 6) % 7; // 0=Mon
    const weekStartMs = todayMs - dow * MS_DAY - 11 * 7 * MS_DAY;
    const workoutDates = new Set(S.allWorkouts.map(w => w.date));
    const cols = [];
    for (let w = 0; w < 12; w++) {
      let col = '<div style="display:flex;flex-direction:column;gap:3px">';
      for (let d = 0; d < 7; d++) {
        const ms = weekStartMs + (w * 7 + d) * MS_DAY;
        if (ms > todayMs + MS_DAY) { col += '<div style="width:11px;height:11px"></div>'; continue; }
        const dateStr = new Date(ms).toISOString().slice(0, 10);
        const count = S.allWorkouts.filter(wk => wk.date === dateStr).length;
        const isToday = dateStr === todayStr();
        const bg = count === 0
          ? 'rgba(99,102,241,.1)'
          : count === 1 ? 'rgba(99,102,241,.45)'
          : count === 2 ? 'rgba(99,102,241,.72)'
          : 'var(--accent)';
        const border = isToday ? ';outline:1.5px solid var(--teal);outline-offset:1px' : '';
        col += `<div title="${dateStr}: ${count}" style="width:11px;height:11px;border-radius:2px;background:${bg}${border}"></div>`;
      }
      col += '</div>';
      cols.push(col);
    }
    heatmapEl.innerHTML = cols.join('');
    const total84 = S.allWorkouts.filter(w => {
      const ms = new Date(w.date).getTime();
      return ms >= weekStartMs && ms <= todayMs;
    }).length;
    if (heatmapCount) heatmapCount.textContent = `${total84} тр. за 12 нед.`;
  }

  // Week dots
  const dots = document.getElementById('week-dots');
  if (dots) {
    dots.innerHTML = Array.from({ length: Math.min(S.weekGoal, 7) }, (_, i) =>
      `<div class="dot${i < S.weekWorkouts ? ' done' : ''}"></div>`
    ).join('');
  }

  // Week goal ring
  const weekRing = document.getElementById('week-ring');
  const weekRingLabel = document.getElementById('week-ring-label');
  if (weekRing) {
    const circ = 163.4;
    const frac = S.weekGoal > 0 ? Math.min(S.weekWorkouts / S.weekGoal, 1) : 0;
    weekRing.style.strokeDashoffset = circ * (1 - frac);
    weekRing.style.stroke = frac >= 1 ? '#22c55e' : frac > 0 ? 'var(--teal)' : 'rgba(255,255,255,0.15)';
  }
  if (weekRingLabel) weekRingLabel.textContent = `${S.weekWorkouts}/${S.weekGoal}`;

  // Insight
  let icon = '💡', text = 'Начни первую тренировку — сделай шаг к своей цели!';
  if (S.streak >= 7)              { icon = '🔥'; text = `Серия ${S.streak} дней — невероятно! Ты в зоне роста.`; }
  else if (S.weekWorkouts >= S.weekGoal) { icon = '✅'; text = `Недельная цель выполнена (${S.weekWorkouts}/${S.weekGoal})! Отличная работа!`; }
  else if (S.weekWorkouts === 0)  { icon = '⚡'; text = 'На этой неделе ещё нет тренировок. Лучшее время — сейчас!'; }
  else if (S.allWorkouts.length >= 10) { icon = '📈'; text = `Уже ${S.allWorkouts.length} тренировок — ты на пути к результату!`; }
  const ins = document.getElementById('dash-insight');
  if (ins) {
    ins.querySelector('.insight-icon').textContent = icon;
    ins.querySelector('.insight-text').textContent = text;
  }

  // Weekly volume bar chart
  (async () => {
    const secEl  = document.getElementById('week-vol-section');
    const barsEl = document.getElementById('week-vol-bars');
    const totEl  = document.getElementById('week-vol-total');
    if (!secEl || !barsEl) return;
    const weekStart = getWeekStart();
    const weekWs = S.allWorkouts.filter(w => new Date(w.date) >= weekStart);
    if (weekWs.length === 0) return;
    secEl.style.display = '';
    const todayDow = (new Date().getDay() + 6) % 7;
    const volByDow = new Array(7).fill(0);
    for (const w of weekWs) {
      const dow = (new Date(w.date).getDay() + 6) % 7;
      const sets = await WDB.getSetsFor(w.id);
      volByDow[dow] += sets.reduce((s, x) => s + (x.weight || 0) * (x.reps || 0), 0);
    }
    const maxV = Math.max(...volByDow, 1);
    const totalVol = volByDow.reduce((a, b) => a + b, 0);
    if (totEl) totEl.textContent = Math.round(totalVol).toLocaleString('ru') + ' кг';
    barsEl.innerHTML = volByDow.map((v, i) => {
      const h = Math.max(Math.round((v / maxV) * 56), 3);
      const isToday = i === todayDow;
      const bg = v > 0 ? (isToday ? 'var(--teal)' : 'var(--accent)') : 'rgba(255,255,255,.07)';
      return `<div style="flex:1;display:flex;align-items:flex-end;justify-content:center">
        <div style="width:100%;height:${h}px;background:${bg};border-radius:3px 3px 0 0"></div>
      </div>`;
    }).join('');
  })();

  // Today water + kcal strip
  const waterBarEl  = document.getElementById('today-water-bar');
  const waterLblEl  = document.getElementById('today-water-label');
  const kcalBarEl   = document.getElementById('today-kcal-bar');
  const kcalLblEl   = document.getElementById('today-kcal-label');
  if (waterBarEl) {
    const pct = S.waterGoalMl > 0 ? Math.min(S.waterMl / S.waterGoalMl * 100, 100) : 0;
    waterBarEl.style.width = pct + '%';
    if (waterLblEl) waterLblEl.textContent = `${(S.waterMl/1000).toFixed(1)} / ${(S.waterGoalMl/1000).toFixed(1)} л`;
  }
  if (kcalBarEl) {
    const todayKcal = +localStorage.getItem('lmc_kcal_' + todayStr()) || 0;
    const kcalGoal  = S.kcalGoal || 2000;
    const pct = Math.min(todayKcal / kcalGoal * 100, 100);
    kcalBarEl.style.width = pct + '%';
    if (kcalLblEl) kcalLblEl.textContent = `${todayKcal} / ${kcalGoal} ккал`;
  }

  // AI Coach message
  const aiIcon = document.getElementById('ai-coach-icon');
  const aiTitle = document.getElementById('ai-coach-title');
  const aiMsg = document.getElementById('ai-coach-msg');
  if (aiTitle && aiMsg) {
    const wToday = S.allWorkouts.filter(w => w.date === todayStr()).length;
    if (wToday > 0) {
      if (aiIcon) aiIcon.textContent = '✅';
      aiTitle.textContent = 'Тренировка уже есть!';
      aiMsg.textContent = 'Отличная работа сегодня. Следи за питанием и восстановлением.';
    } else if (S.streak >= 7) {
      if (aiIcon) aiIcon.textContent = '🔥';
      aiTitle.textContent = `Серия ${S.streak} дней — огонь!`;
      aiMsg.textContent = 'Продолжай в том же темпе. Каждая тренировка работает на твой результат.';
    } else if (S.weekWorkouts >= S.weekGoal) {
      if (aiIcon) aiIcon.textContent = '🎯';
      aiTitle.textContent = 'Цель недели выполнена!';
      aiMsg.textContent = 'Можешь отдохнуть или добавить бонусную тренировку для ускорения прогресса.';
    } else {
      const left = S.weekGoal - S.weekWorkouts;
      if (aiIcon) aiIcon.textContent = left <= 1 ? '⚡' : '💪';
      aiTitle.textContent = left <= 1 ? 'Последний рывок!' : `Ещё ${left} трен. до цели`;
      aiMsg.textContent = left <= 1
        ? 'Одна тренировка — и недельная цель выполнена. Ты справишься!'
        : `Неделя: ${S.weekWorkouts}/${S.weekGoal}. Планируй следующую тренировку заранее.`;
    }
  }

  // Next muscle group recommendation
  const nextEl = document.getElementById('dash-next-muscle');
  if (nextEl && S.allWorkouts.length > 0) {
    const MUSCLE_CYCLE = ['Грудь','Спина','Ноги','Плечи','Бицепс','Трицепс','Кор','Кардио'];
    const MUSCLE_TIP = {
      'Грудь':   { emoji:'🏋️', next:'Спина',  tip:'После груди — время спины. Баланс тяни/толкай!' },
      'Спина':   { emoji:'💪', next:'Ноги',   tip:'Спина отработана — укрепи ноги сегодня!' },
      'Ноги':    { emoji:'🦵', next:'Плечи',  tip:'После ног — день плеч и верха тела.' },
      'Плечи':   { emoji:'🎯', next:'Грудь',  tip:'Плечи готовы — пора на грудные!' },
      'Бицепс':  { emoji:'💪', next:'Трицепс',tip:'Бицепс сделан — прокачай трицепс!' },
      'Трицепс': { emoji:'💪', next:'Бицепс', tip:'Трицепс отработан — переходи на бицепс.' },
      'Кор':     { emoji:'🧘', next:'Кардио', tip:'Отличный кор! Добавь кардио для жиросжигания.' },
      'Кардио':  { emoji:'🏃', next:'Спина',  tip:'После кардио — силовая на спину!' },
    };
    const lastW = S.allWorkouts.slice().sort((a,b) => b.id - a.id)[0];
    const lastCat = EXERCISES.find(e => e.name === lastW?.name)?.cat;
    const info = MUSCLE_TIP[lastCat];
    if (info) {
      nextEl.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px">
          <div style="font-size:22px">${info.emoji}</div>
          <div>
            <div style="font-size:10px;font-weight:700;color:var(--teal);letter-spacing:.5px;margin-bottom:2px">СЛЕДУЮЩАЯ ТРЕНИРОВКА</div>
            <div style="font-size:13px;font-weight:600;color:var(--text-1)">${info.next}</div>
            <div style="font-size:11px;color:var(--text-2);margin-top:1px">${info.tip}</div>
          </div>
        </div>`;
      nextEl.style.display = '';
    } else {
      nextEl.style.display = 'none';
    }
  }

  // Nutrition log streak
  (function() {
    const pill = document.getElementById('dash-nut-streak');
    if (!pill) return;
    let streak = 0;
    const MS_DAY = 86400000;
    for (let i = 0; i < 365; i++) {
      const d   = new Date(Date.now() - i * MS_DAY);
      const key = 'lmc_kcal_' + d.toISOString().slice(0, 10);
      if (+localStorage.getItem(key) > 0) streak++;
      else if (i > 0) break;
    }
    if (streak > 1) {
      pill.style.display = '';
      pill.textContent = `🥗 ${streak} дн.`;
    } else {
      pill.style.display = 'none';
    }
  })();

  // Top 1RM records mini-card (async)
  renderDashORM();

  // Recent workout
  const last = S.allWorkouts.slice().sort((a,b) => b.id - a.id)[0];
  const rec  = document.getElementById('recent-workout');
  const none = document.getElementById('no-workouts');
  if (last && rec) {
    rec.style.display = 'flex';
    rec.innerHTML = `
      <div class="recent-icon">${last.emoji || '🏋️'}</div>
      <div class="recent-info">
        <strong>${last.name}</strong>
        <span>${formatDate(last.date)} · ${last.setCount || 0} подходов</span>
      </div>
      <span style="color:var(--text-3);font-size:18px">›</span>
    `;
    if (none) none.style.display = 'none';
  } else {
    if (rec)  rec.style.display  = 'none';
    if (none) none.style.display = 'block';
  }
}

// ── Dashboard 1RM Records card ────────────────────────────────────────────────
async function renderDashORM() {
  const sec  = document.getElementById('dash-orm-section');
  const list = document.getElementById('dash-orm-list');
  if (!sec || !list || S.allWorkouts.length === 0) { if (sec) sec.style.display = 'none'; return; }

  const ormMap = {};
  for (const w of S.allWorkouts) {
    const sets = await WDB.getSetsFor(w.id);
    for (const s of sets) {
      if (!s.weight || !s.reps) continue;
      const orm = s.weight * (1 + s.reps / 30);
      if (!ormMap[w.name] || orm > ormMap[w.name].orm) {
        ormMap[w.name] = { orm, weight: s.weight, reps: s.reps, emoji: w.emoji || '🏋️' };
      }
    }
  }

  const top = Object.entries(ormMap)
    .sort((a, b) => b[1].orm - a[1].orm)
    .slice(0, 4);

  if (top.length === 0) { sec.style.display = 'none'; return; }
  sec.style.display = '';

  const medals = ['🥇','🥈','🥉','🏅'];
  list.innerHTML = top.map(([name, d], i) => `
    <div style="display:flex;align-items:center;gap:10px;padding:6px 0;${i < top.length - 1 ? 'border-bottom:1px solid var(--border)' : ''}">
      <span style="font-size:18px;flex-shrink:0">${medals[i]}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${d.emoji} ${name}</div>
        <div style="font-size:11px;color:var(--text-3)">${d.weight} кг × ${d.reps} повт.</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:15px;font-weight:800;color:var(--teal)">${Math.round(d.orm)} кг</div>
        <div style="font-size:10px;color:var(--text-3)">1RM</div>
      </div>
    </div>`).join('');
}

// ── Water ─────────────────────────────────────────────────────────────────────
async function loadWater() {
  try { const w = await WDB.getWater(todayStr()); S.waterMl = w.ml || 0; }
  catch (e) { S.waterMl = 0; }
}

let _wavePhase = 0;
let _waveRaf   = null;

function animateWater() {
  const wave1 = document.getElementById('water-wave1');
  const wave2 = document.getElementById('water-wave2');
  const wRect = document.getElementById('water-rect');
  if (!wave1 || !wRect) return;

  function frame() {
    _wavePhase += 0.04;
    const pct  = Math.min(S.waterMl / S.waterGoalMl, 1);
    const H    = 200;
    const fillH = H * pct;
    const y    = H - fillH;

    wRect.setAttribute('y', y);
    wRect.setAttribute('height', fillH + 2);

    // Wave 1
    const pts1 = [];
    for (let i = 0; i <= 8; i++) {
      const x  = i * 20;
      const wy = y + 6 * Math.sin(_wavePhase + i * 0.8);
      pts1.push(i === 0 ? `M${x},${wy}` : `L${x},${wy}`);
    }
    wave1.setAttribute('d', pts1.join(' ') + ` L160,${H} L0,${H} Z`);

    // Wave 2 (offset)
    const pts2 = [];
    for (let i = 0; i <= 8; i++) {
      const x  = i * 20;
      const wy = y + 4 + 5 * Math.sin(_wavePhase + i * 0.8 + 1.6);
      pts2.push(i === 0 ? `M${x},${wy}` : `L${x},${wy}`);
    }
    wave2.setAttribute('d', pts2.join(' ') + ` L160,${H} L0,${H} Z`);

    _waveRaf = requestAnimationFrame(frame);
  }
  if (_waveRaf) cancelAnimationFrame(_waveRaf);
  _waveRaf = requestAnimationFrame(frame);
}

function renderWater() {
  setEl('water-ml', S.waterMl);
  setEl('water-goal', `из ${S.waterGoalMl} мл`);
  setEl('qs-water', `${(S.waterMl/1000).toFixed(1)}л`);

  // Progress text colour
  const pct = S.waterMl / S.waterGoalMl;
  const mlEl = document.getElementById('water-ml');
  if (mlEl) mlEl.style.color = pct >= 1 ? 'var(--teal)' : 'var(--text-1)';

  // Mini arc ring on dashboard
  const canvas = document.getElementById('qs-water-ring');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 26, cy = 26, r = 20, sw = 5;
  ctx.clearRect(0, 0, 52, 52);
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.08)';
  ctx.lineWidth = sw;
  ctx.stroke();
  const clampedPct = Math.min(pct, 1);
  if (clampedPct > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * clampedPct);
    ctx.strokeStyle = clampedPct >= 1 ? '#2dd4bf' : '#38bdf8';
    ctx.lineWidth = sw;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
}

window.addWater = async function(ml) {
  S.waterMl = Math.max(0, S.waterMl + ml);
  try { if (ml > 0) await WDB.addWater(ml); else await WDB.putWater(S.waterMl); }
  catch (e) {}
  renderWater();
  if (ml > 0 && S.waterMl >= S.waterGoalMl) showToast('💧 Норма воды выполнена! Отлично!');
  else if (ml > 0) showToast(`+${ml} мл добавлено`);
  else showToast(`${Math.abs(ml)} мл убрано`);
};

window.resetWaterToday = async function() {
  S.waterMl = 0;
  try { await WDB.resetWater(); } catch (e) {}
  renderWater();
  showToast('Сброс воды выполнен');
};

window.quickAddWater = async function() {
  await window.addWater(250);
  renderDashboard();
};

window.showWeightModal = function() {
  const existing = document.getElementById('weight-modal');
  if (existing) existing.remove();
  const lastStat = S.bodyStats.filter(s => s.weightKg > 0).at(-1);
  const placeholder = lastStat ? lastStat.weightKg : '';
  const el = document.createElement('div');
  el.id = 'weight-modal';
  el.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(4px)';
  el.innerHTML = `
    <div style="width:100%;max-width:480px;background:var(--surface);border-radius:20px 20px 0 0;padding:24px 20px 32px">
      <div style="font-size:18px;font-weight:800;color:var(--text-1);margin-bottom:16px;text-align:center">⚖️ Записать вес</div>
      <input id="weight-input" type="number" step="0.1" min="30" max="300" placeholder="${placeholder || '70.0'}"
        style="width:100%;padding:14px;background:var(--bg-elevated);border:1px solid var(--border);border-radius:12px;color:var(--text-1);font-size:18px;font-weight:700;text-align:center;outline:none;box-sizing:border-box;margin-bottom:12px"
        onfocus="this.style.borderColor='var(--accent)'" onblur="this.style.borderColor='var(--border)'" />
      <button onclick="saveQuickWeight()" style="width:100%;padding:14px;background:var(--accent);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer;margin-bottom:8px">
        💾 Сохранить
      </button>
      <button onclick="document.getElementById('weight-modal').remove()" style="width:100%;padding:12px;background:transparent;color:var(--text-2);border:1px solid var(--border);border-radius:12px;font-size:14px;cursor:pointer">
        Отмена
      </button>
    </div>`;
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  document.body.appendChild(el);
  setTimeout(() => document.getElementById('weight-input')?.focus(), 100);
};

window.saveQuickWeight = async function() {
  const val = +document.getElementById('weight-input')?.value;
  if (!val || val < 20 || val > 400) { showToast('Введи корректный вес'); return; }
  try {
    await WDB.saveBodyStat({ weightKg: val, date: todayStr(), timestamp: Date.now() });
    await loadBodyStats();
    renderDashboard();
    renderProgress();
    document.getElementById('weight-modal')?.remove();
    showToast(`⚖️ Вес ${val} кг сохранён!`);
  } catch (e) { showToast('Ошибка сохранения'); }
};

// ── Quick Log ─────────────────────────────────────────────────────────────────
let _exFilter = 'Все';
let _exSearch = '';

function setupQuickLog() {
  renderMuscleChips();
  renderExList();

  const searchEl = document.getElementById('ex-search');
  if (searchEl) {
    searchEl.addEventListener('input', e => {
      _exSearch = e.target.value;
      renderExList();
    });
  }
}

function renderMuscleChips() {
  const chips = document.getElementById('muscle-chips');
  if (!chips) return;
  chips.innerHTML = MUSCLES.map(m =>
    `<div class="ex-chip${_exFilter === m ? ' active' : ''}" onclick="filterMuscle('${m}')">${m}</div>`
  ).join('');
}

window.filterMuscle = m => { _exFilter = m; renderMuscleChips(); renderExList(); };

function renderExList() {
  const list = document.getElementById('exercise-list');
  if (!list) return;
  const q = _exSearch.toLowerCase();
  const filtered = EXERCISES.filter(e =>
    (_exFilter === 'Все' || e.cat === _exFilter) &&
    (!q || e.name.toLowerCase().includes(q))
  );
  list.innerHTML = filtered.map(e =>
    `<div class="ex-item" onclick="selectExercise('${e.name.replace(/'/g,"\\'")}','${e.emoji}','${e.bg}')">
      <div class="ex-item-icon" style="background:${e.bg}">${e.emoji}</div>
      <div style="flex:1;min-width:0">
        <div class="ex-item-name">${e.name}</div>
        <span class="ex-cat-badge" style="background:${e.bg}22;color:${e.bg};border:1px solid ${e.bg}44">${e.cat}</span>
      </div>
    </div>`
  ).join('') || '<p style="color:var(--text-2);padding:16px;text-align:center;font-size:13px">Ничего не найдено</p>';
}

window.selectExercise = async function(name, emoji, bg) {
  S.log.exerciseName  = name;
  S.log.exerciseEmoji = emoji;
  S.log.sets = [{ weight:'', reps:'', done:false }];
  S.log.restSec = 0;
  if (S.log.restTimer) { clearInterval(S.log.restTimer); S.log.restTimer = null; }

  // Start session elapsed timer if not already running
  if (!S.log.sessionStartMs) {
    S.log.sessionStartMs = Date.now();
    if (S.log.sessionTimerInterval) clearInterval(S.log.sessionTimerInterval);
    S.log.sessionTimerInterval = setInterval(() => {
      const sec = Math.floor((Date.now() - S.log.sessionStartMs) / 1000);
      const m = Math.floor(sec / 60), s = sec % 60;
      setEl('session-elapsed', `${m}:${String(s).padStart(2,'0')}`);
    }, 1000);
  }

  // Load previous session for this exercise
  S.log.prevSets = await loadPrevSets(name);

  // Prefill weight from last session
  if (S.log.prevSets.length > 0) {
    S.log.sets[0].weight = S.log.prevSets[0].weight || '';
    S.log.sets[0].reps   = S.log.prevSets[0].reps   || '';
  }

  show('logging-section');
  hide('picker-section');

  setEl('log-ex-name',  name);
  setEl('log-ex-emoji', emoji);

  // Show prev session hint
  const hint = document.getElementById('prev-session-hint');
  if (hint) {
    if (S.log.prevSets.length > 0) {
      const best = S.log.prevSets.reduce((b, s) => (+s.weight > +b.weight ? s : b), S.log.prevSets[0]);
      hint.textContent = `📋 Прошлый раз: ${S.log.prevSets.length} подходов, лучший — ${best.weight} кг × ${best.reps}`;
      hint.style.display = 'block';
    } else {
      hint.style.display = 'none';
    }
  }

  renderSets();
  hide('rest-banner');
};

async function loadPrevSets(exerciseName) {
  try {
    const prev = S.allWorkouts
      .filter(w => w.name === exerciseName)
      .sort((a, b) => b.id - a.id)[0];
    if (!prev) return [];
    return await WDB.getSetsFor(prev.id);
  } catch (e) { return []; }
}

function renderSets() {
  const body = document.getElementById('sets-body');
  if (!body) return;

  body.innerHTML = S.log.sets.map((s, i) => {
    const prev = S.log.prevSets[i];
    const placeholder = prev ? prev.weight : '0';
    const repsPlaceholder = prev ? prev.reps : '0';
    return `
    <div class="set-row" id="set-row-${i}">
      <div class="set-num${s.done ? ' done' : ''}">${i + 1}</div>
      <div style="position:relative;flex:1">
        <input class="set-input" type="number" inputmode="decimal" placeholder="${placeholder}"
          value="${s.weight}" oninput="updateSet(${i},'weight',this.value)" />
        ${prev ? `<div class="set-prev-hint">${prev.weight}</div>` : ''}
      </div>
      <div style="position:relative;flex:1">
        <input class="set-input" type="number" inputmode="numeric" placeholder="${repsPlaceholder}"
          value="${s.reps}" oninput="updateSet(${i},'reps',this.value)" />
      </div>
      <button class="btn btn-outline btn-sm" style="font-size:11px;white-space:nowrap;padding:8px 10px"
        onclick="doneSet(${i})">✓</button>
      <button class="btn-del" onclick="removeSet(${i})">✕</button>
    </div>`;
  }).join('');
}

window.updateSet = (i, f, v) => { if (S.log.sets[i]) S.log.sets[i][f] = v; };
window.removeSet = i => { S.log.sets.splice(i, 1); renderSets(); };
window.addSet    = () => {
  const last = S.log.sets.at(-1);
  S.log.sets.push({ weight: last?.weight || '', reps: last?.reps || '', done: false });
  renderSets();
  // Scroll to new set
  const body = document.getElementById('sets-body');
  if (body) body.lastElementChild?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
};

window.doneSet = function(i) {
  S.log.sets[i].done = true;
  renderSets();
  startRestTimer(S.log.restPresetSec || 90);
  showToast('✅ Подход записан!');
};

function startRestTimer(sec) {
  if (S.log.restTimer) clearInterval(S.log.restTimer);
  S.log.restPresetSec = sec;
  S.log.restSec = sec;
  updateRestPresetUI();
  updateRestBanner();
  show('rest-banner');
  S.log.restTimer = setInterval(() => {
    S.log.restSec--;
    updateRestBanner();
    if (S.log.restSec <= 0) {
      clearInterval(S.log.restTimer);
      S.log.restTimer = null;
      hide('rest-banner');
      showToast('⏰ Время! Следующий подход');
    }
  }, 1000);
}

window.setRestPreset = function(sec) {
  S.log.restPresetSec = sec;
  startRestTimer(sec);
};

window.addRestTime = function(sec) {
  S.log.restSec = Math.min(S.log.restSec + sec, 600);
  updateRestBanner();
};

function updateRestPresetUI() {
  [60,90,120,180].forEach(s => {
    const btn = document.getElementById('rest-preset-' + s);
    if (!btn) return;
    btn.className = s === S.log.restPresetSec
      ? 'rest-preset-btn rest-preset-active'
      : 'rest-preset-btn';
  });
}

function updateRestBanner() {
  const m = Math.floor(S.log.restSec / 60);
  const s = (S.log.restSec % 60).toString().padStart(2, '0');
  setEl('rest-timer-text', ${m}:);
  const total = S.log.restPresetSec || 90;
  const frac  = S.log.restSec / total;
  const ring = document.getElementById('rest-ring');
  if (ring) {
    const circ = 188.5;
    ring.style.strokeDashoffset = circ * (1 - frac);
    ring.style.stroke = frac > 0.5 ? 'var(--teal)' : frac > 0.2 ? 'var(--orange)' : 'var(--red)';
  }
  const bar = document.getElementById('rest-bar-fill');
  if (bar) {
    const pct = frac * 100;
    bar.style.width = ${pct}%;
    bar.style.background = pct > 50 ? 'var(--teal)' : pct > 20 ? 'var(--orange)' : 'var(--red)';
  }
}

window.skipRest = function() {
  if (S.log.restTimer) { clearInterval(S.log.restTimer); S.log.restTimer = null; }
  hide('rest-banner');
};

window.backToPicker = function() {
  hide('logging-section');
  show('picker-section');
  if (S.log.restTimer) { clearInterval(S.log.restTimer); S.log.restTimer = null; }
  hide('rest-banner');
};

window.finishWorkout = async function() {
  const filled = S.log.sets.filter(s => s.weight || s.reps);
  if (filled.length === 0) { showToast('Добавь хотя бы один подход!'); return; }

  const noteEl = document.getElementById('workout-note-input');
  const workoutNote = noteEl ? noteEl.value.trim() : '';
  if (noteEl) noteEl.value = '';

  try {
    const wId = await WDB.saveWorkout({
      name:     S.log.exerciseName,
      emoji:    S.log.exerciseEmoji,
      setCount: filled.length,
      date:     todayStr(),
      note:     workoutNote || undefined,
    });
    await WDB.saveSets(wId, filled.map(s => ({
      weight: +s.weight || 0,
      reps:   +s.reps   || 0,
    })));
  } catch (e) {}

  // Streak update
  const lastDate = localStorage.getItem('lmc_last_workout');
  const today    = todayStr();
  if (lastDate !== today) {
    S.streak = lastDate === prevDay(today) ? S.streak + 1 : 1;
    localStorage.setItem('lmc_streak', S.streak);
    localStorage.setItem('lmc_last_workout', today);
  }

  // Build progressive overload suggestion before refreshing
  const bestSet = filled.reduce((best, s) => {
    const w = +s.weight || 0, r = +s.reps || 0;
    return w > (best.weight || 0) ? s : best;
  }, {});
  const bestWeight = +bestSet.weight || 0;
  const bestReps   = +bestSet.reps   || 0;

  await loadWorkouts();

  // Find previous best for same exercise
  const prevSessions = S.allWorkouts.filter(w =>
    w.name === S.log.exerciseName && w.id !== (S.allWorkouts[0]?.id)
  );
  let overloadMsg = null;
  if (prevSessions.length > 0 && bestWeight > 0) {
    const prevBestWeight = await (async () => {
      try {
        const prevSets = await WDB.getSetsFor(prevSessions[0].id);
        return Math.max(...prevSets.map(s => +s.weight || 0), 0);
      } catch(e) { return 0; }
    })();
    if (bestWeight > prevBestWeight && prevBestWeight > 0) {
      const diff = (bestWeight - prevBestWeight).toFixed(1);
      overloadMsg = `💪 +${diff} кг к прошлому разу! В следующий раз попробуй ${(bestWeight + 2.5).toFixed(1)} кг × ${bestReps}.`;
    } else if (bestReps >= 10 && bestWeight > 0) {
      overloadMsg = `🏆 ${bestReps} повторений с ${bestWeight} кг! Следующий раз добавь +2.5 кг.`;
    }
  }

  renderDashboard();
  renderHistory();

  // Compute total volume
  const totalVol = filled.reduce((s, x) => s + (+x.weight||0) * (+x.reps||0), 0);
  showCompletionModal(S.log.exerciseName, S.log.exerciseEmoji || '🏋️', filled.length, totalVol, overloadMsg);

  // Reset session timer
  if (S.log.sessionTimerInterval) { clearInterval(S.log.sessionTimerInterval); S.log.sessionTimerInterval = null; }
  S.log.sessionStartMs = 0;
  setEl('session-elapsed', '0:00');
  backToPicker();
  const search = document.getElementById('ex-search');
  if (search) { search.value = ''; _exSearch = ''; renderExList(); }
};

function showCompletionModal(name, emoji, sets, volKg, overloadMsg) {
  const existing = document.getElementById('completion-modal');
  if (existing) existing.remove();
  const vol = volKg > 0 ? Math.round(volKg).toLocaleString('ru') + ' кг' : '—';
  const overloadHtml = overloadMsg
    ? `<div style="margin-top:12px;padding:10px 12px;background:rgba(99,102,241,.12);border-radius:10px;font-size:13px;color:var(--accent);line-height:1.5">${overloadMsg}</div>`
    : '';
  const el = document.createElement('div');
  el.id = 'completion-modal';
  el.style.cssText = 'position:fixed;inset:0;z-index:9999;display:flex;align-items:flex-end;justify-content:center;background:rgba(0,0,0,.55);backdrop-filter:blur(4px)';
  el.innerHTML = `
    <div style="width:100%;max-width:480px;background:var(--surface);border-radius:20px 20px 0 0;padding:24px 20px 32px;animation:slideUp .3s ease">
      <div style="text-align:center;margin-bottom:16px">
        <div style="font-size:48px;margin-bottom:6px">${emoji}</div>
        <div style="font-size:20px;font-weight:800;color:var(--text-1)">Тренировка завершена!</div>
        <div style="font-size:13px;color:var(--text-2);margin-top:4px">${name}</div>
      </div>
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:10px;margin-bottom:12px">
        <div style="background:var(--bg-elevated);border-radius:12px;padding:14px;text-align:center">
          <div style="font-size:26px;font-weight:800;color:var(--accent)">${sets}</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:2px">подходов</div>
        </div>
        <div style="background:var(--bg-elevated);border-radius:12px;padding:14px;text-align:center">
          <div style="font-size:26px;font-weight:800;color:#7C4DFF">${vol}</div>
          <div style="font-size:11px;color:var(--text-3);margin-top:2px">объём</div>
        </div>
      </div>
      ${overloadHtml}
      <button onclick="document.getElementById('completion-modal').remove();switchTab('dashboard')"
        style="margin-top:16px;width:100%;padding:14px;background:var(--accent);color:#fff;border:none;border-radius:12px;font-size:15px;font-weight:700;cursor:pointer">
        🏠 На главную
      </button>
    </div>`;
  el.addEventListener('click', e => { if (e.target === el) el.remove(); });
  document.body.appendChild(el);
}

// ── Progress ──────────────────────────────────────────────────────────────────
async function loadBodyStats() {
  try { S.bodyStats = await WDB.getBodyStats(); } catch (e) { S.bodyStats = []; }
}

function renderProgress() {
  const ws = S.allWorkouts;
  setEl('prog-total', ws.length);
  setEl('prog-week', ws.filter(w => new Date(w.date) >= getWeekStart()).length);
  setEl('prog-streak', `${S.streak} 🔥`);

  const lastW = S.bodyStats.filter(s => s.weightKg > 0).at(-1);
  setEl('prog-weight', lastW ? `${lastW.weightKg} кг` : '—');

  // Weekly volume (async from IndexedDB)
  calcWeeklyVolume(ws);

  renderWeekChart(ws);
  renderWeightGraph();
  renderMuscleFreq(ws);
  renderRecords(ws);
  renderMonthlyTrend(ws);
  populateOrmSelect(ws);
  renderMonthlyVolumeChart(ws);
  renderWeeklySummary(ws);
  renderDowChart(ws);
  renderVolTrendChart(ws);
  renderBwGoalCard();
  renderRecentWorkoutsFeed(ws);
  renderTopLifts(ws);
  renderTopExercises(ws);
  renderCalendar30(ws);
  renderThisMonth(ws);
}

function renderRecentWorkoutsFeed(ws) {
  const el = document.getElementById('recent-workouts-feed');
  if (!el) return;
  const recent = [...ws].sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 7);
  if (!recent.length) {
    el.innerHTML = '<p style="color:var(--text-2);text-align:center;font-size:13px;padding:8px 0">Нет записей</p>';
    return;
  }
  const today = todayStr();
  const yesterday = new Date(Date.now() - 86400000).toISOString().slice(0,10);
  el.innerHTML = recent.map((w, i) => {
    const label = w.date === today ? 'Сегодня' : w.date === yesterday ? 'Вчера' : new Date(w.date).toLocaleDateString('ru-RU', { day:'numeric', month:'short' });
    const border = i < recent.length - 1 ? 'border-bottom:1px solid var(--border);' : '';
    return `<div style="${border}display:flex;align-items:center;gap:10px;padding:9px 0">
      <div style="width:36px;height:36px;border-radius:10px;background:rgba(99,102,241,.12);display:flex;align-items:center;justify-content:center;font-size:18px;flex-shrink:0">${w.emoji||'🏋️'}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${w.name||'Тренировка'}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:1px">${label}</div>
      </div>
      <div style="font-size:10px;font-weight:700;color:var(--accent);background:rgba(99,102,241,.1);padding:3px 8px;border-radius:20px;flex-shrink:0">${w.date === today ? '🔥 Сег.' : label}</div>
    </div>`;
  }).join('');
}

async function renderTopLifts(ws) {
  const el = document.getElementById('top-lifts-list');
  if (!el) return;
  const bestMap = {};
  for (const w of ws) {
    const sets = await WDB.getSetsFor(w.id);
    for (const s of sets) {
      if (!s.exerciseId || !s.weightKg || s.weightKg <= 0) continue;
      const orm = s.weightKg * (1 + (s.reps || 1) / 30);
      const prev = bestMap[s.exerciseId];
      if (!prev || orm > prev.orm) {
        bestMap[s.exerciseId] = { name: s.exerciseName || s.exerciseId, weightKg: s.weightKg, reps: s.reps || 1, orm, date: w.date };
      }
    }
  }
  const lifts = Object.values(bestMap).sort((a, b) => b.orm - a.orm).slice(0, 8);
  if (!lifts.length) {
    el.innerHTML = '<p style="color:var(--text-2);text-align:center;font-size:13px;padding:8px 0">Нет данных — залогируй тренировку</p>';
    return;
  }
  const medals = ['🥇','🥈','🥉'];
  el.innerHTML = lifts.map((l, i) => {
    const medal = medals[i] || '🏋️';
    const ormVal = l.orm.toFixed(1);
    const border = i < lifts.length - 1 ? 'border-bottom:1px solid var(--border);' : '';
    return `<div style="${border}display:flex;align-items:center;gap:10px;padding:8px 0">
      <span style="font-size:18px;flex-shrink:0;width:24px;text-align:center">${medal}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:13px;font-weight:600;color:var(--text-1);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">${l.name}</div>
        <div style="font-size:11px;color:var(--text-3);margin-top:1px">${l.weightKg} кг × ${l.reps} · ${l.date}</div>
      </div>
      <div style="text-align:right;flex-shrink:0">
        <div style="font-size:14px;font-weight:700;color:var(--accent)">${ormVal}</div>
        <div style="font-size:10px;color:var(--text-3)">1RM</div>
      </div>
    </div>`;
  }).join('');
}

function renderBwGoalCard() {
  const section = document.getElementById('bw-goal-section');
  if (!section) return;
  const targetKg  = +localStorage.getItem('lmc_target_weight') || 0;
  const stats     = S.bodyStats.filter(s => s.weightKg > 0).sort((a, b) => a.id - b.id);
  const currentKg = stats.at(-1)?.weightKg || 0;
  if (!targetKg || !currentKg) { section.style.display = 'none'; return; }
  section.style.display = '';
  const startKg   = stats[0]?.weightKg || currentKg;
  const totalDiff = Math.abs(startKg - targetKg) || 0.1;
  const doneDiff  = Math.abs(startKg - currentKg);
  const pct       = Math.min(Math.round(doneDiff / totalDiff * 100), 100);
  const remaining = Math.abs(currentKg - targetKg).toFixed(1);
  const isLoss    = targetKg < startKg;
  document.getElementById('bw-goal-start').textContent     = startKg.toFixed(1) + ' кг';
  document.getElementById('bw-goal-current').textContent   = currentKg.toFixed(1) + ' кг';
  document.getElementById('bw-goal-target').textContent    = targetKg.toFixed(1) + ' кг';
  document.getElementById('bw-goal-bar').style.width       = pct + '%';
  document.getElementById('bw-goal-pct').textContent       = pct + '% пути пройдено';
  const remEl = document.getElementById('bw-goal-remaining');
  if (remEl) remEl.textContent = `${remaining} кг ${isLoss ? 'до цели' : 'до набора'}`;
}

function renderDowChart(ws) {
  const dowEl = document.getElementById('dow-chart');
  const favEl = document.getElementById('fav-day-label');
  if (!dowEl) return;
  const DAY_NAMES = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  const counts = new Array(7).fill(0);
  const now = Date.now();
  const MS84 = 84 * 86400000;
  ws.forEach(w => {
    const ms = new Date(w.date).getTime();
    if (now - ms <= MS84) {
      const dow = (new Date(w.date).getDay() + 6) % 7;
      counts[dow]++;
    }
  });
  const maxC = Math.max(...counts, 1);
  const bestDow = counts.indexOf(Math.max(...counts));
  if (favEl) favEl.textContent = counts[bestDow] > 0 ? `Любимый: ${DAY_NAMES[bestDow]} 🏋️` : '';
  dowEl.innerHTML = counts.map((c, i) => {
    const h = Math.max(Math.round((c / maxC) * 72), 4);
    const isBest = i === bestDow && c > 0;
    const bg = isBest ? 'var(--accent)' : 'rgba(99,102,241,.35)';
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;gap:3px">
      ${c > 0 ? `<div style="font-size:9px;font-weight:700;color:${isBest ? 'var(--accent)' : 'var(--text-3)'}">${c}</div>` : ''}
      <div style="width:100%;height:${h}px;background:${bg};border-radius:3px 3px 0 0"></div>
    </div>`;
  }).join('');
}

async function renderWeeklySummary(ws) {
  const weekStart = getWeekStart();
  const weekWs = ws.filter(w => new Date(w.date) >= weekStart);

  // Date range label
  const rangeEl = document.getElementById('weekly-summary-range');
  if (rangeEl) {
    const fmt = d => d.toLocaleDateString('ru-RU', { day:'numeric', month:'short' });
    const end = new Date();
    rangeEl.textContent = `${fmt(weekStart)} — ${fmt(end)}`;
  }

  setEl('ws-sessions', weekWs.length);

  let totalVol = 0, totalSets = 0;
  const exerciseCounts = {};
  const exerciseVol = {};
  for (const w of weekWs) {
    try {
      const sets = await WDB.getSetsFor(w.id);
      sets.forEach(s => {
        const vol = (s.weight || 0) * (s.reps || 0);
        totalVol  += vol;
        totalSets += 1;
        if (s.exerciseName) {
          exerciseCounts[s.exerciseName] = (exerciseCounts[s.exerciseName] || 0) + 1;
          exerciseVol[s.exerciseName]    = (exerciseVol[s.exerciseName]    || 0) + vol;
        }
      });
    } catch(e) {}
  }

  const tons = totalVol >= 1000 ? (totalVol / 1000).toFixed(1) : (totalVol / 1000).toFixed(2);
  setEl('ws-volume', tons);
  setEl('ws-sets',   totalSets);

  // Top exercise by volume
  const topEl = document.getElementById('ws-top-exercise');
  if (topEl) {
    const entries = Object.entries(exerciseVol).sort((a,b) => b[1] - a[1]);
    if (entries.length > 0) {
      const [name, vol] = entries[0];
      const sets = exerciseCounts[name] || 0;
      topEl.innerHTML = `🏆 <b>${name}</b> — ${(vol/1000).toFixed(2)}т в ${sets} подходах`;
    } else {
      topEl.textContent = weekWs.length === 0 ? 'Нет тренировок на этой неделе' : 'Данные загружаются...';
    }
  }

  // Recommendation
  const recEl = document.getElementById('ws-recommendation');
  if (recEl) {
    const n = weekWs.length;
    let rec;
    if (n === 0) rec = '💤 Начни неделю с тренировки — любые 20 минут в счёт!';
    else if (n === 1) rec = '👍 Хорошее начало! Ещё 2 тренировки и неделя удалась.';
    else if (n === 2) rec = '💪 Две тренировки! Ещё одна и ты выполнишь недельную норму.';
    else if (n >= 3 && n <= 4) rec = `✅ ${n} тренировки — отличная неделя! Не забудь про восстановление.`;
    else rec = `🔥 ${n} тренировок — феноменально! Убедись, что достаточно отдыхаешь.`;
    recEl.textContent = rec;
  }
}

async function calcWeeklyVolume(ws) {
  const weekStart = getWeekStart();
  const weekWs = ws.filter(w => new Date(w.date) >= weekStart);
  let totalVol = 0;
  for (const w of weekWs) {
    try {
      const sets = await WDB.getSetsFor(w.id);
      sets.forEach(s => { totalVol += (s.weight || 0) * (s.reps || 0); });
    } catch(e) {}
  }
  const volStr = totalVol > 0
    ? (totalVol >= 1000 ? (totalVol / 1000).toFixed(1) + 'т' : Math.round(totalVol).toLocaleString('ru') + 'кг')
    : '—';
  setEl('prog-volume', totalVol > 0 ? Math.round(totalVol).toLocaleString('ru') : '—');
  setEl('qs-volume', volStr);
}

function renderMonthlyTrend(ws) {
  const chartEl  = document.getElementById('monthly-chart');
  const labelsEl = document.getElementById('monthly-labels');
  const compareEl = document.getElementById('monthly-compare');
  if (!chartEl) return;

  // Build last 6 months data
  const months = [];
  const now = new Date();
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = ${d.getFullYear()}-;
    const label = d.toLocaleDateString('ru-RU', { month:'short' });
    const count = ws.filter(w => w.date && w.date.startsWith(key)).length;
    months.push({ key, label, count });
  }

  const maxCount = Math.max(...months.map(m => m.count), 1);
  const thisMonth = months[5].count;
  const prevMonth = months[4].count;
  if (compareEl) {
    const diff = thisMonth - prevMonth;
    compareEl.textContent = diff > 0 ? ▲ + vs прошлый : diff < 0 ? ▼  vs прошлый : '= прошлый';
    compareEl.style.color = diff > 0 ? 'var(--green)' : diff < 0 ? 'var(--red)' : 'var(--text-3)';
  }

  chartEl.innerHTML = months.map((m, i) => {
    const pct = (m.count / maxCount) * 100;
    const isCurrent = i === 5;
    const color = isCurrent ? 'var(--accent)' : 'var(--elevated)';
    const textColor = isCurrent ? 'var(--accent)' : 'var(--text-3)';
    return <div style="flex:1;display:flex;flex-direction:column;align-items:center;gap:3px">
      <span style="font-size:10px;font-weight:700;color:"></span>
      <div style="width:100%;height:px;background:;border-radius:4px 4px 0 0;transition:height .4s"></div>
    </div>;
  }).join('');

  if (labelsEl) {
    labelsEl.innerHTML = months.map((m, i) => {
      const isCurrent = i === 5;
      return <span style="font-size:10px;color:;flex:1;text-align:center"></span>;
    }).join('');
  }
}

async function renderMonthlyVolumeChart(ws) {
  const canvas = document.getElementById('monthlyVolumeChart');
  const labelsEl = document.getElementById('monthly-vol-labels');
  if (!canvas) return;

  const now = new Date();
  const months = [];
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
    const key = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`;
    const label = d.toLocaleDateString('ru-RU', { month: 'short' });
    months.push({ key, label, vol: 0 });
  }

  for (const w of ws) {
    if (!w.date) continue;
    const mk = w.date.slice(0, 7);
    const m = months.find(x => x.key === mk);
    if (!m) continue;
    try {
      const sets = await WDB.getSetsFor(w.id);
      sets.forEach(s => { m.vol += (s.weight || 0) * (s.reps || 0); });
    } catch(_) {}
  }

  const maxVol = Math.max(...months.map(m => m.vol), 1);
  const dpr = window.devicePixelRatio || 1;
  canvas.width  = canvas.offsetWidth  * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = canvas.offsetWidth, H = canvas.offsetHeight;
  const pad = { t: 18, b: 4, l: 4, r: 4 };
  const barCount = months.length;
  const slotW = (W - pad.l - pad.r) / barCount;
  const barW  = slotW * 0.55;

  ctx.clearRect(0, 0, W, H);

  months.forEach((m, i) => {
    const isCur = i === barCount - 1;
    const barH  = m.vol > 0 ? Math.max(4, (m.vol / maxVol) * (H - pad.t - pad.b)) : 2;
    const x     = pad.l + i * slotW + (slotW - barW) / 2;
    const y     = H - pad.b - barH;

    const grad = ctx.createLinearGradient(0, y, 0, H - pad.b);
    grad.addColorStop(0, isCur ? 'rgba(20,184,166,0.9)' : 'rgba(90,90,130,0.7)');
    grad.addColorStop(1, isCur ? 'rgba(20,184,166,0.3)' : 'rgba(60,60,100,0.3)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.roundRect(x, y, barW, barH, [3, 3, 0, 0]);
    ctx.fill();

    if (m.vol > 0) {
      const tons = (m.vol / 1000).toFixed(1);
      ctx.fillStyle = isCur ? 'rgba(20,184,166,0.9)' : 'rgba(180,180,200,0.5)';
      ctx.font = `${9 * dpr / dpr}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.fillText(tons + 'т', x + barW / 2, y - 4);
    }
  });

  if (labelsEl) {
    labelsEl.innerHTML = months.map((m, i) =>
      `<span style="font-size:10px;color:${i===barCount-1?'var(--accent)':'var(--text-3)'};flex:1;text-align:center">${m.label}</span>`
    ).join('');
  }
}

async function renderMuscleFreq(ws) {
  const el = document.getElementById('muscle-freq-list');
  if (!el) return;

  const weekStart = getWeekStart();
  const weekWs = ws.filter(w => new Date(w.date) >= weekStart);

  if (!weekWs.length) {
    el.innerHTML = '<p style="color:var(--text-2);text-align:center;padding:12px;font-size:13px">На этой неделе тренировок нет</p>';
    return;
  }

  const catEmoji = {
    'Грудь':'🫁','Спина':'🔙','Ноги':'🦵','Плечи':'🤸',
    'Бицепс':'💪','Трицепс':'🦾','Кор':'🎯','Кардио':'🏃','Другое':'⚡'
  };

  // Count sets per muscle from IndexedDB
  const setsByMuscle = {};
  const volByMuscle  = {};
  for (const w of weekWs) {
    const cat = EXERCISES.find(e => e.name === w.name)?.cat || 'Другое';
    try {
      const sets = await WDB.getSetsFor(w.id);
      sets.forEach(s => {
        setsByMuscle[cat] = (setsByMuscle[cat] || 0) + 1;
        volByMuscle[cat]  = (volByMuscle[cat]  || 0) + (s.weight || 0) * (s.reps || 0);
      });
    } catch(e) {
      setsByMuscle[cat] = (setsByMuscle[cat] || 0) + (w.setCount || 1);
    }
  }

  if (!Object.keys(setsByMuscle).length) {
    el.innerHTML = '<p style="color:var(--text-2);text-align:center;padding:12px;font-size:13px">Нет данных о подходах</p>';
    return;
  }

  const maxSets = Math.max(...Object.values(setsByMuscle));
  el.innerHTML = Object.entries(setsByMuscle)
    .sort((a,b) => b[1] - a[1])
    .map(([cat, sets]) => {
      const pct   = Math.round((sets / maxSets) * 100);
      const vol   = volByMuscle[cat] || 0;
      const color = pct >= 66 ? 'var(--accent)' : pct >= 33 ? 'var(--orange)' : 'var(--text-2)';
      const volStr = vol >= 1000 ? (vol/1000).toFixed(1) + 'т' : vol > 0 ? Math.round(vol) + 'кг' : '';
      return `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="font-size:18px;width:24px;text-align:center">${catEmoji[cat] || '⚡'}</div>
          <div style="flex:1">
            <div style="display:flex;justify-content:space-between;margin-bottom:4px">
              <span style="font-size:13px;color:var(--text-1);font-weight:600">${cat}</span>
              <span style="font-size:11px;color:${color};font-weight:700">${sets} подх.${volStr ? ' · ' + volStr : ''}</span>
            </div>
            <div style="height:5px;border-radius:3px;background:var(--bg-elevated)">
              <div style="height:5px;border-radius:3px;width:${pct}%;background:${color};transition:width .5s"></div>
            </div>
          </div>
        </div>`;
    }).join('');
}

function renderWeekChart(ws) {
  const bars = document.getElementById('week-bars');
  if (!bars) return;
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    days.push(d.toISOString().split('T')[0]);
  }
  bars.innerHTML = days.map((date, idx) => {
    const count = ws.filter(w => w.date === date).length;
    const h = count > 0 ? Math.min(20 + count * 18, 58) : 4;
    return `<div class="mini-bar${idx === 6 ? ' today' : ''}" style="height:${h}px"></div>`;
  }).join('');
}

async function renderVolTrendChart(ws) {
  const canvas = document.getElementById('volTrendChart');
  const trendLbl = document.getElementById('vol-trend-label');
  if (!canvas) return;
  const recent = ws.slice().sort((a, b) => b.id - a.id).slice(0, 10).reverse();
  if (recent.length < 2) { canvas.style.display = 'none'; return; }
  canvas.style.display = 'block';

  const volumes = [];
  for (const w of recent) {
    const sets = await WDB.getSetsFor(w.id);
    const vol = sets.reduce((s, x) => s + (x.weight || 0) * (x.reps || 0), 0);
    volumes.push({ label: w.name.slice(0, 6), vol });
  }

  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 300;
  const H = 100;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const maxVol = Math.max(...volumes.map(v => v.vol), 1);
  const padL = 4, padR = 4, padT = 8, padB = 16;
  const chartW = W - padL - padR;
  const chartH = H - padT - padB;
  const stepX  = chartW / (volumes.length - 1);

  const pts = volumes.map((v, i) => ({
    x: padL + i * stepX,
    y: padT + chartH * (1 - v.vol / maxVol),
  }));

  // Gradient fill
  const grad = ctx.createLinearGradient(0, padT, 0, padT + chartH);
  grad.addColorStop(0, 'rgba(91,138,240,0.35)');
  grad.addColorStop(1, 'rgba(91,138,240,0)');
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.forEach((p, i) => { if (i > 0) ctx.lineTo(p.x, p.y); });
  ctx.lineTo(pts[pts.length-1].x, padT + chartH);
  ctx.lineTo(pts[0].x, padT + chartH);
  ctx.closePath();
  ctx.fillStyle = grad;
  ctx.fill();

  // Line
  ctx.beginPath();
  ctx.moveTo(pts[0].x, pts[0].y);
  pts.forEach((p, i) => { if (i > 0) ctx.lineTo(p.x, p.y); });
  ctx.strokeStyle = '#5B8AF0';
  ctx.lineWidth = 2;
  ctx.stroke();

  // Dots
  pts.forEach(p => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#5B8AF0';
    ctx.fill();
  });

  // Trend indicator
  const first = volumes[0].vol, last = volumes[volumes.length-1].vol;
  if (trendLbl && first > 0) {
    const pct = Math.round((last - first) / first * 100);
    trendLbl.textContent = pct >= 0 ? `▲ +${pct}%` : `▼ ${pct}%`;
    trendLbl.style.color = pct >= 0 ? '#34C759' : '#FF6B6B';
  }
}

function renderRecords(ws) {
  const el = document.getElementById('records-list');
  if (!el) return;
  if (!ws.length) {
    el.innerHTML = '<p style="color:var(--text-2);text-align:center;padding:16px;font-size:13px">Запиши тренировки, чтобы увидеть рекорды</p>';
    return;
  }
  const map = {};
  ws.forEach(w => {
    WDB.getSetsFor(w.id).then(sets => {
      sets.forEach(s => {
        const v = (s.weight || 0) * (s.reps || 1);
        if (!map[w.name] || v > map[w.name].vol)
          map[w.name] = { name: w.name, emoji: w.emoji || '🏋️', weight: s.weight, reps: s.reps, vol: v };
      });
    });
  });
  setTimeout(() => {
    const orm1 = r => r.weight * (1 + (r.reps || 1) / 30);
    const sorted = Object.values(map).sort((a, b) => orm1(b) - orm1(a)).slice(0, 6);
    const medals = ['🥇','🥈','🥉','4️⃣','5️⃣','6️⃣'];
    el.innerHTML = sorted.length
      ? sorted.map((r, i) => {
          const est1rm = Math.round(orm1(r));
          return `
          <div class="record-row">
            <div class="record-rank">${medals[i]}</div>
            <div class="record-info">
              <strong>${r.emoji} ${r.name}</strong>
              <span>${r.weight} кг × ${r.reps} повт.</span>
            </div>
            <div class="record-val" style="text-align:right">
              <div style="font-size:15px;font-weight:700">~${est1rm}<span style="font-size:10px;font-weight:400"> кг</span></div>
              <div style="font-size:10px;color:var(--text-3)">1RM</div>
            </div>
          </div>`;}).join('')
      : '<p style="color:var(--text-2);text-align:center;padding:16px;font-size:13px">Нет данных</p>';
  }, 300);
}

function populateOrmSelect(ws) {
  const sel = document.getElementById('orm-exercise-select');
  if (!sel) return;
  const names = [...new Set(ws.map(w => w.name).filter(Boolean))].sort();
  const current = sel.value;
  sel.innerHTML = '<option value="">— Упражнение —</option>' +
    names.map(n => `<option value="${n}"${n === current ? ' selected' : ''}>${n}</option>`).join('');
}

window.renderOrmChart = async function() {
  const canvas = document.getElementById('ormChart');
  const trendEl = document.getElementById('orm-trend-label');
  const sel = document.getElementById('orm-exercise-select');
  if (!canvas || !sel) return;
  const name = sel.value;
  if (!name) { const ctx2 = canvas.getContext('2d'); ctx2.clearRect(0,0,canvas.width,canvas.height); if(trendEl) trendEl.textContent=''; return; }

  const ws = S.allWorkouts.filter(w => w.name === name);
  const points = [];
  for (const w of ws) {
    const sets = await WDB.getSetsFor(w.id);
    const best = sets.reduce((mx, s) => {
      const orm = (s.weight||0) * (1 + (s.reps||1)/30);
      return orm > mx ? orm : mx;
    }, 0);
    if (best > 0) points.push({ date: w.date, orm: Math.round(best) });
  }
  points.sort((a,b) => a.date.localeCompare(b.date));
  const pts = points.slice(-12);
  if (!pts.length) { if(trendEl) trendEl.textContent = 'Нет данных'; return; }

  const dpr = window.devicePixelRatio || 1;
  canvas.width  = canvas.offsetWidth  * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = canvas.offsetWidth, H = canvas.offsetHeight;
  const pad = { t:14, b:22, l:36, r:12 };
  const cw = W - pad.l - pad.r, ch = H - pad.t - pad.b;

  const minV = Math.min(...pts.map(p=>p.orm)) * 0.93;
  const maxV = Math.max(...pts.map(p=>p.orm)) * 1.05;
  const xOf = i => pad.l + (pts.length > 1 ? i / (pts.length-1) * cw : cw/2);
  const yOf = v => pad.t + (1 - (v-minV)/(maxV-minV)) * ch;

  ctx.clearRect(0,0,W,H);

  // grid line
  ctx.strokeStyle = 'rgba(255,255,255,0.06)'; ctx.lineWidth=1;
  [0.25,0.5,0.75,1].forEach(f => {
    const y = pad.t + f*ch;
    ctx.beginPath(); ctx.moveTo(pad.l,y); ctx.lineTo(W-pad.r,y); ctx.stroke();
  });

  // gradient fill
  const grad = ctx.createLinearGradient(0,pad.t,0,pad.t+ch);
  grad.addColorStop(0,'rgba(20,184,166,0.35)');
  grad.addColorStop(1,'rgba(20,184,166,0)');
  ctx.beginPath();
  pts.forEach((p,i) => i===0 ? ctx.moveTo(xOf(i),yOf(p.orm)) : ctx.lineTo(xOf(i),yOf(p.orm)));
  ctx.lineTo(xOf(pts.length-1), pad.t+ch);
  ctx.lineTo(xOf(0), pad.t+ch);
  ctx.closePath(); ctx.fillStyle=grad; ctx.fill();

  // line
  ctx.beginPath(); ctx.strokeStyle='#14B8A6'; ctx.lineWidth=2; ctx.lineJoin='round';
  pts.forEach((p,i) => i===0 ? ctx.moveTo(xOf(i),yOf(p.orm)) : ctx.lineTo(xOf(i),yOf(p.orm)));
  ctx.stroke();

  // dots + labels
  pts.forEach((p,i) => {
    const x=xOf(i), y=yOf(p.orm);
    ctx.beginPath(); ctx.arc(x,y,3,0,Math.PI*2);
    ctx.fillStyle='#14B8A6'; ctx.fill();
    ctx.fillStyle='rgba(255,255,255,0.7)'; ctx.font=`${9*dpr/dpr}px sans-serif`; ctx.textAlign='center';
    ctx.fillText(p.orm+'кг', x, y-7);
  });

  // x labels (first + last)
  const fmtDate = d => { const dt=new Date(d); return dt.toLocaleDateString('ru-RU',{day:'numeric',month:'short'}); };
  ctx.fillStyle='rgba(255,255,255,0.35)'; ctx.font=`9px sans-serif`;
  ctx.textAlign='left';  ctx.fillText(fmtDate(pts[0].date), pad.l, H-5);
  ctx.textAlign='right'; ctx.fillText(fmtDate(pts[pts.length-1].date), W-pad.r, H-5);

  // trend label
  if (trendEl && pts.length >= 2) {
    const diff = pts[pts.length-1].orm - pts[0].orm;
    trendEl.textContent = diff > 0 ? `▲ +${diff} кг 1RM за ${pts.length} сессий` : diff < 0 ? `▼ ${diff} кг 1RM за ${pts.length} сессий` : `= без изменений`;
    trendEl.style.color = diff > 0 ? 'var(--green)' : diff < 0 ? 'var(--red)' : 'var(--text-2)';
  }
};

function renderWeightGraph() {
  const canvas = document.getElementById('weightChart');
  if (!canvas) return;
  const stats = S.bodyStats.filter(s => s.weightKg > 0).slice(-20);

  const dpr = window.devicePixelRatio || 1;
  canvas.width  = canvas.offsetWidth  * dpr;
  canvas.height = canvas.offsetHeight * dpr;
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  const W = canvas.offsetWidth, H = canvas.offsetHeight;
  ctx.clearRect(0, 0, W, H);

  if (stats.length < 2) {
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.font = '12px -apple-system';
    ctx.textAlign = 'center';
    ctx.fillText('Добавь замеры веса для графика', W / 2, H / 2);
    return;
  }

  const weights = stats.map(s => s.weightKg);
  const minW = Math.min(...weights) - 1, maxW = Math.max(...weights) + 1;
  const pad = { t:10, r:10, b:24, l:38 };
  const cW = W - pad.l - pad.r, cH = H - pad.t - pad.b;
  const xOf = i => pad.l + (i / (stats.length - 1)) * cW;
  const yOf = v => pad.t + (1 - (v - minW) / (maxW - minW)) * cH;

  // Grid
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  for (let i = 0; i <= 3; i++) {
    const y = pad.t + (i / 3) * cH;
    ctx.beginPath(); ctx.moveTo(pad.l, y); ctx.lineTo(W - pad.r, y); ctx.stroke();
    const val = maxW - (i / 3) * (maxW - minW);
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.font = '10px -apple-system'; ctx.textAlign = 'right';
    ctx.fillText(val.toFixed(1), pad.l - 4, y + 4);
  }

  // Fill
  const grad = ctx.createLinearGradient(0, pad.t, 0, H);
  grad.addColorStop(0, 'rgba(91,138,240,0.3)');
  grad.addColorStop(1, 'rgba(91,138,240,0)');
  ctx.fillStyle = grad;
  ctx.beginPath();
  stats.forEach((s, i) => i === 0 ? ctx.moveTo(xOf(0), yOf(s.weightKg)) : ctx.lineTo(xOf(i), yOf(s.weightKg)));
  ctx.lineTo(xOf(stats.length - 1), H - pad.b);
  ctx.lineTo(xOf(0), H - pad.b);
  ctx.closePath(); ctx.fill();

  // Line
  ctx.strokeStyle = '#5B8AF0'; ctx.lineWidth = 2.5; ctx.lineJoin = 'round';
  ctx.beginPath();
  stats.forEach((s, i) => i === 0 ? ctx.moveTo(xOf(0), yOf(s.weightKg)) : ctx.lineTo(xOf(i), yOf(s.weightKg)));
  ctx.stroke();

  // Linear regression trend line
  if (stats.length >= 3) {
    const n = stats.length;
    const xs = stats.map((_, i) => i);
    const ys = stats.map(s => s.weightKg);
    const sumX  = xs.reduce((a, b) => a + b, 0);
    const sumY  = ys.reduce((a, b) => a + b, 0);
    const sumXY = xs.reduce((s, x, i) => s + x * ys[i], 0);
    const sumX2 = xs.reduce((s, x) => s + x * x, 0);
    const slope = (n * sumXY - sumX * sumY) / (n * sumX2 - sumX * sumX);
    const inter = (sumY - slope * sumX) / n;
    const trend0 = inter;
    const trend1 = inter + slope * (n - 1);
    const tColor = slope < -0.01 ? '#4CAF50' : slope > 0.01 ? '#EF5350' : '#FF9800';
    ctx.strokeStyle = tColor; ctx.lineWidth = 1.5;
    ctx.setLineDash([4, 3]);
    ctx.beginPath();
    ctx.moveTo(xOf(0), yOf(trend0));
    ctx.lineTo(xOf(n - 1), yOf(trend1));
    ctx.stroke();
    ctx.setLineDash([]);
    // Trend label
    const trendKg = Math.abs(trend1 - trend0).toFixed(1);
    const trendLbl = slope < -0.01 ? `↓${trendKg}кг` : slope > 0.01 ? `↑${trendKg}кг` : '→';
    ctx.fillStyle = tColor; ctx.font = 'bold 10px -apple-system'; ctx.textAlign = 'left';
    ctx.fillText(trendLbl, pad.l + 2, pad.t + 10);
  }

  // Dots + last label
  stats.forEach((s, i) => {
    ctx.fillStyle = '#5B8AF0';
    ctx.beginPath(); ctx.arc(xOf(i), yOf(s.weightKg), i === stats.length - 1 ? 5 : 3, 0, Math.PI * 2); ctx.fill();
    if (i === stats.length - 1) {
      ctx.fillStyle = '#fff'; ctx.font = 'bold 11px -apple-system'; ctx.textAlign = 'center';
      ctx.fillText(`${s.weightKg}кг`, xOf(i), yOf(s.weightKg) - 10);
    }
  });
}

// ── History ──────────────────────────────────────────────────────────────────
let _historyFilter = '';
let _historyPeriod = 'all';

window.filterHistory = function(q) {
  _historyFilter = q.toLowerCase().trim();
  renderHistory();
};

window.setHistoryFilter = function(period) {
  _historyPeriod = period;
  ['all','week','month','3m'].forEach(p => {
    const el = document.getElementById('hist-chip-' + p);
    if (el) { el.classList.toggle('chip-active', p === period); }
  });
  renderHistory();
};

function renderHistoryStats(ws) {
  const el = document.getElementById('history-stats');
  if (!el || !ws.length) return;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
  const thisMonth = ws.filter(w => w.date >= monthStart).length;
  const totalSets = ws.reduce((s, w) => s + (w.setCount || 0), 0);
  const chip = (val, label, color) =>
    `<div style="flex:1;background:var(--bg-elevated);border:1px solid var(--border);border-radius:10px;padding:8px;text-align:center">
       <div style="font-size:16px;font-weight:800;color:${color}">${val}</div>
       <div style="font-size:10px;color:var(--text-2);margin-top:1px">${label}</div>
     </div>`;
  el.innerHTML = chip(ws.length, 'всего', 'var(--accent)') +
                 chip(thisMonth, 'этот месяц', 'var(--teal)') +
                 chip(totalSets, 'подходов', 'var(--orange)');
}

async function renderHistory() {
  const el = document.getElementById('history-list');
  if (!el) return;
  const all = S.allWorkouts.slice().sort((a, b) => b.id - a.id);
  renderHistoryStats(all);
  // Best workout card (by sets count from IndexedDB)
  (async () => {
    const bwCard = document.getElementById('best-workout-card');
    if (!bwCard || all.length === 0) return;
    let bestW = null, bestSets = 0;
    for (const w of all.slice(0, 50)) {
      const sets = await WDB.getSetsFor(w.id);
      if (sets.length > bestSets) { bestSets = sets.length; bestW = w; }
    }
    if (bestW) {
      bwCard.style.display = '';
      const vol = (await WDB.getSetsFor(bestW.id)).reduce((s, x) => s + (x.weight || 0) * (x.reps || 0), 0);
      setEl('bw-name', bestW.name);
      const d = new Date(bestW.date);
      setEl('bw-date', d.toLocaleDateString('ru-RU', { day:'numeric', month:'long', year:'numeric' }));
      setEl('bw-vol',  Math.round(vol).toLocaleString('ru'));
      setEl('bw-sets', bestSets);
    }
  })();
  const now = new Date();
  const periodStart = (() => {
    if (_historyPeriod === 'week')  { const d = new Date(now); d.setDate(d.getDate() - d.getDay() + (d.getDay() === 0 ? -6 : 1)); d.setHours(0,0,0,0); return d.toISOString().split('T')[0]; }
    if (_historyPeriod === 'month') return new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];
    if (_historyPeriod === '3m')    return new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString().split('T')[0];
    return null;
  })();
  let ws = periodStart ? all.filter(w => w.date >= periodStart) : all;
  if (_historyFilter) ws = ws.filter(w => w.name.toLowerCase().includes(_historyFilter));
  if (!ws.length) {
    el.innerHTML = '<div style="text-align:center;padding:40px 20px"><div style="font-size:48px">📋</div><div style="font-size:15px;font-weight:600;color:var(--text-1)">Тренировок пока нет</div><div style="font-size:13px;color:var(--text-2);margin-top:6px">Запиши первую тренировку!</div></div>';
    return;
  }
  function getWeekKey(dateStr) {
    const d = new Date(dateStr), day = d.getDay() || 7;
    d.setDate(d.getDate() - day + 1);
    return d.toISOString().split('T')[0];
  }
  function weekLabel(wk) {
    const fr = new Date(wk), to = new Date(wk);
    to.setDate(to.getDate() + 6);
    return fr.getDate() + ' ' + fr.toLocaleDateString('ru-RU',{month:'short'}) + ' – ' + to.getDate() + ' ' + to.toLocaleDateString('ru-RU',{month:'short'});
  }
  const byWeek = {};
  ws.forEach(w => { const k = getWeekKey(w.date); (byWeek[k] = byWeek[k] || []).push(w); });
  let html = '';
  for (const [weekKey, workouts] of Object.entries(byWeek)) {
    const totalSets = workouts.reduce((s, w) => s + (w.setCount || 0), 0);
    const byDate = {};
    workouts.forEach(w => { (byDate[w.date] = byDate[w.date] || []).push(w); });
    html += '<div style="margin-bottom:20px">';
    html += '<div style="display:flex;justify-content:space-between;align-items:center;padding:8px 16px;margin-bottom:4px;background:var(--elevated);border-radius:10px">';
    html += '<div style="font-size:11px;font-weight:700;color:var(--text-2);letter-spacing:.4px">📅 ' + weekLabel(weekKey) + '</div>';
    html += '<div style="font-size:11px;color:var(--accent);font-weight:600">' + workouts.length + ' трен. · ' + totalSets + ' подх.</div></div>';
    for (const [date, dayWs] of Object.entries(byDate)) {
      html += '<div style="padding:0 4px;margin-bottom:4px">';
      html += '<div style="font-size:11px;color:var(--text-3);padding:2px 12px;margin-bottom:2px">' + formatDateFull(date) + '</div>';
      dayWs.forEach(w => {
        html += '<div class="history-row" onclick="openWorkoutDetail(' + w.id + ')">';
        html += '<div class="history-icon">' + (w.emoji || '🏋️') + '</div>';
        html += '<div class="history-info"><strong>' + w.name + '</strong>';
        html += '<span>' + (w.setCount || 0) + ' подх.' + (w.maxWeightKg ? ' · макс ' + w.maxWeightKg + ' кг' : '') + '</span></div>';
        html += '<div style="color:var(--text-3);font-size:18px">›</div></div>';
      });
      html += '</div>';
    }
    html += '</div>';
  }
  el.innerHTML = html;
}

window.openWorkoutDetail = async function(workoutId) {
  const workout = S.allWorkouts.find(w => w.id === workoutId);
  if (!workout) return;
  let sets = [];
  try { sets = await WDB.getSetsFor(workoutId); } catch (e) {}
  const sheet = document.getElementById('workout-detail-sheet');
  if (!sheet) return;
  document.getElementById('detail-title').textContent = (workout.emoji || '🏋️') + ' ' + workout.name;
  document.getElementById('detail-date').textContent  = formatDateFull(workout.date);
  const noteDetailEl = document.getElementById('detail-note');
  if (noteDetailEl) {
    if (workout.note) {
      noteDetailEl.textContent = workout.note;
      noteDetailEl.style.display = '';
    } else {
      noteDetailEl.style.display = 'none';
    }
  }
  const totalVol = sets.reduce((s, x) => s + (x.weight || 0) * (x.reps || 0), 0);
  const maxW     = Math.max(0, ...sets.map(s => s.weight || 0));
  const summaryEl = document.getElementById('detail-summary');
  if (summaryEl) {
    summaryEl.innerHTML = sets.length
      ? '<div style="display:flex;gap:16px;padding:10px 0;border-bottom:1px solid var(--border);margin-bottom:10px">'
        + '<div style="text-align:center;flex:1"><div style="font-size:16px;font-weight:800;color:var(--accent)">' + sets.length + '</div><div style="font-size:10px;color:var(--text-3)">подходов</div></div>'
        + '<div style="text-align:center;flex:1"><div style="font-size:16px;font-weight:800;color:var(--teal)">' + maxW + ' кг</div><div style="font-size:10px;color:var(--text-3)">макс. вес</div></div>'
        + '<div style="text-align:center;flex:1"><div style="font-size:16px;font-weight:800;color:var(--orange)">' + Math.round(totalVol).toLocaleString('ru') + '</div><div style="font-size:10px;color:var(--text-3)">объём кг</div></div>'
        + '</div>'
      : '';
  }
  const setsEl = document.getElementById('detail-sets');
  setsEl.innerHTML = sets.length
    ? '<div class="sets-header"><div>#</div><div>Вес</div><div>Повт.</div><div>Объём</div><div></div></div>'
      + sets.map((s, i) => '<div class="set-row" style="opacity:1"><div class="set-num done">' + (i+1) + '</div>'
        + '<div style="text-align:center;font-weight:700;color:var(--text-1)">' + s.weight + ' кг</div>'
        + '<div style="text-align:center;font-weight:700;color:var(--text-1)">' + s.reps + '</div>'
        + '<div style="text-align:center;color:var(--text-2);font-size:12px">' + Math.round(s.weight * s.reps) + '</div>'
        + '<div></div></div>').join('')
    : '<p style="color:var(--text-2);text-align:center;padding:12px">Нет данных о подходах</p>';
  // Populate note textarea
  const noteInput = document.getElementById('detail-note-input');
  if (noteInput) {
    noteInput.value = workout.note || '';
    noteInput.style.height = 'auto';
    noteInput.style.height = noteInput.scrollHeight + 'px';
  }
  sheet._currentWorkoutId = workoutId;
  sheet.classList.add('open');
};

window.saveDetailNote = async function() {
  const sheet = document.getElementById('workout-detail-sheet');
  const workoutId = sheet?._currentWorkoutId;
  if (!workoutId) return;
  const noteInput = document.getElementById('detail-note-input');
  if (!noteInput) return;
  const note = noteInput.value.trim();
  const workout = S.allWorkouts.find(w => w.id === workoutId);
  if (!workout) return;
  if (workout.note === note) return;
  try {
    await WDB.updateWorkoutNote(workoutId, note);
    workout.note = note;
  } catch(e) { console.warn('Note save failed', e); }
};

window.deleteWorkoutFromDetail = async function() {
  const sheet = document.getElementById('workout-detail-sheet');
  const workoutId = sheet?._currentWorkoutId;
  if (!workoutId) return;
  const workout = S.allWorkouts.find(w => w.id === workoutId);
  if (!confirm(`Удалить тренировку «${workout?.name || ''}»?`)) return;
  try {
    await WDB.deleteWorkout(workoutId);
    S.allWorkouts = S.allWorkouts.filter(w => w.id !== workoutId);
  } catch(e) { showToast('Ошибка удаления'); return; }
  sheet.classList.remove('open');
  renderHistory();
  renderDashboard();
  renderProgress();
  showToast('🗑 Тренировка удалена');
};

window.exportHistoryCSV = async function() {
  const ws = S.allWorkouts.slice().sort((a, b) => b.id - a.id);
  if (!ws.length) { showToast('Нет тренировок для экспорта'); return; }
  showToast('⏳ Формирую CSV...');
  let rows = [['Дата', 'Тренировка', 'Подходов', 'Макс. вес (кг)', 'Объём (кг)', 'Заметка']];
  for (const w of ws) {
    try {
      const sets = await WDB.getSetsFor(w.id);
      const vol  = sets.reduce((s, x) => s + (x.weight || 0) * (x.reps || 0), 0);
      const maxW = Math.max(0, ...sets.map(s => s.weight || 0));
      rows.push([
        w.date,
        `"${(w.name || '').replace(/"/g, '""')}"`,
        sets.length,
        maxW,
        Math.round(vol),
        `"${(w.note || '').replace(/"/g, '""')}"`,
      ]);
    } catch(e) {
      rows.push([w.date, `"${(w.name || '').replace(/"/g, '""')}"`, w.setCount || 0, '', '', '']);
    }
  }
  const csv  = rows.map(r => r.join(',')).join('\n');
  const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href     = url;
  a.download = `lmc-history-${todayStr()}.csv`;
  a.click();
  URL.revokeObjectURL(url);
  showToast('📥 CSV скачан!');
};

// ── Nutrition ─────────────────────────────────────────────────────────────────
async function loadNutrition() {
  try { S.nutritionItems = await WDB.getNutritionFor(todayStr()); }
  catch (e) { S.nutritionItems = []; }
}

function renderNutrition() {
  renderWater();

  const kcal = S.nutritionItems.reduce((s, i) => s + (i.kcal || 0), 0);
  const p    = S.nutritionItems.reduce((s, i) => s + (i.p    || 0), 0);
  const c    = S.nutritionItems.reduce((s, i) => s + (i.c    || 0), 0);
  const f    = S.nutritionItems.reduce((s, i) => s + (i.f    || 0), 0);

  setEl('nut-kcal', kcal);
  setEl('nut-p', `${Math.round(p)}г`);
  setEl('nut-c', `${Math.round(c)}г`);
  setEl('nut-f', `${Math.round(f)}г`);

  // Macro progress bars (goals: ~150г белки, ~250г углев, ~70г жиры)
  const goalP = 150, goalC = 250, goalF = 70;
  const pct = (v, g) => Math.min(v / g * 100, 100).toFixed(1) + '%';
  const pb = document.getElementById('nut-p-bar');
  const cb = document.getElementById('nut-c-bar');
  const fb = document.getElementById('nut-f-bar');
  if (pb) pb.style.width = pct(p, goalP);
  if (cb) cb.style.width = pct(c, goalC);
  if (fb) fb.style.width = pct(f, goalF);

  // Calorie ring animation
  const goalKcal = S.kcalGoal || 2000;
  const kFrac = Math.min(kcal / goalKcal, 1);
  const kRing = document.getElementById('kcal-ring');
  if (kRing) {
    const circumference = 2 * Math.PI * 40;
    kRing.style.strokeDasharray = circumference;
    kRing.style.strokeDashoffset = circumference * (1 - kFrac);
    kRing.style.stroke = kFrac >= 1 ? '#EF5350' : kFrac >= 0.8 ? '#FF9800' : '#5B8AF0';
  }
  const goalLbl = document.getElementById('nut-goal-label');
  if (goalLbl) goalLbl.textContent = goalKcal + ' ккал';

  const remaining = goalKcal - kcal;
  const remEl = document.getElementById('nut-remaining');
  if (remEl) {
    remEl.textContent = (remaining >= 0 ? remaining : '+' + Math.abs(remaining)) + ' ккал';
    remEl.style.color = remaining < 0 ? 'var(--red,#EF5350)' : remaining < goalKcal * 0.15 ? 'var(--orange,#FF9800)' : 'var(--green,#34C759)';
  }

  renderNutWeekChart();

  const mealList = document.getElementById('meal-list');
  if (mealList) {
    if (!S.nutritionItems.length) {
      mealList.innerHTML = '<p style="color:var(--text-2);text-align:center;padding:20px;font-size:13px">Добавь первый приём пищи 🥗</p>';
    } else {
      const MEAL_SLOTS = [
        { key: 'breakfast', label: '🌅 Завтрак',       start: 5,  end: 11 },
        { key: 'lunch',     label: '☀️ Обед',           start: 11, end: 15 },
        { key: 'snack',     label: '🍎 Полдник',        start: 15, end: 18 },
        { key: 'dinner',    label: '🌙 Ужин',           start: 18, end: 23 },
        { key: 'other',     label: '🕐 Другое',         start: -1, end: -1 },
      ];
      const getMealSlot = (item) => {
        if (!item.addedAt) return 'other';
        const h = new Date(item.addedAt).getHours();
        const slot = MEAL_SLOTS.find(s => s.start >= 0 && h >= s.start && h < s.end);
        return slot ? slot.key : 'other';
      };
      const grouped = {};
      MEAL_SLOTS.forEach(s => { grouped[s.key] = []; });
      S.nutritionItems.forEach((item, idx) => {
        grouped[getMealSlot(item)].push({ item, idx });
      });
      mealList.innerHTML = MEAL_SLOTS.map(slot => {
        const entries = grouped[slot.key];
        if (!entries.length) return '';
        const slotKcal = entries.reduce((s, e) => s + (e.item.kcal || 0), 0);
        const rows = entries.map(({ item, idx }) => `
          <div class="meal-row" style="display:flex;align-items:center;gap:8px">
            <div style="flex:1;min-width:0">
              <div class="meal-name">${item.name}</div>
              <div class="meal-macros">Б:${Math.round(item.p)}  У:${Math.round(item.c)}  Ж:${Math.round(item.f)}</div>
            </div>
            <div class="meal-kcal" style="flex-shrink:0">${item.kcal}</div>
            <button onclick="deleteMealItem(${idx})" style="background:rgba(255,59,48,.1);border:1px solid rgba(255,59,48,.25);border-radius:8px;color:#FF3B30;font-size:13px;padding:4px 8px;cursor:pointer;flex-shrink:0">✕</button>
          </div>`).join('');
        return `
          <div style="margin-bottom:8px">
            <div style="display:flex;justify-content:space-between;align-items:center;padding:6px 2px 4px">
              <span style="font-size:12px;font-weight:600;color:var(--text-2)">${slot.label}</span>
              <span style="font-size:11px;color:var(--accent)">${slotKcal} ккал</span>
            </div>
            ${rows}
          </div>`;
      }).join('');
    }
  }
}

function renderNutWeekChart() {
  const barsEl   = document.getElementById('nut-week-bars');
  const labelsEl = document.getElementById('nut-week-labels');
  const avgEl    = document.getElementById('nut-week-avg');
  if (!barsEl || !labelsEl) return;

  const DAY_NAMES = ['Вс','Пн','Вт','Ср','Чт','Пт','Сб'];
  const goalKcal = S.kcalGoal || 2000;
  const days = [];
  const now = new Date();
  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split('T')[0];
    const stored = parseInt(localStorage.getItem('lmc_kcal_' + key) || '0', 10);
    // Today: use live S.nutritionItems
    const kcal = (i === 0)
      ? S.nutritionItems.reduce((s, item) => s + (item.kcal || 0), 0)
      : stored;
    days.push({ key, label: DAY_NAMES[d.getDay()], kcal, isToday: i === 0 });
  }

  const maxKcal = Math.max(...days.map(d => d.kcal), goalKcal, 1);
  const avg = Math.round(days.filter(d => d.kcal > 0).reduce((s, d) => s + d.kcal, 0) / Math.max(days.filter(d => d.kcal > 0).length, 1));
  if (avgEl && avg > 0) avgEl.textContent = `Ср: ${avg} ккал`;

  barsEl.innerHTML = days.map(d => {
    const h = Math.round((d.kcal / maxKcal) * 60);
    const isOver = d.kcal > goalKcal;
    const clr = d.isToday ? 'var(--accent)' : isOver ? 'var(--orange,#FF9800)' : 'var(--teal)';
    const barH = Math.max(h, d.kcal > 0 ? 4 : 2);
    return `<div style="flex:1;display:flex;flex-direction:column;align-items:center;justify-content:flex-end;height:64px">
      <div title="${d.kcal} ккал" style="width:100%;border-radius:3px 3px 0 0;background:${clr};height:${barH}px;opacity:${d.isToday ? 1 : 0.7};transition:height .4s"></div>
    </div>`;
  }).join('');

  // Goal line via pseudo — draw as text label
  labelsEl.innerHTML = days.map(d =>
    `<span style="flex:1;text-align:center;font-size:9px;color:${d.isToday ? 'var(--accent)' : 'var(--text-3)'};font-weight:${d.isToday ? 700 : 400}">${d.label}</span>`
  ).join('');
}

let _foodCat = 'all';
let _foodSelIdx = -1;

// category → keywords that appear in food.cat
const FOOD_CAT_MAP = {
  all: null,
  meat:   ['мясо','рыба','птица','морепродукты'],
  dairy:  ['молочное','яйца'],
  grains: ['крупы','хлеб','паста','злаки'],
  veg:    ['овощи'],
  fruit:  ['фрукты','ягоды'],
  nuts:   ['орехи','масла','жиры'],
  other:  ['сладкое','напитки','готовое','разное'],
};

window.setFoodCat = function(cat) {
  _foodCat = cat;
  ['all','meat','dairy','grains','veg','fruit','nuts','other'].forEach(c => {
    const el = document.getElementById(`fcat-${c}`);
    if (el) el.className = 'chip' + (c === cat ? ' chip-active' : '');
  });
  filterFoodList();
};

window.filterFoodList = function() {
  const search = (document.getElementById('food-search-input')?.value || '').toLowerCase();
  const catKeys = FOOD_CAT_MAP[_foodCat];

  const filtered = FOOD_DB.map((f, i) => ({ f, i })).filter(({ f }) => {
    const matchCat = !catKeys || catKeys.some(k => (f.cat || '').toLowerCase().includes(k));
    const matchSearch = !search || f.name.toLowerCase().includes(search);
    return matchCat && matchSearch;
  });

  const list = document.getElementById('food-filtered-list');
  if (!list) return;

  list.innerHTML = filtered.slice(0, 60).map(({ f, i }) =>
    `<div onclick="selectFood(${i})" id="fitem-${i}" style="
      padding:8px 10px;border-radius:10px;cursor:pointer;font-size:13px;
      display:flex;justify-content:space-between;align-items:center;
      background:${_foodSelIdx === i ? 'rgba(91,138,240,.18)' : 'var(--bg-elevated)'};
      border:1px solid ${_foodSelIdx === i ? 'rgba(91,138,240,.5)' : 'transparent'};
      transition:background .15s">
      <span>${f.emoji || ''} ${f.name}</span>
      <span style="font-size:11px;color:var(--text-3);flex-shrink:0;margin-left:8px">${f.kcal} ккал/100г</span>
    </div>`
  ).join('') || '<div style="text-align:center;color:var(--text-3);padding:16px;font-size:13px">Ничего не найдено</div>';
};

window.selectFood = function(idx) {
  _foodSelIdx = idx;
  // sync hidden select
  const sel = document.getElementById('food-select');
  if (sel) sel.value = idx;
  filterFoodList(); // re-render to highlight selection
  updateFoodPreview();
};

function updateFoodPreview() {
  const food = FOOD_DB[_foodSelIdx];
  const g    = +(document.getElementById('food-qty')?.value) || 0;
  if (!food || !g) { setEl('food-preview', food ? `Выбрано: ${food.name}` : ''); return; }
  const k = Math.round(food.kcal * g / 100);
  setEl('food-preview', `${food.emoji || ''} ${k} ккал  •  Б:${(food.p*g/100).toFixed(1)}г  У:${(food.c*g/100).toFixed(1)}г  Ж:${(food.f*g/100).toFixed(1)}г`);
}

function setupFoodForm() {
  const sel = document.getElementById('food-select');
  const qty = document.getElementById('food-qty');
  if (!sel || !qty) return;

  // populate hidden select for backward-compat
  sel.innerHTML = '<option value="">— Выбери продукт —</option>' +
    FOOD_DB.map((f, i) => `<option value="${i}">${f.name}</option>`).join('');

  // populate visual list
  _foodSelIdx = -1;
  filterFoodList();

  qty.addEventListener('input', updateFoodPreview);

  // reset state when sheet opens
  const sheet = document.getElementById('add-food-sheet');
  if (sheet) {
    const observer = new MutationObserver(() => {
      if (sheet.classList.contains('open')) {
        _foodSelIdx = -1;
        const si = document.getElementById('food-search-input');
        if (si) si.value = '';
        _foodCat = 'all';
        window.setFoodCat('all');
        if (si) setTimeout(() => si.focus(), 300);
      }
    });
    observer.observe(sheet, { attributes: true, attributeFilter: ['class'] });
  }
}

window.addFood = async function() {
  const qty  = document.getElementById('food-qty');
  const food = FOOD_DB[_foodSelIdx];
  const g    = +qty.value;
  if (!food || g <= 0) { showToast('Выбери продукт и укажи количество'); return; }

  const item = {
    name:    `${food.name} (${g}г)`,
    kcal:    Math.round(food.kcal * g / 100),
    p:       food.p * g / 100,
    c:       food.c * g / 100,
    f:       food.f * g / 100,
    addedAt: Date.now(),
  };
  try { await WDB.addNutrition(item); } catch (e) {}
  S.nutritionItems.push(item);
  // Persist daily kcal for 7-day chart
  const todayKcalKey = 'lmc_kcal_' + todayStr();
  const prevKcal = parseInt(localStorage.getItem(todayKcalKey) || '0', 10);
  localStorage.setItem(todayKcalKey, prevKcal + Math.round(item.kcal || 0));
  _foodSelIdx = -1; qty.value = ''; setEl('food-preview', '');
  renderNutrition();
  showToast(`✅ Добавлено: ${item.name}`);
  document.getElementById('add-food-sheet').classList.remove('open');
};

window.deleteMealItem = async function(idx) {
  const item = S.nutritionItems[idx];
  if (!item) return;
  try { if (item.id) await WDB.deleteNutrition(item.id); } catch(e) {}
  S.nutritionItems.splice(idx, 1);
  renderNutrition();
  showToast('🗑 Удалено');
};

// ── Profile ───────────────────────────────────────────────────────────────────
async function renderProfile() {
  const name = S.userName || 'Спортсмен';
  setEl('profile-name',   name);
  setEl('profile-avatar', name.charAt(0).toUpperCase());
  const lastW = S.bodyStats.filter(s => s.weightKg > 0).at(-1);
  setEl('profile-weight-stat', lastW ? `${lastW.weightKg} кг` : '—');
  setEl('profile-workout-stat', S.allWorkouts.length);
  setEl('profile-streak-stat',  S.streak);

  // BMI indicator
  const bmiBlock = document.getElementById('profile-bmi-block');
  if (bmiBlock) {
    if (lastW && S.heightCm >= 100) {
      const bmi = (lastW.weightKg / ((S.heightCm / 100) ** 2)).toFixed(1);
      const bmiColor = bmi < 18.5 ? 'var(--orange)' : bmi < 25 ? 'var(--green)' : bmi < 30 ? 'var(--orange)' : 'var(--red)';
      const bmiLabel = bmi < 18.5 ? 'Дефицит' : bmi < 25 ? 'Норма ✓' : bmi < 30 ? 'Избыток' : 'Ожирение';
      setEl('profile-bmi-val', bmi);
      setEl('profile-bmi-lbl', bmiLabel);
      const valEl = document.getElementById('profile-bmi-val');
      if (valEl) valEl.style.color = bmiColor;
      bmiBlock.style.display = '';
    } else {
      bmiBlock.style.display = 'none';
    }
  }

  // Lifetime stats (async)
  calcLifetimeStats();

  // Weekly goals rings
  drawGoalRing('goal-ring-workouts', S.weekWorkouts, S.weekGoal,   '#6366f1', 'goal-ring-workouts-val', 'goal-ring-workouts-goal', `/ ${S.weekGoal}`);
  const todayWaterL = (S.waterMl / 1000).toFixed(1);
  const waterGoalL  = (S.waterGoalMl / 1000).toFixed(1);
  drawGoalRing('goal-ring-water',    S.waterMl,      S.waterGoalMl,'#38bdf8', 'goal-ring-water-val',    null, null, todayWaterL);
  const todayKcal  = +localStorage.getItem('lmc_kcal_' + todayStr()) || 0;
  const kcalGoal   = S.kcalGoal || 2000;
  drawGoalRing('goal-ring-kcal',     todayKcal,      kcalGoal,     '#fb923c', 'goal-ring-kcal-val',     null, null, todayKcal > 999 ? Math.round(todayKcal/100)/10 + 'k' : String(todayKcal));

  // Best week card
  const bwCard = document.getElementById('best-week-card');
  if (bwCard && S.allWorkouts.length > 0) {
    const MS_WEEK = 7 * 24 * 3600 * 1000;
    // Group workouts by ISO week key (YYYY-Www)
    const weekMap = {};
    S.allWorkouts.forEach(w => {
      const d = new Date(w.startedAt);
      const jan4 = new Date(d.getFullYear(), 0, 4);
      const weekNum = Math.ceil(((d - jan4) / 86400000 + jan4.getDay() + 1) / 7);
      const key = `${d.getFullYear()}-W${String(weekNum).padStart(2,'0')}`;
      if (!weekMap[key]) weekMap[key] = { count: 0, vol: 0, startMs: d.getTime() };
      weekMap[key].count++;
      weekMap[key].vol += (w.totalVolumeKg || 0);
    });
    const best = Object.values(weekMap).reduce((a, b) => b.count > a.count ? b : a);
    if (best.count > 0) {
      bwCard.style.display = '';
      setEl('best-week-count', best.count);
      const start = new Date(best.startMs);
      const end   = new Date(best.startMs + 6 * 86400000);
      const fmt   = d => `${d.getDate()} ${['янв','фев','мар','апр','май','июн','июл','авг','сен','окт','ноя','дек'][d.getMonth()]}`;
      setEl('best-week-dates', `${fmt(start)} – ${fmt(end)}`);
      setEl('best-week-vol',   best.vol > 0 ? `Объём: ${Math.round(best.vol).toLocaleString('ru')} кг` : '');
    }
  }
}

function drawGoalRing(canvasId, value, goal, color, valElId, goalElId, goalText, valOverride) {
  const canvas = document.getElementById(canvasId);
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const cx = 36, cy = 36, r = 28, sw = 7;
  ctx.clearRect(0, 0, 72, 72);
  // Track
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.07)';
  ctx.lineWidth = sw;
  ctx.stroke();
  // Fill
  const pct = goal > 0 ? Math.min(value / goal, 1) : 0;
  if (pct > 0) {
    ctx.beginPath();
    ctx.arc(cx, cy, r, -Math.PI / 2, -Math.PI / 2 + Math.PI * 2 * pct);
    ctx.strokeStyle = pct >= 1 ? '#4ade80' : color;
    ctx.lineWidth = sw;
    ctx.lineCap = 'round';
    ctx.stroke();
  }
  // Labels
  const valEl = document.getElementById(valElId);
  if (valEl) { valEl.textContent = valOverride !== undefined ? valOverride : value; if (pct >= 1) valEl.style.color = '#4ade80'; }
  if (goalElId && goalText) { const gEl = document.getElementById(goalElId); if (gEl) gEl.textContent = goalText; }
}


async function calcLifetimeStats() {
  try {
    const ws = S.allWorkouts;
    let totalSets = 0, totalVolumeKg = 0;
    const exCount = {};
    const activeDays = new Set();
    for (const w of ws) {
      activeDays.add(w.date);
      try {
        const sets = await WDB.getSetsFor(w.id);
        sets.forEach(s => {
          totalSets++;
          totalVolumeKg += (s.weight || 0) * (s.reps || 0);
          if (s.exerciseName) {
            exCount[s.exerciseName] = (exCount[s.exerciseName] || 0) + 1;
          }
        });
      } catch(e) {}
    }
    const topEx = Object.entries(exCount).sort((a,b) => b[1]-a[1])[0]?.[0] || '—';
    const vol = Math.round(totalVolumeKg);
    setEl('lt-volume', vol >= 1000 ? `${(vol/1000).toFixed(1)}т` : `${vol}`);
    setEl('lt-sets',   totalSets.toLocaleString('ru'));
    setEl('lt-days',   activeDays.size);
    setEl('lt-fave',   topEx);
    drawProfileHeatmap(ws);
  } catch(e) {}
}

function drawProfileHeatmap(ws) {
  const canvas = document.getElementById('profile-heatmap');
  if (!canvas) return;
  const W = canvas.offsetWidth || 300;
  canvas.width  = W;
  canvas.height = 32;
  const ctx  = canvas.getContext('2d');
  const WEEKS = 12;
  const now   = new Date();
  const daySet = new Set(ws.map(w => w.date));
  const gap  = 3;
  const barW = (W - (WEEKS - 1) * gap) / WEEKS;
  ctx.clearRect(0, 0, W, 32);
  for (let i = 0; i < WEEKS; i++) {
    const weekEnd   = new Date(now);
    weekEnd.setDate(weekEnd.getDate() - (WEEKS - 1 - i) * 7);
    const weekStart = new Date(weekEnd);
    weekStart.setDate(weekStart.getDate() - 6);
    let count = 0;
    const d = new Date(weekStart);
    while (d <= weekEnd) {
      if (daySet.has(d.toISOString().slice(0,10))) count++;
      d.setDate(d.getDate() + 1);
    }
    const minH = 5;
    const barH = count === 0 ? minH : Math.min(32, minH + count * 4.5);
    const alpha = count === 0 ? 0.08 : Math.min(0.95, 0.25 + count * 0.15);
    const x = i * (barW + gap);
    const y = 32 - barH;
    ctx.fillStyle = count === 0 ? `rgba(255,255,255,0.06)` : `rgba(20,184,166,${alpha})`;
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, barW, barH, 3);
    else ctx.rect(x, y, barW, barH);
    ctx.fill();
  }
}

window.saveProfile = function() {
  const name   = document.getElementById('prof-name')?.value.trim();
  const goal   = +document.getElementById('prof-goal')?.value   || 4;
  const wgoal  = +document.getElementById('prof-wgoal')?.value  || 2500;
  const kcal   = +document.getElementById('prof-kcal')?.value   || 2000;
  const height = +document.getElementById('prof-height')?.value || 0;
  if (name) { S.userName = name; localStorage.setItem('lmc_name', name); }
  S.weekGoal    = goal;   localStorage.setItem('lmc_wg',         goal);
  S.waterGoalMl = wgoal;  localStorage.setItem('lmc_wg_ml',      wgoal);
  S.kcalGoal    = kcal;   localStorage.setItem('lmc_kcal_goal',   kcal);
  if (height >= 100 && height <= 250) { S.heightCm = height; localStorage.setItem('lmc_height', height); }
  const targetWeight = +document.getElementById('prof-target-weight')?.value || 0;
  if (targetWeight >= 30 && targetWeight <= 250) localStorage.setItem('lmc_target_weight', targetWeight);
  renderDashboard();
  renderProfile();
  renderProgress();
  renderWater();
  renderNutrition();
  showToast('✅ Профиль сохранён!');
};

window.exportData = async function() {
  try {
    const data = {
      exportedAt: new Date().toISOString(),
      profile: { name: S.userName, weekGoal: S.weekGoal, waterGoalMl: S.waterGoalMl, kcalGoal: S.kcalGoal },
      workouts: S.allWorkouts,
      bodyStats: S.bodyStats,
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = lmc-export-.json;
    a.click();
    URL.revokeObjectURL(url);
    showToast('📤 Данные экспортированы!');
  } catch (e) { showToast('Ошибка экспорта'); }
};
window.saveBodyStat = async function() {
  const w = +document.getElementById('body-weight')?.value;
  if (!w || w < 20 || w > 300) { showToast('Введи корректный вес (20–300 кг)'); return; }
  try {
    await WDB.saveBodyStat({ weightKg: w });
    S.bodyStats = await WDB.getBodyStats();
  } catch (e) {}
  document.getElementById('body-weight').value = '';
  setEl('qs-weight', `${w} кг`);
  setEl('prog-weight', `${w} кг`);
  setEl('profile-weight-stat', `${w} кг`);
  renderWeightGraph();
  showToast(`⚖️ Вес ${w} кг сохранён!`);
  document.getElementById('weight-sheet').classList.remove('open');
};

// ── Install Banner ────────────────────────────────────────────────────────────
function setupInstallBanner() {
  window.addEventListener('beforeinstallprompt', e => {
    e.preventDefault();
    S.deferredPrompt = e;
    document.getElementById('install-banner')?.classList.add('show');
  });
  const btn = document.getElementById('install-btn');
  if (btn) btn.addEventListener('click', async () => {
    if (!S.deferredPrompt) return;
    S.deferredPrompt.prompt();
    const { outcome } = await S.deferredPrompt.userChoice;
    S.deferredPrompt = null;
    document.getElementById('install-banner')?.classList.remove('show');
    if (outcome === 'accepted') showToast('🎉 Приложение установлено!');
  });

  // iOS hint after 2 sec
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
  if (isIOS && !isStandalone) {
    setTimeout(() => document.getElementById('ios-hint')?.classList.add('show'), 2500);
  }
}

// ── Helpers ───────────────────────────────────────────────────────────────────
function todayStr() { return new Date().toISOString().split('T')[0]; }

function prevDay(dateStr) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() - 1);
  return d.toISOString().split('T')[0];
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return 'Сегодня';
  if (diff === 1) return 'Вчера';
  return new Date(dateStr).toLocaleDateString('ru-RU', { day:'numeric', month:'short' });
}

function formatDateFull(dateStr) {
  if (!dateStr) return '';
  const diff = Math.floor((Date.now() - new Date(dateStr)) / 86400000);
  if (diff === 0) return '— Сегодня';
  if (diff === 1) return '— Вчера';
  return new Date(dateStr).toLocaleDateString('ru-RU', { weekday:'long', day:'numeric', month:'long' });
}

function setEl(id, val) {
  const el = document.getElementById(id);
  if (el) el.textContent = val;
}

function show(id) { const el = document.getElementById(id); if (el) el.style.display = ''; }
function hide(id) { const el = document.getElementById(id); if (el) el.style.display = 'none'; }

// ══════════════════════════════════════════════════════════════════════════════
// WORKOUT TEMPLATES
// ══════════════════════════════════════════════════════════════════════════════
const TEMPLATES = [
  {
    id: 'chest', name: 'Грудь + Трицепс', emoji: '💪', color: '#1A2A4A', group: 'upper',
    exercises: [
      { name:'Жим лёжа',          emoji:'🏋️', sets:4, reps:8  },
      { name:'Жим гантелей лёжа', emoji:'🏋️', sets:3, reps:10 },
      { name:'Разводка гантелей', emoji:'🏋️', sets:3, reps:12 },
      { name:'Французский жим',   emoji:'💪', sets:3, reps:12 },
      { name:'Разгибание в блоке',emoji:'💪', sets:3, reps:15 },
    ],
  },
  {
    id: 'back', name: 'Спина + Бицепс', emoji: '🤸', color: '#3A1A1A', group: 'upper',
    exercises: [
      { name:'Подтягивания',          emoji:'🤸', sets:4, reps:8  },
      { name:'Тяга верхнего блока',   emoji:'💪', sets:3, reps:10 },
      { name:'Тяга к поясу',          emoji:'🤸', sets:3, reps:10 },
      { name:'Тяга гантели в наклоне',emoji:'💪', sets:3, reps:12 },
      { name:'Сгибание с гантелями',  emoji:'💪', sets:3, reps:12 },
    ],
  },
  {
    id: 'legs', name: 'Ноги', emoji: '🦵', color: '#1A3A1A', group: 'lower',
    exercises: [
      { name:'Приседания',    emoji:'🦵', sets:4, reps:8  },
      { name:'Жим ногами',   emoji:'🦵', sets:3, reps:12 },
      { name:'Румынская тяга',emoji:'🦵', sets:3, reps:10 },
      { name:'Выпады',       emoji:'🦵', sets:3, reps:12 },
      { name:'Разгибание ног',emoji:'🦵', sets:3, reps:15 },
    ],
  },
  {
    id: 'shoulders', name: 'Плечи', emoji: '🏋️', color: '#2A1A3A', group: 'upper',
    exercises: [
      { name:'Жим штанги стоя',  emoji:'🏋️', sets:4, reps:8  },
      { name:'Махи в стороны',   emoji:'🏋️', sets:4, reps:12 },
      { name:'Махи вперёд',      emoji:'🏋️', sets:3, reps:12 },
      { name:'Обратные разводки',emoji:'💪', sets:3, reps:15 },
      { name:'Тяга к подбородку',emoji:'💪', sets:3, reps:10 },
    ],
  },
  {
    id: 'fullbody', name: 'Фулл-боди', emoji: '🔥', color: '#2A1A2A', group: 'full',
    exercises: [
      { name:'Приседания',      emoji:'🦵', sets:3, reps:10 },
      { name:'Жим лёжа',       emoji:'🏋️', sets:3, reps:10 },
      { name:'Становая тяга',  emoji:'💪', sets:3, reps:8  },
      { name:'Жим штанги стоя',emoji:'🏋️', sets:3, reps:10 },
      { name:'Подтягивания',   emoji:'🤸', sets:3, reps:8  },
    ],
  },
  {
    id: 'core', name: 'Кор + Кардио', emoji: '🧘', color: '#1A3A2A', group: 'full',
    exercises: [
      { name:'Планка',               emoji:'🧘', sets:3, reps:60 },
      { name:'Скручивания',          emoji:'🧘', sets:3, reps:20 },
      { name:'Подъём ног лёжа',      emoji:'🧘', sets:3, reps:15 },
      { name:'Русские скручивания',  emoji:'🧘', sets:3, reps:20 },
      { name:'Берпи',                emoji:'🤸', sets:3, reps:10 },
    ],
  },
  {
    id: 'push', name: 'Push (толчок)', emoji: '🚀', color: '#1E2A3A', group: 'upper',
    exercises: [
      { name:'Жим лёжа',            emoji:'🏋️', sets:4, reps:6  },
      { name:'Жим гантелей лёжа',   emoji:'🏋️', sets:3, reps:10 },
      { name:'Жим штанги стоя',     emoji:'🏋️', sets:3, reps:8  },
      { name:'Махи в стороны',      emoji:'🏋️', sets:4, reps:12 },
      { name:'Разгибание в блоке',  emoji:'💪', sets:3, reps:15 },
      { name:'Французский жим',     emoji:'💪', sets:3, reps:12 },
    ],
  },
  {
    id: 'pull', name: 'Pull (тяга)', emoji: '🪝', color: '#2A1A0A', group: 'upper',
    exercises: [
      { name:'Становая тяга',          emoji:'⚡', sets:4, reps:5  },
      { name:'Подтягивания',           emoji:'🤸', sets:4, reps:8  },
      { name:'Тяга верхнего блока',    emoji:'💪', sets:3, reps:10 },
      { name:'Тяга штанги в наклоне',  emoji:'🤸', sets:3, reps:8  },
      { name:'Сгибание со штангой',    emoji:'💪', sets:3, reps:10 },
      { name:'Молотковые сгибания',    emoji:'💪', sets:3, reps:12 },
    ],
  },
  {
    id: 'hiit', name: 'HIIT / Кардио', emoji: '🔥', color: '#3A0A0A', group: 'full',
    exercises: [
      { name:'Берпи',              emoji:'🤸', sets:4, reps:15 },
      { name:'Прыжки со скакалкой',emoji:'🏃', sets:5, reps:60 },
      { name:'Альпинист',          emoji:'🧗', sets:4, reps:30 },
      { name:'Запрыгивания на ящик',emoji:'🦵', sets:4, reps:10 },
      { name:'Спринт на месте',    emoji:'🏃', sets:6, reps:20 },
    ],
  },
];

let _tplFilter = 'all';

window.filterTemplates = function(group) {
  _tplFilter = group;
  ['all','upper','lower','full'].forEach(g => {
    const el = document.getElementById(`tpl-chip-${g}`);
    if (el) el.className = 'chip' + (g === group ? ' chip-active' : '');
  });
  renderTemplates();
};

function renderTemplates() {
  const el = document.getElementById('templates-list');
  if (!el) return;
  const list = _tplFilter === 'all' ? TEMPLATES : TEMPLATES.filter(t => t.group === _tplFilter);
  el.innerHTML = list.map(t => {
    const totalSets = t.exercises.reduce((s, e) => s + e.sets, 0);
    const totalReps = t.exercises.reduce((s, e) => s + e.sets * e.reps, 0);
    return `
    <div class="template-card" onclick="startTemplate('${t.id}')">
      <div class="template-header" style="background:linear-gradient(135deg,${t.color},${t.color}88)">
        <span style="font-size:32px">${t.emoji}</span>
        <div style="flex:1">
          <div style="font-size:15px;font-weight:700;color:#fff">${t.name}</div>
          <div style="display:flex;gap:10px;margin-top:4px">
            <span style="font-size:11px;color:rgba(255,255,255,.65)">${t.exercises.length} упр.</span>
            <span style="font-size:11px;color:rgba(255,255,255,.65)">${totalSets} подх.</span>
            <span style="font-size:11px;color:rgba(255,255,255,.45)">~${Math.round(totalSets * 2.5)} мин</span>
          </div>
        </div>
      </div>
      <div style="padding:10px 12px;display:flex;gap:6px;flex-wrap:wrap">
        ${t.exercises.slice(0,3).map(e =>
          `<span style="font-size:11px;color:var(--text-2);background:var(--bg-elevated);padding:3px 8px;border-radius:var(--radius-pill)">${e.emoji} ${e.name}</span>`
        ).join('')}
        ${t.exercises.length > 3 ? `<span style="font-size:11px;color:var(--text-3);padding:3px 0">+${t.exercises.length-3}</span>` : ''}
      </div>
    </div>`;
  }).join('');
}

window.startTemplate = function(id) {
  const t = TEMPLATES.find(x => x.id === id);
  if (!t) return;
  // Show template detail sheet
  const sheet = document.getElementById('template-sheet');
  if (!sheet) return;
  document.getElementById('tmpl-name').textContent = `${t.emoji} ${t.name}`;
  const exList = document.getElementById('tmpl-exercises');
  exList.innerHTML = t.exercises.map((e, i) => `
    <div style="display:flex;align-items:center;gap:12px;padding:10px 0;border-bottom:1px solid var(--border)">
      <div style="width:26px;height:26px;border-radius:50%;background:var(--accent-dim);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:700;color:var(--accent);flex-shrink:0">${i+1}</div>
      <div style="flex:1">
        <div style="font-size:14px;font-weight:500">${e.emoji} ${e.name}</div>
        <div style="font-size:11px;color:var(--text-2);margin-top:1px">${e.sets} подхода × ${e.reps} повт.</div>
      </div>
    </div>
  `).join('');
  sheet._templateId = id;
  sheet.classList.add('open');
};

window.beginTemplate = function() {
  const sheet = document.getElementById('template-sheet');
  const id    = sheet._templateId;
  const t     = TEMPLATES.find(x => x.id === id);
  if (!t) return;
  sheet.classList.remove('open');

  // Pre-select first exercise and start log
  const first = t.exercises[0];
  S._templateQueue = t.exercises.slice(1);
  selectExercise(first.name, first.emoji, '#1A2A4A');

  // Pre-fill sets from template
  S.log.sets = Array.from({ length: first.sets }, () => ({ weight:'', reps: String(first.reps), done:false }));
  renderSets();
  switchTab('log');
  showToast(`🏋️ Шаблон «${t.name}» загружен!`);
};

// ══════════════════════════════════════════════════════════════════════════════
// SLEEP TRACKER
// ══════════════════════════════════════════════════════════════════════════════
function getSleepData() {
  try { return JSON.parse(localStorage.getItem('lmc_sleep') || '[]'); } catch (e) { return []; }
}
function saveSleepData(data) {
  localStorage.setItem('lmc_sleep', JSON.stringify(data.slice(-30)));
}

function renderSleep() {
  const data = getSleepData();
  const today = todayStr();
  const todayEntry = data.find(s => s.date === today);

  // Today card
  const hoursEl = document.getElementById('sleep-hours-today');
  const qualEl  = document.getElementById('sleep-quality-today');
  if (hoursEl) hoursEl.textContent = todayEntry ? `${todayEntry.hours}ч` : '—';
  if (qualEl)  qualEl.textContent  = todayEntry ? SLEEP_QUALITY[todayEntry.quality]?.label || '' : 'Не записано';

  // Average
  const last7 = data.slice(-7);
  const avg   = last7.length ? (last7.reduce((s,e) => s+e.hours, 0) / last7.length).toFixed(1) : '—';
  setEl('sleep-avg', avg !== '—' ? `${avg}ч` : '—');

  // Canvas sleep chart
  const canvas = document.getElementById('sleep-chart-canvas');
  if (canvas) {
    const W = canvas.offsetWidth || 300;
    canvas.width  = W;
    canvas.height = 100;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, W, 100);

    const days = [];
    const DAY_LABELS = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
    for (let i = 6; i >= 0; i--) {
      const d = new Date(); d.setDate(d.getDate() - i);
      days.push(d.toISOString().split('T')[0]);
    }

    const maxH   = 10;
    const padL   = 24, padR = 8, padT = 8, padB = 22;
    const barW   = Math.floor((W - padL - padR) / 7);
    const chartH = 100 - padT - padB;

    // 8h reference line
    const refY = padT + chartH - (8 / maxH) * chartH;
    ctx.beginPath();
    ctx.setLineDash([3, 3]);
    ctx.moveTo(padL, refY);
    ctx.lineTo(W - padR, refY);
    ctx.strokeStyle = 'rgba(20,184,166,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.setLineDash([]);

    // Y axis label "8ч"
    ctx.fillStyle = 'rgba(20,184,166,0.6)';
    ctx.font = '8px sans-serif';
    ctx.textAlign = 'right';
    ctx.fillText('8ч', padL - 2, refY + 3);

    days.forEach((date, i) => {
      const entry = data.find(e => e.date === date);
      const h = entry ? Math.min(entry.hours, maxH) : 0;
      const x = padL + i * barW;
      const bh = h > 0 ? Math.max(4, (h / maxH) * chartH) : 3;
      const by = padT + chartH - bh;

      // Bar
      const isToday = i === 6;
      const color = h >= 7 ? '#4ade80' : h >= 5 ? '#fb923c' : h > 0 ? '#ef4444' : 'rgba(255,255,255,0.08)';
      ctx.fillStyle = isToday ? (color === 'rgba(255,255,255,0.08)' ? 'rgba(99,102,241,0.3)' : color) : color;
      const bx = x + 3;
      const bww = barW - 6;
      const radius = 3;
      ctx.beginPath();
      ctx.moveTo(bx + radius, by);
      ctx.lineTo(bx + bww - radius, by);
      ctx.quadraticCurveTo(bx + bww, by, bx + bww, by + radius);
      ctx.lineTo(bx + bww, by + bh);
      ctx.lineTo(bx, by + bh);
      ctx.lineTo(bx, by + radius);
      ctx.quadraticCurveTo(bx, by, bx + radius, by);
      ctx.closePath();
      ctx.fill();

      // Hour label on bar
      if (h > 0) {
        ctx.fillStyle = 'rgba(255,255,255,0.85)';
        ctx.font = `${isToday ? 'bold ' : ''}9px sans-serif`;
        ctx.textAlign = 'center';
        ctx.fillText(`${entry.hours}ч`, bx + bww / 2, by - 2);
      }

      // Day label
      const dowIdx = (new Date(date).getDay() + 6) % 7;
      ctx.fillStyle = isToday ? '#818cf8' : 'rgba(255,255,255,0.4)';
      ctx.font = isToday ? 'bold 9px sans-serif' : '9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(DAY_LABELS[dowIdx], bx + bww / 2, 100 - 6);
    });
  }

  // Sleep debt card
  const debtCard = document.getElementById('sleep-debt-card');
  if (debtCard && last7.length > 0) {
    const targetTotal = last7.length * 8;
    const actualTotal = last7.reduce((s, e) => s + e.hours, 0);
    const debt = targetTotal - actualTotal;
    const isDebt = debt > 0;
    const absH = Math.abs(debt);
    const h = Math.floor(absH);
    const m = Math.round((absH - h) * 60);
    debtCard.style.display = '';
    setEl('sleep-debt-emoji', isDebt ? '😴' : '✅');
    setEl('sleep-debt-title', isDebt ? 'Недосып за неделю' : 'Режим соблюдён');
    setEl('sleep-debt-body', isDebt ? `Нехватка ${h}ч ${m}м · Цель 8ч/ночь` : `Запас +${h}ч ${m}м · Отлично!`);
    setEl('sleep-debt-val', (isDebt ? '-' : '+') + `${h}ч ${m}м`);
    const debEl = document.getElementById('sleep-debt-val');
    if (debEl) debEl.style.color = isDebt ? '#EF5350' : '#4CAF50';
  }

  // Sleep score card
  const goodNights = last7.filter(e => e.hours >= 7).length;
  const pct = last7.length > 0 ? Math.round(goodNights / last7.length * 100) : 0;
  setEl('sleep-score-avg', avg !== '—' ? avg : '—');
  setEl('sleep-score-good', goodNights + '/7');
  setEl('sleep-score-pct', pct + '%');
  const pctEl = document.getElementById('sleep-score-pct');
  if (pctEl) pctEl.style.color = pct >= 70 ? '#4CAF50' : pct >= 50 ? '#FF9800' : '#EF5350';
}

const SLEEP_QUALITY = {
  great: { label: '😴 Отлично', emoji: '😴', score: 5 },
  good:  { label: '🙂 Хорошо',  emoji: '🙂', score: 4 },
  ok:    { label: '😐 Норм',    emoji: '😐', score: 3 },
  bad:   { label: '😪 Плохо',   emoji: '😪', score: 2 },
  awful: { label: '🥱 Ужасно',  emoji: '🥱', score: 1 },
};

window.logSleep = function() {
  const h = +document.getElementById('sleep-input-hours')?.value;
  const q = document.getElementById('sleep-quality-select')?.value || 'good';
  if (!h || h < 1 || h > 14) { showToast('Введи часы сна (1–14)'); return; }
  const data = getSleepData();
  const today = todayStr();
  const idx   = data.findIndex(e => e.date === today);
  const entry = { date: today, hours: h, quality: q };
  if (idx >= 0) data[idx] = entry; else data.push(entry);
  saveSleepData(data);
  renderSleep();
  showToast(`🌙 Сон ${h}ч записан!`);
  document.getElementById('sleep-log-sheet')?.classList.remove('open');
};

// ══════════════════════════════════════════════════════════════════════════════
// BODY MEASUREMENTS
// ══════════════════════════════════════════════════════════════════════════════
function getMeasurements() {
  try { return JSON.parse(localStorage.getItem('lmc_measurements') || '[]'); } catch (e) { return []; }
}
function saveMeasurements(data) {
  localStorage.setItem('lmc_measurements', JSON.stringify(data.slice(-30)));
}

window.saveMeasurement = function() {
  const fields = ['meas-chest','meas-waist','meas-hips','meas-bicep','meas-thigh'];
  const labels = ['Грудь','Талия','Бёдра','Бицепс','Бедро'];
  const entry  = { date: todayStr() };
  let hasData  = false;
  fields.forEach((id, i) => {
    const v = +document.getElementById(id)?.value;
    if (v > 0) { entry[id.replace('meas-','')] = v; hasData = true; }
  });
  if (!hasData) { showToast('Введи хотя бы одно значение'); return; }

  const data = getMeasurements();
  const idx  = data.findIndex(e => e.date === entry.date);
  if (idx >= 0) data[idx] = { ...data[idx], ...entry }; else data.push(entry);
  saveMeasurements(data);
  renderMeasurements();
  showToast('📏 Замеры сохранены!');
  fields.forEach(id => { const el = document.getElementById(id); if (el) el.value = ''; });
};

function drawMeasTrendChart(data) {
  const canvas = document.getElementById('meas-trend-canvas');
  const card   = document.getElementById('meas-chart-card');
  const legend = document.getElementById('meas-chart-legend');
  if (!canvas || data.length < 2) { if (card) card.style.display = 'none'; return; }
  card.style.display = '';

  const pts = data.slice(-10);
  const LINES = [
    { key:'chest', label:'Грудь',  color:'#5B8AF0' },
    { key:'waist', label:'Талия',  color:'#FF6B6B' },
    { key:'bicep', label:'Бицепс', color:'#22c55e' },
  ];

  const dpr = window.devicePixelRatio || 1;
  const W = canvas.offsetWidth || 300;
  const H = 120;
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + 'px';
  canvas.style.height = H + 'px';
  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);
  ctx.clearRect(0, 0, W, H);

  const PAD = { t: 10, b: 20, l: 28, r: 10 };
  const chartW = W - PAD.l - PAD.r;
  const chartH = H - PAD.t - PAD.b;

  const allVals = LINES.flatMap(l => pts.map(p => p[l.key]).filter(Boolean));
  if (allVals.length === 0) { card.style.display = 'none'; return; }
  const minV = Math.min(...allVals) - 2;
  const maxV = Math.max(...allVals) + 2;
  const vRange = maxV - minV || 1;

  // Grid lines
  ctx.strokeStyle = 'rgba(255,255,255,0.06)';
  ctx.lineWidth = 1;
  [0, 0.5, 1].forEach(f => {
    const y = PAD.t + chartH * (1 - f);
    ctx.beginPath(); ctx.moveTo(PAD.l, y); ctx.lineTo(PAD.l + chartW, y); ctx.stroke();
    ctx.fillStyle = 'rgba(255,255,255,0.2)';
    ctx.font = '9px system-ui';
    ctx.fillText(Math.round(minV + vRange * f), 0, y + 3);
  });

  // X labels (date)
  ctx.fillStyle = 'rgba(255,255,255,0.25)';
  ctx.font = '8px system-ui';
  ctx.textAlign = 'center';
  [0, Math.floor(pts.length / 2), pts.length - 1].forEach(i => {
    const x = PAD.l + (i / (pts.length - 1)) * chartW;
    const d = new Date(pts[i].date);
    ctx.fillText(`${d.getDate()}.${d.getMonth()+1}`, x, H - 4);
  });

  // Lines
  LINES.forEach(line => {
    const valid = pts.map((p, i) => ({ v: p[line.key], i })).filter(x => x.v);
    if (valid.length < 2) return;
    ctx.beginPath();
    ctx.strokeStyle = line.color;
    ctx.lineWidth   = 2;
    ctx.lineJoin    = 'round';
    valid.forEach(({ v, i }, j) => {
      const x = PAD.l + (i / (pts.length - 1)) * chartW;
      const y = PAD.t + chartH * (1 - (v - minV) / vRange);
      j === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    // Last dot
    const last = valid.at(-1);
    const lx = PAD.l + (last.i / (pts.length - 1)) * chartW;
    const ly = PAD.t + chartH * (1 - (last.v - minV) / vRange);
    ctx.beginPath();
    ctx.arc(lx, ly, 3, 0, Math.PI * 2);
    ctx.fillStyle = line.color;
    ctx.fill();
  });

  // Legend
  if (legend) {
    legend.innerHTML = LINES.map(l => `
      <div style="display:flex;align-items:center;gap:3px">
        <div style="width:10px;height:2px;background:${l.color};border-radius:1px"></div>
        <span style="font-size:9px;color:rgba(255,255,255,.45)">${l.label}</span>
      </div>`).join('');
  }
}

function renderMeasurements() {
  const data   = getMeasurements();
  const latest = data.at(-1);
  const prev   = data.at(-2);
  drawMeasTrendChart(data);

  const MEAS = [
    { key:'chest',  label:'Грудь',  emoji:'💙' },
    { key:'waist',  label:'Талия',  emoji:'🟡' },
    { key:'hips',   label:'Бёдра',  emoji:'💚' },
    { key:'bicep',  label:'Бицепс', emoji:'💪' },
    { key:'thigh',  label:'Бедро',  emoji:'🦵' },
  ];

  const el = document.getElementById('measurements-display');
  if (!el) return;

  if (!latest) {
    el.innerHTML = '<p style="color:var(--text-2);text-align:center;padding:20px;font-size:13px">Замеров пока нет</p>';
    return;
  }

  el.innerHTML = MEAS.map(m => {
    const cur  = latest[m.key];
    const old  = prev?.[m.key];
    if (!cur) return '';
    const diff  = old ? (cur - old).toFixed(1) : null;
    const color = diff === null ? '' : +diff <= 0 ? 'var(--green)' : 'var(--red)';
    const arrow = diff === null ? '' : +diff < 0 ? '↓' : +diff > 0 ? '↑' : '→';
    return `
      <div style="display:flex;align-items:center;justify-content:space-between;padding:10px 0;border-bottom:1px solid var(--border)">
        <div style="display:flex;align-items:center;gap:10px">
          <span style="font-size:18px">${m.emoji}</span>
          <span style="font-size:14px;color:var(--text-2)">${m.label}</span>
        </div>
        <div style="display:flex;align-items:center;gap:8px">
          ${diff !== null ? `<span style="font-size:12px;color:${color};font-weight:600">${arrow} ${Math.abs(+diff)}</span>` : ''}
          <span style="font-size:16px;font-weight:700;color:var(--text-1)">${cur} см</span>
        </div>
      </div>`;
  }).join('') || '<p style="color:var(--text-2);text-align:center;padding:16px;font-size:13px">Нет данных</p>';
}

// ══════════════════════════════════════════════════════════════════════════════
// ACHIEVEMENTS
// ══════════════════════════════════════════════════════════════════════════════
const ACHIEVEMENTS = [
  // ── Тренировки ────────────────────────────────────────────────────────────
  { id:'first',      icon:'🏅', name:'Первый шаг',       cat:'Тренировки', desc:'Запиши первую тренировку',            check: s => s.allWorkouts.length >= 1,   prog: s => [s.allWorkouts.length, 1]    },
  { id:'five',       icon:'⚡', name:'Первая пятёрка',   cat:'Тренировки', desc:'Запиши 5 тренировок',                 check: s => s.allWorkouts.length >= 5,   prog: s => [s.allWorkouts.length, 5]    },
  { id:'ten',        icon:'💪', name:'10 тренировок',    cat:'Тренировки', desc:'Запиши 10 тренировок',                check: s => s.allWorkouts.length >= 10,  prog: s => [s.allWorkouts.length, 10]   },
  { id:'thirty',     icon:'🌟', name:'30 тренировок',    cat:'Тренировки', desc:'Запиши 30 тренировок',                check: s => s.allWorkouts.length >= 30,  prog: s => [s.allWorkouts.length, 30]   },
  { id:'fifty',      icon:'🚀', name:'50 тренировок',    cat:'Тренировки', desc:'Запиши 50 тренировок',                check: s => s.allWorkouts.length >= 50,  prog: s => [s.allWorkouts.length, 50]   },
  { id:'hundred',    icon:'🏆', name:'Сотня',            cat:'Тренировки', desc:'100 тренировок!',                     check: s => s.allWorkouts.length >= 100, prog: s => [s.allWorkouts.length, 100]  },
  { id:'twofifty',   icon:'💎', name:'250 тренировок',   cat:'Тренировки', desc:'Посвящённый атлет',                   check: s => s.allWorkouts.length >= 250, prog: s => [s.allWorkouts.length, 250]  },
  // ── Серии ─────────────────────────────────────────────────────────────────
  { id:'streak3',    icon:'🔥', name:'3 дня подряд',     cat:'Серии',      desc:'Тренируйся 3 дня подряд',             check: s => s.streak >= 3,               prog: s => [s.streak, 3]                },
  { id:'week1',      icon:'🌊', name:'Неделя огня',      cat:'Серии',      desc:'7 дней подряд',                       check: s => s.streak >= 7,               prog: s => [s.streak, 7]                },
  { id:'twoweeks',   icon:'⚡', name:'Две недели',       cat:'Серии',      desc:'14 дней подряд',                      check: s => s.streak >= 14,              prog: s => [s.streak, 14]               },
  { id:'month',      icon:'📅', name:'Месяц',            cat:'Серии',      desc:'30 дней серии',                       check: s => s.streak >= 30,              prog: s => [s.streak, 30]               },
  // ── Вес и здоровье ────────────────────────────────────────────────────────
  { id:'weight1',    icon:'⚖️', name:'Взвешен',          cat:'Здоровье',   desc:'Запиши свой вес',                     check: s => s.bodyStats.length >= 1,     prog: s => [s.bodyStats.length, 1]      },
  { id:'weight5',    icon:'📉', name:'Трекер веса',      cat:'Здоровье',   desc:'5 записей веса',                      check: s => s.bodyStats.length >= 5,     prog: s => [s.bodyStats.length, 5]      },
  { id:'weight10',   icon:'📊', name:'Аналитик',         cat:'Здоровье',   desc:'10 записей веса',                     check: s => s.bodyStats.length >= 10,    prog: s => [s.bodyStats.length, 10]     },
  // ── Вода ──────────────────────────────────────────────────────────────────
  { id:'water1',     icon:'💧', name:'Водяной',          cat:'Питание',    desc:'Выпей суточную норму воды',            check: s => s.waterMl >= s.waterGoalMl && s.waterGoalMl > 0, prog: null },
  { id:'water2l',    icon:'🌊', name:'2 литра',          cat:'Питание',    desc:'Выпей 2000 мл воды за день',           check: s => s.waterMl >= 2000,           prog: s => [s.waterMl, 2000]            },
  // ── Питание ───────────────────────────────────────────────────────────────
  { id:'nut1',       icon:'🥗', name:'Едок',             cat:'Питание',    desc:'Добавь первый приём пищи',             check: s => s.nutritionItems.length >= 1, prog: null                             },
  { id:'nut5',       icon:'🍽️', name:'Повар',            cat:'Питание',    desc:'Запиши 5 приёмов пищи',               check: s => s.nutritionItems.length >= 5, prog: s => [s.nutritionItems.length, 5] },
  // ── Разнообразие ──────────────────────────────────────────────────────────
  { id:'exercises5', icon:'🎯', name:'Разнообразие',     cat:'Упражнения', desc:'Используй 5 разных упражнений',        check: s => new Set(s.allWorkouts.map(w => w.name)).size >= 5,  prog: s => [new Set(s.allWorkouts.map(w => w.name)).size, 5]  },
  { id:'exercises10',icon:'🎨', name:'Коллекционер',     cat:'Упражнения', desc:'Используй 10 разных упражнений',       check: s => new Set(s.allWorkouts.map(w => w.name)).size >= 10, prog: s => [new Set(s.allWorkouts.map(w => w.name)).size, 10] },
  // ── Особые ────────────────────────────────────────────────────────────────
  { id:'early',      icon:'🌅', name:'Ранняя пташка',    cat:'Особые',     desc:'Тренируйся до 8 утра',                 check: s => s.allWorkouts.some(w => { const h = new Date(w.date + 'T06:00').getHours(); return h < 8; }), prog: null },
  { id:'weekend',    icon:'🎉', name:'Чемпион выходных', cat:'Особые',     desc:'Тренируйся в субботу и воскресенье',   check: s => { const days = new Set(s.allWorkouts.map(w => new Date(w.date).getDay())); return days.has(0) && days.has(6); }, prog: null },
  { id:'comeback',   icon:'🔄', name:'Возвращение',      cat:'Особые',     desc:'Вернись после 7+ дней перерыва',       check: s => { if (s.allWorkouts.length < 2) return false; const sorted = s.allWorkouts.map(w => w.date).sort(); for (let i = 1; i < sorted.length; i++) { if ((new Date(sorted[i]) - new Date(sorted[i-1])) / 86400000 >= 7) return true; } return false; }, prog: null },
];

function getUnlocked() {
  try { return JSON.parse(localStorage.getItem('lmc_achievements') || '[]'); } catch (e) { return []; }
}
function setUnlocked(ids) {
  localStorage.setItem('lmc_achievements', JSON.stringify(ids));
}

function renderAchievements() {
  const el = document.getElementById('achievements-list');
  if (!el) return;
  const unlocked = getUnlocked();
  const unlockedCount = unlocked.length;
  const total = ACHIEVEMENTS.length;

  // Group by category
  const cats = [...new Set(ACHIEVEMENTS.map(a => a.cat))];
  let html = `
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px">
      <div style="font-size:13px;color:var(--text-2)">Разблокировано: <b style="color:var(--text-1)">${unlockedCount}</b> / ${total}</div>
      <div style="font-size:11px;color:var(--text-2)">${Math.round(unlockedCount/total*100)}%</div>
    </div>
    <div style="height:5px;background:var(--border);border-radius:3px;overflow:hidden;margin-bottom:18px">
      <div style="height:100%;width:${Math.round(unlockedCount/total*100)}%;background:var(--accent);border-radius:3px;transition:width .6s ease"></div>
    </div>`;

  cats.forEach(cat => {
    const items = ACHIEVEMENTS.filter(a => a.cat === cat);
    const catDone = items.filter(a => unlocked.includes(a.id)).length;
    html += `<div style="font-size:10px;font-weight:700;color:var(--text-2);letter-spacing:.5px;margin:14px 0 8px">${cat.toUpperCase()} (${catDone}/${items.length})</div>`;
    items.forEach(a => {
      const done = unlocked.includes(a.id);
      const prog = a.prog ? a.prog(S) : null;
      const progPct = prog ? Math.min(prog[0] / prog[1] * 100, 100).toFixed(0) : null;
      html += `
        <div style="display:flex;align-items:center;gap:10px;padding:10px 12px;
          border-radius:10px;margin-bottom:5px;
          background:${done ? 'rgba(91,138,240,.10)' : 'var(--bg-elevated)'};
          border:1px solid ${done ? 'rgba(91,138,240,.30)' : 'var(--border)'}">
          <div style="font-size:24px;width:32px;text-align:center;opacity:${done ? 1 : 0.4}">${a.icon}</div>
          <div style="flex:1;min-width:0">
            <div style="font-size:13px;font-weight:600;color:${done ? 'var(--text-1)' : 'var(--text-2)'}">${a.name}</div>
            <div style="font-size:11px;color:var(--text-2);margin-top:1px">${a.desc}</div>
            ${(!done && progPct !== null) ? `
            <div style="margin-top:5px;height:3px;background:var(--border);border-radius:2px;overflow:hidden">
              <div style="height:100%;width:${progPct}%;background:var(--accent);border-radius:2px"></div>
            </div>
            <div style="font-size:10px;color:var(--text-3);margin-top:2px">${prog[0]} / ${prog[1]}</div>` : ''}
          </div>
          ${done ? '<div style="color:#22c55e;font-size:16px;flex-shrink:0">✓</div>' : ''}
        </div>`;
    });
  });

  el.innerHTML = html;
}

// ══════════════════════════════════════════════════════════════════════════════
// TDEE CALCULATOR
// ══════════════════════════════════════════════════════════════════════════════
window.calcTdee = function() {
  const weight = +document.getElementById('tdee-weight')?.value;
  const height = +document.getElementById('tdee-height')?.value;
  const age    = +document.getElementById('tdee-age')?.value;
  const gender = document.getElementById('tdee-gender')?.value || 'male';
  const act    = +document.getElementById('tdee-activity')?.value || 1.375;

  if (!weight || !height || !age) { showToast('Заполни все поля'); return; }

  // Mifflin-St Jeor
  const bmr = gender === 'male'
    ? 10*weight + 6.25*height - 5*age + 5
    : 10*weight + 6.25*height - 5*age - 161;

  const tdee = Math.round(bmr * act);
  const cut  = Math.round(tdee - 500);
  const bulk = Math.round(tdee + 300);
  const bmi  = (weight / ((height/100)**2)).toFixed(1);
  const bmiLabel = bmi < 18.5 ? 'Дефицит' : bmi < 25 ? 'Норма ✓' : bmi < 30 ? 'Избыток' : 'Ожирение';

  const res = document.getElementById('tdee-result');
  if (res) {
    res.style.display = 'block';
    res.innerHTML = `
      <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:8px;margin-top:4px">
        <div class="macro-chip"><div class="mv" style="color:var(--accent)">${tdee}</div><div class="ml">TDEE (калории/день)</div></div>
        <div class="macro-chip"><div class="mv" style="color:var(--green)">${cut}</div><div class="ml">Похудение</div></div>
        <div class="macro-chip"><div class="mv" style="color:var(--orange)">${bulk}</div><div class="ml">Набор массы</div></div>
        <div class="macro-chip"><div class="mv" style="color:${bmi<25?'var(--green)':'var(--orange)'}">${bmi}</div><div class="ml">ИМТ (${bmiLabel})</div></div>
      </div>`;
  }
};

// ══════════════════════════════════════════════════════════════════════════════
// Init extras — call after main init
// ══════════════════════════════════════════════════════════════════════════════
document.addEventListener('DOMContentLoaded', () => {
  renderTemplates();
  renderSleep();
  renderMeasurements();
  setTimeout(checkAchievements, 1000);
});

// ── Notifications ────────────────────────────────────────────────────────────
window.requestNotifications = async function() {
  if (!('Notification' in window)) {
    showToast('Уведомления не поддерживаются браузером'); return;
  }
  const perm = await Notification.requestPermission();
  if (perm === 'granted') {
    showToast('✅ Уведомления включены!');
    localStorage.setItem('lmc_notif', '1');
    scheduleSmartWorkoutReminder();
    scheduleWaterReminder();
  } else {
    showToast('Уведомления заблокированы');
  }
};

function scheduleSmartWorkoutReminder() {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const now = new Date();
  const target = new Date(now);
  target.setHours(18, 0, 0, 0);
  if (target <= now) target.setDate(target.getDate() + 1);
  setTimeout(() => {
    const today = todayStr();
    const lastWorkout = localStorage.getItem('lmc_last_workout');
    if (lastWorkout !== today) {
      const daysSince = lastWorkout
        ? Math.floor((Date.now() - new Date(lastWorkout)) / 86400000)
        : 99;
      let title = '🏋️ Время тренировки!';
      let body  = 'Одна тренировка сегодня — и ты снова в ритме!';
      if (daysSince >= 3) {
        title = '🔥 Не теряй форму!';
        body  = `Уже ${daysSince} дня без тренировки. Короткая сессия сохранит прогресс!`;
      } else if (daysSince === 2) {
        title = '💪 Пора вернуться!';
        body  = 'Два дня без тренировки — самое время! Даже 20 минут имеют значение.';
      }
      new Notification(title, { body, icon: '/app/icons/icon-192.png', tag: 'workout-reminder' });
    }
    scheduleSmartWorkoutReminder();
  }, target - now);
}

function scheduleWaterReminder() {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const now = new Date();
  const hour = now.getHours();
  if (hour < 9 || hour >= 21) {
    const next = new Date(now);
    next.setDate(next.getDate() + (hour >= 21 ? 1 : 0));
    next.setHours(9, 0, 0, 0);
    setTimeout(scheduleWaterReminder, next - now);
    return;
  }
  const waterKey = 'lmc_water_' + todayStr();
  const waterMl = parseInt(localStorage.getItem(waterKey) || '0', 10);
  const goalMl  = 2500;
  if (waterMl < goalMl) {
    const remaining = goalMl - waterMl;
    const glasses   = Math.max(1, Math.round(remaining / 250));
    let body;
    if (waterMl === 0)      body = 'Ты ещё не пил воду сегодня. Выпей стакан прямо сейчас! 🥤';
    else if (waterMl < 1000) body = `Выпито ${waterMl} мл — осталось ~${glasses} стакан(а). Пей! 💧`;
    else                     body = `Выпито ${waterMl} мл, осталось ${remaining} мл. Почти у цели! 💧`;
    new Notification('💧 Пора выпить воды', { body, icon: '/app/icons/icon-192.png', tag: 'water-reminder' });
  }
  setTimeout(scheduleWaterReminder, 2 * 60 * 60 * 1000);
}

// Auto-schedule if permission already granted
if (typeof Notification !== 'undefined' && Notification.permission === 'granted') {
  scheduleSmartWorkoutReminder();
  scheduleWaterReminder();
}

// ── Offline indicator ────────────────────────────────────────────────────────
window.addEventListener('online',  () => showToast('🌐 Онлайн', 2000));
window.addEventListener('offline', () => showToast('📴 Офлайн — приложение работает локально', 3000));

// ── Habit Tracker ────────────────────────────────────────────────────────────
const DEFAULT_HABITS_PWA = [
  { id:'1', name:'Тренировка',       emoji:'🏋️', doneOn:[] },
  { id:'2', name:'8 стаканов воды',  emoji:'💧', doneOn:[] },
  { id:'3', name:'Сон 8 часов',      emoji:'🌙', doneOn:[] },
  { id:'4', name:'Прогулка 30 мин',  emoji:'🚶', doneOn:[] },
  { id:'5', name:'Медитация',        emoji:'🧘', doneOn:[] },
];

function loadHabits() {
  try { return JSON.parse(localStorage.getItem('lmc_habits') || 'null') || DEFAULT_HABITS_PWA; }
  catch(_) { return DEFAULT_HABITS_PWA; }
}
function saveHabits(habits) { localStorage.setItem('lmc_habits', JSON.stringify(habits)); }

function habitStreak(doneOn) {
  let streak = 0, d = new Date();
  while (doneOn.includes(d.toISOString().split('T')[0])) { streak++; d.setDate(d.getDate()-1); }
  return streak;
}

function renderHabits() {
  const habits = loadHabits();
  const today  = todayStr();
  const done   = habits.filter(h => h.doneOn.includes(today)).length;
  const total  = habits.length;
  const pct    = total > 0 ? done / total : 0;

  setEl('habit-today-label', `${done} / ${total} привычек`);
  setEl('habit-pct', `${Math.round(pct*100)}%`);
  const bar = document.getElementById('habit-progress-bar');
  if (bar) bar.style.width = (pct*100)+'%';
  const ring = document.getElementById('habit-ring');
  if (ring) { ring.style.strokeDashoffset=(138.2*(1-pct)).toFixed(1); ring.style.stroke=pct>=1?'var(--green)':'var(--teal)'; }
  const doneMsg = document.getElementById('habit-done-msg');
  if (doneMsg) doneMsg.style.display = pct>=1 ? '' : 'none';

  const list = document.getElementById('habit-list');
  if (!list) return;
  list.innerHTML = habits.map(h => {
    const isDone = h.doneOn.includes(today);
    const streak = habitStreak(h.doneOn);
    const last7 = Array.from({length:7},(_,i)=>{
      const d=new Date(); d.setDate(d.getDate()-(6-i));
      const s=d.toISOString().split('T')[0];
      return `<div style="width:7px;height:7px;border-radius:50%;background:${h.doneOn.includes(s)?'var(--green)':i===6?'rgba(255,255,255,.15)':'rgba(255,255,255,.07)'}"></div>`;
    }).join('');
    return `<div class="card" style="display:flex;align-items:center;gap:12px;padding:14px 16px;margin-bottom:8px;
      background:${isDone?'rgba(76,175,80,.08)':'var(--bg-surface)'};
      border:1px solid ${isDone?'rgba(76,175,80,.35)':'var(--border)'};cursor:pointer" onclick="toggleHabit('${h.id}')">
      <div style="width:28px;height:28px;border-radius:50%;background:${isDone?'var(--green)':'rgba(255,255,255,.08)'};
        border:2px solid ${isDone?'var(--green)':'rgba(255,255,255,.2)'};
        display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0">${isDone?'✓':''}</div>
      <span style="font-size:20px">${h.emoji}</span>
      <div style="flex:1;min-width:0">
        <div style="font-size:14px;font-weight:${isDone?700:500};color:${isDone?'var(--text-1)':'var(--text-2)'}">${h.name}</div>
        ${streak>1?`<div style="font-size:11px;color:var(--orange)">🔥 Серия ${streak} дней</div>`:''}
      </div>
      <div style="display:flex;gap:3px">${last7}</div>
    </div>`;
  }).join('');
}

window.toggleHabit = function(id) {
  const habits=loadHabits(), today=todayStr(), h=habits.find(x=>x.id===id);
  if (!h) return;
  if (h.doneOn.includes(today)) h.doneOn=h.doneOn.filter(d=>d!==today);
  else h.doneOn=[...h.doneOn, today];
  saveHabits(habits); renderHabits();
};

window.addHabitDialog = function() {
  const name = prompt('Название новой привычки:');
  if (!name?.trim()) return;
  const emojis=['⭐','💧','🏋️','🌙','🧘','🚶','📚','🥗','🎯','💊','🤸','🔥'];
  const emoji = emojis[Math.floor(Math.random()*emojis.length)];
  const habits = loadHabits();
  const newId = String(Math.max(0,...habits.map(h=>+h.id||0))+1);
  habits.push({id:newId, name:name.trim(), emoji, doneOn:[]});
  saveHabits(habits); renderHabits();
};

// ── Stretching cool-down ─────────────────────────────────────────────────────
const STRETCH_DATA = [
  { name:'Квадрицепс стоя',    emoji:'🦵', muscle:'Квадрицепс',   sec:30, tip:'Держись за стену, тяни пятку к ягодице' },
  { name:'Растяжка бицепса бедра', emoji:'🧘', muscle:'Бицепс бедра', sec:40, tip:'Наклонись вперёд, спина прямая, колени не сгибай' },
  { name:'Икры у стены',       emoji:'🦶', muscle:'Икры',          sec:30, tip:'Носок в стену, пятка на полу, нога прямая' },
  { name:'Грудь у стены',      emoji:'💪', muscle:'Грудь',         sec:30, tip:'Рука на стене под 90°, разверни корпус от руки' },
  { name:'Шея боковая',        emoji:'🤸', muscle:'Шея',           sec:20, tip:'Наклони голову к плечу, не поднимай плечо' },
  { name:'Трицепс над головой',emoji:'💪', muscle:'Трицепс',       sec:30, tip:'Согни руку за головой, другой рукой тяни локоть вниз' },
  { name:'Поясница — кошка',   emoji:'🐈', muscle:'Поясница',      sec:40, tip:'Чередуй прогиб и округление спины в такт дыханию' },
  { name:'Ягодичная — цифра 4',emoji:'🪑', muscle:'Ягодицы',       sec:40, tip:'Лёжа, закинь голень на колено, тяни колено к себе' },
  { name:'Плечо поперёк',      emoji:'🙆', muscle:'Плечо',         sec:25, tip:'Прямая рука через грудь, другой рукой прижимай к телу' },
];
let _strIdx = 0, _strLeft = 0, _strRunning = false, _strTimer = null;

function stretchInit() {
  _strIdx = 0; _strRunning = false; clearInterval(_strTimer);
  _strLeft = STRETCH_DATA[0].sec;
  document.getElementById('stretch-done-block').style.display = 'none';
  document.getElementById('stretch-main-block').style.display = '';
  stretchRender();
}

function stretchRender() {
  const s = STRETCH_DATA[_strIdx];
  setEl('stretch-emoji', s.emoji);
  setEl('stretch-name', s.name);
  setEl('stretch-muscle', s.muscle);
  setEl('stretch-tip', s.tip);
  setEl('stretch-timer', _strLeft);
  const ring = document.getElementById('stretch-ring');
  if (ring) {
    const circ = 301.6;
    ring.style.strokeDashoffset = (circ * (1 - _strLeft / s.sec)).toFixed(1);
  }
  const playBtn = document.getElementById('stretch-play-btn');
  if (playBtn) playBtn.textContent = _strRunning ? '⏸ Пауза' : '▶ Старт';
  const prevBtn = document.getElementById('stretch-prev-btn');
  if (prevBtn) prevBtn.style.visibility = _strIdx > 0 ? 'visible' : 'hidden';

  // dots
  const dots = document.getElementById('stretch-dots');
  if (dots) {
    dots.innerHTML = STRETCH_DATA.map((_, i) => {
      const c = i < _strIdx ? 'var(--green)' : i === _strIdx ? 'var(--teal)' : 'rgba(255,255,255,.12)';
      return `<div style="width:22px;height:6px;border-radius:3px;background:${c};transition:background .3s"></div>`;
    }).join('');
  }

  // list
  const list = document.getElementById('stretch-list');
  if (list) {
    list.innerHTML = STRETCH_DATA.map((s2, i) => {
      const isCur = i === _strIdx, isDone = i < _strIdx;
      return `<div style="display:flex;align-items:center;gap:10px;padding:7px 6px;border-radius:10px;background:${isCur ? 'rgba(20,184,166,.1)' : 'transparent'}">
        <span style="font-size:18px">${isDone ? '✅' : s2.emoji}</span>
        <span style="flex:1;font-size:13px;font-weight:${isCur?700:400};color:${isCur?'var(--text-1)':'var(--text-2)'}">${s2.name}</span>
        <span style="font-size:12px;color:${isCur?'var(--teal)':'var(--text-3)'}">${s2.sec}с</span>
      </div>`;
    }).join('');
  }
}

window.stretchToggle = function() {
  _strRunning = !_strRunning;
  if (_strRunning) {
    _strTimer = setInterval(() => {
      if (_strLeft > 0) { _strLeft--; stretchRender(); }
      else { clearInterval(_strTimer); stretchNext(); }
    }, 1000);
  } else {
    clearInterval(_strTimer);
  }
  stretchRender();
};

window.stretchNext = function() {
  clearInterval(_strTimer); _strRunning = false;
  if (_strIdx < STRETCH_DATA.length - 1) {
    _strIdx++; _strLeft = STRETCH_DATA[_strIdx].sec; stretchRender();
  } else {
    document.getElementById('stretch-done-block').style.display = '';
    document.getElementById('stretch-main-block').style.display = 'none';
  }
};

window.stretchPrev = function() {
  clearInterval(_strTimer); _strRunning = false;
  if (_strIdx > 0) { _strIdx--; _strLeft = STRETCH_DATA[_strIdx].sec; stretchRender(); }
};

window.stretchRestart = function() { stretchInit(); };

// ── This Month Summary ────────────────────────────────────────────────────────
function renderThisMonth(ws) {
  const sec = document.getElementById('this-month-section');
  if (!sec) return;
  if (!ws.length) { sec.style.display = 'none'; return; }

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().slice(0, 10);
  const monthWs = ws.filter(w => w.date >= monthStart);
  if (!monthWs.length) { sec.style.display = 'none'; return; }

  sec.style.display = '';
  const totalWorkouts = monthWs.length;
  const totalSets     = monthWs.reduce((s, w) => s + (w.sets ? w.sets.length : 0), 0);

  // avg workouts per week this month
  const dayOfMonth = now.getDate();
  const weeksElapsed = Math.max(dayOfMonth / 7, 1);
  const avgPerWeek = (totalWorkouts / weeksElapsed).toFixed(1);

  const MONTHLY_GOAL = 16;
  const pct = Math.min(Math.round(totalWorkouts / MONTHLY_GOAL * 100), 100);

  const el = id => document.getElementById(id);
  if (el('month-workouts')) el('month-workouts').textContent = totalWorkouts;
  if (el('month-sets'))     el('month-sets').textContent     = totalSets;
  if (el('month-avg'))      el('month-avg').textContent      = avgPerWeek;
  if (el('month-pct'))      el('month-pct').textContent      = pct + '%';
  if (el('month-progress-bar')) el('month-progress-bar').style.width = pct + '%';
}

// ── Top Exercises by frequency ────────────────────────────────────────────────
function renderTopExercises(ws) {
  const sec  = document.getElementById('top-exercises-section');
  const list = document.getElementById('top-exercises-list');
  const tot  = document.getElementById('top-ex-total');
  if (!sec || !list || ws.length === 0) { if (sec) sec.style.display = 'none'; return; }

  const counts = {};
  const emojis = {};
  ws.forEach(w => {
    counts[w.name] = (counts[w.name] || 0) + 1;
    emojis[w.name] = w.emoji || '🏋️';
  });

  const top = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  if (top.length === 0) { sec.style.display = 'none'; return; }
  sec.style.display = '';
  if (tot) tot.textContent = `${Object.keys(counts).length} упражнений`;

  const maxCount = top[0][1];
  const colors = ['var(--accent)','#7C4DFF','#26C6DA','#4CAF50','#FF9800','#F06292','#78909C','#FF7043'];

  list.innerHTML = top.map(([name, count], i) => {
    const pct = (count / maxCount * 100).toFixed(0);
    return `
    <div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:4px">
        <span style="font-size:12px;font-weight:600;color:var(--text-1)">${emojis[name]} ${name}</span>
        <span style="font-size:11px;color:var(--text-3)">${count} раз</span>
      </div>
      <div style="height:7px;background:rgba(255,255,255,.06);border-radius:4px;overflow:hidden">
        <div style="height:100%;width:${pct}%;background:${colors[i % colors.length]};border-radius:4px;transition:width .6s ease"></div>
      </div>
    </div>`;
  }).join('');
}

// ── 30-day workout calendar ───────────────────────────────────────────────────
function renderCalendar30(ws) {
  const el  = document.getElementById('calendar-30');
  const lbl = document.getElementById('cal30-label');
  if (!el) return;

  const MS_DAY = 86400000;
  const today  = new Date(); today.setHours(0,0,0,0);
  const days   = [];

  for (let i = 29; i >= 0; i--) {
    const d   = new Date(today.getTime() - i * MS_DAY);
    const str = d.toISOString().slice(0, 10);
    const cnt = ws.filter(w => w.date === str).length;
    days.push({ str, cnt, d });
  }

  const trained = days.filter(d => d.cnt > 0).length;
  if (lbl) lbl.textContent = `${trained} тр. за 30 дн.`;

  const dow = ['Пн','Вт','Ср','Чт','Пт','Сб','Вс'];
  el.innerHTML = days.map(({ str, cnt, d }) => {
    const bg = cnt === 0 ? 'rgba(99,102,241,.1)'
             : cnt === 1 ? 'rgba(99,102,241,.45)'
             : cnt === 2 ? 'rgba(99,102,241,.72)'
             : 'var(--accent)';
    const isToday = str === todayStr();
    const outline = isToday ? ';outline:1.5px solid var(--teal);outline-offset:1px' : '';
    const dayName = dow[(d.getDay() + 6) % 7];
    return `<div title="${dayName} ${d.getDate()}.${d.getMonth()+1}: ${cnt} тр."
      style="width:calc((100% - 87px)/30);min-width:8px;height:28px;border-radius:3px;background:${bg}${outline};flex-shrink:0"></div>`;
  }).join('');
}

// ── Entry point ───────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', init);
