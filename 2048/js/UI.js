/**
 * UI.js
 * ----------------------------------------------------------
 * View + animation + input layer for the 2048 board.
 *
 * The Game controller is pure logic — this class owns the DOM.
 *
 * Public API used by Game:
 *   - render(board, {score, best})
 *   - animateMove(board, moveResult, onDone)
 *   - showOverlay({emoji,title,message,primary,secondary})
 *   - hideOverlay()
 *   - celebrate()
 *   - shake()
 *   - bindActions({onNewGame, onUndo, onToggleSound, onPlayAgain, onKeepGoing})
 *   - attachInputHandlers({onMove})
 *   - setSoundEnabled(bool)
 *   - get isAnimating() : boolean
 * ----------------------------------------------------------
 */

// Tiles now snap instantly to their new cell — only the merged survivor
// animates (its pulse). 80ms is a small safety margin to let the pulse
// start before we resync with the board.
const MOVE_DURATION_MS = 80;

export class UI {
  /** @param {Object} ids DOM element references (see index.html). */
  constructor(ids) {
    this.boardEl     = ids.board;
    this.gridBgEl    = ids.gridBg;
    this.tileLayer   = ids.tileLayer;
    this.scoreEl     = ids.score;
    this.bestEl      = ids.best;
    this.newGameBtn  = ids.newGameBtn;
    this.undoBtn     = ids.undoBtn;
    this.soundBtn    = ids.soundBtn;
    this.soundIcon   = ids.soundIcon;
    this.overlay     = ids.overlay;
    this.overlayEmoji= ids.overlayEmoji;
    this.overlayTitle= ids.overlayTitle;
    this.overlayMsg  = ids.overlayMsg;
    this.overlayPri  = ids.overlayPri;
    this.overlaySec  = ids.overlaySec;
    this.confetti    = ids.confetti;

    this.size = 4; // matches Board size for a 4×4 grid.
    this.isAnimating = false;
    this._tilesById  = new Map(); // tile -> DOM element
    this._nextId     = 1;

    this._buildGridBackground();
  }

  // ---------- Public: actions binding ----------

  bindActions({ onNewGame, onUndo, onToggleSound, onPlayAgain, onKeepGoing }) {
    this.newGameBtn.addEventListener('click', () => onNewGame?.());
    this.undoBtn.addEventListener('click', () => onUndo?.());
    this.soundBtn.addEventListener('click', () => onToggleSound?.());
    this.overlayPri.addEventListener('click', () => onPlayAgain?.());
    this.overlaySec.addEventListener('click', () => onKeepGoing?.());
  }

