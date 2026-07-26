/**
 * main.js
 * Application entry point binding controls, event handlers, grid switcher, and main loop.
 */

import { SoundManager } from './SoundManager.js';
import { Game } from './Game.js';
import { UI } from './UI.js';

document.addEventListener('DOMContentLoaded', () => {
  const sound = new SoundManager();

  let ui = null;

  const game = new Game(sound, (event) => {
    if (event.type === 'LINE_CLEAR' && ui) {
      ui.triggerLineClearParticles(event.clearedRows, event.combo);
    }
    if (ui) {
      ui.render();
    }
  });

  ui = new UI(game);
  ui.render();

  // Update sound button UI state
  const soundBtn = document.getElementById('sound-btn');
  const soundIcon = document.getElementById('sound-icon');
  const updateSoundUI = () => {
    if (soundIcon) {
      soundIcon.textContent = sound.isEnabled ? '🔊' : '🔇';
    }
  };
  updateSoundUI();

  if (soundBtn) {
    soundBtn.addEventListener('click', () => {
      sound.toggle();
      updateSoundUI();
    });
  }

  // Grid Size Selector
  const gridSelect = document.getElementById('grid-select');
  if (gridSelect) {
    gridSelect.addEventListener('change', (e) => {
      game.setGridSize(e.target.value);
      ui.render();
      gridSelect.blur();
    });
  }

  // Header buttons
  const pauseBtn = document.getElementById('pause-btn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', () => {
      game.togglePause();
      pauseBtn.blur();
    });
  }

  const resumeBtn = document.getElementById('resume-btn');
  if (resumeBtn) {
    resumeBtn.addEventListener('click', () => {
      game.togglePause();
    });
  }

  const restartBtn = document.getElementById('restart-btn');
  if (restartBtn) {
    restartBtn.addEventListener('click', () => {
      game.restart();
      restartBtn.blur();
    });
  }

  const swapBtn = document.getElementById('swap-btn');
  if (swapBtn) {
    swapBtn.addEventListener('click', () => {
      game.swapHold();
      swapBtn.blur();
    });
  }

  const playAgainBtn = document.getElementById('play-again-btn');
  if (playAgainBtn) {
    playAgainBtn.addEventListener('click', () => {
      game.restart();
    });
  }

  // Touch / On-screen Control Buttons
  const btnLeft = document.getElementById('btn-left');
  const btnRight = document.getElementById('btn-right');
  const btnRotate = document.getElementById('btn-rotate');
  const btnDown = document.getElementById('btn-down');
  const btnDrop = document.getElementById('btn-drop');

  const addRepeater = (btn, action) => {
    if (!btn) return;
    let timer = null;

    const start = (e) => {
      e.preventDefault();
      action();
      timer = setInterval(action, 120);
    };

    const stop = (e) => {
      if (e) e.preventDefault();
      if (timer) clearInterval(timer);
      timer = null;
    };

    btn.addEventListener('pointerdown', start);
    btn.addEventListener('pointerup', stop);
    btn.addEventListener('pointerleave', stop);
    btn.addEventListener('pointercancel', stop);
  };

  addRepeater(btnLeft, () => game.moveLeft());
  addRepeater(btnRight, () => game.moveRight());
  addRepeater(btnDown, () => game.softDrop());

  if (btnRotate) {
    btnRotate.addEventListener('click', (e) => {
      e.preventDefault();
      game.rotate();
    });
  }

  if (btnDrop) {
    btnDrop.addEventListener('click', (e) => {
      e.preventDefault();
      game.hardDrop();
    });
  }

  // Keyboard Controls Handler
  window.addEventListener('keydown', (e) => {
    // Prevent scrolling default for arrow keys & spacebar
    if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown', 'Space'].includes(e.code)) {
      e.preventDefault();
    }

    if (e.repeat && ['ArrowUp', 'KeyH', 'ShiftLeft', 'ShiftRight', 'Space'].includes(e.code)) {
      return; // Avoid multi-trigger for single-fire keys
    }

    switch (e.code) {
      case 'ArrowLeft':
      case 'KeyA':
        game.moveLeft();
        break;
      case 'ArrowRight':
      case 'KeyD':
        game.moveRight();
        break;
      case 'ArrowUp':
      case 'KeyW':
        game.rotate();
        break;
      case 'ArrowDown':
      case 'KeyS':
        game.softDrop();
        break;
      case 'Space':
        game.hardDrop();
        break;
      case 'KeyH':
      case 'ShiftLeft':
      case 'ShiftRight':
        game.swapHold();
        break;
      case 'KeyP':
        game.togglePause();
        break;
    }
  });

  // Main animation frame loop
  function loop(time) {
    game.update(time);
    ui.updateParticles();
    ui.render();
    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
});
