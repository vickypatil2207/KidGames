/**
 * main.js
 * ----------------------------------------------------------
 * Bootstrap entry point.
 *
 * - Resolves DOM nodes.
 * - Constructs the UI, Sound, and Game objects.
 * - Restores sound preference from localStorage.
 * - Registers a one-time user-gesture listener so the
 *   AudioContext can start (browser autoplay policy).
 * ----------------------------------------------------------
 */

import { UI }     from './UI.js';
import { SoundManager } from './SoundManager.js';
import { Game }   from './Game.js';

function $(id) { return document.getElementById(id); }

function bootstrap() {
  const ui = new UI({
    board:        $('board'),
    gridBg:       $('grid-bg'),
    tileLayer:    $('tile-layer'),
    score:        $('score'),
    best:         $('best'),
    newGameBtn:   $('new-game-btn'),
    undoBtn:      $('undo-btn'),
    soundBtn:     $('sound-btn'),
    soundIcon:    $('sound-icon'),
    overlay:      $('overlay'),
    overlayEmoji: $('overlay-emoji'),
    overlayTitle: $('overlay-title'),
    overlayMsg:   $('overlay-message'),
    overlayPri:   $('overlay-primary'),
    overlaySec:   $('overlay-secondary'),
    confetti:     $('confetti'),
  });

  const sound = new SoundManager();
  // Restore prior sound preference.
  try {
    const v = localStorage.getItem('kids2048.sound');
    sound.enabled = (v === null ? true : v === '1');
  } catch { sound.enabled = true; }
  ui.setSoundEnabled(sound.enabled);

  // Start audio on the first user gesture (Chrome/Safari policy).
  const armAudio = () => {
    sound._ensureCtx();
    window.removeEventListener('pointerdown', armAudio);
    window.removeEventListener('keydown', armAudio);
  };
  window.addEventListener('pointerdown', armAudio, { once: true });
  window.addEventListener('keydown', armAudio, { once: true });

  // Boot the game.
  // eslint-disable-next-line no-new
  new Game({ ui, sound });

  // Expose for debugging in DevTools.
  window.__kids2048 = { ui, sound, Game };
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}