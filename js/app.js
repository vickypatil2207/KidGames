/* ==========================================================================
   KidGames Collection Hub - Application Logic
   ========================================================================== */

const GAMES_REGISTRY = [
  {
    id: 'little-archer',
    title: '3D Archery Hero',
    category: '3d',
    categoryName: '3D Games',
    emoji: '🏹',
    folder: 'LittleArcher',
    path: 'LittleArcher/index.html',
    description: 'Aim, charge, and shoot bullseyes across moving wheels, wind physics, and archery arenas!',
    features: ['Three.js 3D', 'Wind Physics', 'Target Wheels', 'Bow Skins'],
    gradient: 'linear-gradient(135deg, #065F46 0%, #10B981 100%)',
    artSvg: `<svg viewBox="0 0 200 120" width="100%" height="100%">
      <rect width="200" height="120" fill="url(#archGrad)"/>
      <defs>
        <linearGradient id="archGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#064E3B"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <circle cx="100" cy="60" r="42" fill="#EF4444"/>
      <circle cx="100" cy="60" r="32" fill="#FFFFFF"/>
      <circle cx="100" cy="60" r="22" fill="#3B82F6"/>
      <circle cx="100" cy="60" r="12" fill="#F59E0B"/>
      <circle cx="100" cy="60" r="4" fill="#FFFFFF"/>
      <path d="M 40 95 L 94 64" stroke="#FFF" stroke-width="4" stroke-linecap="round"/>
      <polygon points="92,60 100,58 97,67" fill="#FDE047"/>
    </svg>`
  },
  {
    id: 'city-run',
    title: 'CityRun Kid Runner',
    category: '3d',
    categoryName: '3D Games',
    emoji: '🏃‍♂️',
    folder: 'CityRun',
    path: 'CityRun/index.html',
    description: 'Dash through Indian monuments, dodge traffic, and collect coins & snacks in full 3D!',
    features: ['3D Monuments', 'Infinite Runner', 'Power-ups', 'Hero Avatars'],
    gradient: 'linear-gradient(135deg, #1E1B4B 0%, #4338CA 100%)',
    artSvg: `<svg viewBox="0 0 200 120" width="100%" height="100%">
      <defs>
        <linearGradient id="cityGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#0284C7"/>
          <stop offset="100%" stop-color="#1E1B4B"/>
        </linearGradient>
      </defs>
      <rect width="200" height="120" fill="url(#cityGrad)"/>
      <path d="M 20 90 L 35 90 L 35 50 L 50 50 L 50 90 L 70 90 L 70 35 L 90 25 L 110 35 L 110 90 L 130 90 L 130 60 L 150 60 L 150 90 L 180 90 Z" fill="#312E81" opacity="0.7"/>
      <path d="M 0 100 Q 100 95 200 100 L 200 120 L 0 120 Z" fill="#1E293B"/>
      <circle cx="110" cy="45" r="8" fill="#FFF"/>
      <path d="M 108 53 L 100 68 L 88 74 M 100 68 L 112 84 L 125 90" stroke="#00F0FF" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" fill="none"/>
    </svg>`
  },
  {
    id: 'brick-breaker',
    title: 'Super Brick Breaker',
    category: 'arcade',
    categoryName: 'Arcade & Action',
    emoji: '🧱',
    folder: 'BrickBreaker',
    path: 'BrickBreaker/index.html',
    description: '25 levels of fast-paced brick smashing, cute paddle heroes, and explosive power-ups!',
    features: ['25 Levels', 'Laser Powerups', 'Multi-Ball', 'Particle FX'],
    gradient: 'linear-gradient(135deg, #0F172A 0%, #334155 100%)',
    artSvg: `<svg viewBox="0 0 200 120" width="100%" height="100%">
      <rect width="200" height="120" fill="#0F172A"/>
      <rect x="25" y="20" width="30" height="14" rx="4" fill="#EF4444"/>
      <rect x="60" y="20" width="30" height="14" rx="4" fill="#F59E0B"/>
      <rect x="95" y="20" width="30" height="14" rx="4" fill="#10B981"/>
      <rect x="130" y="20" width="30" height="14" rx="4" fill="#3B82F6"/>

      <rect x="42" y="38" width="30" height="14" rx="4" fill="#8B5CF6"/>
      <rect x="77" y="38" width="30" height="14" rx="4" fill="#EC4899"/>
      <rect x="112" y="38" width="30" height="14" rx="4" fill="#00F0FF"/>

      <circle cx="100" cy="70" r="10" fill="#00F0FF"/>
      <rect x="70" y="98" width="60" height="12" rx="6" fill="#FFC700" stroke="#FFF" stroke-width="2"/>
    </svg>`
  },
  {
    id: 'ping-pong',
    title: 'Super Ping Pong',
    category: 'arcade',
    categoryName: 'Arcade & Action',
    emoji: '🏓',
    folder: 'PingPong',
    path: 'PingPong/index.html',
    description: 'Fast-paced table tennis rally with cute avatars, smash shots, and exciting AI match modes!',
    features: ['Cute Avatars', 'Smash Power', 'Rally Counter', 'AI Difficulty'],
    gradient: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    artSvg: `<svg viewBox="0 0 200 120" width="100%" height="100%">
      <rect width="200" height="120" fill="#0284C7"/>
      <line x1="100" y1="10" x2="100" y2="110" stroke="#FFF" stroke-width="3" stroke-dasharray="6,6"/>
      <circle cx="80" cy="55" r="32" fill="#EF4444" stroke="#FFF" stroke-width="4"/>
      <path d="M 96 78 L 125 108 C 128 111 120 118 115 114 L 84 84 Z" fill="#D97706"/>
      <circle cx="138" cy="40" r="12" fill="#FFC700" stroke="#FFF" stroke-width="3"/>
    </svg>`
  },
  {
    id: 'ludo',
    title: 'Ludo — Kids Edition',
    category: 'board',
    categoryName: 'Board & Strategy',
    emoji: '🎲',
    folder: 'Ludo',
    path: 'Ludo/index.html',
    description: 'Classic 4-player board game with animated dice rolls, fun sound effects, and cartoon tokens!',
    features: ['4 Players', 'Pass & Play', 'Smart AI', 'Animated Dice'],
    gradient: 'linear-gradient(135deg, #B45309 0%, #78350F 100%)',
    artSvg: `<svg viewBox="0 0 200 120" width="100%" height="100%">
      <rect width="200" height="120" fill="#FEF08A"/>
      <rect x="65" y="20" width="70" height="70" rx="16" fill="#EF4444"/>
      <circle cx="82" cy="37" r="6" fill="#FFF"/>
      <circle cx="118" cy="37" r="6" fill="#FFF"/>
      <circle cx="100" cy="55" r="6" fill="#FFF"/>
      <circle cx="82" cy="73" r="6" fill="#FFF"/>
      <circle cx="118" cy="73" r="6" fill="#FFF"/>
    </svg>`
  },
  {
    id: 'snake-ladder',
    title: 'Snake & Ladder',
    category: 'board',
    categoryName: 'Board & Strategy',
    emoji: '🐍',
    folder: 'SnakeAndLadder',
    path: 'SnakeAndLadder/index.html',
    description: 'Climb ladders, dodge slippery snakes, and race friends or AI to the top step 100!',
    features: ['Animated Snakes', 'Golden Ladders', 'Vs Computer', 'Fun Audio'],
    gradient: 'linear-gradient(135deg, #047857 0%, #064E3B 100%)',
    artSvg: `<svg viewBox="0 0 200 120" width="100%" height="100%">
      <rect width="200" height="120" fill="#059669"/>
      <line x1="45" y1="15" x2="45" y2="105" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
      <line x1="75" y1="15" x2="75" y2="105" stroke="#F59E0B" stroke-width="6" stroke-linecap="round"/>
      <line x1="45" y1="35" x2="75" y2="35" stroke="#F59E0B" stroke-width="5"/>
      <line x1="45" y1="60" x2="75" y2="60" stroke="#F59E0B" stroke-width="5"/>
      <line x1="45" y1="85" x2="75" y2="85" stroke="#F59E0B" stroke-width="5"/>

      <path d="M 160 20 C 130 35 170 60 135 80 C 115 92 155 105 130 110" stroke="#EF4444" stroke-width="9" stroke-linecap="round" fill="none"/>
      <circle cx="160" cy="20" r="7" fill="#EF4444"/>
    </svg>`
  },
  {
    id: 'tic-tac-toe',
    title: 'Tic Tac Toe Party',
    category: 'board',
    categoryName: 'Board & Strategy',
    emoji: '🎈',
    folder: 'TicTacToe',
    path: 'TicTacToe/index.html',
    description: 'Play 3x3 grid battles against a friend or smart AI with playful animations & pop sound effects!',
    features: ['Player vs AI', 'Pass & Play', 'Score Tracker', 'Pop Animations'],
    gradient: 'linear-gradient(135deg, #6D28D9 0%, #4C1D95 100%)',
    artSvg: `<svg viewBox="0 0 200 120" width="100%" height="100%">
      <rect width="200" height="120" fill="#7C3AED"/>
      <line x1="80" y1="20" x2="80" y2="100" stroke="#DDD6FE" stroke-width="5" stroke-linecap="round"/>
      <line x1="120" y1="20" x2="120" y2="100" stroke="#DDD6FE" stroke-width="5" stroke-linecap="round"/>
      <line x1="40" y1="50" x2="160" y2="50" stroke="#DDD6FE" stroke-width="5" stroke-linecap="round"/>
      <line x1="40" y1="80" x2="160" y2="80" stroke="#DDD6FE" stroke-width="5" stroke-linecap="round"/>
      <line x1="48" y1="26" x2="68" y2="44" stroke="#FF4D6D" stroke-width="6" stroke-linecap="round"/>
      <line x1="68" y1="26" x2="48" y2="44" stroke="#FF4D6D" stroke-width="6" stroke-linecap="round"/>
      <circle cx="100" cy="65" r="10" stroke="#00F0FF" stroke-width="6" fill="none"/>
    </svg>`
  },
  {
    id: '2048-fruit',
    title: '2048 Fruit Puzzle',
    category: 'puzzle',
    categoryName: 'Puzzle & Brain',
    emoji: '🍓',
    folder: '2048',
    path: '2048/index.html',
    description: 'Combine delicious fruits to reach the ultimate 2048 tile in this vibrant puzzle adventure!',
    features: ['Fruit Themes', 'High Score Saver', 'Juicy Audio', 'Undo Moves'],
    gradient: 'linear-gradient(135deg, #BE123C 0%, #881337 100%)',
    artSvg: `<svg viewBox="0 0 200 120" width="100%" height="100%">
      <rect width="200" height="120" fill="#FFF0F5"/>
      <path d="M 100 35 C 130 35 145 55 135 90 C 128 110 108 115 100 115 C 92 115 72 110 65 90 C 55 55 70 35 100 35 Z" fill="#FF4D6D"/>
      <path d="M 100 35 C 92 22 75 26 78 37 C 88 37 95 36 100 35 C 105 36 112 37 122 37 C 125 26 108 22 100 35 Z" fill="#2EC4B6"/>
      <circle cx="86" cy="60" r="3.5" fill="#FFB703"/>
      <circle cx="114" cy="60" r="3.5" fill="#FFB703"/>
      <circle cx="100" cy="78" r="3.5" fill="#FFB703"/>
      <circle cx="100" cy="98" r="3" fill="#FFB703"/>
    </svg>`
  },
  {
    id: 'blocks-blast',
    title: 'Block Blast Adventure',
    category: 'puzzle',
    categoryName: 'Puzzle & Brain',
    emoji: '🧩',
    folder: 'Blocks',
    path: 'Blocks/index.html',
    description: 'Drop colorful falling blocks, complete lines, and trigger magical particle explosions!',
    features: ['Tetris Physics', 'Line Combos', 'Particle FX', 'Cartoon Vibe'],
    gradient: 'linear-gradient(135deg, #1E293B 0%, #0F172A 100%)',
    artSvg: `<svg viewBox="0 0 200 120" width="100%" height="100%">
      <rect width="200" height="120" fill="#2B2D42"/>
      <rect x="55" y="25" width="40" height="40" rx="8" fill="#FF595E"/>
      <rect x="105" y="25" width="40" height="40" rx="8" fill="#FFCA3A"/>
      <rect x="55" y="70" width="40" height="40" rx="8" fill="#8AC926"/>
      <rect x="105" y="70" width="40" height="40" rx="8" fill="#1982C4"/>
    </svg>`
  }
];

