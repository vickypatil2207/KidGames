/**
 * UIManager.js
 * Manages DOM updates, renders the 15x15 board, mounts tokens, and triggers sound-effects/animations.
 */
class UIManager {
  constructor() {
    this.boardEl = document.getElementById('board');
    this.turnIndicatorEl = document.getElementById('turn-indicator');
    this.playersListEl = document.getElementById('players-list');
    this.logListEl = document.getElementById('log-list');
    this.diceMessageEl = document.getElementById('dice-message');
    this.startBtn = document.getElementById('start-btn');
    
    // Modals
    this.rulesModal = document.getElementById('rules-modal');
    this.setupModal = document.getElementById('setup-modal');
    this.winnerModal = document.getElementById('winner-modal');
    
    this.board = null;
    this.players = [];
    this.dice = null;
    
    this.boundTokenClicks = new Map(); // tracks current click handlers for active turn
  }

  /**
   * Bind the Dice instance
   */
  setDice(dice) {
    this.dice = dice;
  }

  /**
   * Set theme and layout for the dice
   */
  setDiceTheme(color) {
    if (this.dice) this.dice.setTheme(color);
  }

  setDiceEnabled(enabled) {
    if (this.dice) this.dice.setEnabled(enabled);
  }

  setDiceRollMessage(msg) {
    if (this.diceMessageEl) {
      this.diceMessageEl.textContent = msg;
    }
  }

  triggerDiceRoll() {
    if (this.dice) this.dice.roll(true);
  }

  /**
   * Construct the 15x15 board and render yards, center home, and path cells
   */
  initBoard(board, players) {
    this.board = board;
    this.players = players;
    
    if (!this.boardEl) return;
    this.boardEl.innerHTML = ''; // Clear previous board

    // Create the 15x15 grid cells. We will loop row by row (0 to 14) and col by col (0 to 14).
    for (let r = 0; r < 15; r++) {
      for (let c = 0; c < 15; c++) {
        
        // 1. Red Yard (Top Left: rows 0-5, cols 0-5)
        if (r === 0 && c === 0) {
          this.boardEl.appendChild(this._createYardHTML('red', players.find(p => p.color === 'red')));
          continue;
        } else if (r < 6 && c < 6) {
          // Skip these slots as they are covered by the Red Yard's grid-area spans
          continue;
        }

        // 2. Green Yard (Top Right: rows 0-5, cols 9-14)
        if (r === 0 && c === 9) {
          this.boardEl.appendChild(this._createYardHTML('green', players.find(p => p.color === 'green')));
          continue;
        } else if (r < 6 && c >= 9) {
          continue;
        }

        // 3. Blue Yard (Bottom Left: rows 9-14, cols 0-5)
        if (r === 9 && c === 0) {
          this.boardEl.appendChild(this._createYardHTML('blue', players.find(p => p.color === 'blue')));
          continue;
        } else if (r >= 9 && c < 6) {
          continue;
        }

        // 4. Yellow Yard (Bottom Right: rows 9-14, cols 9-14)
        if (r === 9 && c === 9) {
          this.boardEl.appendChild(this._createYardHTML('yellow', players.find(p => p.color === 'yellow')));
          continue;
        } else if (r >= 9 && c >= 9) {
          continue;
        }

        // 5. Home Center (Center area: rows 6-8, cols 6-8)
        if (r === 6 && c === 6) {
          this.boardEl.appendChild(this._createHomeCenterHTML(players));
          continue;
        } else if (r >= 6 && r <= 8 && c >= 6 && c <= 8) {
          continue;
        }

        // 6. Otherwise, it is a standard track or home stretch cell. Create standard cell
        this.boardEl.appendChild(this._createTrackCellHTML(r, c));
      }
    }

    // Mount player tokens into their pocket containers
    this.players.forEach(player => {
      player.tokens.forEach(token => {
        const tokenEl = document.createElement('div');
        tokenEl.className = `token color-${player.color}`;
        tokenEl.id = `token-${player.id}-${token.id}`;
        tokenEl.innerHTML = `<span class="token-emoji">${token.character}</span>`;
        tokenEl.setAttribute('data-player-id', player.id);
        tokenEl.setAttribute('data-token-id', token.id);
        
        // Find pocket cell and mount
        const coord = this.board.getCoordinate(player.color, token.position, token.id);
        const holderEl = document.getElementById(`cell-token-holder-${coord.r}-${coord.c}`);
        if (holderEl) {
          holderEl.appendChild(tokenEl);
        }
      });
    });

    // Update all cell counts
    this._recalculateAllCellStackCounts();
  }

