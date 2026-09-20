/**
 * Study With Fun - Web Audio Synthesizer & Speech Narration Engine
 * High-fidelity, zero-dependency, catchy audio for pre-primary learners.
 */

class SoundEngine {
  constructor() {
    this.ctx = null;
    this.soundEnabled = true;
    this.musicEnabled = false;
    this.voiceEnabled = true;
    this.bgmTimer = null;
    this.bgmStep = 0;
    this.masterGain = null;
    this.musicGain = null;
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
        this.sfxGain.gain.setValueAtTime(0.8, this.ctx.currentTime);
        this.sfxGain.connect(this.masterGain);

        this.musicGain = this.ctx.createGain();
        this.musicGain.gain.setValueAtTime(0.22, this.ctx.currentTime);
        this.musicGain.connect(this.masterGain);
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

  /**
   * Play a pleasant musical tone
   */
  playTone(freq, type = 'sine', duration = 0.25, timeOffset = 0, gainLevel = 0.4, dest = null) {
    if (!this.soundEnabled || !this.ctx) return;
    try {
      const targetDest = dest || this.sfxGain || this.ctx.destination;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime + timeOffset);

      gain.gain.setValueAtTime(0.001, this.ctx.currentTime + timeOffset);
      gain.gain.exponentialRampToValueAtTime(gainLevel, this.ctx.currentTime + timeOffset + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + timeOffset + duration);

      osc.connect(gain);
      gain.connect(targetDest);

      osc.start(this.ctx.currentTime + timeOffset);
      osc.stop(this.ctx.currentTime + timeOffset + duration);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Catchy Right Answer Sound:
   * Bright, cheerful xylophone / glockenspiel major arpeggio + sparkle shimmer
   */
  playCorrect() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    // Upbeat C-Major arpeggio: C5 (523Hz), E5 (659Hz), G5 (784Hz), C6 (1046Hz)
    const notes = [
      { f: 523.25, t: 0.00, d: 0.18, type: 'triangle' },
      { f: 659.25, t: 0.08, d: 0.20, type: 'triangle' },
      { f: 783.99, t: 0.16, d: 0.22, type: 'triangle' },
      { f: 1046.50, t: 0.24, d: 0.40, type: 'sine' },
      { f: 1318.51, t: 0.30, d: 0.35, type: 'sine' } // E6 sparkle harmonic
    ];

    notes.forEach(n => {
      this.playTone(n.f, n.type, n.d, n.t, 0.45);
    });

    // Add playful sparkle chord shimmer
    setTimeout(() => {
      if (this.soundEnabled && this.ctx) {
        this.playTone(1567.98, 'sine', 0.25, 0, 0.2); // G6
      }
    }, 340);
  }

  /**
   * Catchy Wrong Answer Sound:
   * Gentle, cute cartoon "boing / wobble" (non-punitive, playful and bouncy!)
   */
  playWrong() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      const now = this.ctx.currentTime;

      // Pitch glide: cartoon wobble from 260Hz down to 140Hz with vibration
      osc.frequency.setValueAtTime(260, now);
      osc.frequency.exponentialRampToValueAtTime(180, now + 0.12);
      osc.frequency.linearRampToValueAtTime(220, now + 0.22);
      osc.frequency.exponentialRampToValueAtTime(130, now + 0.38);

      gain.gain.setValueAtTime(0.01, now);
      gain.gain.linearRampToValueAtTime(0.35, now + 0.04);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.40);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.40);
    } catch (e) {
      console.warn('Audio play error:', e);
    }
  }

  /**
   * Tactile button tap / pop sound
   */
  playPop() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(450, now);
      osc.frequency.exponentialRampToValueAtTime(900, now + 0.05);

      gain.gain.setValueAtTime(0.3, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);

      osc.connect(gain);
      gain.connect(this.sfxGain || this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.06);
    } catch (e) {}
  }

  /**
   * Item counting chime (plays when tapping an animal/fruit to count)
   */
  playCount(index) {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    // Ascending cute pentatonic scale
    const scale = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33, 659.25, 783.99, 880.00, 1046.50];
    const freq = scale[(index - 1) % scale.length];
    this.playTone(freq, 'triangle', 0.22, 0, 0.4);
  }

  /**
   * Star Award Sound (pops in when a star is unlocked on modal)
   */
  playStar(starNum) {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    const baseFreqs = [523.25, 659.25, 783.99]; // C, E, G
    const freq = baseFreqs[Math.min(starNum - 1, 2)] * 1.5;

    this.playTone(freq, 'sine', 0.35, 0, 0.5);
    this.playTone(freq * 1.5, 'triangle', 0.25, 0.08, 0.35);
  }

  /**
   * Level Complete Triumph Fanfare
   */
  playVictory() {
    this.ensureContext();
    if (!this.soundEnabled || !this.ctx) return;

    // Melodic fanfare: G4, C5, E5, G5 (high), C6 triumphant flourish
    const victoryMelody = [
      { f: 392.00, t: 0.00, d: 0.15 },
      { f: 523.25, t: 0.14, d: 0.15 },
      { f: 659.25, t: 0.28, d: 0.18 },
      { f: 783.99, t: 0.44, d: 0.24 },
      { f: 1046.50, t: 0.70, d: 0.60 }
    ];

    victoryMelody.forEach(note => {
      this.playTone(note.f, 'triangle', note.d, note.t, 0.5);
      this.playTone(note.f * 2, 'sine', note.d * 0.7, note.t + 0.02, 0.2);
    });
  }

  /**
   * Background Music:
   * A gentle, cheerful, catchy nursery tune loop (Kalimba / Marimba style)
   */
  startBGM() {
    this.ensureContext();
    this.musicEnabled = true;
    if (this.bgmTimer) return;

    // Cheerful catchy pentatonic motif (C major nursery bounce: C4, E4, G4, A4, G4, E4, D4, C4)
    const melody = [
      523.25, 659.25, 783.99, 880.00, 783.99, 659.25, 587.33, 523.25,
      659.25, 783.99, 880.00, 1046.50, 880.00, 783.99, 659.25, 587.33
    ];
    const bass = [
      261.63, 0, 329.63, 0, 392.00, 0, 261.63, 0,
      329.63, 0, 392.00, 0, 440.00, 0, 392.00, 0
    ];

    let step = 0;
    const tempoMs = 280; // ~107 BPM bouncy tempo

    this.bgmTimer = setInterval(() => {
      if (!this.musicEnabled || !this.soundEnabled || !this.ctx) return;
      if (this.ctx.state === 'suspended') return;

      const melNote = melody[step % melody.length];
      const bassNote = bass[step % bass.length];

      // Play soft melody note
      if (melNote > 0) {
        this.playTone(melNote, 'triangle', 0.20, 0, 0.16, this.musicGain);
      }
      // Play warm bass pulse
      if (bassNote > 0) {
        this.playTone(bassNote, 'sine', 0.24, 0, 0.20, this.musicGain);
      }

      step++;
    }, tempoMs);
  }

  stopBGM() {
    this.musicEnabled = false;
    if (this.bgmTimer) {
      clearInterval(this.bgmTimer);
      this.bgmTimer = null;
    }
  }

  toggleMusic() {
    if (this.musicEnabled) {
      this.stopBGM();
      return false;
    } else {
      this.startBGM();
      return true;
    }
  }

  toggleSound() {
    this.soundEnabled = !this.soundEnabled;
    if (!this.soundEnabled && this.musicEnabled) {
      this.stopBGM();
    }
    return this.soundEnabled;
  }

  toggleVoice() {
    this.voiceEnabled = !this.voiceEnabled;
    return this.voiceEnabled;
  }
}

/**
 * Speech Narration for Pre-Primary Kids
 * Speaks letter names, numbers, and cheery encouragement
 * Strips emoji characters so the voice doesn't read 'cat face', 'dog face', etc.
 * Supports completion callbacks (onEnd) so games wait for speech to finish before advancing!
 */
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
    // Prefer warm, natural, friendly English voices
    this.voice = voices.find(v => v.lang.startsWith('en') && (v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google') || v.name.includes('Jenny') || v.name.includes('Female'))) ||
                 voices.find(v => v.lang.startsWith('en')) ||
                 voices[0] || null;
  }

  /**
   * Remove emojis from text so speech engine does not pronounce 'cat face', 'balloon', etc.
   */
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
      if (onEnd) setTimeout(onEnd, 300);
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
      utter.rate = 0.92; // clear, gentle cadence for pre-primary
      utter.pitch = 1.25; // cheerful and friendly
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

      // Fallback safeguard in case browser speechSynthesis drops onend event
      const estimatedMs = Math.max(1200, clean.length * 85);
      this.fallbackTimer = setTimeout(finishUtterance, estimatedMs + 600);

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

// Global audio & narrator singletons
window.Sound = new SoundEngine();
window.Voice = new VoiceNarrator(window.Sound);
