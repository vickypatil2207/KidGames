/**
 * Study With Fun - Core Game Application Controller
 * Manages game state, progress persistence, world roadmap, modals, and round lifecycle.
 */

class StudyGame {
  constructor() {
    this.currentLevelIndex = 0;
    this.currentRoundIndex = 0;
    this.score = 0;
    this.levelScore = 0;
    this.roundCorrectCount = 0;
    this.totalQuestionsInLevel = 0;
    this.currentLevel = null;

    // Matching state
    this.selectedMatchUpper = null;
    this.selectedMatchLower = null;
    this.resolvedPairsCount = 0;
    this.correctPairsCountInRound = 0;
    this.isRoundLocked = false;
    this.isMatchingLocked = false;

    // Confetti engine & Activities manager
    this.confetti = null;
    this.activities = new ActivityManager(this);

    // Load progress from localStorage
    this.progress = this.loadProgress();

    this.initDOM();
    this.bindEvents();
    this.renderRoadmap();
  }

  loadProgress() {
    try {
      const saved = localStorage.getItem('kidgames_studywithfun_progress');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && Array.isArray(parsed.unlockedLevels)) {
          if (!parsed.levelBestScores || typeof parsed.levelBestScores !== 'object') parsed.levelBestScores = {};
          if (typeof parsed.totalScore !== 'number' || isNaN(parsed.totalScore)) parsed.totalScore = 0;
          if (!parsed.levelStars || typeof parsed.levelStars !== 'object') parsed.levelStars = { 1: 0 };
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Could not read progress from localStorage:', e);
    }
    return {
      unlockedLevels: [1],
      levelStars: { 1: 0 },
      levelBestScores: { 1: 0 },
      totalScore: 0
    };
  }

  saveProgress() {
    try {
      localStorage.setItem('kidgames_studywithfun_progress', JSON.stringify(this.progress));
    } catch (e) {
      console.warn('Could not save progress to localStorage:', e);
    }
    this.updateNavbarStars();
  }

  resetProgress() {
    if (confirm('Are you sure you want to reset all game progress and stars?')) {
      this.progress = {
        unlockedLevels: [1],
        levelStars: { 1: 0 },
        levelBestScores: { 1: 0 },
        totalScore: 0
      };
      this.saveProgress();
      this.renderRoadmap();
      window.Sound.playPop();
    }
  }

  initDOM() {
    const canvas = document.getElementById('confetti-canvas');
    if (canvas && window.ConfettiCannon) {
      this.confetti = new ConfettiCannon(canvas);
    }

    this.screenRoadmap = document.getElementById('screen-roadmap');
    this.screenPlay = document.getElementById('screen-play');

    this.lblLevelTitle = document.getElementById('lbl-level-title');
    this.lblRoundCounter = document.getElementById('lbl-round-counter');
    this.lblScore = document.getElementById('lbl-score');
    this.progressBar = document.getElementById('progress-bar-fill');
    this.navStarsCount = document.getElementById('nav-stars-count');

    this.modalLevelComplete = document.getElementById('modal-level-complete');
    this.modalGraduation = document.getElementById('modal-graduation');

    this.updateNavbarStars();
  }

  updateNavbarStars() {
    let total = 0;
    Object.values(this.progress.levelStars).forEach(s => total += (s || 0));
    if (this.navStarsCount) {
      const maxStars = (window.GAME_LEVELS ? window.GAME_LEVELS.length : 30) * 3;
      this.navStarsCount.textContent = `${total} / ${maxStars}`;
    }
  }

