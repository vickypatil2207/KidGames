/**
 * Player.js
 * ----------
 * Represents a human player in the Tic Tac Toe game.
 * Encapsulates identity (name, symbol, emoji) and score state.
 */

class Player {
  /**
   * @param {string} name  - Display name (e.g. "Player 1")
   * @param {string} symbol - "X" or "O"
   * @param {string} emoji  - Visual emoji used in UI (e.g. "❌")
   */
  constructor(name, symbol, emoji) {
    this.name = name;
    this.symbol = symbol;
    this.emoji = emoji;
    this.score = 0;
  }

  /** Add one to this player's score. */
  incrementScore() {
    this.score += 1;
  }

  /** Reset this player's score to zero. */
  resetScore() {
    this.score = 0;
  }

  /** Lowercase CSS-friendly form of the symbol ("x" or "o"). */
  get cssClass() {
    return this.symbol.toLowerCase();
  }
}
