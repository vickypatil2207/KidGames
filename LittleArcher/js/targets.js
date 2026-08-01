/* ==========================================================================
   Procedural 3D Target Mesh Generators & Particle Effects System
   ========================================================================== */

class TargetFactory {
    static createBottle() {
        const group = new THREE.Group();
        group.name = "bottle_target";

        // Bottle Body
        const bodyGeo = new THREE.CylinderGeometry(0.12, 0.14, 0.45, 16);
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0x00E676,
            roughness: 0.1,
            transmission: 0.85, // glass transparency
            opacity: 0.9,
            transparent: true,
            ior: 1.5
        });
        const body = new THREE.Mesh(bodyGeo, glassMat);
        body.name = "bottle_mesh";
        body.position.y = 0.225;
        group.add(body);

        // Bottle Neck
        const neckGeo = new THREE.CylinderGeometry(0.04, 0.12, 0.25, 16);
        const neck = new THREE.Mesh(neckGeo, glassMat);
        neck.position.y = 0.575;
        group.add(neck);

        // Bottle Cap
        const capGeo = new THREE.CylinderGeometry(0.045, 0.045, 0.05, 16);
        const capMat = new THREE.MeshStandardMaterial({ color: 0xFF1744, metalness: 0.8, roughness: 0.2 });
        const cap = new THREE.Mesh(capGeo, capMat);
        cap.position.y = 0.725;
        group.add(cap);

        // Wooden Barrel Stand underneath
        const barrel = TargetFactory.createBarrelStand();
        group.add(barrel);

        return group;
    }

    static createApple() {
        const group = new THREE.Group();
        group.name = "apple_target";

        // Apple Sphere with deformation
        const appleGeo = new THREE.SphereGeometry(0.15, 16, 16);
        const appleMat = new THREE.MeshStandardMaterial({ color: 0xFF1744, roughness: 0.3 });
        const apple = new THREE.Mesh(appleGeo, appleMat);
        apple.name = "apple_mesh";
        apple.position.y = 0.15;
        group.add(apple);

        // Stem
        const stemGeo = new THREE.CylinderGeometry(0.008, 0.008, 0.08, 8);
        const stemMat = new THREE.MeshStandardMaterial({ color: 0x5D4037 });
        const stem = new THREE.Mesh(stemGeo, stemMat);
        stem.position.set(0, 0.3, 0);
        group.add(stem);

        // Leaf
        const leafGeo = new THREE.PlaneGeometry(0.05, 0.08);
        const leafMat = new THREE.MeshStandardMaterial({ color: 0x7CB342, side: THREE.DoubleSide });
        const leaf = new THREE.Mesh(leafGeo, leafMat);
        leaf.position.set(0.02, 0.3, 0);
        leaf.rotation.z = Math.PI / 4;
        group.add(leaf);

        // Wooden Post Stand
        const postGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.2, 12);
        const postMat = new THREE.MeshStandardMaterial({ color: 0x795548, roughness: 0.8 });
        const post = new THREE.Mesh(postGeo, postMat);
        post.position.y = -0.6;
        group.add(post);

        return group;
    }

    static createFootball() {
        const group = new THREE.Group();
        group.name = "football_target";

        const ballGeo = new THREE.SphereGeometry(0.22, 24, 24);
        const ballMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.4 });
        const ball = new THREE.Mesh(ballGeo, ballMat);
        ball.name = "football_mesh";
        ball.position.y = 0.22;
        group.add(ball);

        // Black Pentagon Patches
        const patchMat = new THREE.MeshStandardMaterial({ color: 0x212121 });
        for (let i = 0; i < 6; i++) {
            const patchGeo = new THREE.CircleGeometry(0.06, 5);
            const patch = new THREE.Mesh(patchGeo, patchMat);
            patch.position.setFromSphericalCoords(0.221, (i * Math.PI / 3), (i * Math.PI / 4));
            patch.lookAt(0, 0.22, 0);
            group.add(patch);
        }

        return group;
    }

    static createTargetBoard() {
        const group = new THREE.Group();
        group.name = "target_board";

        // Wooden Stand Tripod
        const legMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.7 });
        for (let i = 0; i < 3; i++) {
            const legGeo = new THREE.CylinderGeometry(0.03, 0.04, 2.2, 12);
            const leg = new THREE.Mesh(legGeo, legMat);
            const angle = (i * Math.PI * 2 / 3);
            leg.position.set(Math.sin(angle) * 0.4, 0.9, Math.cos(angle) * 0.4);
            leg.rotation.z = Math.sin(angle) * -0.2;
            leg.rotation.x = Math.cos(angle) * 0.2;
            group.add(leg);
        }

        // Circular Ring Target Board (Backing disc)
        const boardBackGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 32);
        const boardBackMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.6 });
        const boardBack = new THREE.Mesh(boardBackGeo, boardBackMat);
        boardBack.name = "board_back";
        boardBack.rotation.x = Math.PI / 2;
        boardBack.position.y = 1.8;
        group.add(boardBack);

        // Concentric Point Rings
        const ringColors = [
            { r: 0.85, color: 0xFFFFFF, points: 2, z: 0.051 }, // Outer White (1-2 pts)
            { r: 0.68, color: 0x212121, points: 4, z: 0.052 }, // Black (3-4 pts)
            { r: 0.51, color: 0x29B6F6, points: 6, z: 0.053 }, // Blue (5-6 pts)
            { r: 0.34, color: 0xFF1744, points: 8, z: 0.054 }, // Red (7-8 pts)
            { r: 0.17, color: 0xFFC107, points: 10, z: 0.055 } // Yellow Bullseye (9-10 pts)
        ];

        ringColors.forEach(rc => {
            const ringGeo = new THREE.CircleGeometry(rc.r, 32);
            const ringMat = new THREE.MeshStandardMaterial({ color: rc.color, side: THREE.DoubleSide });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.name = "target_ring";
            ring.position.set(0, 1.8, rc.z);
            ring.userData = { points: rc.points };
            group.add(ring);
        });

        // Center Bullseye Dot
        const bullseyeGeo = new THREE.CircleGeometry(0.07, 32);
        const bullseyeMat = new THREE.MeshStandardMaterial({ color: 0xFF9800 });
        const bullseye = new THREE.Mesh(bullseyeGeo, bullseyeMat);
        bullseye.name = "bullseye";
        bullseye.position.set(0, 1.8, 0.056);
        bullseye.userData = { points: 50, isBullseye: true };
        group.add(bullseye);

        return group;
    }

    static createBalloon(colorHex = 0xFF1744) {
        const group = new THREE.Group();
        group.name = "balloon_target";

        // Balloon Tear-drop mesh
        const balloonGeo = new THREE.SphereGeometry(0.25, 24, 24);
        balloonGeo.scale(1.0, 1.3, 1.0);
        const balloonMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            roughness: 0.2,
            metalness: 0.1,
            emissive: colorHex,
            emissiveIntensity: 0.15
        });
        const balloon = new THREE.Mesh(balloonGeo, balloonMat);
        balloon.name = "balloon_mesh";
        balloon.position.y = 0.3;
        group.add(balloon);

        // String hanging down
        const stringMat = new THREE.LineBasicMaterial({ color: 0xFFFFFF });
        const stringGeo = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(0, 0, 0),
            new THREE.Vector3(0, -0.6, 0)
        ]);
        const stringLine = new THREE.Line(stringGeo, stringMat);
        group.add(stringLine);

        return group;
    }

    static createRotatingWheel() {
        const group = new THREE.Group();
        group.name = "rotating_wheel_target";

        // Wooden Stand Tripod on ground
        const legMat = new THREE.MeshStandardMaterial({ color: 0x5D4037, roughness: 0.7 });
        for (let i = 0; i < 3; i++) {
            const legGeo = new THREE.CylinderGeometry(0.03, 0.04, 2.2, 12);
            const leg = new THREE.Mesh(legGeo, legMat);
            const angle = (i * Math.PI * 2 / 3);
            leg.position.set(Math.sin(angle) * 0.4, 0.9, Math.cos(angle) * 0.4);
            leg.rotation.z = Math.sin(angle) * -0.2;
            leg.rotation.x = Math.cos(angle) * 0.2;
            group.add(leg);
        }

        // Wheel Spinner subgroup centered at (0, 1.8, 0)
        const wheelSpinner = new THREE.Group();
        wheelSpinner.name = "wheel_spinner";
        wheelSpinner.position.set(0, 1.8, 0);

        // Circular Ring Target Board (Backing disc)
        const boardBackGeo = new THREE.CylinderGeometry(0.9, 0.9, 0.1, 32);
        const boardBackMat = new THREE.MeshStandardMaterial({ color: 0x3E2723, roughness: 0.6 });
        const boardBack = new THREE.Mesh(boardBackGeo, boardBackMat);
        boardBack.name = "board_back";
        boardBack.rotation.x = Math.PI / 2;
        wheelSpinner.add(boardBack);

        // Concentric Point Rings
        const ringColors = [
            { r: 0.85, color: 0xFFFFFF, points: 2, z: 0.051 },
            { r: 0.68, color: 0x212121, points: 4, z: 0.052 },
            { r: 0.51, color: 0x29B6F6, points: 6, z: 0.053 },
            { r: 0.34, color: 0xFF1744, points: 8, z: 0.054 },
            { r: 0.17, color: 0xFFC107, points: 10, z: 0.055 }
        ];

        ringColors.forEach(rc => {
            const ringGeo = new THREE.CircleGeometry(rc.r, 32);
            const ringMat = new THREE.MeshStandardMaterial({ color: rc.color, side: THREE.DoubleSide });
            const ring = new THREE.Mesh(ringGeo, ringMat);
            ring.name = "target_ring";
            ring.position.set(0, 0, rc.z);
            ring.userData = { points: rc.points };
            wheelSpinner.add(ring);
        });

        // Center Bullseye Dot
        const bullseyeGeo = new THREE.CircleGeometry(0.07, 32);
        const bullseyeMat = new THREE.MeshStandardMaterial({ color: 0xFF9800 });
        const bullseye = new THREE.Mesh(bullseyeGeo, bullseyeMat);
        bullseye.name = "bullseye";
        bullseye.position.set(0, 0, 0.056);
        bullseye.userData = { points: 50, isBullseye: true };
        wheelSpinner.add(bullseye);

        // Attached apples around perimeter
        for (let i = 0; i < 4; i++) {
            const apple = TargetFactory.createApple();
            apple.name = "wheel_apple";
            const angle = (i * Math.PI / 2);
            apple.position.set(Math.cos(angle) * 0.6, Math.sin(angle) * 0.6, 0.1);
            apple.scale.set(0.7, 0.7, 0.7);
            wheelSpinner.add(apple);
        }

        group.add(wheelSpinner);
        return group;
    }

    static createBossTarget() {
        const group = new THREE.Group();
        group.name = "boss_target";

        const baseBoard = TargetFactory.createTargetBoard();
        baseBoard.scale.set(1.4, 1.4, 1.4);
        group.add(baseBoard);

        // Golden Glowing Crown on top of board
        const crownGeo = new THREE.ConeGeometry(0.4, 0.3, 5);
        const crownMat = new THREE.MeshStandardMaterial({ color: 0xFFD700, metalness: 0.9, roughness: 0.1 });
        const crown = new THREE.Mesh(crownGeo, crownMat);
        crown.position.set(0, 3.2, 0);
        group.add(crown);

        return group;
    }

    static createBarrelStand() {
        const barrelGeo = new THREE.CylinderGeometry(0.3, 0.32, 0.8, 16);
        const barrelMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.8 });
        const barrel = new THREE.Mesh(barrelGeo, barrelMat);
        barrel.position.y = -0.4;
        return barrel;
    }

    static getTargetCenterWorldPosition(targetGroup) {
        const worldPos = new THREE.Vector3();
        const centerObj = targetGroup.getObjectByName('bullseye') || 
                          targetGroup.getObjectByName('bottle_mesh') || 
                          targetGroup.getObjectByName('apple_mesh') || 
                          targetGroup.getObjectByName('football_mesh') || 
                          targetGroup.getObjectByName('balloon_mesh') ||
                          targetGroup.getObjectByName('board_back');
        
        if (centerObj) {
            centerObj.getWorldPosition(worldPos);
        } else {
            targetGroup.getWorldPosition(worldPos);
        }
        return worldPos;
    }
}

