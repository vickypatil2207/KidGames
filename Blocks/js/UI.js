/**
 * UI.js
 * Canvas rendering engine, mascot system, particle burst animations, and DOM updates.
 */

export class UI {
  constructor(game) {
    this.game = game;

    // DOM Elements
    this.boardCanvas = document.getElementById('board-canvas');
    this.boardCtx = this.boardCanvas.getContext('2d');

    this.nextCanvas = document.getElementById('next-canvas');
    this.nextCtx = this.nextCanvas.getContext('2d');

    this.holdCanvas = document.getElementById('hold-canvas');
    this.holdCtx = this.holdCanvas.getContext('2d');

    this.particleCanvas = document.getElementById('particle-canvas');
    this.particleCtx = this.particleCanvas.getContext('2d');

    this.scoreEl = document.getElementById('score');
    this.bestScoreEl = document.getElementById('best-score');
    this.levelEl = document.getElementById('level');
    this.linesEl = document.getElementById('lines');

    this.pauseOverlay = document.getElementById('pause-overlay');
    this.gameoverOverlay = document.getElementById('gameover-overlay');
    this.finalScoreEl = document.getElementById('final-score');
    this.finalLinesEl = document.getElementById('final-lines');
    this.finalLevelEl = document.getElementById('final-level');

    // Mascot state
    this.mascots = [
      { name: 'Barnaby', emoji: '🐼', messages: ['Let\'s play! 🧩', 'Awesome move! ⭐', 'Double blast! 🎉', 'You are a genius! 🌟'] },
      { name: 'Sparky', emoji: '🦊', messages: ['Woohoo! 🚀', 'Combo alert! 🔥', 'Keep it up! 👏', 'Unstoppable! 💪'] },
      { name: 'Pip', emoji: '🐰', messages: ['So fast! ⚡', 'Hoppy score! 🍓', 'Super star! 👑', 'Magic blocks! ✨'] },
      { name: 'Rex', emoji: '🦕', messages: ['Dino power! 🦖', 'Roar-some clear! 💥', 'Block champion! 🏆', 'Fantastic! 🎈'] }
    ];
    this.currentMascotIdx = 0;
    this.mascotEmojiEl = document.getElementById('mascot-emoji');
    this.mascotTextEl = document.getElementById('mascot-text');
    this.mascotAvatarEl = document.getElementById('mascot-avatar');

    // Particles array
    this.particles = [];

    // Cell sizing
    this.cellSize = 36;

    this.initMascot();
    this.setupResizeListener();
  }

  initMascot() {
    if (this.mascotAvatarEl) {
      this.mascotAvatarEl.addEventListener('click', () => {
        this.currentMascotIdx = (this.currentMascotIdx + 1) % this.mascotsCount();
        this.updateMascotDisplay();
        this.speakMascot("Hi! I'm your new buddy! 💖");
      });
    }
  }

  mascotsCount() {
    return this.mascots.length;
  }

  updateMascotDisplay() {
    const mascot = this.mascots[this.currentMascotIdx];
    if (this.mascotEmojiEl) this.mascotEmojiEl.textContent = mascot.emoji;
  }

  speakMascot(text) {
    if (this.mascotTextEl) {
      this.mascotTextEl.textContent = text;
      const bubble = document.getElementById('mascot-bubble');
      if (bubble) {
        bubble.style.transform = 'scale(1.1)';
        setTimeout(() => bubble.style.transform = 'scale(1)', 180);
      }
    }
  }

  setupResizeListener() {
    window.addEventListener('resize', () => {
      this.resizeBoardCanvas();
      this.resizeParticleCanvas();
      this.render();
    });
    this.resizeParticleCanvas();
  }

  resizeParticleCanvas() {
    if (this.particleCanvas) {
      this.particleCanvas.width = window.innerWidth;
      this.particleCanvas.height = window.innerHeight;
    }
  }

  resizeBoardCanvas() {
    const cols = this.game.gridWidth;
    const rows = this.game.gridHeight;

    const isMobile = window.innerWidth <= 820;
    // On mobile, reserve space for header, score card, preview boxes, controls, padding
    const reservedHeight = isMobile ? 320 : 220;
    const maxHeight = Math.max(160, Math.min(window.innerHeight - reservedHeight, 560));
    const maxWidth = Math.min(window.innerWidth - 36, 480);

    const cellW = Math.floor(maxWidth / cols);
    const cellH = Math.floor(maxHeight / rows);
    this.cellSize = Math.max(18, Math.min(cellW, cellH, 44));

    this.boardCanvas.width = cols * this.cellSize;
    this.boardCanvas.height = rows * this.cellSize;

    const boardEl = document.getElementById('game-board');
    if (boardEl) {
      boardEl.style.width = `${this.boardCanvas.width}px`;
      boardEl.style.height = `${this.boardCanvas.height}px`;
    }
  }