  attachInputHandlers({ onMove }) {
    // Keyboard
    window.addEventListener('keydown', (e) => {
      if (this.overlay.classList.contains('show')) return; // ignore when modal open
      const map = {
        ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right',
        w: 'up', s: 'down', a: 'left', d: 'right',
        W: 'up', S: 'down', A: 'left', D: 'right',
      };
      const dir = map[e.key];
      if (dir) {
        e.preventDefault();
        onMove?.(dir);
      }
    });

    // Touch / swipe on the board.
    let startX = 0, startY = 0, active = false;
    const SWIPE_THRESHOLD = 24; // pixels before we consider it a swipe.

    this.boardEl.addEventListener('touchstart', (e) => {
      if (e.touches.length !== 1) return;
      active = true;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    this.boardEl.addEventListener('touchmove', (e) => {
      if (!active) return;
      // Prevent page from scrolling while swiping the board.
      e.preventDefault();
    }, { passive: false });

    this.boardEl.addEventListener('touchend', (e) => {
      if (!active) return;
      active = false;
      const t = e.changedTouches[0];
      const dx = t.clientX - startX;
      const dy = t.clientY - startY;
      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;
      if (Math.abs(dx) > Math.abs(dy)) onMove?.(dx > 0 ? 'right' : 'left');
      else                              onMove?.(dy > 0 ? 'down'  : 'up');
    });

    // Mouse drag fallback for desktop.
    let mDown = false, mStartX = 0, mStartY = 0;
    this.boardEl.addEventListener('mousedown', (e) => {
      mDown = true; mStartX = e.clientX; mStartY = e.clientY;
    });
    window.addEventListener('mouseup', (e) => {
      if (!mDown) return;
      mDown = false;
      const dx = e.clientX - mStartX;
      const dy = e.clientY - mStartY;
      if (Math.abs(dx) < SWIPE_THRESHOLD && Math.abs(dy) < SWIPE_THRESHOLD) return;
      if (Math.abs(dx) > Math.abs(dy)) onMove?.(dx > 0 ? 'right' : 'left');
      else                              onMove?.(dy > 0 ? 'down'  : 'up');
    });
  }

  // ---------- Public: rendering ----------

  /**
   * Full render: tear down old tile nodes and draw fresh ones from the board.
   * Called on new game, undo, and after the move animation completes.
   */
  render(board, { score, best }) {
    this._setScore(score);
    this._setBest(best);

    const currentBoardTiles = new Set(board.tiles());

    // 1) Remove DOM elements for tiles no longer on the board
    for (const [tile, el] of Array.from(this._tilesById.entries())) {
      if (!currentBoardTiles.has(tile)) {
        el.remove();
        this._tilesById.delete(tile);
      }
    }

    // 2) Update existing elements or create new ones for current tiles
    for (const tile of board.tiles()) {
      let el = this._tilesById.get(tile);
      if (!el) {
        el = this._createTileEl(tile);
        this.tileLayer.appendChild(el);
        this._tilesById.set(tile, el);
      } else {
        this._positionTile(el, tile.row, tile.col);
        el.textContent = tile.value;
        const isMerged = el.classList.contains('tile-merged');
        const isNew = el.classList.contains('tile-new');
        el.className = `tile ${tile.cssClass}` + (isMerged ? ' tile-merged' : '') + (isNew ? ' tile-new' : '');
      }
    }
  }

  /**
   * Animate a move: for each tile movement, transition the DOM element
   * to its new grid position; remove merged-into tiles with a pop.
   * Calls onDone() after the transition ends.
   */
  animateMove(board, moveResult, onDone) {
    this.isAnimating = true;
    this._setScore(this._currentScore());

    // 1) Position update pass — slide-only tiles glide to their new cell.
    //    Consumed tiles (those merged into another tile) STAY at their
    //    original position; step 2 fades them out from there.
    for (const { tile, toRow, toCol, consumed } of moveResult.moves) {
      if (consumed) continue; // don't reposition; fade in place instead.
      let el = this._tilesById.get(tile);
      if (!el) {
        // Tile wasn't on the layer (shouldn't happen) — create it.
        el = this._createTileEl(tile);
        this.tileLayer.appendChild(el);
        this._tilesById.set(tile, el);
      }
      this._positionTile(el, toRow, toCol);
      tile.row = toRow;
      tile.col = toCol;
    }

    // 2) Merge pass — survivor pulses, consumed tiles fade out at origin.
    // We rely on the fact that the survivor is the tile that ended up at (r,c).
    for (const m of moveResult.merges) {
      const survivor = board.grid[m.row][m.col];
      if (!survivor) continue;
      const survivorEl = this._tilesById.get(survivor);
      if (survivorEl) {
        // Update label, color, and re-trigger the merge pulse animation.
        // Restarting the animation is done by removing -> reflow -> re-adding the class.
        survivorEl.textContent = survivor.value;
        survivorEl.classList.remove('tile-merged');
        survivorEl.className = `tile ${survivor.cssClass} tile-merged`;
        // Force a reflow so the animation replays on repeat merges in one move.
        // eslint-disable-next-line no-unused-expressions
        survivorEl.offsetWidth;
        survivorEl.classList.add('tile-merged');
        // Remove the "merged" class after the animation so it can replay later.
        setTimeout(() => survivorEl.classList.remove('tile-merged'), 240);
      }
    }

    // 2b) Fade out consumed tiles from where they started.
    //     Each consumed tile element gets `tile-consumed` which runs a
    //     scale-down + fade animation; we then remove the DOM node when it ends.
    for (const { tile, consumed } of moveResult.moves) {
      if (!consumed) continue;
      const el = this._tilesById.get(tile);
      if (!el) continue;
      el.classList.add('tile-consumed');
      // Ensure the element stays at its ORIGINAL transform (do not move it).
      // After the fade animation, drop it from the layer + map.
      const cleanup = () => {
        el.remove();
        this._tilesById.delete(tile);
      };
      el.addEventListener('animationend', cleanup, { once: true });
      // Safety net in case animationend doesn't fire (reduced motion, etc.).
      setTimeout(cleanup, 260);
    }

    // 3) Cleanup: remove DOM elements for any tiles still not on the board
    //    (defensive — handled above for consumed tiles, but kept as a safety net).
    setTimeout(() => {
      const liveTiles = new Set(board.tiles());
      for (const [tile, el] of this._tilesById) {
        if (!liveTiles.has(tile)) {
          el.remove();
          this._tilesById.delete(tile);
        }
      }
      // Spawn the next tile with a pop animation (handled in spawnRandomTile path).
      this.isAnimating = false;
      onDone?.();
    }, MOVE_DURATION_MS + 20);
  }

  // ---------- Public: overlays & fx ----------

  showOverlay({ emoji, title, message, primary, secondary }) {
    this.overlayEmoji.textContent = emoji || '🎉';
    this.overlayTitle.textContent = title || '';
    this.overlayMsg.textContent   = message || '';
    this.overlayPri.firstChild && (this.overlayPri.lastChild.textContent = primary || 'OK');
    // Easier: just set textContent safely while keeping the button's flex layout.
    this.overlayPri.innerHTML = '';
    this.overlayPri.append(primary || 'OK');
    this.overlaySec.innerHTML = '';
    this.overlaySec.append(secondary || 'Close');
    this.overlay.classList.add('show');
  }

  hideOverlay() {
    this.overlay.classList.remove('show');
  }

  /** Trigger a quick screen shake (e.g., on invalid move). */
  shake() {
    this.boardEl.classList.add('shake');
    setTimeout(() => this.boardEl.classList.remove('shake'), 400);
  }

  /** Score-bump animation + confetti when reaching 2048. */
  celebrate() {
    this.scoreEl.classList.add('bump');
    setTimeout(() => this.scoreEl.classList.remove('bump'), 300);
    this._confettiBurst();
  }

  setSoundEnabled(enabled) {
    if (this.soundIcon) this.soundIcon.textContent = enabled ? '🔊' : '🔇';
    if (this.soundBtn) this.soundBtn.setAttribute('aria-pressed', enabled ? 'true' : 'false');
  }

  // ---------- Internals ----------

  _buildGridBackground() {
    this.gridBgEl.innerHTML = '';
    const total = this.size * this.size;
    for (let i = 0; i < total; i++) {
      const cell = document.createElement('div');
      cell.className = 'cell';
      this.gridBgEl.appendChild(cell);
    }
  }

  /**
   * Compute the pixel offset for a tile at (row, col) by mirroring the
   * CSS grid layout (same gap + same fractional sizing). We do this
   * in JS so the translate transform stays exact regardless of viewport.
   * @param {number} row
   * @param {number} col
   */
  _offsetFor(row, col) {
    const layer = this.tileLayer.getBoundingClientRect();
    const cs = getComputedStyle(this.gridBgEl);
    const gap = parseFloat(cs.columnGap || cs.gap || '10') || 10;
    const cell = (layer.width - gap * (this.size - 1)) / this.size;
    return {
      x: col * (cell + gap),
      y: row * (cell + gap),
    };
  }

  _createTileEl(tile) {
    const el = document.createElement('div');
    el.className = `tile ${tile.cssClass}` + (tile.justSpawned ? ' tile-new' : '');
    el.textContent = tile.value;
    this._positionTile(el, tile.row, tile.col);
    // Strip the spawn class after the pop animation finishes so the animation
    // never re-fires on subsequent renders/moves. Also clear the tile's
    // `isNew` flag so any later full re-render doesn't re-add the class.
    if (tile.justSpawned) {
      setTimeout(() => {
        el.classList.remove('tile-new');
        tile.clearSpawnFlag();
      }, 280);
    }
    return el;
  }

  /**
   * Position a tile element on the grid using pixel-based translate so it
   * lands exactly on the corresponding grid cell.
   * @param {HTMLElement} el
   * @param {number} row
   * @param {number} col
   */
  _positionTile(el, row, col) {
    const { x, y } = this._offsetFor(row, col);
    el.style.transform = `translate(${x}px, ${y}px)`;
  }

  _setScore(v) {
    if (this.scoreEl.textContent !== String(v)) {
      this.scoreEl.textContent = v;
      this.scoreEl.classList.add('bump');
      setTimeout(() => this.scoreEl.classList.remove('bump'), 220);
    } else {
      this.scoreEl.textContent = v;
    }
  }

  _setBest(v) {
    this.bestEl.textContent = v;
  }

  _currentScore() {
    return parseInt(this.scoreEl.textContent, 10) || 0;
  }

  _confettiBurst() {
    if (!this.confetti) return;
    const colors = ['#ff6fa5', '#6ec6ff', '#ffd166', '#7ed957', '#b58cff', '#ff9aa2'];
    const N = 60;
    for (let i = 0; i < N; i++) {
      const piece = document.createElement('i');
      const left = Math.random() * 100;
      const dur  = 1800 + Math.random() * 1800;
      const delay = Math.random() * 300;
      const color = colors[i % colors.length];
      const w = 6 + Math.random() * 8;
      const h = 10 + Math.random() * 12;
      piece.style.left = `${left}%`;
      piece.style.width = `${w}px`;
      piece.style.height = `${h}px`;
      piece.style.background = color;
      piece.style.animationDuration = `${dur}ms`;
      piece.style.animationDelay = `${delay}ms`;
      this.confetti.appendChild(piece);
      setTimeout(() => piece.remove(), dur + delay + 100);
    }
  }
}