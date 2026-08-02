/**
 * audio.js
 * Web Audio API synthesizer for zero-dependency sound effects.
 * Fast, lightweight, and works seamlessly on mobile devices.
 */
window.SL = window.SL || {};

window.SL.Audio = class SoundEffects {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  _init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  toggleMute() {
    this.muted = !this.muted;
    return this.muted;
  }

  /** Soft click pop */
  playClick() {
    if (this.muted) return;
    this._init();
    if (!this.ctx) return;

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(400, this.ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(800, this.ctx.currentTime + 0.05);

    gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.ctx.currentTime + 0.05);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start();
    osc.stop(this.ctx.currentTime + 0.05);
  }

  /** Dice roll sound - short noise burst & rumble */
  playRoll() {
    if (this.muted) return;
    this._init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    for (let i = 0; i < 5; i++) {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + (i * 0.07);

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(200 + Math.random() * 300, time);
      osc.frequency.exponentialRampToValueAtTime(80, time + 0.05);

      gain.gain.setValueAtTime(0.2, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.05);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.05);
    }
  }

  /** Pawn hop sound - cute bouncy pop */
  playHop() {
    if (this.muted) return;
    this._init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(320, now);
    osc.frequency.exponentialRampToValueAtTime(640, now + 0.08);

    gain.gain.setValueAtTime(0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.08);
  }

  /** Ladder climb sound - ascending joyful arpeggio */
  playLadder() {
    if (this.muted) return;
    this._init();
    if (!this.ctx) return;

    const notes = [400, 520, 650, 800, 1000];
    const now = this.ctx.currentTime;

    notes.forEach((freq, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + i * 0.08;

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);

      gain.gain.setValueAtTime(0.3, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + 0.12);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + 0.12);
    });
  }

  /** Snake slide sound - funny sliding downward frequency */
  playSnake() {
    if (this.muted) return;
    this._init();
    if (!this.ctx) return;

    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();

    osc.type = 'sawtooth';
    osc.frequency.setValueAtTime(700, now);
    osc.frequency.exponentialRampToValueAtTime(150, now + 0.5);

    gain.gain.setValueAtTime(0.25, now);
    gain.gain.exponentialRampToValueAtTime(0.01, now + 0.5);

    osc.connect(gain);
    gain.connect(this.ctx.destination);

    osc.start(now);
    osc.stop(now + 0.5);
  }

  /** Victory fanfare */
  playWin() {
    if (this.muted) return;
    this._init();
    if (!this.ctx) return;

    const notes = [
      { f: 523.25, t: 0, d: 0.15 },  // C5
      { f: 659.25, t: 0.15, d: 0.15 }, // E5
      { f: 783.99, t: 0.30, d: 0.15 }, // G5
      { f: 1046.50, t: 0.45, d: 0.5 } // C6
    ];
    const now = this.ctx.currentTime;

    notes.forEach(note => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const time = now + note.t;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(note.f, time);

      gain.gain.setValueAtTime(0.4, time);
      gain.gain.exponentialRampToValueAtTime(0.01, time + note.d);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(time);
      osc.stop(time + note.d);
    });
  }
};

window.SL.sound = new window.SL.Audio();