  /**
   * Helper to create Yard Base HTML
   */
  _createYardHTML(color, player) {
    const yardEl = document.createElement('div');
    yardEl.className = `yard ${color}`;
    // Assign grid coordinates
    const rStart = color === 'red' || color === 'green' ? 1 : 10;
    const cStart = color === 'red' || color === 'blue' ? 1 : 10;
    yardEl.style.gridArea = `${rStart} / ${cStart} / span 6 / span 6`;

    const innerEl = document.createElement('div');
    innerEl.className = 'yard-inner';

    // Transparent avatar background
    if (player) {
      const bgChar = document.createElement('div');
      bgChar.className = 'yard-character-bg';
      bgChar.textContent = player.character;
      innerEl.appendChild(bgChar);
    }

    // Pocket layout for 4 tokens
    const pockets = this.board.pockets[color];
    pockets.forEach(pocket => {
      const pocketEl = document.createElement('div');
      pocketEl.className = 'pocket';
      
      // Token holder inside pocket
      const holderEl = document.createElement('div');
      holderEl.className = 'cell-token-holder';
      holderEl.id = `cell-token-holder-${pocket.r}-${pocket.c}`;
      holderEl.setAttribute('data-row', pocket.r);
      holderEl.setAttribute('data-col', pocket.c);
      
      pocketEl.appendChild(holderEl);
      innerEl.appendChild(pocketEl);
    });

    yardEl.appendChild(innerEl);
    return yardEl;
  }

  /**
   * Helper to create Home Center Area HTML (3x3 split triangles)
   */
  _createHomeCenterHTML(players) {
    const centerEl = document.createElement('div');
    centerEl.className = 'home-center';
    centerEl.style.gridArea = '7 / 7 / span 3 / span 3';

    const colors = ['red', 'green', 'yellow', 'blue'];
    colors.forEach(color => {
      const triEl = document.createElement('div');
      triEl.className = `home-tri ${color}-home`;
      
      // Find character of this color
      const p = players.find(player => player.color === color);
      const charSpan = document.createElement('span');
      charSpan.textContent = p ? p.character : '🏆';
      triEl.appendChild(charSpan);

      // Set cell ID matching home coordinate
      const homeCoord = this.board.homePaths[color][5]; // final home triangle coordinate
      
      const holderEl = document.createElement('div');
      holderEl.className = 'cell-token-holder';
      holderEl.id = `cell-token-holder-${homeCoord.r}-${homeCoord.c}`;
      holderEl.setAttribute('data-row', homeCoord.r);
      holderEl.setAttribute('data-col', homeCoord.c);
      
      triEl.appendChild(holderEl);
      centerEl.appendChild(triEl);
    });

    return centerEl;
  }

  /**
   * Helper to create standard track or home run cell
   */
  _createTrackCellHTML(r, c) {
    const cellEl = document.createElement('div');
    cellEl.className = 'cell';
    cellEl.style.gridRowStart = r + 1;
    cellEl.style.gridColumnStart = c + 1;
    cellEl.id = `cell-${r}-${c}`;

    // Color code and add special properties
    const cellType = this._detectCellType(r, c);
    if (cellType) {
      cellEl.classList.add(cellType);
    }

    // Token holder
    const holderEl = document.createElement('div');
    holderEl.className = 'cell-token-holder';
    holderEl.id = `cell-token-holder-${r}-${c}`;
    holderEl.setAttribute('data-row', r);
    holderEl.setAttribute('data-col', c);
    
    cellEl.appendChild(holderEl);
    return cellEl;
  }

  /**
   * Detect type of cell to color code it
   */
  _detectCellType(r, c) {
    // Check if it's one of the start cells
    if (r === 6 && c === 1) return 'start-red';
    if (r === 1 && c === 8) return 'start-green';
    if (r === 8 && c === 13) return 'start-yellow';
    if (r === 13 && c === 6) return 'start-blue';

    // Check if it's one of the safe star cells
    if (
      (r === 8 && c === 2) || // index 48
      (r === 2 && c === 6) || // index 9
      (r === 6 && c === 12) || // index 21
      (r === 12 && c === 8)   // index 34
    ) {
      return 'star-cell';
    }

    // Check home run paths (stretches)
    if (r === 7 && c >= 1 && c <= 5) return 'home-run-red';
    if (c === 7 && r >= 1 && r <= 5) return 'home-run-green';
    if (r === 7 && c >= 9 && c <= 13) return 'home-run-yellow';
    if (c === 7 && r >= 9 && r <= 13) return 'home-run-blue';

    // Color standard exit paths to guide players (optional nice visual touch)
    if (r === 6 && c >= 0 && c <= 5) return 'red-path';
    if (c === 8 && r >= 0 && r <= 5) return 'green-path';
    if (r === 8 && c >= 9 && c <= 14) return 'yellow-path';
    if (c === 6 && r >= 9 && r <= 14) return 'blue-path';

    return null;
  }

