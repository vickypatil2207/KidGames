/**
 * ComputerPlayer.js
 * -----------------
 * AI opponent. Inherits from Player and uses a layered strategy:
 *   1) Win immediately if possible.
 *   2) Block opponent's immediate win.
 *   3) Take the center if free.
 *   4) Take any corner opposite an opponent corner.
 *   5) Take any empty corner.
 *   6) Take any empty side.
 * Hard to beat for a kids' game, but still feels playful.
 */

class ComputerPlayer extends Player {
  constructor(symbol, emoji = "🤖") {
    super("Computer", symbol, emoji);
  }

  /**
   * Pick the best available index from the current board.
   * @param {Board} board
   * @param {string} aiSymbol
   * @param {string} opponentSymbol
   * @returns {number} chosen cell index (0-8)
   */
  chooseMove(board, aiSymbol, opponentSymbol) {
    const WIN_PATTERNS = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];

    const findWinningMove = (sym) =>
      WIN_PATTERNS.find(([a, b, c]) => {
        const line = [board.getCell(a), board.getCell(b), board.getCell(c)];
        const empties = [a, b, c].filter((i) => board.getCell(i) === null);
        if (empties.length !== 1) return false;
        return line.filter((v) => v === sym).length === 2;
      });

    // 1) Win
    const winLine = findWinningMove(aiSymbol);
    if (winLine) {
      return [winLine[0], winLine[1], winLine[2]].find((i) => board.getCell(i) === null);
    }

    // 2) Block
    const blockLine = findWinningMove(opponentSymbol);
    if (blockLine) {
      return [blockLine[0], blockLine[1], blockLine[2]].find((i) => board.getCell(i) === null);
    }

    // 3) Center
    if (board.getCell(4) === null) return 4;

    // 4) Opposite corner
    const corners = [0, 2, 6, 8];
    const oppositeMap = { 0: 8, 2: 6, 6: 2, 8: 0 };
    for (const c of corners) {
      if (board.getCell(c) === opponentSymbol) {
        const opp = oppositeMap[c];
        if (board.getCell(opp) === null) return opp;
      }
    }

    // 5) Any empty corner
    const freeCorner = corners.find((i) => board.getCell(i) === null);
    if (freeCorner !== undefined) return freeCorner;

    // 6) Any empty side
    const sides = [1, 3, 5, 7];
    return sides.find((i) => board.getCell(i) === null) ?? -1;
  }
}
