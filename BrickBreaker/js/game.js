/**
 * 🧱 Super Brick Breaker Kids - Core Game Controller & Physics Engine
 */
class BrickBreakerGame {
  constructor() {
    this.canvas = document.getElementById('game-canvas');
    this.renderer = new Renderer(this.canvas);

    // State variables
    this.currentLevel = 1;
    this.score = 0;
    this.lives = 3;
    this.highScore = parseInt(localStorage.getItem('bb_highScore') || '0', 10);
    this.unlockedLevel = parseInt(localStorage.getItem('bb_unlockedLevel') || '1', 10);
    this.hero = 'kitty';

    this.gameState = 'MENU'; // MENU, PLAYING, PAUSED, LEVEL_WIN, GAME_OVER
    this.ballStuckToPaddle = true;

    // Paddle state with smooth physics
    this.paddle = {
      x: 340,
      y: 550,
      width: 120,
      height: 18,
      vx: 0,
      maxSpeed: 10,
      accel: 1.6,
      friction: 0.82
    };

    this.targetMouseX = 340 + 60; // Center mouse initial
    this.isMouseMoving = false;

    // Game Entities
    this.balls = [];
    this.bricks = [];
    this.powerups = [];
    this.lasers = [];

    // Keys
    this.keys = { left: false, right: false, space: false };

    // Game Loop Timing (60 FPS Cap & Smooth Delta)
    this.lastTime = performance.now();

    this.setupEventListeners();
    uiManager.renderLevelsGrid(this.unlockedLevel, (lvl) => this.selectLevel(lvl));
    this.resizeCanvas();

    // Start Loop
    requestAnimationFrame((t) => this.gameLoop(t));
  }

  resizeCanvas() {
    const parent = this.canvas.parentElement;
    if (!parent) return;
    const parentWidth = parent.clientWidth;
    const parentHeight = parent.clientHeight;
    if (parentWidth <= 0 || parentHeight <= 0) return;

    // Fixed virtual width 800, dynamic height matching full container aspect ratio
    const virtualWidth = 800;
    const virtualHeight = Math.max(600, Math.round(virtualWidth * (parentHeight / parentWidth)));

    this.renderer.width = virtualWidth;
    this.renderer.height = virtualHeight;
    this.canvas.width = virtualWidth;
    this.canvas.height = virtualHeight;

    this.canvas.style.width = '100%';
    this.canvas.style.height = '100%';

    // Keep paddle anchored 50px above bottom edge
    this.paddle.y = virtualHeight - 50;

    // If ball is stuck to paddle, adjust its position accordingly
    if (this.ballStuckToPaddle && this.balls && this.balls.length > 0) {
      this.balls[0].y = this.paddle.y - 14;
    }

    // Rebuild bricks layout for active game so brick grid scales with canvas height
    if (this.gameState === 'PLAYING' && this.bricks && this.currentLevel) {
      this.bricks = levelManager.buildBricksForLevel(this.currentLevel, virtualWidth, virtualHeight);
    }
  }

  toggleFullscreen() {
    const wrapper = document.getElementById('game-wrapper');
    if (!document.fullscreenElement && !document.webkitFullscreenElement) {
      if (wrapper.requestFullscreen) {
        wrapper.requestFullscreen().catch(() => {});
      } else if (wrapper.webkitRequestFullscreen) {
        wrapper.webkitRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      }
    }
  }

  selectLevel(levelNum) {
    if (document.activeElement) document.activeElement.blur();
    document.getElementById('level-modal').classList.add('hidden');
    document.getElementById('start-modal').classList.add('hidden');
    this.score = 0;
    this.lives = 3;
    this.startLevel(levelNum);
  }

  getBallSpeed(levelNum = this.currentLevel) {
    const baseSpeed = 5.8 + Math.floor(levelNum / 4) * 0.4;
    const heightRatio = (this.renderer ? this.renderer.height : 600) / 600;
    return baseSpeed * Math.pow(heightRatio, 0.65);
  }

  startLevel(levelNum) {
    this.currentLevel = levelNum;
    this.gameState = 'PLAYING';
    this.ballStuckToPaddle = true;

    this.paddle.width = 120;
    this.paddle.y = this.renderer.height - 50;
    this.paddle.x = (this.renderer.width - this.paddle.width) / 2;
    this.paddle.vx = 0;
    this.targetMouseX = this.paddle.x + this.paddle.width / 2;
    this.isMouseMoving = false;

    powerupManager.reset();
    particleEngine.reset();
    this.powerups = [];
    this.lasers = [];

    const ballSpeed = this.getBallSpeed(levelNum);
    this.balls = [{
      x: this.paddle.x + this.paddle.width / 2,
      y: this.paddle.y - 14,
      radius: 9,
      speed: ballSpeed,
      dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1) * 0.7,
      dy: -ballSpeed
    }];

