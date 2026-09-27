/**
 * Talk & Type - Main Game Controller & State Machine
 * Orchestrates Name Badge setup, A-Z adventure, Voice/Mic recognition,
 * Guided physical typing, hint assistant, and celebratory rewards.
 */

class TalkAndTypeGame {
  constructor() {
    this.playerName = localStorage.getItem('talk_type_player_name') || '';
    this.stars = parseInt(localStorage.getItem('talk_type_stars') || '0', 10);
    this.masteredWords = JSON.parse(localStorage.getItem('talk_type_mastered') || '[]');

    this.currentLetter = 'A';
    this.currentWordIndex = 0;
    this.currentWordObj = null;

    // Typing state
    this.isNameTypingMode = false;
    this.targetWordLetters = [];
    this.currentLetterIdx = 0;
    this.wrongKeystrokeCount = 0;
    this.idleHintTimer = null;

    // Components
    this.confetti = null;
    this.keyboard = null;

    this.initElements();
    this.initGame();
  }

  initElements() {
    // Navigation / Header
    this.btnNavSound = document.getElementById('btn-toggle-sound');
    this.btnNavVoice = document.getElementById('btn-toggle-voice');
    this.lblStars = document.getElementById('nav-stars-count');
    this.lblPlayerBadge = document.getElementById('lbl-player-badge');
    this.btnEditBadge = document.getElementById('btn-edit-badge');

    // Screens
    this.screenRoadmap = document.getElementById('screen-roadmap');
    this.screenPlay = document.getElementById('screen-play');
    this.screenBadgeSetup = document.getElementById('screen-badge-setup');

    // Roadmap elements
    this.roadmapGrid = document.getElementById('roadmap-letters-grid');
    this.btnPlayNext = document.getElementById('btn-play-next');
    this.btnViewCertificate = document.getElementById('btn-view-cert');
    this.lblProgressPct = document.getElementById('lbl-progress-pct');
    this.progressBarOverall = document.getElementById('progress-bar-overall');

    // Play Stage elements
    this.btnBackToMap = document.getElementById('btn-back-to-map');
    this.stageCard = document.getElementById('stage-card');
    this.stageLetterTag = document.getElementById('stage-letter-tag');
    this.stageEmoji = document.getElementById('stage-emoji');
    this.stageWordHint = document.getElementById('stage-word-hint');
    this.stagePhonics = document.getElementById('stage-phonics');

    // Speak section
    this.sectionSpeak = document.getElementById('section-speak');
    this.btnMic = document.getElementById('btn-mic-listen');
    this.micStatusText = document.getElementById('mic-status-text');
    this.micWaves = document.getElementById('mic-soundwaves');
    this.btnHelpSay = document.getElementById('btn-help-say');

    // Typing section
    this.sectionType = document.getElementById('section-type');
    this.letterSlotsContainer = document.getElementById('letter-slots-container');
    this.typePromptText = document.getElementById('type-prompt-text');
    this.btnRepeatPrompt = document.getElementById('btn-repeat-prompt');

    // Mascot
    this.mascotAvatar = document.getElementById('mascot-avatar');
    this.mascotBubble = document.getElementById('mascot-speech-bubble');

    // Modals
    this.modalComplete = document.getElementById('modal-word-complete');
    this.modalCelebrationEmoji = document.getElementById('modal-celebration-emoji');
    this.modalSpelledWord = document.getElementById('modal-spelled-word');
    this.modalWordMeaning = document.getElementById('modal-word-meaning');
    this.btnModalNextWord = document.getElementById('btn-modal-next-word');
    this.btnModalMap = document.getElementById('btn-modal-map');

    // Certificate Modal
    this.modalCertificate = document.getElementById('modal-certificate');
    this.certPlayerName = document.getElementById('cert-player-name');
    this.certStarsCount = document.getElementById('cert-stars-count');
    this.certWordsCount = document.getElementById('cert-words-count');
    this.btnCloseCert = document.getElementById('btn-close-cert');
    this.btnPrintCert = document.getElementById('btn-print-cert');

    // Badge Setup Modal / Card
    this.inputPlayerName = document.getElementById('input-player-name');
    this.btnSaveName = document.getElementById('btn-save-name');
    this.btnSkipName = document.getElementById('btn-skip-name');
  }

