/**
 * Board.js
 * --------
 * Pure data model for the 3x3 Tic Tac Toe grid (flat 9-cell array).
 * Knows nothing about the DOM or players — just the cell state.
 */

class Board {
  constructor() {
    this.reset();
  }

  /** Wipe all cells to null. */
  reset() {
    this.cells = Array(9).fill(null);
  }

  /** Read a cell value. @returns {"X"|"O"|null} */
  getCell(index) {
    return this.cells[index];
  }

  /** Is the cell empty? */
  isEmpty(index) {
    return this.cells[index] === null;
  }

  /** Are all cells filled? */
  isFull() {
    return this.cells.every((c) => c !== null);
  }

  /**
   * Try to place a symbol.
   * @returns {boolean} true if placed, false if cell was taken.
   */
  makeMove(index, symbol) {
    if (!this.isEmpty(index)) return false;
    this.cells[index] = symbol;
    return true;
  }

  /** All empty cell indices. */
  availableIndices() {
    return this.cells
      .map((v, i) => (v === null ? i : -1))
      .filter((i) => i !== -1);
  }
}
