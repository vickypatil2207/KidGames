/**
 * Board.js
 * Renders the 10x10 grid in classic snake-pattern layout, owns the
 * snake and ladder definitions, and exposes helpers to convert cell
 * numbers to (row, col) coordinates.
 *
 * Numbering:
 *   1 → 10 : left  → right  (bottom row)
 *   11 → 20: right → left
 *   21 → 30: left  → right
 *   ...
 *   91 → 100: right → left (top row)
 *
 * Cells are appended to the DOM in the order they should visually
 * appear (left → right, row by row from top to bottom), so what you
 * see in the DOM is exactly what you see on screen.
 */
window.SL = window.SL || {};
const { Snake, Ladder } = window.SL;

window.SL.Board = class Board {
  /**
   * @param {HTMLElement} container - The element that will host the grid.
   */
  constructor(container) {
    this.container = container;
    this.size      = 10;        // 10x10
    this.cells     = [];        // cell elements indexed 1..100
    this.snakes    = [];
    this.ladders   = [];

    this._defineEntities();
    this._renderGrid();
    this._renderOverlay();
  }

  /* ---------- Setup ---------- */

  _defineEntities() {
    // Kid-friendly set. Numbers chosen to be fun and not too punishing.
    this.ladders.push(new Ladder( 4, 25, '#ffb938'));
    this.ladders.push(new Ladder( 9, 31, '#ff7eb6'));
    this.ladders.push(new Ladder(21, 42, '#7ed957'));
    this.ladders.push(new Ladder(28, 56, '#4ec5ff'));
    this.ladders.push(new Ladder(36, 57, '#b07cff'));
    this.ladders.push(new Ladder(51, 72, '#ff8a3d'));
    this.ladders.push(new Ladder(71, 92, '#5dd6c9'));
    this.ladders.push(new Ladder(80, 99, '#ff5d8f'));

    this.snakes.push(new Snake( 17,  7, '#3aa757'));
    this.snakes.push(new Snake( 54, 34, '#3aa757'));
    this.snakes.push(new Snake( 62, 37, '#3aa757'));
    this.snakes.push(new Snake( 64, 60, '#3aa757'));
    this.snakes.push(new Snake( 87, 36, '#3aa757'));
    this.snakes.push(new Snake( 93, 73, '#3aa757'));
    this.snakes.push(new Snake( 95, 75, '#3aa757'));
    this.snakes.push(new Snake( 98, 79, '#3aa757'));
  }

  /**
   * Render cells into the DOM in the exact order they should visually
   * appear. Row 0 of the DOM is the TOP of the board.
   */
  _renderGrid() {
    this.container.innerHTML = '';
    for (let domRow = 0; domRow < this.size; domRow++) {
      const decade = (this.size - 1) - domRow;   // top row = decade 9, bottom = decade 0
      const start  = decade * this.size + 1;
      const end    = start + this.size - 1;
      // Even decades render left-to-right, odd decades render right-to-left
      // (matches the user's required numbering).
      if (decade % 2 === 0) {
        for (let n = start; n <= end; n++) this._appendCell(n);
      } else {
        for (let n = end; n >= start; n--) this._appendCell(n);
      }
    }
  }

  _appendCell(n) {
    const cell = document.createElement('div');
    const decade = Math.floor((n - 1) / this.size);
    cell.className = `cell decade-${decade} ` + (this._isDarkCell(n) ? 'dark' : 'light');
    cell.dataset.num = n;
    if (n === 1)   cell.classList.add('cell-start');
    if (n === 100) cell.classList.add('cell-finish');

    const num = document.createElement('span');
    num.className = 'num';
    num.textContent = n;
    cell.appendChild(num);

    this.container.appendChild(cell);
    this.cells[n] = cell;
  }

  _isDarkCell(n) {
    const decade   = Math.floor((n - 1) / this.size);
    const col      = (n - 1) % this.size;
    const visualCol = (decade % 2 === 0) ? col : (this.size - 1 - col);
    const domRow   = (this.size - 1) - decade;
    return (visualCol + domRow) % 2 === 0;
  }

  /* ---------- Coordinate helpers ---------- */

  /**
   * Convert a cell number to (row, col) in the rendered 10x10 grid where
   * row 0 is the TOP of the board.
   */
  toGrid(n) {
    const decade    = Math.floor((n - 1) / this.size);
    const colInDec  = (n - 1) % this.size;
    const domRow    = (this.size - 1) - decade;
    const col       = (decade % 2 === 0) ? colInDec : (this.size - 1 - colInDec);
    return { row: domRow, col };
  }

  /** Returns the cell DOM element for a given cell number. */
  getCellEl(n) {
    return this.cells[n];
  }

  /* ---------- SVG overlay for snakes & ladders ---------- */

  _renderOverlay() {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    svg.setAttribute('class', 'overlay');
    svg.setAttribute('viewBox', `0 0 ${this.size} ${this.size}`);
    svg.setAttribute('preserveAspectRatio', 'none');

    // Draw ladders first so snakes sit on top visually.
    this.ladders.forEach((ladder) => this._drawLadder(svg, ladder));
    this.snakes.forEach((snake)   => this._drawSnake(svg, snake));

    this.container.appendChild(svg);
  }

  _drawLadder(svg, ladder) {
    const a = this.toGrid(ladder.bottom);
    const b = this.toGrid(ladder.top);
    const railOffset = 0.15;

    // Two rails
    [ -railOffset, railOffset ].forEach((dx) => {
      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      line.setAttribute('class', 'ladder-rail snake-path');
      line.setAttribute('x1', a.col + 0.5 + dx);
      line.setAttribute('y1', a.row + 0.5);
      line.setAttribute('x2', b.col + 0.5 + dx);
      line.setAttribute('y2', b.row + 0.5);
      line.setAttribute('stroke', ladder.color);
      line.setAttribute('stroke-width', 0.12);
      svg.appendChild(line);
    });

    // Rungs every cell
    const steps = Math.abs(b.row - a.row);
    const dir   = b.row > a.row ? 1 : -1;
    for (let i = 1; i < steps; i++) {
      const t = i / steps;
      const y = a.row + dir * i + 0.5;
      const x = a.col + (b.col - a.col) * t + 0.5;
      const rung = document.createElementNS('http://www.w3.org/2000/svg', 'line');
      rung.setAttribute('class', 'ladder-rung');
      rung.setAttribute('x1', x - railOffset);
      rung.setAttribute('y1', y);
      rung.setAttribute('x2', x + railOffset);
      rung.setAttribute('y2', y);
      rung.setAttribute('stroke', ladder.color);
      rung.setAttribute('stroke-width', 0.1);
      svg.appendChild(rung);
    }

    // Fun arrow at the top
    this._addCellArt(ladder.top, '🪜', 'tl');
    this._addCellArt(ladder.bottom, '🟢', 'br');
  }

  _drawSnake(svg, snake) {
    const a = this.toGrid(snake.head);
    const b = this.toGrid(snake.tail);

    // Smooth S-curve path between the two centers.
    const cx1 = a.col + 0.5 + (b.col > a.col ? 0.6 : -0.6);
    const cy1 = a.row + 0.5;
    const cx2 = b.col + 0.5 + (b.col > a.col ? -0.6 : 0.6);
    const cy2 = b.row + 0.5;

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('class', 'snake-path');
    path.setAttribute('d',
      `M ${a.col + 0.5} ${a.row + 0.5}
       C ${cx1} ${cy1}, ${cx2} ${cy2}, ${b.col + 0.5} ${b.row + 0.5}`
    );
    path.setAttribute('stroke', snake.color);
    path.setAttribute('stroke-width', 0.32);
    svg.appendChild(path);

    // Snake head (emoji) at head cell
    this._addCellArt(snake.head, '🐍', 'tl');
    this._addCellArt(snake.tail, '🟤', 'br');
  }

  _addCellArt(cellNum, emoji, pos) {
    const cell = this.cells[cellNum];
    if (!cell) return;
    if (cell.querySelector(`.cell-art.${pos}`)) return;
    const span = document.createElement('span');
    span.className = `cell-art ${pos}`;
    span.textContent = emoji;
    cell.appendChild(span);
  }
};
