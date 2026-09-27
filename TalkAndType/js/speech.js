/**
 * Talk & Type - Speech Recognition Engine
 * Listens for kid's spoken response with kid-friendly fuzzy matching,
 * live soundwave animations, and seamless zero-frustration fallbacks.
 */

class SpeechEngine {
  constructor() {
    const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition || null;
    this.recognition = SpeechRec ? new SpeechRec() : null;
    this.isSupported = !!this.recognition;
    this.isListening = false;
    this.currentTarget = null;
    this.onMatchCallback = null;
    this.onMismatchCallback = null;
    this.onStateChangeCallback = null;
    this.autoRestart = false;

    if (this.isSupported) {
      this.recognition.continuous = false;
      this.recognition.interimResults = true;
      this.recognition.lang = 'en-US';

      this.recognition.onstart = () => {
        this.isListening = true;
        if (this.onStateChangeCallback) this.onStateChangeCallback('listening');
      };

      this.recognition.onresult = (event) => {
        let transcript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          transcript += event.results[i][0].transcript;
        }
        transcript = transcript.trim().toLowerCase();
        this.handleTranscript(transcript);
      };

      this.recognition.onerror = (event) => {
        console.warn('Speech recognition status:', event.error);
        this.isListening = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback('idle');
      };

      this.recognition.onend = () => {
        this.isListening = false;
        if (this.onStateChangeCallback) this.onStateChangeCallback('idle');
        if (this.autoRestart) {
          try {
            this.recognition.start();
          } catch (e) {
            this.autoRestart = false;
          }
        }
      };
    }
  }

  normalizeText(txt) {
    return (txt || '')
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  isWordMatch(spoken, targetWordObj) {
    if (!spoken || !targetWordObj) return false;
    const cleanSpoken = this.normalizeText(spoken);
    const targetWord = this.normalizeText(targetWordObj.word);

    // Exact or contains word
    if (cleanSpoken.includes(targetWord)) return true;

    // Check alternative phrases (e.g. 'an apple', 'red apple', 'aeroplane')
    if (targetWordObj.alternatives && targetWordObj.alternatives.length) {
      for (const alt of targetWordObj.alternatives) {
        const cleanAlt = this.normalizeText(alt);
        if (cleanSpoken.includes(cleanAlt) || cleanAlt.includes(cleanSpoken)) {
          return true;
        }
      }
    }

    // Levenshtein fuzzy match for slight pronunciation differences
    const words = cleanSpoken.split(' ');
    for (const w of words) {
      if (this.levenshteinDistance(w, targetWord) <= 1 && targetWord.length >= 3) {
        return true;
      }
    }

    return false;
  }

  levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;
    const matrix = [];
    for (let i = 0; i <= b.length; i++) matrix[i] = [i];
    for (let j = 0; j <= a.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= b.length; i++) {
      for (let j = 1; j <= a.length; j++) {
        if (b.charAt(i - 1) === a.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    return matrix[b.length][a.length];
  }

  handleTranscript(spokenText) {
    if (!this.currentTarget) return;

    if (this.isWordMatch(spokenText, this.currentTarget)) {
      this.stopListening();
      if (this.onMatchCallback) {
        this.onMatchCallback(spokenText, this.currentTarget);
      }
    } else {
      if (this.onMismatchCallback) {
        this.onMismatchCallback(spokenText);
      }
    }
  }

  startListening(targetWordObj, onMatch, onMismatch, onStateChange) {
    this.currentTarget = targetWordObj;
    this.onMatchCallback = onMatch;
    this.onMismatchCallback = onMismatch;
    this.onStateChangeCallback = onStateChange;

    if (!this.isSupported) {
      if (this.onStateChangeCallback) this.onStateChangeCallback('unsupported');
      return false;
    }

    try {
      this.autoRestart = false;
      this.recognition.start();
      return true;
    } catch (e) {
      // If already started or browser throws error
      console.warn('Recognition start caught:', e);
      return false;
    }
  }

  stopListening() {
    this.autoRestart = false;
    this.isListening = false;
    if (this.recognition) {
      try {
        this.recognition.stop();
      } catch (e) {
        // ignore
      }
    }
    if (this.onStateChangeCallback) {
      this.onStateChangeCallback('idle');
    }
  }
}

window.Speech = new SpeechEngine();
