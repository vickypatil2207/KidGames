/* Audio Manager - Web Audio API Synthesizer (No external sound files required) */
class AudioManager {
    constructor() {
        this.ctx = null;
        this.muted = false;
        this.bgMusicOsc = null;
        this.bgMusicInterval = null;
        this.musicPlaying = false;
    }

    init() {
        if (!this.ctx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioContext();
        }
        if (this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    toggleMute() {
        this.muted = !this.muted;
        if (this.muted) {
            this.stopBgMusic();
        } else {
            this.startBgMusic();
        }
        return this.muted;
    }

    // Play Jump Sound (Pitch sweep up)
    playJump() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(180, now);
        osc.frequency.exponentialRampToValueAtTime(450, now + 0.18);

        gain.gain.setValueAtTime(0.3, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.18);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.18);
    }

    // Play Slide Sound (Low noise whoosh)
    playSlide() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(300, now);
        osc.frequency.exponentialRampToValueAtTime(100, now + 0.22);

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.22);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.22);
    }

    // Play Coin Pickup Sound (Sparkling dual chime)
    playCoin() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc2.type = 'sine';

        osc1.frequency.setValueAtTime(987.77, now); // B5
        osc2.frequency.setValueAtTime(1318.51, now + 0.06); // E6

        gain.gain.setValueAtTime(0.25, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc1.stop(now + 0.1);
        osc2.start(now + 0.06);
        osc2.stop(now + 0.25);
    }

    // Play Snack Pickup Sound (Jalebi / Fafda bonus)
    playSnack() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C E G C
        notes.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, now + idx * 0.05);

            gain.gain.setValueAtTime(0.2, now + idx * 0.05);
            gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.05 + 0.15);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.05);
            osc.stop(now + idx * 0.05 + 0.15);
        });
    }

    // Play Powerup Grab (Ascending synth chord)
    playPowerup() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const freqs = [440, 554.37, 659.25, 880]; // A4, C#5, E5, A5
        freqs.forEach((f, i) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(f, now + i * 0.07);

            gain.gain.setValueAtTime(0.2, now + i * 0.07);
            gain.gain.exponentialRampToValueAtTime(0.01, now + i * 0.07 + 0.2);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + i * 0.07);
            osc.stop(now + i * 0.07 + 0.2);
        });
    }

    // Play Crash Sound (Low thump + noise)
    playCrash() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(140, now);
        osc.frequency.exponentialRampToValueAtTime(30, now + 0.4);

        gain.gain.setValueAtTime(0.4, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.4);

        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.start(now);
        osc.stop(now + 0.4);
    }

    // Milestone / Fanfare sound
    playMilestone() {
        if (this.muted) return;
        this.init();
        const now = this.ctx.currentTime;
        const melody = [523.25, 659.25, 783.99, 1046.50, 1318.51];
        melody.forEach((freq, idx) => {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, now + idx * 0.08);

            gain.gain.setValueAtTime(0.2, now + idx * 0.08);
            gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.25);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now + idx * 0.08);
            osc.stop(now + idx * 0.08 + 0.25);
        });
    }

    // Upbeat Rhythmic Background Music Loop
    startBgMusic() {
        if (this.muted || this.musicPlaying) return;
        this.init();
        this.musicPlaying = true;
        let noteIndex = 0;
        // Upbeat kid melody scale (C major pentatonic bouncy tune)
        const notes = [261.63, 329.63, 392.00, 523.25, 392.00, 329.63, 261.63, 349.23, 392.00, 440.00, 523.25, 440.00];

        this.bgMusicInterval = setInterval(() => {
            if (this.muted || !this.musicPlaying) return;
            const now = this.ctx.currentTime;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(notes[noteIndex % notes.length], now);

            gain.gain.setValueAtTime(0.06, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + 0.22);

            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.start(now);
            osc.stop(now + 0.22);

            noteIndex++;
        }, 260); // 130 BPM upbeat rhythm
    }

    stopBgMusic() {
        this.musicPlaying = false;
        if (this.bgMusicInterval) {
            clearInterval(this.bgMusicInterval);
            this.bgMusicInterval = null;
        }
    }
}

window.audioManager = new AudioManager();
