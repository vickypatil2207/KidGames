/* 3D Scene Renderer & Road Tiling System */
class GameRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 300);
        
        this.renderer = new THREE.WebGLRenderer({
            canvas: this.canvas,
            antialias: true,
            alpha: false
        });

        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

        // Sky & Fog Settings
        this.scene.background = new THREE.Color(0x0f172a); // Deep blue night/twilight horizon
        this.scene.fog = new THREE.FogExp2(0x0f172a, 0.012);

        // Road Segments Recycling Pool
        this.roadTileLength = 40;
        this.numRoadTiles = 7;
        this.roadTiles = [];

        this.initLighting();
        this.initCamera();
        this.createEnvironment();

        window.addEventListener('resize', () => this.onWindowResize());
    }

    initCamera() {
        // Camera setup behind player looking down 3-lane perspective
        this.camera.position.set(0, 4.5, 8.5);
        this.camera.rotation.x = -0.22;
    }

    initLighting() {
        // Ambient Light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.65);
        this.scene.add(ambientLight);

        // Directional Sun / Street Spotlight with Shadows
        const dirLight = new THREE.DirectionalLight(0xfffaed, 0.85);
        dirLight.position.set(15, 30, -10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 100;
        dirLight.shadow.camera.left = -15;
        dirLight.shadow.camera.right = 15;
        dirLight.shadow.camera.top = 30;
        dirLight.shadow.camera.bottom = -10;
        this.scene.add(dirLight);

        // Warm City Horizon Fill Light
        const fillLight = new THREE.DirectionalLight(0x00e5ff, 0.35);
        fillLight.position.set(-15, 10, 10);
        this.scene.add(fillLight);
    }

    // Create Initial Endless 3-Lane Road Tiles
    createEnvironment() {
        for (let i = 0; i < this.numRoadTiles; i++) {
            const tile = this.createRoadTile();
            tile.position.z = -i * this.roadTileLength;
            this.scene.add(tile);
            this.roadTiles.push(tile);
        }
    }

    // Single Road Segment Tile (3 lanes, Sidewalks, Streetlamps, Trees)
    createRoadTile() {
        const tileGroup = new THREE.Group();

        // Asphalt Road Surface
        const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
        const road = new THREE.Mesh(new THREE.PlaneGeometry(12, this.roadTileLength), roadMat);
        road.rotation.x = -Math.PI / 2;
        road.receiveShadow = true;
        tileGroup.add(road);

        // Lane Dashed Dividers
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        [-1.75, 1.75].forEach(x => {
            for (let z = -this.roadTileLength / 2 + 2; z < this.roadTileLength / 2; z += 5) {
                const line = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 2.5), lineMat);
                line.rotation.x = -Math.PI / 2;
                line.position.set(x, 0.02, z);
                tileGroup.add(line);
            }
        });

        // Sidewalk Curbs
        const curbMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 });
        [-6.5, 6.5].forEach(x => {
            const curb = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, this.roadTileLength), curbMat);
            curb.position.set(x, 0.2, 0);
            curb.receiveShadow = true;
            tileGroup.add(curb);
        });

        // Street Lamps & Decorative Palm Trees along curbs
        const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
        const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const palmLeavesMat = new THREE.MeshStandardMaterial({ color: 0x15803d });

        [-7.8, 7.8].forEach(x => {
            // Streetlamp
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 6.0), lampMat);
            pole.position.set(x, 3.0, -10);
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), lampGlowMat);
            bulb.position.set(x > 0 ? x - 0.6 : x + 0.6, 6.0, -10);
            tileGroup.add(pole, bulb);

            // Palm Tree
            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 5.0, 8), palmTrunkMat);
            trunk.position.set(x > 0 ? x + 1.2 : x - 1.2, 2.5, 10);
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.2, 6), palmLeavesMat);
            leaves.position.set(x > 0 ? x + 1.2 : x - 1.2, 5.2, 10);
            tileGroup.add(trunk, leaves);
        });

        return tileGroup;
    }

    // Scroll & Recycle Road Tiles infinitely
    updateRoad(speed, deltaTime) {
        this.roadTiles.forEach(tile => {
            tile.position.z += speed * deltaTime;
        });

        // Recycle tiles that passed behind camera
        const firstTile = this.roadTiles[0];
        if (firstTile.position.z > 15) {
            const lastTile = this.roadTiles[this.roadTiles.length - 1];
            firstTile.position.z = lastTile.position.z - this.roadTileLength;
            this.roadTiles.push(this.roadTiles.shift());
        }
    }

    render(playerMesh) {
        // Camera smoothly follows player lateral X movements
        if (playerMesh) {
            this.camera.position.x += (playerMesh.position.x * 0.35 - this.camera.position.x) * 0.1;
        }
        this.renderer.render(this.scene, this.camera);
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