  bindEvents() {
    // Audio toggles
    const btnMusic = document.getElementById('btn-toggle-music');
    if (btnMusic) {
      btnMusic.addEventListener('click', () => {
        const isPlaying = window.Sound.toggleMusic();
        btnMusic.innerHTML = isPlaying ? '<i class="fa-solid fa-music"></i> <span>Music ON</span>' : '<i class="fa-solid fa-volume-xmark"></i> <span>Music OFF</span>';
        btnMusic.classList.toggle('active', isPlaying);
      });
    }

    const btnSound = document.getElementById('btn-toggle-sound');
    if (btnSound) {
      btnSound.addEventListener('click', () => {
        const isEnabled = window.Sound.toggleSound();
        btnSound.innerHTML = isEnabled ? '<i class="fa-solid fa-volume-high"></i>' : '<i class="fa-solid fa-volume-xmark"></i>';
        btnSound.classList.toggle('active', isEnabled);
      });
    }

    const btnVoice = document.getElementById('btn-toggle-voice');
    if (btnVoice) {
      btnVoice.addEventListener('click', () => {
        const isEnabled = window.Sound.toggleVoice();
        btnVoice.innerHTML = isEnabled ? '<i class="fa-solid fa-comment-dots"></i> <span>Voice ON</span>' : '<i class="fa-solid fa-comment-slash"></i> <span>Voice OFF</span>';
        btnVoice.classList.toggle('active', isEnabled);
        if (isEnabled) {
          window.Voice.speak('Voice is on! Let us learn!');
        }
      });
    }

    // Reset progress
    const btnReset = document.getElementById('btn-reset-progress');
    if (btnReset) {
      btnReset.addEventListener('click', () => this.resetProgress());
    }

    // Back to map
    const btnBackMap = document.getElementById('btn-back-to-map');
    if (btnBackMap) {
      btnBackMap.addEventListener('click', () => {
        window.Sound.playPop();
        window.Voice.stop();
        this.showRoadmap();
      });
    }

    // Window resize dynamic arrow redraw
    window.addEventListener('resize', () => {
      if (this.activities) {
        this.activities.recalculateMatchArrows();
      }
    });

    // Modal navigation
    const btnNextLevel = document.getElementById('btn-modal-next-level');
    if (btnNextLevel) {
      btnNextLevel.addEventListener('click', () => {
        window.Sound.playPop();
        this.closeModals();
        if (this.currentLevelIndex + 1 < window.GAME_LEVELS.length) {
          this.startLevel(this.currentLevelIndex + 1);
        } else {
          this.showRoadmap();
        }
      });
    }

    const btnReplayLevel = document.getElementById('btn-modal-replay');
    if (btnReplayLevel) {
      btnReplayLevel.addEventListener('click', () => {
        window.Sound.playPop();
        this.closeModals();
        this.startLevel(this.currentLevelIndex);
      });
    }

    const btnMapFromModal = document.getElementById('btn-modal-map');
    if (btnMapFromModal) {
      btnMapFromModal.addEventListener('click', () => {
        window.Sound.playPop();
        this.closeModals();
        this.showRoadmap();
      });
    }

    const btnGraduationMap = document.getElementById('btn-grad-map');
    if (btnGraduationMap) {
      btnGraduationMap.addEventListener('click', () => {
        window.Sound.playPop();
        this.closeModals();
        this.showRoadmap();
      });
    }

    // Global keyboard listener
    window.addEventListener('keydown', (e) => this.handlePhysicalKeyboard(e));
  }

  showRoadmap() {
    this.screenPlay.classList.add('hidden');
    this.screenRoadmap.classList.remove('hidden');
    this.renderRoadmap();
    window.scrollTo(0, 0);
  }

