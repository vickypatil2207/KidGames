/**
 * Game.js
 * The main controller. Wires together Board, Players, Dice, and UIManager
 * and runs the turn-based game loop.
 */
window.SL = window.SL || {};
const { Board, Dice, UIManager } = window.SL;

const STEP_DELAY_MS    = 220;   // delay between cell-to-cell hops
const POST_ROLL_DELAY  = 250;   // small pause before the player hops
const SNAKE_DROP_DELAY = 250;   // pause after landing on a snake

window.SL.Game = class Game {
  /**
   * @param {object} els - Cached DOM elements (see main.js).
   */
  constructor(els) {
    this.board     = new Board(els.boardEl);
    this.dice      = new Dice();
    this.ui        = new UIManager(els);

    this.players     = [];
    this.activeIdx   = 0;
    this.rolling     = false;
    this.computerIdx = -1;
    this.gameOver    = false;

    this._bindEvents();
    this._initSetup();
  }

  /* ---------- Setup ---------- */

  _initSetup() {
    this.ui.initSetup((configs, computerIdx) => {
      this.computerIdx = computerIdx;
      this.players = this.ui.buildPlayers(configs, computerIdx);
      this._resetState();
    });
  }

  _bindEvents() {
    this.ui.onRoll(() => this._onRoll());
    this.ui.onDiceClick(() => {
      if (!this.rolling) this._onRoll();
    });
    this.ui.onReset(() => this.reset());
    this.ui.onModalClose(() => {
      this.ui.hideWinner();
      this.ui.showSetup();
    });
  }

  _resetState() {
    this.ui.resetTokens();
    this.activeIdx = 0;
    this.rolling   = false;
    this.gameOver  = false;
    this.ui.setRollingState(false);
    this.ui.setDiceFace(1);
    this._refreshActive();
    this.ui.log('New game started — good luck, friends!', '#999', '🌟');
    this._scheduleComputerTurn();
  }

  reset() {
    this.ui.showSetup();
  }

  _refreshActive() {
    const p = this.players[this.activeIdx];
    this.ui.setActivePlayer(p);
  }

  _scheduleComputerTurn() {
    if (this.gameOver) return;
    const player = this.players[this.activeIdx];
    if (player && player.isComputer && !this.rolling) {
      setTimeout(() => this._onRoll(), 800);
    }
  }

  /* ---------- Turn loop ---------- */

  async _onRoll() {
    if (this.rolling) return;
    this.rolling = true;
    this.ui.setRollingState(true);

    const player = this.players[this.activeIdx];

    // 1. Roll
    this.ui.log(`${player.emoji} ${player.name} is rolling…`, player.color, '🎲');
    await this.ui.animateDice();
    const roll = this.dice.roll();
    this.ui.setDiceFace(roll);
    this.ui.log(`${player.emoji} ${player.name} rolled a ${roll}`, player.color, '🎯');

    // 2. Walk
    await this._wait(POST_ROLL_DELAY);
    await this._moveSteps(player, roll);

    // 3. Resolve snake / ladder / win
    await this._resolveCell(player);

    // 4. Hand over turn (or end game)
    if (player.hasWon) {
      this.gameOver = true;
      this.ui.markWinner(player);
      this.ui.showWinner(player);
      this.rolling = false;
      this.ui.setRollingState(false);
      return;
    }
    this.activeIdx = (this.activeIdx + 1) % this.players.length;
    this._refreshActive();
    this.rolling = false;
    this.ui.setRollingState(false);
    this._scheduleComputerTurn();
  }

  async _moveSteps(player, steps) {
    // Bounce out of turn-start position so the move feels alive.
    this.ui.popToken(player);

    const start = player.position;
    const end   = Math.min(100, start + steps);
    const dir   = end >= start ? 1 : -1;
    for (let p = start + dir; ; p += dir) {
      player.moveTo(p);
      this.ui.moveTokenTo(player, p);
      this.ui.updatePlayerPosition(player);
      if (p === end) break;
      await this._wait(STEP_DELAY_MS);
    }
  }

  async _resolveCell(player) {
    const cell = player.position;

    // Ladder first (bottom → top)
    const ladder = this.board.ladders.find((l) => l.involves(cell));
    if (ladder) {
      this.ui.log(`${player.emoji} Climbed a ladder! +${ladder.rise}`, player.color, '🪜');
      await this._wait(SNAKE_DROP_DELAY);
      await this._slideTo(player, ladder.top, '+', ladder.rise);
      return this._resolveCell(player);
    }

    // Snake (head → tail)
    const snake = this.board.snakes.find((s) => s.involves(cell));
    if (snake) {
      this.ui.log(`${player.emoji} Bitten by a snake! -${snake.drop}`, player.color, '🐍');
      await this._wait(SNAKE_DROP_DELAY);
      await this._slideTo(player, snake.tail, '-', snake.drop);
      return this._resolveCell(player);
    }

    // Win check
    if (player.position === 100) {
      player.hasWon = true;
      this.ui.log(`🏆 ${player.emoji} ${player.name} reached 100 and wins!`, player.color, '🏆');
    }
  }

  async _slideTo(player, destination, sign, magnitude) {
    // Slide in 2-cell hops so the visual is smooth.
    const start = player.position;
    const step  = start < destination ? 2 : -2;
    for (let p = start + step; ; p += step) {
      const next = (step > 0)
        ? Math.min(destination, p)
        : Math.max(destination, p);
      player.moveTo(next);
      this.ui.moveTokenTo(player, next);
      this.ui.updatePlayerPosition(player);
      if (next === destination) break;
      await this._wait(140);
    }
    this.ui.popToken(player);
  }

  _wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
};
