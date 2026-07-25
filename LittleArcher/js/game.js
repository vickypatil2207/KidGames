/* ==========================================================================
   Core Game Loop & Controller
   ========================================================================== */

class ArcheryGame {
    constructor() {
        this.renderer = new GameRenderer('game-canvas');
        this.physics = new PhysicsEngine();
        this.ui = new UIManager();

        this.currentLevelDef = null;
        this.activeTargets = [];
        this.activeArrows = [];

        this.score = 0;
        this.arrowsLeft = 5;
        this.hitsCount = 0;
        this.windVector = new THREE.Vector3(0, 0, 0);
        this.windSpeed = 0;

        this.isAiming = false;
        this.aimStartPos = { x: 0, y: 0 };
        this.aimCurrentPos = { x: 0, y: 0 };
        this.drawFactor = 0;
        this.aimDirection = new THREE.Vector3(0, 0, -1);

        this.gameState = 'MENU'; // MENU, AIMING, ARROW_CAM, LEVEL_END, PAUSED

        this.init();
    }

    init() {
        window.gameInstance = this;
        this.updatePlayerConfig();
        this.bindInputEvents();
        this.animate(0);
    }

    updatePlayerConfig() {
        const bowId = this.ui.selectedBowId;
        this.renderer.setPlayerBow(bowId);
    }

    bindInputEvents() {
        const canvas = this.renderer.canvas;

        const onPointerDown = (e) => {
            if (this.gameState !== 'PLAYING' && this.gameState !== 'AIMING') return;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;

            this.isAiming = true;
            this.gameState = 'AIMING';
            this.aimStartPos = { x, y };
            this.aimCurrentPos = { x, y };
            this.drawFactor = 0.1;

            window.soundManager.playDrawString();
        };

        const onPointerMove = (e) => {
            if (!this.isAiming) return;
            const x = e.touches ? e.touches[0].clientX : e.clientX;
            const y = e.touches ? e.touches[0].clientY : e.clientY;

            this.aimCurrentPos = { x, y };

            const dx = (this.aimStartPos.x - x) * 0.003;
            const dy = (y - this.aimStartPos.y) * 0.003;

            // Draw factor from backward drag distance
            const dragDist = Math.hypot(x - this.aimStartPos.x, y - this.aimStartPos.y);
            this.drawFactor = Math.min(Math.max(dragDist / 180, 0.1), 1.0);

            // Update Aim Direction Vector
            const pitch = Math.min(Math.max(dy, -0.6), 0.6);
            const yaw = Math.min(Math.max(dx, -0.6), 0.6);

            this.aimDirection.set(yaw, pitch + 0.05, -1).normalize();

            // Update bow draw tension mesh & aim guide line
            this.renderer.updateBowDraw(this.drawFactor);

            const bowStats = BOWS.find(b => b.id === this.ui.selectedBowId).stats;
            const charStats = CHARACTERS.find(c => c.id === this.ui.selectedCharId).stats;
            const launchVel = this.physics.calculateLaunchVelocity(this.aimDirection, this.drawFactor, bowStats, charStats);
            const startPos = new THREE.Vector3(0.25, 1.45, -0.6);

            const points = this.physics.predictTrajectory(startPos, launchVel, this.windVector, charStats, bowStats);
            this.renderer.updateAimLinePoints(points);
        };

        const onPointerUp = () => {
            if (!this.isAiming) return;
            this.isAiming = false;
            this.renderer.aimLine.visible = false;

            if (this.drawFactor > 0.2 && this.arrowsLeft > 0) {
                this.shootArrow();
            } else {
                this.renderer.updateBowDraw(0);
                this.gameState = 'PLAYING';
            }
        };

        canvas.addEventListener('mousedown', onPointerDown);
        canvas.addEventListener('mousemove', onPointerMove);
        window.addEventListener('mouseup', onPointerUp);

        canvas.addEventListener('touchstart', onPointerDown, { passive: true });
        canvas.addEventListener('touchmove', onPointerMove, { passive: true });
        window.addEventListener('touchend', onPointerUp);

        // HUD Pause & Modal Buttons
        document.getElementById('pause-btn')?.addEventListener('click', () => this.pauseGame());
        document.getElementById('resume-btn')?.addEventListener('click', () => this.resumeGame());
        document.getElementById('restart-btn')?.addEventListener('click', () => {
            this.ui.showScreen('hud');
            this.startLevel(this.currentLevelDef.id);
        });
        document.getElementById('quit-btn')?.addEventListener('click', () => {
            this.gameState = 'MENU';
            this.ui.showScreen('main-menu');
        });
        document.getElementById('next-level-btn')?.addEventListener('click', () => {
            const nextLvl = this.currentLevelDef.id + 1;
            if (nextLvl <= LEVELS.length) {
                this.ui.showScreen('hud');
                this.startLevel(nextLvl);
            } else {
                this.ui.showScreen('main-menu');
            }
        });
        document.getElementById('retry-level-btn')?.addEventListener('click', () => {
            this.ui.showScreen('hud');
            this.startLevel(this.currentLevelDef.id);
        });
    }

