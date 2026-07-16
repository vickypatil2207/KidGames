/**
 * Ladder.js
 * Represents a ladder on the board. A ladder takes a player from its
 * bottom (low cell) up to its top (high cell).
 */
window.SL = window.SL || {};

window.SL.Ladder = class Ladder extends window.SL.BoardEntity {
  constructor(bottom, top, color = '#f0a23a') {
    super(bottom, top, color);
    if (top <= bottom) {
      throw new Error(`Ladder top (${top}) must be higher than bottom (${bottom}).`);
    }
  }

  get type() {
    return 'ladder';
  }

  get bottom() { return this.head; }
  get top()    { return this.tail; }

  /** Number of cells the player climbs up. */
  get rise() {
    return this.tail - this.head;
  }
};
