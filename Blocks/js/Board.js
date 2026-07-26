/**
 * Board.js
 * Game board state model handling collisions, piece lock-in, line clears, and ghost preview.
 */

export class Board {
  /**
   * @param {number} width - Number of columns (e.g. 8, 12, 6)
   * @param {number} height - Number of rows (e.g. 8, 12, 9)
   */
  constructor(width = 8, height = 8) {
    this.width = width;
    this.height = height;
    this.grid = this.createEmptyGrid();
    this.animatingRows = [];
  }

  createEmptyGrid() {
    return Array.from({ length: this.height }, () => Array(this.width).fill(null));
  }

  reset(width = this.width, height = this.height) {
    this.width = width;
    this.height = height;
    this.grid = this.createEmptyGrid();
    this.animatingRows = [];
  }

  /**
   * Checks if placing a shape matrix at (offsetX, offsetY) is valid.
   */
  isValidMove(matrix, offsetX, offsetY) {
    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          const newX = offsetX + c;
          const newY = offsetY + r;

          // Out of bounds check on left/right walls and bottom floor
          if (newX < 0 || newX >= this.width || newY >= this.height) {
            return false;
          }
          
          // Collision check against locked blocks on the board
          if (newY >= 0 && this.grid[newY][newX] !== null) {
            return false;
          }
        }
      }
    }
    return true;
  }

  /**
   * Locks the piece into the static grid.
   * Returns true ONLY if piece locked with filled cells strictly above the visible grid (boardY < 0).
   */
  lockPiece(piece) {
    const { matrix, color, x, y } = piece;
    let overflow = false;

    for (let r = 0; r < matrix.length; r++) {
      for (let c = 0; c < matrix[r].length; c++) {
        if (matrix[r][c]) {
          const boardY = y + r;
          const boardX = x + c;

          if (boardY < 0) {
            overflow = true;
          } else if (boardY < this.height && boardX >= 0 && boardX < this.width) {
            this.grid[boardY][boardX] = color;
          }
        }
      }
    }
    return overflow;
  }

  /**
   * Calculates y-coordinate offset for ghost piece preview.
   */
  getGhostY(piece) {
    let ghostY = piece.y;
    while (this.isValidMove(piece.matrix, piece.x, ghostY + 1)) {
      ghostY++;
    }
    return ghostY;
  }

  /**
   * Identifies completely filled rows.
   * @returns {number[]} Array of row indices that are full.
   */
  getFullRows() {
    const fullRows = [];
    for (let r = 0; r < this.height; r++) {
      if (this.grid[r].every(cell => cell !== null)) {
        fullRows.push(r);
      }
    }
    return fullRows;
  }

  /**
   * Removes specified row indices and shifts top rows down.
   * @param {number[]} rowIndices
   */
  clearRows(rowIndices) {
    if (!rowIndices || rowIndices.length === 0) return;

    // Sort descending so we remove bottom rows first
    const sorted = [...rowIndices].sort((a, b) => b - a);

    sorted.forEach(rowIndex => {
      this.grid.splice(rowIndex, 1);
      // Add a new empty row at top
      this.grid.unshift(Array(this.width).fill(null));
    });
  }
}