    this.bricks = levelManager.buildBricksForLevel(levelNum, this.renderer.width, this.renderer.height);
    uiManager.updateHUD(this.currentLevel, this.score, this.lives);
  }

  launchBall() {
    if (this.gameState !== 'PLAYING') return;
    
    if (this.ballStuckToPaddle) {
      this.ballStuckToPaddle = false;
      
      const ballSpeed = this.getBallSpeed(this.currentLevel);
      if (this.balls.length === 0) {
        this.balls = [{
          x: this.paddle.x + this.paddle.width / 2,
          y: this.paddle.y - 14,
          radius: 9,
          speed: ballSpeed,
          dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1) * 0.7,
          dy: -ballSpeed
        }];
      } else {
        const b = this.balls[0];
        b.x = this.paddle.x + this.paddle.width / 2;
        b.y = this.paddle.y - 14;
        b.dy = -Math.abs(ballSpeed);
        if (Math.abs(b.dx) < 1) b.dx = (Math.random() > 0.5 ? 1 : -1) * 3;
      }
      sound.playPaddleHit();
    }
  }

  fireLaser() {
    if (powerupManager.activePowerups.laser > 0 && this.gameState === 'PLAYING') {
      sound.playLaser();
      this.lasers.push({ x: this.paddle.x + 15, y: this.paddle.y, w: 4, h: 14, speed: 11 });
      this.lasers.push({ x: this.paddle.x + this.paddle.width - 19, y: this.paddle.y, w: 4, h: 14, speed: 11 });
    }
  }

  explodeBrick(brick) {
    sound.playExplosion();
    particleEngine.spawn(brick.x + brick.w / 2, brick.y + brick.h / 2, '#ef4444', 20);

    this.bricks.forEach(b => {
      if (b.hp < 999 && Math.hypot((b.x + b.w / 2) - (brick.x + brick.w / 2), (b.y + b.h / 2) - (brick.y + brick.h / 2)) < 85) {
        b.hp = 0;
        this.score += 20;
      }
    });
  }

  update(dt) {
    if (this.gameState !== 'PLAYING') return;

    powerupManager.updateTimers(this.paddle);

    // Smooth Paddle Physics (Keyboard + Mouse Lerp)
    if (this.keys.left) {
      this.paddle.vx -= this.paddle.accel;
      this.isMouseMoving = false;
    }
    if (this.keys.right) {
      this.paddle.vx += this.paddle.accel;
      this.isMouseMoving = false;
    }

    if (this.isMouseMoving) {
      // Smooth lerp mouse positioning
      const targetX = this.targetMouseX - this.paddle.width / 2;
      this.paddle.x += (targetX - this.paddle.x) * 0.4;
    } else {
      // Velocity + friction for keyboard
      this.paddle.vx *= this.paddle.friction;
      this.paddle.x += this.paddle.vx;
    }

    // Boundary clamp
    this.paddle.x = Math.max(0, Math.min(this.renderer.width - this.paddle.width, this.paddle.x));

    // Keep ball glued to paddle when stuck
    if (this.ballStuckToPaddle && this.balls.length > 0) {
      this.balls[0].x = this.paddle.x + this.paddle.width / 2;
      this.balls[0].y = this.paddle.y - 14;
    }

    // Moving Bricks update
    this.bricks.forEach(b => {
      if (b.isMoving) {
        b.x += b.moveDx;
        if (Math.abs(b.x - b.initialX) > 60 || b.x < 10 || b.x + b.w > this.renderer.width - 10) {
          b.moveDx *= -1;
        }
      }
    });

    // Lasers update
    for (let i = this.lasers.length - 1; i >= 0; i--) {
      const l = this.lasers[i];
      l.y -= l.speed;
      
      for (let j = 0; j < this.bricks.length; j++) {
        const b = this.bricks[j];
        if (b.hp > 0 && l.x > b.x && l.x < b.x + b.w && l.y > b.y && l.y < b.y + b.h) {
          if (b.hp < 999) {
            b.hp--;
            this.score += 10;
            particleEngine.spawn(l.x, l.y, '#f59e0b', 4);
            if (b.hp <= 0) {
              powerupManager.spawnPowerup(this.powerups, b.x + b.w / 2, b.y + b.h / 2, this.getBallSpeed());
              if (b.type === 'explosive') this.explodeBrick(b);
            }
          }
          this.lasers.splice(i, 1);
          break;
        }
      }
      if (l.y < 0) this.lasers.splice(i, 1);
    }

    // Powerups update
    for (let i = this.powerups.length - 1; i >= 0; i--) {
      const p = this.powerups[i];
      p.y += p.speed;

      if (p.y + p.radius >= this.paddle.y && 
          p.x >= this.paddle.x && p.x <= this.paddle.x + this.paddle.width) {
        powerupManager.applyPowerup(p.type, this);
        this.powerups.splice(i, 1);
      } else if (p.y > this.renderer.height) {
        this.powerups.splice(i, 1);
      }
    }

    // Particles update
    particleEngine.update();

    // Balls Physics & Collisions
    if (!this.ballStuckToPaddle) {
      const isSlow = powerupManager.activePowerups.slow > 0;
      const slowMult = isSlow ? 0.65 : 1.0;

      for (let i = this.balls.length - 1; i >= 0; i--) {
        const ball = this.balls[i];
        ball.x += ball.dx * slowMult;
        ball.y += ball.dy * slowMult;

        // Wall collisions
        if (ball.x - ball.radius < 0) { ball.x = ball.radius; ball.dx *= -1; sound.playWallHit(); }
        if (ball.x + ball.radius > this.renderer.width) { ball.x = this.renderer.width - ball.radius; ball.dx *= -1; sound.playWallHit(); }
        if (ball.y - ball.radius < 0) { ball.y = ball.radius; ball.dy *= -1; sound.playWallHit(); }

        // Paddle collision
        if (ball.dy > 0 && 
            ball.y + ball.radius >= this.paddle.y && 
            ball.y - ball.radius <= this.paddle.y + this.paddle.height &&
            ball.x >= this.paddle.x - 5 && ball.x <= this.paddle.x + this.paddle.width + 5) {
          
          sound.playPaddleHit();

          if (powerupManager.activePowerups.sticky > 0) {
            this.ballStuckToPaddle = true;
          } else {
            const hitPos = (ball.x - (this.paddle.x + this.paddle.width / 2)) / (this.paddle.width / 2);
            const angle = hitPos * (Math.PI / 3);
            const speed = Math.hypot(ball.dx, ball.dy);
            ball.dx = speed * Math.sin(angle);
            ball.dy = -speed * Math.cos(angle);
          }
        }

        // Brick collision
        for (let j = 0; j < this.bricks.length; j++) {
          const b = this.bricks[j];
          if (b.hp <= 0) continue;

          if (ball.x + ball.radius > b.x && ball.x - ball.radius < b.x + b.w &&
              ball.y + ball.radius > b.y && ball.y - ball.radius < b.y + b.h) {

            const isFireball = powerupManager.activePowerups.fireball > 0;
            
            if (b.hp < 999) {
              b.hp--;
              this.score += 15;
              particleEngine.spawn(ball.x, ball.y, b.color, 6);

              if (b.type === 'silver') sound.playSilverHit();
              else if (b.type === 'gold') sound.playGoldHit();
              else sound.playBrickHit();

              if (b.hp <= 0) {
                powerupManager.spawnPowerup(this.powerups, b.x + b.w / 2, b.y + b.h / 2, this.getBallSpeed());
                if (b.type === 'explosive') this.explodeBrick(b);
              }
            } else {
              sound.playWallHit();
            }

            if (!isFireball || b.type === 'stone') {
              const overlapLeft = (ball.x + ball.radius) - b.x;
              const overlapRight = (b.x + b.w) - (ball.x - ball.radius);
              const overlapTop = (ball.y + ball.radius) - b.y;
              const overlapBottom = (b.y + b.h) - (ball.y - ball.radius);

              const minOverlap = Math.min(overlapLeft, overlapRight, overlapTop, overlapBottom);
              if (minOverlap === overlapLeft || minOverlap === overlapRight) ball.dx *= -1;
              else ball.dy *= -1;
            }
            break;
          }
        }

        // Offscreen ball check
        if (ball.y - ball.radius > this.renderer.height) {
          this.balls.splice(i, 1);
        }
      }

      // Lose Life Condition
      if (this.balls.length === 0) {
        this.lives--;
        sound.playLoseLife();
        uiManager.updateHUD(this.currentLevel, this.score, this.lives);

        if (this.lives <= 0) {
          this.triggerGameOver();
        } else {
          // Prepare next ball on paddle
          this.ballStuckToPaddle = true;
          const ballSpeed = this.getBallSpeed(this.currentLevel);
          this.balls = [{
            x: this.paddle.x + this.paddle.width / 2,
            y: this.paddle.y - 14,
            radius: 9,
            speed: ballSpeed,
            dx: ballSpeed * (Math.random() > 0.5 ? 1 : -1) * 0.7,
            dy: -ballSpeed
          }];
        }
      }
    }

    // Check Win condition
    const remainingDestructible = this.bricks.filter(b => b.hp > 0 && b.hp < 999).length;
    if (remainingDestructible === 0) {
      this.triggerLevelWin();
    }

    uiManager.updateHUD(this.currentLevel, this.score, this.lives);
  }

  triggerLevelWin() {
    this.gameState = 'LEVEL_WIN';
    sound.playLevelWin();

    if (this.currentLevel >= this.unlockedLevel && this.currentLevel < 25) {
      this.unlockedLevel = this.currentLevel + 1;
      localStorage.setItem('bb_unlockedLevel', this.unlockedLevel);
    }

    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('bb_highScore', this.highScore);
    }

    uiManager.showWinModal(this.score, this.highScore);
    uiManager.renderLevelsGrid(this.unlockedLevel, (lvl) => this.selectLevel(lvl));
  }

  triggerGameOver() {
    this.gameState = 'GAME_OVER';
    if (this.score > this.highScore) {
      this.highScore = this.score;
      localStorage.setItem('bb_highScore', this.highScore);
    }
    uiManager.showGameOverModal(this.score);
  }

  draw() {
    this.renderer.clear();
    this.renderer.drawBricks(this.bricks);
    this.renderer.drawPowerups(this.powerups);
    this.renderer.drawLasers(this.lasers);
    particleEngine.draw(this.renderer.ctx);
    this.renderer.drawPaddle(this.paddle, this.hero, powerupManager.activePowerups.laser > 0);
    this.renderer.drawBalls(this.balls, powerupManager.activePowerups.fireball > 0);
  }

  gameLoop(timestamp) {
    const dt = Math.min(timestamp - this.lastTime, 50); // cap max step delta
    this.lastTime = timestamp;

    this.update(dt);
    this.draw();

    requestAnimationFrame((t) => this.gameLoop(t));
  }

  setupEventListeners() {
    sound.init();

    // Mouse / Pointer Move over entire window for smooth responsiveness
    window.addEventListener('pointermove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.renderer.width / rect.width;
      this.targetMouseX = (e.clientX - rect.left) * scaleX;
      this.isMouseMoving = true;
    });

    // Touch controls directly on game canvas
    const handleTouch = (e) => {
      if (e.touches && e.touches.length > 0) {
        const touch = e.touches[0];
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.renderer.width / rect.width;
        this.targetMouseX = (touch.clientX - rect.left) * scaleX;
        this.isMouseMoving = true;
      }
    };

    this.canvas.addEventListener('touchstart', (e) => {
      if (this.gameState === 'PLAYING') e.preventDefault();
      handleTouch(e);
    }, { passive: false });

    this.canvas.addEventListener('touchmove', (e) => {
      if (this.gameState === 'PLAYING') e.preventDefault();
      handleTouch(e);
    }, { passive: false });

    // Global Pointerdown / Click anywhere to launch ball & fire laser (ignoring buttons)
    document.addEventListener('pointerdown', (e) => {
      if (e.target && (e.target.tagName === 'BUTTON' || e.target.closest('button') || e.target.closest('.modal-card'))) {
        return; // Ignore clicks inside UI buttons/modals
      }
      if (document.activeElement) document.activeElement.blur();
      sound.init();
      this.launchBall();
      this.fireLaser();
    });

    // Keyboard Controls
    window.addEventListener('keydown', (e) => {
      sound.init();
      if (['ArrowLeft', 'ArrowRight', 'Space', ' ', 'a', 'A', 'd', 'D'].includes(e.key) || e.code === 'Space') {
        if (e.key === ' ' || e.code === 'Space' || e.key.startsWith('Arrow')) {
          e.preventDefault();
        }
      }
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = true;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = true;
      if ((e.key === ' ' || e.code === 'Space') && !e.repeat) {
        this.keys.space = true;
        this.launchBall();
        this.fireLaser();
      }
    });

    window.addEventListener('keyup', (e) => {
      if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') this.keys.left = false;
      if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') this.keys.right = false;
      if (e.key === ' ' || e.code === 'Space') this.keys.space = false;
    });

    // Mobile Control Buttons
    const btnLeft = document.getElementById('btn-left');
    const btnRight = document.getElementById('btn-right');
    const btnAction = document.getElementById('btn-action');

    const addHoldListeners = (btn, onStart, onEnd) => {
      btn.addEventListener('touchstart', (e) => { e.preventDefault(); onStart(); }, { passive: false });
      btn.addEventListener('touchend', (e) => { e.preventDefault(); onEnd(); }, { passive: false });
      btn.addEventListener('mousedown', (e) => { e.preventDefault(); onStart(); });
      btn.addEventListener('mouseup', (e) => { e.preventDefault(); onEnd(); });
      btn.addEventListener('mouseleave', (e) => { e.preventDefault(); onEnd(); });
    };

    if (btnLeft) addHoldListeners(btnLeft, () => { this.keys.left = true; }, () => { this.keys.left = false; });
    if (btnRight) addHoldListeners(btnRight, () => { this.keys.right = true; }, () => { this.keys.right = false; });
    
    if (btnAction) {
      const handleAction = (e) => {
        if (e.cancelable) e.preventDefault();
        if (e.target) e.target.blur();
        sound.init();
        this.launchBall();
        this.fireLaser();
      };
      btnAction.addEventListener('touchstart', handleAction, { passive: false });
      btnAction.addEventListener('click', handleAction);
    }

    // Fullscreen Toggle
    const fsBtn = document.getElementById('fullscreen-btn');
    if (fsBtn) {
      fsBtn.onclick = (e) => {
        if (e.target) e.target.blur();
        this.toggleFullscreen();
      };
    }

    const onFullscreenChange = () => {
      const isFull = !!(document.fullscreenElement || document.webkitFullscreenElement);
      if (fsBtn) fsBtn.textContent = isFull ? '🗗' : '⛶';
      this.resizeCanvas();
    };

    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);

    // Hero Selection Cards
    document.querySelectorAll('.hero-card').forEach(card => {
      card.onclick = () => {
        document.querySelectorAll('.hero-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        this.hero = card.dataset.hero;
      };
    });

    // Modal Action Buttons
    document.getElementById('btn-play-start').onclick = (e) => {
      if (e.target) e.target.blur();
      document.getElementById('start-modal').classList.add('hidden');
      this.score = 0;
      this.lives = 3;
      this.startLevel(1);
    };

    document.getElementById('btn-open-levels').onclick = (e) => {
      if (e.target) e.target.blur();
      document.getElementById('level-modal').classList.remove('hidden');
    };

    document.getElementById('btn-close-levels').onclick = (e) => {
      if (e.target) e.target.blur();
      document.getElementById('level-modal').classList.add('hidden');
    };

    document.getElementById('btn-replay-level').onclick = (e) => {
      if (e.target) e.target.blur();
      document.getElementById('win-modal').classList.add('hidden');
      this.startLevel(this.currentLevel);
    };

    document.getElementById('btn-next-level').onclick = (e) => {
      if (e.target) e.target.blur();
      document.getElementById('win-modal').classList.add('hidden');
      const nextLvl = Math.min(this.currentLevel + 1, 25);
      this.startLevel(nextLvl);
    };

    document.getElementById('btn-retry-gameover').onclick = (e) => {
      if (e.target) e.target.blur();
      document.getElementById('gameover-modal').classList.add('hidden');
      this.score = 0;
      this.lives = 3;
      this.startLevel(this.currentLevel);
    };

    document.getElementById('btn-menu-gameover').onclick = (e) => {
      if (e.target) e.target.blur();
      document.getElementById('gameover-modal').classList.add('hidden');
      document.getElementById('start-modal').classList.remove('hidden');
    };

    document.getElementById('sound-btn').onclick = (e) => {
      if (e.target) e.target.blur();
      sound.muted = !sound.muted;
      document.getElementById('sound-btn').textContent = sound.muted ? '🔇' : '🔊';
    };

    document.getElementById('pause-btn').onclick = (e) => {
      if (e.target) e.target.blur();
      if (this.gameState === 'PLAYING') this.gameState = 'PAUSED';
      else if (this.gameState === 'PAUSED') this.gameState = 'PLAYING';
    };

    window.addEventListener('resize', () => this.resizeCanvas());
    window.addEventListener('orientationchange', () => setTimeout(() => this.resizeCanvas(), 150));
  }
}

window.addEventListener('load', () => {
  window.game = new BrickBreakerGame();
});
