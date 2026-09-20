/**
 * Study With Fun - Activity Renderers & Interactive Gameplay Mechanics
 * Supports 10 distinct activity engines with single-attempt educational feedback.
 */

class ActivityManager {
  constructor(game) {
    this.game = game;
  }

  /**
   * Helper: Generate crossed diagonal order for match cards
   * Guaranteed never to match horizontally on the same row!
   */
  getCrossedOrder(pairs) {
    const n = pairs.length;
    if (n === 3) return [pairs[1], pairs[2], pairs[0]];
    if (n === 4) return [pairs[1], pairs[3], pairs[0], pairs[2]];
    if (n === 5) return [pairs[2], pairs[4], pairs[1], pairs[3], pairs[0]];
    return [...pairs].reverse();
  }

  /* ====================================================================
     TYPE 1: NEXT ALPHABET (A -> B -> C -> ?)
     ==================================================================== */
  renderNextAlphaRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper next-alpha-activity';

    const speechText = `Find what letter comes next after ${round.seq[round.seq.length - 1]}!`;
    window.Voice.speak(speechText);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🚂</span>
        <span class="instruction-text">${round.hint || 'What letter comes next in the ABC train?'}</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="sequence-track">
        ${round.seq.map(letter => `
          <div class="seq-node past-node">
            <span class="node-letter">${letter}</span>
          </div>
          <span class="seq-arrow">➔</span>
        `).join('')}
        <div class="seq-node target-node" id="target-slot">
          <span class="node-letter">❓</span>
        </div>
      </div>

      <div id="revealed-phonic-box" class="revealed-container"></div>