  initGame() {
    // Initialize Confetti
    const canvas = document.getElementById('confetti-canvas');
    if (canvas) {
      this.confetti = new ConfettiCannon(canvas);
    }

    // Initialize Keyboard
    const kbContainer = document.getElementById('keyboard-container');
    if (kbContainer) {
      this.keyboard = new KeyboardController(kbContainer);
      this.keyboard.onKeyInput = (letter) => this.handleTypedLetter(letter);
    }

    this.bindEvents();
    this.updateStatsUI();
    this.renderRoadmap();

    // Check if player has created their badge
    if (!this.playerName) {
      this.showBadgeSetup();
    } else {
      this.showScreen('roadmap');
      window.Voice.speak(`Welcome back, ${this.playerName}! Ready to talk and type?`);
    }
  }

  bindEvents() {
    // Audio toggles
    this.btnNavSound.addEventListener('click', () => {
      window.Sound.soundEnabled = !window.Sound.soundEnabled;
      this.btnNavSound.classList.toggle('active', window.Sound.soundEnabled);
      this.btnNavSound.innerHTML = window.Sound.soundEnabled
        ? '<i class="fa-solid fa-volume-high"></i>'
        : '<i class="fa-solid fa-volume-xmark"></i>';
    });

    this.btnNavVoice.addEventListener('click', () => {
      window.Sound.voiceEnabled = !window.Sound.voiceEnabled;
      this.btnNavVoice.classList.toggle('active', window.Sound.voiceEnabled);
      this.btnNavVoice.innerHTML = window.Sound.voiceEnabled
        ? '<i class="fa-solid fa-comment-dots"></i> <span>Voice ON</span>'
        : '<i class="fa-solid fa-comment-slash"></i> <span>Voice OFF</span>';
      if (!window.Sound.voiceEnabled) {
        window.Voice.stop();
      }
    });

    // Badge / Player setup
    this.btnEditBadge.addEventListener('click', () => this.showBadgeSetup());
    this.btnSaveName.addEventListener('click', () => this.savePlayerNameAndStartTyping());
    this.inputPlayerName.addEventListener('keyup', (e) => {
      if (e.key === 'Enter') this.savePlayerNameAndStartTyping();
    });
    this.btnSkipName.addEventListener('click', () => {
      this.playerName = 'Super Explorer';
      localStorage.setItem('talk_type_player_name', this.playerName);
      this.updateStatsUI();
      this.showScreen('roadmap');
      window.Voice.speak('Welcome, Super Explorer! Let’s explore letters!');
    });

    // Navigation buttons
    this.btnBackToMap.addEventListener('click', () => {
      this.cleanupCurrentRound();
      this.showScreen('roadmap');
    });

    this.btnPlayNext.addEventListener('click', () => {
      this.startNextAvailableWord();
    });

    // Microphone speech recognition button
    this.btnMic.addEventListener('click', () => {
      this.toggleSpeechListening();
    });

    // Fallback: Kid or parent taps "Help Me Say It" or "I Said It!"
    this.btnHelpSay.addEventListener('click', () => {
      this.onWordIdentified();
    });

    // Repeat voice prompt button
    this.btnRepeatPrompt.addEventListener('click', () => {
      this.speakCurrentExpectedLetter();
    });

    // Word completion modal buttons
    this.btnModalNextWord.addEventListener('click', () => {
      this.modalComplete.classList.add('hidden');
      this.startNextWordInSequence();
    });

    this.btnModalMap.addEventListener('click', () => {
      this.modalComplete.classList.add('hidden');
      this.cleanupCurrentRound();
      this.showScreen('roadmap');
    });

    // Certificate modal
    this.btnViewCertificate.addEventListener('click', () => {
      this.showCertificate();
    });

    this.btnCloseCert.addEventListener('click', () => {
      this.modalCertificate.classList.add('hidden');
    });

    this.btnPrintCert.addEventListener('click', () => {
      window.print();
    });
  }

