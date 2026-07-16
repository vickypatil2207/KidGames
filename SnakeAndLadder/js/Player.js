/**
 * Player.js
 * Represents a single player in the game. Owns a position on the board
 * and a DOM element (the token) that UIManager moves around.
 */
window.SL = window.SL || {};

window.SL.Player = class Player {
  /**
   * @param {object} cfg
   * @param {string}   cfg.id     - Unique id (e.g. "p1").
   * @param {string}   cfg.name   - Display name.
   * @param {string}   cfg.color  - Token color (CSS color).
   * @param {string}   cfg.emoji  - Fun emoji displayed next to the name.
   * @param {HTMLElement} cfg.tokenEl - The DOM element representing the token.
   */
  constructor({ id, name, color, emoji, tokenEl, isComputer = false }) {
    this.id      = id;
    this.name    = name;
    this.color   = color;
    this.emoji   = emoji || '🙂';
    this.tokenEl = tokenEl;
    this.position = 1;
    this.hasWon   = false;
    this.isComputer = isComputer;
  }

  /** Move the player by `steps` cells (positive or negative). */
  moveTo(cell) {
    this.position = Math.max(1, Math.min(100, cell));
  }

  reset() {
    this.position = 1;
    this.hasWon   = false;
  }
};
