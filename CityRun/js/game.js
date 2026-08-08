/* Main Game Loop & Logic Coordinator */
class CityRunGame {
    constructor() {
        this.state = 'MENU'; // MENU, PLAYING, PAUSED, GAME_OVER

        // Engine & Components
        this.renderer = new GameRenderer('game-canvas');
        this.player = new Player();
        this.renderer.scene.add(this.player.mesh);

        this.ui = new UIManager(this);

        // Gameplay Metrics
        this.speed = 22;
        this.baseSpeed = 22;
        this.distance = 0;
        this.score = 0;
        this.coinsCollected = 0;
        this.snacksCollected = 0;
        this.lastTime = 0;

        // Object Tracking Pools
        this.obstacles = [];
        this.collectibles = [];
        this.activeMonuments = [];

        // Spawning Intervals & Distances
        this.spawnDistanceCounter = 0;
        this.nextSpawnDistance = 15;

        // Monument Milestones List
        this.monumentMilestones = [
            { distance: 2000, type: 'atal', triggered: false },
            { distance: 4000, type: 'sidi', triggered: false },
            { distance: 6000, type: 'jhalta', triggered: false },
            { distance: 8000, type: 'kankaria', triggered: false },
            { distance: 10000, type: 'laldarwaja', triggered: false },
            { distance: 12000, type: 'lawgarden', triggered: false },
            { distance: 14000, type: 'iscon', triggered: false },
            { distance: 16000, type: 'vaishnodevi', triggered: false },
            { distance: 18000, type: 'motera', triggered: false },
            { distance: 23000, type: 'akshardham', triggered: false }, // 5,000m gap after last Ahmedabad place
            { distance: 26000, type: 'mahatma', triggered: false },
            { distance: 29000, type: 'giftcity', triggered: false },
            { distance: 32000, type: 'indroda', triggered: false },
            { distance: 35000, type: 'pathik', triggered: false }
        ];

        this.hasRevived = false;
        this.snackReviveAttempts = 0;
        this.coinReviveAttempts = 0;

        // Power-Up Durations Tracker
        this.powerupTimers = {
            magnet: 0,
            jetpack: 0,
            shield: 0,
            multiplier: 0
        };

        // Start Loop
        requestAnimationFrame((t) => this.loop(t));
    }

    startGame() {
        this.resetGame();
        this.state = 'PLAYING';
        this.ui.showScreen('HUD');
        window.audioManager.startBgMusic();
    }

    pauseGame() {
        if (this.state === 'PLAYING') {
            this.state = 'PAUSED';
            this.ui.showScreen('PAUSE');
            window.audioManager.stopBgMusic();
        }
    }

    resumeGame() {
        if (this.state === 'PAUSED') {
            this.state = 'PLAYING';
            this.ui.showScreen('HUD');
            window.audioManager.startBgMusic();
            this.lastTime = performance.now();
        }
    }

    restartGame() {
        this.startGame();
    }

    quitToMenu() {
        this.state = 'MENU';
        this.resetGame();
        this.ui.showScreen('MENU');
        window.audioManager.stopBgMusic();
    }

    resetGame() {
        this.speed = this.baseSpeed;
        this.distance = 0;
        this.score = 0;
        this.coinsCollected = 0;
        this.snacksCollected = 0;
        this.spawnDistanceCounter = 0;
        this.hasRevived = false;
        this.snackReviveAttempts = 0;
        this.coinReviveAttempts = 0;

        // Reset Player Position & Powers
        this.player.mesh.position.set(0, 0, 0);
        this.player.currentLane = 0;
        this.player.targetX = 0;
        this.player.hasShield = false;
        this.player.hasMagnet = false;
        this.player.hasJetpack = false;
        this.player.hasMultiplier = false;

        // Clear Scene Objects
        this.obstacles.forEach(o => this.renderer.scene.remove(o));
        this.collectibles.forEach(c => this.renderer.scene.remove(c));
        this.activeMonuments.forEach(m => this.renderer.scene.remove(m));

        this.obstacles = [];
        this.collectibles = [];
        this.activeMonuments = [];

        // Reset Milestone triggers
        this.monumentMilestones.forEach(m => m.triggered = false);

        this.ui.updateHUD(0, 0, 0);
    }

    loop(currentTime) {
        if (!this.lastTime) this.lastTime = currentTime;
        const deltaTime = Math.min((currentTime - this.lastTime) / 1000, 0.1);
        this.lastTime = currentTime;

        if (this.state === 'PLAYING') {
            this.update(deltaTime);
        }

        this.renderer.render(this.player.mesh, deltaTime, this.player.hasJetpack);
        requestAnimationFrame((t) => this.loop(t));
    }

