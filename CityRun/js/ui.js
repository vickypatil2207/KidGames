/* User Interface Manager - Character Selection, Controls, High Scores, HUD */
class UIManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.highScore = parseInt(localStorage.getItem('cityrun_highscore') || '0', 10);

        // Persistent Wallet Storage
        this.totalCoins = parseInt(localStorage.getItem('cityrun_total_coins') || '0', 10);
        this.totalSnacks = parseInt(localStorage.getItem('cityrun_total_snacks') || '0', 10);

        this.characters = [
            { id: 'mickey', name: 'Mickey Mouse', emoji: '🐭', desc: 'Fast & Nimble! Magnet Bonus Ability.', ability: 'Coin Magnet' },
            { id: 'panda', name: 'Cute Panda', emoji: '🐼', desc: 'Chubby Power! Extra Shield Protection.', ability: 'Extra Shield' },
            { id: 'pikachu', name: 'Pikachu', emoji: '⚡', desc: 'Electric Blast! Speed & Coin Boost.', ability: 'Electric Blast' },
            { id: 'doraemon', name: 'Doraemon', emoji: '🐱', desc: 'Gadget Master! Jetpack Flight Power.', ability: 'Gadget Jetpack' },
            { id: 'masha', name: 'Masha', emoji: '👧', desc: 'Mischief Queen! 2X Score Multiplier.', ability: '2X Score' },
            { id: 'singham', name: 'Little Singham', emoji: '🦁', desc: 'Super Lion Jump! High Jump Power.', ability: 'Lion Jump' },
            { id: 'bheem', name: 'Chhota Bheem', emoji: '👦', desc: 'Laddu Power! Double Snack Bonus.', ability: 'Laddu Boost' }
        ];

        this.selectedCharId = 'mickey';
        this.showTouchControls = localStorage.getItem('cityrun_touch_controls') === 'on';

        this.initDOM();
        this.initEventListeners();
        this.populateCharacterGrid();
        this.updateHighScoreDisplay();
        this.updateTouchControlsDisplay();
        this.updateWalletDisplay();
    }

    initDOM() {
        this.mainMenu = document.getElementById('main-menu');
        this.charSelectScreen = document.getElementById('char-select-screen');
        this.hud = document.getElementById('hud');
        this.pauseScreen = document.getElementById('pause-screen');
        this.reviveScreen = document.getElementById('revive-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.monumentBanner = document.getElementById('monument-banner');
        this.monumentText = document.getElementById('monument-text');

        this.hudScore = document.getElementById('hud-score');
        this.hudDistance = document.getElementById('hud-distance');
        this.hudCoins = document.getElementById('hud-coins');
        this.powerupBar = document.getElementById('powerup-bar');
        this.menuHighScore = document.getElementById('menu-high-score');
        this.menuTotalCoins = document.getElementById('menu-total-coins');
        this.menuTotalSnacks = document.getElementById('menu-total-snacks');

        this.reviveCountdownNum = document.getElementById('revive-countdown-num');
        this.reviveSnackBtn = document.getElementById('revive-snack-btn');
        this.reviveCoinBtn = document.getElementById('revive-coin-btn');
        this.reviveCancelBtn = document.getElementById('revive-cancel-btn');

        this.reviveSnackCost = document.getElementById('revive-snack-cost');
        this.reviveSnackAttempts = document.getElementById('revive-snack-attempts');
        this.reviveSnacksAvail = document.getElementById('revive-snacks-avail');
        this.reviveCoinCost = document.getElementById('revive-coin-cost');
        this.reviveCoinAttempts = document.getElementById('revive-coin-attempts');
        this.reviveCoinsAvail = document.getElementById('revive-coins-avail');

        this.touchControls = document.getElementById('touch-controls');
        this.menuTouchBtn = document.getElementById('menu-touch-toggle-btn');
        this.pauseTouchBtn = document.getElementById('pause-touch-toggle-btn');

        this.reviveTimer = null;
    }

    initEventListeners() {
        // Main Menu Buttons
        document.getElementById('start-game-btn').addEventListener('click', () => this.game.startGame());
        document.getElementById('open-char-select-btn').addEventListener('click', () => this.showCharSelect(true));
        document.getElementById('close-char-select-btn').addEventListener('click', () => this.showCharSelect(false));
        if (this.menuTouchBtn) {
            this.menuTouchBtn.addEventListener('click', () => this.toggleTouchControls());
        }

        // Pause Menu Buttons
        document.getElementById('pause-btn').addEventListener('click', () => this.game.pauseGame());
        document.getElementById('resume-btn').addEventListener('click', () => this.game.resumeGame());
        document.getElementById('restart-btn').addEventListener('click', () => this.game.restartGame());
        document.getElementById('quit-btn').addEventListener('click', () => this.game.quitToMenu());
        if (this.pauseTouchBtn) {
            this.pauseTouchBtn.addEventListener('click', () => this.toggleTouchControls());
        }
        document.getElementById('sound-toggle-btn').addEventListener('click', (e) => {
            const isMuted = window.audioManager.toggleMute();
            e.currentTarget.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i> SOUND: OFF' : '<i class="fa-solid fa-volume-high"></i> SOUND: ON';
        });

        // Revive Action Buttons
        if (this.reviveSnackBtn) {
            this.reviveSnackBtn.addEventListener('click', () => {
                this.stopReviveCountdown();
                this.game.confirmReviveSnacks();
            });
        }
        if (this.reviveCoinBtn) {
            this.reviveCoinBtn.addEventListener('click', () => {
                this.stopReviveCountdown();
                this.game.confirmReviveCoins();
            });
        }
        if (this.reviveCancelBtn) {
            this.reviveCancelBtn.addEventListener('click', () => {
                this.stopReviveCountdown();
                this.game.cancelRevive();
            });
        }

        // Game Over Buttons
        document.getElementById('play-again-btn').addEventListener('click', () => this.game.restartGame());
        document.getElementById('menu-return-btn').addEventListener('click', () => this.game.quitToMenu());

        // Keyboard Navigation (WASD / Arrows)
        window.addEventListener('keydown', (e) => {
            if (this.game.state !== 'PLAYING') return;

            switch (e.key) {
                case 'ArrowLeft':
                case 'a':
                case 'A':
                    this.game.player.moveLeft();
                    break;
                case 'ArrowRight':
                case 'd':
                case 'D':
                    this.game.player.moveRight();
                    break;
                case 'ArrowUp':
                case 'w':
                case 'W':
                case ' ':
                    this.game.player.jump();
                    break;
                case 'ArrowDown':
                case 's':
                case 'S':
                    this.game.player.slide();
                    break;
                case 'p':
                case 'P':
                case 'Escape':
                    this.game.pauseGame();
                    break;
            }
        });

        // Mobile Touch Control Buttons
        document.getElementById('touch-left').addEventListener('touchstart', (e) => { e.preventDefault(); this.game.player.moveLeft(); });
        document.getElementById('touch-right').addEventListener('touchstart', (e) => { e.preventDefault(); this.game.player.moveRight(); });
        document.getElementById('touch-up').addEventListener('touchstart', (e) => { e.preventDefault(); this.game.player.jump(); });
        document.getElementById('touch-down').addEventListener('touchstart', (e) => { e.preventDefault(); this.game.player.slide(); });

        // Touch Swipe Gesture Listener on Window
        let touchStartX = 0, touchStartY = 0;
        window.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
            touchStartY = e.changedTouches[0].screenY;
        }, { passive: true });

        window.addEventListener('touchend', (e) => {
            if (this.game.state !== 'PLAYING') return;
            const touchEndX = e.changedTouches[0].screenX;
            const touchEndY = e.changedTouches[0].screenY;

            const dx = touchEndX - touchStartX;
            const dy = touchEndY - touchStartY;

            if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > 30) {
                if (dx > 0) this.game.player.moveRight();
                else this.game.player.moveLeft();
            } else if (Math.abs(dy) > Math.abs(dx) && Math.abs(dy) > 30) {
                if (dy < 0) this.game.player.jump();
                else this.game.player.slide();
            }
        }, { passive: true });
    }

    addCoins(amount = 1) {
        this.totalCoins += amount;
        localStorage.setItem('cityrun_total_coins', this.totalCoins);
        this.updateWalletDisplay();
    }

    addSnacks(amount = 1) {
        this.totalSnacks += amount;
        localStorage.setItem('cityrun_total_snacks', this.totalSnacks);
        this.updateWalletDisplay();
    }

    deductCoins(amount) {
        this.totalCoins = Math.max(0, this.totalCoins - amount);
        localStorage.setItem('cityrun_total_coins', this.totalCoins);
        this.updateWalletDisplay();
    }

    deductSnacks(amount) {
        this.totalSnacks = Math.max(0, this.totalSnacks - amount);
        localStorage.setItem('cityrun_total_snacks', this.totalSnacks);
        this.updateWalletDisplay();
    }

    updateWalletDisplay() {
        if (this.menuTotalCoins) this.menuTotalCoins.innerText = this.totalCoins;
        if (this.menuTotalSnacks) this.menuTotalSnacks.innerText = this.totalSnacks;
    }

    populateCharacterGrid() {
        const grid = document.getElementById('character-grid');
        grid.innerHTML = '';

        this.characters.forEach(char => {
            const card = document.createElement('div');
            card.className = `char-card ${char.id === this.selectedCharId ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="char-card-emoji">${char.emoji}</div>
                <div class="char-card-name">${char.name}</div>
                <div class="char-card-ability"><i class="fa-solid fa-bolt"></i> ${char.ability}</div>
                <button class="select-char-btn">${char.id === this.selectedCharId ? 'SELECTED' : 'SELECT'}</button>
            `;

            card.addEventListener('click', () => this.selectCharacter(char.id));
            grid.appendChild(card);
        });
    }

    selectCharacter(charId) {
        this.selectedCharId = charId;
        const charObj = this.characters.find(c => c.id === charId);

        if (charObj) {
            document.getElementById('char-avatar-emoji').innerText = charObj.emoji;
            document.getElementById('selected-char-name').innerText = charObj.name;
            document.getElementById('selected-char-desc').innerText = charObj.desc;
        }

        this.populateCharacterGrid();
        this.game.player.buildCharacterMesh(charId);
        this.showCharSelect(false);
    }

    showCharSelect(show) {
        if (show) this.charSelectScreen.classList.remove('hidden');
        else this.charSelectScreen.classList.add('hidden');
    }

    showScreen(screenName) {
        this.mainMenu.classList.add('hidden');
        this.hud.classList.add('hidden');
        this.pauseScreen.classList.add('hidden');
        if (this.reviveScreen) this.reviveScreen.classList.add('hidden');
        this.gameOverScreen.classList.add('hidden');

        if (screenName === 'MENU') {
            this.mainMenu.classList.remove('hidden');
            this.updateWalletDisplay();
        }
        if (screenName === 'HUD') this.hud.classList.remove('hidden');
        if (screenName === 'PAUSE') { this.hud.classList.remove('hidden'); this.pauseScreen.classList.remove('hidden'); }
        if (screenName === 'REVIVE') { if (this.reviveScreen) this.reviveScreen.classList.remove('hidden'); }
        if (screenName === 'GAME_OVER') this.gameOverScreen.classList.remove('hidden');
    }

    startReviveCountdown(snackAttemptIdx, coinAttemptIdx, onTimeout) {
        this.stopReviveCountdown();
        let remaining = 5;

        const snackCosts = [20, 50, 100, 200, 500];
        const coinCosts = [100, 200, 500];

        const snackCost = snackAttemptIdx < 5 ? snackCosts[snackAttemptIdx] : 500;
        const coinCost = coinAttemptIdx < 3 ? coinCosts[coinAttemptIdx] : 500;

        if (this.reviveSnackCost) this.reviveSnackCost.innerText = snackCost;
        if (this.reviveSnackAttempts) this.reviveSnackAttempts.innerText = `${snackAttemptIdx + 1}/5`;
        if (this.reviveSnacksAvail) this.reviveSnacksAvail.innerText = this.totalSnacks;

        if (this.reviveCoinCost) this.reviveCoinCost.innerText = coinCost;
        if (this.reviveCoinAttempts) this.reviveCoinAttempts.innerText = `${coinAttemptIdx + 1}/3`;
        if (this.reviveCoinsAvail) this.reviveCoinsAvail.innerText = this.totalCoins;

        if (this.reviveCountdownNum) this.reviveCountdownNum.innerText = remaining;

        // Configure Snack Revive Button
        if (this.reviveSnackBtn) {
            if (snackAttemptIdx < 5 && this.totalSnacks >= snackCost) {
                this.reviveSnackBtn.disabled = false;
                this.reviveSnackBtn.style.opacity = '1';
                this.reviveSnackBtn.style.pointerEvents = 'auto';
            } else {
                this.reviveSnackBtn.disabled = true;
                this.reviveSnackBtn.style.opacity = '0.4';
                this.reviveSnackBtn.style.pointerEvents = 'none';
            }
        }

        // Configure Coin Revive Button
        if (this.reviveCoinBtn) {
            if (coinAttemptIdx < 3 && this.totalCoins >= coinCost) {
                this.reviveCoinBtn.disabled = false;
                this.reviveCoinBtn.style.opacity = '1';
                this.reviveCoinBtn.style.pointerEvents = 'auto';
            } else {
                this.reviveCoinBtn.disabled = true;
                this.reviveCoinBtn.style.opacity = '0.4';
                this.reviveCoinBtn.style.pointerEvents = 'none';
            }
        }

        this.showScreen('REVIVE');

        this.reviveTimer = setInterval(() => {
            remaining--;
            if (this.reviveCountdownNum) this.reviveCountdownNum.innerText = remaining;

            if (remaining <= 0) {
                this.stopReviveCountdown();
                if (typeof onTimeout === 'function') onTimeout();
            }
        }, 1000);
    }

    stopReviveCountdown() {
        if (this.reviveTimer) {
            clearInterval(this.reviveTimer);
            this.reviveTimer = null;
        }
    }

    updateHUD(score, distance, coins) {
        this.hudScore.innerText = Math.floor(score);
        this.hudDistance.innerText = `${Math.floor(distance)}m`;
        this.hudCoins.innerText = coins;
    }

    showMonumentNotification(name, city) {
        this.monumentText.innerText = `Entering ${name}, ${city}!`;
        this.monumentBanner.classList.remove('hidden');

        window.audioManager.playMilestone();

        setTimeout(() => {
            this.monumentBanner.classList.add('hidden');
        }, 3500);
    }

    showGameOver(score, distance, coins, snacks) {
        document.getElementById('final-score').innerText = Math.floor(score);
        document.getElementById('final-distance').innerText = `${Math.floor(distance)}m`;
        document.getElementById('final-coins').innerText = coins;
        document.getElementById('final-snacks').innerText = snacks;

        // Check High Score
        if (score > this.highScore) {
            this.highScore = Math.floor(score);
            localStorage.setItem('cityrun_highscore', this.highScore);
            this.updateHighScoreDisplay();
            document.getElementById('badge-title').innerText = "🏆 NEW HIGH SCORE RECORD!";
            document.getElementById('badge-desc').innerText = `Amazing! You scored ${this.highScore} points across Gujarat!`;
        } else if (distance > 1000) {
            document.getElementById('badge-title').innerText = "🏰 Gandhinagar Master Explorer";
            document.getElementById('badge-desc').innerText = "You ran over 1km past Akshardham & GIFT City!";
        } else {
            document.getElementById('badge-title').innerText = "🌉 Amdavadi City Runner";
            document.getElementById('badge-desc').innerText = "Great job exploring Atal Bridge & Sidi Saiyyed Jali!";
        }

        this.showScreen('GAME_OVER');
    }

    updateHighScoreDisplay() {
        this.menuHighScore.innerText = this.highScore;
    }

    toggleTouchControls() {
        this.showTouchControls = !this.showTouchControls;
        localStorage.setItem('cityrun_touch_controls', this.showTouchControls ? 'on' : 'off');
        this.updateTouchControlsDisplay();
    }

    updateTouchControlsDisplay() {
        const btnText = this.showTouchControls
            ? '<i class="fa-solid fa-gamepad"></i> TOUCH BUTTONS: ON'
            : '<i class="fa-solid fa-gamepad"></i> TOUCH BUTTONS: OFF';

        if (this.menuTouchBtn) this.menuTouchBtn.innerHTML = btnText;
        if (this.pauseTouchBtn) this.pauseTouchBtn.innerHTML = btnText;

        if (this.touchControls) {
            if (this.showTouchControls) {
                this.touchControls.classList.remove('hidden');
            } else {
                this.touchControls.classList.add('hidden');
            }
        }
    }
}
