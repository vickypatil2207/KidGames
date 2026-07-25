/* ==========================================================================
   Three.js 3D Archery Environment & Camera Manager
   ========================================================================== */

class GameRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 500);
        this.renderer = new THREE.WebGLRenderer({ canvas: this.canvas, antialias: true, alpha: false });
        
        this.particles = new ParticleSystem(this.scene);
        this.bowGroup = null;
        this.arrowInHand = null;
        this.aimLine = null;
        this.activeArrowsInFlight = [];

        // Camera presets
        this.defaultCamPos = new THREE.Vector3(0, 1.7, 0);
        this.camLookAt = new THREE.Vector3(0, 1.7, -30);
        this.arrowCamMode = false;
        this.trackedArrow = null;

        this.initRenderer();
        this.setupLights();
        this.createEnvironment();
        this.setupAimLine();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    initRenderer() {
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.scene.background = new THREE.Color(0x87CEEB); // Sky Blue
        this.scene.fog = new THREE.FogExp2(0x87CEEB, 0.005);

        this.camera.position.copy(this.defaultCamPos);
        this.camera.lookAt(this.camLookAt);
    }

    setupLights() {
        // Hemisphere Ambient Light
        const hemiLight = new THREE.HemisphereLight(0xFFFFFF, 0x388E3C, 0.7);
        this.scene.add(hemiLight);

        // Directional Sun Light with Shadows
        const sun = new THREE.DirectionalLight(0xFFF59D, 1.2);
        sun.position.set(20, 40, 20);
        sun.castShadow = true;
        sun.shadow.mapSize.width = 2048;
        sun.shadow.mapSize.height = 2048;
        sun.shadow.camera.near = 0.5;
        sun.shadow.camera.far = 100;
        sun.shadow.camera.left = -30;
        sun.shadow.camera.right = 30;
        sun.shadow.camera.top = 30;
        sun.shadow.camera.bottom = -30;
        this.scene.add(sun);
    }

    createEnvironment() {
        // Ground Grass Field
        const groundGeo = new THREE.PlaneGeometry(200, 200);
        const groundMat = new THREE.MeshStandardMaterial({ 
            color: 0x4CAF50, 
            roughness: 0.8,
            metalness: 0.1 
        });
        const ground = new THREE.Mesh(groundGeo, groundMat);
        ground.rotation.x = -Math.PI / 2;
        ground.receiveShadow = true;
        this.scene.add(ground);

        // Target Range Lane Strip
        const laneGeo = new THREE.PlaneGeometry(12, 100);
        const laneMat = new THREE.MeshStandardMaterial({ color: 0x66BB6A, roughness: 0.9 });
        const lane = new THREE.Mesh(laneGeo, laneMat);
        lane.rotation.x = -Math.PI / 2;
        lane.position.set(0, 0.01, -45);
        lane.receiveShadow = true;
        this.scene.add(lane);

        // Distance Markers (15m, 20m, 30m, 40m poles)
        [15, 20, 25, 30, 35, 40].forEach(dist => {
            const poleGeo = new THREE.CylinderGeometry(0.04, 0.04, 1.0, 12);
            const poleMat = new THREE.MeshStandardMaterial({ color: 0xFFC107 });
            
            const poleL = new THREE.Mesh(poleGeo, poleMat);
            poleL.position.set(-6, 0.5, -dist);
            this.scene.add(poleL);

            const poleR = new THREE.Mesh(poleGeo, poleMat);
            poleR.position.set(6, 0.5, -dist);
            this.scene.add(poleR);
        });

        // 3D Pine Trees on Field Boundaries
        for (let i = 0; i < 24; i++) {
            const tree = this.createPineTree();
            const side = (i % 2 === 0) ? 1 : -1;
            const xPos = side * (12 + Math.random() * 30);
            const zPos = -Math.random() * 90;
            tree.position.set(xPos, 0, zPos);
            this.scene.add(tree);
        }

        // Sky Clouds
        for (let i = 0; i < 10; i++) {
            const cloud = this.createCloud();
            cloud.position.set((Math.random() - 0.5) * 120, 25 + Math.random() * 15, -Math.random() * 100);
            this.scene.add(cloud);
        }
    }

    createPineTree() {
        const group = new THREE.Group();
        const trunkGeo = new THREE.CylinderGeometry(0.2, 0.35, 2.5, 8);
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x4E342E, roughness: 0.9 });
        const trunk = new THREE.Mesh(trunkGeo, trunkMat);
        trunk.position.y = 1.25;
        trunk.castShadow = true;
        group.add(trunk);

        const leafMat = new THREE.MeshStandardMaterial({ color: 0x2E7D32, roughness: 0.6 });
        for (let i = 0; i < 3; i++) {
            const coneGeo = new THREE.ConeGeometry(1.6 - (i * 0.35), 2.2, 8);
            const cone = new THREE.Mesh(coneGeo, leafMat);
            cone.position.y = 2.5 + (i * 1.3);
            cone.castShadow = true;
            group.add(cone);
        }

        return group;
    }

    createCloud() {
        const group = new THREE.Group();
        const mat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 1.0, opacity: 0.95, transparent: true });
        for (let i = 0; i < 5; i++) {
            const geo = new THREE.SphereGeometry(3 + Math.random() * 2, 12, 12);
            const mesh = new THREE.Mesh(geo, mat);
            mesh.position.set((Math.random() - 0.5) * 5, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 4);
            group.add(mesh);
        }
        return group;
    }

    setupAimLine() {
        const mat = new THREE.LineDashedMaterial({
            color: 0x00E5FF,
            dashSize: 0.3,
            gapSize: 0.15,
            linewidth: 3
        });
        const geo = new THREE.BufferGeometry();
        this.aimLine = new THREE.Line(geo, mat);
        this.aimLine.visible = false;
        this.scene.add(this.aimLine);
    }

    updateAimLinePoints(points) {
        if (!points || points.length === 0) {
            this.aimLine.visible = false;
            return;
        }
        this.aimLine.geometry.dispose();
        this.aimLine.geometry = new THREE.BufferGeometry().setFromPoints(points);
        this.aimLine.computeLineDistances();
        this.aimLine.visible = true;
    }

    setPlayerBow(bowId) {
        if (this.bowGroup) {
            this.scene.remove(this.bowGroup);
        }
        this.bowGroup = BowFactory.createBowMesh(bowId);
        // Position bow in player view hand
        this.bowGroup.position.set(0.25, 1.45, -0.6);
        this.bowGroup.rotation.y = Math.PI;
        this.scene.add(this.bowGroup);

        this.setArrowInHand(bowId);
    }

    setArrowInHand(bowId) {
        if (this.arrowInHand) {
            this.scene.remove(this.arrowInHand);
        }
        this.arrowInHand = BowFactory.createArrowMesh(bowId);
        this.arrowInHand.position.set(0.25, 1.45, -0.6);
        this.scene.add(this.arrowInHand);
    }

    updateBowDraw(drawFactor) {
        if (!this.bowGroup) return;
        
        // Pull bowstring nock point back
        const stringLine = this.bowGroup.userData.stringLine;
        if (stringLine) {
            const pullZ = drawFactor * 0.45;
            const positions = stringLine.geometry.attributes.position;
            positions.setXYZ(1, 0, 0, pullZ); // Middle nock point flexes back
            positions.needsUpdate = true;
        }

        // Draw arrow back together with string
        if (this.arrowInHand) {
            this.arrowInHand.position.z = -0.6 + (drawFactor * 0.45);
        }
    }

    startArrowCamera(arrowMesh) {
        this.arrowCamMode = true;
        this.trackedArrow = arrowMesh;
    }

    resetCamera() {
        this.arrowCamMode = false;
        this.trackedArrow = null;
        this.camera.position.copy(this.defaultCamPos);
        this.camera.lookAt(this.camLookAt);
    }

    update(delta) {
        this.particles.update(delta);

        // Arrow Slow-Mo Camera tracking mode
        if (this.arrowCamMode && this.trackedArrow) {
            const arrowPos = this.trackedArrow.position;
            // Position camera slightly behind and above arrow
            const camTarget = arrowPos.clone().add(new THREE.Vector3(0, 0.4, 1.2));
            this.camera.position.lerp(camTarget, delta * 8.0);
            this.camera.lookAt(arrowPos);
        }
    }

    render() {
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}

window.GameRenderer = GameRenderer;