    update(deltaTime) {
        // 1. Distance & Score Progression
        const stepDistance = this.speed * deltaTime;
        this.distance += stepDistance;
        const multiplier = this.player.hasMultiplier ? 2 : 1;
        this.score += stepDistance * multiplier;

        // Gradually increase speed up to max 42
        this.speed = Math.min(42, this.baseSpeed + (this.distance / 120));

        this.ui.updateHUD(this.score, this.distance, this.coinsCollected);

        // 2. Update Player & Road Tiling
        this.player.update(deltaTime, this.powerupTimers);
        this.renderer.updateRoad(this.speed, deltaTime);

        // 3. Update Power-Up Active Timers
        this.updatePowerups(deltaTime);

        // 4. Milestone Check for Gujarat Monuments
        this.checkMonumentMilestones();

        // 5. Spawn & Move Objects
        this.spawnDistanceCounter += stepDistance;
        if (this.spawnDistanceCounter >= this.nextSpawnDistance) {
            this.spawnDistanceCounter = 0;
            this.nextSpawnDistance = 14 + Math.random() * 10;
            this.spawnPattern();
        }

        this.updateObjects(deltaTime);

        // 6. Check Collisions
        this.checkCollisions();
    }

    updatePowerups(deltaTime) {
        // Magnet
        if (this.powerupTimers.magnet > 0) {
            this.powerupTimers.magnet -= deltaTime * 1000;
            if (this.powerupTimers.magnet <= 0) this.player.hasMagnet = false;
        }
        // Jetpack
        if (this.powerupTimers.jetpack > 0) {
            this.powerupTimers.jetpack -= deltaTime * 1000;
            if (this.powerupTimers.jetpack <= 0) this.player.hasJetpack = false;
        }
        // Shield
        if (this.powerupTimers.shield > 0) {
            this.powerupTimers.shield -= deltaTime * 1000;
            if (this.powerupTimers.shield <= 0) this.player.hasShield = false;
        }
        // Multiplier
        if (this.powerupTimers.multiplier > 0) {
            this.powerupTimers.multiplier -= deltaTime * 1000;
            if (this.powerupTimers.multiplier <= 0) this.player.hasMultiplier = false;
        }
    }

    checkMonumentMilestones() {
        this.monumentMilestones.forEach(m => {
            if (!m.triggered && this.distance >= m.distance) {
                m.triggered = true;
                let monumentMesh = null;

                switch (m.type) {
                    case 'atal': monumentMesh = MonumentBuilder.createAtalBridge(); break;
                    case 'sidi': monumentMesh = MonumentBuilder.createSidiSaiyyedArch(); break;
                    case 'jhalta': monumentMesh = MonumentBuilder.createJhaltaMinara(); break;
                    case 'kankaria': monumentMesh = MonumentBuilder.createKankariaBalloon(); break;
                    case 'laldarwaja': monumentMesh = MonumentBuilder.createLalDarwaja(); break;
                    case 'lawgarden': monumentMesh = MonumentBuilder.createLawGarden(); break;
                    case 'iscon': monumentMesh = MonumentBuilder.createIsconTemple(); break;
                    case 'vaishnodevi': monumentMesh = MonumentBuilder.createVaishnodeviMandir(); break;
                    case 'motera': monumentMesh = MonumentBuilder.createMoteraStadium(); break;
                    case 'akshardham': monumentMesh = MonumentBuilder.createAkshardhamTemple(); break;
                    case 'mahatma': monumentMesh = MonumentBuilder.createMahatmaMandir(); break;
                    case 'giftcity': monumentMesh = MonumentBuilder.createGiftCityTowers(); break;
                    case 'indroda': monumentMesh = MonumentBuilder.createIndrodaPark(); break;
                    case 'pathik': monumentMesh = MonumentBuilder.createPathikAshram(); break;
                }

                if (monumentMesh) {
                    // Position monument alongside or overhead
                    monumentMesh.position.set(0, 0, -120);
                    this.renderer.scene.add(monumentMesh);
                    this.activeMonuments.push(monumentMesh);
                    this.ui.showMonumentNotification(monumentMesh.userData.name, monumentMesh.userData.city);
                }
            }
        });
    }

