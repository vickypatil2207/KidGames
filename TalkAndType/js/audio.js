/**
 * Talk & Type - Web Audio Synthesizer & Speech Narration Engine
 * High-fidelity, zero-dependency, rich playful audio for kids typing & phonics.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.voiceEnabled = true;
    this.masterGain = null;
    this.sfxGain = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
        this.masterGain = this.ctx.createGain();
        this.masterGain.gain.setValueAtTime(0.9, this.ctx.currentTime);
        this.masterGain.connect(this.ctx.destination);

        this.sfxGain = this.ctx.createGain();
        this.sfxGain.gain.setValueAtTime(0.85, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  ensureContext() {
    this.init();
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  playTone(freq, type = 'sine', duration = 0.2, timeOffset = 0, gainLevel = 0.35) {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + timeOffset);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + timeOffset);
      gain.gain.exponentialRampToValueAtTime(gainLevel, this.ctx.currentTime + timeOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + timeOffset + duration);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start(this.ctx.currentTime + timeOffset);
      osc.stop(this.ctx.currentTime + timeOffset + duration);
    } catch (e) {
      console.warn('Audio tone error:', e);
    }
  }

  /**
   * Tactile keyboard click sound
   */
  playKeyClick() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;
    this.playTone(720, 'triangle', 0.06, 0, 0.25);
    this.playTone(480, 'sine', 0.08, 0.01, 0.2);
  }

  /**
   * Cheerful letter match chime (bright xylophone)
   */
  playCorrectLetter() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;
    const pitches = [659.25, 880.00, 1046.50]; // E5, A5, C6
    pitches.forEach((p, idx) => {
      this.playTone(p, 'triangle', 0.16, idx * 0.05, 0.38);
    });
  }

  /**
   * Gentle, encouraging "try again" wobble boing
   */
  playWrongLetter() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(320, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(180, this.ctx.currentTime + 0.25);

      gain.gain.setValueAtTime(0.3, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.25);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + 0.25);
    } catch (e) {
      console.warn('Wrong sound error:', e);
    }
  }

  /**
   * Mic activated ping
   */
  playMicStart() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;
    this.playTone(523.25, 'sine', 0.15, 0, 0.28);
    this.playTone(783.99, 'sine', 0.22, 0.08, 0.35);
  }

  /**
   * Speech recognized successfully (bouncy bell chime)
   */
  playSpeechMatch() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;
    const notes = [587.33, 739.99, 880.00, 1174.66]; // D5, F#5, A5, D6
    notes.forEach((f, i) => {
      this.playTone(f, 'triangle', 0.22, i * 0.07, 0.4);
    });
  }

  /**
   * Entire word spelled correctly victory fanfare
   */
  playWordComplete() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;
    const melody = [
      { f: 523.25, t: 0.00, d: 0.14 }, // C5
      { f: 659.25, t: 0.12, d: 0.14 }, // E5
      { f: 783.99, t: 0.24, d: 0.18 }, // G5
      { f: 1046.50, t: 0.40, d: 0.45 }, // C6
      { f: 1318.51, t: 0.48, d: 0.40 }  // E6
    ];
    melody.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, n.t, 0.45);
      this.playTone(n.f * 1.5, 'sine', n.d * 0.7, n.t + 0.02, 0.2);
    });
  }

  /**
   * Grand Victory Fanfare for Name Badge & Certificates
   */
  playVictory() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;
    const fanfare = [
      { f: 392.00, t: 0.00, d: 0.12 }, // G4
      { f: 523.25, t: 0.12, d: 0.12 }, // C5
      { f: 659.25, t: 0.24, d: 0.15 }, // E5
      { f: 783.99, t: 0.38, d: 0.22 }, // G5
      { f: 1046.50, t: 0.60, d: 0.55 } // C6
    ];
    fanfare.forEach(n => {
      this.playTone(n.f, 'triangle', n.d, n.t, 0.5);
      this.playTone(n.f * 2, 'sine', n.d * 0.6, n.t + 0.02, 0.2);
    });
  }

  /**
   * Star earned shimmer
   */
  playStar() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;
    this.playTone(880.00, 'sine', 0.25, 0, 0.4);
    this.playTone(1318.51, 'triangle', 0.3, 0.08, 0.35);
    this.playTone(1760.00, 'sine', 0.35, 0.15, 0.25);
  }
}

class VoiceNarrator {
  constructor(soundEngine) {
    this.soundEngine = soundEngine;
    this.synth = window.speechSynthesis || null;
    this.voice = null;
    this.isSpeaking = false;
    this.currentEndCallback = null;
    this.fallbackTimer = null;
    this.loadVoice();
    if (this.synth && this.synth.onvoiceschanged !== undefined) {
      this.synth.onvoiceschanged = () => this.loadVoice();
    }
  }

  loadVoice() {
    if (!this.synth) return;
    const voices = this.synth.getVoices();
    this.voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Victoria') || v.name.includes('Female'))) ||
                 voices.find(v => v.lang.startsWith('en')) ||
                 voices[0] || null;
  }

  stripEmojis(text) {
    if (!text) return '';
    return text
      .replace(/[\u{1F300}-\u{1F9FF}\u{1FA00}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B50}\u{FE0F}\u{200D}]/gu, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  speak(text, priority = false, onEnd = null) {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }

    if (!this.soundEngine.voiceEnabled || !this.synth) {
      if (onEnd) setTimeout(onEnd, 250);
      return;
    }

    if (priority) {
      this.synth.cancel();
    }

    const clean = this.stripEmojis(text);
    if (!clean) {
      if (onEnd) setTimeout(onEnd, 100);
      return;
    }

    try {
      const utter = new SpeechSynthesisUtterance(clean);
      if (this.voice) utter.voice = this.voice;
      utter.rate = 0.90; // clear, gentle cadence for kids
      utter.pitch = 1.22; // friendly, warm and enthusiastic
      utter.volume = 1.0;

      this.isSpeaking = true;
      let finished = false;

      const finishUtterance = () => {
        if (finished) return;
        finished = true;
        this.isSpeaking = false;
        if (this.fallbackTimer) {
          clearTimeout(this.fallbackTimer);
          this.fallbackTimer = null;
        }
        if (onEnd) onEnd();
      };

      utter.onend = () => finishUtterance();
      utter.onerror = () => finishUtterance();

      // Safeguard timeout
      const estimatedMs = Math.max(1300, clean.length * 85);
      this.fallbackTimer = setTimeout(finishUtterance, estimatedMs + 650);

      this.synth.speak(utter);
    } catch (e) {
      console.warn('Speech synthesis error:', e);
      this.isSpeaking = false;
      if (onEnd) onEnd();
    }
  }

  stop() {
    if (this.fallbackTimer) {
      clearTimeout(this.fallbackTimer);
      this.fallbackTimer = null;
    }
    this.isSpeaking = false;
    if (this.synth) {
      this.synth.cancel();
    }
  }
}

// Global Singletons
window.Sound = new SoundEngine();
window.Voice = new VoiceNarrator(window.Sound);
