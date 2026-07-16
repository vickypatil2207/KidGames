/**
 * Game.js
 * The core Ludo game rules, turn state, captures, and AI decision making.
 */
class Game {
  constructor(uiManager) {
    this.ui = uiManager;
    this.board = new Board();
    this.players = [];
    this.currentPlayerIdx = 0;
    this.diceRoll = null;
    this.gamePhase = 'setup'; // 'setup', 'rolling', 'moving', 'finished'
    
    this.winnerList = [];
    this.consecutiveSixes = 0;
    this.extraTurnAwarded = false;
  }

  /**
   * Initialize a new game with the given player configurations
   * @param {Array} playersConfig - Array of { name, isComputer, character }
   */
  setupGame(playersConfig) {
    this.players = [];
    this.winnerList = [];
    this.currentPlayerIdx = 0;
    this.diceRoll = null;
    this.consecutiveSixes = 0;
    this.extraTurnAwarded = false;

    // Ludo colors assigned based on order: Red (0), Green (1), Yellow (2), Blue (3)
    const colors = ['red', 'green', 'yellow', 'blue'];
    
    playersConfig.forEach((cfg, idx) => {
      const color = colors[idx];
      const player = new Player(idx, cfg.name || `Player ${idx + 1}`, color, cfg.character, cfg.isComputer);
      this.players.push(player);
    });

    this.gamePhase = 'rolling';
    this.ui.initBoard(this.board, this.players);
    this.ui.updatePlayerList(this.players, this.currentPlayerIdx);
    this.ui.logMessage(`🎮 Game started! Let's play Ludo Party!`);
    
    this.startTurn();
  }

  /**
   * Start the turn for the current player
   */
  async startTurn() {
    const player = this.getCurrentPlayer();
    this.diceRoll = null;
    this.extraTurnAwarded = false;
    
    this.ui.updateActivePlayer(player);
    this.ui.updatePlayerList(this.players, this.currentPlayerIdx);
    this.ui.setDiceRollMessage(`${player.character} ${player.name}'s turn to roll!`);
    this.ui.setDiceTheme(player.color);

    this.gamePhase = 'rolling';

    if (player.isComputer) {
      this.ui.setDiceEnabled(false);
      // Wait a moment for CPU to feel natural
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Auto-trigger roll
      this.ui.triggerDiceRoll();
    } else {
      this.ui.setDiceEnabled(true);
    }
  }

  /**
   * Resolve a dice roll
   * @param {number} rolledValue 
   */
  async handleDiceRoll(rolledValue) {
    this.diceRoll = rolledValue;
    const player = this.getCurrentPlayer();
    
    this.ui.logMessage(`${player.character} ${player.name} rolled a ${rolledValue}!`);

    // Check consecutive sixes rule (cap at 3)
    if (rolledValue === 6) {
      this.consecutiveSixes++;
      if (this.consecutiveSixes === 3) {
        this.ui.logMessage(`😮 Oops! 3 Sixes in a row! Turn passes.`);
        this.consecutiveSixes = 0;
        this.nextTurn();
        return;
      }
      this.extraTurnAwarded = true;
    } else {
      this.consecutiveSixes = 0;
    }

    // Get movable tokens
    const validMoves = this.getValidMoves(player, rolledValue);

    if (validMoves.length === 0) {
      this.ui.setDiceRollMessage(`No moves possible for ${player.name}!`);
      this.ui.logMessage(`😅 No moves possible for ${player.character} ${player.name}.`);
      
      // Delay before next turn
      await new Promise(resolve => setTimeout(resolve, 1500));
      this.nextTurn();
    } else {
      this.gamePhase = 'moving';
      this.ui.setDiceRollMessage(`Select a token to move ${rolledValue} spaces!`);
      
      if (player.isComputer) {
        // AI chooses the best token to move
        await new Promise(resolve => setTimeout(resolve, 1000));
        const bestToken = this.getBestAIMove(player, rolledValue, validMoves);
        await this.executeMove(player, bestToken, rolledValue);
      } else {
        // Highlights the movable tokens on the board
        this.ui.highlightMovableTokens(player, validMoves, async (clickedToken) => {
          this.ui.clearHighlights();
          await this.executeMove(player, clickedToken, rolledValue);
        });
      }
    }
  }

