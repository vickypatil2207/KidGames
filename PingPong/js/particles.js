/**
 * 🏓 Particles - Particle Collision Effects & Confetti Physics
 */
class Particle {
  constructor(x, y, color) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.radius = Math.random() * 5 + 3;
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 6 + 2;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.life = 1.0;
    this.decay = Math.random() * 0.03 + 0.02;
    this.shape = Math.random() > 0.5 ? 'star' : 'circle';
  }

  update() {
    this.x += this.vx;
    this.y += this.vy;
    this.life -= this.decay;
  }

  draw(ctx) {
    if (this.life <= 0) return;
    ctx.save();
    ctx.globalAlpha = Math.max(0, this.life);
    ctx.fillStyle = this.color;

    if (this.shape === 'star') {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        ctx.lineTo(
          this.x + Math.cos((18 + i * 72) * Math.PI / 180) * this.radius,
          this.y + Math.sin((18 + i * 72) * Math.PI / 180) * this.radius
        );
        ctx.lineTo(
          this.x + Math.cos((54 + i * 72) * Math.PI / 180) * (this.radius / 2),
          this.y + Math.sin((54 + i * 72) * Math.PI / 180) * (this.radius / 2)
        );
      }
      ctx.closePath();
      ctx.fill();
    } else {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }
}

class ConfettiParticle {
  constructor(width, height) {
    this.x = Math.random() * width;
    this.y = Math.random() * height - height;
    this.size = Math.random() * 10 + 6;
    this.color = ['#ff4081', '#00e676', '#ffeb3b', '#00b0ff', '#ff9800', '#e040fb'][Math.floor(Math.random() * 6)];
    this.vx = Math.random() * 4 - 2;
    this.vy = Math.random() * 4 + 3;
    this.rotation = Math.random() * 360;
    this.rotSpeed = Math.random() * 10 - 5;
  }

  update(height) {
    this.x += this.vx;
    this.y += this.vy;
    this.rotation += this.rotSpeed;
    if (this.y > height) {
      this.y = -20;
      this.x = Math.random() * window.innerWidth;
    }
  }

  draw(ctx) {
    ctx.save();
    ctx.translate(this.x, this.y);
    ctx.rotate((this.rotation * Math.PI) / 180);
    ctx.fillStyle = this.color;
    ctx.fillRect(-this.size / 2, -this.size / 2, this.size, this.size);
    ctx.restore();
  }
}
