/**
 * 🏓 PingPongGame - Main Controller & Game Loop
 */

const CONFIG = {
  winningScore: 5,
  initialBallSpeed: 6.5,
  speedIncrement: 0.7,
  rallySpeedThreshold: 3,
  paddleWidthRatio: 0.024,
  paddleHeightRatio: 0.18,
  ballRadiusRatio: 0.018,
  aiSettings: {
    easy: { lerp: 0.065, maxSpeed: 4.5, margin: 25 },
    medium: { lerp: 0.11, maxSpeed: 6.5, margin: 15 },
    hard: { lerp: 0.16, maxSpeed: 9.0, margin: 5 }
  }
};

class PingPongGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.ctx = this.canvas.getContext('2d');

    // UI Elements
    this.playerScoreEl = document.getElementById('player-score');
    this.aiScoreEl = document.getElementById('ai-score');
    this.rallyCountEl = document.getElementById('rally-count');
    this.soundBtn = document.getElementById('sound-btn');
    this.pauseBtn = document.getElementById('pause-btn');

    this.startModal = document.getElementById('start-modal');
    this.pauseModal = document.getElementById('pause-modal');
    this.gameoverModal = document.getElementById('gameover-modal');
    this.countdownOverlay = document.getElementById('countdown-overlay');
    this.countdownText = document.getElementById('countdown-text');
    this.speedupOverlay = document.getElementById('speedup-overlay');

    // Confetti canvas setup
    this.confettiCanvas = document.getElementById('confetti-canvas');
    this.confettiCtx = this.confettiCanvas.getContext('2d');
    this.confettiList = [];

    // Helper Systems
    this.aiSystem = new AIOpponent(CONFIG.aiSettings);

    // State Variables
    this.state = 'START_MENU';
    this.playerScore = 0;
    this.aiScore = 0;
    this.rallyCount = 0;
    this.selectedAvatar = 'kitty';
    this.selectedDiff = 'easy';

    // Entities & Orientation
    this.isVertical = false;
    this.width = 800;
    this.height = 500;
    this.paddleWidth = 16;
    this.paddleHeight = 90;
    this.ballRadius = 12;

    this.player = { x: 400, y: 250, targetX: 400, targetY: 250, vy: 0 };
    this.ai = { x: 400, y: 250, vy: 0 };
    this.ball = { x: 400, y: 250, vx: 0, vy: 0, speed: CONFIG.initialBallSpeed };
    this.ballTrail = [];
    this.particles = [];

    // Keyboard state
    this.keys = { up: false, down: false, left: false, right: false };

    this.initEvents();
    this.resizeCanvas();
    this.loop = this.loop.bind(this);
    requestAnimationFrame(this.loop);
  }

  resizeCanvas() {
    const container = document.getElementById('canvas-container');
    this.width = container.clientWidth;
    this.height = container.clientHeight;

    this.canvas.width = this.width;
    this.canvas.height = this.height;

    this.isVertical = this.width < this.height;

    if (this.isVertical) {
      // In vertical mode (mobile portrait), paddle width is long side X, height is thickness Y
      this.paddleWidth = Math.max(70, this.width * CONFIG.paddleHeightRatio * 1.5);
      this.paddleHeight = Math.max(16, this.height * CONFIG.paddleWidthRatio * 0.8);
      this.ballRadius = Math.max(10, this.width * CONFIG.ballRadiusRatio * 1.2);

      this.player.y = this.height - 24 - this.paddleHeight;
      this.ai.y = 24;
      if (this.player.x === undefined) this.player.x = this.width / 2;
      this.player.targetX = this.player.x;
      if (this.ai.x === undefined) this.ai.x = this.width / 2;
    } else {
      // In horizontal mode (desktop/landscape), paddle width is thickness X, height is long side Y
      this.paddleWidth = Math.max(16, this.width * CONFIG.paddleWidthRatio);
      this.paddleHeight = Math.max(70, this.height * CONFIG.paddleHeightRatio);
      this.ballRadius = Math.max(10, this.height * CONFIG.ballRadiusRatio);

      this.player.x = 24;
      this.ai.x = this.width - 24 - this.paddleWidth;
      if (this.player.y === undefined) this.player.y = this.height / 2;
      this.player.targetY = this.player.y;
      if (this.ai.y === undefined) this.ai.y = this.height / 2;
    }
  }

  initEvents() {
    window.addEventListener('resize', () => this.resizeCanvas());

    // Sound button
    this.soundBtn.addEventListener('click', () => {
      audio.init();
      audio.muted = !audio.muted;
      this.soundBtn.textContent = audio.muted ? '🔇' : '🔊';
    });

    // Pause button
    this.pauseBtn.addEventListener('click', () => {
      if (this.state === 'PLAYING') this.pauseGame();
    });

    // Avatars selection
    document.querySelectorAll('.avatar-card').forEach(btn => {
      btn.addEventListener('click', () => {
        audio.init();
        audio.playWallHit();
        document.querySelectorAll('.avatar-card').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedAvatar = btn.getAttribute('data-avatar');
      });
    });

    // Difficulty selection
    document.querySelectorAll('.diff-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        audio.init();
        audio.playWallHit();
        document.querySelectorAll('.diff-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        this.selectedDiff = btn.getAttribute('data-diff');
      });
    });

    // Modal buttons
    document.getElementById('start-btn').addEventListener('click', () => {
      audio.init();
      audio.playPaddleHit();
      this.startModal.classList.add('hidden');
      this.resetMatch();
    });

    document.getElementById('resume-btn').addEventListener('click', () => {
      audio.init();
      this.pauseModal.classList.add('hidden');
      this.state = 'PLAYING';
    });

    document.getElementById('restart-btn').addEventListener('click', () => {
      audio.init();
      this.pauseModal.classList.add('hidden');
      this.resetMatch();
    });

    document.getElementById('menu-btn').addEventListener('click', () => {
      audio.init();
      this.pauseModal.classList.add('hidden');
      this.startModal.classList.remove('hidden');
      this.state = 'START_MENU';
    });

    document.getElementById('play-again-btn').addEventListener('click', () => {
      audio.init();
      this.gameoverModal.classList.add('hidden');
      this.resetMatch();
    });

    // Mouse control
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      if (this.isVertical) {
        this.player.targetX = e.clientX - rect.left;
      } else {
        this.player.targetY = e.clientY - rect.top;
      }
    });

    // Touch controls
    this.canvas.addEventListener('touchstart', (e) => {
      audio.init();
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        if (this.isVertical) {
          this.player.targetX = e.touches[0].clientX - rect.left;
        } else {
          this.player.targetY = e.touches[0].clientY - rect.top;
        }
      }
    });

    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        if (this.isVertical) {
          this.player.targetX = e.touches[0].clientX - rect.left;
        } else {
          this.player.targetY = e.touches[0].clientY - rect.top;
        }
      }
    });

    // Keyboard controls
    window.addEventListener('keydown', (e) => {
      audio.init();
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = true;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = true;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
      if (e.key === 'p' || e.key === 'P' || e.key === 'Escape') {
        if (this.state === 'PLAYING') this.pauseGame();
        else if (this.state === 'PAUSED') {
          this.pauseModal.classList.add('hidden');
          this.state = 'PLAYING';
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W') this.keys.up = false;
      if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') this.keys.down = false;
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
    });
  }

  pauseGame() {
    this.state = 'PAUSED';
    this.pauseModal.classList.remove('hidden');
  }

  resetMatch() {
    this.playerScore = 0;
    this.aiScore = 0;
    this.updateHUD();
    this.startRound();
  }

  startRound() {
    if (this.countdownInterval) clearInterval(this.countdownInterval);
    if (this.speedupTimeout) clearTimeout(this.speedupTimeout);

    this.speedupOverlay.classList.add('hidden');
    this.countdownOverlay.classList.add('hidden');

    this.rallyCount = 0;
    this.rallyCountEl.textContent = '0';
    this.particles = [];
    this.ballTrail = [];

    if (this.isVertical) {
      this.player.x = this.width / 2;
      this.player.targetX = this.width / 2;
      this.ai.x = this.width / 2;
    } else {
      this.player.y = this.height / 2;
      this.player.targetY = this.height / 2;
      this.ai.y = this.height / 2;
    }

    this.ball.x = this.width / 2;
    this.ball.y = this.height / 2;
    this.ball.speed = CONFIG.initialBallSpeed;

    this.state = 'COUNTDOWN';
    this.countdownOverlay.classList.remove('hidden');
    let count = 3;
    this.countdownText.textContent = count;
    audio.playWallHit();

    this.countdownInterval = setInterval(() => {
      count--;
      if (count > 0) {
        this.countdownText.textContent = count;
        audio.playWallHit();
      } else if (count === 0) {
        this.countdownText.textContent = 'GO!';
        audio.playSpeedUp();
      } else {
        clearInterval(this.countdownInterval);
        this.countdownInterval = null;
        this.countdownOverlay.classList.add('hidden');
        this.launchBall();
        this.state = 'PLAYING';
      }
    }, 650);
  }

  launchBall() {
    const direction = Math.random() > 0.5 ? 1 : -1;
    const angle = (Math.random() * 60 - 30) * (Math.PI / 180);
    if (this.isVertical) {
      this.ball.vy = Math.cos(angle) * this.ball.speed * direction;
      this.ball.vx = Math.sin(angle) * this.ball.speed;
    } else {
      this.ball.vx = Math.cos(angle) * this.ball.speed * direction;
      this.ball.vy = Math.sin(angle) * this.ball.speed;
    }
  }

  updateHUD() {
    this.playerScoreEl.textContent = this.playerScore;
    this.aiScoreEl.textContent = this.aiScore;
    this.rallyCountEl.textContent = this.rallyCount;
  }

  triggerParticles(x, y, color, count = 16) {
    for (let i = 0; i < count; i++) {
      this.particles.push(new Particle(x, y, color));
    }
  }

  showSpeedupBanner() {
    if (this.speedupTimeout) clearTimeout(this.speedupTimeout);
    this.speedupOverlay.classList.remove('hidden');
    this.speedupTimeout = setTimeout(() => {
      this.speedupOverlay.classList.add('hidden');
    }, 1000);
  }

  update() {
    if (this.state !== 'PLAYING') return;

    // Player Movement
    const keySpeed = 9;
    if (this.isVertical) {
      if (this.keys.left || this.keys.up) this.player.targetX -= keySpeed;
      if (this.keys.right || this.keys.down) this.player.targetX += keySpeed;

      this.player.x += (this.player.targetX - this.player.x) * 0.25;
      const halfW = this.paddleWidth / 2;
      this.player.x = Math.max(halfW, Math.min(this.width - halfW, this.player.x));
    } else {
      if (this.keys.up || this.keys.left) this.player.targetY -= keySpeed;
      if (this.keys.down || this.keys.right) this.player.targetY += keySpeed;

      this.player.y += (this.player.targetY - this.player.y) * 0.25;
      const halfH = this.paddleHeight / 2;
      this.player.y = Math.max(halfH, Math.min(this.height - halfH, this.player.y));
    }

    // AI Movement
    const paddleLength = this.isVertical ? this.paddleWidth : this.paddleHeight;
    this.aiSystem.update(this.ai, this.ball, this.selectedDiff, this.width, this.height, paddleLength, this.isVertical);

    // Ball Movement & Trail
    this.ball.x += this.ball.vx;
    this.ball.y += this.ball.vy;
    this.ballTrail.push({ x: this.ball.x, y: this.ball.y });
    if (this.ballTrail.length > 12) this.ballTrail.shift();

    // Wall Collision Physics
    PhysicsEngine.checkWallCollision(this.ball, this.ballRadius, this.width, this.height, this.isVertical, (x, y) => {
      audio.playWallHit();
      this.triggerParticles(x, y, '#00e676', 10);
    });

    // Paddle Collision Physics
    PhysicsEngine.checkPaddleCollision(
      this.ball,
      this.ballRadius,
      this.player,
      this.ai,
      this.paddleWidth,
      this.paddleHeight,
      this.isVertical,
      (hitter, paddlePos) => {
        this.rallyCount++;
        this.rallyCountEl.textContent = this.rallyCount;
        audio.playPaddleHit();
        this.triggerParticles(this.ball.x, this.ball.y, '#ff4081', 14);

        if (this.rallyCount % CONFIG.rallySpeedThreshold === 0) {
          this.ball.speed += CONFIG.speedIncrement;
          audio.playSpeedUp();
          this.showSpeedupBanner();
        }

        const newVel = PhysicsEngine.calculateReturnAngle(
          this.isVertical ? this.ball.x : this.ball.y,
          paddlePos,
          this.isVertical ? this.paddleWidth : this.paddleHeight,
          this.ball.speed,
          hitter === 'ai',
          this.isVertical
        );
        this.ball.vx = newVel.vx;
        this.ball.vy = newVel.vy;
      }
    );

    // Goal Scoring Physics
    if (this.isVertical) {
      if (this.ball.y - this.ballRadius < 0) {
        this.playerScore++;
        this.updateHUD();
        audio.playPointScore();
        this.triggerParticles(this.ball.x, 0, '#ffeb3b', 25);
        this.checkWinner();
      } else if (this.ball.y + this.ballRadius > this.height) {
        this.aiScore++;
        this.updateHUD();
        audio.playPointScore();
        this.triggerParticles(this.ball.x, this.height, '#ff1744', 25);
        this.checkWinner();
      }
    } else {
      if (this.ball.x + this.ballRadius < 0) {
        this.aiScore++;
        this.updateHUD();
        audio.playPointScore();
        this.triggerParticles(0, this.ball.y, '#ff1744', 25);
        this.checkWinner();
      } else if (this.ball.x - this.ballRadius > this.width) {
        this.playerScore++;
        this.updateHUD();
        audio.playPointScore();
        this.triggerParticles(this.width, this.ball.y, '#ffeb3b', 25);
        this.checkWinner();
      }
    }

    // Particle decay update
    for (let i = this.particles.length - 1; i >= 0; i--) {
      this.particles[i].update();
      if (this.particles[i].life <= 0) this.particles.splice(i, 1);
    }
  }

  checkWinner() {
    if (this.playerScore >= CONFIG.winningScore || this.aiScore >= CONFIG.winningScore) {
      this.state = 'GAME_OVER';
      this.showGameOverModal();
    } else {
      this.startRound();
    }
  }

  showGameOverModal() {
    const titleEl = document.getElementById('gameover-title');
    const msgEl = document.getElementById('gameover-msg');
    const iconEl = document.getElementById('gameover-icon');
    document.getElementById('final-player-score').textContent = this.playerScore;
    document.getElementById('final-ai-score').textContent = this.aiScore;

    if (this.playerScore > this.aiScore) {
      iconEl.textContent = '🏆';
      titleEl.textContent = 'YOU WIN!';
      titleEl.style.color = '#ff4081';
      msgEl.textContent = 'Super Champion! You beat the Robot!';
      audio.playWinFanfare();
      this.startConfetti();
    } else {
      iconEl.textContent = '🌟';
      titleEl.textContent = 'NICE TRY!';
      titleEl.style.color = '#ff9800';
      msgEl.textContent = 'Great effort! Give it another shot!';
      audio.playLoseMelody();
    }

    this.gameoverModal.classList.remove('hidden');
  }

  startConfetti() {
    this.confettiCanvas.width = window.innerWidth;
    this.confettiCanvas.height = window.innerHeight;
    this.confettiList = [];
    for (let i = 0; i < 80; i++) {
      this.confettiList.push(new ConfettiParticle(this.confettiCanvas.width, this.confettiCanvas.height));
    }
  }

  render() {
    this.ctx.clearRect(0, 0, this.width, this.height);

    Renderer.drawTable(this.ctx, this.width, this.height, this.isVertical);
    Renderer.drawPaddle(this.ctx, this.player, true, this.selectedAvatar, this.paddleWidth, this.paddleHeight, this.isVertical);
    Renderer.drawPaddle(this.ctx, this.ai, false, this.selectedAvatar, this.paddleWidth, this.paddleHeight, this.isVertical);
    Renderer.drawBall(this.ctx, this.ball, this.ballRadius, this.ballTrail);

    this.particles.forEach(p => p.draw(this.ctx));

    if (this.state === 'GAME_OVER' && this.playerScore > this.aiScore) {
      this.confettiCtx.clearRect(0, 0, this.confettiCanvas.width, this.confettiCanvas.height);
      this.confettiList.forEach(c => {
        c.update(this.confettiCanvas.height);
        c.draw(this.confettiCtx);
      });
    }
  }

  loop() {
    this.update();
    this.render();
    requestAnimationFrame(this.loop);
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new PingPongGame();
});
