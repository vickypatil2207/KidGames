/**
 * SoundManager.js
 * Synthesizes kid-friendly audio effects using Web Audio API.
 */

export class SoundManager {
  constructor() {
    this.enabled = localStorage.getItem('block_game_sound') !== 'false';
    /** @type {AudioContext|null} */
    this._ctx = null;
  }

  get isEnabled() {
    return this.enabled;
  }

  toggle() {
    this.enabled = !this.enabled;
    localStorage.setItem('block_game_sound', this.enabled ? 'true' : 'false');
    return this.enabled;
  }

  _ensureCtx() {
    if (this._ctx) return this._ctx;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (Ctx) this._ctx = new Ctx();
    } catch {
      this._ctx = null;
    }
    return this._ctx;
  }

  move() {
    this._beep(320, 0.04, 'sine', 0.06);
  }

  rotate() {
    this._beep(580, 0.06, 'triangle', 0.08);
  }

  drop() {
    this._beep(180, 0.08, 'sine', 0.12);
  }

  hardDrop() {
    this._beep(120, 0.12, 'triangle', 0.15);
  }

  swap() {
    this._beep(480, 0.05, 'sine', 0.08);
    setTimeout(() => this._beep(640, 0.05, 'sine', 0.08), 50);
  }

  lineClear(linesCleared = 1) {
    if (!this.enabled) return;
    const baseFreqs = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
    const count = Math.min(linesCleared, 4);

    for (let i = 0; i < count; i++) {
      setTimeout(() => {
        this._beep(baseFreqs[i] || 1000, 0.12, 'triangle', 0.12);
      }, i * 70);
    }
  }

  combo(comboCount) {
    if (!this.enabled) return;
    const startFreq = 400 + Math.min(comboCount, 8) * 100;
    this._beep(startFreq, 0.1, 'sine', 0.15);
    setTimeout(() => this._beep(startFreq * 1.25, 0.15, 'triangle', 0.12), 80);
  }

  levelUp() {
    if (!this.enabled) return;
    const notes = [440, 554.37, 659.25, 880];
    notes.forEach((freq, idx) => {
      setTimeout(() => this._beep(freq, 0.12, 'triangle', 0.14), idx * 80);
    });
  }

  gameOver() {
    if (!this.enabled) return;
    const notes = [440, 392, 349.23, 293.66];
    notes.forEach((freq, idx) => {
      setTimeout(() => this._beep(freq, 0.2, 'sine', 0.12), idx * 140);
    });
  }

  _beep(freq, duration, type = 'sine', gainVal = 0.1) {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    const now = ctx.currentTime;
    gain.gain.setValueAtTime(0, now);
    gain.gain.linearRampToValueAtTime(gainVal, now + 0.01);
    gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(now);
    osc.stop(now + duration);
  }
}