  render() {
    this.resizeBoardCanvas();
    this.drawBoard();
    this.drawPreview(this.nextCanvas, this.nextCtx, this.game.nextPiece);
    this.drawPreview(this.holdCanvas, this.holdCtx, this.game.holdPiece);
    this.updateStats();
  }

  updateStats() {
    if (this.scoreEl) this.scoreEl.textContent = this.game.score;
    if (this.bestScoreEl) this.bestScoreEl.textContent = this.game.bestScore;
    if (this.levelEl) this.levelEl.textContent = this.game.level;
    if (this.linesEl) this.linesEl.textContent = this.game.lines;

    if (this.pauseOverlay) {
      if (this.game.isPaused) this.pauseOverlay.classList.remove('hidden');
      else this.pauseOverlay.classList.add('hidden');
    }

    if (this.gameoverOverlay) {
      if (this.game.isGameOver) {
        if (this.finalScoreEl) this.finalScoreEl.textContent = this.game.score;
        if (this.finalLinesEl) this.finalLinesEl.textContent = this.game.lines;
        if (this.finalLevelEl) this.finalLevelEl.textContent = this.game.level;
        this.gameoverOverlay.classList.remove('hidden');
      } else {
        this.gameoverOverlay.classList.add('hidden');
      }
    }
  }