  renderRoadmap() {
    const roadmapContainer = document.getElementById('roadmap-cards');
    if (!roadmapContainer) return;

    const levels = window.GAME_LEVELS || [];
    const worlds = window.GAME_WORLDS || [];
    const fragment = document.createDocumentFragment();

    // Group levels by world
    worlds.forEach(world => {
      const worldLevels = levels.filter(lvl => lvl.worldId === world.id);
      if (worldLevels.length === 0) return;

      // Count total stars in this world
      let worldStarsEarned = 0;
      let worldUnlockedCount = 0;
      worldLevels.forEach(lvl => {
        worldStarsEarned += (this.progress.levelStars[lvl.id] || 0);
        if (this.progress.unlockedLevels.includes(lvl.id)) worldUnlockedCount++;
      });
      const maxWorldStars = worldLevels.length * 3;

      // World Section Wrapper
      const worldSection = document.createElement('section');
      worldSection.className = 'world-section';
      worldSection.setAttribute('data-world-id', world.id);

      worldSection.innerHTML = `
        <div class="world-banner" style="background: ${world.bgGrad}">
          <div class="world-banner-left">
            <span class="world-icon">${world.icon}</span>
            <div class="world-info">
              <span class="world-badge">World ${world.id} • ${world.range}</span>
              <h2 class="world-title">${world.name}</h2>
              <p class="world-desc">${world.desc}</p>
            </div>
          </div>
          <div class="world-banner-right">
            <div class="world-stars-badge" title="Stars earned in this world">
              <span>⭐</span> <strong>${worldStarsEarned} / ${maxWorldStars}</strong>
            </div>
          </div>
        </div>

        <div class="roadmap-grid"></div>
      `;

      const grid = worldSection.querySelector('.roadmap-grid');

      worldLevels.forEach((level) => {
        const levelIdx = levels.findIndex(l => l.id === level.id);
        const isUnlocked = this.progress.unlockedLevels.includes(level.id);
        const starsEarned = this.progress.levelStars[level.id] || 0;
        const bestScore = (this.progress.levelBestScores && this.progress.levelBestScores[level.id]) || 0;

        const card = document.createElement('div');
        card.className = `level-card ${isUnlocked ? 'unlocked' : 'locked'}`;
        card.setAttribute('data-level-id', level.id);

        let starsHTML = '';
        for (let s = 1; s <= 3; s++) {
          starsHTML += s <= starsEarned
            ? '<span class="star-icon filled">⭐</span>'
            : '<span class="star-icon empty">☆</span>';
        }

        card.innerHTML = `
          <div class="level-card-header" style="background: ${level.bgGrad}">
            <span class="level-badge">${level.badge}</span>
            <span class="level-icon">${level.icon}</span>
          </div>
          <div class="level-card-body">
            <h3 class="level-name">${level.title}</h3>
            <p class="level-desc">${level.subtitle}</p>
            <div class="level-stars">${starsHTML}</div>
            ${starsEarned > 0 ? `<div class="level-best-score">🏆 Best: <strong>${bestScore}</strong> pts</div>` : ''}
            <button class="btn-play-level ${isUnlocked ? 'btn-unlocked' : 'btn-locked'}" ${isUnlocked ? '' : 'disabled'}>
              ${isUnlocked ? (starsEarned > 0 ? '▶ Play Again' : '▶ Start Level') : '🔒 Locked'}
            </button>
          </div>
        `;

        if (isUnlocked) {
          card.addEventListener('click', () => {
            window.Sound.playPop();
            this.startLevel(levelIdx);
          });
        }

        grid.appendChild(card);
      });

      fragment.appendChild(worldSection);
    });

    roadmapContainer.innerHTML = '';
    roadmapContainer.appendChild(fragment);
  }

  startLevel(index) {
    this.currentLevelIndex = index;
    this.currentLevel = window.GAME_LEVELS[index];
    this.currentRoundIndex = 0;
    this.roundCorrectCount = 0;
    this.levelScore = 0;
    this.totalQuestionsInLevel = this.currentLevel.rounds.length;

    if (this.lblLevelTitle) {
      this.lblLevelTitle.textContent = `${this.currentLevel.badge}: ${this.currentLevel.title}`;
    }

    this.screenRoadmap.classList.add('hidden');
    this.screenPlay.classList.remove('hidden');
    window.scrollTo(0, 0);

    // Instantly render game board without waiting for voice callback!
    this.renderRound();
  }

  renderRound() {
    this.isRoundLocked = false;
    const round = this.currentLevel.rounds[this.currentRoundIndex];

    if (!round) {
      this.completeLevel();
      return;
    }

    const currentNum = this.currentRoundIndex + 1;
    if (this.lblRoundCounter) {
      this.lblRoundCounter.textContent = `Round ${currentNum} / ${this.totalQuestionsInLevel}`;
    }
    if (this.progressBar) {
      const pct = (currentNum / this.totalQuestionsInLevel) * 100;
      this.progressBar.style.width = `${pct}%`;
    }
    if (this.lblScore) {
      this.lblScore.textContent = `${this.levelScore || 0}`;
    }

    const questionContainer = document.getElementById('play-question-area');
    questionContainer.innerHTML = '';

    const type = round.subType || this.currentLevel.type;

    if (type === 'next_alpha') {
      this.activities.renderNextAlphaRound(round, questionContainer);
    } else if (type === 'count_items') {
      this.activities.renderCountRound(round, questionContainer);
    } else if (type === 'match_letters') {
      this.activities.renderMatchRound(round, questionContainer);
    } else if (type === 'match_picture') {
      this.activities.renderPictureMatchRound(round, questionContainer);
    } else if (type === 'next_num') {
      this.activities.renderNextNumRound(round, questionContainer);
    } else if (type === 'missing_letter') {
      this.activities.renderMissingLetterRound(round, questionContainer);
    } else if (type === 'identify_color') {
      this.activities.renderColorRound(round, questionContainer);
    } else if (type === 'identify_shape') {
      this.activities.renderShapeRound(round, questionContainer);
    } else if (type === 'compare_opposites') {
      this.activities.renderOppositesRound(round, questionContainer);
    } else if (type === 'odd_one_out') {
      this.activities.renderOddOneOutRound(round, questionContainer);
    }
  }

