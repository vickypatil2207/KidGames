/**
 * Board.js
 * Configures the Ludo 15x15 board coordinates, paths, safe cells, and yards.
 */
class Board {
  constructor() {
    // 52 common path track coordinates starting from left arm top-left (6, 0) clockwise
    this.track = [
      { r: 6, c: 0 }, { r: 6, c: 1 }, { r: 6, c: 2 }, { r: 6, c: 3 }, { r: 6, c: 4 }, { r: 6, c: 5 }, // Left arm top row
      { r: 5, c: 6 }, { r: 4, c: 6 }, { r: 3, c: 6 }, { r: 2, c: 6 }, { r: 1, c: 6 }, { r: 0, c: 6 }, // Top arm left col
      { r: 0, c: 7 },                                                                               // Top center
      { r: 0, c: 8 }, { r: 1, c: 8 }, { r: 2, c: 8 }, { r: 3, c: 8 }, { r: 4, c: 8 }, { r: 5, c: 8 }, // Top arm right col
      { r: 6, c: 9 }, { r: 6, c: 10 }, { r: 6, c: 11 }, { r: 6, c: 12 }, { r: 6, c: 13 }, { r: 6, c: 14 }, // Right arm top row
      { r: 7, c: 14 },                                                                              // Right center
      { r: 8, c: 14 }, { r: 8, c: 13 }, { r: 8, c: 12 }, { r: 8, c: 11 }, { r: 8, c: 10 }, { r: 8, c: 9 }, // Right arm bottom row
      { r: 9, c: 8 }, { r: 10, c: 8 }, { r: 11, c: 8 }, { r: 12, c: 8 }, { r: 13, c: 8 }, { r: 14, c: 8 }, // Bottom arm right col
      { r: 14, c: 7 },                                                                              // Bottom center
      { r: 14, c: 6 }, { r: 13, c: 6 }, { r: 12, c: 6 }, { r: 11, c: 6 }, { r: 10, c: 6 }, { r: 9, c: 6 }, // Bottom arm left col
      { r: 8, c: 5 }, { r: 8, c: 4 }, { r: 8, c: 3 }, { r: 8, c: 2 }, { r: 8, c: 1 }, { r: 8, c: 0 }, // Left arm bottom row
      { r: 7, c: 0 }                                                                                // Left center
    ];

    // Player color index settings
    // 0: Red, 1: Green, 2: Yellow, 3: Blue
    this.colorNames = ['red', 'green', 'yellow', 'blue'];

    // Start index in the track array for each player
    this.startIndices = {
      red: 1,      // (6, 1)
      green: 14,   // (1, 8)
      yellow: 27,  // (8, 13)
      blue: 40     // (13, 6)
    };

    // Track index immediately before entering the home run path
    this.entryIndices = {
      red: 50,     // (8, 0) -> from there goes into home path instead of (7, 0)
      green: 11,   // (0, 6) -> from there goes to home path instead of (0, 7)
      yellow: 24,  // (6, 14) -> from there goes to home path instead of (7, 14)
      blue: 37     // (14, 8) -> from there goes to home path instead of (14, 7)
    };

    // Home Run path coordinates (5 cells each) and the final 6th cell which is the home triangle
    this.homePaths = {
      red: [
        { r: 7, c: 1 }, { r: 7, c: 2 }, { r: 7, c: 3 }, { r: 7, c: 4 }, { r: 7, c: 5 },
        { r: 7, c: 6 } // Home center left triangle
      ],
      green: [
        { r: 1, c: 7 }, { r: 2, c: 7 }, { r: 3, c: 7 }, { r: 4, c: 7 }, { r: 5, c: 7 },
        { r: 6, c: 7 } // Home center top triangle
      ],
      yellow: [
        { r: 7, c: 13 }, { r: 7, c: 12 }, { r: 7, c: 11 }, { r: 7, c: 10 }, { r: 7, c: 9 },
        { r: 7, c: 8 } // Home center right triangle
      ],
      blue: [
        { r: 13, c: 7 }, { r: 12, c: 7 }, { r: 11, c: 7 }, { r: 10, c: 7 }, { r: 9, c: 7 },
        { r: 8, c: 7 } // Home center bottom triangle
      ]
    };

    // Safe indices on the track
    this.safeIndices = [1, 9, 14, 21, 27, 34, 40, 48];

    // Pocket positions for the 4 tokens of each base
    this.pockets = {
      red: [
        { r: 2, c: 2 }, { r: 2, c: 3 }, { r: 3, c: 2 }, { r: 3, c: 3 }
      ],
      green: [
        { r: 2, c: 11 }, { r: 2, c: 12 }, { r: 3, c: 11 }, { r: 3, c: 12 }
      ],
      yellow: [
        { r: 11, c: 11 }, { r: 11, c: 12 }, { r: 12, c: 11 }, { r: 12, c: 12 }
      ],
      blue: [
        { r: 11, c: 2 }, { r: 11, c: 3 }, { r: 12, c: 2 }, { r: 12, c: 3 }
      ]
    };
  }

  /**
   * Get the absolute coordinate of a cell based on token position
   * @param {string} color - Player color ('red', 'green', 'yellow', 'blue')
   * @param {number} position - Step count (-1 = yard, 0..50 = main track, 51..55 = home stretch, 56 = home)
   * @param {number} tokenIdx - Token index (0..3) used to locate the pocket if in the yard
   */
  getCoordinate(color, position, tokenIdx) {
    if (position === -1) {
      // In the yard
      return this.pockets[color][tokenIdx];
    } else if (position >= 51 && position <= 56) {
      // In the home run path
      const homePathIdx = position - 51;
      return this.homePaths[color][homePathIdx];
    } else {
      // On the common track path. Note that the player's track start cell index is different!
      // The token steps are relative: step 0 is the start cell, step 50 is the entry cell before home path
      const startIdx = this.startIndices[color];
      const trackIdx = (startIdx + position) % 52;
      return this.track[trackIdx];
    }
  }

  /**
   * Check if a track coordinate is a safe cell
   * @param {number} r - Row coordinate
   * @param {number} c - Column coordinate
   */
  isSafeCell(r, c) {
    // Check if it's one of the 8 track safe cells
    const onTrackIdx = this.track.findIndex(cell => cell.r === r && cell.c === c);
    if (onTrackIdx !== -1 && this.safeIndices.includes(onTrackIdx)) {
      return true;
    }
    // Home runs are always safe
    for (const color in this.homePaths) {
      if (this.homePaths[color].some(cell => cell.r === r && cell.c === c)) {
        return true;
      }
    }
    // Yard pockets are safe
    for (const color in this.pockets) {
      if (this.pockets[color].some(cell => cell.r === r && cell.c === c)) {
        return true;
      }
    }
    return false;
  }
}
