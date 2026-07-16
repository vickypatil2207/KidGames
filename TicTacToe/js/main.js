/**
 * main.js
 * -------
 * Composition root. Wires everything together once the DOM is ready.
 * Kept tiny on purpose — all the real logic lives in the classes.
 */

document.addEventListener("DOMContentLoaded", () => {
  const player1 = new Player("Player 1", "X", "❌");
  const player2 = new Player("Player 2", "O", "⭕");
  const game = new Game(player1, player2);
  new UIController(game);
});
