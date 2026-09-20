/**
 * Study With Fun - Pre-Primary Learning Game Logic
 * Full Level Flow, Interactive Challenges, Progression Gating & Star Ratings
 */

// Confetti Particle Engine
class ConfettiCannon {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas ? canvas.getContext('2d') : null;
    this.particles = [];
    this.animId = null;
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    if (!this.canvas) return;
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  burst(count = 60) {
    if (!this.canvas || !this.ctx) return;
    this.resize();
    const colors = ['#FF4D6D', '#FFB703', '#06D6A0', '#118AB2', '#9B5DE5', '#F15BB5', '#00F5D4'];
    for (let i = 0; i < count; i++) {
      this.particles.push({
        x: this.canvas.width / 2 + (Math.random() - 0.5) * 200,
        y: this.canvas.height / 2 + (Math.random() - 0.5) * 100,
        vx: (Math.random() - 0.5) * 14,
        vy: (Math.random() - 0.8) * 16,
        size: Math.random() * 9 + 6,
        color: colors[Math.floor(Math.random() * colors.length)],
        rotation: Math.random() * 360,
        rotationSpeed: (Math.random() - 0.5) * 10,
        alpha: 1,
        shape: Math.random() > 0.4 ? 'rect' : 'circle'
      });
    }

    if (!this.animId) {
      this.animate();
    }
  }

