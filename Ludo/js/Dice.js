/**
 * Dice.js
 * Manages the Ludo dice states, DOM bindings, and roll animations.
 */
class Dice {
  constructor(elementId, triggerRollCallback) {
    this.el = document.getElementById(elementId);
    this.value = 1;
    this.isRolling = false;
    this.faces = {
      1: '⚀',
      2: '⚁',
      3: '⚂',
      4: '⚃',
      5: '⚄',
      6: '⚅'
    };
    this.callback = triggerRollCallback;

    if (this.el) {
      this.el.addEventListener('click', () => this.roll());
      this.el.addEventListener('keydown', (e) => {
        if (e.key === ' ' || e.key === 'Enter') {
          e.preventDefault();
          this.roll();
        }
      });
    }
  }

  /**
   * Set active player theme on the dice
   * @param {string} color - Player color
   */
  setTheme(color) {
    if (!this.el) return;
    this.el.className = `dice roll-${color}`;
  }

  /**
   * Enable/Disable user clicks on the dice
   * @param {boolean} enabled 
   */
  setEnabled(enabled) {
    if (this.el) {
      if (enabled) {
        this.el.classList.remove('disabled');
        this.el.setAttribute('tabindex', '0');
      } else {
        this.el.classList.add('disabled');
        this.el.setAttribute('tabindex', '-1');
      }
    }
    // Also disable the roll button so users cannot tap it during CPU turns
    const rollBtn = document.getElementById('roll-btn');
    if (rollBtn) {
      rollBtn.disabled = !enabled;
    }
  }

  /**
   * Trigger the dice roll animation and return the result
   * @param {boolean} ignoreDisabled - If true, bypasses the disabled check (for programmatic AI rolls)
   */
  async roll(ignoreDisabled = false) {
    if (this.isRolling || (!ignoreDisabled && this.el && this.el.classList.contains('disabled'))) {
      return this.value;
    }

    this.isRolling = true;
    this.setEnabled(false);

    // Start shake animation
    if (this.el) {
      this.el.style.animation = 'shake 0.8s ease-in-out';
    }

    // Shuffling face characters for visual effect
    const shuffleInterval = setInterval(() => {
      const tempVal = Math.floor(Math.random() * 6) + 1;
      if (this.el) {
        this.el.innerHTML = `<span class="dice-face" data-face="${tempVal}">${this.faces[tempVal]}</span>`;
      }
    }, 60);

    // Wait for animation to finish (800ms)
    await new Promise(resolve => setTimeout(resolve, 800));

    clearInterval(shuffleInterval);
    
    // Determine final roll result
    this.value = Math.floor(Math.random() * 6) + 1;
    
    if (this.el) {
      this.el.style.animation = '';
      this.el.innerHTML = `<span class="dice-face" data-face="${this.value}">${this.faces[this.value]}</span>`;
    }

    this.isRolling = false;
    
    // Call the game callback
    if (this.callback) {
      this.callback(this.value);
    }

    return this.value;
  }
}
