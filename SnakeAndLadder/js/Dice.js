/**
 * Dice.js
 * A six-sided die with a simple roll API.
 */
window.SL = window.SL || {};

window.SL.Dice = class Dice {
  constructor(faces = 6) {
    this.faces = faces;
    this.value = 1;
  }

  /** Returns a random integer in [1, faces]. */
  roll() {
    this.value = 1 + Math.floor(Math.random() * this.faces);
    return this.value;
  }
};