  /**
   * Update active turn card
   */
  updateActivePlayer(player) {
    if (!this.turnIndicatorEl) return;
    
    // Set theme class
    this.turnIndicatorEl.className = `turn-indicator active-${player.color}`;
    
    // Set text and emoji
    this.turnIndicatorEl.innerHTML = `
      <span class="turn-avatar">${player.character}</span>
      <span class="turn-name">${player.name}${player.isComputer ? ' (CPU)' : ''}</span>
    `;
  }

  /**
   * Update player standings in sidebar
   */
  updatePlayerList(players, currentPlayerIdx) {
    if (!this.playersListEl) return;
    this.playersListEl.innerHTML = '';

    players.forEach((p, idx) => {
      const isCurrent = idx === currentPlayerIdx;
      const finishedCount = p.getFinishedCount();
      const finishedTag = p.hasFinished() 
        ? `<span class="finished-badge">🏆 Done</span>` 
        : `<span class="type-badge">${finishedCount}/4 Home</span>`;
      
      const cpuTag = p.isComputer ? `<span class="type-badge">🤖 CPU</span>` : '';

      const li = document.createElement('li');
      li.className = `player-row ${isCurrent ? 'active border-' + p.color : ''}`;
      li.innerHTML = `
        <div class="player-row-left">
          <span class="player-dot dot-${p.color}"></span>
          <span>${p.character} ${p.name}</span>
        </div>
        <div class="player-status-chips">
          ${cpuTag}
          ${finishedTag}
        </div>
      `;
      this.playersListEl.appendChild(li);
    });
  }

  /**
   * Pulse valid moves for the human player and bind roll click events
   */
  highlightMovableTokens(player, validTokens, onClickCallback) {
    this.clearHighlights();

    validTokens.forEach(token => {
      const tokenEl = document.getElementById(`token-${player.id}-${token.id}`);
      if (tokenEl) {
        tokenEl.classList.add('movable');
        
        // Define click handler
        const handler = () => {
          onClickCallback(token);
        };
        tokenEl.addEventListener('click', handler);
        this.boundTokenClicks.set(tokenEl, handler);
      }
    });
  }

  /**
   * Clear all pulsing moves
   */
  clearHighlights() {
    this.boundTokenClicks.forEach((handler, el) => {
      if (el) {
        el.classList.remove('movable');
        el.removeEventListener('click', handler);
      }
    });
    this.boundTokenClicks.clear();
  }

  /**
   * Re-align and size stack count for a single cell coordinate
   */
  _recalculateCellStackCount(r, c) {
    const holder = document.getElementById(`cell-token-holder-${r}-${c}`);
    if (holder) {
      const count = holder.children.length;
      holder.setAttribute('data-count', count);
    }
  }

  /**
   * Recalculate stacking for all cell holders on the board
   */
  _recalculateAllCellStackCounts() {
    document.querySelectorAll('.cell-token-holder').forEach(holder => {
      const count = holder.children.length;
      holder.setAttribute('data-count', count);
    });
  }

  /**
   * Moves a token DOM node instantly to its new coordinate container
   */
  async animateTokenPosition(player, token) {
    const tokenEl = document.getElementById(`token-${player.id}-${token.id}`);
    if (!tokenEl) return;

    const oldHolder = tokenEl.parentElement;
    const coord = this.board.getCoordinate(player.color, token.position, token.id);
    const newHolder = document.getElementById(`cell-token-holder-${coord.r}-${coord.c}`);

    if (newHolder && oldHolder !== newHolder) {
      newHolder.appendChild(tokenEl);
      this._recalculateAllCellStackCounts();
    }
  }

