/**
 * ui.js
 * -----
 * View layer. Owns all DOM references and translates Game events
 * into visual updates. Also drives the celebration effects
 * (confetti, winner modal).
 *
 * It does NOT make game rules — it calls Game.play() and renders
 * whatever Game returns.
 */

class UIController {
  /** Holds the setTimeout id for the AI's delayed move, or null when not thinking. */
  #aiTimer = null;

  /**
   * @param {Game} game
   */
  constructor(game) {
    this.game = game;

    // Cached DOM references
    this.cells = Array.from(document.querySelectorAll(".cell"));
    this.statusEl = document.getElementById("status");
    this.statusTextEl = document.getElementById("status-text");
    this.player1ScoreEl = document.getElementById("score1");
    this.player2ScoreEl = document.getElementById("score2");
    this.player1NameEl = document.getElementById("player1-name");
    this.player2NameEl = document.getElementById("player2-name");
    this.player1CardEl = document.getElementById("player1-card");
    this.player2CardEl = document.getElementById("player2-card");
    this.restartBtn = document.getElementById("restart");
    this.resetAllBtn = document.getElementById("reset-all");
    this.playAgainBtn = document.getElementById("play-again");
    this.modal = document.getElementById("winner-modal");
    this.modalEmoji = document.getElementById("modal-emoji");
    this.winnerText = document.getElementById("winner-text");
    this.winnerSub = document.getElementById("winner-sub");
    this.modeButtons = Array.from(document.querySelectorAll(".mode-btn"));

    this.#bindEvents();
    this.render();
  }

  // --------------------------------------------------------
  //  Event wiring
  // --------------------------------------------------------
  #bindEvents() {
    this.cells.forEach((cell) => {
      cell.addEventListener("click", () => {
        const index = Number(cell.dataset.index);
        this.#handleHumanMove(index);
      });
    });

    this.restartBtn.addEventListener("click", () => this.restartRound());
    this.resetAllBtn.addEventListener("click", () => this.resetScores());
    this.playAgainBtn.addEventListener("click", () => {
      this.hideModal();
      this.restartRound();
    });

