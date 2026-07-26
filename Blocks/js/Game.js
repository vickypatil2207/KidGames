/**
 * Game.js
 * Core engine managing game state, gravity loops, piece movements, line clear scoring, and high scores.
 */

import { Board } from './Board.js';
import { getRandomShape, rotateMatrix } from './Shapes.js';

export class Game {
  constructor(soundManager, onStateUpdate) {
    this.sound = soundManager;
    this.onStateUpdate = onStateUpdate;

    this.gridWidth = 8;
    this.gridHeight = 8;
    this.board = new Board(this.gridWidth, this.gridHeight);

    this.score = 0;
    this.bestScore = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;

    this.isPaused = false;
    this.isGameOver = false;
    this.isClearing = false;

    this.currentPiece = null;
    this.nextPiece = null;
    this.holdPiece = null;
    this.canSwapHold = true;

    // Gravity loop
    this.lastTime = 0;
    this.dropCounter = 0;
    this.dropInterval = 800;

    this._loadBestScore();
    this.init();
  }

  _getStorageKey() {
    return `block_game_best_${this.gridWidth}x${this.gridHeight}`;
  }

  _loadBestScore() {
    const key = this._getStorageKey();
    this.bestScore = parseInt(localStorage.getItem(key) || '0', 10);
  }

  _saveBestScore() {
    if (this.score > this.bestScore) {
      this.bestScore = this.score;
      localStorage.setItem(this._getStorageKey(), this.bestScore.toString());
    }
  }

  setGridSize(sizeStr) {
    const [w, h] = sizeStr.split('x').map(Number);
    if (w && h) {
      this.gridWidth = w;
      this.gridHeight = h;
      this._loadBestScore();
      this.restart();
    }
  }

  init() {
    this.score = 0;
    this.level = 1;
    this.lines = 0;
    this.combo = 0;
    this.dropInterval = Math.max(150, 850 - (this.level - 1) * 60);
    this.isPaused = false;
    this.isGameOver = false;
    this.isClearing = false;
    this.holdPiece = null;
    this.canSwapHold = true;

    this.board.reset(this.gridWidth, this.gridHeight);

    this.nextPiece = getRandomShape();
    this.spawnPiece();

    this.notifyUpdate();
  }

  restart() {
    this.init();
  }

  spawnPiece() {
    // Find first filled row in matrix
    let firstFilledRow = 0;
    for (let r = 0; r < this.nextPiece.matrix.length; r++) {
      if (this.nextPiece.matrix[r].some(val => val === 1)) {
        firstFilledRow = r;
        break;
      }
    }

    const spawnY = -firstFilledRow;
    const spawnX = Math.floor((this.gridWidth - this.nextPiece.matrix[0].length) / 2);

    this.currentPiece = {
      ...this.nextPiece,
      x: spawnX,
      y: spawnY
    };

    this.nextPiece = getRandomShape();
    this.canSwapHold = true;

    // Check if spawn position is blocked
    if (!this.board.isValidMove(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y)) {
      // Try offset -1 if top row is occupied
      if (this.board.isValidMove(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y - 1)) {
        this.currentPiece.y--;
      } else {
        this.triggerGameOver();
      }
    }
  }

  swapHold() {
    if (!this.canSwapHold || this.isPaused || this.isGameOver || this.isClearing) return;

    this.sound.swap();
    if (!this.holdPiece) {
      this.holdPiece = {
        name: this.currentPiece.name,
        matrix: this.currentPiece.matrix.map(r => [...r]),
        color: this.currentPiece.color
      };
      this.spawnPiece();
    } else {
      const temp = {
        name: this.currentPiece.name,
        matrix: this.currentPiece.matrix.map(r => [...r]),
        color: this.currentPiece.color
      };
      this.currentPiece = {
        ...this.holdPiece,
        x: Math.floor((this.gridWidth - this.holdPiece.matrix[0].length) / 2),
        y: 0
      };
      this.holdPiece = temp;
    }

    this.canSwapHold = false;
    this.notifyUpdate();
  }

  moveLeft() {
    if (this.canControl() && this.board.isValidMove(this.currentPiece.matrix, this.currentPiece.x - 1, this.currentPiece.y)) {
      this.currentPiece.x--;
      this.sound.move();
      this.notifyUpdate();
      return true;
    }
    return false;
  }

  moveRight() {
    if (this.canControl() && this.board.isValidMove(this.currentPiece.matrix, this.currentPiece.x + 1, this.currentPiece.y)) {
      this.currentPiece.x++;
      this.sound.move();
      this.notifyUpdate();
      return true;
    }
    return false;
  }