/* Particle Effects Manager for Shatters & Pops */
class ParticleSystem {
    constructor(scene) {
        this.scene = scene;
        this.particles = [];
    }

    spawnShatter(pos, colorHex = 0x00E676, count = 16) {
        for (let i = 0; i < count; i++) {
            const geo = new THREE.TetrahedronGeometry(0.04 + Math.random() * 0.04);
            const mat = new THREE.MeshStandardMaterial({ 
                color: colorHex, 
                transparent: true, 
                opacity: 0.9,
                roughness: 0.1 
            });
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.copy(pos);
            mesh.position.add(new THREE.Vector3(
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2,
                (Math.random() - 0.5) * 0.2
            ));

            const velocity = new THREE.Vector3(
                (Math.random() - 0.5) * 4.0,
                Math.random() * 4.0 + 1.0,
                (Math.random() - 0.5) * 4.0
            );

            this.scene.add(mesh);
            this.particles.push({ mesh, velocity, life: 1.0 });
        }
    }

    update(delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const p = this.particles[i];
            p.life -= delta * 1.5;
            p.velocity.y -= 9.8 * delta; // Gravity
            p.mesh.position.addScaledVector(p.velocity, delta);
            p.mesh.rotation.x += delta * 5.0;
            p.mesh.rotation.y += delta * 5.0;
            p.mesh.material.opacity = p.life;

            if (p.life <= 0) {
                this.scene.remove(p.mesh);
                p.mesh.geometry.dispose();
                p.mesh.material.dispose();
                this.particles.splice(i, 1);
            }
        }
    }
}

window.TargetFactory = TargetFactory;
window.ParticleSystem = ParticleSystem;
