/**
 * UIManager.js
 * Owns all DOM interactions: dice face, player tokens, log entries,
 * turn indicator, and the winner modal.
 */
window.SL = window.SL || {};
const { Player } = window.SL;

const DICE_FACES = ['', '⚀', '⚁', '⚂', '⚃', '⚄', '⚅'];

const DEFAULT_PLAYERS = [
  { id: 'p1', name: 'Sunny',  color: '#ff5d8f', emoji: '🦊' },
  { id: 'p2', name: 'Buddy',  color: '#4ec5ff', emoji: '🐻' },
  { id: 'p3', name: 'Coco',   color: '#7ed957', emoji: '🐸' },
  { id: 'p4', name: 'Daisy',  color: '#ffb938', emoji: '🦋' },
];

window.SL.UIManager = class UIManager {
  /**
   * @param {object} els
   * @param {HTMLElement} els.boardEl
   * @param {HTMLElement} els.diceEl
   * @param {HTMLElement} els.rollBtn
   * @param {HTMLElement} els.resetBtn
   * @param {HTMLElement} els.turnIndicator
   * @param {HTMLElement} els.playersList
   * @param {HTMLElement} els.logList
   * @param {HTMLElement} els.modal
   * @param {HTMLElement} els.modalTitle
   * @param {HTMLElement} els.modalText
   * @param {HTMLElement} els.modalClose
   * @param {HTMLElement} els.confetti
   * @param {HTMLElement} els.setupModal
   * @param {HTMLElement} els.startBtn
   * @param {HTMLElement} els.playerNamesContainer
   */
  constructor(els) {
    this.els = els;
    this.players = [];
    this.gameMode = 'local';
    this.playerCount = 2;
  }

  /* ---------- Setup Screen ---------- */

  initSetup(onStart) {
    this._onStart = onStart;
    this._setupCountButtons();
    this._setupModeButtons();
    this._updateNameInputs();
    this.els.startBtn.addEventListener('click', () => this._startGame());
  }

  _setupCountButtons() {
    const btns = this.els.setupModal.querySelectorAll('.count-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.playerCount = parseInt(btn.dataset.count, 10);
        this._updateNameInputs();
      });
    });
  }

  _setupModeButtons() {
    const btns = this.els.setupModal.querySelectorAll('.mode-btn');
    btns.forEach((btn) => {
      btn.addEventListener('click', () => {
        btns.forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
        this.gameMode = btn.dataset.mode;
        this._updateNameInputs();
      });
    });
  }

  _updateNameInputs() {
    const container = this.els.playerNamesContainer.querySelector('.name-inputs');
    container.innerHTML = '';
    const configs = DEFAULT_PLAYERS.slice(0, this.playerCount);
    configs.forEach((cfg, i) => {
      const row = document.createElement('div');
      row.className = 'name-input-row';
      const isComputer = this.gameMode === 'computer' && i === this.playerCount - 1;
      row.innerHTML = `
        <span class="player-chip" style="background:${cfg.color}"></span>
        <input type="text" value="${cfg.name}" maxlength="12" data-idx="${i}"
               ${isComputer ? 'readonly' : ''} />
        ${isComputer ? '<span class="computer-badge">🤖</span>' : ''}
      `;
      container.appendChild(row);
    });
  }

  _startGame() {
    const inputs = this.els.playerNamesContainer.querySelectorAll('input');
    const configs = DEFAULT_PLAYERS.slice(0, this.playerCount).map((cfg, i) => ({
      ...cfg,
      name: inputs[i].value.trim() || cfg.name,
    }));
    const computerIdx = this.gameMode === 'computer' ? this.playerCount - 1 : -1;

    this.els.setupModal.classList.remove('open');
    this.els.setupModal.setAttribute('aria-hidden', 'true');

    if (this._onStart) this._onStart(configs, computerIdx);
  }

  hideSetup() {
    this.els.setupModal.classList.remove('open');
    this.els.setupModal.setAttribute('aria-hidden', 'true');
  }

  showSetup() {
    this.els.setupModal.classList.add('open');
    this.els.setupModal.setAttribute('aria-hidden', 'false');
  }

  /* ---------- Players ---------- */

  buildPlayers(configs = DEFAULT_PLAYERS, computerIdx = -1) {
    this.els.playersList.innerHTML = '';
    // Remove any existing tokens
    this.els.boardEl.querySelectorAll('.token').forEach((t) => t.remove());

    this.players = configs.map((cfg, i) => {
      const isComputer = i === computerIdx;
      const displayName = isComputer ? `${cfg.name} 🤖` : cfg.name;

      // Create DOM token — a colored circle with the player's emoji inside.
      const token = document.createElement('div');
      token.className = 'token';
      token.style.background = cfg.color;
      token.style.color      = cfg.color;
      token.innerHTML = `<span class="token-emoji">${cfg.emoji}</span>`;
      this.els.boardEl.appendChild(token);

      // Player list row
      const li = document.createElement('li');
      li.className = 'player-row';
      li.dataset.id = cfg.id;
      li.innerHTML = `
        <span class="player-chip" style="background:${cfg.color}"></span>
        <span class="player-name">${cfg.emoji} ${displayName}</span>
        <span class="player-pos">#1</span>
      `;
      this.els.playersList.appendChild(li);

      return new Player({
        id: cfg.id,
        name: cfg.name,
        color: cfg.color,
        emoji: cfg.emoji,
        tokenEl: token,
        isComputer,
      });
      // Put the emoji inside the token so it shows on the board.
    });
    return this.players;
  }

  setActivePlayer(player) {
    // Sidebar row
    this.els.playersList.querySelectorAll('.player-row').forEach((row) => {
      row.classList.toggle('active', row.dataset.id === player.id);
    });
    // Turn indicator
    const dot = this.els.turnIndicator.querySelector('.turn-dot');
    const name = this.els.turnIndicator.querySelector('.turn-name');
    dot.style.background = player.color;
    dot.style.boxShadow  = `0 0 0 4px ${player.color}33`;
    name.textContent     = `${player.emoji} ${player.name}`;
  }

  updatePlayerPosition(player) {
    const row = this.els.playersList.querySelector(`.player-row[data-id="${player.id}"]`);
    if (row) row.querySelector('.player-pos').textContent = `#${player.position}`;
  }

  /* ---------- Tokens on the board ---------- */

  /**
   * Move a player's token to the cell's center using percentages, so it
   * scales with the board size.
   */
  moveTokenTo(player, cellNumber) {
    const { row, col } = this._cellToPercent(cellNumber);
    // Stack multiple tokens slightly so all are visible on the same cell.
    const offset = this._stackOffset(player);
    player.tokenEl.style.left = `${col + offset.dx}%`;
    player.tokenEl.style.top  = `${row + offset.dy}%`;
  }

  _cellToPercent(cellNumber) {
    // Find the cell by its data-num attribute (cells are rendered in
    // snake-pattern DOM order, so the simple index approach no longer
    // works).
    const cell = this.els.boardEl.querySelector(`.cell[data-num="${cellNumber}"]`);
    if (!cell) return { row: 50, col: 50 };
    const boardRect = this.els.boardEl.getBoundingClientRect();
    const cellRect  = cell.getBoundingClientRect();
    const cx = (cellRect.left + cellRect.width  / 2 - boardRect.left) / boardRect.width  * 100;
    const cy = (cellRect.top  + cellRect.height / 2 - boardRect.top)  / boardRect.height * 100;
    return { row: cy, col: cx };
  }

  _stackOffset(player) {
    // When several players share a cell, fan them out a bit.
    const same = this.players.filter((p) => p.position === player.position);
    const i = same.findIndex((p) => p.id === player.id);
    const total = same.length;
    if (total === 1) return { dx: 0, dy: 0 };
    const angle = (i / total) * Math.PI * 2;
    return { dx: Math.cos(angle) * 4, dy: Math.sin(angle) * 4 };
  }

  popToken(player) {
    player.tokenEl.classList.remove('bouncing');
    void player.tokenEl.offsetWidth; // force reflow
    player.tokenEl.classList.add('bouncing');
  }

  markWinner(player) {
    player.tokenEl.classList.add('winner');
  }

  resetTokens() {
    this.players.forEach((p) => {
      p.reset();
      p.tokenEl.classList.remove('winner');
      this.moveTokenTo(p, 1);
      this.updatePlayerPosition(p);
    });
  }

  /* ---------- Dice ---------- */

  setDiceFace(value) {
    this.els.diceEl.querySelector('.dice-face').textContent = DICE_FACES[value];
  }

  animateDice(durationMs = 600) {
    const self = this;
    return new Promise((resolve) => {
      self.els.diceEl.classList.add('rolling');
      const start = performance.now();
      const tick = (now) => {
        const t = (now - start) / durationMs;
        if (t < 1) {
          self.setDiceFace(1 + Math.floor(Math.random() * 6));
          requestAnimationFrame(tick);
        } else {
          self.els.diceEl.classList.remove('rolling');
          resolve();
        }
      };
      requestAnimationFrame(tick);
    });
  }

  /* ---------- Log ---------- */

  log(message, color = '#999', emoji = '🎲') {
    const li = document.createElement('li');
    li.innerHTML = `
      <span class="log-chip" style="background:${color}"></span>
      <span class="log-emoji">${emoji}</span>
      <span>${message}</span>
    `;
    this.els.logList.prepend(li);
    // Keep the log tidy
    while (this.els.logList.children.length > 20) {
      this.els.logList.removeChild(this.els.logList.lastChild);
    }
  }

  /* ---------- Buttons ---------- */

  setRollingState(rolling) {
    this.els.rollBtn.disabled  = rolling;
    this.els.diceEl.style.pointerEvents = rolling ? 'none' : 'auto';
  }

  onRoll(handler)     { this.els.rollBtn.addEventListener('click', handler); }
  onDiceClick(handler){ this.els.diceEl.addEventListener('click', handler); }
  onReset(handler)    { this.els.resetBtn.addEventListener('click', handler); }

  /* ---------- Modal ---------- */

  showWinner(player) {
    this.els.modalTitle.textContent = `${player.emoji} ${player.name} Wins!`;
    this.els.modalText.textContent  = 'Bravo, champion! Ready for another round?';
    this.spawnConfetti();
    this.els.modal.classList.add('open');
    this.els.modal.setAttribute('aria-hidden', 'false');
  }

  hideWinner() {
    this.els.modal.classList.remove('open');
    this.els.modal.setAttribute('aria-hidden', 'true');
    this.els.confetti.innerHTML = '';
  }

  onModalClose(handler) {
    this.els.modalClose.addEventListener('click', handler);
  }

  spawnConfetti() {
    this.els.confetti.innerHTML = '';
    const colors = ['#ff5d8f', '#4ec5ff', '#7ed957', '#ffb938', '#b07cff', '#5dd6c9'];
    for (let i = 0; i < 60; i++) {
      const piece = document.createElement('i');
      piece.style.left = Math.random() * 100 + '%';
      piece.style.background = colors[i % colors.length];
      piece.style.animationDuration = (1.6 + Math.random() * 1.8) + 's';
      piece.style.animationDelay = (Math.random() * 0.6) + 's';
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      this.els.confetti.appendChild(piece);
    }
  }
};