  showScreen(screenName) {
    this.screenRoadmap.classList.add('hidden');
    this.screenPlay.classList.add('hidden');
    this.screenBadgeSetup.classList.add('hidden');

    if (screenName === 'roadmap') {
      this.renderRoadmap();
      this.screenRoadmap.classList.remove('hidden');
    } else if (screenName === 'play') {
      this.screenPlay.classList.remove('hidden');
    } else if (screenName === 'badge') {
      this.screenBadgeSetup.classList.remove('hidden');
    }
  }

  updateStatsUI() {
    this.lblStars.textContent = `${this.stars} ⭐`;
    this.lblPlayerBadge.textContent = this.playerName ? `🎖️ ${this.playerName}` : '🎖️ Create Badge';

    // Total words across 26 letters
    let totalWords = 0;
    Object.keys(window.WORDS_DATA).forEach(k => {
      totalWords += window.WORDS_DATA[k].length;
    });

    const masteredCount = this.masteredWords.length;
    const pct = Math.min(100, Math.round((masteredCount / totalWords) * 100));
    this.lblProgressPct.textContent = `${pct}% Complete (${masteredCount}/${totalWords} Words)`;
    this.progressBarOverall.style.width = `${pct}%`;
  }

  showBadgeSetup() {
    this.inputPlayerName.value = this.playerName === 'Super Explorer' ? '' : this.playerName;
    this.showScreen('badge');
    window.Voice.speak("Hi friend! What's your name? Type your name to create your official Explorer Badge!");
  }

  savePlayerNameAndStartTyping() {
    const raw = this.inputPlayerName.value.trim().toUpperCase().replace(/[^A-Z]/g, '');
    if (!raw) {
      this.inputPlayerName.focus();
      return;
    }

    this.playerName = raw;
    localStorage.setItem('talk_type_player_name', this.playerName);
    this.updateStatsUI();

    // Launch Name Guided Typing Lesson!
    this.isNameTypingMode = true;
    this.startNameTypingLesson(this.playerName);
  }

  startNameTypingLesson(nameStr) {
    this.showScreen('play');
    this.cleanupCurrentRound();

    // Set stage card for player name
    this.stageCard.style.borderColor = '#EC4899';
    this.stageLetterTag.textContent = '🌟 MY NAME';
    this.stageEmoji.textContent = '👑';
    this.stageWordHint.textContent = `Explorer Badge for ${nameStr}!`;
    this.stagePhonics.textContent = 'Type each letter of your name on the keyboard!';

    // Hide Speak phase, directly go to Guided Type phase for Name
    this.sectionSpeak.classList.add('hidden');
    this.sectionType.classList.remove('hidden');

    this.currentWordObj = {
      word: nameStr,
      letter: nameStr[0],
      emoji: '🎖️',
      hint: `Super Typer Badge: ${nameStr}`
    };

    this.setupTypingSlots(nameStr);
    this.setMascot('happy', `Let's spell your name, ${nameStr}!`);

    window.Voice.speak(`Let's spell your name, ${nameStr}! First, find and press the letter ${nameStr[0]} on your keyboard!`, true);
  }

  renderRoadmap() {
    this.roadmapGrid.innerHTML = '';
    const letters = Object.keys(window.WORDS_DATA);

    letters.forEach(letter => {
      const words = window.WORDS_DATA[letter];
      let masteredInLetter = 0;
      words.forEach(w => {
        if (this.masteredWords.includes(w.word)) masteredInLetter++;
      });

      const isCompleted = masteredInLetter === words.length;

      const card = document.createElement('button');
      card.type = 'button';
      card.className = `letter-card ${isCompleted ? 'card-mastered' : ''}`;
      card.setAttribute('aria-label', `Letter ${letter}, ${masteredInLetter} of ${words.length} words mastered`);

      const letterBadge = document.createElement('div');
      letterBadge.className = 'letter-card-badge';
      letterBadge.textContent = letter;

      const previewEmoji = document.createElement('div');
      previewEmoji.className = 'letter-card-emoji';
      previewEmoji.textContent = words[0].emoji;

      const starsPill = document.createElement('div');
      starsPill.className = 'letter-card-stars';
      starsPill.innerHTML = `⭐ ${masteredInLetter}/${words.length}`;

      card.appendChild(letterBadge);
      card.appendChild(previewEmoji);
      card.appendChild(starsPill);

      card.addEventListener('click', () => {
        window.Sound.playKeyClick();
        this.startLetterAdventure(letter);
      });

      this.roadmapGrid.appendChild(card);
    });

    this.updateStatsUI();
  }

