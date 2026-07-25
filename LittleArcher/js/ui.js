/* ==========================================================================
   UI Controller & LocalStorage Manager
   ========================================================================== */

class UIManager {
    constructor() {
        this.selectedCharId = 'singham';
        this.selectedBowId = 'wooden';
        this.playerName = 'Little Hero';

        this.savedData = {
            playerName: 'Little Hero',
            selectedChar: 'singham',
            selectedBow: 'wooden',
            highScore: 0,
            unlockedLevels: 1,
            levelStars: {}
        };

        this.loadSaveData();
        this.bindEvents();
        this.renderCharacterGrid();
        this.renderBowGrid();
        this.renderLevelGrid();
        this.updateMenuPreviews();
    }

    loadSaveData() {
        try {
            const raw = localStorage.getItem('little_archer_save');
            if (raw) {
                const parsed = JSON.parse(raw);
                this.savedData = { ...this.savedData, ...parsed };
                this.playerName = this.savedData.playerName || 'Little Hero';
                this.selectedCharId = this.savedData.selectedChar || 'singham';
                this.selectedBowId = this.savedData.selectedBow || 'wooden';
            }
        } catch (e) {
            console.warn("Could not load saved data", e);
        }

        const nameInput = document.getElementById('player-name-input');
        if (nameInput) nameInput.value = this.playerName;
    }

    saveData() {
        try {
            this.savedData.playerName = this.playerName;
            this.savedData.selectedChar = this.selectedCharId;
            this.savedData.selectedBow = this.selectedBowId;
            localStorage.setItem('little_archer_save', JSON.stringify(this.savedData));
        } catch (e) {
            console.warn("Could not save data", e);
        }
    }

    bindEvents() {
        // Player Name Input
        const nameInput = document.getElementById('player-name-input');
        if (nameInput) {
            nameInput.addEventListener('change', (e) => {
                this.playerName = e.target.value.trim() || 'Little Hero';
                this.saveData();
                this.updateMenuPreviews();
            });
        }

        // Screen Buttons Navigation
        document.getElementById('open-char-select-btn')?.addEventListener('click', () => this.showScreen('char-select-screen'));
        document.getElementById('close-char-select-btn')?.addEventListener('click', () => this.showScreen('main-menu'));
        
        document.getElementById('open-bow-select-btn')?.addEventListener('click', () => this.showScreen('bow-select-screen'));
        document.getElementById('close-bow-select-btn')?.addEventListener('click', () => this.showScreen('main-menu'));

        document.getElementById('open-level-select-btn')?.addEventListener('click', () => {
            this.renderLevelGrid();
            this.showScreen('level-select-screen');
        });
        document.getElementById('close-level-select-btn')?.addEventListener('click', () => this.showScreen('main-menu'));

        // Sound Toggle
        document.getElementById('sound-toggle-btn')?.addEventListener('click', () => {
            const isMuted = window.soundManager.toggleMute();
            const btn = document.getElementById('sound-toggle-btn');
            if (btn) {
                btn.innerHTML = isMuted ? '<i class="fa-solid fa-volume-xmark"></i> SOUND: OFF' : '<i class="fa-solid fa-volume-high"></i> SOUND: ON';
            }
        });
    }

    showScreen(screenId) {
        document.querySelectorAll('.ui-screen').forEach(screen => {
            if (screen.id === screenId) {
                screen.classList.remove('hidden');
                screen.classList.add('active');
            } else {
                screen.classList.add('hidden');
                screen.classList.remove('active');
            }
        });
    }

    updateMenuPreviews() {
        const char = CHARACTERS.find(c => c.id === this.selectedCharId) || CHARACTERS[0];
        const bow = BOWS.find(b => b.id === this.selectedBowId) || BOWS[0];

        // Hero Preview
        const avatarEl = document.getElementById('preview-char-avatar');
        if (avatarEl) {
            avatarEl.innerHTML = char.emoji;
            avatarEl.style.background = char.bg;
        }
        document.getElementById('preview-char-name').textContent = char.name;
        document.getElementById('preview-char-desc').textContent = char.perk;

        // Bow Preview
        const bowIconEl = document.getElementById('preview-bow-icon');
        if (bowIconEl) {
            bowIconEl.className = bow.iconClass;
            bowIconEl.style.color = bow.color;
        }
        document.getElementById('preview-bow-name').textContent = bow.name;
        document.getElementById('preview-bow-desc').textContent = bow.description;

        // High Score
        document.getElementById('menu-high-score').textContent = this.savedData.highScore || 0;
    }

    renderCharacterGrid() {
        const container = document.getElementById('character-grid');
        if (!container) return;
        container.innerHTML = '';

        CHARACTERS.forEach(char => {
            const card = document.createElement('div');
            card.className = `char-card ${char.id === this.selectedCharId ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="char-card-icon" style="background: ${char.bg}">${char.emoji}</div>
                <div class="char-card-name">${char.name}</div>
                <div class="char-card-perk">${char.perk}</div>
                <div class="char-card-quote">"${char.quote}"</div>
            `;
            card.addEventListener('click', () => {
                this.selectedCharId = char.id;
                this.saveData();
                this.renderCharacterGrid();
                this.updateMenuPreviews();
                if (window.gameInstance) window.gameInstance.updatePlayerConfig();
            });
            container.appendChild(card);
        });
    }

