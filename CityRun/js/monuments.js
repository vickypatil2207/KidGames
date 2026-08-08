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

    // 8. Lal Darwaja (Ahmedabad) - Red Sandstone Heritage Gate
    static createLalDarwaja() {
        const group = new THREE.Group();
        const redStoneMat = new THREE.MeshStandardMaterial({ color: 0x991b1b, roughness: 0.8 }); // Red sandstone
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 });

        // Main Arch Gate Structure
        const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(3.5, 12, 3.5), redStoneMat);
        leftPillar.position.set(-6.5, 6, 0);
        const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(3.5, 12, 3.5), redStoneMat);
        rightPillar.position.set(6.5, 6, 0);
        const topArch = new THREE.Mesh(new THREE.BoxGeometry(16.5, 3, 3.5), redStoneMat);
        topArch.position.set(0, 12, 0);

        // Ornamental Parapet Domes
        [-7.5, -2.5, 2.5, 7.5].forEach(x => {
            const dome = new THREE.Mesh(new THREE.SphereGeometry(1.2, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2), redStoneMat);
            dome.position.set(x, 13.5, 0);
            const finial = new THREE.Mesh(new THREE.ConeGeometry(0.2, 1.0, 6), goldMat);
            finial.position.set(x, 15, 0);
            group.add(dome, finial);
        });

        group.add(leftPillar, rightPillar, topArch);
        group.userData = { name: "Lal Darwaja", city: "Ahmedabad" };
        return group;
    }

    // 9. Law Garden Night Market (Ahmedabad) - Bandhani Canopies & Lights
    static createLawGarden() {
        const group = new THREE.Group();
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.7 });
        const bandhaniColors = [0xef4444, 0xf59e0b, 0x8b5cf6, 0x10b981];

        // Overhead Market Arch Frame
        const frameMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, roughness: 0.4 });
        const leftPole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 10), frameMat);
        leftPole.position.set(-7, 5, 0);
        const rightPole = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.4, 10), frameMat);
        rightPole.position.set(7, 5, 0);
        const crossBeam = new THREE.Mesh(new THREE.BoxGeometry(15, 0.6, 0.6), frameMat);
        crossBeam.position.set(0, 9.5, 0);
        group.add(leftPole, rightPole, crossBeam);

        // Colorful Bandhani Umbrella Canopies
        [-5, -1.8, 1.8, 5].forEach((x, idx) => {
            const cMat = new THREE.MeshStandardMaterial({ color: bandhaniColors[idx % bandhaniColors.length], roughness: 0.4 });
            const canopy = new THREE.Mesh(new THREE.ConeGeometry(1.8, 1.2, 12), cMat);
            canopy.position.set(x, 8.5, 0);
            const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 3.5), woodMat);
            pole.position.set(x, 6.5, 0);
            group.add(canopy, pole);
        });

        // Festive Hanging Lights
        const lightGlowMat = new THREE.MeshBasicMaterial({ color: 0xfff176 });
        for (let x = -6; x <= 6; x += 1.5) {
            const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.2, 8, 8), lightGlowMat);
            bulb.position.set(x, 9.0 + (Math.sin(x) * 0.3), 0);
            group.add(bulb);
        }

        group.userData = { name: "Law Garden Night Market", city: "Ahmedabad" };
        return group;
    }

    // 10. Iscon Temple (Ahmedabad) - White & Gold Marble Mandir
    static createIsconTemple() {
        const group = new THREE.Group();
        const marbleMat = new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.2 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.9, roughness: 0.1 });

        // Platform & Main Hall
        const platform = new THREE.Mesh(new THREE.BoxGeometry(15, 1.8, 10), marbleMat);
        platform.position.y = 0.9;
        const mainHall = new THREE.Mesh(new THREE.BoxGeometry(11, 7, 8), marbleMat);
        mainHall.position.set(0, 5.3, -1);
        group.add(platform, mainHall);

        // Carved Front Pillars
        for (let x = -5; x <= 5; x += 2.5) {
            const p = new THREE.Mesh(new THREE.CylinderGeometry(0.35, 0.45, 6, 12), marbleMat);
            p.position.set(x, 4.8, 3);
            group.add(p);
        }

        // Central High Shikhara Spire
        const spire = new THREE.Mesh(new THREE.ConeGeometry(2.8, 9, 8), marbleMat);
        spire.position.set(0, 13.3, -1);

        // Golden Kalash & Flag
        const kalash = new THREE.Mesh(new THREE.SphereGeometry(0.6, 10, 10), goldMat);
        kalash.position.set(0, 18, -1);
        const flag = new THREE.Mesh(new THREE.ConeGeometry(0.4, 1.0, 3), new THREE.MeshStandardMaterial({ color: 0xff5722 }));
        flag.rotation.z = Math.PI / 2;
        flag.position.set(0.6, 18.7, -1);

        group.add(spire, kalash, flag);
        group.userData = { name: "Iscon Temple", city: "Ahmedabad" };
        return group;
    }

    // 11. Vaishnodevi Mandir (Ahmedabad) - Hillside Temple Arch & Spires
    static createVaishnodeviMandir() {
        const group = new THREE.Group();
        const rockMat = new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.9 });
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.6 });
        const goldMat = new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 0.8 });

        // Artificial Hill Base
        const hill = new THREE.Mesh(new THREE.ConeGeometry(10, 7, 7), rockMat);
        hill.position.set(0, 3.5, 0);

        // Temple Structure on Hill Top
        const temple = new THREE.Mesh(new THREE.BoxGeometry(6, 4, 6), stoneMat);
        temple.position.set(0, 8, 0);

        const spire = new THREE.Mesh(new THREE.ConeGeometry(2, 6, 6), stoneMat);
        spire.position.set(0, 13, 0);

        const kalash = new THREE.Mesh(new THREE.SphereGeometry(0.5, 8, 8), goldMat);
        kalash.position.set(0, 16.3, 0);

        group.add(hill, temple, spire, kalash);
        group.userData = { name: "Vaishnodevi Mandir", city: "Ahmedabad" };
        return group;
    }

    // 12. Motera Stadium (Narendra Modi Stadium, Ahmedabad) - World's Largest Cricket Stadium Bowl
    static createMoteraStadium() {
        const group = new THREE.Group();
        const stadiumOuterMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.4 });
        const seatingMat = new THREE.MeshStandardMaterial({ color: 0x0284c7, roughness: 0.5 }); // Blue seats
        const roofMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.2 });

        // Outer Oval Canopy Structure
        const bowlGeo = new THREE.CylinderGeometry(14, 11, 8, 24, 1, true);
        const bowl = new THREE.Mesh(bowlGeo, stadiumOuterMat);
        bowl.position.set(0, 7, 0);

        // Seating Tiers Inner Ring
        const seatsGeo = new THREE.CylinderGeometry(13.8, 10.8, 7.8, 24, 1, true);
        const seats = new THREE.Mesh(seatsGeo, seatingMat);
        seats.position.set(0, 6.9, 0);

        // PTFE Membrane Canopy Roof Ring
        const roofGeo = new THREE.TorusGeometry(13.5, 1.2, 8, 24);
        roofGeo.rotateX(Math.PI / 2);
        const roof = new THREE.Mesh(roofGeo, roofMat);
        roof.position.set(0, 11, 0);

        // 4 Giant Floodlight Towers
        const lightMat = new THREE.MeshStandardMaterial({ color: 0x475569, metalness: 0.7 });
        const glowMat = new THREE.MeshBasicMaterial({ color: 0xffffff });
        [[-13, -13], [13, -13], [-13, 13], [13, 13]].forEach(([x, z]) => {
            const tower = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 16), lightMat);
            tower.position.set(x, 8, z);
            const lightRig = new THREE.Mesh(new THREE.BoxGeometry(2.5, 1.2, 0.4), glowMat);
            lightRig.position.set(x, 16, z);
            group.add(tower, lightRig);
        });

        group.add(bowl, seats, roof);
        group.userData = { name: "Narendra Modi Stadium (Motera)", city: "Ahmedabad" };
        return group;
    }

    // 13. Indroda Park (Gandhinagar) - Dinosaur Safari Arch Gate
    static createIndrodaPark() {
        const group = new THREE.Group();
        const woodMat = new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.7 }); // Jungle green gate
        const dinoMat = new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.8 }); // Bronze/brown dino

        // Safari Entrance Gate Pillars
        const leftPillar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 9, 2.2), woodMat);
        leftPillar.position.set(-6, 4.5, 0);
        const rightPillar = new THREE.Mesh(new THREE.BoxGeometry(2.2, 9, 2.2), woodMat);
        rightPillar.position.set(6, 4.5, 0);
        const topArch = new THREE.Mesh(new THREE.BoxGeometry(14.2, 2.2, 2.2), woodMat);
        topArch.position.set(0, 9, 0);

        // Stylized T-Rex / Brachiosaurus Silhouette Emblem
        const dinoBody = new THREE.Mesh(new THREE.SphereGeometry(1.2, 10, 10), dinoMat);
        dinoBody.scale.set(1.5, 0.9, 0.8);
        dinoBody.position.set(0, 11, 0);

        const dinoNeck = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.5, 2.0), dinoMat);
        dinoNeck.position.set(1.2, 12, 0);
        dinoNeck.rotation.z = -0.4;

        group.add(leftPillar, rightPillar, topArch, dinoBody, dinoNeck);
        group.userData = { name: "Indroda Dinosaur & Nature Park", city: "Gandhinagar" };
        return group;
    }

    // 14. Pathik Ashram (Gandhinagar) - Heritage Pavilion Clock Tower
    static createPathikAshram() {
        const group = new THREE.Group();
        const stoneMat = new THREE.MeshStandardMaterial({ color: 0xd97706, roughness: 0.7 });
        const clockMat = new THREE.MeshBasicMaterial({ color: 0xffffff });

        // Base Building Pavilion
        const base = new THREE.Mesh(new THREE.BoxGeometry(10, 5, 6), stoneMat);
        base.position.set(0, 2.5, 0);

        // Central Clock Tower
        const tower = new THREE.Mesh(new THREE.BoxGeometry(3.5, 12, 3.5), stoneMat);
        tower.position.set(0, 8.5, 0);

        // Clock Faces
        const clockFace = new THREE.Mesh(new THREE.CylinderGeometry(0.9, 0.9, 0.1, 16), clockMat);
        clockFace.rotation.x = Math.PI / 2;
        clockFace.position.set(0, 12.5, 1.8);
        group.add(clockFace);

        // Roof Dome
        const dome = new THREE.Mesh(new THREE.SphereGeometry(2.0, 10, 10, 0, Math.PI * 2, 0, Math.PI / 2), stoneMat);
        dome.position.set(0, 14.5, 0);

        const finial = new THREE.Mesh(new THREE.ConeGeometry(0.3, 1.2, 6), new THREE.MeshStandardMaterial({ color: 0xffd700 }));
        finial.position.set(0, 16.8, 0);

        group.add(base, tower, dome, finial);
        group.userData = { name: "Pathik Ashram", city: "Gandhinagar" };
        return group;
    }
}

