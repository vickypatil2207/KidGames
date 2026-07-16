/**
 * BoardEntity.js
 * Base class for any cell-bound entity on the board (snake or ladder).
 * Demonstrates inheritance — Snake and Ladder extend this.
 */
window.SL = window.SL || {};

window.SL.BoardEntity = class BoardEntity {
  /**
   * @param {number} head - The cell number where the entity starts (snake head / ladder bottom).
   * @param {number} tail - The cell number where the entity ends   (snake tail / ladder top).
   * @param {string} color - Stroke / fill color used for SVG rendering.
   */
  constructor(head, tail, color) {
    if (new.target === BoardEntity) {
      throw new TypeError('BoardEntity is abstract and cannot be instantiated directly.');
    }
    if (!Number.isInteger(head) || !Number.isInteger(tail)) {
      throw new TypeError('head and tail must be integers between 1 and 100.');
    }
    this.head = head;
    this.tail = tail;
    this.color = color;
  }

  /** Type discriminator — overridden by subclasses. */
  get type() {
    return 'entity';
  }

  /** Returns true when this entity triggers on the given cell number. */
  involves(cellNumber) {
    return cellNumber === this.head;
  }
};
