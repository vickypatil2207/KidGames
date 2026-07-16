/**
 * Tile.js
 * ----------------------------------------------------------
 * Represents a single 2048 tile.
 *
 * OOP responsibilities:
 *   - Holds the tile's value and current grid position.
 *   - Knows how to upgrade when two tiles merge.
 *   - Tracks its own DOM element so the renderer can manage it.
 * ----------------------------------------------------------
 */

export class Tile {
  /**
   * @param {number} value - Numeric label on the tile (2, 4, 8, ...).
   * @param {number} row   - Grid row index (0-based).
   * @param {number} col   - Grid column index (0-based).
   * @param {Object} [opts]
   * @param {boolean} [opts.isNew=false] - Marks the tile as freshly spawned (for pop animation).
   */
  constructor(value, row, col, { isNew = false } = {}) {
    this.value = value;
    this.row = row;
    this.col = col;
    this.isNew = isNew;
    this.mergedFrom = null; // [Tile, Tile] when this tile was created by a merge.
    this.element = null;     // The DOM node representing this tile.
  }

  /** Whether this tile was just spawned this turn (used for CSS animation). */
  get justSpawned() {
    return this.isNew === true;
  }

  /** Mark as freshly merged so the renderer can apply the merge animation. */
  markMerged(fromTiles) {
    this.mergedFrom = fromTiles;
  }

  /** Clear the "just spawned" flag once the spawn animation has played. */
  clearSpawnFlag() {
    this.isNew = false;
  }

  /**
   * Apply a merge from another tile of equal value.
   * Doubles the value, returns the points gained.
   * @param {Tile} other
   * @returns {number}
   */
  mergeWith(other) {
    if (other.value !== this.value) {
      throw new Error(
        `Cannot merge tiles of different values: ${this.value} and ${other.value}`
      );
    }
    this.markMerged([this, other]);
    const gained = this.value; // points earned = current value pre-merge.
    this.value *= 2;
    return gained;
  }

  /** Convenience getter for the highest-value class name. */
  get cssClass() {
    const v = this.value;
    if (v <= 2048) return `tile-${v}`;
    return 'tile super';
  }

  /** Serialize to a plain object (used for undo). */
  toJSON() {
    return { value: this.value, row: this.row, col: this.col };
  }
}