/**
 * ⚡ PowerupManager - Powerup drops, timers, and active bonuses
 */
class PowerupManager {
  constructor() {
    this.activePowerups = { wide: 0, laser: 0, sticky: 0, fireball: 0, slow: 0 };
  }

  reset() {
    this.activePowerups = { wide: 0, laser: 0, sticky: 0, fireball: 0, slow: 0 };
  }

  spawnPowerup(powerupsArray, x, y) {
    if (Math.random() < 0.28) {
      const types = ['wide', 'multiball', 'slow', 'life', 'laser', 'sticky', 'fireball'];
      const type = types[Math.floor(Math.random() * types.length)];
      powerupsArray.push({ x: x, y: y, radius: 12, type: type, speed: 2.2 });
    }
  }

  applyPowerup(type, game) {
    sound.playPowerup();
    if (type === 'wide') {
      this.activePowerups.wide = 600;
      game.paddle.width = 170;
      uiManager.showToast('↔️ WIDE PADDLE!');
    } else if (type === 'multiball') {
      uiManager.showToast('⚽⚽ MULTI-BALL!');
      const baseBall = game.balls[0] || { x: game.paddle.x + 50, y: 400, speed: 5 };
      game.balls.push({ x: baseBall.x, y: baseBall.y, radius: 9, speed: baseBall.speed, dx: -4, dy: -5 });
      game.balls.push({ x: baseBall.x, y: baseBall.y, radius: 9, speed: baseBall.speed, dx: 4, dy: -4 });
    } else if (type === 'slow') {
      this.activePowerups.slow = 480;
      uiManager.showToast('🐢 SLOW MOTION!');
    } else if (type === 'life') {
      game.lives = Math.min(game.lives + 1, 5);
      uiManager.showToast('💖 EXTRA LIFE!');
      uiManager.updateHUD(game.currentLevel, game.score, game.lives);
    } else if (type === 'laser') {
      this.activePowerups.laser = 500;
      uiManager.showToast('⚡ LASER GUN! (Press Space)');
    } else if (type === 'sticky') {
      this.activePowerups.sticky = 500;
      uiManager.showToast('🧲 STICKY MAGNET!');
    } else if (type === 'fireball') {
      this.activePowerups.fireball = 400;
      uiManager.showToast('🔥 FIREBALL!');
    }
  }

  updateTimers(paddle) {
    for (let p in this.activePowerups) {
      if (this.activePowerups[p] > 0) {
        this.activePowerups[p]--;
        if (this.activePowerups[p] === 0 && p === 'wide') {
          paddle.width = 120;
        }
      }
    }
  }
}

const powerupManager = new PowerupManager();