  /**
   * Get all tokens for a player that can make a valid move with the rolled value
   * @param {Player} player 
   * @param {number} roll 
   */
  getValidMoves(player, roll) {
    return player.tokens.filter(token => {
      // If in yard, needs exactly a 6 to start
      if (token.isYard) {
        return roll === 6;
      }
      // If on path, needs stepCount + roll <= 56 (Home)
      if (token.position + roll <= 56) {
        return true;
      }
      return false;
    });
  }

  /**
   * Animate and update game state after choosing a token
   * @param {Player} player 
   * @param {object} token 
   * @param {number} roll 
   */
  async executeMove(player, token, roll) {
    this.ui.setDiceEnabled(false);
    
    // Release from yard
    if (token.isYard && roll === 6) {
      token.position = 0; // Release to start cell
      this.ui.logMessage(`✨ ${player.character} released a token to the field!`);
      await this.ui.animateTokenPosition(player, token);
    } else {
      // Step-by-step movement animation
      const startPos = token.position;
      const endPos = token.position + roll;
      
      for (let pos = startPos + 1; pos <= endPos; pos++) {
        token.position = pos;
        await this.ui.animateTokenStep(player, token);
      }
      this.ui.logMessage(`🏃 ${player.character} moved token forward ${roll} steps.`);
    }

    // Check if token landed on opponent to capture
    const coordinate = this.board.getCoordinate(player.color, token.position, token.id);
    const captureOccurred = await this.checkCaptures(coordinate, player);
    
    if (captureOccurred) {
      this.extraTurnAwarded = true; // Landing on someone gives another turn!
    }

    // Check if player has completed the game (all 4 tokens home)
    if (player.hasFinished()) {
      if (!this.winnerList.includes(player)) {
        this.winnerList.push(player);
        this.ui.logMessage(`🏆 HOORAY! ${player.character} ${player.name} finished all tokens!`);
        
        // Show winner dialog immediately if it's the first or if no human players remain
        const activeHumans = this.players.filter(p => !p.isComputer && !p.hasFinished());
        const activePlayers = this.players.filter(p => !p.hasFinished());

        if (activeHumans.length === 0 || activePlayers.length <= 1 || this.winnerList.length === 1) {
          this.gamePhase = 'finished';
          this.ui.showWinnerScreen(this.winnerList, this.players);
          return;
        }
      }
    }

    // Pass turn or roll again
    if (this.extraTurnAwarded && this.gamePhase !== 'finished') {
      this.ui.logMessage(`🎉 Extra roll awarded to ${player.character} ${player.name}!`);
      this.startTurn();
    } else {
      this.nextTurn();
    }
  }

  /**
   * Check if landing coordinate captures any opponent tokens
   * @param {object} coord - { r, c }
   * @param {Player} currentLandedPlayer
   */
  async checkCaptures(coord, currentLandedPlayer) {
    // Cannot capture on safe cells
    if (this.board.isSafeCell(coord.r, coord.c)) {
      return false;
    }

    let captureHappened = false;

    for (const player of this.players) {
      // Don't capture own tokens
      if (player.id === currentLandedPlayer.id) continue;
      if (player.hasFinished()) continue;

      for (const token of player.tokens) {
        if (token.isActive) {
          const opponentCoord = this.board.getCoordinate(player.color, token.position, token.id);
          if (opponentCoord.r === coord.r && opponentCoord.c === coord.c) {
            // Found a token of an opponent on the same cell! Send it back to yard.
            token.position = -1;
            this.ui.logMessage(`💥 Tagged! ${currentLandedPlayer.character} sent ${player.character}'s token back to the yard!`);
            await this.ui.animateTokenCapture(player, token);
            captureHappened = true;
          }
        }
      }
    }

    return captureHappened;
  }

