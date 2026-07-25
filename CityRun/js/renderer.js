/* 3D Scene Renderer & Road Tiling System */
class GameRenderer {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 0.1, 350);
        
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
        this.scene.fog = new THREE.FogExp2(0x0f172a, 0.008);

        // Road Segments Recycling Pool
        this.roadTileLength = 40;
        this.numRoadTiles = 10;
        this.roadTiles = [];
        this.waterMeshes = [];
        this.animTime = 0;

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
        const dirLight = new THREE.DirectionalLight(0xfffaed, 0.9);
        dirLight.position.set(15, 30, -10);
        dirLight.castShadow = true;
        dirLight.shadow.mapSize.width = 1024;
        dirLight.shadow.mapSize.height = 1024;
        dirLight.shadow.camera.near = 0.5;
        dirLight.shadow.camera.far = 120;
        dirLight.shadow.camera.left = -20;
        dirLight.shadow.camera.right = 20;
        dirLight.shadow.camera.top = 30;
        dirLight.shadow.camera.bottom = -10;
        this.scene.add(dirLight);

        // Warm City Horizon Fill Light
        const fillLight = new THREE.DirectionalLight(0x00e5ff, 0.4);
        fillLight.position.set(-20, 12, 10);
        this.scene.add(fillLight);
    }

    // Create Initial Endless 3-Lane Road Tiles
    createEnvironment() {
        for (let i = 0; i < this.numRoadTiles; i++) {
            const tile = this.createRoadTile(i);
            tile.position.z = -i * this.roadTileLength;
            this.scene.add(tile);
            this.roadTiles.push(tile);
        }
    }

    // Single Road Segment Tile (3 lanes, Sabarmati River on Left, Garden/Buildings/Monuments on Right)
    createRoadTile(tileIndex = 0) {
        const tileGroup = new THREE.Group();

        // 1. Asphalt Road Surface
        const roadMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });
        const road = new THREE.Mesh(new THREE.PlaneGeometry(12, this.roadTileLength), roadMat);
        road.rotation.x = -Math.PI / 2;
        road.receiveShadow = true;
        tileGroup.add(road);

        // 2. Lane Dashed Dividers
        const lineMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        [-1.75, 1.75].forEach(x => {
            for (let z = -this.roadTileLength / 2 + 2; z < this.roadTileLength / 2; z += 5) {
                const line = new THREE.Mesh(new THREE.PlaneGeometry(0.2, 2.5), lineMat);
                line.rotation.x = -Math.PI / 2;
                line.position.set(x, 0.02, z);
                tileGroup.add(line);
            }
        });

        // 3. Sidewalk Curbs
        const curbMat = new THREE.MeshStandardMaterial({ color: 0x64748b, roughness: 0.7 });
        [-6.5, 6.5].forEach(x => {
            const curb = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.4, this.roadTileLength), curbMat);
            curb.position.set(x, 0.2, 0);
            curb.receiveShadow = true;
            tileGroup.add(curb);
        });

        // 4. Street Lamps & Decorative Palms along curbs
        const lampMat = new THREE.MeshStandardMaterial({ color: 0x334155, metalness: 0.6 });
        const lampGlowMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        const palmTrunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f });
        const palmLeavesMat = new THREE.MeshStandardMaterial({ color: 0x15803d });

        [-7.8, 7.8].forEach(x => {
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.15, 6.0), lampMat);
            pole.position.set(x, 3.0, -10);
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.35, 8, 8), lampGlowMat);
            bulb.position.set(x > 0 ? x - 0.6 : x + 0.6, 6.0, -10);
            tileGroup.add(pole, bulb);

            const trunk = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.35, 5.0, 8), palmTrunkMat);
            trunk.position.set(x > 0 ? x + 1.2 : x - 1.2, 2.5, 10);
            const leaves = new THREE.Mesh(new THREE.ConeGeometry(2.2, 1.2, 6), palmLeavesMat);
            leaves.position.set(x > 0 ? x + 1.2 : x - 1.2, 5.2, 10);
            tileGroup.add(trunk, leaves);
        });

        // 5. LEFT SIDE: Sabarmati Riverfront & Water
        this.buildSabarmatiRiver(tileGroup, tileIndex);

        // 6. RIGHT SIDE: Garden Promenade, City Buildings & Monuments
        this.buildRightGardenAndCity(tileGroup, tileIndex);

        return tileGroup;
    }

    // Build Sabarmati River on the Left Side
    buildSabarmatiRiver(tileGroup, tileIndex) {
        // Promenade Walkway (-7.25 to -11.5)
        const promMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.6 });
        const promenade = new THREE.Mesh(new THREE.BoxGeometry(4.25, 0.4, this.roadTileLength), promMat);
        promenade.position.set(-9.375, 0.2, 0);
        promenade.receiveShadow = true;
        tileGroup.add(promenade);

        // River Embankment Wall sloping down to river level
        const wallMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.8 });
        const bankWall = new THREE.Mesh(new THREE.BoxGeometry(0.6, 1.2, this.roadTileLength), wallMat);
        bankWall.position.set(-11.5, -0.3, 0);
        tileGroup.add(bankWall);

        // Riverfront Safety Railing along promenade edge (X = -11.4)
        const railMat = new THREE.MeshStandardMaterial({ color: 0x94a3b8, metalness: 0.8 });
        const railGlowMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });

        // Top Railing Bar
        const topRail = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.12, this.roadTileLength), railMat);
        topRail.position.set(-11.4, 0.9, 0);
        tileGroup.add(topRail);

        // LED Neon Strip under rail
        const neonStrip = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.08, this.roadTileLength), railGlowMat);
        neonStrip.position.set(-11.4, 0.8, 0);
        tileGroup.add(neonStrip);

        // Rail Posts
        for (let z = -this.roadTileLength / 2 + 2; z < this.roadTileLength / 2; z += 6) {
            const post = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 0.8), railMat);
            post.position.set(-11.4, 0.5, z);
            tileGroup.add(post);
        }

        // Sabarmati River Water Surface (X = -11.7 to -65)
        const waterMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            roughness: 0.15,
            metalness: 0.85,
            emissive: 0x0369a1,
            emissiveIntensity: 0.25
        });
        const water = new THREE.Mesh(new THREE.PlaneGeometry(55, this.roadTileLength), waterMat);
        water.rotation.x = -Math.PI / 2;
        water.position.set(-39.25, -0.55, 0);
        tileGroup.add(water);
        this.waterMeshes.push(water);

        // Floating Boat / Jetty on alternate tiles
        if (tileIndex % 2 === 0) {
            const boatGroup = new THREE.Group();
            const boatHull = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.8, 5), new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.3 }));
            boatHull.position.y = -0.3;
            const boatCanopy = new THREE.Mesh(new THREE.BoxGeometry(2.2, 1.2, 3), new THREE.MeshStandardMaterial({ color: 0xef4444 }));
            boatCanopy.position.set(0, 0.7, -0.5);
            boatGroup.add(boatHull, boatCanopy);
            boatGroup.position.set(-22 - (tileIndex % 3) * 5, 0, (tileIndex % 2 === 0 ? 5 : -10));
            tileGroup.add(boatGroup);
        }
    }

    // Build Garden, City Buildings & Monuments on the Right Side
    buildRightGardenAndCity(tileGroup, tileIndex) {
        // 1. Garden Lawn Plane (X = 7.25 to 17.5)
        const lawnMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 });
        const lawn = new THREE.Mesh(new THREE.PlaneGeometry(10.25, this.roadTileLength), lawnMat);
        lawn.rotation.x = -Math.PI / 2;
        lawn.position.set(12.375, 0.01, 0);
        lawn.receiveShadow = true;
        tileGroup.add(lawn);

        // Garden Paved Walkway (X = 11.5)
        const pathMat = new THREE.MeshStandardMaterial({ color: 0xd1d5db, roughness: 0.6 });
        const path = new THREE.Mesh(new THREE.PlaneGeometry(1.8, this.roadTileLength), pathMat);
        path.rotation.x = -Math.PI / 2;
        path.position.set(11.5, 0.02, 0);
        tileGroup.add(path);

        // Garden Benches
        const benchMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.6 });
        const benchLegMat = new THREE.MeshStandardMaterial({ color: 0x334155 });
        [-12, 12].forEach(z => {
            const bench = new THREE.Mesh(new THREE.BoxGeometry(0.8, 0.5, 2.2), benchMat);
            bench.position.set(13.2, 0.4, z);
            const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.2), benchLegMat);
            leg1.position.set(13.2, 0.2, z - 0.9);
            const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.9, 0.4, 0.2), benchLegMat);
            leg2.position.set(13.2, 0.2, z + 0.9);
            tileGroup.add(bench, leg1, leg2);
        });

        // Flower Beds Clusters
        const flowerColors = [0xf43f5e, 0xeab308, 0xa855f7, 0x06b6d4];
        [-15, -5, 5, 15].forEach((z, idx) => {
            const fMat = new THREE.MeshStandardMaterial({ color: flowerColors[idx % flowerColors.length] });
            for (let f = 0; f < 5; f++) {
                const flower = new THREE.Mesh(new THREE.SphereGeometry(0.35, 6, 6), fMat);
                flower.position.set(14.5 + (f % 2) * 0.6, 0.3, z + (f * 0.5));
                tileGroup.add(flower);
            }
        });

        // Garden Trees (Round Oaks & Conical Pines)
        const trunkMat = new THREE.MeshStandardMaterial({ color: 0x582f0e });
        const oakLeavesMat = new THREE.MeshStandardMaterial({ color: 0x166534, roughness: 0.8 });
        const pineLeavesMat = new THREE.MeshStandardMaterial({ color: 0x14532d, roughness: 0.7 });

        // Round Oak Tree
        const oakTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.45, 4.0), trunkMat);
        oakTrunk.position.set(15.8, 2.0, -8);
        const oakCrown = new THREE.Mesh(new THREE.SphereGeometry(2.5, 10, 10), oakLeavesMat);
        oakCrown.position.set(15.8, 4.8, -8);
        tileGroup.add(oakTrunk, oakCrown);

        // Conical Pine Tree
        const pineTrunk = new THREE.Mesh(new THREE.CylinderGeometry(0.25, 0.4, 3.5), trunkMat);
        pineTrunk.position.set(15.8, 1.75, 8);
        const pineCone = new THREE.Mesh(new THREE.ConeGeometry(2.2, 5.0, 8), pineLeavesMat);
        pineCone.position.set(15.8, 5.0, 8);
        tileGroup.add(pineTrunk, pineCone);

        // 2. City Ground Base (X = 17.5 to 65)
        const cityGroundMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.95 });
        const cityGround = new THREE.Mesh(new THREE.PlaneGeometry(48, this.roadTileLength), cityGroundMat);
        cityGround.rotation.x = -Math.PI / 2;
        cityGround.position.set(41.5, -0.02, 0);
        tileGroup.add(cityGround);

        // 3. Procedural Background Buildings & Monuments based on tileIndex
        const variant = tileIndex % 5;

        switch (variant) {
            case 0: // GIFT City Glass Skyscrapers
                this.addGlassSkyscraper(tileGroup, 24, 34, 6, 8, 0x0284c7, -8);
                this.addGlassSkyscraper(tileGroup, 34, 26, 7, 7, 0x0369a1, 10);
                break;
            case 1: // Akshardham Style Heritage Temple Facade
                this.addTempleMonument(tileGroup, 26, 0);
                this.addModernBuilding(tileGroup, 38, 22, 8, 8, 0x334155, 12);
                break;
            case 2: // Sidi Saiyyed Mosque Arch & Shaking Minarets
                this.addMinaretMonument(tileGroup, 25, -10);
                this.addMinaretMonument(tileGroup, 25, 10);
                this.addModernBuilding(tileGroup, 36, 28, 9, 9, 0x1e293b, 0);
                break;
            case 3: // Modern Commercial Corporate Plaza
                this.addModernBuilding(tileGroup, 24, 30, 8, 8, 0x0f172a, -10);
                this.addGlassSkyscraper(tileGroup, 35, 38, 8, 8, 0x0891b2, 8);
                break;
            case 4: // Heritage City Pavilions & Towers
                this.addHeritagePavilion(tileGroup, 25, -8);
                this.addGlassSkyscraper(tileGroup, 36, 32, 7, 7, 0x0284c7, 10);
                break;
        }
    }

    // Helper: Add Glass Skyscraper with LED stripes
    addGlassSkyscraper(tileGroup, x, height, width, depth, colorHex, z) {
        const mat = new THREE.MeshStandardMaterial({
            color: colorHex,
            metalness: 0.9,
            roughness: 0.15,
            emissive: colorHex,
            emissiveIntensity: 0.2
        });
        const building = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
        building.position.set(x, height / 2, z);
        tileGroup.add(building);

        // LED Neon Stripes
        const lineMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
        for (let y = 4; y < height; y += 6) {
            const band = new THREE.Mesh(new THREE.BoxGeometry(width + 0.3, 0.4, depth + 0.3), lineMat);
            band.position.set(x, y, z);
            tileGroup.add(band);
        }
    }

    // Helper: Add Modern Building with illuminated window grid
    addModernBuilding(tileGroup, x, height, width, depth, colorHex, z) {
        const mat = new THREE.MeshStandardMaterial({ color: colorHex, roughness: 0.5 });
        const b = new THREE.Mesh(new THREE.BoxGeometry(width, height, depth), mat);
        b.position.set(x, height / 2, z);
        tileGroup.add(b);

        // Illuminated Window Grid
        const winMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        for (let y = 3; y < height - 2; y += 4) {
            const winRow = new THREE.Mesh(new THREE.BoxGeometry(width + 0.1, 1.2, depth - 1.5), winMat);
            winRow.position.set(x, y, z);
            tileGroup.add(winRow);
        }
    }

    // Helper: Add Temple Monument
    addTempleMonument(tileGroup, x, z) {
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 });
        const base = new THREE.Mesh(new THREE.BoxGeometry(10, 8, 12), stoneMat);
        base.position.set(x, 4, z);
        const spire = new THREE.Mesh(new THREE.ConeGeometry(4, 10, 8), stoneMat);
        spire.position.set(x, 13, z);
        const finial = new THREE.Mesh(new THREE.ConeGeometry(0.5, 1.8, 6), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9 }));
        finial.position.set(x, 18.9, z);
        tileGroup.add(base, spire, finial);
    }

    // Helper: Add Shaking Minaret Spire
    addMinaretMonument(tileGroup, x, z) {
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 });
        const tower = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 2.2, 18, 8), stoneMat);
        tower.position.set(x, 9, z);
        const balcony = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 1.8, 1.0, 8), stoneMat);
        balcony.position.set(x, 14, z);
        const dome = new THREE.Mesh(new THREE.SphereGeometry(1.6, 8, 8), stoneMat);
        dome.position.set(x, 18.5, z);
        tileGroup.add(tower, balcony, dome);
    }

    // Helper: Add Heritage Pavilion
    addHeritagePavilion(tileGroup, x, z) {
        const mat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
        const platform = new THREE.Mesh(new THREE.BoxGeometry(9, 1.5, 9), mat);
        platform.position.set(x, 0.75, z);
        const dome = new THREE.Mesh(new THREE.SphereGeometry(3.5, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), mat);
        dome.position.set(x, 6, z);
        tileGroup.add(platform, dome);
    }

    // Scroll & Recycle Road Tiles infinitely
    updateRoad(speed, deltaTime) {
        const moveDist = speed * deltaTime;
        this.animTime += deltaTime;

        // Animate Sabarmati River Water surface gently
        this.waterMeshes.forEach((w, idx) => {
            w.position.y = -0.55 + Math.sin(this.animTime * 2 + idx) * 0.05;
        });

        this.roadTiles.forEach(tile => {
            tile.position.z += moveDist;
        });

        // Recycle tiles that have completely passed behind the camera
        const halfLength = this.roadTileLength / 2;
        while (this.roadTiles.length > 0 && (this.roadTiles[0].position.z - halfLength) > 15) {
            const recycledTile = this.roadTiles.shift();
            const lastTile = this.roadTiles[this.roadTiles.length - 1];
            recycledTile.position.z = lastTile.position.z - this.roadTileLength;
            this.roadTiles.push(recycledTile);
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
