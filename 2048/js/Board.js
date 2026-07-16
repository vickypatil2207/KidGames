/**
 * Board.js
 * ----------------------------------------------------------
 * Pure data layer for a 2048 board. Knows nothing about the DOM.
 *
 * OOP responsibilities:
 *   - Stores a grid of Tile instances.
 *   - Spawns random new tiles.
 *   - Performs moves (slide + merge) in 4 directions.
 *   - Detects win / lose conditions.
 *   - Supports cloning for undo.
 * ----------------------------------------------------------
 */

import { Tile } from './Tile.js';

export class Board {
  /** @param {number} [size=4] - Grid dimension (4 for classic 2048). */
  constructor(size = 4) {
    this.size = size;
    /** @type {Array<Array<Tile|null>>} */
    this.grid = Array.from({ length: size }, () => Array(size).fill(null));
  }

  // ---------- Query helpers ----------

  /** @returns {Array<{row:number,col:number}>} empty cell coordinates. */
  emptyCells() {
    const out = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        if (!this.grid[r][c]) out.push({ row: r, col: c });
      }
    }
    return out;
  }

  /** @returns {Tile[]} all tiles currently on the board. */
  tiles() {
    const out = [];
    for (const row of this.grid) {
      for (const cell of row) if (cell) out.push(cell);
    }
    return out;
  }

  /** Whether any tile has reached the win value (default 2048). */
  hasWon(winValue = 2048) {
    return this.tiles().some((t) => t.value >= winValue);
  }

  /**
   * Game-over check: no empty cells AND no two adjacent tiles have equal value.
   * (Adjacency is checked in the 4 orthogonal directions only.)
   */
  isGameOver() {
    if (this.emptyCells().length > 0) return false;
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const t = this.grid[r][c];
        if (!t) continue;
        if (c + 1 < this.size && this.grid[r][c + 1]?.value === t.value) return false;
        if (r + 1 < this.size && this.grid[r + 1][c]?.value === t.value) return false;
      }
    }
    return true;
  }

  // ---------- Mutations ----------

  /**
   * Spawn a new tile (value 2 or 4) at a random empty cell.
   * Returns the spawned Tile, or null if board is full.
   */
  spawnRandomTile() {
    const empties = this.emptyCells();
    if (empties.length === 0) return null;
    // 90% chance of 2, 10% chance of 4 — friendlier for kids.
    const value = Math.random() < 0.9 ? 2 : 4;
    const { row, col } = empties[Math.floor(Math.random() * empties.length)];
    const tile = new Tile(value, row, col, { isNew: true });
    this.grid[row][col] = tile;
    return tile;
  }

  /**
   * Try to move the board in one direction. Returns a result object
   * describing what happened so the controller can update score / animations.
   *
   * @param {'up'|'down'|'left'|'right'} direction
   * @returns {{
   *   moved: boolean,
   *   gained: number,
   *   merges: Array<{row:number,col:number,value:number}>,
   *   moves:  Array<{tile:Tile, toRow:number,toCol:number,consumed:boolean}>
   * }}
   */
  move(direction) {
    // Build an ordered list of (r,c) positions in the order tiles should be visited
    // — for each direction we want the "leading" edge first.
    const order = this._traversalOrder(direction);

    let moved = false;
    let gained = 0;
    /** @type {Array<{row:number,col:number,value:number}>} */
    const merges = [];
    /** @type {Array<{tile:Tile, toRow:number, toCol:number, consumed:boolean}>} */
    const moves = [];

    // Track tiles that have already merged this turn (classic 2048 rule:
    // a tile produced by a merge cannot merge again in the same move).
    const mergedThisTurn = new Set();

    for (const { row: r, col: c } of order) {
      const tile = this.grid[r][c];
      if (!tile) continue;

      const { row: dr, col: dc } = this._delta(direction);
      let nr = r;
      let nc = c;
      let consumed = false; // True if this tile was merged INTO another tile.

      // Slide as far as possible.
      while (true) {
        const tr = nr + dr;
        const tc = nc + dc;
        if (tr < 0 || tr >= this.size || tc < 0 || tc >= this.size) break;
        const next = this.grid[tr][tc];
        if (!next) {
          nr = tr;
          nc = tc;
          continue;
        }
        // Block is occupied — try to merge if same value and not already merged.
        if (next.value === tile.value && !mergedThisTurn.has(next) && !mergedThisTurn.has(tile)) {
          // Merge into `next`, remove the moving tile from grid.
          const earned = next.mergeWith(tile);
          gained += earned;
          merges.push({ row: tr, col: tc, value: next.value });
          mergedThisTurn.add(next);
          // Free the origin so we don't leave a dangling reference.
          this.grid[r][c] = null;
          // Record the consumed tile's ORIGINAL position so the renderer
          // can fade it out from where it started (avoids the "phantom
          // number" glitch where the consumed tile jumps to the survivor).
          moves.push({ tile, toRow: r, toCol: c, consumed: true });
          moved = true;
          consumed = true;
          break;
        }
        // Cannot move into the occupied cell.
        break;
      }

      // If the tile was consumed by a merge, the survivor already occupies the
      // target cell — do NOT try to "slide" the consumed tile on top of it.
      if (consumed) continue;

      if (nr !== r || nc !== c) {
        // Pure slide (no merge) — relocate on the grid.
        if (this.grid[r][c] === tile) this.grid[r][c] = null;
        this.grid[nr][nc] = tile;
        tile.row = nr;
        tile.col = nc;
        moves.push({ tile, toRow: nr, toCol: nc, consumed: false });
        moved = true;
      }
    }

    return { moved, gained, merges, moves };
  }

  // ---------- Internals ----------

  /**
   * For a given direction, return the (row,col) traversal order such that
   * the cell furthest in the direction of motion comes first.
   * Example: for "up", we visit top-to-bottom so tiles "fall" upward correctly.
   */
  _traversalOrder(direction) {
    const out = [];
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        out.push({ row: r, col: c });
      }
    }
    switch (direction) {
      case 'up':    out.sort((a, b) => a.row - b.row); break;
      case 'down':  out.sort((a, b) => b.row - a.row); break;
      case 'left':  out.sort((a, b) => a.col - b.col); break;
      case 'right': out.sort((a, b) => b.col - a.col); break;
    }
    return out;
  }

  /** Unit vector for a direction. */
  _delta(direction) {
    switch (direction) {
      case 'up':    return { row: -1, col:  0 };
      case 'down':  return { row:  1, col:  0 };
      case 'left':  return { row:  0, col: -1 };
      case 'right': return { row:  0, col:  1 };
      default: throw new Error(`Unknown direction: ${direction}`);
    }
  }

  // ---------- Snapshot / undo ----------

  /** Deep-enough snapshot of the board for undo (values + positions). */
  snapshot() {
    return this.grid.map((row) =>
      row.map((cell) => (cell ? { ...cell.toJSON() } : null))
    );
  }

  /** Restore from a snapshot produced by `snapshot()`. */
  restore(snap) {
    for (let r = 0; r < this.size; r++) {
      for (let c = 0; c < this.size; c++) {
        const data = snap[r][c];
        this.grid[r][c] = data ? new Tile(data.value, data.row, data.col) : null;
      }
    }
  }

  /** Clear the board completely. */
  reset() {
    this.grid = Array.from({ length: this.size }, () => Array(this.size).fill(null));
  }
}