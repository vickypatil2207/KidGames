/* 3D Player Character Manager & Physics */
class Player {
    constructor() {
        this.mesh = new THREE.Group();
        this.characterId = 'mickey';

        // Physics State
        this.currentLane = 0; // -1: Left, 0: Center, 1: Right
        this.laneWidth = 3.5;
        this.targetX = 0;
        this.y = 0;
        this.velocityY = 0;
        this.gravity = -35;
        this.jumpImpulse = 13.5;
        this.isGrounded = true;

        // Slide State
        this.isSliding = false;
        this.slideTimer = 0;
        this.slideDuration = 800; // ms

        // Power-up States
        this.hasShield = false;
        this.shieldMesh = null;
        this.hasMagnet = false;
        this.hasJetpack = false;
        this.hasMultiplier = false;
        this.jetpackTimer = 0;
        this.jetpackTargetY = 6.5;

        // Running Leg Animation Angle
        this.animTime = 0;
        this.bodyGroup = null;

        this.buildCharacterMesh('mickey');
    }

    // Build 3D Mesh based on Selected Character ID
    buildCharacterMesh(charId) {
        this.characterId = charId;
        // Remove existing meshes
        while (this.mesh.children.length > 0) {
            this.mesh.remove(this.mesh.children[0]);
        }

        this.bodyGroup = new THREE.Group();
        this.mesh.add(this.bodyGroup);

        switch (charId) {
            case 'mickey':
                this.buildMickey();
                break;
            case 'panda':
                this.buildPanda();
                break;
            case 'pikachu':
                this.buildPikachu();
                break;
            case 'doraemon':
                this.buildDoraemon();
                break;
            case 'masha':
                this.buildMasha();
                break;
            case 'singham':
                this.buildSingham();
                break;
            case 'bheem':
                this.buildBheem();
                break;
            default:
                this.buildMickey();
        }

        // Attach Shield Bubble Mesh Container
        const shieldGeo = new THREE.SphereGeometry(1.6, 20, 20);
        const shieldMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            transparent: true,
            opacity: 0.45,
            emissive: 0x00e5ff,
            emissiveIntensity: 0.4
        });
        this.shieldMesh = new THREE.Mesh(shieldGeo, shieldMat);
        this.shieldMesh.position.y = 1.2;
        this.shieldMesh.visible = false;
        this.mesh.add(this.shieldMesh);
    }

    // --- CHARACTER MODEL BUILDERS ---

    // 1. Mickey Mouse
    buildMickey() {
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.5 });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), blackMat);
        head.position.y = 1.8;

        // Ears
        const earGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.08, 16);
        earGeo.rotateX(Math.PI / 2);
        const earL = new THREE.Mesh(earGeo, blackMat);
        earL.position.set(-0.65, 2.3, 0);
        const earR = new THREE.Mesh(earGeo, blackMat);
        earR.position.set(0.65, 2.3, 0);

        // Body & Red Shorts
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.8, 12), blackMat);
        body.position.y = 1.0;

        const shorts = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.45, 12), redMat);
        shorts.position.y = 0.8;

        // Yellow Shoes
        const shoeGeo = new THREE.BoxGeometry(0.35, 0.3, 0.7);
        const shoeL = new THREE.Mesh(shoeGeo, yellowMat);
        shoeL.position.set(-0.3, 0.15, 0.1);
        shoeL.name = "legL";

        const shoeR = new THREE.Mesh(shoeGeo, yellowMat);
        shoeR.position.set(0.3, 0.15, 0.1);
        shoeR.name = "legR";

        this.bodyGroup.add(head, earL, earR, body, shorts, shoeL, shoeR);
    }

    // 2. Panda (Kung Fu Style Cute Panda)
    buildPanda() {
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 16), whiteMat);
        head.position.y = 1.75;

        // Black Eye Patches & Ears
        const earGeo = new THREE.SphereGeometry(0.25, 12, 12);
        const earL = new THREE.Mesh(earGeo, blackMat);
        earL.position.set(-0.6, 2.3, 0);
        const earR = new THREE.Mesh(earGeo, blackMat);
        earR.position.set(0.6, 2.3, 0);

        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), blackMat);
        eyeL.position.set(-0.25, 1.85, -0.65);
        const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), blackMat);
        eyeR.position.set(0.25, 1.85, -0.65);

        // Chubby Body
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), whiteMat);
        body.position.y = 0.9;
        body.scale.set(1.1, 1.0, 1.0);

        // Black Limbs
        const legGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.6, 10);
        const legL = new THREE.Mesh(legGeo, blackMat);
        legL.position.set(-0.35, 0.3, 0);
        legL.name = "legL";

        const legR = new THREE.Mesh(legGeo, blackMat);
        legR.position.set(0.35, 0.3, 0);
        legR.name = "legR";

        this.bodyGroup.add(head, earL, earR, eyeL, eyeR, body, legL, legR);
    }

    // 3. Pikachu
    buildPikachu() {
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), yellowMat);
        head.position.y = 1.7;

        // Ears (Pointed with black tips)
        const earL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.9, 10), yellowMat);
        earL.position.set(-0.5, 2.4, 0);
        earL.rotation.z = -0.4;

        const earR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.9, 10), yellowMat);
        earR.position.set(0.5, 2.4, 0);
        earR.rotation.z = 0.4;

        const tipL = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), blackMat);
        tipL.position.set(-0.65, 2.7, 0);

        const tipR = new THREE.Mesh(new THREE.ConeGeometry(0.12, 0.3, 8), blackMat);
        tipR.position.set(0.65, 2.7, 0);

        // Rosy Cheeks
        const cheekL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), redMat);
        cheekL.position.set(-0.45, 1.6, -0.5);
        const cheekR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), redMat);
        cheekR.position.set(0.45, 1.6, -0.5);

        // Body
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.8, 12), yellowMat);
        body.position.y = 0.9;

        // Legs
        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.5), yellowMat);
        legL.position.set(-0.3, 0.15, 0); legL.name = "legL";
        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.5), yellowMat);
        legR.position.set(0.3, 0.15, 0); legR.name = "legR";

        this.bodyGroup.add(head, earL, earR, tipL, tipR, cheekL, cheekR, body, legL, legR);
    }

    // 4. Doraemon
    buildDoraemon() {
        const blueMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.4 });
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 });

        // Round Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 16), blueMat);
        head.position.y = 1.75;

        // White Face & Red Nose
        const face = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), whiteMat);
        face.position.set(0, 1.65, -0.15);
        face.scale.set(0.9, 0.9, 0.9);

        const nose = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), redMat);
        nose.position.set(0, 1.8, -0.75);

        // Body & White Pocket Belly
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), blueMat);
        body.position.y = 0.85;

        const belly = new THREE.Mesh(new THREE.SphereGeometry(0.5, 16, 16), whiteMat);
        belly.position.set(0, 0.85, -0.2);

        // Collar & Bell
        const collar = new THREE.Mesh(new THREE.TorusGeometry(0.55, 0.08, 8, 16), redMat);
        collar.rotation.x = Math.PI / 2;
        collar.position.y = 1.25;

        const bell = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), goldMat);
        bell.position.set(0, 1.15, -0.55);

        // White Feet
        const feetL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.5), whiteMat);
        feetL.position.set(-0.3, 0.15, 0); feetL.name = "legL";
        const feetR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.25, 0.5), whiteMat);
        feetR.position.set(0.3, 0.15, 0); feetR.name = "legR";

        this.bodyGroup.add(head, face, nose, body, belly, collar, bell, feetL, feetR);
    }

    // 5. Masha
    buildMasha() {
        const pinkMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5 });
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 }); // Golden blonde hair/skin
        const faceMat = new THREE.MeshStandardMaterial({ color: 0xfed7aa, roughness: 0.5 });

        // Pink Hood & Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), pinkMat);
        head.position.y = 1.7;

        const face = new THREE.Mesh(new THREE.SphereGeometry(0.52, 16, 16), faceMat);
        face.position.set(0, 1.65, -0.15);

        // Hair Fringe
        const hair = new THREE.Mesh(new THREE.BoxGeometry(0.5, 0.15, 0.3), skinMat);
        hair.position.set(0, 2.05, -0.4);

        // Pink Dress Body
        const dress = new THREE.Mesh(new THREE.ConeGeometry(0.6, 1.0, 12), pinkMat);
        dress.position.y = 0.8;

        // Shoes
        const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.4), pinkMat);
        shoeL.position.set(-0.25, 0.1, 0); shoeL.name = "legL";
        const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.4), pinkMat);
        shoeR.position.set(0.25, 0.1, 0); shoeR.name = "legR";

        this.bodyGroup.add(head, face, hair, dress, shoeL, shoeR);
    }

    // 6. Little Singham
    buildSingham() {
        const khakiMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.5 }); // Khaki police uniform
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xfbbf24, roughness: 0.5 });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.2 }); // Sunglasses & boots
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 });

        // Head & Sunglasses
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.65, 16, 16), skinMat);
        head.position.y = 1.75;

        const glasses = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.25, 0.3), blackMat);
        glasses.position.set(0, 1.8, -0.5);

        // Uniform Shirt & Pants
        const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.6), khakiMat);
        shirt.position.y = 1.0;

        // Police Badge
        const badge = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), goldMat);
        badge.position.set(-0.25, 1.15, -0.32);

        // Boots
        const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.5), blackMat);
        bootL.position.set(-0.28, 0.15, 0); bootL.name = "legL";
        const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.3, 0.5), blackMat);
        bootR.position.set(0.28, 0.15, 0); bootR.name = "legR";

        this.bodyGroup.add(head, glasses, shirt, badge, bootL, bootR);
    }

    // 7. Chhota Bheem
    buildBheem() {
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.5 }); // Golden tan skin
        const saffronMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.4 }); // Saffron Dhoti
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 });

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.68, 16, 16), skinMat);
        head.position.y = 1.75;

        // Muscular Chest Body
        const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.7, 12), skinMat);
        chest.position.y = 1.05;

        // Saffron Dhoti
        const dhoti = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.55, 0.5, 12), saffronMat);
        dhoti.position.y = 0.55;

        // Golden Wristbands
        const wristL = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 8, 12), goldMat);
        wristL.position.set(-0.55, 1.0, 0);
        const wristR = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 8, 12), goldMat);
        wristR.position.set(0.55, 1.0, 0);

        // Legs
        const legL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.4), skinMat);
        legL.position.set(-0.25, 0.15, 0); legL.name = "legL";
        const legR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.3, 0.4), skinMat);
        legR.position.set(0.25, 0.15, 0); legR.name = "legR";

        this.bodyGroup.add(head, chest, dhoti, wristL, wristR, legL, legR);
    }

    // --- PLAYER ACTIONS & PHYSICS ---

    moveLeft() {
        if (this.currentLane > -1) {
            this.currentLane--;
            this.targetX = this.currentLane * this.laneWidth;
            window.audioManager.playSlide();
        }
    }

    moveRight() {
        if (this.currentLane < 1) {
            this.currentLane++;
            this.targetX = this.currentLane * this.laneWidth;
            window.audioManager.playSlide();
        }
    }

    jump() {
        if (this.isGrounded && !this.isSliding) {
            this.velocityY = this.jumpImpulse;
            this.isGrounded = false;
            window.audioManager.playJump();
        }
    }

    slide() {
        if (!this.isSliding && this.isGrounded) {
            this.isSliding = true;
            this.slideTimer = Date.now();
            this.bodyGroup.scale.set(1.0, 0.45, 1.2); // Duck height down!
            this.bodyGroup.position.y = -0.3;
            window.audioManager.playSlide();
        }
    }

    update(deltaTime) {
        // 1. Horizontal Smooth Lane Interpolation (Lerp)
        this.mesh.position.x += (this.targetX - this.mesh.position.x) * 15 * deltaTime;

        // 2. Vertical Jump / Jetpack Physics
        if (this.hasJetpack) {
            // Smoothly hover up into Jetpack air lane
            this.mesh.position.y += (this.jetpackTargetY - this.mesh.position.y) * 8 * deltaTime;
            this.isGrounded = false;
        } else {
            // Standard Gravity Jump Physics
            if (!this.isGrounded) {
                this.velocityY += this.gravity * deltaTime;
                this.mesh.position.y += this.velocityY * deltaTime;

                if (this.mesh.position.y <= 0) {
                    this.mesh.position.y = 0;
                    this.velocityY = 0;
                    this.isGrounded = true;
                }
            }
        }

        // 3. Slide Timer Check
        if (this.isSliding) {
            if (Date.now() - this.slideTimer > this.slideDuration) {
                this.isSliding = false;
                this.bodyGroup.scale.set(1.0, 1.0, 1.0); // Reset height
                this.bodyGroup.position.y = 0;
            }
        }

        // 4. Running Leg Swing Animation
        if (this.isGrounded && !this.isSliding) {
            this.animTime += deltaTime * 16;
            const legL = this.bodyGroup.getObjectByName("legL");
            const legR = this.bodyGroup.getObjectByName("legR");
            if (legL && legR) {
                legL.position.z = Math.sin(this.animTime) * 0.3;
                legR.position.z = -Math.sin(this.animTime) * 0.3;
            }
        }

        // 5. Shield Mesh Glow Pulse
        if (this.hasShield && this.shieldMesh) {
            this.shieldMesh.visible = true;
            this.shieldMesh.rotation.y += deltaTime * 2;
        } else if (this.shieldMesh) {
            this.shieldMesh.visible = false;
        }
    }
}
