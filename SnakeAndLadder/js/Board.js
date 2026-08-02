/**
 * board.js
 * Manages 10x10 zigzag grid layout, coordinate translation,
 * and SVG rendering of kid-friendly cartoon snakes and 3D wooden ladders.
 */
window.SL = window.SL || {};

window.SL.Board = class Board {
  constructor(container) {
    this.container = container;
    this.size = 10; // 10x10 grid
    this.cells = {}; // Map cell number -> DOM element

    // Ladders: { start, end, color }
    this.ladders = [
      { start: 4,  end: 25, color: '#f59e0b' },
      { start: 13, end: 46, color: '#10b981' },
      { start: 28, end: 76, color: '#8b5cf6' },
      { start: 42, end: 63, color: '#ec4899' },
      { start: 50, end: 69, color: '#06b6d4' },
      { start: 62, end: 81, color: '#f97316' },
      { start: 74, end: 92, color: '#14b8a6' }
    ];

    // Snakes: { head, tail, color, spotColor }
    this.snakes = [
      { head: 27, tail: 5,  color: '#22c55e', spotColor: '#15803d' },
      { head: 43, tail: 18, color: '#f97316', spotColor: '#c2410c' },
      { head: 54, tail: 31, color: '#a855f7', spotColor: '#6b21a8' },
      { head: 66, tail: 45, color: '#eab308', spotColor: '#a16207' },
      { head: 89, tail: 53, color: '#ef4444', spotColor: '#991b1b' },
      { head: 95, tail: 77, color: '#06b6d4', spotColor: '#0e7490' },
      { head: 99, tail: 2,  color: '#ec4899', spotColor: '#be185d' }
    ];

    this.init();
  }

  init() {
    this.renderGrid();
    this.renderOverlay();
    
    // Auto re-render SVG on window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => this.renderOverlay(), 100);
    });

    if (window.ResizeObserver) {
      new ResizeObserver(() => this.renderOverlay()).observe(this.container);
    }
  }

  /**
   * Convert cell number (1-100) to grid row & column.
   * Row 0 = top of visual board, Row 9 = bottom of visual board.
   * Numbering starts at 1 at bottom-left (Row 9, Col 0).
   */
  getGridCoord(n) {
    const decade = Math.floor((n - 1) / this.size); // 0 = 1..10, 9 = 91..100
    const colInDec = (n - 1) % this.size;
    const row = (this.size - 1) - decade; // row 9 is decade 0
    // Even decades (0, 2, 4...) move left-to-right (col 0 -> 9)
    // Odd decades (1, 3, 5...) move right-to-left (col 9 -> 0)
    const col = (decade % 2 === 0) ? colInDec : (this.size - 1 - colInDec);
    return { row, col };
  }

  /**
   * Render the 100 tiles into container
   */
  renderGrid() {
    this.container.innerHTML = '';
    this.cells = {};

    const gridEl = document.createElement('div');
    gridEl.className = 'board-grid';

    // Loop through 0..9 DOM rows (top to bottom)
    for (let row = 0; row < this.size; row++) {
      const decade = (this.size - 1) - row;
      const start = decade * this.size + 1;
      const end = start + this.size - 1;

      if (decade % 2 === 0) {
        for (let n = start; n <= end; n++) this._createCell(gridEl, n, row);
      } else {
        for (let n = end; n >= start; n--) this._createCell(gridEl, n, row);
      }
    }

    this.container.appendChild(gridEl);
  }

  _createCell(parent, n, domRow) {
    const cell = document.createElement('div');
    const coord = this.getGridCoord(n);
    const isAlt = (coord.row + coord.col) % 2 === 1;

    cell.className = `board-tile ${isAlt ? 'tile-alt' : 'tile-main'}`;
    cell.dataset.num = n;

    if (n === 1) cell.classList.add('tile-start');
    if (n === 100) cell.classList.add('tile-finish');

    const numSpan = document.createElement('span');
    numSpan.className = 'tile-num';
    numSpan.textContent = n;
    cell.appendChild(numSpan);

    if (n === 1) {
      const badge = document.createElement('span');
      badge.className = 'tile-badge badge-start';
      badge.textContent = '🚀 START';
      cell.appendChild(badge);
    } else if (n === 100) {
      const badge = document.createElement('span');
      badge.className = 'tile-badge badge-finish';
      badge.textContent = '🏆 WIN';
      cell.appendChild(badge);
    }

    parent.appendChild(cell);
    this.cells[n] = cell;
  }

  /**
   * Render SVG Overlay containing snakes & ladders overlaying the grid
   */
  renderOverlay() {
    let svg = this.container.querySelector('svg.board-overlay');
    if (svg) svg.remove();

    const rect = this.container.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'board-overlay');
    svg.setAttribute('viewBox', `0 0 ${rect.width} ${rect.height}`);

    // Add SVG filters & gradients for 3D depth
    const defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
    defs.innerHTML = `
      <filter id="drop-shadow" x="-20%" y="-20%" width="140%" height="140%">
        <feDropShadow dx="2" dy="4" stdDeviation="3" flood-opacity="0.3" flood-color="#000" />
      </filter>
    `;
    svg.appendChild(defs);

    const cellW = rect.width / this.size;
    const cellH = rect.height / this.size;

    const getCenter = (n) => {
      const { row, col } = this.getGridCoord(n);
      return {
        x: (col + 0.5) * cellW,
        y: (row + 0.5) * cellH
      };
    };

    // Draw Ladders first
    this.ladders.forEach(l => this._drawLadder(svg, getCenter(l.start), getCenter(l.end), l.color, cellW));

    // Draw Snakes second (on top)
    this.snakes.forEach(s => this._drawSnake(svg, getCenter(s.head), getCenter(s.tail), s.color, s.spotColor, cellW));

    this.container.appendChild(svg);
  }

  _drawLadder(svg, start, end, color, cellW) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('filter', 'url(#drop-shadow)');

    const dx = end.x - start.x;
    const dy = end.y - start.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);

    const railOffset = cellW * 0.18;
    const rungWidth = cellW * 0.12;

    // Perpendicular vector for rails
    const px = Math.cos(angle + Math.PI / 2) * railOffset;
    const py = Math.sin(angle + Math.PI / 2) * railOffset;

    // Rail 1
    const r1 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    r1.setAttribute('x1', start.x + px);
    r1.setAttribute('y1', start.y + py);
    r1.setAttribute('x2', end.x + px);
    r1.setAttribute('y2', end.y + py);
    r1.setAttribute('stroke', color);
    r1.setAttribute('stroke-width', rungWidth);
    r1.setAttribute('stroke-linecap', 'round');

    // Rail 2
    const r2 = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    r2.setAttribute('x1', start.x - px);
    r2.setAttribute('y1', start.y - py);
    r2.setAttribute('x2', end.x - px);
    r2.setAttribute('y2', end.y - py);
    r2.setAttribute('stroke', color);
    r2.setAttribute('stroke-width', rungWidth);
    r2.setAttribute('stroke-linecap', 'round');

    group.appendChild(r1);
    group.appendChild(r2);

    // Rungs along the length
    const numRungs = Math.max(2, Math.floor(dist / (cellW * 0.4)));
    for (let i = 1; i < numRungs; i++) {
      const t = i / numRungs;
      const rx = start.x + dx * t;
      const ry = start.y + dy * t;

      const rung = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      rung.setAttribute('x1', rx + px);
      rung.setAttribute('y1', ry + py);
      rung.setAttribute('x2', rx - px);
      rung.setAttribute('y2', ry - py);
      rung.setAttribute('stroke', '#fbbf24');
      rung.setAttribute('stroke-width', rungWidth * 0.7);
      rung.setAttribute('stroke-linecap', 'round');
      group.appendChild(rung);
    }

    svg.appendChild(group);
  }

  _drawSnake(svg, head, tail, color, spotColor, cellW) {
    const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
    group.setAttribute('filter', 'url(#drop-shadow)');

    const dx = tail.x - head.x;
    const dy = tail.y - head.y;
    const dist = Math.hypot(dx, dy);

    // Wavy curve control points
    const curveOffset = Math.min(dist * 0.3, cellW * 1.5);
    const midX = (head.x + tail.x) / 2;
    const midY = (head.y + tail.y) / 2;

    const perpX = -(tail.y - head.y) / dist;
    const perpY = (tail.x - head.x) / dist;

    const c1x = head.x + (tail.x - head.x) * 0.25 + perpX * curveOffset;
    const c1y = head.y + (tail.y - head.y) * 0.25 + perpY * curveOffset;

    const c2x = head.x + (tail.x - head.x) * 0.75 - perpX * curveOffset;
    const c2y = head.y + (tail.y - head.y) * 0.75 - perpY * curveOffset;

    const pathStr = `M ${head.x} ${head.y} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${tail.x} ${tail.y}`;

    // Body
    const body = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    body.setAttribute('d', pathStr);
    body.setAttribute('fill', 'none');
    body.setAttribute('stroke', color);
    body.setAttribute('stroke-width', cellW * 0.3);
    body.setAttribute('stroke-linecap', 'round');

    // Spots on body
    const bodyInner = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    bodyInner.setAttribute('d', pathStr);
    bodyInner.setAttribute('fill', 'none');
    bodyInner.setAttribute('stroke', spotColor);
    bodyInner.setAttribute('stroke-width', cellW * 0.12);
    bodyInner.setAttribute('stroke-dasharray', `${cellW * 0.15} ${cellW * 0.2}`);
    bodyInner.setAttribute('stroke-linecap', 'round');

    group.appendChild(body);
    group.appendChild(bodyInner);

    // Cartoon Snake Head (Big friendly circle with cute eyes & tongue)
    const headRadius = cellW * 0.26;
    const headAngle = Math.atan2(c1y - head.y, c1x - head.x);

    const headCircle = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
    headCircle.setAttribute('cx', head.x);
    headCircle.setAttribute('cy', head.y);
    headCircle.setAttribute('r', headRadius);
    headCircle.setAttribute('fill', color);
    group.appendChild(headCircle);

    // Eyes
    const eyeOffset = headRadius * 0.45;
    const eyeRadius = headRadius * 0.35;
    const pupilRadius = eyeRadius * 0.5;

    [-0.6, 0.6].forEach(side => {
      const ex = head.x + Math.cos(headAngle + side) * eyeOffset;
      const ey = head.y + Math.sin(headAngle + side) * eyeOffset;

      const eye = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      eye.setAttribute('cx', ex);
      eye.setAttribute('cy', ey);
      eye.setAttribute('r', eyeRadius);
      eye.setAttribute('fill', '#ffffff');

      const pupil = document.createElementNS('http://www.w3.org/2000/svg', 'circle');
      pupil.setAttribute('cx', ex);
      pupil.setAttribute('cy', ey);
      pupil.setAttribute('r', pupilRadius);
      pupil.setAttribute('fill', '#1e293b');

      group.appendChild(eye);
      group.appendChild(pupil);
    });

    // Red Forked Tongue pointing out from head
    const tongueLen = headRadius * 1.2;
    const tx = head.x - Math.cos(headAngle) * (headRadius * 0.8);
    const ty = head.y - Math.sin(headAngle) * (headRadius * 0.8);

    const tonguePath = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    tonguePath.setAttribute('d', `M ${head.x} ${head.y} L ${tx} ${ty}`);
    tonguePath.setAttribute('stroke', '#ef4444');
    tonguePath.setAttribute('stroke-width', cellW * 0.06);
    tonguePath.setAttribute('stroke-linecap', 'round');
    group.appendChild(tonguePath);

    svg.appendChild(group);
  }

  /**
   * Helper to check if a cell has a snake head or ladder bottom.
   */
  checkEntity(n) {
    const ladder = this.ladders.find(l => l.start === n);
    if (ladder) return { type: 'ladder', target: ladder.end, color: ladder.color };

    const snake = this.snakes.find(s => s.head === n);
    if (snake) return { type: 'snake', target: snake.tail, color: snake.color };

    return null;
  }
};