    startLevel(levelId) {
        this.currentLevelDef = LEVELS.find(l => l.id === levelId) || LEVELS[0];
        this.score = 0;
        this.hitsCount = 0;
        this.arrowsLeft = this.currentLevelDef.arrows;

        // Wind setup
        const wRange = this.currentLevelDef.wind;
        this.windSpeed = wRange.min + Math.random() * (wRange.max - wRange.min);
        const windAngle = Math.random() * Math.PI * 2;
        this.windVector.set(Math.cos(windAngle) * this.windSpeed, 0, Math.sin(windAngle) * this.windSpeed);

        this.clearLevelObjects();
        this.spawnLevelTargets();

        this.updatePlayerConfig();
        this.renderer.resetCamera();
        this.gameState = 'PLAYING';

        this.ui.updateHUD(this.score, this.currentLevelDef.id, this.arrowsLeft, this.windSpeed, windAngle);
    }

    clearLevelObjects() {
        this.activeTargets.forEach(t => this.renderer.scene.remove(t));
        this.activeTargets = [];

        this.activeArrows.forEach(a => this.renderer.scene.remove(a.mesh));
        this.activeArrows = [];
    }

    spawnLevelTargets() {
        this.currentLevelDef.targets.forEach(tDef => {
            let group = null;
            if (tDef.type === 'bottle') group = TargetFactory.createBottle();
            else if (tDef.type === 'apple') group = TargetFactory.createApple();
            else if (tDef.type === 'football') group = TargetFactory.createFootball();
            else if (tDef.type === 'target_board') group = TargetFactory.createTargetBoard();
            else if (tDef.type === 'balloon') group = TargetFactory.createBalloon(tDef.color);
            else if (tDef.type === 'rotating_wheel') group = TargetFactory.createRotatingWheel();
            else if (tDef.type === 'boss_target') group = TargetFactory.createBossTarget();

            if (group) {
                group.position.set(tDef.pos[0], tDef.pos[1], tDef.pos[2]);
                if (tDef.scale) group.scale.set(tDef.scale, tDef.scale, tDef.scale);
                group.userData = { ...tDef, initialPos: [...tDef.pos] };
                this.renderer.scene.add(group);
                this.activeTargets.push(group);
            }
        });
    }

    shootArrow() {
        this.arrowsLeft--;
        this.gameState = 'ARROW_CAM';

        window.soundManager.playShoot();

        const bowStats = BOWS.find(b => b.id === this.ui.selectedBowId).stats;
        const charStats = CHARACTERS.find(c => c.id === this.ui.selectedCharId).stats;

        const launchVel = this.physics.calculateLaunchVelocity(this.aimDirection, this.drawFactor, bowStats, charStats);
        const startPos = new THREE.Vector3(0.25, 1.45, -0.6);

        const arrowMesh = BowFactory.createArrowMesh(this.ui.selectedBowId);
        arrowMesh.position.copy(startPos);
        this.renderer.scene.add(arrowMesh);

        const arrowObj = {
            mesh: arrowMesh,
            pos: startPos,
            vel: launchVel,
            active: true
        };
        this.activeArrows.push(arrowObj);

        // Reset player bow draw
        this.renderer.updateBowDraw(0);

        // Activate slow-mo camera on arrow
        this.renderer.startArrowCamera(arrowMesh);

        this.ui.updateHUD(this.score, this.currentLevelDef.id, this.arrowsLeft, this.windSpeed, 0);
    }

