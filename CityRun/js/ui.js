/* User Interface Manager - Character Selection, Controls, High Scores, HUD */
class UIManager {
    constructor(gameInstance) {
        this.game = gameInstance;
        this.highScore = parseInt(localStorage.getItem('cityrun_highscore') || '0', 10);

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
    }

    initDOM() {
        this.mainMenu = document.getElementById('main-menu');
        this.charSelectScreen = document.getElementById('char-select-screen');
        this.hud = document.getElementById('hud');
        this.pauseScreen = document.getElementById('pause-screen');
        this.gameOverScreen = document.getElementById('game-over-screen');
        this.monumentBanner = document.getElementById('monument-banner');
        this.monumentText = document.getElementById('monument-text');

        this.hudScore = document.getElementById('hud-score');
        this.hudDistance = document.getElementById('hud-distance');
        this.hudCoins = document.getElementById('hud-coins');
        this.powerupBar = document.getElementById('powerup-bar');
        this.menuHighScore = document.getElementById('menu-high-score');

        this.touchControls = document.getElementById('touch-controls');
        this.menuTouchBtn = document.getElementById('menu-touch-toggle-btn');
        this.pauseTouchBtn = document.getElementById('pause-touch-toggle-btn');
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
        this.gameOverScreen.classList.add('hidden');

        if (screenName === 'MENU') this.mainMenu.classList.remove('hidden');
        if (screenName === 'HUD') this.hud.classList.remove('hidden');
        if (screenName === 'PAUSE') { this.hud.classList.remove('hidden'); this.pauseScreen.classList.remove('hidden'); }
        if (screenName === 'GAME_OVER') this.gameOverScreen.classList.remove('hidden');
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
