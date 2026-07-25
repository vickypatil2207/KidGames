/* 3D Obstacle Manager - Road Hazards & Traffic */
class ObstacleBuilder {
    // 1. Auto Rickshaw (Yellow & Green 3D Model)
    static createAutoRickshaw() {
        const group = new THREE.Group();

        // Main Body (Green bottom, Yellow roof)
        const greenMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.4 });
        const yellowMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.3 });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.8 });

        const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 2.4), greenMat);
        cabin.position.y = 1.0;

        const roof = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.7, 2.5), yellowMat);
        roof.position.y = 1.8;

        const windshield = new THREE.Mesh(new THREE.BoxGeometry(1.6, 0.8, 0.1), new THREE.MeshStandardMaterial({ color: 0x38bdf8, transparent: true, opacity: 0.7 }));
        windshield.position.set(0, 1.5, -1.2);

        // 3 Wheels
        const wheelGeo = new THREE.CylinderGeometry(0.4, 0.4, 0.3, 12);
        wheelGeo.rotateZ(Math.PI / 2);
        
        const fWheel = new THREE.Mesh(wheelGeo, blackMat);
        fWheel.position.set(0, 0.4, -1.0);

        const rWheel1 = new THREE.Mesh(wheelGeo, blackMat);
        rWheel1.position.set(-0.9, 0.4, 0.8);

        const rWheel2 = new THREE.Mesh(wheelGeo, blackMat);
        rWheel2.position.set(0.9, 0.4, 0.8);

        group.add(cabin, roof, windshield, fWheel, rWheel1, rWheel2);

        group.userData = {
            type: 'obstacle',
            subtype: 'autorickshaw',
            width: 1.8,
            height: 2.2,
            length: 2.5,
            canSlideUnder: false
        };

        return group;
    }

    // 2. AMTS City Bus (Red & White Large Bus)
    static createAMTSBus() {
        const group = new THREE.Group();

        const redMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.3 }); // Red/Orange AMTS color
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3 });
        const glassMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, transparent: true, opacity: 0.6 });
        const wheelMat = new THREE.MeshStandardMaterial({ color: 0x0f172a });

        // Lower body
        const lowerBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 6.0), redMat);
        lowerBody.position.y = 1.1;

        // Upper Body
        const upperBody = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.6, 6.0), whiteMat);
        upperBody.position.y = 2.7;

        // Side Windows
        const windows = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.9, 5.2), glassMat);
        windows.position.y = 2.8;

        // Destination Display Header
        const headerCanvas = document.createElement('canvas');
        headerCanvas.width = 128; headerCanvas.height = 32;
        const ctx = headerCanvas.getContext('2d');
        ctx.fillStyle = '#000'; ctx.fillRect(0,0,128,32);
        ctx.fillStyle = '#ff0'; ctx.font = 'bold 16px sans-serif';
        ctx.fillText('AMTS - 151', 10, 22);
        const headerTex = new THREE.CanvasTexture(headerCanvas);
        const headerMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.6, 0.4), new THREE.MeshBasicMaterial({ map: headerTex }));
        headerMesh.position.set(0, 3.2, -3.01);
        headerMesh.rotation.y = Math.PI;

        // Wheels
        const wGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.4, 12);
        wGeo.rotateZ(Math.PI / 2);
        [[-1.2, -1.8], [1.2, -1.8], [-1.2, 1.8], [1.2, 1.8]].forEach(([x, z]) => {
            const w = new THREE.Mesh(wGeo, wheelMat);
            w.position.set(x, 0.5, z);
            group.add(w);
        });

        group.add(lowerBody, upperBody, windows, headerMesh);

        group.userData = {
            type: 'obstacle',
            subtype: 'bus',
            width: 2.4,
            height: 3.5,
            length: 6.0,
            canSlideUnder: false
        };

        return group;
    }

    // 3. Road Work Barricade
    static createRoadBarricade() {
        const group = new THREE.Group();

        const woodMat = new THREE.MeshStandardMaterial({ color: 0xea580c, roughness: 0.5 }); // Orange
        const whiteMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

        // Legs
        [-1.1, 1.1].forEach(x => {
            const leg = new THREE.Mesh(new THREE.BoxGeometry(0.2, 1.6, 0.8), woodMat);
            leg.position.set(x, 0.8, 0);
            group.add(leg);
        });

        // Striped Board
        const board = new THREE.Mesh(new THREE.BoxGeometry(2.6, 0.8, 0.15), woodMat);
        board.position.set(0, 1.2, 0);
        group.add(board);

        // Blinking Warning Lamp
        const lamp = new THREE.Mesh(new THREE.SphereGeometry(0.25, 8, 8), new THREE.MeshBasicMaterial({ color: 0xffd700 }));
        lamp.position.set(0, 1.8, 0);
        group.add(lamp);

        group.userData = {
            type: 'obstacle',
            subtype: 'barricade',
            width: 2.6,
            height: 1.6,
            length: 0.8,
            canSlideUnder: false
        };

        return group;
    }

    // 4. Low Overhead Banner Arch (Slide Under!)
    static createOverheadBanner() {
        const group = new THREE.Group();

        const poleMat = new THREE.MeshStandardMaterial({ color: 0x475569 });
        const bannerMat = new THREE.MeshStandardMaterial({ color: 0xff0055, roughness: 0.3 });

        // Side Poles
        [-1.4, 1.4].forEach(x => {
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.12, 0.12, 4.5), poleMat);
            pole.position.set(x, 2.25, 0);
            group.add(pole);
        });

        // Overhead Hanging Banner (Leaves gap below for slide!)
        const banner = new THREE.Mesh(new THREE.BoxGeometry(2.8, 1.4, 0.1), bannerMat);
        banner.position.set(0, 3.2, 0);
        group.add(banner);

        // "WELCOME TO GUJARAT" Banner Text
        const canvas = document.createElement('canvas');
        canvas.width = 256; canvas.height = 64;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#ff0055'; ctx.fillRect(0,0,256,64);
        ctx.fillStyle = '#fff'; ctx.font = 'bold 20px sans-serif';
        ctx.textAlign = 'center'; ctx.fillText('WELCOME!', 128, 40);
        const tex = new THREE.CanvasTexture(canvas);
        const bannerText = new THREE.Mesh(new THREE.PlaneGeometry(2.6, 1.2), new THREE.MeshBasicMaterial({ map: tex }));
        bannerText.position.set(0, 3.2, 0.06);
        group.add(bannerText);

        group.userData = {
            type: 'obstacle',
            subtype: 'overhead_banner',
            width: 2.8,
            height: 4.5,
            length: 0.5,
            canSlideUnder: true, // MUST SLIDE DUCK UNDER!
            slideGapY: 1.6
        };

        return group;
    }

    // 5. Vendor Cart with Umbrella
    static createVendorCart() {
        const group = new THREE.Group();

        const cartMat = new THREE.MeshStandardMaterial({ color: 0xb45309 });
        const umbrellaMat = new THREE.MeshStandardMaterial({ color: 0x0284c7 });

        // Wooden Cart Box
        const box = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.0, 1.6), cartMat);
        box.position.y = 0.9;

        // Umbrella Pole & Top
        const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.06, 2.5), new THREE.MeshBasicMaterial({ color: 0xffffff }));
        pole.position.set(0, 2.2, 0);

        const cone = new THREE.Mesh(new THREE.ConeGeometry(1.4, 0.8, 8), umbrellaMat);
        cone.position.set(0, 3.2, 0);

        group.add(box, pole, cone);

        group.userData = {
            type: 'obstacle',
            subtype: 'vendor_cart',
            width: 1.8,
            height: 2.2,
            length: 1.6,
            canSlideUnder: false
        };

        return group;
    }
}