  startNextAvailableWord() {
    const letters = Object.keys(window.WORDS_DATA);
    for (const letter of letters) {
      const words = window.WORDS_DATA[letter];
      const unmastered = words.find(w => !this.masteredWords.includes(w.word));
      if (unmastered) {
        this.startWordAdventure(letter, words.indexOf(unmastered));
        return;
      }
    }
    // If all completed, start with letter A
    this.startWordAdventure('A', 0);
  }

  startLetterAdventure(letter) {
    const words = window.WORDS_DATA[letter] || [];
    let idx = words.findIndex(w => !this.masteredWords.includes(w.word));
    if (idx === -1) idx = 0;
    this.startWordAdventure(letter, idx);
  }

  startWordAdventure(letter, wordIndex = 0) {
    this.cleanupCurrentRound();
    this.isNameTypingMode = false;
    this.currentLetter = letter;
    this.currentWordIndex = wordIndex;

    const words = window.WORDS_DATA[letter];
    if (!words || !words[wordIndex]) return;

    this.currentWordObj = words[wordIndex];
    this.showScreen('play');

    // Stage Presentation (Look & Discover)
    this.stageCard.style.borderColor = this.currentWordObj.color || '#3B82F6';
    this.stageLetterTag.textContent = `Letter ${this.currentWordObj.letter}`;
    this.stageEmoji.textContent = this.currentWordObj.emoji;
    this.stageWordHint.textContent = this.currentWordObj.hint;
    this.stagePhonics.textContent = this.currentWordObj.phonics;

    // Reset phases: Show Speak section first
    this.sectionSpeak.classList.remove('hidden');
    this.sectionType.classList.add('hidden');
    this.btnHelpSay.classList.remove('hidden');
    this.btnHelpSay.innerHTML = `<span>Skip & Type It!</span> <i class="fa-solid fa-keyboard"></i>`;

    this.setMascot('listen', `Look! What is this?`);
    this.keyboard.setEnabled(false);

    // Speak intro
    const promptSpeech = `Look at the picture! What is this? Say it into the microphone!`;
    window.Voice.speak(promptSpeech, true, () => {
      // Auto-start listening if speech is supported
      this.startListeningForWord();
    });
  }

  startListeningForWord() {
    if (!this.currentWordObj) return;

    this.btnMic.classList.add('listening');
    this.micStatusText.textContent = `Listening... Say "${this.currentWordObj.word}"!`;
    this.micWaves.classList.remove('hidden');
    window.Sound.playMicStart();

    window.Speech.startListening(
      this.currentWordObj,
      // On Match
      (spoken, wordObj) => {
        window.Sound.playSpeechMatch();
        this.btnMic.classList.remove('listening');
        this.micStatusText.textContent = `🎉 You said: "${spoken}"! Perfect!`;
        this.micWaves.classList.add('hidden');
        this.onWordIdentified();
      },
      // On Mismatch
      (partialSpoken) => {
        this.micStatusText.textContent = `I heard: "${partialSpoken}"... Try saying "${this.currentWordObj.word}"!`;
      },
      // On State change
      (state) => {
        if (state === 'idle') {
          this.btnMic.classList.remove('listening');
          this.micWaves.classList.add('hidden');
        } else if (state === 'unsupported') {
          this.btnMic.classList.remove('listening');
          this.micWaves.classList.add('hidden');
          this.micStatusText.textContent = `Microphone not supported on this browser. Tap "Skip & Type It"!`;
        }
      }
    );
  }

  toggleSpeechListening() {
    if (window.Speech.isListening) {
      window.Speech.stopListening();
      this.btnMic.classList.remove('listening');
      this.micWaves.classList.add('hidden');
      this.micStatusText.textContent = `Tap the microphone to speak!`;
    } else {
      this.startListeningForWord();
    }
  }

