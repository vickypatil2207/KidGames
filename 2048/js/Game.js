/**
 * Game.js
 * ----------------------------------------------------------
 * Top-level game controller (the "Director" in OOP terms).
 *
 * Responsibilities:
 *   - Owns the Board and a UI renderer.
 *   - Handles user input (keyboard, swipe, button clicks).
 *   - Tracks score / best score with localStorage persistence.
 *   - Maintains a single-step undo stack.
 *   - Notifies the UI to animate / show overlays / play sounds.
 * ----------------------------------------------------------
 */

import { Board } from './Board.js';

const STORAGE_KEY_BEST = 'kids2048.best';
const STORAGE_KEY_SOUND = 'kids2048.sound';
const WIN_VALUE = 2048;

export class Game {
  /**
   * @param {Object} cfg
   * @param {import('./UI.js').UI} cfg.ui
   * @param {import('./SoundManager.js').SoundManager} [cfg.sound]
   */
  constructor({ ui, sound = null }) {
    this.ui = ui;
    this.sound = sound;
    this.board = new Board(4);
    this.size = this.board.size;
    this.score = 0;
    this.best = this._loadBest();
    this.won = false;          // Whether the player has reached 2048 this run.
    this.keepPlaying = false;  // After winning, can continue for higher score.
    this.undoStack = [];       // Stack of {snap, score} entries, max 1 step.

    this.ui.bindActions({
      onNewGame: () => this.newGame(),
      onUndo: () => this.undo(),
      onToggleSound: () => this.toggleSound(),
      onPlayAgain: () => this.newGame(),
      onKeepGoing: () => this.continueAfterWin(),
    });

    this.ui.attachInputHandlers({
      onMove: (dir) => this.handleMove(dir),
    });

    this.newGame(/*silent=*/ true);
  }

  // ---------- Lifecycle ----------

  /** Reset everything and place two starting tiles. */
  newGame(silent = false) {
    this.board.reset();
    this.score = 0;
    this.won = false;
    this.keepPlaying = false;
    this.undoStack = [];
    this.board.spawnRandomTile();
    this.board.spawnRandomTile();
    this.ui.render(this.board, { score: this.score, best: this.best });
    this.ui.hideOverlay();
    if (!silent && this.sound) this.sound.click();
  }

  /** After reaching 2048, allow continuing to chase a higher score. */
  continueAfterWin() {
    this.keepPlaying = true;
    this.ui.hideOverlay();
    if (this.sound) this.sound.click();
  }

  /** Toggle sound on/off (persisted). */
  toggleSound() {
    if (!this.sound) return;
    const enabled = this.sound.toggle();
    this._saveSound(enabled);
    this.ui.setSoundEnabled(enabled);
  }

  // ---------- Move handling ----------

  /**
   * Handle an attempted move in `direction`.
   * Returns true if the board actually changed.
   * @param {'up'|'down'|'left'|'right'} direction
   */
  handleMove(direction) {
    if (this._isLocked()) return false;

    // Save undo snapshot BEFORE applying the move.
    this.undoStack = [{ snap: this.board.snapshot(), score: this.score }];

    const result = this.board.move(direction);
    if (!result.moved) {
      // Nothing changed — discard the undo entry, shake the board.
      this.undoStack = [];
      this.ui.shake();
      if (this.sound) this.sound.thud();
      return false;
    }

    this.score += result.gained;
    if (this.score > this.best) {
      this.best = this.score;
      this._saveBest(this.best);
    }

    // Animate the move, then spawn a new tile.
    this.ui.animateMove(this.board, result, () => {
      // Spawn happens AFTER the slide animation finishes so kids see the new tile.
      this.board.spawnRandomTile();
      this._afterMutation(result);
    });

    if (this.sound) {
      if (result.merges.length > 0) this.sound.merge(result.merges[0].value);
      else this.sound.slide();
    }
    return true;
  }

  /** Undo a single move if available. */
  undo() {
    if (this.undoStack.length === 0) return;
    const last = this.undoStack.pop();
    this.board.restore(last.snap);
    this.score = last.score;
    this.won = false; // after undo we treat as not-won for overlay purposes.
    this.keepPlaying = false;
    this.ui.hideOverlay();
    this.ui.render(this.board, { score: this.score, best: this.best });
    if (this.sound) this.sound.click();
  }

  // ---------- Internals ----------

  /**
   * Called after a move has been applied AND a new tile has been spawned.
   * Updates the UI, checks win / lose conditions.
   */
  _afterMutation() {
    this.ui.render(this.board, { score: this.score, best: this.best });

    if (!this.keepPlaying && !this.won && this.board.hasWon(WIN_VALUE)) {
      this.won = true;
      this.ui.celebrate();
      this.ui.showOverlay({
        emoji: '🎉',
        title: 'You made 2048!',
        message: 'Amazing job! Want to play again, or keep going for a higher score?',
        primary: 'Play Again',
        secondary: 'Keep Going',
      });
      if (this.sound) this.sound.win();
      return;
    }

    if (this.board.isGameOver()) {
      this.ui.showOverlay({
        emoji: '🥺',
        title: 'No more moves!',
        message: `You scored ${this.score} points. Want to try again?`,
        primary: 'Try Again',
        secondary: 'Close',
      });
      if (this.sound) this.sound.lose();
    }
  }

  /**
   * Lock input while an animation is in flight to avoid double-moves.
   * We expose this through a counter on the UI; this just checks the flag.
   */
  _isLocked() {
    return this.ui.isAnimating;
  }

  // ---------- Persistence ----------

  _loadBest() {
    try {
      const v = parseInt(localStorage.getItem(STORAGE_KEY_BEST) || '0', 10);
      return Number.isFinite(v) ? v : 0;
    } catch {
      return 0;
    }
  }
  _saveBest(v) {
    try { localStorage.setItem(STORAGE_KEY_BEST, String(v)); } catch {}
  }
  _saveSound(enabled) {
    try { localStorage.setItem(STORAGE_KEY_SOUND, enabled ? '1' : '0'); } catch {}
  }
  _loadSound() {
    try {
      const v = localStorage.getItem(STORAGE_KEY_SOUND);
      return v === null ? true : v === '1';
    } catch {
      return true;
    }
  }
}