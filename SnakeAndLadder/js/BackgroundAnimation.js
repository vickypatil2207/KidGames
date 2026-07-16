/**
 * BackgroundAnimation.js
 * Canvas-based animated snakes slithering across the page background.
 *
 * Each snake is represented as a sequence of segments that follow a
 * smooth wandering path. They undulate continuously and never collide
 * with the UI (the canvas sits behind everything and is pointer-events:none).
 */
window.SL = window.SL || {};

window.SL.BackgroundAnimation = class BackgroundAnimation {
  /**
   * @param {HTMLCanvasElement} canvas
   * @param {object} [opts]
   */
  constructor(canvas, opts = {}) {
    this.canvas = canvas;
    this.ctx    = canvas.getContext('2d');

    this.snakes = [];
    this.dpr    = Math.max(1, window.devicePixelRatio || 1);

    this.opts = Object.assign({
      count: 7,
      minLength: 14,
      maxLength: 26,
      speed: 0.55,
      stars: 40,
    }, opts);

    this.stars = [];
    this._onResize = this._onResize.bind(this);
    window.addEventListener('resize', this._onResize);
    this._onResize();
    this._spawn();

    this._tick = this._tick.bind(this);
    requestAnimationFrame(this._tick);
  }

  _onResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;
    this.canvas.width  = w * this.dpr;
    this.canvas.height = h * this.dpr;
    this.canvas.style.width  = w + 'px';
    this.canvas.style.height = h + 'px';
    this.ctx.setTransform(this.dpr, 0, 0, this.dpr, 0, 0);
    this.width  = w;
    this.height = h;
    this._spawnStars();
  }

  _spawn() {
    const palette = [
      { body: '#3aa757', accent: '#ffe066' },
      { body: '#4ec5ff', accent: '#ffffff' },
      { body: '#b07cff', accent: '#ffd6f5' },
      { body: '#ff8a3d', accent: '#fff7e6' },
      { body: '#ff5d8f', accent: '#fff0c2' },
    ];
    for (let i = 0; i < this.opts.count; i++) {
      const length = this._rand(this.opts.minLength, this.opts.maxLength);
      const paletteChoice = palette[i % palette.length];
      const snake = {
        ...paletteChoice,
        length,
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        angle: Math.random() * Math.PI * 2,
        speed: this.opts.speed * (0.6 + Math.random() * 0.9),
        turn:  (Math.random() - 0.5) * 0.04,
        phase: Math.random() * Math.PI * 2,
        segments: Array.from({ length }, () => ({ x: 0, y: 0 })),
      };
      this.snakes.push(snake);
    }
    this._spawnStars();
  }

  _spawnStars() {
    this.stars = [];
    const colors = ['#fff', '#fff5b8', '#ffd6f5', '#c2e8ff'];
    for (let i = 0; i < (this.opts.stars || 40); i++) {
      this.stars.push({
        x: Math.random() * this.width,
        y: Math.random() * this.height,
        r: 0.6 + Math.random() * 1.6,
        phase: Math.random() * Math.PI * 2,
        speed: 0.04 + Math.random() * 0.05,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }
  }

  _rand(a, b) { return a + Math.random() * (b - a); }

  _tick() {
    this.ctx.clearRect(0, 0, this.width, this.height);
    this._drawStars();
    for (const snake of this.snakes) this._step(snake);
    this._drawAll();
    requestAnimationFrame(this._tick);
  }

  _drawStars() {
    const ctx = this.ctx;
    const t = performance.now() * 0.001;
    for (const s of this.stars) {
      const alpha = 0.4 + 0.6 * (0.5 + 0.5 * Math.sin(t * s.speed * 8 + s.phase));
      ctx.globalAlpha = alpha;
      ctx.fillStyle = s.color;
      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
  }

  _step(snake) {
    // Wander — slowly drift the heading, occasionally flip turn direction.
    snake.turn += (Math.random() - 0.5) * 0.005;
    snake.turn  = Math.max(-0.06, Math.min(0.06, snake.turn));
    snake.angle += snake.turn;

    snake.x += Math.cos(snake.angle) * snake.speed;
    snake.y += Math.sin(snake.angle) * snake.speed;

    // Wrap around the screen so snakes never leave the canvas.
    const margin = 80;
    if (snake.x < -margin) snake.x = this.width  + margin;
    if (snake.x > this.width  + margin) snake.x = -margin;
    if (snake.y < -margin) snake.y = this.height + margin;
    if (snake.y > this.height + margin) snake.y = -margin;

    snake.phase += 0.18;

    // Update segment positions, each one following the previous.
    const seg = snake.segments;
    seg[0].x = snake.x;
    seg[0].y = snake.y;
    for (let i = 1; i < seg.length; i++) {
      const prev = seg[i - 1];
      const cur  = seg[i];
      const dx   = cur.x - prev.x;
      const dy   = cur.y - prev.y;
      const dist = Math.hypot(dx, dy) || 1;
      const desired = 8; // spacing between segments
      cur.x = prev.x + (dx / dist) * desired;
      cur.y = prev.y + (dy / dist) * desired;
    }
  }

  _drawAll() {
    for (const snake of this.snakes) this._draw(snake);
  }

  _draw(snake) {
    const ctx = this.ctx;
    const seg = snake.segments;
    const amp = 6 + Math.sin(snake.phase) * 1.5;

    // Body: undulating bezier path between alternating offsets.
    ctx.beginPath();
    ctx.moveTo(seg[0].x, seg[0].y);
    for (let i = 1; i < seg.length - 1; i++) {
      const cur  = seg[i];
      const next = seg[i + 1];
      const mx = (cur.x + next.x) / 2;
      const my = (cur.y + next.y) / 2;
      const ox = -Math.sin(snake.angle + i * 0.5) * amp;
      const oy =  Math.cos(snake.angle + i * 0.5) * amp;
      ctx.quadraticCurveTo(cur.x + ox, cur.y + oy, mx, my);
    }
    ctx.lineWidth = 9;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = snake.body;
    ctx.stroke();

    // Stripes on the body for that classic snake look.
    ctx.lineWidth = 1.4;
    ctx.strokeStyle = snake.accent;
    ctx.setLineDash([6, 8]);
    ctx.stroke();
    ctx.setLineDash([]);

    // Eyes on the head.
    const head = seg[0];
    const eyeOffset = 4;
    const ex = -Math.sin(snake.angle) * eyeOffset;
    const ey =  Math.cos(snake.angle) * eyeOffset;
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    ctx.arc(head.x + ex + Math.cos(snake.angle) * 2, head.y + ey + Math.sin(snake.angle) * 2, 1.8, 0, Math.PI * 2);
    ctx.arc(head.x + ex - Math.cos(snake.angle) * 2, head.y + ey - Math.sin(snake.angle) * 2, 1.8, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#2b2540';
    ctx.beginPath();
    ctx.arc(head.x + ex + Math.cos(snake.angle) * 2.2, head.y + ey + Math.sin(snake.angle) * 2.2, 0.9, 0, Math.PI * 2);
    ctx.arc(head.x + ex - Math.cos(snake.angle) * 2.2, head.y + ey - Math.sin(snake.angle) * 2.2, 0.9, 0, Math.PI * 2);
    ctx.fill();
  }

  destroy() {
    window.removeEventListener('resize', this._onResize);
  }
};