    renderBowGrid() {
        const container = document.getElementById('bow-grid');
        if (!container) return;
        container.innerHTML = '';

        BOWS.forEach(bow => {
            const card = document.createElement('div');
            card.className = `bow-card ${bow.id === this.selectedBowId ? 'selected' : ''}`;
            card.innerHTML = `
                <div class="bow-card-header">
                    <div class="bow-icon-box" style="background: ${bow.color}">
                        <i class="${bow.iconClass}"></i>
                    </div>
                    <div>
                        <div class="bow-card-title">${bow.name}</div>
                        <div style="font-size: 0.75rem; color: #CBD5E1;">${bow.description}</div>
                    </div>
                </div>
                <div class="stat-bars">
                    <div class="stat-row">
                        <span class="stat-label">Power</span>
                        <div class="stat-track"><div class="stat-fill" style="width: ${bow.stats.power}%; background: #FF5722;"></div></div>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Speed</span>
                        <div class="stat-track"><div class="stat-fill" style="width: ${bow.stats.speed}%; background: #00BCD4;"></div></div>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Stability</span>
                        <div class="stat-track"><div class="stat-fill" style="width: ${bow.stats.stability}%; background: #4CAF50;"></div></div>
                    </div>
                    <div class="stat-row">
                        <span class="stat-label">Aim Assist</span>
                        <div class="stat-track"><div class="stat-fill" style="width: ${bow.stats.aimAssist}%; background: #FFC107;"></div></div>
                    </div>
                </div>
            `;
            card.addEventListener('click', () => {
                this.selectedBowId = bow.id;
                this.saveData();
                this.renderBowGrid();
                this.updateMenuPreviews();
                if (window.gameInstance) window.gameInstance.updatePlayerConfig();
            });
            container.appendChild(card);
        });
    }

    renderLevelGrid() {
        const container = document.getElementById('level-grid');
        if (!container) return;
        container.innerHTML = '';

        LEVELS.forEach(lvl => {
            const isUnlocked = lvl.id <= this.savedData.unlockedLevels;
            const starsEarned = this.savedData.levelStars[lvl.id] || 0;

            const card = document.createElement('div');
            card.className = `level-card ${!isUnlocked ? 'locked' : ''}`;
            
            let starsHTML = '';
            for (let s = 1; s <= 3; s++) {
                starsHTML += `<i class="fa-solid fa-star ${s <= starsEarned ? 'earned' : ''}"></i>`;
            }

            card.innerHTML = `
                <div class="level-num">LEVEL ${lvl.id}</div>
                <div class="level-target-icon">${lvl.icon}</div>
                <div class="level-title">${lvl.title}</div>
                <div style="font-size:0.75rem; color:#CBD5E1; margin-bottom:6px;">${lvl.distance}m Range</div>
                <div class="level-stars">${isUnlocked ? starsHTML : '<i class="fa-solid fa-lock" style="color:#FFF;"></i>'}</div>
            `;

            if (isUnlocked) {
                card.addEventListener('click', () => {
                    this.showScreen('hud');
                    document.getElementById('hud').classList.remove('hidden');
                    if (window.gameInstance) window.gameInstance.startLevel(lvl.id);
                });
            }
            container.appendChild(card);
        });
    }

    updateHUD(score, levelNum, arrowsLeft, windSpeed, windAngle) {
        const char = CHARACTERS.find(c => c.id === this.selectedCharId) || CHARACTERS[0];
        const bow = BOWS.find(b => b.id === this.selectedBowId) || BOWS[0];

        document.getElementById('hud-player-name').textContent = this.playerName;
        document.getElementById('hud-char-avatar').textContent = char.emoji;
        document.getElementById('hud-bow-name').textContent = bow.name;
        document.getElementById('hud-score').textContent = score;
        document.getElementById('hud-level').textContent = levelNum;
        document.getElementById('hud-arrows').textContent = arrowsLeft;

        // Wind Compass
        const windArrow = document.getElementById('wind-arrow-dir');
        if (windArrow) {
            windArrow.style.transform = `rotate(${windAngle}rad)`;
        }
        document.getElementById('wind-speed-val').textContent = `${windSpeed.toFixed(1)} m/s`;
    }

    spawnFloatingScore(text, x, y) {
        const el = document.createElement('div');
        el.className = 'floating-hit-score';
        el.textContent = text;
        el.style.left = `${x}px`;
        el.style.top = `${y}px`;
        document.getElementById('game-container').appendChild(el);

        setTimeout(() => el.remove(), 1200);
    }
}

window.UIManager = UIManager;