  onWordIdentified() {
    window.Speech.stopListening();
    this.btnMic.classList.remove('listening');
    this.micWaves.classList.add('hidden');

    const word = this.currentWordObj.word;
    const namePraise = this.playerName ? `, ${this.playerName}` : '';
    const praise = `Awesome${namePraise}! It's a ${word}! Now let's spell it on the keyboard!`;

    this.setMascot('happy', `Super! It's a ${word}!`);
    window.Sound.playSpeechMatch();

    window.Voice.speak(praise, true, () => {
      this.transitionToTypingPhase();
    });
  }

  transitionToTypingPhase() {
    this.sectionSpeak.classList.add('hidden');
    this.sectionType.classList.remove('hidden');
    this.setupTypingSlots(this.currentWordObj.word);
    this.speakCurrentExpectedLetter();
  }

  setupTypingSlots(wordStr) {
    this.targetWordLetters = wordStr.toUpperCase().split('');
    this.currentLetterIdx = 0;
    this.wrongKeystrokeCount = 0;
    this.letterSlotsContainer.innerHTML = '';

    this.targetWordLetters.forEach((letter, i) => {
      const slot = document.createElement('div');
      slot.className = `letter-slot ${i === 0 ? 'slot-active' : ''}`;
      slot.dataset.index = i;

      const slotChar = document.createElement('span');
      slotChar.className = 'slot-char';
      slotChar.textContent = '_';

      slot.appendChild(slotChar);
      this.letterSlotsContainer.appendChild(slot);
    });

    this.keyboard.setEnabled(true);
    this.keyboard.setExpectedKey(this.targetWordLetters[0]);
    this.resetIdleHintTimer();
  }

  speakCurrentExpectedLetter() {
    if (this.currentLetterIdx >= this.targetWordLetters.length) return;
    const expected = this.targetWordLetters[this.currentLetterIdx];
    this.typePromptText.textContent = `Type letter: "${expected}"`;
    this.setMascot('pointing', `Press "${expected}" on your keyboard!`);

    const prompt = this.currentLetterIdx === 0
      ? `First, press letter ${expected} on your keyboard!`
      : `Great! Now press letter ${expected}!`;

    window.Voice.speak(prompt, true);
    this.resetIdleHintTimer();
  }

  handleTypedLetter(typedLetter) {
    if (this.currentLetterIdx >= this.targetWordLetters.length) return;

    const expected = this.targetWordLetters[this.currentLetterIdx];

    if (typedLetter === expected) {
      // Correct keystroke!
      window.Sound.playCorrectLetter();
      this.keyboard.clearHints();
      this.clearIdleHintTimer();
      this.wrongKeystrokeCount = 0;

      // Fill in slot
      const slots = this.letterSlotsContainer.querySelectorAll('.letter-slot');
      const currentSlot = slots[this.currentLetterIdx];
      if (currentSlot) {
        currentSlot.classList.remove('slot-active');
        currentSlot.classList.add('slot-filled');
        const charSpan = currentSlot.querySelector('.slot-char');
        if (charSpan) charSpan.textContent = expected;
      }

      this.currentLetterIdx++;

      if (this.currentLetterIdx < this.targetWordLetters.length) {
        // Next letter
        const nextSlot = slots[this.currentLetterIdx];
        if (nextSlot) nextSlot.classList.add('slot-active');
        this.keyboard.setExpectedKey(this.targetWordLetters[this.currentLetterIdx]);
        this.speakCurrentExpectedLetter();
      } else {
        // Entire word or name completed!
        this.onWordCompleted();
      }
    } else {
      // Mistake!
      window.Sound.playWrongLetter();
      this.keyboard.highlightMistake(typedLetter);
      this.wrongKeystrokeCount++;

      // Immediately prompt with visual hint
      this.keyboard.showHint(expected);
      this.setMascot('confused', `Find "${expected}" right here!`);

      const hintSpeech = `Oops! Find letter ${expected} on the glowing key!`;
      window.Voice.speak(hintSpeech, false);
      this.resetIdleHintTimer();
    }
  }

  resetIdleHintTimer() {
    this.clearIdleHintTimer();
    // After 3.8 seconds of hesitation, gently glow the key to help
    this.idleHintTimer = setTimeout(() => {
      if (this.currentLetterIdx < this.targetWordLetters.length) {
        const expected = this.targetWordLetters[this.currentLetterIdx];
        this.keyboard.showHint(expected);
        this.setMascot('pointing', `Look, here is ${expected}!`);
      }
    }, 3800);
  }