  /**
   * Cycle to next player who has not finished
   */
  nextTurn() {
    if (this.gamePhase === 'finished') return;

    this.consecutiveSixes = 0; // reset consecutive count as we're passing turn

    let attempts = 0;
    do {
      this.currentPlayerIdx = (this.currentPlayerIdx + 1) % this.players.length;
      attempts++;
    } while (this.players[this.currentPlayerIdx].hasFinished() && attempts < this.players.length);

    // If all (or all but one) players are finished, trigger game end
    const activePlayers = this.players.filter(p => !p.hasFinished());
    if (activePlayers.length <= 1) {
      this.gamePhase = 'finished';
      this.ui.showWinnerScreen(this.winnerList, this.players);
    } else {
      this.startTurn();
    }
  }

  /**
   * Helper to get active player
   */
  getCurrentPlayer() {
    return this.players[this.currentPlayerIdx];
  }

  /**
   * AI Decision logic
   * Returns chosen token to move
   */
  getBestAIMove(player, roll, validMoves) {
    let bestToken = null;
    let maxWeight = -Infinity;

    validMoves.forEach(token => {
      let weight = 0;

      // 1. Prioritize capturing an opponent
      const nextPos = token.isYard ? 0 : token.position + roll;
      const nextCoord = this.board.getCoordinate(player.color, nextPos, token.id);
      
      const canCapture = this.willCaptureOpponent(nextCoord, player);
      if (canCapture && !this.board.isSafeCell(nextCoord.r, nextCoord.c)) {
        weight += 1000;
      }

      // 2. Prioritize releasing from yard
      if (token.isYard && roll === 6) {
        weight += 900;
      }

      // 3. Prioritize landing home (exact roll)
      if (nextPos === 56) {
        weight += 850;
      }

      // 4. Prioritize entering home run path (safe stretch)
      if (token.position <= 50 && nextPos >= 51) {
        weight += 750;
      }

      // 5. Prioritize landing on safe cell (stars)
      if (this.board.isSafeCell(nextCoord.r, nextCoord.c)) {
        weight += 500;
      }

      // 6. Escape danger: If an opponent is 1-6 spaces behind the token
      if (token.isActive && this.isInDanger(token, player)) {
        weight += 600;
      }

      // 7. Base progression weight (favor tokens further along)
      weight += (token.position * 2);

      // Select max weight
      if (weight > maxWeight) {
        maxWeight = weight;
        bestToken = token;
      }
    });

    return bestToken || validMoves[0];
  }

  /**
   * Check if a coordinate will capture an opponent
   */
  willCaptureOpponent(coord, currentPlayer) {
    return this.players.some(player => {
      if (player.id === currentPlayer.id) return false;
      return player.tokens.some(t => {
        if (!t.isActive) return false;
        const opponentCoord = this.board.getCoordinate(player.color, t.position, t.id);
        return opponentCoord.r === coord.r && opponentCoord.c === coord.c;
      });
    });
  }

  /**
   * Check if token is in danger (opponent is behind it on a non-safe cell)
   */
  isInDanger(token, currentPlayer) {
    const currentCoord = this.board.getCoordinate(currentPlayer.color, token.position, token.id);
    if (this.board.isSafeCell(currentCoord.r, currentCoord.c)) return false;

    // Find the absolute index of this token on the 52-cell board track
    const startIdx = this.board.startIndices[currentPlayer.color];
    const absoluteTrackIdx = (startIdx + token.position) % 52;

    return this.players.some(opponent => {
      if (opponent.id === currentPlayer.id) return false;
      return opponent.tokens.some(opponentToken => {
        if (!opponentToken.isActive || opponentToken.position > 50) return false;

        const oppStartIdx = this.board.startIndices[opponent.color];
        const oppAbsTrackIdx = (oppStartIdx + opponentToken.position) % 52;

        // Check if opponent is within 6 cells behind along the loop
        let distanceBehind = absoluteTrackIdx - oppAbsTrackIdx;
        if (distanceBehind < 0) {
          distanceBehind += 52;
        }

        return distanceBehind > 0 && distanceBehind <= 6;
      });
    });
  }
}
