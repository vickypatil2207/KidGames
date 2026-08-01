/**
 * ✨ ParticleEngine - Visual explosions and particle effects with performance caps
 */
class ParticleEngine {
  constructor() {
    this.particles = [];
    this.maxParticles = 120; // Hard cap to prevent lag/memory leaks
  }

  reset() {
    this.particles = [];
  }

  spawn(x, y, color, count = 8) {
    // If over capacity, remove oldest particles
    if (this.particles.length + count > this.maxParticles) {
      this.particles.splice(0, count);
    }

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 4 + 1;
      this.particles.push({
        x: x, y: y,
        dx: Math.cos(angle) * speed,
        dy: Math.sin(angle) * speed,
        radius: Math.random() * 3 + 2,
        color: color,
        life: 25
      });
    }
  }

  update() {
    for (let i = this.particles.length - 1; i >= 0; i--) {
      const pt = this.particles[i];
      pt.x += pt.dx;
      pt.y += pt.dy;
      pt.life--;
      if (pt.life <= 0) this.particles.splice(i, 1);
    }
  }

  draw(ctx) {
    ctx.save();
    this.particles.forEach(pt => {
      ctx.fillStyle = pt.color;
      ctx.globalAlpha = Math.max(0, pt.life / 25);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
    });
    ctx.restore();
  }
}

const particleEngine = new ParticleEngine();
