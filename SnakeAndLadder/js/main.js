/**
 * main.js
 * Application entry point. Boots the snake background animation
 * and hands control to the Game controller.
 */
window.SL = window.SL || {};
const { Game, BackgroundAnimation } = window.SL;

function $(id) { return document.getElementById(id); }

function cacheElements() {
  return {
    boardEl:        $('board'),
    diceEl:         $('dice'),
    rollBtn:        $('roll-btn'),
    resetBtn:       $('reset-btn'),
    turnIndicator:  $('turn-indicator'),
    playersList:    $('players-list'),
    logList:        $('log-list'),
    modal:          $('modal'),
    modalTitle:     $('modal-title'),
    modalText:      $('modal-text'),
    modalClose:     $('modal-close'),
    confetti:       document.querySelector('.confetti'),
    bgCanvas:       $('bg-canvas'),
    setupModal:     $('setup-modal'),
    startBtn:       $('start-btn'),
    playerNamesContainer: $('player-names'),
  };
}

function boot() {
  const els = cacheElements();

  // Background slithering snakes — purely decorative, sits behind everything.
  const bg = new BackgroundAnimation(els.bgCanvas, { count: 6 });

  // Main game controller.
  const game = new Game(els);

  // Re-position tokens when the window resizes (positions are percentage-based).
  window.addEventListener('resize', () => {
    game.players.forEach((p) => game.ui.moveTokenTo(p, p.position));
  });

  // Expose for debugging.
  window.__game = game;
  window.__bg   = bg;
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', boot);
} else {
  boot();
}