  /**
   * Moves a token step-by-step with a cute jumping hop animation
   */
  async animateTokenStep(player, token) {
    const tokenEl = document.getElementById(`token-${player.id}-${token.id}`);
    if (!tokenEl) return;

    const oldHolder = tokenEl.parentElement;
    const coord = this.board.getCoordinate(player.color, token.position, token.id);
    const newHolder = document.getElementById(`cell-token-holder-${coord.r}-${coord.c}`);

    if (newHolder && oldHolder !== newHolder) {
      // Add hop class
      tokenEl.classList.add('hopping');
      
      // Relocate DOM element
      newHolder.appendChild(tokenEl);
      
      // Recalculate cell token sizes
      this._recalculateAllCellStackCounts();

      // Wait for hop animation duration (250ms)
      await new Promise(resolve => setTimeout(resolve, 250));
      tokenEl.classList.remove('hopping');
    }
  }

  /**
   * Captured token spin animation back to base
   */
  async animateTokenCapture(player, token) {
    const tokenEl = document.getElementById(`token-${player.id}-${token.id}`);
    if (!tokenEl) return;

    // Apply captured spin animation
    tokenEl.classList.add('captured');
    
    // Wait for spin animation (600ms)
    await new Promise(resolve => setTimeout(resolve, 600));
    
    tokenEl.classList.remove('captured');
    
    // Relocate to base yard pocket
    const coord = this.board.getCoordinate(player.color, token.position, token.id);
    const yardHolder = document.getElementById(`cell-token-holder-${coord.r}-${coord.c}`);
    if (yardHolder) {
      yardHolder.appendChild(tokenEl);
    }
    
    this._recalculateAllCellStackCounts();
  }

  /**
   * Print visual event messages to sidebar logs
   */
  logMessage(message) {
    if (!this.logListEl) return;
    
    const li = document.createElement('li');
    li.style.animation = 'slide-in 0.25s ease-out forwards';
    li.textContent = message;
    
    this.logListEl.appendChild(li);
    this.logListEl.scrollTop = this.logListEl.scrollHeight;

    // Keep log short
    while (this.logListEl.children.length > 25) {
      this.logListEl.removeChild(this.logListEl.firstChild);
    }
  }

  /**
   * Show winner modal and paint confetti
   */
  showWinnerScreen(winnerList, allPlayers) {
    if (!this.winnerModal) return;

    const titleEl = document.getElementById('winner-title');
    const textEl = document.getElementById('winner-text');
    const listEl = document.getElementById('leaderboard-list');

    const firstWinner = winnerList[0];
    if (titleEl) {
      titleEl.innerHTML = `🏆 Champion: ${firstWinner.character} ${firstWinner.name}! 🏆`;
    }
    if (textEl) {
      textEl.textContent = `Hooray! What an amazing race, champion!`;
    }

    if (listEl) {
      listEl.innerHTML = '';
      
      // Order: winners first, then others by how many tokens they got home
      const finalRanks = [...winnerList];
      
      allPlayers.forEach(p => {
        if (!finalRanks.includes(p)) {
          finalRanks.push(p);
        }
      });

      finalRanks.forEach((p, index) => {
        const item = document.createElement('li');
        item.className = 'leaderboard-item';
        
        let medal = '⭐';
        if (index === 0) medal = '🥇';
        else if (index === 1) medal = '🥈';
        else if (index === 2) medal = '🥉';

        item.innerHTML = `
          <span>${medal} Rank ${index + 1}: ${p.character} ${p.name}</span>
          <span>${p.getFinishedCount()}/4 Home</span>
        `;
        listEl.appendChild(item);
      });
    }

    this._spawnConfetti();
    this.winnerModal.classList.add('open');
  }

  /**
   * Spawn HTML confetti pieces on winner screen
   */
  _spawnConfetti() {
    const container = document.querySelector('.confetti');
    if (!container) return;
    container.innerHTML = '';

    const colors = ['#ff5d8f', '#7ed957', '#ffb938', '#4ec5ff', '#b07cff', '#ffffff'];

    for (let i = 0; i < 80; i++) {
      const piece = document.createElement('div');
      piece.className = 'confetti-piece';
      piece.style.left = `${Math.random() * 100}%`;
      piece.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      piece.style.animationDelay = `${Math.random() * 2.5}s`;
      piece.style.width = `${6 + Math.random() * 8}px`;
      piece.style.height = `${8 + Math.random() * 12}px`;
      piece.style.transform = `rotate(${Math.random() * 360}deg)`;
      container.appendChild(piece);
    }
  }

  closeWinnerScreen() {
    if (this.winnerModal) {
      this.winnerModal.classList.remove('open');
      const container = document.querySelector('.confetti');
      if (container) container.innerHTML = '';
    }
  }
}
