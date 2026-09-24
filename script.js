// Cute Girlfriend Site — interactive features
(function () {
  'use strict';

  const storage = {
    get(key, fallback) {
      try {
        const value = localStorage.getItem(key);
        return value === null ? fallback : value;
      } catch (_) { return fallback; }
    },
    set(key, value) {
      try { localStorage.setItem(key, value); } catch (_) {}
    }
  };

  // ========== Particles ==========
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const symbols = ['💕', '💗', '🌸', '✨', '💖', '🦋', '🌷', '💙', '🤍', '⭐'];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'particle';
      p.textContent = symbols[Math.floor(Math.random() * symbols.length)];
      p.style.left = Math.random() * 100 + '%';
      p.style.animationDuration = (11 + Math.random() * 14) + 's';
      p.style.animationDelay = (Math.random() * 10) + 's';
      p.style.fontSize = (12 + Math.random() * 14) + 'px';
      fragment.appendChild(p);
    }
    container.appendChild(fragment);
  }

  // ========== Navigation ==========
  function activateSection(sectionId) {
    const btn = document.querySelector(`[data-section="${sectionId}"]`);
    const section = document.getElementById(sectionId);
    if (!btn || !section) return;

    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.querySelectorAll('.section').forEach(s => s.classList.remove('active'));
    section.classList.add('active');

    const main = document.querySelector('.main');
    if (main) main.scrollTo({ top: 0, behavior: 'smooth' });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  window.goTo = activateSection;

  document.querySelectorAll('.nav-btn').forEach(btn => {
    btn.addEventListener('click', () => activateSection(btn.dataset.section));
  });

  // ========== Love Notes ==========
  window.openNote = function (card) {
    if (card) card.classList.toggle('flipped');
  };

  // ========== Cute Tasks ==========
  const tasks = [
    { emoji: '☕', text: 'Make yourself a warm drink and take 5 slow sips, Betu' },
    { emoji: '📝', text: 'Write down 3 things you like about yourself today' },
    { emoji: '🌿', text: 'Step outside (or open a window) and take 3 deep breaths' },
    { emoji: '🎵', text: 'Play a song that always makes you smile' },
    { emoji: '💧', text: 'Drink a full glass of water — you’re doing great, Srushti' },
    { emoji: '🪞', text: 'Look in the mirror and say one kind thing to yourself' },
    { emoji: '📖', text: 'Read a page of something that feels soft and nice' },
    { emoji: '💌', text: 'Send a tiny “thinking of you” message to someone you love' },
    { emoji: '🛁', text: 'Stretch your arms up high and roll your shoulders' },
    { emoji: '🌙', text: 'Write a short note to your future self, my Betu' }
  ];

  let completedTasks;
  try { completedTasks = JSON.parse(storage.get('srushtiTasks', '[]')); } catch (_) { completedTasks = []; }
  if (!Array.isArray(completedTasks)) completedTasks = [];

  function renderTasks() {
    const list = document.getElementById('tasksList');
    if (!list) return;
    list.innerHTML = '';
    tasks.forEach((task, i) => {
      const done = completedTasks.includes(i);
      const item = document.createElement('button');
      item.type = 'button';
      item.className = 'task-item' + (done ? ' done' : '');
      item.setAttribute('aria-pressed', String(done));
      item.innerHTML = `
        <span class="task-check" aria-hidden="true">${done ? '✓' : ''}</span>
        <span class="task-text"></span>
        <span class="task-emoji" aria-hidden="true">${task.emoji}</span>
      `;
      item.querySelector('.task-text').textContent = task.text;
      item.addEventListener('click', () => toggleTask(i));
      list.appendChild(item);
    });
  }

  function toggleTask(index) {
    if (completedTasks.includes(index)) {
      completedTasks = completedTasks.filter(i => i !== index);
    } else {
      completedTasks.push(index);
      showToast('Task done! You’re amazing, Betu 💕');
    }
    storage.set('srushtiTasks', JSON.stringify(completedTasks));
    renderTasks();
  }

  window.resetTasks = function () {
    completedTasks = [];
    storage.set('srushtiTasks', '[]');
    renderTasks();
    showToast('Tasks reset — fresh start! ✨');
  };

  // ========== Quiz ==========
  const quizData = [
    { q: 'What’s the best way to spend a rainy day together?', options: ['Movie marathon + blankets', 'Baking something sweet', 'Long talks + tea', 'All of the above 💕'] },
    { q: 'Which name feels the softest for you?', options: ['Srushti', 'Betu', 'Both equally 🥺', 'Whatever you call me'] },
    { q: 'Ideal spontaneous date?', options: ['Ice cream at midnight', 'Drive with good music', 'Picnic in a park', 'Surprise me ✨'] },
    { q: 'How do you prefer to be cheered up?', options: ['Hugs', 'Funny memes', 'Quiet company', 'All of it, please'] },
    { q: 'What makes a day feel perfect?', options: ['Your laugh', 'Being together', 'Little thoughtful moments', 'Everything when you’re here'] }
  ];

  let currentQuestion = 0;
  let quizAnswers = [];

  function renderQuiz() {
    const container = document.getElementById('quizContent');
    const bar = document.getElementById('quizBar');
    if (!container || !bar) return;

    if (currentQuestion >= quizData.length) {
      bar.style.width = '100%';
      container.innerHTML = `
        <div class="quiz-result">
          <h3>Quiz complete 💕</h3>
          <p>You answered all ${quizData.length} questions.</p>
          <p style="margin-top:14px">No matter what you picked, every answer with you is special, Betu.</p>
          <button class="cta-btn" style="margin-top:26px" onclick="restartQuiz()"><span>Play again</span></button>
        </div>`;
      return;
    }

    const q = quizData[currentQuestion];
    bar.style.width = ((currentQuestion / quizData.length) * 100) + '%';
    container.innerHTML = `
      <div class="quiz-question">${q.q}</div>
      <div class="quiz-options">
        ${q.options.map((opt, i) => `<button type="button" class="quiz-option" data-answer="${i}">${opt}</button>`).join('')}
      </div>`;

    container.querySelectorAll('.quiz-option').forEach(button => {
      button.addEventListener('click', () => answerQuiz(Number(button.dataset.answer)));
    });
  }

  function answerQuiz(answerIndex) {
    quizAnswers.push(answerIndex);
    currentQuestion++;
    renderQuiz();
  }

  window.restartQuiz = function () {
    currentQuestion = 0;
    quizAnswers = [];
    renderQuiz();
  };

  // ========== Gifts ==========
  window.openGift = function (box, emoji, label) {
    if (!box || box.classList.contains('opened')) return;
    box.classList.add('opened');
    const content = box.querySelector('.gift-content');
    if (content) content.textContent = emoji;

    let labelEl = box.querySelector('.gift-label');
    if (!labelEl) {
      labelEl = document.createElement('div');
      labelEl.className = 'gift-label';
      box.appendChild(labelEl);
    }
    labelEl.textContent = label;
    showToast('Gift unwrapped for Betu! 🎁');
  };

  // ========== Hugs ==========
  const hugMessages = [
    'You’re wrapped in a warm hug, Betu 🤗',
    'Sending all the soft energy your way, Srushti 💗',
    'You’re safe, you’re loved, you’re enough',
    'A big squeeze just for my Betu 🫂',
    'Holding you tight through the screen',
    'You deserve every good thing, Srushti ✨',
    'Rest here for a moment 💗',
    'I’m so glad you exist, my Betu ❤️'
  ];

  let hugCount = parseInt(storage.get('srushtiHugs', '0'), 10);
  if (!Number.isFinite(hugCount) || hugCount < 0) hugCount = 0;

  function updateHugCount() {
    const el = document.getElementById('hugCount');
    if (el) el.textContent = hugCount;
  }

  window.sendHug = function () {
    hugCount++;
    storage.set('srushtiHugs', String(hugCount));
    updateHugCount();

    const msg = document.getElementById('hugMessage');
    if (msg) msg.textContent = hugMessages[Math.floor(Math.random() * hugMessages.length)];

    const btn = document.getElementById('hugBtn');
    if (btn) {
      btn.classList.remove('pulse');
      void btn.offsetWidth;
      btn.classList.add('pulse');
    }
  };

  // ========== Toast ==========
  let toastTimer;
  function showToast(text) {
    const toast = document.getElementById('toast');
    if (!toast) return;
    toast.textContent = text;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2400);
  }
  window.showToast = showToast;

  // ========== Init ==========
  function init() {
    createParticles();
    renderTasks();
    renderQuiz();
    updateHugCount();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true });
  } else {
    init();
  }
})();
