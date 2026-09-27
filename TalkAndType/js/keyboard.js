/**
 * Talk & Type - Visual & Physical Keyboard Controller
 * Handles physical keystrokes, on-screen rainbow keyboard rendering,
 * tactile animations, and glowing error-guidance hints.
 */

class KeyboardController {
  constructor(containerElement) {
    this.container = containerElement;
    this.expectedKey = null;
    this.onKeyInput = null;
    this.isEnabled = false;
    this.layout = 'QWERTY'; // QWERTY layout is standard for keyboard learning

    this.rows = [
      ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
      ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L'],
      ['Z', 'X', 'C', 'V', 'B', 'N', 'M']
    ];

    // Cheerful pastel color palettes per row / zone for kid spatial memory
    this.rowColors = [
      '#3B82F6', // Top row (sky blue)
      '#10B981', // Middle home row (friendly emerald)
      '#F59E0B'  // Bottom row (amber sunshine)
    ];

    this.keyElements = new Map();
    this.initDOM();
    this.bindEvents();
  }

  initDOM() {
    if (!this.container) return;
    this.container.innerHTML = '';

    const kbWrapper = document.createElement('div');
    kbWrapper.className = 'virtual-keyboard';
    kbWrapper.setAttribute('role', 'region');
    kbWrapper.setAttribute('aria-label', 'Interactive Visual Keyboard');

    this.rows.forEach((row, rowIndex) => {
      const rowDiv = document.createElement('div');
      rowDiv.className = `kb-row kb-row-${rowIndex + 1}`;

      row.forEach(letter => {
        const keyBtn = document.createElement('button');
        keyBtn.type = 'button';
        keyBtn.className = 'kb-key';
        keyBtn.dataset.key = letter;
        keyBtn.setAttribute('aria-label', `Letter ${letter}`);

        const keyInner = document.createElement('span');
        keyInner.className = 'key-label';
        keyInner.textContent = letter;

        const hintPointer = document.createElement('div');
        hintPointer.className = 'key-hint-pointer hidden';
        hintPointer.innerHTML = '👆';

        keyBtn.appendChild(keyInner);
        keyBtn.appendChild(hintPointer);

        // Click / Touch support for tablets & touchscreen devices
        keyBtn.addEventListener('pointerdown', (e) => {
          e.preventDefault();
          this.handleKeyStroke(letter, keyBtn);
        });

        this.keyElements.set(letter, keyBtn);
        rowDiv.appendChild(keyBtn);
      });

      kbWrapper.appendChild(rowDiv);
    });

    this.container.appendChild(kbWrapper);
  }

  bindEvents() {
    window.addEventListener('keydown', (e) => {
      if (!this.isEnabled) return;

      // Don't intercept if kid is typing inside an actual input field (like the Name Setup box)
      const activeTag = document.activeElement ? document.activeElement.tagName.toLowerCase() : '';
      if (activeTag === 'input' || activeTag === 'textarea') return;

      const key = e.key.toUpperCase();
      if (/^[A-Z]$/.test(key)) {
        e.preventDefault();
        const keyEl = this.keyElements.get(key);
        this.handleKeyStroke(key, keyEl);
      }
    });
  }

  handleKeyStroke(letter, keyEl) {
    if (!this.isEnabled) return;

    // Visual press animation
    if (keyEl) {
      keyEl.classList.add('key-pressed');
      setTimeout(() => keyEl.classList.remove('key-pressed'), 180);
    }

    if (this.onKeyInput) {
      this.onKeyInput(letter);
    }
  }

  setExpectedKey(letter) {
    this.expectedKey = (letter || '').toUpperCase();
    this.clearHints();
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;
    if (this.container) {
      if (enabled) {
        this.container.classList.remove('kb-disabled');
      } else {
        this.container.classList.add('kb-disabled');
      }
    }
  }

  highlightMistake(wrongLetter) {
    const keyEl = this.keyElements.get(wrongLetter);
    if (keyEl) {
      keyEl.classList.add('key-wrong');
      setTimeout(() => keyEl.classList.remove('key-wrong'), 400);
    }
  }

  showHint(letter) {
    this.clearHints();
    const targetKey = (letter || this.expectedKey || '').toUpperCase();
    const keyEl = this.keyElements.get(targetKey);
    if (!keyEl) return;

    keyEl.classList.add('key-target-hint');
    const pointer = keyEl.querySelector('.key-hint-pointer');
    if (pointer) {
      pointer.classList.remove('hidden');
    }

    // Gentle scroll into view if on mobile/small screen
    try {
      keyEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    } catch (e) {}
  }

  clearHints() {
    this.keyElements.forEach(keyEl => {
      keyEl.classList.remove('key-target-hint');
      const pointer = keyEl.querySelector('.key-hint-pointer');
      if (pointer) {
        pointer.classList.add('hidden');
      }
    });
  }
}

window.KeyboardController = KeyboardController;
