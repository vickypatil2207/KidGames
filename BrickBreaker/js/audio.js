/**
 * 🔊 AudioEngine - Web Audio API Synthesizer with Polyphony Protection
 */
class SoundEngine {
  constructor() {
    this.ctx = null;
    this.muted = false;
    this.lastToneTime = 0;
  }

  init() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (AudioContextClass) this.ctx = new AudioContextClass();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type, duration, startVol = 0.25, endVol = 0.01) {
    if (this.muted || !this.ctx) return;
    const now = performance.now();
    // Throttle tones triggered too rapidly in the same millisecond frame
    if (now - this.lastToneTime < 15) return;
    this.lastToneTime = now;

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
    } catch (e) {}
  }

  playPaddleHit() { this.playTone(450, 'sine', 0.1, 0.35); }
  playWallHit() { this.playTone(300, 'triangle', 0.08, 0.2); }
  playBrickHit() { this.playTone(600, 'sine', 0.08, 0.25); }
  playSilverHit() { this.playTone(850, 'triangle', 0.1, 0.3); }
  playGoldHit() { this.playTone(1100, 'sine', 0.12, 0.35); }
  
  playExplosion() {
    if (this.muted || !this.ctx) return;
    this.playTone(120, 'sawtooth', 0.25, 0.4, 0.01);
  }

  playPowerup() {
    if (this.muted || !this.ctx) return;
    [523.25, 659.25, 783.99].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sine', 0.08, 0.2), i * 50);
    });
  }

  playLaser() { this.playTone(900, 'sawtooth', 0.07, 0.2, 0.01); }

  playLoseLife() {
    if (this.muted || !this.ctx) return;
    [350, 250].forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'sawtooth', 0.12, 0.25), i * 80);
    });
  }

  playLevelWin() {
    if (this.muted || !this.ctx) return;
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((f, i) => {
      setTimeout(() => this.playTone(f, 'triangle', 0.2, 0.3), i * 90);
    });
  }
}

const sound = new SoundEngine();