    this.modeButtons.forEach((btn) => {
      btn.addEventListener("click", () => {
        const mode = btn.dataset.mode;
        this.#setMode(mode);
      });
    });
  }

  // --------------------------------------------------------
  //  Move handling
  // --------------------------------------------------------
  #handleHumanMove(index) {
    // Block clicks while the game has ended, the cell is taken,
    // or it's the AI's turn in vs-CPU mode.
    if (this.game.gameOver) return;
    if (!this.game.board.isEmpty(index)) return;
    if (this.#isAIThinking()) return;
    if (this.#isAITurn()) return; // ignore human clicks during AI turn

    this.#applyMove(index);

    if (this.game.gameOver) return;

    // If the opponent is an AI, schedule its move.
    if (this.#isAITurn()) {
      this.#scheduleAIMove();
    }
  }

  #applyMove(index) {
    const result = this.game.play(index);
    if (!result) return;
    this.render();

    if (result.status === "win") {
      this.#highlightWinLine(result.line);
      this.#showWinner(result);
    } else if (result.status === "tie") {
      this.#showWinner(result);
    }
  }

  // --------------------------------------------------------
  //  AI helpers
  // --------------------------------------------------------
  #isAIThinking() {
    return this.#aiTimer !== null;
  }

  #isAITurn() {
    return this.game.currentPlayer instanceof ComputerPlayer;
  }

  #scheduleAIMove() {
    if (this.#aiTimer !== null) return;
    const ai = this.game.currentPlayer;
    const opponent = this.game.opponent;
    const move = ai.chooseMove(this.game.board, ai.symbol, opponent.symbol);

    // Visual: cells look unclickable while AI is "thinking".
    this.cells.forEach((c) => c.classList.add("disabled"));

    // Small delay so kids can see the AI "think" — feels more alive.
    this.#aiTimer = setTimeout(() => {
      this.#aiTimer = null;
      this.cells.forEach((c) => c.classList.remove("disabled"));
      if (this.game.gameOver) return;
      this.#applyMove(move);
    }, 550);
  }

  // --------------------------------------------------------
  //  Rendering
  // --------------------------------------------------------
  render() {
    // Cells
    this.cells.forEach((cell, index) => {
      const value = this.game.board.getCell(index);
      cell.classList.remove("x", "o", "taken", "win");
      cell.textContent = "";

      if (value) {
        const player = this.#playerBySymbol(value);
        cell.textContent = player ? player.emoji : value;
        cell.classList.add(value.toLowerCase(), "taken");
      }
    });

    // Status line
    if (this.game.gameOver) {
      this.statusEl.classList.remove("x-turn", "o-turn");
    } else {
      const cp = this.game.currentPlayer;
      this.statusEl.classList.remove("x-turn", "o-turn");
      this.statusEl.classList.add(`${cp.cssClass}-turn`);
      this.statusTextEl.textContent = `${cp.name}'s turn`;
    }

    // Scoreboard highlights
    this.player1CardEl.classList.toggle(
      "active-turn",
      !this.game.gameOver && this.game.currentPlayerIndex === 0
    );
    this.player2CardEl.classList.toggle(
      "active-turn",
      !this.game.gameOver && this.game.currentPlayerIndex === 1
    );

    // Scores
    this.player1ScoreEl.textContent = this.game.players[0].score;
    this.player2ScoreEl.textContent = this.game.players[1].score;
  }

  // --------------------------------------------------------
  //  Win / tie feedback
  // --------------------------------------------------------
  #highlightWinLine(line) {
    line.forEach((i) => this.cells[i].classList.add("win"));
  }

  #showWinner(result) {
    if (result.status === "win") {
      const p = result.player;
      this.modalEmoji.textContent = p instanceof ComputerPlayer ? "🤖" : "🏆";
      this.winnerText.textContent = `🎉 ${p.name} Wins! 🎉`;
      this.winnerSub.textContent = p instanceof ComputerPlayer
        ? "Better luck next time!"
        : "Amazing job!";
    } else {
      this.modalEmoji.textContent = "🤝";
      this.winnerText.textContent = "It's a Tie!";
      this.winnerSub.textContent = "You both played great!";
    }
    this.modal.classList.add("show");
    this.modal.setAttribute("aria-hidden", "false");
    this.#launchConfetti();
  }

  hideModal() {
    this.modal.classList.remove("show");
    this.modal.setAttribute("aria-hidden", "true");
  }

  #launchConfetti() {
    const colors = ["#ff5c8a", "#4d8df6", "#ffe66d", "#4cd964", "#6c5ce7", "#ff8c42"];
    const count = 60;
    for (let i = 0; i < count; i++) {
      const piece = document.createElement("div");
      piece.className = "confetti";
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.background = colors[i % colors.length];
      piece.style.animationDelay = `${Math.random() * 0.6}s`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      document.body.appendChild(piece);
      setTimeout(() => piece.remove(), 3500);
    }
  }

  // --------------------------------------------------------
  //  Round / score controls
  // --------------------------------------------------------
  restartRound() {
    if (this.#aiTimer !== null) {
      clearTimeout(this.#aiTimer);
      this.#aiTimer = null;
    }
    this.game.resetRound();
    this.render();
    this.hideModal();
  }

  resetScores() {
    if (this.#aiTimer !== null) {
      clearTimeout(this.#aiTimer);
      this.#aiTimer = null;
    }
    this.game.resetAll();
    this.render();
    this.hideModal();
  }

  // --------------------------------------------------------
  //  Mode switching (2P <-> vs CPU)
  // --------------------------------------------------------
  #setMode(mode) {
    if (this.#aiTimer !== null) {
      clearTimeout(this.#aiTimer);
      this.#aiTimer = null;
    }
    this.modeButtons.forEach((b) => {
      const isActive = b.dataset.mode === mode;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-selected", String(isActive));
    });

    if (mode === "cpu") {
      const human = new Player("You", "X", "❌");
      const cpu = new ComputerPlayer("O", "⭕");
      this.game.setPlayer(0, human);
      this.game.setPlayer(1, cpu);
      this.player2NameEl.textContent = "Computer";
    } else {
      const p1 = new Player("Player 1", "X", "❌");
      const p2 = new Player("Player 2", "O", "⭕");
      this.game.setPlayer(0, p1);
      this.game.setPlayer(1, p2);
      this.player2NameEl.textContent = "Player 2";
    }

    this.game.resetAll();
    this.render();
    this.hideModal();
  }

  // --------------------------------------------------------
  //  Utilities
  // --------------------------------------------------------
  #playerBySymbol(sym) {
    return this.game.players.find((p) => p.symbol === sym) || null;
  }
}
