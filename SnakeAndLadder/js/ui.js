/**
 * ui.js
 * Controls pawn animations, board pawn layout, turn banners,
 * mobile responsive UI controls, sound toggles, and celebratory win screens.
 */
window.SL = window.SL || {};

window.SL.UIManager = class UIManager {
  constructor(game, board) {
    this.game = game;
    this.board = board;
    this.pawns = {}; // player.id -> DOM element
    this.dice = null;

    // DOM Elements
    this.turnBanner = document.getElementById('turn-banner');
    this.turnName = document.getElementById('turn-name');
    this.turnEmoji = document.getElementById('turn-emoji');
    this.turnMsg = document.getElementById('turn-msg');
    this.playersList = document.getElementById('players-list');
    this.logList = document.getElementById('log-list');

    this.init();
  }

  init() {
    this.createPawns();
    this.renderPlayersList();
    this.updateTurnBanner(this.game.getCurrentPlayer());
    this.setupMuteBtn();

    // Auto-update pawn positions when board resizes
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.updateAllPawnPositions(), 100);
    });

    if (window.ResizeObserver) {
      new ResizeObserver(() => this.updateAllPawnPositions()).observe(this.board.container);
    }
  }

  setDice(dice) {
    this.dice = dice;
    this.updateTurnBanner(this.game.getCurrentPlayer());
  }

  setupMuteBtn() {
    const muteBtn = document.getElementById('mute-btn');
    if (muteBtn) {
      muteBtn.addEventListener('click', () => {
        const isMuted = window.SL.sound.toggleMute();
        muteBtn.textContent = isMuted ? '🔇' : '🔊';
        muteBtn.classList.toggle('muted', isMuted);
      });
    }
  }

  /** Create DOM pawns for all players */
  createPawns() {
    // Remove existing pawns
    const existing = this.board.container.querySelectorAll('.player-pawn');
    existing.forEach(el => el.remove());
    this.pawns = {};

    this.game.players.forEach(p => {
      const pawn = document.createElement('div');
      pawn.className = `player-pawn pawn-player-${p.id}`;
      pawn.style.backgroundColor = p.color;
      pawn.style.borderColor = p.border;

      const inner = document.createElement('span');
      inner.className = 'pawn-emoji';
      inner.textContent = p.emoji;
      pawn.appendChild(inner);

      this.board.container.appendChild(pawn);
      this.pawns[p.id] = pawn;
    });

    this.updateAllPawnPositions();
    requestAnimationFrame(() => {
      this.updateAllPawnPositions();
    });
  }

  /** Render players scoreboard sidebar / cards */
  renderPlayersList() {
    if (!this.playersList) return;
    this.playersList.innerHTML = '';

    this.game.players.forEach(p => {
      const li = document.createElement('li');
      li.className = `player-card ${p.id === this.game.currentTurn ? 'active' : ''}`;
      li.id = `player-card-${p.id}`;
      li.style.borderLeftColor = p.color;

      li.innerHTML = `
        <div class="player-card-avatar" style="background-color: ${p.color}">${p.emoji}</div>
        <div class="player-card-info">
          <span class="player-card-name">${p.name}</span>
          <span class="player-card-pos" id="player-pos-${p.id}">Square: ${p.pos}</span>
        </div>
      `;
      this.playersList.appendChild(li);
    });
  }

  /** Update position of all pawns in pixel coordinates */
  updateAllPawnPositions() {
    const rect = this.board.container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const cellW = rect.width / this.board.size;
    const cellH = rect.height / this.board.size;

    // Group players by position to handle overlapping pawns
    const posGroups = {};
    this.game.players.forEach(p => {
      posGroups[p.pos] = posGroups[p.pos] || [];
      posGroups[p.pos].push(p);
    });

    Object.values(posGroups).forEach(group => {
      group.forEach((p, idx) => {
        const pawnEl = this.pawns[p.id];
        if (!pawnEl) return;

        const { row, col } = this.board.getGridCoord(p.pos);

        // Offsets when multiple pawns share a cell
        let offsetX = 0;
        let offsetY = 0;
        if (group.length > 1) {
          const offsets = [
            { x: -0.15, y: -0.15 },
            { x: 0.15,  y: -0.15 },
            { x: -0.15, y: 0.15 },
            { x: 0.15,  y: 0.15 }
          ];
          offsetX = (offsets[idx % 4].x) * cellW;
          offsetY = (offsets[idx % 4].y) * cellH;
        }

        const targetX = (col + 0.5) * cellW + offsetX;
        const targetY = (row + 0.5) * cellH + offsetY;

        pawnEl.style.transform = `translate3d(${targetX}px, ${targetY}px, 0)`;
      });
    });
  }

  /** Animate single hop step for a player */
  animateStep(player, cellNum, isSpecial = false) {
    return new Promise(resolve => {
      const pawnEl = this.pawns[player.id];
      if (!pawnEl) return resolve();

      // Update pos badge text in card
      const posEl = document.getElementById(`player-pos-${player.id}`);
      if (posEl) posEl.textContent = `Square: ${cellNum}`;

      if (!isSpecial) {
        if (window.SL.sound) window.SL.sound.playHop();
        pawnEl.classList.add('hopping');
      }

      this.updateAllPawnPositions();

      setTimeout(() => {
        pawnEl.classList.remove('hopping');
        resolve();
      }, isSpecial ? 500 : 160);
    });
  }

  /** Animate special ladder climb or snake slide */
  animateSpecial(player, entity) {
    return new Promise(resolve => {
      const pawnEl = this.pawns[player.id];
      if (!pawnEl) return resolve();

      if (entity.type === 'ladder') {
        if (window.SL.sound) window.SL.sound.playLadder();
        this.addLog(`🪜 ${player.name} climbed ladder to ${entity.target}!`, 'ladder');
        pawnEl.classList.add('climbing');
      } else {
        if (window.SL.sound) window.SL.sound.playSnake();
        this.addLog(`🐍 Oh no! ${player.name} slid down snake to ${entity.target}!`, 'snake');
        pawnEl.classList.add('sliding');
      }

      setTimeout(() => {
        pawnEl.classList.remove('climbing', 'sliding');
        resolve();
      }, 550);
    });
  }

  /** Update banner top display */
  updateTurnBanner(player, rolledSix = false) {
    // Update card highlights
    this.game.players.forEach(p => {
      const card = document.getElementById(`player-card-${p.id}`);
      if (card) {
        card.classList.toggle('active', p.id === player.id);
      }
    });

    if (this.turnName) this.turnName.textContent = player.name;
    if (this.turnEmoji) this.turnEmoji.textContent = player.emoji;
    if (this.turnBanner) this.turnBanner.style.backgroundColor = player.color;

    if (this.turnMsg) {
      if (rolledSix) {
        this.turnMsg.textContent = '🎉 Rolled a 6! Roll Again!';
      } else if (player.isAI) {
        this.turnMsg.textContent = '🤖 Robo AI is rolling...';
      } else {
        this.turnMsg.textContent = 'Tap dice to roll!';
      }
    }

    if (this.dice) {
      this.dice.setDisabled(player.isAI);
    }

    // Auto-trigger Computer AI turn after a short delay
    if (player.isAI && !this.game.isGameOver) {
      setTimeout(() => {
        if (this.dice && !this.game.isGameOver) {
          this.dice.roll();
        }
      }, 750);
    }
  }

  addLog(msg, type = 'normal') {
    if (!this.logList) return;
    const li = document.createElement('li');
    li.className = `log-item log-${type}`;
    li.textContent = msg;
    this.logList.prepend(li);
    while (this.logList.children.length > 8) {
      this.logList.removeChild(this.logList.lastChild);
    }
  }

  /** Show Win modal with confetti */
  showWinnerModal(winner) {
    if (window.SL.sound) window.SL.sound.playWin();

    const modal = document.getElementById('winner-modal');
    const winnerName = document.getElementById('winner-name');
    const winnerEmoji = document.getElementById('winner-emoji');

    if (winnerName) winnerName.textContent = `${winner.name} Wins!`;
    if (winnerEmoji) winnerEmoji.textContent = winner.emoji;

    if (modal) {
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
    }

    this.launchConfetti();
  }

  launchConfetti() {
    const canvas = document.getElementById('confetti-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles = [];
    const colors = ['#f43f5e', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b'];

    for (let i = 0; i < 100; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height - canvas.height,
        r: Math.random() * 6 + 4,
        d: Math.random() * 8 + 2,
        color: colors[Math.floor(Math.random() * colors.length)],
        tilt: Math.random() * 10 - 10,
        tiltAngleInc: Math.random() * 0.07 + 0.05
      });
    }

    let frame = 0;
    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        p.tiltAngleInc += 0.05;
        p.y += (Math.cos(frame + p.d) + 3 + p.r / 2) / 2;
        p.tilt = Math.sin(p.tiltAngleInc) * 15;

        ctx.beginPath();
        ctx.lineWidth = p.r;
        ctx.strokeStyle = p.color;
        ctx.moveTo(p.x + p.tilt + p.r / 2, p.y);
        ctx.lineTo(p.x + p.tilt, p.y + p.tilt + p.r / 2);
        ctx.stroke();
      });

      frame++;
      if (frame < 180) requestAnimationFrame(draw);
    };
    draw();
  }
};