  animate() {
    if (!this.ctx) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98;
      p.rotation += p.rotationSpeed;
      p.alpha -= 0.012;

      if (p.alpha <= 0 || p.y > this.canvas.height + 20) {
        this.particles.splice(i, 1);
        continue;
      }

      this.ctx.save();
      this.ctx.globalAlpha = p.alpha;
      this.ctx.translate(p.x, p.y);
      this.ctx.rotate((p.rotation * Math.PI) / 180);
      this.ctx.fillStyle = p.color;

      if (p.shape === 'circle') {
        this.ctx.beginPath();
        this.ctx.arc(0, 0, p.size / 2, 0, Math.PI * 2);
        this.ctx.fill();
      } else {
        this.ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.7);
      }
      this.ctx.restore();
    }

    if (this.particles.length > 0) {
      this.animId = requestAnimationFrame(() => this.animate());
    } else {
      this.animId = null;
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Letter Color Palette for Match Game (Distinct, beautiful colors corresponding to objects / phonics)
const LETTER_COLOR_PALETTE = {
  'A': { name: 'Apple Red', color: '#EF4444', bg: '#FEE2E2', border: '#DC2626' },
  'B': { name: 'Blue', color: '#2563EB', bg: '#DBEAFE', border: '#1D4ED8' },
  'C': { name: 'Carrot Coral', color: '#F97316', bg: '#FFEDD5', border: '#EA580C' },
  'D': { name: 'Duck Green', color: '#059669', bg: '#D1FAE5', border: '#047857' },
  'E': { name: 'Eggplant Purple', color: '#7C3AED', bg: '#EDE9FE', border: '#6D28D9' },
  'F': { name: 'Flamingo Pink', color: '#EC4899', bg: '#FCE7F3', border: '#DB2777' },
  'G': { name: 'Green', color: '#16A34A', bg: '#DCFCE7', border: '#15803D' },
  'H': { name: 'Honey Gold', color: '#D97706', bg: '#FEF3C7', border: '#B45309' },
  'I': { name: 'Ice Blue', color: '#0284C7', bg: '#E0F2FE', border: '#0369A1' },
  'J': { name: 'Jade Teal', color: '#0D9488', bg: '#CCFBF1', border: '#0F766E' },
  'K': { name: 'Kiwi Green', color: '#65A30D', bg: '#ECFCCB', border: '#4D7C0F' },
  'L': { name: 'Lavender', color: '#8B5CF6', bg: '#EDE9FE', border: '#7C3AED' },
  'M': { name: 'Magenta', color: '#C026D3', bg: '#FAE8FF', border: '#A21CAF' },
  'N': { name: 'Navy', color: '#1E40AF', bg: '#DBEAFE', border: '#1E3A8A' },
  'O': { name: 'Orange', color: '#EA580C', bg: '#FFEDD5', border: '#C2410C' },
  'P': { name: 'Purple', color: '#9333EA', bg: '#F3E8FF', border: '#7E22CE' },
  'Q': { name: 'Rose', color: '#E11D48', bg: '#FFE4E6', border: '#BE123C' },
  'R': { name: 'Red', color: '#DC2626', bg: '#FEE2E2', border: '#B91C1C' },
  'S': { name: 'Sun Yellow', color: '#CA8A04', bg: '#FEF9C3', border: '#A16207' },
  'T': { name: 'Turquoise', color: '#0891B2', bg: '#CFFAFE', border: '#0E7490' },
  'U': { name: 'Blue', color: '#2563EB', bg: '#DBEAFE', border: '#1D4ED8' },
  'V': { name: 'Violet', color: '#7C3AED', bg: '#EDE9FE', border: '#6D28D9' },
  'W': { name: 'Watermelon Pink', color: '#F43F5E', bg: '#FFE4E6', border: '#E11D48' },
  'X': { name: 'Amber', color: '#D97706', bg: '#FEF3C7', border: '#B45309' },
  'Y': { name: 'Yellow', color: '#EAB308', bg: '#FEF08A', border: '#CA8A04' },
  'Z': { name: 'Zebra Dark', color: '#334155', bg: '#E2E8F0', border: '#1E293B' }
};

// 10 Comprehensive Pre-Primary Levels
const GAME_LEVELS = [
  {
    id: 1,
    title: 'Next Alphabet (A-M)',
    subtitle: 'Find what comes next in the ABC train!',
    badge: '🔤 Level 1',
    icon: '🅰️',
    type: 'next_alpha',
    color: '#FF6B6B',
    bgGrad: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    rounds: [
      { seq: ['A', 'B', 'C'], answer: 'D', options: ['D', 'E', 'B', 'C'], phonic: 'D is for Dog 🐶' },
      { seq: ['D', 'E', 'F'], answer: 'G', options: ['H', 'G', 'F', 'C'], phonic: 'G is for Grapes 🍇' },
      { seq: ['G', 'H', 'I'], answer: 'J', options: ['K', 'L', 'J', 'M'], phonic: 'J is for Juice 🧃' },
      { seq: ['J', 'K', 'L'], answer: 'M', options: ['N', 'O', 'M', 'K'], phonic: 'M is for Monkey 🐵' },
      { seq: ['B', 'C', 'D'], answer: 'E', options: ['E', 'F', 'A', 'G'], phonic: 'E is for Elephant 🐘' }
    ]
  },
  {
    id: 2,
    title: 'Counting Numbers (1-5)',
    subtitle: 'Count the cute items and tap the right number!',
    badge: '🔢 Level 2',
    icon: '🍎',
    type: 'count_items',
    color: '#4ECDC4',
    bgGrad: 'linear-gradient(135deg, #4ECDC4 0%, #2980B9 100%)',
    rounds: [
      { item: '🍎', name: 'Apples', count: 3, options: [2, 3, 4, 1] },
      { item: '⭐', name: 'Stars', count: 5, options: [3, 4, 5, 2] },
      { item: '🐶', name: 'Puppies', count: 2, options: [1, 2, 3, 4] },
      { item: '🎈', name: 'Balloons', count: 4, options: [5, 4, 3, 2] },
      { item: '🍓', name: 'Strawberries', count: 1, options: [1, 2, 3, 4] }
    ]
  },
  {
    id: 3,
    title: 'Match Big & Small (A-H)',
    subtitle: 'Connect Capital and Small letters together!',
    badge: '🧩 Level 3',
    icon: 'Aa',
    type: 'match_letters',
    color: '#FFBE0B',
    bgGrad: 'linear-gradient(135deg, #FFBE0B 0%, #FB5607 100%)',
    rounds: [
      {
        pairs: [
          { upper: 'B', lower: 'b', word: 'Blue Ball ⚽' },
          { upper: 'R', lower: 'r', word: 'Red Rose 🌹' },
          { upper: 'Y', lower: 'y', word: 'Yellow Yoyo 🪀' }
        ]
      },
      {
        pairs: [
          { upper: 'A', lower: 'a', word: 'Apple 🍎' },
          { upper: 'D', lower: 'd', word: 'Duck 🦆' },
          { upper: 'C', lower: 'c', word: 'Cat 🐱' }
        ]
      },
      {
        pairs: [
          { upper: 'E', lower: 'e', word: 'Egg 🥚' },
          { upper: 'F', lower: 'f', word: 'Fish 🐟' },
          { upper: 'H', lower: 'h', word: 'House 🏠' }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Next Alphabet (N-Z)',
    subtitle: 'Keep the alphabet train chugging along!',
    badge: '🔤 Level 4',
    icon: '🚂',
    type: 'next_alpha',
    color: '#9B5DE5',
    bgGrad: 'linear-gradient(135deg, #9B5DE5 0%, #F15BB5 100%)',
    rounds: [
      { seq: ['N', 'O', 'P'], answer: 'Q', options: ['Q', 'R', 'P', 'S'], phonic: 'Q is for Queen 👑' },
      { seq: ['P', 'Q', 'R'], answer: 'S', options: ['T', 'S', 'U', 'R'], phonic: 'S is for Sun ☀️' },
      { seq: ['S', 'T', 'U'], answer: 'V', options: ['W', 'V', 'X', 'T'], phonic: 'V is for Van 🚐' },
      { seq: ['W', 'X', 'Y'], answer: 'Z', options: ['Z', 'A', 'X', 'W'], phonic: 'Z is for Zebra 🦓' },
      { seq: ['m', 'n', 'o'], answer: 'p', options: ['p', 'q', 'r', 'o'], phonic: 'P is for Penguin 🐧' }
    ]
  },
  {
    id: 5,
    title: 'Counting Adventure (6-10)',
    subtitle: 'Count more delightful toys and animal buddies!',
    badge: '🔢 Level 5',
    icon: '🦁',
    type: 'count_items',
    color: '#06D6A0',
    bgGrad: 'linear-gradient(135deg, #06D6A0 0%, #1B9AAA 100%)',
    rounds: [
      { item: '🚗', name: 'Cars', count: 6, options: [5, 6, 7, 8] },
      { item: '🦁', name: 'Lions', count: 7, options: [6, 7, 8, 9] },
      { item: '🚀', name: 'Rockets', count: 8, options: [7, 8, 9, 10] },
      { item: '🍦', name: 'Ice Creams', count: 9, options: [8, 9, 7, 10] },
      { item: '🦋', name: 'Butterflies', count: 10, options: [8, 9, 10, 7] }
    ]
  },
  {
    id: 6,
    title: 'Match Big & Small (I-P)',
    subtitle: 'Pair up 4-5 Capital and Small letter buddies!',
    badge: '🧩 Level 6',
    icon: 'Ii',
    type: 'match_letters',
    color: '#3A86FF',
    bgGrad: 'linear-gradient(135deg, #3A86FF 0%, #00F5D4 100%)',
    rounds: [
      {
        pairs: [
          { upper: 'I', lower: 'i', word: 'Ice Cream 🍦' },
          { upper: 'J', lower: 'j', word: 'Juice 🧃' },
          { upper: 'K', lower: 'k', word: 'Kite 🪁' },
          { upper: 'L', lower: 'l', word: 'Lion 🦁' }
        ]
      },
      {
        pairs: [
          { upper: 'M', lower: 'm', word: 'Moon 🌙' },
          { upper: 'N', lower: 'n', word: 'Nest 🪺' },
          { upper: 'O', lower: 'o', word: 'Orange 🍊' },
          { upper: 'P', lower: 'p', word: 'Panda 🐼' }
        ]
      },
      {
        pairs: [
          { upper: 'I', lower: 'i', word: 'Igloo 🧊' },
          { upper: 'K', lower: 'k', word: 'Koala 🐨' },
          { upper: 'L', lower: 'l', word: 'Lemon 🍋' },
          { upper: 'M', lower: 'm', word: 'Monkey 🐵' },
          { upper: 'P', lower: 'p', word: 'Parrot 🦜' }
        ]
      }
    ]
  },
  {
    id: 7,
    title: 'What Number Next? (1-10)',
    subtitle: 'Hop along the colorful number stepping stones!',
    badge: '🔢 Level 7',
    icon: '1️⃣',
    type: 'next_num',
    color: '#F77F00',
    bgGrad: 'linear-gradient(135deg, #F77F00 0%, #FCBF49 100%)',
    rounds: [
      { seq: [1, 2, 3], answer: 4, options: [4, 5, 2, 3] },
      { seq: [4, 5, 6], answer: 7, options: [6, 7, 8, 9] },
      { seq: [7, 8, 9], answer: 10, options: [9, 10, 8, 6] },
      { seq: [2, 3, 4], answer: 5, options: [5, 6, 3, 7] },
      { seq: [5, 6, 7], answer: 8, options: [7, 8, 9, 10] }
    ]
  },
  {
    id: 8,
    title: 'Missing Phonics Letter',
    subtitle: 'Spell the animal or object by filling the missing letter!',
    badge: '📖 Level 8',
    icon: '🐱',
    type: 'missing_letter',
    color: '#E63946',
    bgGrad: 'linear-gradient(135deg, #E63946 0%, #F4A261 100%)',
    rounds: [
      { word: 'C _ T', answer: 'A', full: 'CAT', icon: '🐱', hint: 'Meow! It is a cat!', options: ['A', 'O', 'U', 'E'] },
      { word: 'S _ N', answer: 'U', full: 'SUN', icon: '☀️', hint: 'Shining bright in the sky!', options: ['U', 'A', 'I', 'O'] },
      { word: 'D _ G', answer: 'O', full: 'DOG', icon: '🐶', hint: 'Woof woof! Loyal puppy!', options: ['O', 'A', 'U', 'I'] },
      { word: 'P _ N', answer: 'E', full: 'PEN', icon: '🖊️', hint: 'We write and draw with it!', options: ['E', 'A', 'U', 'O'] },
      { word: 'B _ X', answer: 'O', full: 'BOX', icon: '📦', hint: 'A gift comes inside it!', options: ['O', 'E', 'A', 'U'] }
    ]
  },
  {
    id: 9,
    title: 'Match Big & Small (Q-Z)',
    subtitle: 'Complete your alphabet master matching challenge with 4-5 pairs!',
    badge: '🧩 Level 9',
    icon: 'Qq',
    type: 'match_letters',
    color: '#7209B7',
    bgGrad: 'linear-gradient(135deg, #7209B7 0%, #4361EE 100%)',
    rounds: [
      {
        pairs: [
          { upper: 'Q', lower: 'q', word: 'Queen 👑' },
          { upper: 'R', lower: 'r', word: 'Red Rose 🌹' },
          { upper: 'S', lower: 's', word: 'Yellow Sun ☀️' },
          { upper: 'T', lower: 't', word: 'Tiger 🐯' }
        ]
      },
      {
        pairs: [
          { upper: 'U', lower: 'u', word: 'Blue Umbrella ☂️' },
          { upper: 'V', lower: 'v', word: 'Violin 🎻' },
          { upper: 'W', lower: 'w', word: 'Watermelon 🍉' },
          { upper: 'Y', lower: 'y', word: 'Yellow Yoyo 🪀' }
        ]
      },
      {
        pairs: [
          { upper: 'Q', lower: 'q', word: 'Quilt 🧵' },
          { upper: 'S', lower: 's', word: 'Golden Star ⭐' },
          { upper: 'U', lower: 'u', word: 'Blue Unicorn 🦄' },
          { upper: 'W', lower: 'w', word: 'Watch ⌚' },
          { upper: 'Z', lower: 'z', word: 'Zebra 🦓' }
        ]
      }
    ]
  },
  {
    id: 10,
    title: 'Pre-Primary Super Champion',
    subtitle: 'The Grand Finale! Show all your alphabet & number powers!',
    badge: '🏆 Level 10 (Boss)',
    icon: '🎓',
    type: 'mixed_champion',
    color: '#D4AF37',
    bgGrad: 'linear-gradient(135deg, #D4AF37 0%, #FF8008 100%)',
    rounds: [
      {
        subType: 'next_alpha',
        seq: ['K', 'L', 'M'],
        answer: 'N',
        options: ['N', 'O', 'M', 'P'],
        hint: 'What comes after M?'
      },
      {
        subType: 'count_items',
        item: '🌟',
        name: 'Golden Stars',
        count: 7,
        options: [5, 6, 7, 8]
      },
      {
        subType: 'missing_letter',
        word: 'F _ S H',
        answer: 'I',
        full: 'FISH',
        icon: '🐟',
        hint: 'Swims in the water!',
        options: ['I', 'A', 'O', 'U']
      },
      {
        subType: 'next_num',
        seq: [6, 7, 8],
        answer: 9,
        options: [8, 9, 10, 7],
        hint: 'What comes after 8?'
      },
      {
        subType: 'next_alpha',
        seq: ['W', 'X', 'Y'],
        answer: 'Z',
        options: ['Z', 'A', 'B', 'Y'],
        hint: 'The very last letter!'
      }
    ]
  }
];

// Main Game Controller
class StudyGame {
  constructor() {
    this.currentLevelIndex = 0;
    this.currentRoundIndex = 0;
    this.score = 0;
    this.levelScore = 0;
    this.roundCorrectCount = 0;
    this.totalQuestionsInLevel = 0;
    this.currentLevel = null;
    this.selectedMatchUpper = null;
    this.selectedMatchLower = null;
    this.resolvedPairsCount = 0;
    this.correctPairsCountInRound = 0;
    this.isRoundLocked = false;
    this.isMatchingLocked = false;
    this.confetti = null;

    // Load progress from localStorage
    this.progress = this.loadProgress();

    this.initDOM();
    this.bindEvents();
    this.renderRoadmap();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('kidgames_studywithfun_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.unlockedLevels)) {
          if (!parsed.levelBestScores || typeof parsed.levelBestScores !== 'object') parsed.levelBestScores = {};
          if (typeof parsed.totalScore !== 'number' || isNaN(parsed.totalScore)) parsed.totalScore = 0;
          if (!parsed.levelStars || typeof parsed.levelStars !== 'object') parsed.levelStars = { 1: 0 };
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read progress from localStorage:', e);
    }
    return {
      unlockedLevels: [1],
      levelStars: { 1: 0 },
      levelBestScores: { 1: 0 },
      totalScore: 0
    };
  }

  saveProgress() {
    try {
      localStorage.setItem('kidgames_studywithfun_progress', JSON.stringify(this.progress));
    } catch (e) {
      console.warn('Could not save progress to localStorage:', e);
    }
    this.updateNavbarStars();
  }

  resetProgress() {
    if (confirm('Are you sure you want to reset all game progress and stars?')) {
      this.progress = {
        unlockedLevels: [1],
        levelStars: { 1: 0 },
        levelBestScores: { 1: 0 },
        totalScore: 0
      };
      this.saveProgress();
      this.renderRoadmap();
      window.Sound.playPop();
    }
  }

  initDOM() {
    // Canvas for confetti
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      this.confetti = new ConfettiCannon(canvas);
    }

    // Screens
    this.screenRoadmap = document.getElementById('screen-roadmap');
    this.screenPlay = document.getElementById('screen-play');

    // Headers & Labels
    this.lblLevelTitle = document.getElementById('lbl-level-title');
    this.lblRoundCounter = document.getElementById('lbl-round-counter');
    this.lblScore = document.getElementById('lbl-score');
    this.progressBar = document.getElementById('progress-bar-fill');
    this.navStarsCount = document.getElementById('nav-stars-count');

    // Modals
    this.modalLevelComplete = document.getElementById('modal-level-complete');
    this.modalGraduation = document.getElementById('modal-graduation');

    this.updateNavbarStars();
  }

  updateNavbarStars() {
    let total = 0;
    Object.values(this.progress.levelStars).forEach(s => total += (s || 0));
    if (this.navStarsCount) {
      this.navStarsCount.textContent = `${total} / 30`;
    }
  }

  bindEvents() {
    // BGM toggle
    const btnMusic = document.getElementById('btn-toggle-music');
    if (btnMusic) {
      btnMusic.addEventListener('click', () => {
        const isPlaying = window.Sound.toggleMusic();
        btnMusic.innerHTML = isPlaying ? '<i class="fa-solid fa-music"></i> <span>Music ON</span>' : '<i class="fa-solid fa-volume-xmark"></i> <span>Music OFF</span>';
        btnMusic.classList.toggle('active', isPlaying);
      });
    }

    // SFX toggle
    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isEnabled = window.Sound.toggleSound();
        btnSound.innerHTML = isEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
        btnSound.classList.toggle('active', isEnabled);
      });
    }

    // Voice toggle
    const btnVoice = document.getElementById('btn-toggle-voice');
    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        const isEnabled = window.Sound.toggleVoice();
        btnVoice.innerHTML = isEnabled ? '<i class="fa-solid fa-comment-dots"></i> <span>Voice ON</span>' : '<i class="fa-solid fa-comment-slash"></i> <span>Voice OFF</span>';
        btnVoice.classList.toggle('active', isEnabled);
        if (isEnabled) {
          window.Voice.speak('Voice is on! Let us learn!');
        }
      });
    }

    // Reset button
    const btnReset = document.getElementById('btn-reset-progress');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetProgress());
    }

    // Back to roadmap from play screen
    const btnBackMap = document.getElementById('btn-back-to-map');
    if (btnBackMap) {
      btnBackMap.addEventListener('click', () => {
        window.Sound.playPop();
        window.Voice.stop();
        this.showRoadmap();
      });
    }

    // Modal Actions
    const btnNextLevel = document.getElementById('btn-modal-next-level');
    if (btnNextLevel) {
      btnNextLevel.addEventListener('click', () => {
        window.Sound.playPop();
        this.closeModals();
        if (this.currentLevelIndex + 1 < GAME_LEVELS.length) {
          this.startLevel(this.currentLevelIndex + 1);
        } else {
          this.showRoadmap();
        }
      });
    }

    const btnReplayLevel = document.getElementById('btn-modal-replay');
    if (btnReplayLevel) {
      btnReplayLevel.addEventListener('click', () => {
        window.Sound.playPop();
        this.closeModals();
        this.startLevel(this.currentLevelIndex);
      });
    }

    const btnMapFromModal = document.getElementById('btn-modal-map');
    if (btnMapFromModal) {
      btnMapFromModal.addEventListener('click', () => {
        window.Sound.playPop();
        this.closeModals();
        this.showRoadmap();
      });
    }

    const btnGraduationMap = document.getElementById('btn-grad-map');
    if (btnGraduationMap) {
      btnGraduationMap.addEventListener('click', () => {
        window.Sound.playPop();
        this.closeModals();
        this.showRoadmap();
      });
    }

    // Global keyboard typing listener (kids can press letter/number keys)
    window.addEventListener('keydown', (e) => this.handlePhysicalKeyboard(e));
  }

  showRoadmap() {
    this.screenPlay.classList.add('hidden');
    this.screenRoadmap.classList.remove('hidden');
    this.renderRoadmap();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderRoadmap() {
    const roadmapContainer = document.getElementById('roadmap-cards');
    if (!roadmapContainer) return;
    roadmapContainer.innerHTML = '';

    GAME_LEVELS.forEach((level, idx) => {
      const isUnlocked = this.progress.unlockedLevels.includes(level.id);
      const starsEarned = this.progress.levelStars[level.id] || 0;
      const bestScore = (this.progress.levelBestScores && this.progress.levelBestScores[level.id]) || 0;

      const card = document.createElement('div');
      card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'}`;
      card.setAttribute('data-level-id', level.id);

      // Star display
      let starsHTML = '';
      for (let s = 1; s <= 3; s++) {
        if (s <= starsEarned) {
          starsHTML += '<span class="star-icon filled">⭐</span>';
        } else {
          starsHTML += '<span class="star-icon empty">☆</span>';
        }
      }

      card.innerHTML = `
        <div class="level-card-header" style="background: ${level.bgGrad}">
          <span class="level-badge">${level.badge}</span>
          <span class="level-icon">${level.icon}</span>
        </div>
        <div class="level-card-body">
          <h3 class="level-name">${level.title}</h3>
          <p class="level-desc">${level.subtitle}</p>
          <div class="level-stars">${starsHTML}</div>
          ${starsEarned > 0 ? `<div class="level-best-score">🏆 Best: <strong>${bestScore}</strong> pts</div>` : ''}
          <button class="btn-play-level ${isUnlocked ? 'btn-unlocked' : 'btn-locked'}" ${isUnlocked ? '' : 'disabled'}>
            ${isUnlocked ? (starsEarned > 0 ? '▶ Play Again' : '▶ Start Level') : '🔒 Locked'}
          </button>
        </div>
      `;

      if (isUnlocked) {
        card.addEventListener('click', () => {
          window.Sound.playPop();
          this.startLevel(idx);
        });
      }

      roadmapContainer.appendChild(card);
    });
  }

  startLevel(index) {
    this.currentLevelIndex = index;
    this.currentLevel = GAME_LEVELS[index];
    this.currentRoundIndex = 0;
    this.roundCorrectCount = 0;
    this.levelScore = 0;
    this.score = 0;
    this.isRoundLocked = false;
    this.isMatchingLocked = false;
    this.totalQuestionsInLevel = this.currentLevel.rounds.length;

    this.screenRoadmap.classList.add('hidden');
    this.screenPlay.classList.remove('hidden');

    if (this.lblLevelTitle) {
      this.lblLevelTitle.textContent = `${this.currentLevel.badge}: ${this.currentLevel.title}`;
    }
    if (this.lblScore) {
      this.lblScore.textContent = '0';
    }

    this.renderRound();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  renderRound() {
    this.isRoundLocked = false;
    this.isMatchingLocked = false;

    const round = this.currentLevel.rounds[this.currentRoundIndex];
    if (!round) {
      this.finishLevel();
      return;
    }

    // Update Progress Indicators
    const currentNum = this.currentRoundIndex + 1;
    if (this.lblRoundCounter) {
      this.lblRoundCounter.textContent = `Round ${currentNum} / ${this.totalQuestionsInLevel}`;
    }
    if (this.progressBar) {
      const pct = (currentNum / this.totalQuestionsInLevel) * 100;
      this.progressBar.style.width = `${pct}%`;
    }
    if (this.lblScore) {
      this.lblScore.textContent = `${this.levelScore || 0}`;
    }

    const questionContainer = document.getElementById('play-question-area');
    questionContainer.innerHTML = '';

    // Handle round based on level type or subType
    const type = round.subType || this.currentLevel.type;

    if (type === 'next_alpha') {
      this.renderNextAlphaRound(round, questionContainer);
    } else if (type === 'count_items') {
      this.renderCountRound(round, questionContainer);
    } else if (type === 'match_letters') {
      this.renderMatchRound(round, questionContainer);
    } else if (type === 'next_num') {
      this.renderNextNumRound(round, questionContainer);
    } else if (type === 'missing_letter') {
      this.renderMissingLetterRound(round, questionContainer);
    }
  }

  /**
   * Type 1: Next Alphabet (Sequence: A -> B -> C -> ?)
   * - Does not accept keyboard directly, only allows selecting options
   * - Does not disclose letter or word until correct selection
   * - Discloses letter & phonic phrase ("Q is for Queen", etc.) after correct answer
   */
  renderNextAlphaRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper next-alpha-activity';

    const speechText = 'What letter comes next? Choose the right letter below!';
    window.Voice.speak(speechText);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🚂</span>
        <span class="instruction-text">What letter comes next in the train?</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <!-- Train sequence with hidden target -->
      <div class="sequence-track">
        ${round.seq.map(letter => `
          <div class="seq-node past-node">
            <span class="node-letter">${letter}</span>
          </div>
          <span class="seq-arrow">➔</span>
        `).join('')}
        <div class="seq-node target-node" id="target-slot">
          <span class="node-letter">❓</span>
        </div>
      </div>

      <!-- Phonic announcement slot (disclosed ONLY after player selects correct letter!) -->
      <div id="revealed-phonic-box" class="revealed-container"></div>

      <!-- Options Grid (Only way to answer: select on screen!) -->
      <div class="options-grid" id="options-grid">
        ${round.options.map(opt => `
          <button class="choice-btn" data-val="${opt}">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    // Sound Hint
    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    // Option Clicks
    const optionBtns = wrapper.querySelectorAll('.choice-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.checkAnswer(
          btn.getAttribute('data-val'),
          round.answer,
          btn,
          wrapper.querySelector('#target-slot'),
          (advanceCallback) => {
            // Disclose letter and word phonic in center space ONLY after correct choice!
            const phonicBox = wrapper.querySelector('#revealed-phonic-box');
            if (phonicBox && round.phonic) {
              phonicBox.innerHTML = `
                <div class="revealed-phonic-banner">
                  <span>🎉</span>
                  <span>${round.phonic}!</span>
                </div>
              `;
            }
            // Speak phonic phrase without emoji names, and wait until voice finishes to advance!
            window.Voice.speak(`${round.phonic}!`, true, advanceCallback);
          }
        );
      });
    });
  }

  /**
   * Type 2: Counting Numbers (Count cute items 1-5 or 6-10)
   * - Does NOT show numbers on objects initially
   * - On tap ONLY shows the number badge on that object
   * - Allows entering number from keyboard too!
   */
  renderCountRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper count-activity';

    const speechText = `Count the ${round.name}! How many are there?`;
    window.Voice.speak(speechText);

    // Generate counting items WITHOUT numbers initially!
    let itemsHTML = '';
    for (let i = 1; i <= round.count; i++) {
      itemsHTML += `
        <div class="count-item-bubble" data-index="${i}" title="Tap me to count!">
          <span class="item-emoji">${round.item}</span>
        </div>
      `;
    }

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🖐️</span>
        <span class="instruction-text">Count the <strong>${round.name}</strong>! Tap each one to count!</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <!-- Items Stage with clear spacing -->
      <div class="count-stage" id="count-stage">
        ${itemsHTML}
      </div>
      <div class="count-tip">💡 Tap on items to count, or press number key on keyboard!</div>

      <!-- Options Grid -->
      <div class="options-grid" id="options-grid">
        ${round.options.map(opt => `
          <button class="choice-btn num-btn" data-val="${opt}">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    // Item tapping audio feedback and ON-TAP ONLY number badge
    let currentTapCount = 0;
    const itemBubbles = wrapper.querySelectorAll('.count-item-bubble');
    itemBubbles.forEach(item => {
      item.addEventListener('click', () => {
        if (!item.classList.contains('tapped')) {
          currentTapCount++;
          item.classList.add('tapped');
          item.innerHTML += `<span class="item-count-badge">${currentTapCount}</span>`;
          window.Sound.playCount(currentTapCount);
          window.Voice.speak(`${currentTapCount}`, true);
        } else {
          const badge = item.querySelector('.item-count-badge');
          if (badge) {
            window.Voice.speak(badge.textContent, true);
          }
        }
      });
    });

    // Option Clicks
    const optionBtns = wrapper.querySelectorAll('.choice-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.checkAnswer(btn.getAttribute('data-val'), round.count.toString(), btn);
      });
    });
  }

  /**
   * Helper: Generate crossed order for Small letters
   * Guaranteed that no letter is directly horizontally opposite to its capital letter,
   * producing diagonal crossed arrows for every single pair!
   */
  getCrossedOrder(pairs) {
    const n = pairs.length;
    let indices;
    if (n === 3) {
      indices = [1, 2, 0];
    } else if (n === 4) {
      indices = [2, 3, 0, 1];
    } else if (n === 5) {
      indices = [2, 3, 4, 0, 1];
    } else {
      indices = pairs.map((_, i) => (i + Math.floor(n / 2)) % n);
    }
    return indices.map(idx => pairs[idx]);
  }

  /**
   * Type 3: Match Capital and Small Letters (A <-> a, B <-> b)
   * - Predictable order for Capital letters, crossed order for Small letters
   * - Every connection draws a distinct cross arrow
   * - Supports 3, 4, and 5 letters per set with distinct colors
   * - Waits for voice praise to complete before opening next set/level
   */
  renderMatchRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper match-activity';

    const speechText = 'Join the Big Capital Letter to its Small Letter!';
    window.Voice.speak(speechText);

    this.resolvedPairsCount = 0;
    this.correctPairsCountInRound = 0;
    this.selectedMatchUpper = null;
    this.selectedMatchLower = null;
    this.isMatchingLocked = false;

    // Arrange small letters in deterministic crossed order so all arrows cross diagonally
    const crossedPairs = this.getCrossedOrder(round.pairs);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🤝</span>
        <span class="instruction-text">Join the <strong>Big Letter</strong> to its <strong>Small Letter</strong>!</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="match-arena" id="match-arena">
        <!-- SVG overlay for dynamic connecting arrows -->
        <svg class="match-svg-canvas" id="match-svg-canvas"></svg>

        <!-- Left Column: Capital Letters with right pointers in order -->
        <div class="match-col upper-col">
          <div class="col-heading">Big Letters 🅰️</div>
          ${round.pairs.map(p => `
            <button class="match-card upper-card" data-letter="${p.upper}">
              <div class="card-text-group">
                <span class="card-main-letter">${p.upper}</span>
                <span class="card-hint">${p.word}</span>
              </div>
              <div class="pointer-node pointer-right" title="Connecting pointer">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </button>
          `).join('')}
        </div>

        <div class="match-divider">
          <i class="fa-solid fa-arrows-left-right"></i>
        </div>

        <!-- Right Column: Small Letters in crossed order for diagonal arrows -->
        <div class="match-col lower-col">
          <div class="col-heading">Small Letters 🔡</div>
          ${crossedPairs.map(p => `
            <button class="match-card lower-card" data-letter="${p.lower}" data-match="${p.upper}">
              <div class="pointer-node pointer-left" title="Connecting pointer">
                <i class="fa-solid fa-arrow-left"></i>
              </div>
              <div class="card-text-group">
                <span class="card-main-letter">${p.lower}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const upperCards = wrapper.querySelectorAll('.upper-card');
    const lowerCards = wrapper.querySelectorAll('.lower-card');

    upperCards.forEach(card => {
      card.addEventListener('click', () => {
        if (this.isMatchingLocked) return;
        if (card.classList.contains('paired') || card.classList.contains('paired-failed')) return;
        upperCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedMatchUpper = card;
        window.Sound.playPop();
        window.Voice.speak(`Capital ${card.getAttribute('data-letter')}`, true);
        this.checkMatchPair(round, wrapper);
      });
    });

    lowerCards.forEach(card => {
      card.addEventListener('click', () => {
        if (this.isMatchingLocked) return;
        if (card.classList.contains('paired') || card.classList.contains('paired-failed')) return;
        lowerCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedMatchLower = card;
        window.Sound.playPop();
        window.Voice.speak(`Small ${card.getAttribute('data-letter')}`, true);
        this.checkMatchPair(round, wrapper);
      });
    });
  }

  checkMatchPair(round, wrapper) {
    if (this.isMatchingLocked) return;
    if (!this.selectedMatchUpper || !this.selectedMatchLower) return;

    const upperCard = this.selectedMatchUpper;
    const lowerCard = this.selectedMatchLower;
    const upperLetter = upperCard.getAttribute('data-letter');
    const lowerMatch = lowerCard.getAttribute('data-match');
    const lowerLetter = lowerCard.getAttribute('data-letter');

    if (upperLetter === lowerMatch) {
      // Correct Match!
      window.Sound.playCorrect();
      if (this.confetti) this.confetti.burst(25);

      // Unique color palette for this letter pair
      const pal = LETTER_COLOR_PALETTE[upperLetter.toUpperCase()] || {
        name: 'Vibrant',
        color: '#2563EB',
        bg: '#DBEAFE',
        border: '#1D4ED8'
      };

      const pairInfo = round.pairs.find(p => p.upper === upperLetter);
      const wordText = pairInfo ? pairInfo.word : `${pal.name}`;

      // Draw SVG cross arrow with matching stroke color
      this.drawMatchArrow(wrapper, upperCard, lowerCard, pal.color, upperLetter, false);

      // Apply distinct pair colors
      upperCard.classList.remove('selected');
      lowerCard.classList.remove('selected');
      upperCard.classList.add('paired');
      lowerCard.classList.add('paired');

      [upperCard, lowerCard].forEach(card => {
        card.style.borderColor = pal.border;
        card.style.backgroundColor = pal.bg;
        card.style.color = pal.color;
        card.style.boxShadow = `0 6px 18px ${pal.color}33`;
        const ptr = card.querySelector('.pointer-node');
        if (ptr) {
          ptr.style.backgroundColor = pal.color;
          ptr.style.borderColor = pal.border;
          ptr.style.color = '#FFF';
        }
      });

      this.selectedMatchUpper = null;
      this.selectedMatchLower = null;
      this.correctPairsCountInRound++;
      this.resolvedPairsCount++;

      // Award points for this correct match
      const pointsPerPair = Math.round(100 / round.pairs.length);
      this.levelScore += pointsPerPair;
      if (this.lblScore) this.lblScore.textContent = `${this.levelScore}`;

      if (this.resolvedPairsCount >= round.pairs.length) {
        // Round Finished: Settle round correct count
        this.roundCorrectCount += (this.correctPairsCountInRound / round.pairs.length);
        window.Voice.speak(`Awesome! ${upperLetter} is for ${wordText}! You completed this set!`, true, () => {
          setTimeout(() => {
            this.currentRoundIndex++;
            this.renderRound();
          }, 400);
        });
      } else {
        window.Voice.speak(`Great! ${upperLetter} is for ${wordText}!`, true);
      }
    } else {
      // Wrong Match: STRICT SINGLE ATTEMPT - NO RETRIES!
      // This pair attempt is consumed and failed (0 points).
      this.isMatchingLocked = true;
      window.Sound.playWrong();

      upperCard.classList.add('shake');
      lowerCard.classList.add('shake');

      // Find the true matching small letter card for this upper letter
      const correctLowerCard = wrapper.querySelector(`.lower-card[data-match="${upperLetter}"]`);
      const pairInfo = round.pairs.find(p => p.upper === upperLetter);
      const wordText = pairInfo ? pairInfo.word : upperLetter;

      // Draw red error dashed arrow to the true match so child learns
      if (correctLowerCard) {
        this.drawMatchArrow(wrapper, upperCard, correctLowerCard, '#EF4444', upperLetter, true);
        correctLowerCard.classList.add('paired-revealed');
      }

      // Mark the upper letter and its correct match as resolved with failure (0 points)
      upperCard.classList.remove('selected');
      upperCard.classList.add('paired-failed');
      if (correctLowerCard) {
        correctLowerCard.classList.add('paired-failed');
      }

      // If the clicked lower card was NOT the true match, unselect it so it can still be matched with its own uppercase letter
      if (lowerCard !== correctLowerCard) {
        lowerCard.classList.remove('selected', 'shake');
      }

      this.resolvedPairsCount++;
      // 0 points awarded for this failed pair!

      const speechMsg = `Oops! Big ${upperLetter} matches with small ${upperLetter.toLowerCase()}!`;
      window.Voice.speak(speechMsg, true, () => {
        upperCard.classList.remove('shake');
        this.selectedMatchUpper = null;
        this.selectedMatchLower = null;
        this.isMatchingLocked = false;

        if (this.resolvedPairsCount >= round.pairs.length) {
          // All pairs resolved in this round!
          this.roundCorrectCount += (this.correctPairsCountInRound / round.pairs.length);
          setTimeout(() => {
            this.currentRoundIndex++;
            this.renderRound();
          }, 400);
        }
      });
    }
  }

  drawMatchArrow(wrapper, upperCard, lowerCard, strokeColor, letterKey, isError = false) {
    const arena = wrapper.querySelector('#match-arena');
    const svg = wrapper.querySelector('#match-svg-canvas');
    if (!arena || !svg) return;

    const arenaRect = arena.getBoundingClientRect();
    const upperPtr = upperCard.querySelector('.pointer-node') || upperCard;
    const lowerPtr = lowerCard.querySelector('.pointer-node') || lowerCard;

    const upperRect = upperPtr.getBoundingClientRect();
    const lowerRect = lowerPtr.getBoundingClientRect();

    const x1 = (upperRect.left + upperRect.width / 2) - arenaRect.left;
    const y1 = (upperRect.top + upperRect.height / 2) - arenaRect.top;
    const x2 = (lowerRect.left + lowerRect.width / 2) - arenaRect.left;
    const y2 = (lowerRect.top + lowerRect.height / 2) - arenaRect.top;

    const markerId = `arrowhead-${letterKey}-${isError ? 'err-' : ''}${Date.now()}`;
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.appendChild(defs);
    }

    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', markerId);
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '7');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '7');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('orient', 'auto-start-reverse');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 0 1 L 10 5 L 0 9 z');
    path.setAttribute('fill', strokeColor);
    marker.appendChild(path);
    defs.appendChild(marker);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', strokeColor);
    line.setAttribute('stroke-width', isError ? '4' : '5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('marker-end', `url(#${markerId})`);
    if (isError) {
      line.classList.add('match-arrow-line-error');
    } else {
      line.classList.add('match-arrow-line');
    }

    svg.appendChild(line);
  }

  /**
   * Type 4: Number Sequences (1 -> 2 -> 3 -> ?)
   * Aligned with Level 1: identical centered spacing container (.revealed-container)
   * and centered celebration banner on answer.
   */
  renderNextNumRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper next-num-activity';

    const speechText = 'What number comes next? Choose the right number below!';
    window.Voice.speak(speechText);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🔢</span>
        <span class="instruction-text">What number comes next in the line?</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <!-- Sequence track (e.g. 1 -> 2 -> 3 -> ?) -->
      <div class="sequence-track">
        ${round.seq.map(num => `
          <div class="seq-node past-node num-node">
            <span class="node-letter">${num}</span>
          </div>
          <span class="seq-arrow">➔</span>
        `).join('')}
        <div class="seq-node target-node num-node" id="target-slot">
          <span class="node-letter">❓</span>
        </div>
      </div>

      <!-- Centered spacing container identical to Level 1 -->
      <div id="revealed-num-box" class="revealed-container"></div>

      <!-- Options Grid -->
      <div class="options-grid" id="options-grid">
        ${round.options.map(opt => `
          <button class="choice-btn num-btn" data-val="${opt}">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const optionBtns = wrapper.querySelectorAll('.choice-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.checkAnswer(
          btn.getAttribute('data-val'),
          round.answer.toString(),
          btn,
          wrapper.querySelector('#target-slot'),
          (advanceCallback) => {
            const numBox = wrapper.querySelector('#revealed-num-box');
            if (numBox) {
              numBox.innerHTML = `
                <div class="revealed-phonic-banner">
                  <span>🎉</span>
                  <span>Number <strong>${round.answer}</strong> is next!</span>
                </div>
              `;
            }
            window.Voice.speak(`Number ${round.answer} is next! Awesome job!`, true, advanceCallback);
          }
        );
      });
    });
  }

  /**
   * Type 5: Missing Phonics Letter (C _ T -> A)
   * Aligned with Level 1: identical centered spacing container (.revealed-container)
   */
  renderMissingLetterRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper missing-letter-activity';

    const speechText = `Look at the ${round.full}! Fill the missing letter in ${round.word}!`;
    window.Voice.speak(speechText);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">${round.icon}</span>
        <span class="instruction-text">${round.hint || 'Fill the missing letter!'}</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="missing-word-card">
        <div class="word-picture">${round.icon}</div>
        <div class="word-slots">
          <span class="word-display" id="word-display">${round.word}</span>
        </div>
      </div>

      <!-- Centered spacing container identical to Level 1 -->
      <div id="revealed-missing-box" class="revealed-container"></div>

      <div class="options-grid" id="options-grid">
        ${round.options.map(opt => `
          <button class="choice-btn" data-val="${opt}">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const optionBtns = wrapper.querySelectorAll('.choice-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.checkAnswer(btn.getAttribute('data-val'), round.answer, btn, null, (advanceCallback) => {
          wrapper.querySelector('#word-display').textContent = round.full;
          const box = wrapper.querySelector('#revealed-missing-box');
          if (box) {
            box.innerHTML = `
              <div class="revealed-phonic-banner">
                <span>🎉</span>
                <span><strong>${round.full}</strong> is correct!</span>
              </div>
            `;
          }
          window.Voice.speak(`Super! ${round.full}!`, true, advanceCallback);
        });
      });
    });
  }

  /**
   * Unified Answer Validation:
   * STRICT SINGLE ATTEMPT - NO RETRIES ALLOWED!
   * - Disables all choice buttons immediately upon selection.
   * - If correct: awards points, green glow, advances.
   * - If wrong: 0 points, shows correct answer in soft green so child learns, speaks answer, and advances.
   */
  checkAnswer(selectedVal, correctVal, btnElement, targetSlotElement = null, customSuccessHandler = null) {
    if (this.isRoundLocked) return;
    this.isRoundLocked = true;

    // Disable all options immediately to prevent multiple retries!
    const allBtns = document.querySelectorAll('.choice-btn');
    allBtns.forEach(b => b.disabled = true);

    const isCorrect = selectedVal.trim().toUpperCase() === correctVal.trim().toUpperCase();

    const advanceToNext = () => {
      setTimeout(() => {
        this.currentRoundIndex++;
        this.renderRound();
      }, 400);
    };

    if (isCorrect) {
      window.Sound.playCorrect();
      if (this.confetti) this.confetti.burst(35);

      btnElement.classList.add('btn-correct');
      if (targetSlotElement) {
        targetSlotElement.innerHTML = `<span class="node-letter">${correctVal}</span>`;
        targetSlotElement.classList.add('correct-glow');
      }

      this.levelScore += 100;
      this.roundCorrectCount++;
      if (this.lblScore) this.lblScore.textContent = `${this.levelScore}`;

      if (customSuccessHandler) {
        customSuccessHandler(advanceToNext);
      } else {
        window.Voice.speak(`Super! ${correctVal} is correct!`, true, advanceToNext);
      }
    } else {
      // Wrong Answer - Single attempt only! No retries on this question!
      window.Sound.playWrong();
      btnElement.classList.add('btn-wrong', 'shake');

      // Highlight the correct answer button so the child learns the right answer
      allBtns.forEach(b => {
        if (b.getAttribute('data-val').trim().toUpperCase() === correctVal.trim().toUpperCase()) {
          b.classList.add('btn-show-correct');
        }
      });

      if (targetSlotElement) {
        targetSlotElement.innerHTML = `<span class="node-letter" style="color:#DC2626;">${correctVal}</span>`;
        targetSlotElement.style.borderColor = '#EF4444';
      }

      // Voice speaks the correct answer and advances without giving points!
      window.Voice.speak(`Oops! The correct answer is ${correctVal}!`, true, advanceToNext);
    }
  }

  /**
   * Physical Keyboard Typing Handler:
   * Typing is enabled for all games!
   * Pressing letters (A-Z) or numbers (0-9) clicks the matching choice button.
   */
  handlePhysicalKeyboard(e) {
    if (this.screenPlay.classList.contains('hidden')) return;
    if (!this.currentLevel || this.isRoundLocked || this.isMatchingLocked) return;

    const key = e.key.toUpperCase();
    const optionBtns = document.querySelectorAll('.choice-btn');

    let matchedBtn = null;
    optionBtns.forEach(btn => {
      if (btn.getAttribute('data-val').toUpperCase() === key && !btn.disabled) {
        matchedBtn = btn;
      }
    });

    if (matchedBtn) {
      matchedBtn.click();
    }
  }

  /**
   * Level Finished: Calculate 3-Star Rating and Gating
   * Strictly enforces passing threshold:
   * Player must score >= 50% (at least 1 star) to pass and unlock next level.
   * If failed (<50%), next level is NOT unlocked and player MUST replay the level!
   */
  finishLevel() {
    window.Voice.stop();
    const totalRounds = this.totalQuestionsInLevel;
    const accuracy = Math.round((this.roundCorrectCount / totalRounds) * 100);

    // Calculate stars:
    // 3 Stars: >= 90% (e.g. 5/5)
    // 2 Stars: >= 70% (e.g. 4/5)
    // 1 Star: >= 50% (e.g. 3/5)
    // 0 Stars: < 50% (FAILED - Must replay level!)
    let stars = 0;
    if (accuracy >= 90) stars = 3;
    else if (accuracy >= 70) stars = 2;
    else if (accuracy >= 50) stars = 1;
    else stars = 0;

    const passed = stars >= 1;
    const currentLvlId = this.currentLevel.id;

    if (passed) {
      // Passed: Save progress & unlock next level
      const previousStars = this.progress.levelStars[currentLvlId] || 0;
      this.progress.levelStars[currentLvlId] = Math.max(previousStars, stars);

      if (!this.progress.levelBestScores) {
        this.progress.levelBestScores = {};
      }
      const prevBest = this.progress.levelBestScores[currentLvlId] || 0;
      this.progress.levelBestScores[currentLvlId] = Math.max(prevBest, this.levelScore);

      // Settle totalScore as sum of best level scores (never artificially inflated on retries!)
      let grandScore = 0;
      Object.values(this.progress.levelBestScores).forEach(sc => {
        grandScore += (sc || 0);
      });
      this.progress.totalScore = grandScore;

      // Unlock next level ONLY if passed!
      if (currentLvlId < GAME_LEVELS.length) {
        const nextLvlId = currentLvlId + 1;
        if (!this.progress.unlockedLevels.includes(nextLvlId)) {
          this.progress.unlockedLevels.push(nextLvlId);
        }
      }

      this.saveProgress();
      window.Sound.playVictory();
      if (this.confetti) this.confetti.burst(80);

      if (currentLvlId === 10) {
        this.showGraduationModal();
      } else {
        this.showLevelCompleteModal(stars, true, accuracy);
      }
    } else {
      // FAILED - User must replay the level to unlock next level!
      // Do NOT unlock next level!
      // Do NOT record score as best score!
      window.Sound.playWrong();
      this.showLevelCompleteModal(0, false, accuracy);
    }
  }

  showLevelCompleteModal(stars, passed, accuracy) {
    if (!this.modalLevelComplete) return;

    const titleEl = document.getElementById('modal-title');
    const subtitleEl = document.getElementById('modal-subtitle');
    const starsContainer = document.getElementById('modal-stars-container');
    const scoreValEl = document.getElementById('modal-score-val');
    const btnNext = document.getElementById('btn-modal-next-level');
    const btnReplay = document.getElementById('btn-modal-replay');

    scoreValEl.textContent = `${this.levelScore}`;

    if (passed) {
      titleEl.innerHTML = stars === 3 ? '🌟 Fantastic Superstar! 🌟' : '🎉 Great Job! Level Passed! 🎉';
      titleEl.style.color = '#0F172A';
      subtitleEl.innerHTML = `You got <strong>${Math.round(this.roundCorrectCount)} of ${this.totalQuestionsInLevel}</strong> right (${accuracy}%)!`;
      if (btnNext) btnNext.style.display = 'inline-flex';
      if (btnReplay) btnReplay.classList.remove('pulse-replay');
      window.Voice.speak(`Awesome job! You earned ${stars} stars!`, true);
    } else {
      titleEl.innerHTML = '❌ Level Not Passed ❌';
      titleEl.style.color = '#DC2626';
      subtitleEl.innerHTML = `You scored <strong>${Math.round(this.roundCorrectCount)} of ${this.totalQuestionsInLevel}</strong> correct (${accuracy}%).<br><div class="modal-failed-tip"><i class="fa-solid fa-triangle-exclamation"></i> You need at least <strong>50% (1 star)</strong> to unlock the next level! Please replay this level.</div>`;
      if (btnNext) btnNext.style.display = 'none';
      if (btnReplay) {
        btnReplay.classList.add('pulse-replay');
        btnReplay.focus();
      }
      window.Voice.speak('Level not passed. Please replay the level to unlock the next level!', true);
    }

    // Star pop-in animation
    starsContainer.innerHTML = '';
    for (let s = 1; s <= 3; s++) {
      const starSpan = document.createElement('span');
      starSpan.className = `modal-star ${s <= stars ? 'star-gold' : 'star-gray'}`;
      starSpan.textContent = s <= stars ? '⭐' : '☆';
      starsContainer.appendChild(starSpan);

      if (s <= stars) {
        setTimeout(() => {
          starSpan.classList.add('star-pop');
          window.Sound.playStar(s);
        }, s * 300);
      }
    }

    this.modalLevelComplete.classList.remove('hidden');
  }

  showGraduationModal() {
    if (!this.modalGraduation) return;
    window.Sound.playVictory();
    if (this.confetti) this.confetti.burst(120);
    window.Voice.speak('Congratulations! You are an Alphabet and Number Super Champion! You graduated with honors!');
    this.modalGraduation.classList.remove('hidden');
  }

  closeModals() {
    if (this.modalLevelComplete) this.modalLevelComplete.classList.add('hidden');
    if (this.modalGraduation) this.modalGraduation.classList.add('hidden');
  }
}

// Launch on page load
document.addEventListener('DOMContentLoaded', () => {
  window.Game = new StudyGame();
});