  drawBoard() {
    const ctx = this.boardCtx;
    const { width: cols, height: rows, grid } = this.game.board;
    const cs = this.cellSize;

    ctx.clearRect(0, 0, this.boardCanvas.width, this.boardCanvas.height);

    // Background grid lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
    ctx.lineWidth = 1;
    for (let r = 0; r <= rows; r++) {
      ctx.beginPath();
      ctx.moveTo(0, r * cs);
      ctx.lineTo(cols * cs, r * cs);
      ctx.stroke();
    }
    for (let c = 0; c <= cols; c++) {
      ctx.beginPath();
      ctx.moveTo(c * cs, 0);
      ctx.lineTo(c * cs, rows * cs);
      ctx.stroke();
    }

    // Draw locked cells on grid
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (grid[r][c]) {
          this.drawCandyCell(ctx, c * cs, r * cs, cs, grid[r][c]);
        }
      }
    }

    // Draw landing projection (ghost piece)
    if (this.game.currentPiece && !this.game.isPaused && !this.game.isGameOver) {
      const ghostY = this.game.board.getGhostY(this.game.currentPiece);
      const { matrix, color, x } = this.game.currentPiece;

      // Only draw ghost projection if it's lower than current piece position
      if (ghostY > this.game.currentPiece.y) {
        ctx.save();
        ctx.globalAlpha = 0.45; // Subtle, non-confusing projection opacity
        for (let r = 0; r < matrix.length; r++) {
          for (let c = 0; c < matrix[r].length; c++) {
            if (matrix[r][c]) {
              const py = (ghostY + r) * cs;
              if (py >= 0) {
                this.drawCandyCell(ctx, (x + c) * cs, py, cs, color, true);
              }
            }
          }
        }
        ctx.restore();
      }

      // Draw active falling piece
      for (let r = 0; r < matrix.length; r++) {
        for (let c = 0; c < matrix[r].length; c++) {
          if (matrix[r][c]) {
            const px = (x + c) * cs;
            const py = (this.game.currentPiece.y + r) * cs;
            if (py >= 0) {
              this.drawCandyCell(ctx, px, py, cs, color, false);
            }
          }
        }
      }
    }
  }

  /**
   * Draws a cell. If isGhost=true, draws a faint dashed projection guide.
   */
  drawCandyCell(ctx, x, y, size, colorObj, isGhost = false) {
    const radius = Math.max(4, Math.floor(size * 0.2));
    const pad = 1.5;
    const drawX = x + pad;
    const drawY = y + pad;
    const drawSize = size - pad * 2;

    ctx.save();

    if (isGhost) {
      // Faint transparent fill
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, drawSize, drawSize, radius);
      ctx.fillStyle = 'rgba(255, 255, 255, 0.05)';
      ctx.fill();

      // Dashed outline
      ctx.setLineDash([3, 3]);
      ctx.strokeStyle = colorObj.top || '#ffffff';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Center guide dot
      ctx.fillStyle = colorObj.top || '#ffffff';
      ctx.beginPath();
      ctx.arc(drawX + drawSize / 2, drawY + drawSize / 2, 2, 0, Math.PI * 2);
      ctx.fill();
    } else {
      // Base rounded block
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, drawSize, drawSize, radius);
      ctx.fillStyle = colorObj.main;
      ctx.fill();

      // Top glossy highlight
      ctx.beginPath();
      ctx.roundRect(drawX + 2, drawY + 2, drawSize - 4, (drawSize - 4) * 0.45, [radius, radius, 2, 2]);
      ctx.fillStyle = colorObj.top;
      ctx.fill();

      // Bottom shadow bevel
      ctx.beginPath();
      ctx.roundRect(drawX + 2, drawY + drawSize * 0.65, drawSize - 4, drawSize * 0.3, [2, 2, radius, radius]);
      ctx.fillStyle = colorObj.bottom;
      ctx.fill();

      // Border outline
      ctx.beginPath();
      ctx.roundRect(drawX, drawY, drawSize, drawSize, radius);
      ctx.strokeStyle = colorObj.border;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      // Cute cartoon eyes on central cells
      if (size >= 30) {
        const eyeRadius = Math.max(1.8, size * 0.07);
        const eyeY = drawY + drawSize * 0.45;
        const eyeX1 = drawX + drawSize * 0.35;
        const eyeX2 = drawX + drawSize * 0.65;

        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY, eyeRadius + 1, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY, eyeRadius + 1, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = '#1e102a';
        ctx.beginPath();
        ctx.arc(eyeX1, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.arc(eyeX2, eyeY, eyeRadius, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    ctx.restore();
  }

  drawPreview(canvas, ctx, piece) {
    if (!canvas || !ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (!piece) return;

    const matrix = piece.matrix;
    const rows = matrix.length;
    const cols = matrix[0].length;

    const pCellSize = Math.floor(Math.min(canvas.width / (cols + 1), canvas.height / (rows + 1)));
    const offsetX = Math.floor((canvas.width - cols * pCellSize) / 2);
    const offsetY = Math.floor((canvas.height - rows * pCellSize) / 2);

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        if (matrix[r][c]) {
          this.drawCandyCell(ctx, offsetX + c * pCellSize, offsetY + r * pCellSize, pCellSize, piece.color);
        }
      }
    }
  }

  triggerLineClearParticles(clearedRows, comboCount) {
    const rect = this.boardCanvas.getBoundingClientRect();
    const cs = this.cellSize;

    clearedRows.forEach(r => {
      const centerY = rect.top + r * cs + cs / 2;
      for (let c = 0; c < this.game.gridWidth; c++) {
        const centerX = rect.left + c * cs + cs / 2;

        for (let i = 0; i < 6; i++) {
          this.particles.push({
            x: centerX,
            y: centerY,
            vx: (Math.random() - 0.5) * 8,
            vy: (Math.random() - 0.5) * 8 - 3,
            size: Math.random() * 8 + 4,
            color: ['#ff5277', '#ffbe0b', '#06d6a0', '#4ea8de', '#9d4edd'][Math.floor(Math.random() * 5)],
            life: 1.0,
            decay: Math.random() * 0.03 + 0.02
          });
        }
      }
    });

    const mascot = this.mascots[this.currentMascotIdx];
    const msgs = mascot.messages;
    const msg = comboCount > 1 ? `COMBO x${comboCount}! 🔥` : msgs[Math.floor(Math.random() * msgs.length)];
    this.speakMascot(msg);
  }

  updateParticles() {
    if (this.particles.length === 0) return;
    const ctx = this.particleCtx;
    ctx.clearRect(0, 0, this.particleCanvas.width, this.particleCanvas.height);

    for (let i = this.particles.length - 1; i >= 0; i--) {
      const p = this.particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.2;
      p.life -= p.decay;

      if (p.life <= 0) {
        this.particles.splice(i, 1);
        continue;
      }

      ctx.save();
      ctx.globalAlpha = p.life;
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    }
  }
}
