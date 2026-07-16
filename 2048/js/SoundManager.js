/**
 * SoundManager.js
 * ----------------------------------------------------------
 * Generates friendly, kid-appropriate sound effects with the
 * Web Audio API. No external audio files required.
 *
 * Public methods:
 *   - slide()       : Soft blip when tiles slide.
 *   - merge(value)  : Cheerful "pop" tone; pitch rises with merge value.
 *   - click()       : Button press sound.
 *   - thud()        : Low bump when an invalid move is rejected.
 *   - win()         : Ascending arpeggio on reaching 2048.
 *   - lose()        : Soft descending tone on game over.
 *   - toggle()      : Toggle sound on/off; returns new state.
 *   - isEnabled     : Getter.
 * ----------------------------------------------------------
 */

export class SoundManager {
  constructor() {
    this.enabled = true;
    /** @type {AudioContext|null} */
    this._ctx = null;
  }

  get isEnabled() { return this.enabled; }

  /** Lazily create the AudioContext on first user gesture (autoplay policy). */
  _ensureCtx() {
    if (this._ctx) return this._ctx;
    try {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      if (!Ctx) return null;
      this._ctx = new Ctx();
    } catch {
      this._ctx = null;
    }
    return this._ctx;
  }

  toggle() {
    this.enabled = !this.enabled;
    return this.enabled;
  }

  // ---------- High-level SFX ----------

  slide() { this._beep(420, 0.05, 'sine', 0.05); }
  click() { this._beep(620, 0.05, 'triangle', 0.08); }
  thud()  { this._beep(180, 0.18, 'sine', 0.10); }

  merge(value) {
    if (!this.enabled) return;
    // Map value (2..2048) onto a friendly pitch range.
    const tier = Math.log2(Math.max(2, value)) - 1; // 0..10
    const freq = 520 + tier * 80;
    this._beep(freq, 0.10, 'triangle', 0.12);
    // Sparkle: a slightly delayed higher note.
    setTimeout(() => this._beep(freq * 1.5, 0.10, 'sine', 0.08), 60);
  }

  win() {
    if (!this.enabled) return;
    const notes = [523.25, 659.25, 783.99, 1046.5]; // C5 E5 G5 C6
    notes.forEach((f, i) => setTimeout(() => this._beep(f, 0.18, 'triangle', 0.14), i * 110));
  }

  lose() {
    if (!this.enabled) return;
    const notes = [440, 370, 294, 220];
    notes.forEach((f, i) => setTimeout(() => this._beep(f, 0.18, 'sine', 0.10), i * 120));
  }

  // ---------- Low-level beep ----------

  /**
   * Play a short tone.
   * @param {number} freq - Frequency in Hz.
   * @param {number} duration - Seconds.
   * @param {OscillatorType} type
   * @param {number} gain - Peak gain (0..1).
   */
  _beep(freq, duration, type, gain) {
    if (!this.enabled) return;
    const ctx = this._ensureCtx();
    if (!ctx) return;
    if (ctx.state === 'suspended') ctx.resume();

    const osc = ctx.createOscillator();
    const env = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, ctx.currentTime);

    // Quick attack, smooth release — kid-friendly, no clicks.
    const now = ctx.currentTime;
    env.gain.setValueAtTime(0, now);
    env.gain.linearRampToValueAtTime(gain, now + 0.01);
    env.gain.exponentialRampToValueAtTime(0.001, now + duration);

    osc.connect(env).connect(ctx.destination);
    osc.start(now);
    osc.stop(now + duration + 0.02);
  }
}