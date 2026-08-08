/* 3D Collectibles & Power-Ups Manager */
class CollectibleBuilder {
    // 1. Shiny Gold 3D Coin
    static createCoin() {
        const group = new THREE.Group();

        const goldMat = new THREE.MeshStandardMaterial({
            color: 0xffd700,
            metalness: 0.9,
            roughness: 0.2,
            emissive: 0xffa500,
            emissiveIntensity: 0.3
        });

        const coinGeo = new THREE.CylinderGeometry(0.5, 0.5, 0.12, 16);
        coinGeo.rotateX(Math.PI / 2);
        const coin = new THREE.Mesh(coinGeo, goldMat);

        // Center Emblem / Star
        const star = new THREE.Mesh(new THREE.CylinderGeometry(0.2, 0.2, 0.15, 5), new THREE.MeshStandardMaterial({ color: 0xffffff }));
        star.rotateX(Math.PI / 2);

        group.add(coin, star);
        group.position.y = 1.2;

        group.userData = {
            type: 'collectible',
            subtype: 'coin',
            value: 1,
            radius: 0.8
        };

        return group;
    }

    // 2. Gujarati Special Snack (Jalebi & Fafda Bonus 5X Points!)
    static createSnack() {
        const group = new THREE.Group();

        if (Math.random() < 0.5) {
            // Spiral Orange Jalebi
            const jalebiMat = new THREE.MeshStandardMaterial({
                color: 0xff6b00,
                metalness: 0.3,
                roughness: 0.3,
                emissive: 0xff3300,
                emissiveIntensity: 0.2
            });

            const jalebiRing1 = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.12, 8, 16), jalebiMat);
            const jalebiRing2 = new THREE.Mesh(new THREE.TorusGeometry(0.28, 0.1, 8, 16), jalebiMat);
            group.add(jalebiRing1, jalebiRing2);
            group.userData = { type: 'collectible', subtype: 'snack', snackType: 'jalebi', value: 5, radius: 1.0 };
        } else {
            // Golden Crispy Fafda Strips with Green Chili
            const fafdaMat = new THREE.MeshStandardMaterial({
                color: 0xfacc15, // Golden yellow
                roughness: 0.5,
                metalness: 0.1
            });
            const chiliMat = new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.3 });

            // 2 Flat Rectangular Fafda Strips
            const strip1 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 1.2), fafdaMat);
            strip1.position.set(-0.2, 0, 0);
            strip1.rotation.y = 0.2;

            const strip2 = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.05, 1.2), fafdaMat);
            strip2.position.set(0.2, 0.06, 0);
            strip2.rotation.y = -0.2;

            // Green Fried Chili on top
            const chili = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.07, 0.6, 8), chiliMat);
            chili.rotation.z = Math.PI / 2;
            chili.position.set(0, 0.12, 0);

            group.add(strip1, strip2, chili);
            group.userData = { type: 'collectible', subtype: 'snack', snackType: 'fafda', value: 5, radius: 1.0 };
        }

        group.position.y = 1.4;
        return group;
    }

    // 3. Magnet Power-Up (Blue & Red Horseshoe Magnet)
    static createMagnet() {
        const group = new THREE.Group();

        const redMat = new THREE.MeshStandardMaterial({ color: 0xef4444, roughness: 0.3 });
        const blueMat = new THREE.MeshStandardMaterial({ color: 0x3b82f6, roughness: 0.3 });
        const silverMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 });

        const uGeo = new THREE.TorusGeometry(0.7, 0.22, 12, 24, Math.PI);
        const magnetBase = new THREE.Mesh(uGeo, redMat);
        magnetBase.rotation.z = Math.PI;

        const tipL = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3), silverMat);
        tipL.position.set(-0.7, 0.15, 0);

        const tipR = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.3), blueMat);
        tipR.position.set(0.7, 0.15, 0);

        group.add(magnetBase, tipL, tipR);
        group.position.y = 1.5;

        group.userData = {
            type: 'powerup',
            subtype: 'magnet',
            duration: 8000, // 8 seconds
            radius: 1.2
        };

        return group;
    }

    // 4. Jetpack Power-Up (Rocket Booster)
    static createJetpack() {
        const group = new THREE.Group();

        const bodyMat = new THREE.MeshStandardMaterial({ color: 0x00e5ff, metalness: 0.7, roughness: 0.2 });
        const nozzleMat = new THREE.MeshStandardMaterial({ color: 0x1e293b });

        const tank1 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 12), bodyMat);
        tank1.position.x = -0.35;

        const tank2 = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 1.2, 12), bodyMat);
        tank2.position.x = 0.35;

        const nozzle1 = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.4, 8), nozzleMat);
        nozzle1.position.set(-0.35, -0.7, 0);

        const nozzle2 = new THREE.Mesh(new THREE.ConeGeometry(0.25, 0.4, 8), nozzleMat);
        nozzle2.position.set(0.35, -0.7, 0);

        group.add(tank1, tank2, nozzle1, nozzle2);
        group.position.y = 1.5;

        group.userData = {
            type: 'powerup',
            subtype: 'jetpack',
            duration: 7000, // 7 seconds
            radius: 1.2
        };

        return group;
    }

    // 5. Shield Power-Up (Glowing Energy Orb)
    static createShield() {
        const group = new THREE.Group();

        const orbGeo = new THREE.SphereGeometry(0.75, 16, 16);
        const orbMat = new THREE.MeshStandardMaterial({
            color: 0x10b981,
            transparent: true,
            opacity: 0.75,
            emissive: 0x10b981,
            emissiveIntensity: 0.5
        });
        const orb = new THREE.Mesh(orbGeo, orbMat);

        group.add(orb);
        group.position.y = 1.5;

        group.userData = {
            type: 'powerup',
            subtype: 'shield',
            duration: 12000, // 12 seconds or 1 crash hit
            radius: 1.2
        };

        return group;
    }

    // 6. 2X Score Multiplier Power-Up
    static create2XMultiplier() {
        const group = new THREE.Group();

        const badgeMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, metalness: 0.8, roughness: 0.2 });
        const badge = new THREE.Mesh(new THREE.CylinderGeometry(0.75, 0.75, 0.2, 16), badgeMat);
        badge.rotateX(Math.PI / 2);

        // Canvas 2X Label
        const canvas = document.createElement('canvas');
        canvas.width = 128; canvas.height = 128;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#f59e0b'; ctx.fillRect(0,0,128,128);
        ctx.fillStyle = '#fff'; ctx.font = '900 60px sans-serif';
        ctx.textAlign = 'center'; ctx.fillText('2X', 64, 85);
        const tex = new THREE.CanvasTexture(canvas);

        const textMesh = new THREE.Mesh(new THREE.PlaneGeometry(1.2, 1.2), new THREE.MeshBasicMaterial({ map: tex }));
        textMesh.position.z = 0.11;

        group.add(badge, textMesh);
        group.position.y = 1.5;

        group.userData = {
            type: 'powerup',
            subtype: 'multiplier',
            duration: 10000, // 10 seconds
            radius: 1.2
        };

        return group;
    }
}
