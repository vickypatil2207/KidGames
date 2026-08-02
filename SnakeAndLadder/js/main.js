/**
 * main.js
 * Game entry point, setup modal event handlers, and new game initialization.
 */
document.addEventListener('DOMContentLoaded', () => {
  let game = null;
  let board = null;
  let ui = null;
  let dice = null;

  const setupModal = document.getElementById('setup-modal');
  const winnerModal = document.getElementById('winner-modal');
  const startBtn = document.getElementById('start-btn');
  const resetBtn = document.getElementById('reset-btn');
  const playAgainBtn = document.getElementById('play-again-btn');

  // Player count setup toggle buttons
  let selectedPlayerCount = 2;
  let selectedMode = 'local'; // 'local' or 'computer'

  const countBtns = document.querySelectorAll('.count-btn');
  countBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (window.SL.sound) window.SL.sound.playClick();
      countBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedPlayerCount = parseInt(btn.dataset.count, 10);
      renderNameInputs();
    });
  });

  const modeBtns = document.querySelectorAll('.mode-btn');
  const playerCountSection = document.getElementById('player-count-section');

  modeBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      if (window.SL.sound) window.SL.sound.playClick();
      modeBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      selectedMode = btn.dataset.mode;

      if (selectedMode === 'computer') {
        if (playerCountSection) playerCountSection.style.display = 'none';
        selectedPlayerCount = 2;
      } else {
        if (playerCountSection) playerCountSection.style.display = 'block';
      }
      renderNameInputs();
    });
  });

  function renderNameInputs() {
    const container = document.getElementById('name-inputs-container');
    if (!container) return;
    container.innerHTML = '';

    const avatars = (window.SL && window.SL.AVATARS) ? window.SL.AVATARS : [
      { id: 'dog',   name: 'Puppy', emoji: '🐶', color: '#ef4444', border: '#b91c1c' },
      { id: 'cat',   name: 'Kitty', emoji: '🐱', color: '#3b82f6', border: '#1d4ed8' },
      { id: 'rabbit',name: 'Bunny', emoji: '🐰', color: '#10b981', border: '#047857' },
      { id: 'bear',  name: 'Bear',  emoji: '🐻', color: '#f59e0b', border: '#b45309' }
    ];

    const count = selectedMode === 'computer' ? 1 : selectedPlayerCount;
    for (let i = 0; i < count; i++) {
      const avatar = avatars[i % avatars.length];
      const div = document.createElement('div');
      div.className = 'name-input-group';
      div.innerHTML = `
        <span class="avatar-badge" style="background-color: ${avatar.color}">${avatar.emoji}</span>
        <input type="text" class="name-input" id="player-name-${i}" value="${avatar.name}" placeholder="Player ${i + 1} Name" />
      `;
      container.appendChild(div);
    }
  }

  renderNameInputs();

  function startNewGame() {
    if (window.SL.sound) window.SL.sound.playClick();

    // Read names
    const names = [];
    const count = selectedMode === 'computer' ? 1 : selectedPlayerCount;
    for (let i = 0; i < count; i++) {
      const input = document.getElementById(`player-name-${i}`);
      names.push(input && input.value.trim() ? input.value.trim() : `Player ${i + 1}`);
    }

    // Hide modals
    if (setupModal) setupModal.classList.remove('open');
    if (winnerModal) winnerModal.classList.remove('open');

    // Create Board
    const boardContainer = document.getElementById('board');
    board = new window.SL.Board(boardContainer);

    // Create Game Engine
    game = new window.SL.Game({
      mode: selectedMode,
      playerCount: selectedPlayerCount,
      names: names,
      onMoveStep: async (player, stepNum, isSpecial) => {
        await ui.animateStep(player, stepNum, isSpecial);
      },
      onSpecialMove: async (player, entity) => {
        await ui.animateSpecial(player, entity);
      },
      onTurnChange: (player, rolledSix) => {
        ui.updateTurnBanner(player, rolledSix);
      },
      onGameOver: (winner) => {
        ui.showWinnerModal(winner);
      }
    });

    // Create UI Manager
    ui = new window.SL.UIManager(game, board);

    // Create Dice Controller
    const diceEl = document.getElementById('dice');
    const rollBtnEl = document.getElementById('roll-btn');

    dice = new window.SL.Dice(diceEl, rollBtnEl, (rollValue) => {
      ui.addLog(`🎲 ${game.getCurrentPlayer().name} rolled a ${rollValue}`);
      game.handleRoll(rollValue, board);
    });

    ui.setDice(dice);
    ui.addLog('🎮 Game Started! Good luck!', 'system');
  }

  if (startBtn) startBtn.addEventListener('click', startNewGame);
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      if (winnerModal) winnerModal.classList.remove('open');
      if (setupModal) setupModal.classList.add('open');
    });
  }
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      if (window.SL.sound) window.SL.sound.playClick();
      if (setupModal) setupModal.classList.add('open');
    });
  }
});
