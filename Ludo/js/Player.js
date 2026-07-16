/**
 * Player.js
 * Represents a Ludo player (Human or Computer) and manages their tokens.
 */
class Player {
  constructor(id, name, color, character, isComputer = false) {
    this.id = id;
    this.name = name;
    this.color = color; // 'red', 'green', 'yellow', 'blue'
    this.character = character; // emoji e.g., '🐭'
    this.isComputer = isComputer;
    
    this.tokens = [];
    this.reset();
  }

  /**
   * Put all 4 tokens back in the yard (-1)
   */
  reset() {
    this.tokens = Array.from({ length: 4 }, (_, idx) => ({
      id: idx,
      position: -1, // -1: Yard, 0: Start Cell, 1..50: Common Track, 51..55: Home Run, 56: Home Center
      color: this.color,
      character: this.character,
      get isYard() {
        return this.position === -1;
      },
      get isHome() {
        return this.position === 56;
      },
      get isActive() {
        return this.position >= 0 && this.position < 56;
      }
    }));
  }

  /**
   * Check if all 4 tokens have reached the home center
   */
  hasFinished() {
    return this.tokens.every(token => token.isHome);
  }

  /**
   * Count the number of tokens that reached home
   */
  getFinishedCount() {
    return this.tokens.filter(token => token.isHome).length;
  }
}