    onArrowHit(arrowObj, hitResult) {
        arrowObj.active = false;

        const group = hitResult.targetGroup;
        const hitObj = hitResult.hitObject;
        const targetType = group.userData.type || group.name;

        let points = 10;
        let isBullseye = false;

        if (targetType === 'bottle') {
            points = 20;
            window.soundManager.playBottleShatter();
            this.renderer.particles.spawnShatter(hitResult.point, 0x00E676, 18);
            group.visible = false;
            this.hitsCount++;
        } else if (targetType === 'apple') {
            points = 15;
            window.soundManager.playAppleSlice();
            this.renderer.particles.spawnShatter(hitResult.point, 0xFF1744, 14);
            group.visible = false;
            this.hitsCount++;
        } else if (targetType === 'football') {
            points = 15;
            window.soundManager.playFootballBounce();
            this.renderer.particles.spawnShatter(hitResult.point, 0xFFFFFF, 10);
            group.visible = false;
            this.hitsCount++;
        } else if (targetType === 'balloon') {
            points = 10;
            window.soundManager.playBalloonPop();
            this.renderer.particles.spawnShatter(hitResult.point, group.userData.color || 0xFF1744, 20);
            group.visible = false;
            this.hitsCount++;
        } else if (hitObj.userData.points || targetType === 'target_board' || targetType === 'boss_target') {
            points = hitObj.userData.points || 10;
            if (hitObj.userData.isBullseye) {
                points = 50;
                isBullseye = true;
            }
            window.soundManager.playBullseyeGong();
            this.hitsCount++;
        }

        // Perk double score bonus check
        if (this.ui.selectedCharId === 'motupatlu') points *= 2;

        this.score += points;

        // Floating Hit Text
        const scoreText = isBullseye ? "🎯 BULLSEYE! +50" : `+${points}`;
        this.ui.spawnFloatingScore(scoreText, window.innerWidth / 2, window.innerHeight / 2 - 50);

        this.ui.updateHUD(this.score, this.currentLevelDef.id, this.arrowsLeft, this.windSpeed, 0);

        setTimeout(() => this.checkLevelStatus(), 1200);
    }

    onArrowMiss(arrowObj) {
        arrowObj.active = false;
        setTimeout(() => this.checkLevelStatus(), 800);
    }

    checkLevelStatus() {
        this.renderer.resetCamera();

        const passReq = this.currentLevelDef.passScore;
        const currentProgress = (this.currentLevelDef.targetType === 'target_board' || this.currentLevelDef.targetType === 'rotating_wheel' || this.currentLevelDef.targetType === 'boss_challenge') ? this.score : this.hitsCount;

        if (this.arrowsLeft === 0 || currentProgress >= passReq) {
            this.finishLevel(currentProgress >= passReq);
        } else {
            this.gameState = 'PLAYING';
        }
    }

    finishLevel(passed) {
        this.gameState = 'LEVEL_END';

        let stars = 0;
        if (passed) {
            const st = this.currentLevelDef.stars;
            const val = (this.currentLevelDef.targetType === 'target_board' || this.currentLevelDef.targetType === 'boss_challenge') ? this.score : this.hitsCount;
            if (val >= st.three) stars = 3;
            else if (val >= st.two) stars = 2;
            else stars = 1;

            // Save Progress
            if (stars > (this.ui.savedData.levelStars[this.currentLevelDef.id] || 0)) {
                this.ui.savedData.levelStars[this.currentLevelDef.id] = stars;
            }
            if (this.currentLevelDef.id + 1 > this.ui.savedData.unlockedLevels) {
                this.ui.savedData.unlockedLevels = Math.min(this.currentLevelDef.id + 1, LEVELS.length);
            }
            if (this.score > this.ui.savedData.highScore) {
                this.ui.savedData.highScore = this.score;
            }
            this.ui.saveData();

            window.soundManager.playWinFanfare();
            this.showResultsModal(true, stars);
        } else {
            window.soundManager.playFailSound();
            this.showResultsModal(false, 0);
        }
    }

