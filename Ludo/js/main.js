/**
 * main.js
 * Bootstraps the Ludo game, handles configuration form panels, bindings, and sounds.
 */

// Web Audio API Retro Synth Sound Effects
const Sound = {
  ctx: null,
  init() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    }
    // Resume context if suspended (browser security autoplay policies)
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playTone(freq, type, duration, endFreq = null, volume = 0.1) {
    this.init();
    if (!this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (endFreq !== null) {
        osc.frequency.exponentialRampToValueAtTime(endFreq, this.ctx.currentTime + duration);
      }
      
      gain.gain.setValueAtTime(volume, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + duration);
      
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch(e) {}
  },
  roll() {
    this.playTone(200, 'triangle', 0.15, 600, 0.08);
  },
  step() {
    this.playTone(523.25, 'sine', 0.08, null, 0.1); // C5 note ping
  },
  release() {
    this.playTone(300, 'sine', 0.25, 950, 0.08);
  },
  capture() {
    this.playTone(600, 'sawtooth', 0.45, 90, 0.05); // Zap!
  },
  win() {
    // Fanfare! Major C Chord arpeggio
    setTimeout(() => this.playTone(523.25, 'sine', 0.12, null, 0.1), 0); // C5
    setTimeout(() => this.playTone(659.25, 'sine', 0.12, null, 0.1), 120); // E5
    setTimeout(() => this.playTone(783.99, 'sine', 0.12, null, 0.1), 240); // G5
    setTimeout(() => this.playTone(1046.50, 'sine', 0.4, null, 0.1), 360); // C6
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize canvas background
  const canvas = document.getElementById('bg-canvas');
  let bgAnim = null;
  if (canvas) {
    bgAnim = new BackgroundAnimation(canvas);
  }

  // Predefined Cartoon Characters list
  const characters = [
    { emoji: '🐭', name: 'Mickey', defaultName: 'Mickey Mouse' },
    { emoji: '⚡', name: 'Pikachu', defaultName: 'Pikachu' },
    { emoji: '🤖', name: 'Doraemon', defaultName: 'Doraemon' },
    { emoji: '🐷', name: 'Peppa', defaultName: 'Peppa Pig' },
    { emoji: '🧽', name: 'SpongeBob', defaultName: 'SpongeBob' },
    { emoji: '🦔', name: 'Sonic', defaultName: 'Sonic' },
    { emoji: '❄️', name: 'Elsa', defaultName: 'Queen Elsa' },
    { emoji: '👦', name: 'Shinchan', defaultName: 'Shinchan' }
  ];

  // Set default configurations
  let playerCount = 4;
  let playerConfigs = [
    { type: 'human', name: 'Mickey Mouse', character: '🐭' },
    { type: 'computer', name: 'Pikachu', character: '⚡' },
    { type: 'computer', name: 'Doraemon', character: '🤖' },
    { type: 'computer', name: 'Peppa Pig', character: '🐷' }
  ];

  const playerColors = ['red', 'green', 'yellow', 'blue'];

  // DOM Elements
  const countButtons = document.querySelectorAll('.count-btn');
  const formsContainer = document.getElementById('player-setup-forms');
  const startBtn = document.getElementById('start-btn');
  const setupModal = document.getElementById('setup-modal');
  const resetBtn = document.getElementById('reset-btn');
  const winnerCloseBtn = document.getElementById('winner-close');
  const rulesBtn = document.getElementById('rules-btn');
  const rulesModal = document.getElementById('rules-modal');
  const rulesCloseBtn = document.getElementById('rules-close');
  const rollBtn = document.getElementById('roll-btn');

  // Initialize UI and Game managers
  const uiManager = new UIManager();
  const game = new Game(uiManager);
  
  // Wire up sound callbacks into UI animations
  const originalAnimateStep = uiManager.animateTokenStep;
  uiManager.animateTokenStep = async function(player, token) {
    Sound.step();
    return originalAnimateStep.call(uiManager, player, token);
  };

  const originalAnimatePosition = uiManager.animateTokenPosition;
  uiManager.animateTokenPosition = async function(player, token) {
    Sound.release();
    return originalAnimatePosition.call(uiManager, player, token);
  };

  const originalAnimateCapture = uiManager.animateTokenCapture;
  uiManager.animateTokenCapture = async function(player, token) {
    Sound.capture();
    return originalAnimateCapture.call(uiManager, player, token);
  };

  const originalShowWinnerScreen = uiManager.showWinnerScreen;
  uiManager.showWinnerScreen = function(winnerList, allPlayers) {
    Sound.win();
    return originalShowWinnerScreen.call(uiManager, winnerList, allPlayers);
  };

  // Wire up Dice callback
  const dice = new Dice('dice', (val) => {
    game.handleDiceRoll(val);
  });
  uiManager.setDice(dice);

  // Hook roll button
  if (rollBtn) {
    rollBtn.addEventListener('click', () => {
      Sound.init();
      dice.roll();
    });
  }

  // Hook rules modals
  if (rulesBtn && rulesModal && rulesCloseBtn) {
    rulesBtn.addEventListener('click', () => {
      Sound.init();
      rulesModal.classList.add('open');
    });
    rulesCloseBtn.addEventListener('click', () => {
      rulesModal.classList.remove('open');
    });
  }

  // Bind Player count selections
  countButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      Sound.init();
      countButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      playerCount = parseInt(btn.getAttribute('data-count'));
      renderPlayerSetupForms();
    });
  });

  /**
   * Render player config form inputs based on playerCount selection
   */
  function renderPlayerSetupForms() {
    if (!formsContainer) return;
    formsContainer.innerHTML = '';

    for (let i = 0; i < playerCount; i++) {
      const color = playerColors[i];
      
      // Get previous config values if exist, else set defaults
      const prevCfg = playerConfigs[i] || {};
      const type = prevCfg.type || (i === 0 ? 'human' : 'computer');
      const char = prevCfg.character || characters[i % characters.length].emoji;
      
      const charDetails = characters.find(c => c.emoji === char) || characters[0];
      const name = prevCfg.name || charDetails.defaultName;

      // Save initial config values in buffer
      playerConfigs[i] = { type, name, character: char };

      const box = document.createElement('div');
      box.className = `player-setup-box p-${color}`;
      box.innerHTML = `
        <div class="player-setup-header">
          <span class="player-setup-title">PLAYER ${i + 1} (${color.toUpperCase()})</span>
          <div class="type-toggle" data-player-idx="${i}">
            <div class="type-toggle-option ${type === 'human' ? 'active' : ''}" data-type="human">👦 Kid</div>
            <div class="type-toggle-option ${type === 'computer' ? 'active' : ''}" data-type="computer">🤖 CPU</div>
          </div>
        </div>
        <div class="player-setup-inputs">
          <input type="text" class="player-name-input" data-player-idx="${i}" value="${name}" placeholder="Player Name">
          <div class="character-select-label">Choose Cartoon Token:</div>
          <div class="character-options" data-player-idx="${i}">
            ${characters.map(c => `
              <button type="button" class="char-btn ${c.emoji === char ? 'selected' : ''}" data-emoji="${c.emoji}" title="${c.defaultName}">
                ${c.emoji}
              </button>
            `).join('')}
          </div>
        </div>
      `;
      formsContainer.appendChild(box);
    }

    // Attach event listeners for switch toggles
    document.querySelectorAll('.type-toggle').forEach(toggle => {
      const idx = parseInt(toggle.getAttribute('data-player-idx'));
      toggle.querySelectorAll('.type-toggle-option').forEach(option => {
        option.addEventListener('click', () => {
          Sound.init();
          toggle.querySelectorAll('.type-toggle-option').forEach(o => o.classList.remove('active'));
          option.classList.add('active');
          
          const newType = option.getAttribute('data-type');
          playerConfigs[idx].type = newType;
        });
      });
    });

    // Attach event listeners for name changes
    document.querySelectorAll('.player-name-input').forEach(input => {
      const idx = parseInt(input.getAttribute('data-player-idx'));
      input.addEventListener('input', () => {
        playerConfigs[idx].name = input.value.trim();
      });
    });

    // Attach event listeners for cartoon selections
    document.querySelectorAll('.character-options').forEach(group => {
      const idx = parseInt(group.getAttribute('data-player-idx'));
      group.querySelectorAll('.char-btn').forEach(btn => {
        btn.addEventListener('click', () => {
          Sound.init();
          group.querySelectorAll('.char-btn').forEach(b => b.classList.remove('selected'));
          btn.classList.add('selected');
          
          const selectedEmoji = btn.getAttribute('data-emoji');
          const charInfo = characters.find(c => c.emoji === selectedEmoji);
          
          playerConfigs[idx].character = selectedEmoji;
          
          // Auto-fill default name if input hasn't been heavily customized
          const inputEl = document.querySelector(`.player-name-input[data-player-idx="${idx}"]`);
          if (inputEl) {
            const currentVal = inputEl.value.trim();
            const wasDefault = characters.some(c => c.defaultName === currentVal);
            if (currentVal === '' || wasDefault) {
              inputEl.value = charInfo.defaultName;
              playerConfigs[idx].name = charInfo.defaultName;
            }
          }
        });
      });
    });
  }

  // Hook startup form submit button
  if (startBtn) {
    startBtn.addEventListener('click', () => {
      Sound.init();
      // Ensure all playerConfigs up to player count are validated
      const activeConfigs = [];
      for (let i = 0; i < playerCount; i++) {
        const config = playerConfigs[i];
        activeConfigs.push({
          name: config.name.trim() || `Player ${i + 1}`,
          character: config.character,
          isComputer: config.type === 'computer'
        });
      }

      // Hide setup modal and trigger game bootstrap
      if (setupModal) {
        setupModal.classList.remove('open');
      }
      
      game.setupGame(activeConfigs);
    });
  }

  // Hook new game reset button
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      Sound.init();
      if (setupModal) {
        setupModal.classList.add('open');
      }
    });
  }

  // Hook winner close button
  if (winnerCloseBtn) {
    winnerCloseBtn.addEventListener('click', () => {
      Sound.init();
      uiManager.closeWinnerScreen();
      if (setupModal) {
        setupModal.classList.add('open');
      }
    });
  }

  // Initial forms render
  renderPlayerSetupForms();
});
