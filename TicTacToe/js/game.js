/**
 * Game.js
 * -------
 * Orchestrates a Tic Tac Toe match: turn order, win/tie detection,
 * score updates. Holds references to two Player instances and a Board.
 * Emits a result object from `play()` so the UI layer can react.
 */

const WIN_PATTERNS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // cols
  [0, 4, 8], [2, 4, 6],            // diagonals
];

class Game {
  /**
   * @param {Player} player1
   * @param {Player} player2
   */
  constructor(player1, player2) {
    this.players = [player1, player2];
    this.board = new Board();
    this.currentPlayerIndex = 0;
    this.gameOver = false;
    this.winner = null;
    this.winningLine = null;
    this.tie = false;
  }

  /** Currently active player. */
  get currentPlayer() {
    return this.players[this.currentPlayerIndex];
  }

  /** The other player. */
  get opponent() {
    return this.players[1 - this.currentPlayerIndex];
  }

  /** Toggle the active player. */
  switchPlayer() {
    this.currentPlayerIndex = 1 - this.currentPlayerIndex;
  }

  /**
   * Attempt a move at `index` for the current player.
   * @returns {object|null} result describing what happened, or null if illegal.
   *
   * Result shapes:
   *   { status: "continue", player: <next player> }
   *   { status: "win", player: <winner>, line: number[3] }
   *   { status: "tie" }
   */
  play(index) {
    if (this.gameOver) return null;
    if (!this.board.isEmpty(index)) return null;

    const mover = this.currentPlayer;
    this.board.makeMove(index, mover.symbol);

    if (this.#hasWonOnLine(mover.symbol)) {
      this.gameOver = true;
      this.winner = mover;
      mover.incrementScore();
      return { status: "win", player: mover, line: this.winningLine };
    }

    if (this.board.isFull()) {
      this.gameOver = true;
      this.tie = true;
      return { status: "tie" };
    }

    this.switchPlayer();
    return { status: "continue", player: this.currentPlayer };
  }

  /**
   * Check whether `symbol` occupies a full winning line.
   * Caches the winning line indices in `this.winningLine`.
   */
  #hasWonOnLine(symbol) {
    for (const pattern of WIN_PATTERNS) {
      const [a, b, c] = pattern;
      if (
        this.board.getCell(a) === symbol &&
        this.board.getCell(b) === symbol &&
        this.board.getCell(c) === symbol
      ) {
        this.winningLine = pattern;
        return true;
      }
    }
    return false;
  }

  /** Start a new round (keeps running scores). */
  resetRound() {
    this.board.reset();
    this.currentPlayerIndex = 0;
    this.gameOver = false;
    this.winner = null;
    this.winningLine = null;
    this.tie = false;
  }

  /** Start a new round AND clear both scores. */
  resetAll() {
    this.resetRound();
    this.players.forEach((p) => p.resetScore());
  }

  /** Replace one of the players (used when toggling game mode). */
  setPlayer(slot, player) {
    // slot 0 -> X, slot 1 -> O. If the active player changes symbol,
    // we reset the round so turn order is consistent.
    if (this.players[slot].symbol !== player.symbol) {
      this.currentPlayerIndex = 0;
    }
    this.players[slot] = player;
  }
}