// Sound Synth helper for UI audio feedback
class SoundSynth {
  constructor() {
    this.ctx = null;
  }
  
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
  }

  playPop() {
    try {
      this.init();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(400, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.08);
      
      gain.gain.setValueAtTime(0.2, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.08);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.08);
    } catch (e) {}
  }
}

const audioSynth = new SoundSynth();

// Canvas Background Particle Animation
function initBackgroundParticles() {
  const canvas = document.getElementById('bg-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width = (canvas.width = window.innerWidth);
  let height = (canvas.height = window.innerHeight);

  window.addEventListener('resize', () => {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  });

  const particles = [];
  const colors = ['#FF3366', '#8B5CF6', '#00F0FF', '#FFC700', '#10B981'];

  for (let i = 0; i < 35; i++) {
    particles.push({
      x: Math.random() * width,
      y: Math.random() * height,
      radius: Math.random() * 4 + 2,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - 0.5) * 0.6,
      vy: (Math.random() - 0.5) * 0.6,
      alpha: Math.random() * 0.5 + 0.2
    });
  }

  function render() {
    ctx.clearRect(0, 0, width, height);

    particles.forEach((p) => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0) p.x = width;
      if (p.x > width) p.x = 0;
      if (p.y < 0) p.y = height;
      if (p.y > height) p.y = 0;

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.alpha;
      ctx.fill();
    });

    ctx.globalAlpha = 1;
    requestAnimationFrame(render);
  }

  render();
}