  checkAnswer(selectedVal, correctVal, btnElement, targetSlotElement = null, customSuccessHandler = null) {
    if (this.isRoundLocked) return;
    this.isRoundLocked = true;

    const playArea = document.getElementById('play-question-area');
    const allBtns = playArea.querySelectorAll('.choice-btn, .color-swatch-btn, .shape-card-btn, .opposite-card, .odd-item-btn');
    allBtns.forEach(b => {
      b.disabled = true;
      b.style.pointerEvents = 'none';
    });

    const isMatch = selectedVal.toString().trim().toUpperCase() === correctVal.toString().trim().toUpperCase();

    if (isMatch) {
      window.Sound.playCorrect();
      if (this.confetti) this.confetti.burst(30);

      btnElement.classList.add('btn-correct');
      if (targetSlotElement) {
        targetSlotElement.classList.add('filled', 'pop-in');
        const letterSpan = targetSlotElement.querySelector('.node-letter');
        if (letterSpan) letterSpan.textContent = correctVal;
      }

      const points = Math.round(100 / this.totalQuestionsInLevel);
      this.levelScore += points;
      this.roundCorrectCount++;
      if (this.lblScore) this.lblScore.textContent = `${this.levelScore}`;

      const advanceToNext = () => {
        setTimeout(() => {
          this.currentRoundIndex++;
          this.renderRound();
        }, 700);
      };

      if (typeof customSuccessHandler === 'function') {
        customSuccessHandler(advanceToNext);
      } else {
        window.Voice.speak(`Super! ${correctVal} is correct!`, true);
        advanceToNext();
      }
    } else {
      window.Sound.playWrong();
      btnElement.classList.add('btn-wrong', 'shake');

      allBtns.forEach(b => {
        if (b.getAttribute('data-val') && b.getAttribute('data-val').toString().trim().toUpperCase() === correctVal.toString().trim().toUpperCase()) {
          b.classList.add('btn-correct-reveal');
        }
      });

      if (targetSlotElement) {
        const letterSpan = targetSlotElement.querySelector('.node-letter');
        if (letterSpan) letterSpan.textContent = correctVal;
        targetSlotElement.classList.add('revealed');
      }

      window.Voice.speak(`Oops! The right answer is ${correctVal}!`, true);
      setTimeout(() => {
        this.currentRoundIndex++;
        this.renderRound();
      }, 950);
    }
  }

  handlePhysicalKeyboard(e) {
    if (this.isRoundLocked || this.isMatchingLocked) return;
    if (this.screenPlay.classList.contains('hidden')) return;

    const key = e.key.toUpperCase();
    const playArea = document.getElementById('play-question-area');
    if (!playArea) return;

    const btns = Array.from(playArea.querySelectorAll('.choice-btn:not([disabled]), .color-swatch-btn:not([disabled]), .shape-card-btn:not([disabled])'));
    const matchedBtn = btns.find(b => {
      const val = b.getAttribute('data-val');
      return val && val.toUpperCase() === key;
    });

    if (matchedBtn) {
      matchedBtn.click();
    }
  }

