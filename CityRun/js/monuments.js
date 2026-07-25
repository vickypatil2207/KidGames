/* 3D Monuments Generator - Ahmedabad & Gandhinagar Landmarks */
class MonumentBuilder {
    // 1. Atal Pedestrian Bridge (Sabarmati Riverfront, Ahmedabad)
    static createAtalBridge() {
        const group = new THREE.Group();

        // Main Curved Overhead Arch
        const archGeo = new THREE.TorusGeometry(12, 0.8, 12, 36, Math.PI);
        const archMat = new THREE.MeshStandardMaterial({
            color: 0x00e5ff,
            roughness: 0.3,
            metalness: 0.7,
            emissive: 0x005577
        });
        const arch = new THREE.Mesh(archGeo, archMat);
        arch.rotation.z = Math.PI;
        arch.position.y = 12;
        group.add(arch);

        // Deck Crossbar (Overhead Bridge Deck)
        const deckGeo = new THREE.BoxGeometry(22, 1.2, 4);
        const deckMat = new THREE.MeshStandardMaterial({ color: 0xff6b00, roughness: 0.4 });
        const deck = new THREE.Mesh(deckGeo, deckMat);
        deck.position.y = 8;
        group.add(deck);

        // Suspension Cables
        const cableMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        for (let x = -8; x <= 8; x += 2) {
            const cableGeo = new THREE.CylinderGeometry(0.08, 0.08, 6);
            const cable = new THREE.Mesh(cableGeo, cableMat);
            cable.position.set(x, 10.5, 0);
            cable.rotation.z = x * -0.05;
            group.add(cable);
        }

        // Bridge Side Pillars
        const pillarMat = new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.5 });
        [-9, 9].forEach(x => {
            const p = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 1.2, 9), pillarMat);
            p.position.set(x, 4.5, 0);
            group.add(p);
        });

        group.userData = { name: "Atal Pedestrian Bridge", city: "Ahmedabad" };
        return group;
    }

    // 2. Sidi Saiyyed Mosque Arch (Ahmedabad)
    static createSidiSaiyyedArch() {
        const group = new THREE.Group();

        // Stone Wall Frame
        const wallMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.8 }); // Yellow Sandstone
        const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(3, 10, 3), wallMat);
        leftPillar.position.set(-6, 5, 0);
        const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(3, 10, 3), wallMat);
        rightPillar.position.set(6, 5, 0);
        const topLintel = new THREE.Mesh(new THREE.BoxGeometry(15, 2.5, 3), wallMat);
        topLintel.position.set(0, 10, 0);

        group.add(leftPillar, rightPillar, topLintel);

        // Arch Vault
        const archGeo = new THREE.CylinderGeometry(4.5, 4.5, 2.8, 24, 1, false, 0, Math.PI);
        const archMesh = new THREE.Mesh(archGeo, wallMat);
        archMesh.rotation.x = Math.PI / 2;
        archMesh.position.set(0, 8.75, 0);
        group.add(archMesh);

        // Jali Lattice Back Panel (Tree of Life graphic representation)
        const jaliCanvas = document.createElement('canvas');
        jaliCanvas.width = 256; jaliCanvas.height = 256;
        const ctx = jaliCanvas.getContext('2d');
        ctx.fillStyle = '#d97706'; ctx.fillRect(0,0,256,256);
        ctx.fillStyle = '#1e1b4b';
        ctx.beginPath(); ctx.arc(128, 128, 100, 0, Math.PI * 2); ctx.fill();
        ctx.strokeStyle = '#f59e0b'; ctx.lineWidth = 6;
        for (let i = 0; i < 12; i++) {
            ctx.beginPath();
            ctx.arc(128 + Math.cos(i) * 50, 128 + Math.sin(i) * 50, 30, 0, Math.PI * 2);
            ctx.stroke();
        }
        const jaliTexture = new THREE.CanvasTexture(jaliCanvas);
        const jaliMat = new THREE.MeshBasicMaterial({ map: jaliTexture, transparent: true, opacity: 0.95 });
        const jaliScreen = new THREE.Mesh(new THREE.PlaneGeometry(8, 7), jaliMat);
        jaliScreen.position.set(0, 6.5, 0.1);
        group.add(jaliScreen);

        group.userData = { name: "Sidi Saiyyed Jali", city: "Ahmedabad" };
        return group;
    }

    // 3. Jhalta Minara - Shaking Minarets (Ahmedabad)
    static createJhaltaMinara() {
        const group = new THREE.Group();
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.85 });

        // Minaret Tower Base
        const base = new THREE.Mesh(new THREE.BoxGeometry(4, 3, 4), stoneMat);
        base.position.y = 1.5;
        group.add(base);

        // Multi-tiered Octagonal Shaft
        const shaft1 = new THREE.Mesh(new THREE.CylinderGeometry(1.4, 1.8, 8, 8), stoneMat);
        shaft1.position.y = 7;

        const balcony1 = new THREE.Mesh(new THREE.CylinderGeometry(2.0, 1.5, 0.8, 8), stoneMat);
        balcony1.position.y = 11.4;

        const shaft2 = new THREE.Mesh(new THREE.CylinderGeometry(1.0, 1.4, 6, 8), stoneMat);
        shaft2.position.y = 14.8;

        const balcony2 = new THREE.Mesh(new THREE.CylinderGeometry(1.6, 1.1, 0.6, 8), stoneMat);
        balcony2.position.y = 18;

        // Top Carved Dome Finial
        const dome = new THREE.Mesh(new THREE.SphereGeometry(1.2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), stoneMat);
        dome.position.y = 18.3;

        const finial = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.5, 8), new THREE.MeshStandardMaterial({ color: 0xffd700 }));
        finial.position.y = 20;

        group.add(shaft1, balcony1, shaft2, balcony2, dome, finial);

        group.userData = { name: "Jhalta Minara (Shaking Minarets)", city: "Ahmedabad" };
        return group;
    }

    // 4. Kankaria Hot Air Balloon (Ahmedabad)
    static createKankariaBalloon() {
        const group = new THREE.Group();

        // Striped Balloon Sphere
        const balloonGeo = new THREE.SphereGeometry(4, 20, 20);
        const balloonMat = new THREE.MeshStandardMaterial({
            color: 0xff0055,
            roughness: 0.3,
            metalness: 0.1
        });
        const balloon = new THREE.Mesh(balloonGeo, balloonMat);
        balloon.position.y = 16;
        group.add(balloon);

        // Yellow Stripes
        const stripeMat = new THREE.MeshBasicMaterial({ color: 0xffd700 });
        for (let a = 0; a < Math.PI * 2; a += Math.PI / 3) {
            const band = new THREE.Mesh(new THREE.TorusGeometry(3.9, 0.2, 8, 16), stripeMat);
            band.rotation.x = Math.PI / 2;
            band.rotation.y = a;
            band.position.y = 16;
            group.add(band);
        }

        // Basket
        const basket = new THREE.Mesh(new THREE.BoxGeometry(1.8, 1.4, 1.8), new THREE.MeshStandardMaterial({ color: 0x78350f }));
        basket.position.y = 9;
        group.add(basket);

        // Ropes
        const ropeMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        [-0.7, 0.7].forEach(x => {
            [-0.7, 0.7].forEach(z => {
                const r = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.04, 5.5), ropeMat);
                r.position.set(x, 12.5, z);
                group.add(r);
            });
        });

        group.userData = { name: "Kankaria Lake Balloon", city: "Ahmedabad" };
        return group;
    }

    // 5. Akshardham Temple Facade (Gandhinagar)
    static createAkshardhamTemple() {
        const group = new THREE.Group();
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0xf59e0b, roughness: 0.6 }); // Golden Sandstone

        // Raised Platform
        const platform = new THREE.Mesh(new THREE.BoxGeometry(16, 2, 10), stoneMat);
        platform.position.y = 1;
        group.add(platform);

        // Main Sanctum Building
        const mainHall = new THREE.Mesh(new THREE.BoxGeometry(12, 7, 8), stoneMat);
        mainHall.position.set(0, 5.5, -1);
        group.add(mainHall);

        // Pillars
        for (let x = -6; x <= 6; x += 3) {
            const pillar = new THREE.Mesh(new THREE.CylinderGeometry(0.4, 0.5, 6, 10), stoneMat);
            pillar.position.set(x, 5, 3.2);
            group.add(pillar);
        }

        // Central Shikhara (Spire / Tower)
        const spire = new THREE.Mesh(new THREE.ConeGeometry(3, 8, 8), stoneMat);
        spire.position.set(0, 13, -1);
        group.add(spire);

        // Side Domes
        [-4.5, 4.5].forEach(x => {
            const d = new THREE.Mesh(new THREE.SphereGeometry(2, 12, 12, 0, Math.PI * 2, 0, Math.PI / 2), stoneMat);
            d.position.set(x, 9, -1);
            const finial = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.2, 6), new THREE.MeshStandardMaterial({ color: 0xffd700 }));
            finial.position.set(x, 11.6, -1);
            group.add(d, finial);
        });

        // Golden Kalash on top spire
        const kalash = new THREE.Mesh(new THREE.SphereGeometry(0.6, 8, 8), new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 }));
        kalash.position.set(0, 17.2, -1);
        group.add(kalash);

        group.userData = { name: "Akshardham Temple", city: "Gandhinagar" };
        return group;
    }

    // 6. Mahatma Mandir (Gandhinagar)
    static createMahatmaMandir() {
        const group = new THREE.Group();

        // Salt Mound Pyramid / Dome Structure
        const moundGeo = new THREE.ConeGeometry(7, 9, 7);
        const moundMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.3, metalness: 0.1 });
        const mound = new THREE.Mesh(moundGeo, moundMat);
        mound.position.y = 4.5;
        group.add(mound);

        // Glass Convention Center Arch
        const glassGeo = new THREE.CylinderGeometry(9, 9, 4, 16, 1, true, 0, Math.PI);
        const glassMat = new THREE.MeshStandardMaterial({
            color: 0x38bdf8,
            transparent: true,
            opacity: 0.7,
            roughness: 0.1,
            metalness: 0.8
        });
        const glassArch = new THREE.Mesh(glassGeo, glassMat);
        glassArch.rotation.x = Math.PI / 2;
        glassArch.position.set(0, 4, -4);
        group.add(glassArch);

        group.userData = { name: "Mahatma Mandir", city: "Gandhinagar" };
        return group;
    }

    // 7. GIFT City Glass Skyscrapers (Gandhinagar)
    static createGiftCityTowers() {
        const group = new THREE.Group();
        const glassMat = new THREE.MeshStandardMaterial({
            color: 0x0284c7,
            metalness: 0.9,
            roughness: 0.15,
            emissive: 0x0284c7,
            emissiveIntensity: 0.2
        });

        // Tower 1 (Taller)
        const t1 = new THREE.Mesh(new THREE.BoxGeometry(5, 24, 5), glassMat);
        t1.position.set(-3, 12, 0);

        // Tower 2 (Shorter offset)
        const t2 = new THREE.Mesh(new THREE.BoxGeometry(4.5, 18, 4.5), glassMat);
        t2.position.set(3, 9, 1);

        // Neon Glow Lines
        const lineMat = new THREE.MeshBasicMaterial({ color: 0x00e5ff });
        for (let y = 3; y <= 22; y += 4) {
            const band = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.3, 5.2), lineMat);
            band.position.set(-3, y, 0);
            group.add(band);
        }

        // Skybridge between towers
        const bridge = new THREE.Mesh(new THREE.BoxGeometry(6, 1.5, 2), glassMat);
        bridge.position.set(0, 14, 0);

        group.add(t1, t2, bridge);

        group.userData = { name: "GIFT City Towers", city: "Gandhinagar" };
        return group;
    }
}
