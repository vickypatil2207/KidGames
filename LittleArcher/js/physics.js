/* ==========================================================================
   Arrow Physics & Collision Detection Engine (Kid-Friendly Direct Aiming)
   ========================================================================== */

class PhysicsEngine {
    constructor() {
        this.gravity = -5.0; // Reduced gravity for kid-friendly flat trajectory
    }

    /**
     * Compute launch velocity vector aimed directly toward the 3D world target point.
     */
    calculateLaunchVelocityToPoint(startPos, targetPos, drawFactor, bowStats, charStats) {
        const basePower = 60; // m/s for fast accurate flight
        const powerMult = (bowStats.power / 100) * (charStats.powerBoost || 1.0);
        const speedMult = (bowStats.speed / 100) * (charStats.speed || 1.0);
        
        const launchSpeed = basePower * Math.max(drawFactor, 0.4) * powerMult * speedMult;

        const dx = targetPos.x - startPos.x;
        const dy = targetPos.y - startPos.y;
        const dz = targetPos.z - startPos.z;
        const distXZ = Math.hypot(dx, dz);

        // Calculate elevation angle for parabolic arc to reach targetPos exactly
        const v = launchSpeed;
        const g = Math.abs(this.gravity);
        const v2 = v * v;
        const v4 = v2 * v2;

        let pitchAngle = Math.atan2(dy, distXZ); // Default straight angle

        // Projectile elevation formula: tan(theta) = (v^2 +- sqrt(v^4 - g(g x^2 + 2 y v^2))) / (g x)
        const root = v4 - g * (g * distXZ * distXZ + 2 * dy * v2);
        if (root >= 0) {
            pitchAngle = Math.atan((v2 - Math.sqrt(root)) / (g * distXZ));
        }

        const yawAngle = Math.atan2(dx, -dz);

        const vx = Math.sin(yawAngle) * Math.cos(pitchAngle) * launchSpeed;
        const vy = Math.sin(pitchAngle) * launchSpeed;
        const vz = -Math.cos(yawAngle) * Math.cos(pitchAngle) * launchSpeed;

        return new THREE.Vector3(vx, vy, vz);
    }

    /**
     * Predict trajectory points array for drawing aim guide line.
     */
    predictTrajectory(startPos, velocity, windVector, charStats, bowStats, stepCount = 40, dt = 0.04) {
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

            // Stop trajectory line if it hits ground or far target distance
            if (currentPos.y <= 0.1 || currentPos.z < -65) break;
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
        raycaster.far = dist + 0.2;

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