  completeLevel() {
    window.Voice.stop();
    const currentLvlId = this.currentLevel.id;
    const accuracy = Math.round((this.roundCorrectCount / this.totalQuestionsInLevel) * 100);

    let stars = 0;
    if (accuracy >= 85) stars = 3;
    else if (accuracy >= 65) stars = 2;
    else if (accuracy >= 50) stars = 1;

    if (stars > 0) {
      const prevStars = this.progress.levelStars[currentLvlId] || 0;
      if (stars > prevStars) {
        this.progress.levelStars[currentLvlId] = stars;
      }

      const prevScore = (this.progress.levelBestScores && this.progress.levelBestScores[currentLvlId]) || 0;
      if (this.levelScore > prevScore) {
        this.progress.levelBestScores[currentLvlId] = this.levelScore;
      }

      if (currentLvlId < window.GAME_LEVELS.length) {
        const nextLvlId = currentLvlId + 1;
        if (!this.progress.unlockedLevels.includes(nextLvlId)) {
          this.progress.unlockedLevels.push(nextLvlId);
        }
      }

      this.saveProgress();
      window.Sound.playVictory();
      if (this.confetti) this.confetti.burst(80);

      if (currentLvlId === window.GAME_LEVELS.length) {
        this.showGraduationModal();
      } else {
        this.showLevelCompleteModal(stars, true, accuracy);
      }
    } else {
      window.Sound.playWrong();
      this.showLevelCompleteModal(0, false, accuracy);
    }
  }

  showLevelCompleteModal(stars, passed, accuracy) {
    if (!this.modalLevelComplete) return;

    const titleEl = document.getElementById('modal-title');
    const subtitleEl = document.getElementById('modal-subtitle');
    const starsContainer = document.getElementById('modal-stars-container');
    const scoreValEl = document.getElementById('modal-score-val');
    const btnNext = document.getElementById('btn-modal-next-level');
    const btnReplay = document.getElementById('btn-modal-replay');

    scoreValEl.textContent = `${this.levelScore}`;

    if (passed) {
      titleEl.innerHTML = stars === 3 ? '🌟 Fantastic Superstar! 🌟' : '🎉 Great Job! Level Passed! 🎉';
      titleEl.style.color = '#0F172A';
      subtitleEl.innerHTML = `You got <strong>${Math.round(this.roundCorrectCount)} of ${this.totalQuestionsInLevel}</strong> right (${accuracy}%)!`;
      if (btnNext) btnNext.style.display = 'inline-flex';
      if (btnReplay) btnReplay.classList.remove('pulse-replay');
      window.Voice.speak(`Awesome job! You earned ${stars} stars!`, true);
    } else {
      titleEl.innerHTML = '❌ Level Not Passed ❌';
      titleEl.style.color = '#DC2626';
      subtitleEl.innerHTML = `You scored <strong>${Math.round(this.roundCorrectCount)} of ${this.totalQuestionsInLevel}</strong> correct (${accuracy}%).<br><div class="modal-failed-tip"><i class="fa-solid fa-triangle-exclamation"></i> You need at least <strong>50% (1 star)</strong> to unlock the next level! Please replay this level.</div>`;
      if (btnNext) btnNext.style.display = 'none';
      if (btnReplay) {
        btnReplay.classList.add('pulse-replay');
        btnReplay.focus();
      }
      window.Voice.speak('Level not passed. Please replay the level to unlock the next level!', true);
    }

    starsContainer.innerHTML = '';
    for (let s = 1; s <= 3; s++) {
      const starSpan = document.createElement('span');
      starSpan.className = `modal-star ${s <= stars ? 'star-gold' : 'star-gray'}`;
      starSpan.textContent = s <= stars ? '⭐' : '☆';
      starsContainer.appendChild(starSpan);

      if (s <= stars) {
        setTimeout(() => {
          starSpan.classList.add('star-pop');
          window.Sound.playStar(s);
        }, s * 300);
      }
    }

    this.modalLevelComplete.classList.remove('hidden');
  }

  showGraduationModal() {
    if (!this.modalGraduation) return;
    window.Sound.playVictory();
    if (this.confetti) this.confetti.burst(120);
    window.Voice.speak('Congratulations! You are an Alphabet, Number, Color, Shape, and Phonics Grand Master Champion! You completed all 30 levels!');
    this.modalGraduation.classList.remove('hidden');
  }

  closeModals() {
    if (this.modalLevelComplete) this.modalLevelComplete.classList.add('hidden');
    if (this.modalGraduation) this.modalGraduation.classList.add('hidden');
  }
}

// Instantiate game on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  window.StudyGameApp = new StudyGame();
});