    spawnPattern() {
        const lanes = [-3.5, 0, 3.5];
        const randomLane = lanes[Math.floor(Math.random() * lanes.length)];

        // Choose what to spawn (Obstacle vs Collectible vs Power-up)
        const rand = Math.random();

        // Predict if player will be in jetpack flight when these items reach player at z = 0
        const travelTimeSec = 110 / this.speed;
        const remainingJetpackSec = (this.powerupTimers.jetpack || 0) / 1000;
        const willBeFlying = remainingJetpackSec > (travelTimeSec * 0.35);

        if (rand < 0.55 && !this.player.hasJetpack && !willBeFlying) {
            // Spawn Obstacle
            const obstacleTypes = ['auto', 'bus', 'barricade', 'overhead', 'cart'];
            const chosenType = obstacleTypes[Math.floor(Math.random() * obstacleTypes.length)];
            let obstacle = null;

            switch (chosenType) {
                case 'auto': obstacle = ObstacleBuilder.createAutoRickshaw(); break;
                case 'bus': obstacle = ObstacleBuilder.createAMTSBus(); break;
                case 'barricade': obstacle = ObstacleBuilder.createRoadBarricade(); break;
                case 'overhead': obstacle = ObstacleBuilder.createOverheadBanner(); break;
                case 'cart': obstacle = ObstacleBuilder.createVendorCart(); break;
            }

            if (chosenType === 'overhead') {
                obstacle.position.set(0, 0, -110); // Overhead arch covers lanes
            } else {
                obstacle.position.set(randomLane, 0, -110);
            }

            this.renderer.scene.add(obstacle);
            this.obstacles.push(obstacle);
        } else if (rand < 0.88) {
            // Spawn Coin Row / Snack with exact 10:1 Coins to Snack Ratio
            const spawnSnack = Math.random() < (1 / 11);
            for (let i = 0; i < 4; i++) {
                const item = spawnSnack ? CollectibleBuilder.createSnack() : CollectibleBuilder.createCoin();
                const spawnY = (willBeFlying || (this.player.hasJetpack && remainingJetpackSec > 1.5)) ? 6.5 : 1.2;
                item.position.set(randomLane, spawnY, -110 - (i * 3.5));
                this.renderer.scene.add(item);
                this.collectibles.push(item);
            }
        } else {
            // Spawn Power-Up
            const powerupTypes = ['magnet', 'jetpack', 'shield', 'multiplier'];
            const chosenPow = powerupTypes[Math.floor(Math.random() * powerupTypes.length)];
            let pItem = null;

            switch (chosenPow) {
                case 'magnet': pItem = CollectibleBuilder.createMagnet(); break;
                case 'jetpack': pItem = CollectibleBuilder.createJetpack(); break;
                case 'shield': pItem = CollectibleBuilder.createShield(); break;
                case 'multiplier': pItem = CollectibleBuilder.create2XMultiplier(); break;
            }

            pItem.position.set(randomLane, 1.5, -110);
            this.renderer.scene.add(pItem);
            this.collectibles.push(pItem);
        }
    }

    updateObjects(deltaTime) {
        const moveDist = this.speed * deltaTime;

        // Move & Rotate Collectibles
        this.collectibles.forEach((item, index) => {
            item.position.z += moveDist;
            item.rotation.y += deltaTime * 3;

            // Magnet Attraction Effect (Metal coins only, non-metallic Jalebi & Fafda are ignored!)
            if (this.player.hasMagnet && item.userData.type === 'collectible' && item.userData.subtype === 'coin') {
                const dx = this.player.mesh.position.x - item.position.x;
                const dy = this.player.mesh.position.y - item.position.y;
                const dz = this.player.mesh.position.z - item.position.z;
                const dist = Math.sqrt(dx*dx + dy*dy + dz*dz);

                if (dist < 18) {
                    item.position.x += (this.player.mesh.position.x - item.position.x) * 12 * deltaTime;
                    item.position.y += (this.player.mesh.position.y + 1.2 - item.position.y) * 12 * deltaTime;
                    item.position.z += (this.player.mesh.position.z - item.position.z) * 12 * deltaTime;
                }
            }

            // Recycle off-screen
            if (item.position.z > 10) {
                this.renderer.scene.remove(item);
                this.collectibles.splice(index, 1);
            }
        });

        // Move Obstacles
        this.obstacles.forEach((obs, index) => {
            obs.position.z += moveDist;

            if (obs.position.z > 15) {
                this.renderer.scene.remove(obs);
                this.obstacles.splice(index, 1);
            }
        });

        // Move Monuments
        this.activeMonuments.forEach((mon, index) => {
            mon.position.z += moveDist;

            if (mon.position.z > 30) {
                this.renderer.scene.remove(mon);
                this.activeMonuments.splice(index, 1);
            }
        });
    }

