/* ==========================================================================
   Arrow Physics & Collision Detection Engine
   ========================================================================== */

class PhysicsEngine {
    constructor() {
        this.gravity = -9.8;
    }

    /**
     * Compute launch velocity vector based on aim angle, draw percentage, bow stats, and character perks.
     */
    calculateLaunchVelocity(aimDir, drawFactor, bowStats, charStats) {
        const basePower = 35; // base m/s
        const powerMult = (bowStats.power / 100) * (charStats.powerBoost || 1.0);
        const speedMult = (bowStats.speed / 100) * (charStats.speed || 1.0);
        
        const launchSpeed = basePower * drawFactor * powerMult * speedMult;
        return aimDir.clone().multiplyScalar(launchSpeed);
    }

    /**
     * Predict trajectory points array for drawing aim guide line.
     */
    predictTrajectory(startPos, velocity, windVector, charStats, bowStats, stepCount = 30, dt = 0.05) {
        const points = [];
        const currentPos = startPos.clone();
        const currentVel = velocity.clone();

        // Effective wind drift factoring character resistance perk
        const windFactor = 1.0 - (charStats.windResist || 0.5) * (bowStats.stability / 100);
        const effectiveWind = windVector.clone().multiplyScalar(windFactor);

        const limitSteps = Math.min(stepCount * (bowStats.aimAssist / 50) * (charStats.aimGuide || 1.0), 60);

        for (let i = 0; i < limitSteps; i++) {
            points.push(currentPos.clone());

            // Physics step
            currentVel.y += this.gravity * dt;
            currentVel.x += effectiveWind.x * dt;
            currentVel.z += effectiveWind.z * dt;

            currentPos.addScaledVector(currentVel, dt);

            // Stop trajectory line if it hits ground (y <= 0)
            if (currentPos.y <= 0) break;
        }

        return points;
    }

    /**
     * Check collision between arrow's line segment in frame and target objects.
     */
    checkCollision(arrowStartPos, arrowEndPos, targets) {
        const raycaster = new THREE.Raycaster();
        const dir = arrowEndPos.clone().sub(arrowStartPos);
        const dist = dir.length();
        dir.normalize();

        raycaster.set(arrowStartPos, dir);
        raycaster.far = dist + 0.1;

        for (const targetGroup of targets) {
            if (!targetGroup.visible) continue;

            const intersects = raycaster.intersectObjects(targetGroup.children, true);
            if (intersects.length > 0) {
                const hit = intersects[0];
                return {
                    hit: true,
                    targetGroup: targetGroup,
                    hitObject: hit.object,
                    point: hit.point,
                    distance: hit.distance
                };
            }
        }

        return { hit: false };
    }
}

window.PhysicsEngine = PhysicsEngine;
