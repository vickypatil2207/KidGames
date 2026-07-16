/**
 * Snake.js
 * Represents a snake on the board. A snake sends a player from its head
 * (high cell) down to its tail (low cell).
 */
window.SL = window.SL || {};

window.SL.Snake = class Snake extends window.SL.BoardEntity {
  constructor(head, tail, color = '#3aa757') {
    super(head, tail, color);
    if (tail >= head) {
      throw new Error(`Snake head (${head}) must be higher than tail (${tail}).`);
    }
  }

  get type() {
    return 'snake';
  }

  /** Number of cells the player slides down. */
  get drop() {
    return this.head - this.tail;
  }
};
