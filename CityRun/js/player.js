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

    // Helper to create a limb group with pivot at top
    static createLimbGroup(name, topX, topY, topZ, limbMesh, handFootMesh) {
        const group = new THREE.Group();
        group.name = name;
        group.position.set(topX, topY, topZ);
        if (limbMesh) group.add(limbMesh);
        if (handFootMesh) group.add(handFootMesh);
        return group;
    }

    // 1. Mickey Mouse
    buildMickey() {
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e1e1e, roughness: 0.5 });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.4 });
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 });

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
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.5, 0.7, 12), blackMat);
        body.position.y = 1.05;

        const shorts = new THREE.Mesh(new THREE.CylinderGeometry(0.52, 0.52, 0.4, 12), redMat);
        shorts.position.y = 0.75;

        // White Buttons on Shorts
        const bL = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), whiteMat);
        bL.position.set(-0.2, 0.78, -0.48);
        const bR = new THREE.Mesh(new THREE.SphereGeometry(0.08, 8, 8), whiteMat);
        bR.position.set(0.2, 0.78, -0.48);

        // Left Arm & White Glove
        const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8), blackMat);
        armLMesh.position.y = -0.25;
        const gloveL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), whiteMat);
        gloveL.position.y = -0.52;
        const armL = Player.createLimbGroup("armL", -0.55, 1.25, 0, armLMesh, gloveL);

        // Right Arm & White Glove
        const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.5, 8), blackMat);
        armRMesh.position.y = -0.25;
        const gloveR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), whiteMat);
        gloveR.position.y = -0.52;
        const armR = Player.createLimbGroup("armR", 0.55, 1.25, 0, armRMesh, gloveR);

        // Left Leg & Yellow Shoe
        const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8), blackMat);
        legLMesh.position.y = -0.25;
        const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.6), yellowMat);
        shoeL.position.set(0, -0.52, -0.1);
        const legL = Player.createLimbGroup("legL", -0.28, 0.6, 0, legLMesh, shoeL);

        // Right Leg & Yellow Shoe
        const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.5, 8), blackMat);
        legRMesh.position.y = -0.25;
        const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.28, 0.6), yellowMat);
        shoeR.position.set(0, -0.52, -0.1);
        const legR = Player.createLimbGroup("legR", 0.28, 0.6, 0, legRMesh, shoeR);

        this.bodyGroup.add(head, earL, earR, body, shorts, bL, bR, armL, armR, legL, legR);
    }

    // 2. Panda (Kung Fu Style Cute Panda)
    buildPanda() {
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.6 });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.6 });

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.75, 16, 16), whiteMat);
        head.position.y = 1.75;

        // Black Eye Patches & Ears
        const earL = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), blackMat);
        earL.position.set(-0.6, 2.3, 0);
        const earR = new THREE.Mesh(new THREE.SphereGeometry(0.25, 12, 12), blackMat);
        earR.position.set(0.6, 2.3, 0);

        const eyeL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), blackMat);
        eyeL.position.set(-0.25, 1.85, -0.65);
        const eyeR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), blackMat);
        eyeR.position.set(0.25, 1.85, -0.65);

        // Chubby Body
        const body = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), whiteMat);
        body.position.y = 0.95;
        body.scale.set(1.1, 1.0, 1.0);

        // Black Arms & Paws
        const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.55, 10), blackMat);
        armLMesh.position.y = -0.28;
        const pawL = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), blackMat);
        pawL.position.y = -0.58;
        const armL = Player.createLimbGroup("armL", -0.65, 1.2, 0, armLMesh, pawL);

        const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.55, 10), blackMat);
        armRMesh.position.y = -0.28;
        const pawR = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), blackMat);
        pawR.position.y = -0.58;
        const armR = Player.createLimbGroup("armR", 0.65, 1.2, 0, armRMesh, pawR);

        // Black Legs & Feet
        const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 10), blackMat);
        legLMesh.position.y = -0.25;
        const footL = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.25, 0.5), blackMat);
        footL.position.set(0, -0.5, -0.1);
        const legL = Player.createLimbGroup("legL", -0.35, 0.55, 0, legLMesh, footL);

        const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.5, 10), blackMat);
        legRMesh.position.y = -0.25;
        const footR = new THREE.Mesh(new THREE.BoxGeometry(0.32, 0.25, 0.5), blackMat);
        footR.position.set(0, -0.5, -0.1);
        const legR = Player.createLimbGroup("legR", 0.35, 0.55, 0, legRMesh, footR);

        this.bodyGroup.add(head, earL, earR, eyeL, eyeR, body, armL, armR, legL, legR);
    }

    // 3. Pikachu
    buildPikachu() {
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444 });
        const brownMat = new THREE.MeshStandardMaterial({ color: 0x78350f });

        // Head
        const head = new THREE.Mesh(new THREE.SphereGeometry(0.7, 16, 16), yellowMat);
        head.position.y = 1.7;

        // Pointed Ears with Black Tips
        const earL = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.9, 10), yellowMat);
        earL.position.set(-0.5, 2.4, 0); earL.rotation.z = -0.4;
        const earR = new THREE.Mesh(new THREE.ConeGeometry(0.2, 0.9, 10), yellowMat);
        earR.position.set(0.5, 2.4, 0); earR.rotation.z = 0.4;

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
        const body = new THREE.Mesh(new THREE.CylinderGeometry(0.45, 0.55, 0.75, 12), yellowMat);
        body.position.y = 0.9;

        // Lightning Tail
        const tail = new THREE.Mesh(new THREE.BoxGeometry(0.25, 0.8, 0.1), yellowMat);
        tail.position.set(0, 1.0, 0.6);
        tail.rotation.x = -0.4;

        // Arms
        const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 8), yellowMat);
        armLMesh.position.y = -0.22;
        const handL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), yellowMat);
        handL.position.y = -0.45;
        const armL = Player.createLimbGroup("armL", -0.5, 1.15, 0, armLMesh, handL);

        const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 8), yellowMat);
        armRMesh.position.y = -0.22;
        const handR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), yellowMat);
        handR.position.y = -0.45;
        const armR = Player.createLimbGroup("armR", 0.5, 1.15, 0, armRMesh, handR);

        // Legs
        const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.4, 8), yellowMat);
        legLMesh.position.y = -0.2;
        const footL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.45), yellowMat);
        footL.position.set(0, -0.4, -0.08);
        const legL = Player.createLimbGroup("legL", -0.3, 0.5, 0, legLMesh, footL);

        const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.4, 8), yellowMat);
        legRMesh.position.y = -0.2;
        const footR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.45), yellowMat);
        footR.position.set(0, -0.4, -0.08);
        const legR = Player.createLimbGroup("legR", 0.3, 0.5, 0, legRMesh, footR);

        this.bodyGroup.add(head, earL, earR, tipL, tipR, cheekL, cheekR, body, tail, armL, armR, legL, legR);
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

        // Blue Arms & Round White Hands
        const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 8), blueMat);
        armLMesh.position.y = -0.22;
        const handL = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), whiteMat);
        handL.position.y = -0.45;
        const armL = Player.createLimbGroup("armL", -0.58, 1.1, 0, armLMesh, handL);

        const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 8), blueMat);
        armRMesh.position.y = -0.22;
        const handR = new THREE.Mesh(new THREE.SphereGeometry(0.18, 10, 10), whiteMat);
        handR.position.y = -0.45;
        const armR = Player.createLimbGroup("armR", 0.58, 1.1, 0, armRMesh, handR);

        // Blue Legs & White Feet
        const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 8), blueMat);
        legLMesh.position.y = -0.2;
        const feetL = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.5), whiteMat);
        feetL.position.set(0, -0.41, -0.08);
        const legL = Player.createLimbGroup("legL", -0.3, 0.45, 0, legLMesh, feetL);

        const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 8), blueMat);
        legRMesh.position.y = -0.2;
        const feetR = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.22, 0.5), whiteMat);
        feetR.position.set(0, -0.41, -0.08);
        const legR = Player.createLimbGroup("legR", 0.3, 0.45, 0, legRMesh, feetR);

        this.bodyGroup.add(head, face, nose, body, belly, collar, bell, armL, armR, legL, legR);
    }

    // 5. Masha
    buildMasha() {
        const pinkMat = new THREE.MeshStandardMaterial({ color: 0xec4899, roughness: 0.5 });
        const skinMat = new THREE.MeshStandardMaterial({ color: 0xfde047, roughness: 0.5 });
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
        const dress = new THREE.Mesh(new THREE.ConeGeometry(0.6, 0.9, 12), pinkMat);
        dress.position.y = 0.85;

        // Pink Sleeves & Skin Hands
        const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 8), pinkMat);
        armLMesh.position.y = -0.2;
        const handL = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), faceMat);
        handL.position.y = -0.42;
        const armL = Player.createLimbGroup("armL", -0.48, 1.15, 0, armLMesh, handL);

        const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.4, 8), pinkMat);
        armRMesh.position.y = -0.2;
        const handR = new THREE.Mesh(new THREE.SphereGeometry(0.12, 8, 8), faceMat);
        handR.position.y = -0.42;
        const armR = Player.createLimbGroup("armR", 0.48, 1.15, 0, armRMesh, handR);

        // Skin Legs & Pink Shoes
        const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8), faceMat);
        legLMesh.position.y = -0.2;
        const shoeL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.4), pinkMat);
        shoeL.position.set(0, -0.4, -0.06);
        const legL = Player.createLimbGroup("legL", -0.25, 0.45, 0, legLMesh, shoeL);

        const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.4, 8), faceMat);
        legRMesh.position.y = -0.2;
        const shoeR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.2, 0.4), pinkMat);
        shoeR.position.set(0, -0.4, -0.06);
        const legR = Player.createLimbGroup("legR", 0.25, 0.45, 0, legRMesh, shoeR);

        this.bodyGroup.add(head, face, hair, dress, armL, armR, legL, legR);
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

        // Uniform Shirt
        const shirt = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.7, 0.6), khakiMat);
        shirt.position.y = 1.05;

        // Police Badge
        const badge = new THREE.Mesh(new THREE.SphereGeometry(0.1, 8, 8), goldMat);
        badge.position.set(-0.25, 1.15, -0.32);

        // Khaki Sleeves & Tan Hands
        const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 8), khakiMat);
        armLMesh.position.y = -0.22;
        const handL = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), skinMat);
        handL.position.y = -0.45;
        const armL = Player.createLimbGroup("armL", -0.55, 1.2, 0, armLMesh, handL);

        const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.45, 8), khakiMat);
        armRMesh.position.y = -0.22;
        const handR = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), skinMat);
        handR.position.y = -0.45;
        const armR = Player.createLimbGroup("armR", 0.55, 1.2, 0, armRMesh, handR);

        // Khaki Legs & Black Boots
        const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 8), khakiMat);
        legLMesh.position.y = -0.22;
        const bootL = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.28, 0.5), blackMat);
        bootL.position.set(0, -0.45, -0.08);
        const legL = Player.createLimbGroup("legL", -0.28, 0.55, 0, legLMesh, bootL);

        const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 8), khakiMat);
        legRMesh.position.y = -0.22;
        const bootR = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.28, 0.5), blackMat);
        bootR.position.set(0, -0.45, -0.08);
        const legR = Player.createLimbGroup("legR", 0.28, 0.55, 0, legRMesh, bootR);

        this.bodyGroup.add(head, glasses, shirt, badge, armL, armR, legL, legR);
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
        const chest = new THREE.Mesh(new THREE.CylinderGeometry(0.55, 0.45, 0.65, 12), skinMat);
        chest.position.y = 1.05;

        // Saffron Dhoti
        const dhoti = new THREE.Mesh(new THREE.CylinderGeometry(0.48, 0.55, 0.4, 12), saffronMat);
        dhoti.position.y = 0.65;

        // Muscular Arms & Golden Wristbands
        const armLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 8), skinMat);
        armLMesh.position.y = -0.22;
        const wristL = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 8, 12), goldMat);
        wristL.position.y = -0.42;
        const armL = Player.createLimbGroup("armL", -0.55, 1.2, 0, armLMesh, wristL);

        const armRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.45, 8), skinMat);
        armRMesh.position.y = -0.22;
        const wristR = new THREE.Mesh(new THREE.TorusGeometry(0.15, 0.05, 8, 12), goldMat);
        wristR.position.y = -0.42;
        const armR = Player.createLimbGroup("armR", 0.55, 1.2, 0, armRMesh, wristR);

        // Tan Legs & Feet
        const legLMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.4, 8), skinMat);
        legLMesh.position.y = -0.2;
        const footL = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.45), skinMat);
        footL.position.set(0, -0.4, -0.08);
        const legL = Player.createLimbGroup("legL", -0.26, 0.5, 0, legLMesh, footL);

        const legRMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.14, 0.14, 0.4, 8), skinMat);
        legRMesh.position.y = -0.2;
        const footR = new THREE.Mesh(new THREE.BoxGeometry(0.28, 0.22, 0.45), skinMat);
        footR.position.set(0, -0.4, -0.08);
        const legR = Player.createLimbGroup("legR", 0.26, 0.5, 0, legRMesh, footR);

        this.bodyGroup.add(head, chest, dhoti, armL, armR, legL, legR);
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

    update(deltaTime, powerupTimers = {}) {
        // 1. Horizontal Smooth Lane Interpolation (Lerp)
        this.mesh.position.x += (this.targetX - this.mesh.position.x) * 15 * deltaTime;

        // 2. Vertical Jump / Jetpack Physics
        if (this.hasJetpack) {
            const remainingTime = (powerupTimers && powerupTimers.jetpack) ? powerupTimers.jetpack : 7000;
            if (remainingTime < 1500) {
                this.jetpackTargetY = Math.max(0, (remainingTime / 1500) * 6.5);
            } else {
                this.jetpackTargetY = 6.5;
            }
            this.mesh.position.y += (this.jetpackTargetY - this.mesh.position.y) * 6 * deltaTime;
            this.isGrounded = false;
        } else {
            this.jetpackTargetY = 6.5;
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

        // 4. Running Arm & Leg Swing Animation
        const legL = this.bodyGroup.getObjectByName("legL");
        const legR = this.bodyGroup.getObjectByName("legR");
        const armL = this.bodyGroup.getObjectByName("armL");
        const armR = this.bodyGroup.getObjectByName("armR");

        if (this.isGrounded && !this.isSliding) {
            this.animTime += deltaTime * 16;
            const swing = Math.sin(this.animTime) * 0.45;

            if (legL) legL.rotation.x = swing;
            if (legR) legR.rotation.x = -swing;
            if (armL) armL.rotation.x = -swing;
            if (armR) armR.rotation.x = swing;
        } else if (!this.isGrounded) {
            // Natural jumping pose
            if (legL) legL.rotation.x = -0.3;
            if (legR) legR.rotation.x = 0.35;
            if (armL) armL.rotation.x = -0.6;
            if (armR) armR.rotation.x = -0.6;
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
