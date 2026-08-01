/**
 * 🏓 SoundEngine - Web Audio API Synthesizer
 * Generates all kid-friendly sound effects dynamically without external audio assets.
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type, duration, startVol = 0.3, endVol = 0.01) {
    if (this.muted || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      gain.gain.setValueAtTime(startVol, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(endVol, this.ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      // Audio fallback safeguard
    }
  }

  playPaddleHit() {
    this.playTone(480, 'sine', 0.1, 0.4, 0.01);
  }

  playWallHit() {
    this.playTone(320, 'triangle', 0.08, 0.25, 0.01);
  }

  playSpeedUp() {
    if (this.muted || !this.ctx) return;
    [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sine', 0.12, 0.3, 0.01), idx * 70);
    });
  }

  playPointScore() {
    if (this.muted || !this.ctx) return;
    [587.33, 880].forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.2, 0.35, 0.01), idx * 100);
    });
  }

  playWinFanfare() {
    if (this.muted || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'triangle', 0.3, 0.4, 0.01), idx * 120);
    });
  }

  playLoseMelody() {
    if (this.muted || !this.ctx) return;
    const notes = [400, 350, 300, 250];
    notes.forEach((freq, idx) => {
      setTimeout(() => this.playTone(freq, 'sawtooth', 0.25, 0.2, 0.01), idx * 140);
    });
  }
}

const audio = new SoundEngine();