  rotate() {
    if (!this.canControl()) return false;

    const rotated = rotateMatrix(this.currentPiece.matrix);

    // Test wall kick offsets: (0,0), (-1,0), (1,0), (-2,0), (2,0), (0,-1), (-1,-1), (1,-1)
    const kickOffsets = [
      [0, 0], [-1, 0], [1, 0], [-2, 0], [2, 0], [0, -1], [-1, -1], [1, -1]
    ];

    for (const [dx, dy] of kickOffsets) {
      if (this.board.isValidMove(rotated, this.currentPiece.x + dx, this.currentPiece.y + dy)) {
        this.currentPiece.matrix = rotated;
        this.currentPiece.x += dx;
        this.currentPiece.y += dy;
        this.sound.rotate();
        this.notifyUpdate();
        return true;
      }
    }

    return false;
  }

  softDrop() {
    if (!this.canControl()) return false;

    if (this.board.isValidMove(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
      this.currentPiece.y++;
      this.score += 1;
      this._saveBestScore();
      this.sound.move();
      this.notifyUpdate();
      return true;
    } else {
      this.lockCurrentPiece();
      return false;
    }
  }

  hardDrop() {
    if (!this.canControl()) return;

    let distance = 0;
    while (this.board.isValidMove(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
      this.currentPiece.y++;
      distance++;
    }

    this.score += distance * 2;
    this._saveBestScore();
    this.sound.hardDrop();
    this.lockCurrentPiece();
  }

  lockCurrentPiece() {
    const overflow = this.board.lockPiece(this.currentPiece);
    if (overflow) {
      this.triggerGameOver();
      return;
    }

    this.sound.drop();

    // Check for full line clears
    const fullRows = this.board.getFullRows();
    if (fullRows.length > 0) {
      this.handleLineClears(fullRows);
    } else {
      this.combo = 0;
      this.spawnPiece();
      this.notifyUpdate();
    }
  }

  handleLineClears(rows) {
    this.isClearing = true;
    this.combo++;

    const baseScores = [0, 100, 300, 500, 800];
    const clearedCount = Math.min(rows.length, 4);
    const lineScore = (baseScores[clearedCount] || (clearedCount * 200)) * this.level;
    const comboScore = this.combo > 1 ? (this.combo * 50 * this.level) : 0;

    this.score += lineScore + comboScore;
    this.lines += rows.length;

    const newLevel = Math.floor(this.lines / 8) + 1;
    if (newLevel > this.level) {
      this.level = newLevel;
      this.dropInterval = Math.max(120, 850 - (this.level - 1) * 60);
      this.sound.levelUp();
    } else {
      this.sound.lineClear(rows.length);
      if (this.combo > 1) this.sound.combo(this.combo);
    }

    this._saveBestScore();

    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: 'LINE_CLEAR',
        clearedRows: rows,
        linesCount: rows.length,
        combo: this.combo
      });
    }

    setTimeout(() => {
      this.board.clearRows(rows);
      this.isClearing = false;
      this.spawnPiece();
      this.notifyUpdate();
    }, 280);
  }

  canControl() {
    return !this.isPaused && !this.isGameOver && !this.isClearing && this.currentPiece !== null;
  }

  togglePause() {
    if (this.isGameOver) return;
    this.isPaused = !this.isPaused;
    this.notifyUpdate();
  }

  triggerGameOver() {
    this.isGameOver = true;
    this.sound.gameOver();
    this.notifyUpdate({ type: 'GAME_OVER' });
  }

  update(time = 0) {
    if (this.isPaused || this.isGameOver || this.isClearing) {
      this.lastTime = time;
      return;
    }

    const deltaTime = time - this.lastTime;
    this.lastTime = time;
    this.dropCounter += deltaTime;

    if (this.dropCounter > this.dropInterval) {
      this.dropCounter = 0;
      if (this.currentPiece) {
        if (this.board.isValidMove(this.currentPiece.matrix, this.currentPiece.x, this.currentPiece.y + 1)) {
          this.currentPiece.y++;
          this.notifyUpdate();
        } else {
          this.lockCurrentPiece();
        }
      }
    }
  }

  notifyUpdate(eventData = null) {
    if (this.onStateUpdate) {
      this.onStateUpdate({
        type: eventData ? eventData.type : 'STATE_CHANGE',
        score: this.score,
        bestScore: this.bestScore,
        level: this.level,
        lines: this.lines,
        combo: this.combo,
        isPaused: this.isPaused,
        isGameOver: this.isGameOver,
        currentPiece: this.currentPiece,
        nextPiece: this.nextPiece,
        holdPiece: this.holdPiece,
        board: this.board
      });
    }
  }
}
