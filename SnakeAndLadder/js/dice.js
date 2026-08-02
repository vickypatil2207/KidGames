/**
 * dice.js
 * Controls 3D tumbling CSS dice animations and roll physics.
 */
window.SL = window.SL || {};

window.SL.Dice = class Dice {
  constructor(diceEl, rollBtnEl, onRollComplete) {
    this.diceEl = diceEl;
    this.rollBtnEl = rollBtnEl;
    this.onRollComplete = onRollComplete;
    this.isRolling = false;
    this.isDisabled = false;
    this.currentValue = 1;

    // Face rotation map for 3D CSS Cube
    this.faceRotations = {
      1: { x: 0,   y: 0 },
      2: { x: 0,   y: -90 },
      3: { x: 0,   y: -180 },
      4: { x: 0,   y: 90 },
      5: { x: -90, y: 0 },
      6: { x: 90,  y: 0 }
    };

    this.init();
  }

  init() {
    this._render3DCube();

    const triggerRoll = () => {
      if (!this.isDisabled && !this.isRolling) {
        this.roll();
      }
    };
    if (this.diceEl) this.diceEl.addEventListener('click', triggerRoll);
    if (this.rollBtnEl) this.rollBtnEl.addEventListener('click', triggerRoll);
  }

  _render3DCube() {
    if (!this.diceEl) return;
    this.diceEl.innerHTML = '';
    const cube = document.createElement('div');
    cube.className = 'dice-cube';

    const pips = {
      1: [4],
      2: [0, 8],
      3: [0, 4, 8],
      4: [0, 2, 6, 8],
      5: [0, 2, 4, 6, 8],
      6: [0, 2, 3, 5, 6, 8]
    };

    for (let face = 1; face <= 6; face++) {
      const faceEl = document.createElement('div');
      faceEl.className = `dice-face face-${face}`;

      const grid = document.createElement('div');
      grid.className = 'pip-grid';

      for (let p = 0; p < 9; p++) {
        const pip = document.createElement('div');
        pip.className = 'pip' + (pips[face].includes(p) ? ' active' : '');
        grid.appendChild(pip);
      }

      faceEl.appendChild(grid);
      cube.appendChild(faceEl);
    }

    this.diceEl.appendChild(cube);
    this.cubeEl = cube;
  }

  setDisabled(disabled) {
    this.isDisabled = disabled;
    if (this.rollBtnEl) this.rollBtnEl.disabled = disabled;
    if (this.diceEl) {
      if (disabled) this.diceEl.classList.add('disabled');
      else this.diceEl.classList.remove('disabled');
    }
  }

  roll() {
    if (this.isRolling) return;
    this.isRolling = true;
    if (this.rollBtnEl) this.rollBtnEl.disabled = true;

    if (window.SL.sound) window.SL.sound.playRoll();

    const result = Math.floor(Math.random() * 6) + 1;
    this.currentValue = result;

    const extraSpinsX = (Math.floor(Math.random() * 3) + 2) * 360;
    const extraSpinsY = (Math.floor(Math.random() * 3) + 2) * 360;

    const targetRot = this.faceRotations[result];
    const finalX = targetRot.x + extraSpinsX;
    const finalY = targetRot.y + extraSpinsY;

    if (this.cubeEl) {
      this.cubeEl.style.transform = `rotateX(${finalX}deg) rotateY(${finalY}deg)`;
    }

    setTimeout(() => {
      this.isRolling = false;
      if (!this.isDisabled && this.rollBtnEl) {
        this.rollBtnEl.disabled = false;
      }
      if (this.onRollComplete) {
        this.onRollComplete(result);
      }
    }, 650);
  }
};