      <div class="options-grid" id="options-grid">
        ${round.options.map(opt => `
          <button class="choice-btn" data-val="${opt}">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const targetSlot = wrapper.querySelector('#target-slot');
    const optionBtns = wrapper.querySelectorAll('.choice-btn');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.checkAnswer(
          btn.getAttribute('data-val'),
          round.answer,
          btn,
          targetSlot,
          (advanceCallback) => {
            const phonicText = round.phonic || `${round.answer} is for Super Star! ⭐`;
            const phonicBox = wrapper.querySelector('#revealed-phonic-box');
            if (phonicBox) {
              phonicBox.innerHTML = `
                <div class="revealed-phonic-banner">
                  <span>🎉</span>
                  <span><strong>${round.answer}</strong> — ${phonicText}</span>
                </div>
              `;
            }
            window.Voice.speak(`Super! ${round.answer}! ${phonicText}`, true);
            advanceCallback();
          }
        );
      });
    });
  }

  /* ====================================================================
     TYPE 2: COUNTING ITEMS (1 - 20)
     ==================================================================== */
  renderCountRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper count-activity';

    const speechText = `Count the ${round.name}! How many are there?`;
    window.Voice.speak(speechText);

    let itemsHTML = '';
    for (let i = 1; i <= round.count; i++) {
      itemsHTML += `
        <div class="count-item-bubble" data-index="${i}" title="Tap me to count!">
          <span class="item-emoji">${round.item}</span>
        </div>
      `;
    }

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🖐️</span>
        <span class="instruction-text">Count the <strong>${round.name}</strong>! Tap each one to count!</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="count-stage" id="count-stage">
        ${itemsHTML}
      </div>
      <div class="count-tip">💡 Tap on items to count, or select the answer below!</div>

      <div class="options-grid" id="options-grid">
        ${round.options.map(opt => `
          <button class="choice-btn num-btn" data-val="${opt}">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    let currentTapCount = 0;
    const itemBubbles = wrapper.querySelectorAll('.count-item-bubble');
    itemBubbles.forEach(item => {
      item.addEventListener('click', () => {
        if (!item.classList.contains('tapped')) {
          currentTapCount++;
          item.classList.add('tapped');
          item.innerHTML += `<span class="item-count-badge">${currentTapCount}</span>`;
          window.Sound.playCount(currentTapCount);
          window.Voice.speak(`${currentTapCount}`, true);
        } else {
          const badge = item.querySelector('.item-count-badge');
          if (badge) {
            window.Voice.speak(badge.textContent, true);
          }
        }
      });
    });

    const optionBtns = wrapper.querySelectorAll('.choice-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.checkAnswer(btn.getAttribute('data-val'), round.count.toString(), btn);
      });
    });
  }

  /* ====================================================================
     TYPE 3: MATCH CAPITAL & SMALL LETTERS (A <-> a)
     ==================================================================== */
  renderMatchRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper match-activity';

    const speechText = 'Join the Big Capital Letter to its Small Letter!';
    window.Voice.speak(speechText);

    this.game.resolvedPairsCount = 0;
    this.game.correctPairsCountInRound = 0;
    this.game.selectedMatchUpper = null;
    this.game.selectedMatchLower = null;
    this.game.isMatchingLocked = false;

    const crossedPairs = this.getCrossedOrder(round.pairs);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🤝</span>
        <span class="instruction-text">Join the <strong>Big Letter</strong> to its <strong>Small Letter</strong>!</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="match-arena" id="match-arena">
        <svg class="match-svg-canvas" id="match-svg-canvas"></svg>

        <div class="match-col upper-col">
          <div class="col-heading">Big Letters 🅰️</div>
          ${round.pairs.map(p => `
            <button class="match-card upper-card" data-letter="${p.upper}">
              <div class="card-text-group">
                <span class="card-main-letter">${p.upper}</span>
                <span class="card-hint">${p.word}</span>
              </div>
              <div class="pointer-node pointer-right" title="Connecting pointer">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </button>
          `).join('')}
        </div>

        <div class="match-divider">
          <i class="fa-solid fa-arrows-left-right"></i>
        </div>

        <div class="match-col lower-col">
          <div class="col-heading">Small Letters 🔡</div>
          ${crossedPairs.map(p => `
            <button class="match-card lower-card" data-letter="${p.lower}" data-match="${p.upper}">
              <div class="pointer-node pointer-left" title="Connecting pointer">
                <i class="fa-solid fa-arrow-left"></i>
              </div>
              <div class="card-text-group">
                <span class="card-main-letter">${p.lower}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    this.bindMatchCardEvents(round, wrapper, false);
  }

  /* ====================================================================
     TYPE 4: MATCH PICTURE TO STARTING LETTER (🍎 -> A)
     ==================================================================== */
  renderPictureMatchRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper match-activity picture-match-activity';

    const speechText = 'Match each picture to its first starting letter!';
    window.Voice.speak(speechText);

    this.game.resolvedPairsCount = 0;
    this.game.correctPairsCountInRound = 0;
    this.game.selectedMatchUpper = null;
    this.game.selectedMatchLower = null;
    this.game.isMatchingLocked = false;

    const crossedPairs = this.getCrossedOrder(round.pairs);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🖼️</span>
        <span class="instruction-text">Connect each <strong>Picture</strong> to its <strong>Letter</strong>!</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="match-arena" id="match-arena">
        <svg class="match-svg-canvas" id="match-svg-canvas"></svg>

        <div class="match-col upper-col">
          <div class="col-heading">Pictures 🖼️</div>
          ${round.pairs.map(p => `
            <button class="match-card upper-card picture-card" data-letter="${p.letter}">
              <div class="card-text-group">
                <span class="card-picture-label">${p.item}</span>
              </div>
              <div class="pointer-node pointer-right" title="Connecting pointer">
                <i class="fa-solid fa-arrow-right"></i>
              </div>
            </button>
          `).join('')}
        </div>

        <div class="match-divider">
          <i class="fa-solid fa-arrows-left-right"></i>
        </div>

        <div class="match-col lower-col">
          <div class="col-heading">Letters 🔤</div>
          ${crossedPairs.map(p => `
            <button class="match-card lower-card letter-card" data-letter="${p.letter}" data-match="${p.letter}">
              <div class="pointer-node pointer-left" title="Connecting pointer">
                <i class="fa-solid fa-arrow-left"></i>
              </div>
              <div class="card-text-group">
                <span class="card-main-letter">${p.letter}</span>
              </div>
            </button>
          `).join('')}
        </div>
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    this.bindMatchCardEvents(round, wrapper, true);
  }

  bindMatchCardEvents(round, wrapper, isPictureMatch) {
    const upperCards = wrapper.querySelectorAll('.upper-card');
    const lowerCards = wrapper.querySelectorAll('.lower-card');

    upperCards.forEach(card => {
      card.addEventListener('click', () => {
        if (this.game.isMatchingLocked) return;
        if (card.classList.contains('paired') || card.classList.contains('paired-failed')) return;
        upperCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.game.selectedMatchUpper = card;
        window.Sound.playPop();

        const val = card.getAttribute('data-letter');
        const voiceTxt = isPictureMatch ? `${card.textContent.trim()}` : `Capital ${val}`;
        window.Voice.speak(voiceTxt, true);

        this.checkMatchPair(round, wrapper, isPictureMatch);
      });
    });

    lowerCards.forEach(card => {
      card.addEventListener('click', () => {
        if (this.game.isMatchingLocked) return;
        if (card.classList.contains('paired') || card.classList.contains('paired-failed')) return;
        lowerCards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.game.selectedMatchLower = card;
        window.Sound.playPop();

        const val = card.getAttribute('data-letter');
        const voiceTxt = isPictureMatch ? `Letter ${val}` : `Small ${val}`;
        window.Voice.speak(voiceTxt, true);

        this.checkMatchPair(round, wrapper, isPictureMatch);
      });
    });
  }

  checkMatchPair(round, wrapper, isPictureMatch = false) {
    if (this.game.isMatchingLocked) return;
    if (!this.game.selectedMatchUpper || !this.game.selectedMatchLower) return;

    const upperCard = this.game.selectedMatchUpper;
    const lowerCard = this.game.selectedMatchLower;
    const upperLetter = upperCard.getAttribute('data-letter');
    const lowerMatch = lowerCard.getAttribute('data-match');

    if (upperLetter === lowerMatch) {
      window.Sound.playCorrect();
      if (this.game.confetti) this.game.confetti.burst(25);

      const pal = window.LETTER_COLOR_PALETTE[upperLetter.toUpperCase()] || {
        name: 'Vibrant',
        color: '#2563EB',
        bg: '#DBEAFE',
        border: '#1D4ED8'
      };

      const pairInfo = round.pairs.find(p => (p.upper === upperLetter || p.letter === upperLetter));
      const wordText = pairInfo ? (pairInfo.word || pairInfo.item) : `${upperLetter}`;

      this.drawMatchArrow(wrapper, upperCard, lowerCard, pal.color, upperLetter, false);

      upperCard.classList.remove('selected');
      lowerCard.classList.remove('selected');
      upperCard.classList.add('paired');
      lowerCard.classList.add('paired');

      [upperCard, lowerCard].forEach(card => {
        card.style.borderColor = pal.border;
        card.style.backgroundColor = pal.bg;
        card.style.color = pal.color;
        card.style.boxShadow = `0 6px 18px ${pal.color}33`;
        const ptr = card.querySelector('.pointer-node');
        if (ptr) {
          ptr.style.backgroundColor = pal.color;
          ptr.style.borderColor = pal.border;
          ptr.style.color = '#FFF';
        }
      });

      this.game.selectedMatchUpper = null;
      this.game.selectedMatchLower = null;
      this.game.correctPairsCountInRound++;
      this.game.resolvedPairsCount++;

      const pointsPerPair = Math.round(100 / round.pairs.length);
      this.game.levelScore += pointsPerPair;
      if (this.game.lblScore) this.game.lblScore.textContent = `${this.game.levelScore}`;

      if (this.game.resolvedPairsCount >= round.pairs.length) {
        this.game.roundCorrectCount += (this.game.correctPairsCountInRound / round.pairs.length);
        const praiseMsg = isPictureMatch
          ? `Super! ${wordText} starts with ${upperLetter}! You completed this set!`
          : `Awesome! ${upperLetter} is for ${wordText}! You completed this set!`;
        window.Voice.speak(praiseMsg, true);
        setTimeout(() => {
          this.game.currentRoundIndex++;
          this.game.renderRound();
        }, 700);
      } else {
        const praiseMsg = isPictureMatch
          ? `Great! ${wordText} starts with ${upperLetter}!`
          : `Great! ${upperLetter} is for ${wordText}!`;
        window.Voice.speak(praiseMsg, true);
      }
    } else {
      this.game.isMatchingLocked = true;
      window.Sound.playWrong();

      upperCard.classList.add('shake');
      lowerCard.classList.add('shake');

      const correctLowerCard = wrapper.querySelector(`.lower-card[data-match="${upperLetter}"]`);
      if (correctLowerCard) {
        this.drawMatchArrow(wrapper, upperCard, correctLowerCard, '#EF4444', upperLetter, true);
        correctLowerCard.classList.add('paired-revealed');
      }

      upperCard.classList.remove('selected');
      upperCard.classList.add('paired-failed');
      if (correctLowerCard) {
        correctLowerCard.classList.add('paired-failed');
      }

      if (lowerCard !== correctLowerCard) {
        lowerCard.classList.remove('selected', 'shake');
      }

      this.game.resolvedPairsCount++;

      const pairInfo = round.pairs.find(p => (p.upper === upperLetter || p.letter === upperLetter));
      const nameTxt = pairInfo ? (pairInfo.word || pairInfo.item) : upperLetter;
      const speechMsg = isPictureMatch
        ? `Oops! ${nameTxt} starts with Letter ${upperLetter}!`
        : `Oops! Big ${upperLetter} matches with small ${upperLetter.toLowerCase()}!`;

      window.Voice.speak(speechMsg, true);
      setTimeout(() => {
        upperCard.classList.remove('shake');
        this.game.selectedMatchUpper = null;
        this.game.selectedMatchLower = null;
        this.game.isMatchingLocked = false;

        if (this.game.resolvedPairsCount >= round.pairs.length) {
          this.game.roundCorrectCount += (this.game.correctPairsCountInRound / round.pairs.length);
          this.game.currentRoundIndex++;
          this.game.renderRound();
        }
      }, 900);
    }
  }

  drawMatchArrow(wrapper, upperCard, lowerCard, strokeColor, letterKey, isError = false) {
    const arena = wrapper.querySelector('#match-arena');
    const svg = wrapper.querySelector('#match-svg-canvas');
    if (!arena || !svg) return;

    const arenaRect = arena.getBoundingClientRect();
    const upperPtr = upperCard.querySelector('.pointer-node') || upperCard;
    const lowerPtr = lowerCard.querySelector('.pointer-node') || lowerCard;

    const upperRect = upperPtr.getBoundingClientRect();
    const lowerRect = lowerPtr.getBoundingClientRect();

    const x1 = (upperRect.left + upperRect.width / 2) - arenaRect.left;
    const y1 = (upperRect.top + upperRect.height / 2) - arenaRect.top;
    const x2 = (lowerRect.left + lowerRect.width / 2) - arenaRect.left;
    const y2 = (lowerRect.top + lowerRect.height / 2) - arenaRect.top;

    const markerId = `arrowhead-${letterKey}-${isError ? 'err-' : ''}${Date.now()}`;
    let defs = svg.querySelector('defs');
    if (!defs) {
      defs = document.createElementNS('http://www.w3.org/2000/svg', 'defs');
      svg.appendChild(defs);
    }

    const marker = document.createElementNS('http://www.w3.org/2000/svg', 'marker');
    marker.setAttribute('id', markerId);
    marker.setAttribute('viewBox', '0 0 10 10');
    marker.setAttribute('refX', '7');
    marker.setAttribute('refY', '5');
    marker.setAttribute('markerWidth', '7');
    marker.setAttribute('markerHeight', '7');
    marker.setAttribute('orient', 'auto-start-reverse');

    const path = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    path.setAttribute('d', 'M 0 1 L 10 5 L 0 9 z');
    path.setAttribute('fill', strokeColor);
    marker.appendChild(path);
    defs.appendChild(marker);

    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
    line.setAttribute('x1', x1);
    line.setAttribute('y1', y1);
    line.setAttribute('x2', x2);
    line.setAttribute('y2', y2);
    line.setAttribute('stroke', strokeColor);
    line.setAttribute('stroke-width', isError ? '4' : '5');
    line.setAttribute('stroke-linecap', 'round');
    line.setAttribute('marker-end', `url(#${markerId})`);
    line.setAttribute('data-upper', upperCard.getAttribute('data-letter') || '');
    line.setAttribute('data-lower', lowerCard.getAttribute('data-letter') || '');

    if (isError) {
      line.classList.add('match-arrow-line-error');
    } else {
      line.classList.add('match-arrow-line');
    }

    svg.appendChild(line);
  }

  recalculateMatchArrows() {
    const arena = document.getElementById('match-arena');
    const svg = document.getElementById('match-svg-canvas');
    if (!arena || !svg) return;

    const arenaRect = arena.getBoundingClientRect();
    const lines = svg.querySelectorAll('line');
    lines.forEach(line => {
      const upperLetter = line.getAttribute('data-upper');
      const lowerLetter = line.getAttribute('data-lower');
      if (!upperLetter || !lowerLetter) return;
      const upperCard = arena.querySelector(`.upper-card[data-letter="${upperLetter}"]`);
      const lowerCard = arena.querySelector(`.lower-card[data-letter="${lowerLetter}"]`);
      if (!upperCard || !lowerCard) return;

      const upperPtr = upperCard.querySelector('.pointer-node') || upperCard;
      const lowerPtr = lowerCard.querySelector('.pointer-node') || lowerCard;

      const upperRect = upperPtr.getBoundingClientRect();
      const lowerRect = lowerPtr.getBoundingClientRect();

      line.setAttribute('x1', (upperRect.left + upperRect.width / 2) - arenaRect.left);
      line.setAttribute('y1', (upperRect.top + upperRect.height / 2) - arenaRect.top);
      line.setAttribute('x2', (lowerRect.left + lowerRect.width / 2) - arenaRect.left);
      line.setAttribute('y2', (lowerRect.top + lowerRect.height / 2) - arenaRect.top);
    });
  }

  /* ====================================================================
     TYPE 5: NUMBER SEQUENCES & SKIP COUNTING (1 -> 2 -> 3 -> ?)
     ==================================================================== */
  renderNextNumRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper next-num-activity';

    const speechText = 'What number comes next? Choose the right number below!';
    window.Voice.speak(speechText);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🔢</span>
        <span class="instruction-text">${round.hint || 'What number comes next in the line?'}</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="sequence-track">
        ${round.seq.map(num => `
          <div class="seq-node past-node num-node">
            <span class="node-letter">${num}</span>
          </div>
          <span class="seq-arrow">➔</span>
        `).join('')}
        <div class="seq-node target-node num-node" id="target-slot">
          <span class="node-letter">❓</span>
        </div>
      </div>

      <div id="revealed-num-box" class="revealed-container"></div>

      <div class="options-grid" id="options-grid">
        ${round.options.map(opt => `
          <button class="choice-btn num-btn" data-val="${opt}">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const targetSlot = wrapper.querySelector('#target-slot');
    const optionBtns = wrapper.querySelectorAll('.choice-btn');

    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.checkAnswer(
          btn.getAttribute('data-val'),
          round.answer.toString(),
          btn,
          targetSlot,
          (advanceCallback) => {
            const numBox = wrapper.querySelector('#revealed-num-box');
            if (numBox) {
              numBox.innerHTML = `
                <div class="revealed-phonic-banner">
                  <span>🎉</span>
                  <span>Number <strong>${round.answer}</strong> is next! Fantastic!</span>
                </div>
              `;
            }
            window.Voice.speak(`Number ${round.answer} is next! Awesome job!`, true);
            advanceCallback();
          }
        );
      });
    });
  }

  /* ====================================================================
     TYPE 6: MISSING PHONICS LETTER (C _ T -> A)
     ==================================================================== */
  renderMissingLetterRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper missing-letter-activity';

    const speechText = `Look at the ${round.full}! Fill the missing letter in ${round.word}!`;
    window.Voice.speak(speechText);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">${round.icon}</span>
        <span class="instruction-text">${round.hint || 'Fill the missing letter!'}</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="missing-word-card">
        <div class="word-picture">${round.icon}</div>
        <div class="word-slots">
          <span class="word-display" id="word-display">${round.word}</span>
        </div>
      </div>

      <div id="revealed-missing-box" class="revealed-container"></div>

      <div class="options-grid" id="options-grid">
        ${round.options.map(opt => `
          <button class="choice-btn" data-val="${opt}">
            <span>${opt}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const optionBtns = wrapper.querySelectorAll('.choice-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.checkAnswer(btn.getAttribute('data-val'), round.answer, btn, null, (advanceCallback) => {
          wrapper.querySelector('#word-display').textContent = round.full;
          const box = wrapper.querySelector('#revealed-missing-box');
          if (box) {
            box.innerHTML = `
              <div class="revealed-phonic-banner">
                <span>🎉</span>
                <span><strong>${round.full}</strong> is correct!</span>
              </div>
            `;
          }
          window.Voice.speak(`Super! ${round.full}!`, true);
          advanceCallback();
        });
      });
    });
  }

  /* ====================================================================
     TYPE 7: IDENTIFY COLOR OF OBJECT (Apple -> Red 🔴)
     ==================================================================== */
  renderColorRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper color-activity';

    const speechText = `What color is this ${round.name}? Choose the right color!`;
    window.Voice.speak(speechText);

    const COLOR_DOTS = {
      'Red': '🔴', 'Yellow': '🟡', 'Green': '🟢', 'Blue': '🔵',
      'Orange': '🟠', 'Purple': '🟣', 'Pink': '🌸', 'Brown': '🟤',
      'Black': '⚫', 'White': '⚪'
    };

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🎨</span>
        <span class="instruction-text">What color is the <strong>${round.name}</strong>?</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="feature-item-card">
        <div class="feature-item-icon">${round.item}</div>
        <div class="feature-item-title">${round.name}</div>
      </div>

      <div id="revealed-color-box" class="revealed-container"></div>

      <div class="color-options-grid" id="options-grid">
        ${round.options.map(colorName => `
          <button class="color-swatch-btn color-btn-${colorName.toLowerCase()}" data-val="${colorName}">
            <span class="color-swatch-dot">${COLOR_DOTS[colorName] || '🎨'}</span>
            <span class="color-swatch-label">${colorName}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const optionBtns = wrapper.querySelectorAll('.color-swatch-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.checkAnswer(btn.getAttribute('data-val'), round.answer, btn, null, (advanceCallback) => {
          const box = wrapper.querySelector('#revealed-color-box');
          if (box) {
            box.innerHTML = `
              <div class="revealed-phonic-banner">
                <span>🎨</span>
                <span>The <strong>${round.name}</strong> is <strong>${round.answer}</strong>!</span>
              </div>
            `;
          }
          window.Voice.speak(`Awesome! ${round.name} is ${round.answer}!`, true);
          advanceCallback();
        });
      });
    });
  }

  /* ====================================================================
     TYPE 8: IDENTIFY SHAPE OF OBJECT (Wheel -> Circle ⭕)
     ==================================================================== */
  renderShapeRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper shape-activity';

    const speechText = `What shape is the ${round.name}? Choose the right shape!`;
    window.Voice.speak(speechText);

    const SHAPE_ICONS = {
      'Circle': '⭕', 'Square': '⏹️', 'Triangle': '🔺',
      'Rectangle': '▭', 'Star': '⭐', 'Diamond': '🔷'
    };

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🔷</span>
        <span class="instruction-text">What shape is the <strong>${round.name}</strong>?</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="feature-item-card">
        <div class="feature-item-icon">${round.item}</div>
        <div class="feature-item-title">${round.name}</div>
      </div>

      <div id="revealed-shape-box" class="revealed-container"></div>

      <div class="shape-options-grid" id="options-grid">
        ${round.options.map(shapeName => `
          <button class="shape-card-btn" data-val="${shapeName}">
            <span class="shape-card-icon">${SHAPE_ICONS[shapeName] || '🔷'}</span>
            <span class="shape-card-label">${shapeName}</span>
          </button>
        `).join('')}
      </div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const optionBtns = wrapper.querySelectorAll('.shape-card-btn');
    optionBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.checkAnswer(btn.getAttribute('data-val'), round.answer, btn, null, (advanceCallback) => {
          const box = wrapper.querySelector('#revealed-shape-box');
          if (box) {
            box.innerHTML = `
              <div class="revealed-phonic-banner">
                <span>🔷</span>
                <span>The <strong>${round.name}</strong> is a <strong>${round.answer}</strong>!</span>
              </div>
            `;
          }
          window.Voice.speak(`Super! ${round.name} is a ${round.answer}!`, true);
          advanceCallback();
        });
      });
    });
  }

  /* ====================================================================
     TYPE 9: OPPOSITES & COMPARISONS (Big vs Small, Tall vs Short)
     ==================================================================== */
  renderOppositesRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper opposites-activity';

    const speechText = `${round.question} Tap the right card!`;
    window.Voice.speak(speechText);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">⚖️</span>
        <span class="instruction-text"><strong>${round.question}</strong></span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="opposites-container" id="options-grid">
        <button class="opposite-card" data-val="${round.cardA.value}">
          <div class="opposite-icon">${round.cardA.emoji}</div>
          <div class="opposite-label">${round.cardA.label}</div>
        </button>

        <div class="opposites-vs-badge">VS</div>

        <button class="opposite-card" data-val="${round.cardB.value}">
          <div class="opposite-icon">${round.cardB.emoji}</div>
          <div class="opposite-label">${round.cardB.label}</div>
        </button>
      </div>

      <div id="revealed-opposite-box" class="revealed-container"></div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const optionCards = wrapper.querySelectorAll('.opposite-card');
    optionCards.forEach(card => {
      card.addEventListener('click', () => {
        this.game.checkAnswer(card.getAttribute('data-val'), round.target, card, null, (advanceCallback) => {
          const winnerLabel = card.querySelector('.opposite-label').textContent;
          const box = wrapper.querySelector('#revealed-opposite-box');
          if (box) {
            box.innerHTML = `
              <div class="revealed-phonic-banner">
                <span>🌟</span>
                <span><strong>${winnerLabel}</strong> is ${round.target}!</span>
              </div>
            `;
          }
          window.Voice.speak(`Spot on! ${winnerLabel} is ${round.target}!`, true);
          advanceCallback();
        });
      });
    });
  }

  /* ====================================================================
     TYPE 10: ODD ONE OUT / VISUAL DISCRIMINATION (1 2 1 1 1 -> 2)
     ==================================================================== */
  renderOddOneOutRound(round, container) {
    const wrapper = document.createElement('div');
    wrapper.className = 'activity-wrapper odd-activity';

    const speechText = `${round.question} Find the one that does not match!`;
    window.Voice.speak(speechText);

    wrapper.innerHTML = `
      <div class="activity-instruction">
        <span class="mascot-emoji">🔍</span>
        <span class="instruction-text">${round.question}</span>
        <button class="btn-sound-hint" title="Listen again"><i class="fa-solid fa-volume-high"></i> Listen</button>
      </div>

      <div class="odd-row-container" id="options-grid">
        ${round.items.map((item, idx) => `
          <button class="odd-item-btn" data-val="${item}" data-idx="${idx}">
            <span class="odd-item-label">${item}</span>
          </button>
        `).join('')}
      </div>

      <div id="revealed-odd-box" class="revealed-container"></div>
    `;

    container.appendChild(wrapper);

    wrapper.querySelector('.btn-sound-hint').addEventListener('click', () => {
      window.Voice.speak(speechText, true);
    });

    const oddBtns = wrapper.querySelectorAll('.odd-item-btn');
    oddBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        this.game.checkAnswer(btn.getAttribute('data-val'), round.answer, btn, null, (advanceCallback) => {
          const box = wrapper.querySelector('#revealed-odd-box');
          if (box) {
            box.innerHTML = `
              <div class="revealed-phonic-banner">
                <span>🎉</span>
                <span><strong>${round.answer}</strong> was the odd one! Brilliant!</span>
              </div>
            `;
          }
          window.Voice.speak(`You found it! ${round.answer} was the different one!`, true);
          advanceCallback();
        });
      });
    });
  }
}

// Attach to window
window.ActivityManager = ActivityManager;
