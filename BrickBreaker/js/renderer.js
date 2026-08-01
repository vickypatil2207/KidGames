/**
 * 🎨 Renderer - Canvas Rendering Engine
 */
class Renderer {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = 800;
    this.height = 600;
  }

  clear() {
    this.ctx.clearRect(0, 0, this.width, this.height);
  }

  drawBricks(bricks) {
    bricks.forEach(b => {
      if (b.hp <= 0) return;
      this.ctx.save();

      this.ctx.fillStyle = b.color;
      this.ctx.beginPath();
      this.ctx.roundRect(b.x, b.y, b.w, b.h, 6);
      this.ctx.fill();

      this.ctx.fillStyle = 'rgba(255, 255, 255, 0.25)';
      this.ctx.beginPath();
      this.ctx.roundRect(b.x + 2, b.y + 2, b.w - 4, b.h / 2 - 2, 4);
      this.ctx.fill();

      if (b.type === 'explosive') {
        this.ctx.fillStyle = '#fff';
        this.ctx.font = '12px sans-serif';
        this.ctx.fillText('💣', b.x + b.w / 2 - 6, b.y + b.h / 2 + 4);
      } else if (b.type === 'stone') {
        this.ctx.fillStyle = '#475569';
        this.ctx.fillRect(b.x + 4, b.y + 4, b.w - 8, b.h - 8);
      } else if (b.hp < b.maxHp && b.maxHp > 1) {
        this.ctx.strokeStyle = 'rgba(0,0,0,0.5)';
        this.ctx.lineWidth = 2;
        this.ctx.beginPath();
        this.ctx.moveTo(b.x + 5, b.y + 5);
        this.ctx.lineTo(b.x + b.w - 5, b.y + b.h - 5);
        this.ctx.stroke();
      }

      this.ctx.restore();
    });
  }

  drawPowerups(powerups) {
    powerups.forEach(p => {
      this.ctx.save();
      let icon = '⭐';
      let color = '#fbbf24';
      if (p.type === 'wide') { icon = '↔️'; color = '#38bdf8'; }
      else if (p.type === 'multiball') { icon = '⚽'; color = '#4ade80'; }
      else if (p.type === 'slow') { icon = '🐢'; color = '#a7f3d0'; }
      else if (p.type === 'life') { icon = '💖'; color = '#f472b6'; }
      else if (p.type === 'laser') { icon = '⚡'; color = '#f59e0b'; }
      else if (p.type === 'sticky') { icon = '🧲'; color = '#c084fc'; }
      else if (p.type === 'fireball') { icon = '🔥'; color = '#ef4444'; }

      this.ctx.fillStyle = color;
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
      this.ctx.fill();

      this.ctx.font = '12px sans-serif';
      this.ctx.fillText(icon, p.x - 7, p.y + 4);
      this.ctx.restore();
    });
  }

  drawLasers(lasers) {
    lasers.forEach(l => {
      this.ctx.fillStyle = '#ef4444';
      this.ctx.shadowColor = '#ef4444';
      this.ctx.shadowBlur = 10;
      this.ctx.fillRect(l.x, l.y, l.w, l.h);
      this.ctx.shadowBlur = 0;
    });
  }

  drawPaddle(paddle, hero, isLaserActive) {
    this.ctx.save();
    let pGrad = this.ctx.createLinearGradient(paddle.x, 0, paddle.x + paddle.width, 0);
    if (hero === 'kitty') { pGrad.addColorStop(0, '#f472b6'); pGrad.addColorStop(1, '#db2777'); }
    else if (hero === 'rocket') { pGrad.addColorStop(0, '#38bdf8'); pGrad.addColorStop(1, '#0284c7'); }
    else if (hero === 'unicorn') { pGrad.addColorStop(0, '#c084fc'); pGrad.addColorStop(1, '#9333ea'); }
    else { pGrad.addColorStop(0, '#fbbf24'); pGrad.addColorStop(1, '#d97706'); }

    this.ctx.fillStyle = pGrad;
    this.ctx.beginPath();
    this.ctx.roundRect(paddle.x, paddle.y, paddle.width, paddle.height, 10);
    this.ctx.fill();

    if (isLaserActive) {
      this.ctx.fillStyle = '#ef4444';
      this.ctx.fillRect(paddle.x + 10, paddle.y - 6, 8, 6);
      this.ctx.fillRect(paddle.x + paddle.width - 18, paddle.y - 6, 8, 6);
    }
    this.ctx.restore();
  }

  drawBalls(balls, isFireballActive) {
    balls.forEach(b => {
      this.ctx.save();
      this.ctx.fillStyle = isFireballActive ? '#ef4444' : '#ffffff';
      this.ctx.shadowColor = isFireballActive ? '#ef4444' : '#38bdf8';
      this.ctx.shadowBlur = 12;

      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
      this.ctx.fill();
      this.ctx.restore();
    });
  }
}
