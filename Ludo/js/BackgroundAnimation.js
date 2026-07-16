/**
 * BackgroundAnimation.js
 * Canvas-based background animation for Ludo party edition.
 * Renders twinkling stars and floating pastel bubbles.
 */
class BackgroundAnimation {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.bubbles = [];
    this.stars = [];
    this.dpr = Math.max(1, window.devicePixelRatio || 1);
    this.isRunning = true;

    this.palette = [
      'rgba(255, 93, 143, 0.15)',  // Red base translucent
      'rgba(126, 217, 87, 0.15)',  // Green base translucent
      'rgba(255, 185, 56, 0.15)',  // Yellow base translucent
      'rgba(78, 197, 255, 0.15)',  // Blue base translucent
      'rgba(176, 124, 255, 0.12)'  // Violet translucent
    ];

    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
    this._onResize();
    this._spawnBubbles(20);
    this._spawnStars(50);

    this._tick = this._tick.bind(this);
    requestAnimationFrame(this._tick);
  }

  _onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.canvas.style.width = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.width = w;
    this.height = h;
  }

  _spawnBubbles(count) {
    this.bubbles = [];
    for (let i = 0; i < count; i++) {
      this.bubbles.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: 15 + Math.random() * 40,
        vx: (Math.random() - 0.5) * 0.4,
        vy: -0.15 - Math.random() * 0.4, // float upwards
        color: this.palette[Math.floor(Math.random() * this.palette.length)],
        phase: Math.random() * Math.PI * 2,
        speed: 0.005 + Math.random() * 0.01
      });
    }
  }

  _spawnStars(count) {
    this.stars = [];
    const colors = ['#ffffff', '#fff5b8', '#ffd6f5', '#c2e8ff'];
    for (let i = 0; i < count; i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: 0.6 + Math.random() * 1.5,
        phase: Math.random() * Math.PI * 2,
        speed: 0.04 + Math.random() * 0.04,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }
  }

  _tick() {
    if (!this.isRunning) return;

    this.ctx.clearRect(0, 0, this.width, this.height);

    // Draw stars
    const time = performance.now() * 0.001;
    for (const s of this.stars) {
      const alpha = 0.3 + 0.7 * (0.5 + 0.5 * Math.sin(time * s.speed * 8 + s.phase));
      this.ctx.globalAlpha = alpha;
      this.ctx.fillStyle = s.color;
      this.ctx.beginPath();
      this.ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      this.ctx.fill();
    }

    // Draw bubbles
    this.ctx.globalAlpha = 1;
    for (const b of this.bubbles) {
      // Slow float
      b.x += b.vx;
      b.y += b.vy;

      // Wrap-around
      if (b.y + b.r < 0) {
        b.y = this.height + b.r;
        b.x = Math.random() * this.width;
      }
      if (b.x + b.r < 0) b.x = this.width + b.r;
      if (b.x - b.r > this.width) b.x = -b.r;

      // Add a subtle wobble
      const wobble = Math.sin(time * 0.5 + b.phase) * 0.05;
      b.x += wobble;

      this.ctx.fillStyle = b.color;
      this.ctx.beginPath();
      this.ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2);
      this.ctx.fill();

      // Bubble highlights
      this.ctx.fillStyle = 'rgba(255,255,255,0.2)';
      this.ctx.beginPath();
      this.ctx.arc(b.x - b.r * 0.3, b.y - b.r * 0.3, b.r * 0.2, 0, Math.PI * 2);
      this.ctx.fill();
    }

    requestAnimationFrame(this._tick);
  }

  destroy() {
    this.isRunning = false;
    window.removeEventListener('resize', this._onResize);
  }
}