    showResultsModal(win, stars) {
        this.ui.showScreen(win ? 'victory-screen' : 'defeat-screen');
        
        if (win) {
            document.getElementById('vic-score').textContent = this.score;
            document.getElementById('vic-hits').textContent = `${this.hitsCount} Hits`;
            
            const starContainer = document.getElementById('vic-stars');
            if (starContainer) {
                starContainer.innerHTML = '';
                for (let s = 1; s <= 3; s++) {
                    starContainer.innerHTML += `<i class="fa-solid fa-star ${s <= stars ? 'earned' : ''}"></i>`;
                }
            }
        } else {
            document.getElementById('def-score').textContent = this.score;
            document.getElementById('def-req').textContent = `${this.currentLevelDef.passScore} Req`;
        }
    }

    pauseGame() {
        if (this.gameState === 'PLAYING' || this.gameState === 'AIMING') {
            this.gameState = 'PAUSED';
            this.ui.showScreen('pause-screen');
        }
    }

    resumeGame() {
        this.gameState = 'PLAYING';
        this.ui.showScreen('hud');
        document.getElementById('hud').classList.remove('hidden');
    }

    animate(timestamp) {
        requestAnimationFrame((t) => this.animate(t));

        const delta = 0.016; // fixed 60fps delta

        // Target animations (bouncing footballs, floating balloons, spinning wheel, rails)
        this.activeTargets.forEach(t => {
            if (!t.visible) return;
            const uData = t.userData;
            const time = timestamp * 0.001;

            if (uData.bounceSpeed) {
                t.position.y = uData.initialPos[1] + Math.abs(Math.sin(time * uData.bounceSpeed)) * uData.bounceAmp;
            }
            if (uData.floatSpeed) {
                t.position.y = uData.initialPos[1] + Math.sin(time * uData.floatSpeed) * 0.4;
            }
            if (uData.rotateSpeed) {
                t.rotation.z += delta * uData.rotateSpeed;
            }
            if (uData.railSpeed) {
                t.position.x = uData.initialPos[0] + Math.sin(time * uData.railSpeed) * uData.railDist;
            }
            if (uData.type === 'boss_target') {
                t.position.x = Math.sin(time * uData.moveSpeed) * uData.moveAmp;
            }
        });

        // Flying Arrows physics update
        this.activeArrows.forEach(arrowObj => {
            if (!arrowObj.active) return;

            const prevPos = arrowObj.pos.clone();

            // Wind drift & gravity
            const charStats = CHARACTERS.find(c => c.id === this.ui.selectedCharId).stats;
            const bowStats = BOWS.find(b => b.id === this.ui.selectedBowId).stats;
            const windFactor = 1.0 - (charStats.windResist || 0.5) * (bowStats.stability / 100);

            arrowObj.vel.y += this.physics.gravity * delta;
            arrowObj.vel.x += this.windVector.x * windFactor * delta;
            arrowObj.vel.z += this.windVector.z * windFactor * delta;

            arrowObj.pos.addScaledVector(arrowObj.vel, delta);
            arrowObj.mesh.position.copy(arrowObj.pos);

            // Orient arrow mesh in direction of flight vector
            const flightDir = arrowObj.vel.clone().normalize();
            arrowObj.mesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 0, -1), flightDir);

            // Check collision with targets
            const hitResult = this.physics.checkCollision(prevPos, arrowObj.pos, this.activeTargets);
            if (hitResult.hit) {
                this.onArrowHit(arrowObj, hitResult);
            } else if (arrowObj.pos.y <= 0 || arrowObj.pos.z < -60) {
                this.onArrowMiss(arrowObj);
            }
        });

        this.renderer.update(delta);
        this.renderer.render();
    }
}

// Auto start game on window load
window.addEventListener('load', () => {
    new ArcheryGame();
});