  clearIdleHintTimer() {
    if (this.idleHintTimer) {
      clearTimeout(this.idleHintTimer);
      this.idleHintTimer = null;
    }
  }

  onWordCompleted() {
    this.clearIdleHintTimer();
    this.keyboard.setEnabled(false);
    this.keyboard.clearHints();

    if (this.isNameTypingMode) {
      // Name Badge completed!
      window.Sound.playVictory();
      if (this.confetti) this.confetti.burst(80);

      this.setMascot('celebrate', `Hooray! You typed your name!`);
      const namePraise = `WOW, ${this.playerName}! You mastered typing your own name! Your official Explorer Badge is ready!`;

      window.Voice.speak(namePraise, true, () => {
        setTimeout(() => {
          this.isNameTypingMode = false;
          this.showScreen('roadmap');
        }, 1800);
      });
      return;
    }

    // Normal vocabulary word completed!
    window.Sound.playWordComplete();
    if (this.confetti) this.confetti.burst(75);

    // Save progress
    const word = this.currentWordObj.word;
    if (!this.masteredWords.includes(word)) {
      this.masteredWords.push(word);
      this.stars += 3;
      localStorage.setItem('talk_type_mastered', JSON.stringify(this.masteredWords));
      localStorage.setItem('talk_type_stars', this.stars.toString());
    }

    this.updateStatsUI();

    // Spelled out letters phonics celebration: A - P - P - L - E! Apple!
    const spelledOut = this.targetWordLetters.join(' - ');
    const celebrationSpeech = `${spelledOut}! ${word}! Fantastic typing, ${this.playerName || 'Super Learner'}!`;

    this.setMascot('celebrate', `🌟 ${word}! You did it!`);

    window.Voice.speak(celebrationSpeech, true, () => {
      this.showWordCompleteModal();
    });
  }

  showWordCompleteModal() {
    this.modalCelebrationEmoji.textContent = this.currentWordObj.emoji;
    this.modalSpelledWord.textContent = this.currentWordObj.word;
    this.modalWordMeaning.textContent = this.currentWordObj.hint;
    this.modalComplete.classList.remove('hidden');
    window.Sound.playStar();
  }

  startNextWordInSequence() {
    const words = window.WORDS_DATA[this.currentLetter];
    if (this.currentWordIndex + 1 < words.length) {
      this.startWordAdventure(this.currentLetter, this.currentWordIndex + 1);
    } else {
      // Advance to next letter
      const letters = Object.keys(window.WORDS_DATA);
      const nextLetterIdx = letters.indexOf(this.currentLetter) + 1;
      if (nextLetterIdx < letters.length) {
        this.startLetterAdventure(letters[nextLetterIdx]);
      } else {
        // All A-Z completed! Show Certificate!
        this.showCertificate();
      }
    }
  }

  showCertificate() {
    this.certPlayerName.textContent = this.playerName || 'Super Explorer';
    this.certStarsCount.textContent = this.stars.toString();
    this.certWordsCount.textContent = this.masteredWords.length.toString();
    this.modalCertificate.classList.remove('hidden');
    window.Sound.playVictory();
    if (this.confetti) this.confetti.burst(90);
    window.Voice.speak(`Congratulations, ${this.playerName || 'Super Explorer'}! You are an official Master Typer!`);
  }

  setMascot(emotion, speechText) {
    if (!this.mascotAvatar) return;
    this.mascotAvatar.className = `mascot-avatar mascot-${emotion}`;
    if (this.mascotBubble && speechText) {
      this.mascotBubble.textContent = speechText;
      this.mascotBubble.classList.remove('hidden');
    }
  }

  cleanupCurrentRound() {
    this.clearIdleHintTimer();
    window.Speech.stopListening();
    window.Voice.stop();
    if (this.keyboard) {
      this.keyboard.clearHints();
      this.keyboard.setEnabled(false);
    }
  }
}

// Start game when DOM is loaded
window.addEventListener('DOMContentLoaded', () => {
  window.Game = new TalkAndTypeGame();
});