// Render Games Grid
let currentCategory = 'all';
let currentSearchQuery = '';

function renderGames() {
  const gridContainer = document.getElementById('games-grid');
  if (!gridContainer) return;

  const filteredGames = GAMES_REGISTRY.filter((game) => {
    const matchesCategory = currentCategory === 'all' || game.category === currentCategory;
    const matchesSearch = game.title.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          game.description.toLowerCase().includes(currentSearchQuery.toLowerCase()) ||
                          game.features.some(f => f.toLowerCase().includes(currentSearchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  if (filteredGames.length === 0) {
    gridContainer.innerHTML = `
      <div class="no-results">
        <span class="no-results-icon">🔍</span>
        <h3>No games found</h3>
        <p>Try searching for a different keyword or choose another category!</p>
      </div>
    `;
    return;
  }

  gridContainer.innerHTML = filteredGames.map((game) => `
    <a href="${game.path}" target="_blank" rel="noopener noreferrer" class="game-card" data-id="${game.id}">
      <div class="card-preview">
        <div class="card-preview-art">${game.artSvg}</div>
        <span class="card-tag">${game.categoryName}</span>
        <span class="card-emoji-badge" title="${game.title}">${game.emoji}</span>
      </div>
      <div class="card-body">
        <h2 class="card-title">
          ${game.title}
          <i class="fa-solid fa-arrow-up-right-from-square"></i>
        </h2>
        <p class="card-desc">${game.description}</p>
        <div class="card-features">
          ${game.features.map(feat => `<span class="feature-pill">✨ ${feat}</span>`).join('')}
        </div>
        <button class="card-btn" type="button" aria-label="Play ${game.title} in new tab">
          Play Game <i class="fa-solid fa-gamepad"></i>
        </button>
      </div>
    </a>
  `).join('');

  // Add click sound effects to cards
  document.querySelectorAll('.game-card').forEach((card) => {
    card.addEventListener('click', () => {
      audioSynth.playPop();
    });
  });
}

// Setup Event Listeners
function setupEventListeners() {
  // Search input listener
  const searchInput = document.getElementById('search-input');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      currentSearchQuery = e.target.value;
      renderGames();
    });
  }

  // Filter tab buttons
  const tabButtons = document.querySelectorAll('.tab-btn');
  tabButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      audioSynth.playPop();
      tabButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCategory = btn.getAttribute('data-category');
      renderGames();
    });
  });

  // Surprise Me / Quick Play Button
  const btnSurprise = document.getElementById('btn-surprise');
  if (btnSurprise) {
    btnSurprise.addEventListener('click', () => {
      audioSynth.playPop();
      const randomIndex = Math.floor(Math.random() * GAMES_REGISTRY.length);
      const randomGame = GAMES_REGISTRY[randomIndex];
      window.open(randomGame.path, '_blank', 'noopener,noreferrer');
    });
  }
}

// DOM Ready Initialization
document.addEventListener('DOMContentLoaded', () => {
  initBackgroundParticles();
  renderGames();
  setupEventListeners();
});
