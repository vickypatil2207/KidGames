/**
 * game.js
 * Core game state manager, player avatars, turn progression,
 * and AI opponent logic.
 */
window.SL = window.SL || {};

window.SL.AVATARS = [
  { id: 'dog',   name: 'Puppy', emoji: '🐶', color: '#ef4444', border: '#b91c1c' },
  { id: 'cat',   name: 'Kitty', emoji: '🐱', color: '#3b82f6', border: '#1d4ed8' },
  { id: 'rabbit',name: 'Bunny', emoji: '🐰', color: '#10b981', border: '#047857' },
  { id: 'bear',  name: 'Bear',  emoji: '🐻', color: '#f59e0b', border: '#b45309' }
];

window.SL.Game = class Game {
  constructor(config = {}) {
    this.mode = config.mode || 'local'; // 'local' or 'computer'
    this.playerCount = config.playerCount || 2;
    this.players = [];
    this.currentTurn = 0;
    this.isGameOver = false;
    this.isAnimating = false;

    this.onTurnChange = config.onTurnChange || null;
    this.onMoveStep = config.onMoveStep || null;
    this.onSpecialMove = config.onSpecialMove || null;
    this.onGameOver = config.onGameOver || null;

    this._setupPlayers(config.names || []);
  }

  _setupPlayers(customNames) {
    this.players = [];
    const count = this.mode === 'computer' ? 2 : this.playerCount;

    for (let i = 0; i < count; i++) {
      const avatar = window.SL.AVATARS[i % window.SL.AVATARS.length];
      const isAI = (this.mode === 'computer' && i === 1);
      const defaultName = isAI ? 'Robo AI 🤖' : (customNames[i] || `Player ${i + 1}`);

      this.players.push({
        id: i,
        name: defaultName,
        emoji: avatar.emoji,
        color: avatar.color,
        border: avatar.border,
        pos: 1, // Start at square 1
        isAI
      });
    }
  }

  getCurrentPlayer() {
    return this.players[this.currentTurn];
  }

  /**
   * Process a turn roll result
   */
  async handleRoll(rollValue, board) {
    if (this.isGameOver || this.isAnimating) return;
    this.isAnimating = true;

    const player = this.getCurrentPlayer();
    const startPos = player.pos;
    let targetPos = startPos + rollValue;

    // Bounce back or Stay if roll exceeds 100
    if (targetPos > 100) {
      // Stay in place if roll exceeds 100 (Classic exact landing rule)
      targetPos = startPos;
    }

    // 1. Step-by-step hop animation
    if (targetPos > startPos) {
      for (let curr = startPos + 1; curr <= targetPos; curr++) {
        player.pos = curr;
        if (this.onMoveStep) {
          await this.onMoveStep(player, curr);
        }
      }
    }

    // 2. Check Snake or Ladder on target tile
    const entity = board.checkEntity(player.pos);
    if (entity) {
      if (this.onSpecialMove) {
        await this.onSpecialMove(player, entity);
      }
      player.pos = entity.target;
      if (this.onMoveStep) {
        await this.onMoveStep(player, entity.target, true);
      }
    }

    // 3. Check Victory (pos === 100)
    if (player.pos === 100) {
      this.isGameOver = true;
      this.isAnimating = false;
      if (this.onGameOver) {
        this.onGameOver(player);
      }
      return;
    }

    // 4. Handle extra roll on 6 or switch turn
    const rolledSix = (rollValue === 6);
    if (!rolledSix) {
      this.currentTurn = (this.currentTurn + 1) % this.players.length;
    }

    this.isAnimating = false;

    if (this.onTurnChange) {
      this.onTurnChange(this.getCurrentPlayer(), rolledSix);
    }
  }
};