    checkCollisions() {
        const pX = this.player.mesh.position.x;
        const pY = this.player.mesh.position.y;
        const pZ = this.player.mesh.position.z;

        // 1. Collectibles Collision
        this.collectibles.forEach((item, index) => {
            const dx = Math.abs(pX - item.position.x);
            const dy = Math.abs((pY + 1.0) - item.position.y);
            const dz = Math.abs(pZ - item.position.z);

            if (dx < 1.2 && dy < 1.5 && dz < 1.4) {
                // Collect item!
                if (item.userData.type === 'collectible') {
                    if (item.userData.subtype === 'coin') {
                        this.coinsCollected++;
                        this.ui.addCoins(1);
                        this.score += 10;
                        window.audioManager.playCoin();
                    } else if (item.userData.subtype === 'snack') {
                        this.snacksCollected++;
                        this.ui.addSnacks(1);
                        this.score += 50;
                        window.audioManager.playSnack();
                    }
                } else if (item.userData.type === 'powerup') {
                    window.audioManager.playPowerup();
                    const st = item.userData.subtype;

                    if (st === 'magnet') { this.player.hasMagnet = true; this.powerupTimers.magnet = item.userData.duration; }
                    if (st === 'jetpack') {
                        this.player.hasJetpack = true;
                        this.powerupTimers.jetpack = item.userData.duration;
                        // Instantly elevate existing on-screen collectibles ahead into the air lane
                        this.collectibles.forEach(c => {
                            if (c.position.z < 0 && c.userData.type === 'collectible') {
                                c.position.y = 6.5;
                            }
                        });
                    }
                    if (st === 'shield') { this.player.hasShield = true; this.powerupTimers.shield = item.userData.duration; }
                    if (st === 'multiplier') { this.player.hasMultiplier = true; this.powerupTimers.multiplier = item.userData.duration; }
                }

                this.renderer.scene.remove(item);
                this.collectibles.splice(index, 1);
            }
        });

        // 2. Obstacles Collision (Skip if in Jetpack mode!)
        if (this.player.hasJetpack) return;

        this.obstacles.forEach((obs) => {
            const data = obs.userData;
            const dx = Math.abs(pX - obs.position.x);
            const dz = Math.abs(pZ - obs.position.z);

            let hit = false;

            if (data.canSlideUnder) {
                // Overhead banner requires slide (duck)!
                if (dx < (data.width / 2) && dz < 1.2) {
                    if (!this.player.isSliding) {
                        hit = true;
                    }
                }
            } else {
                // Normal obstacle requires lane switch or jump over low barrier
                const hitY = pY < (data.height - 0.3);
                if (dx < (data.width / 2 + 0.4) && dz < (data.length / 2 + 0.4) && hitY) {
                    hit = true;
                }
            }

            if (hit) {
                if (this.player.hasShield) {
                    // Shield breaks and saves player!
                    this.player.hasShield = false;
                    this.powerupTimers.shield = 0;
                    window.audioManager.playCrash();
                    obs.position.z = 20; // Push obstacle past
                } else if (this.snackReviveAttempts < 5 || this.coinReviveAttempts < 3) {
                    this.handleHitRevive();
                } else {
                    // Game Over Crash!
                    this.gameOver();
                }
            }
        });
    }

    handleHitRevive() {
        this.state = 'REVIVE';
        window.audioManager.playCrash();
        window.audioManager.stopBgMusic();
        this.ui.startReviveCountdown(this.snackReviveAttempts, this.coinReviveAttempts, () => this.gameOver());
    }

    confirmReviveSnacks() {
        const snackCosts = [20, 50, 100, 200, 500];
        const cost = snackCosts[this.snackReviveAttempts] || 500;

        if (this.snackReviveAttempts < 5 && this.ui.totalSnacks >= cost) {
            this.ui.deductSnacks(cost);
            this.snackReviveAttempts++;
            this.executeRevive();
        } else {
            this.gameOver();
        }
    }

    confirmReviveCoins() {
        const coinCosts = [100, 200, 500];
        const cost = coinCosts[this.coinReviveAttempts] || 500;

        if (this.coinReviveAttempts < 3 && this.ui.totalCoins >= cost) {
            this.ui.deductCoins(cost);
            this.coinReviveAttempts++;
            this.executeRevive();
        } else {
            this.gameOver();
        }
    }

    executeRevive() {
        // Clear obstacles in front of player
        this.obstacles.forEach(o => {
            if (o.position.z > -35 && o.position.z < 20) {
                this.renderer.scene.remove(o);
            }
        });
        this.obstacles = this.obstacles.filter(o => o.position.z <= -35 || o.position.z >= 20);

        // Grant 3 seconds temporary shield invincibility
        this.player.hasShield = true;
        this.powerupTimers.shield = 3000;

        this.state = 'PLAYING';
        this.ui.showScreen('HUD');
        window.audioManager.startBgMusic();
        this.lastTime = performance.now();
    }

    cancelRevive() {
        this.gameOver();
    }

    gameOver() {
        this.state = 'GAME_OVER';
        window.audioManager.playCrash();
        window.audioManager.stopBgMusic();
        this.ui.showGameOver(this.score, this.distance, this.coinsCollected, this.snacksCollected);
    }
}

// Initialize Game when DOM is ready
window.addEventListener('DOMContentLoaded', () => {
    window.cityRunGame = new CityRunGame();
});
