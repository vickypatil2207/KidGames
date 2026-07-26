/* ==========================================================================
   Cartoon Characters Definition, Stats & 3D Procedural Mesh Generators
   ========================================================================== */

const CHARACTERS = [
    {
        id: 'singham',
        name: 'Little Singham',
        emoji: '🦁',
        bg: 'linear-gradient(135deg, #FF9800 0%, #E65100 100%)',
        perk: 'Aata Majhi Satakli! Lion Wind Resistance',
        quote: 'Bold lion with maximum wind stability!',
        stats: { windResist: 0.8, aimGuide: 1.0, powerBoost: 1.15, speed: 1.0 }
    },
    {
        id: 'bheem',
        name: 'Chhota Bheem',
        emoji: '👦🏾',
        bg: 'linear-gradient(135deg, #FF7043 0%, #D84315 100%)',
        perk: 'Laddoo Power! Super Draw Strength',
        quote: 'Dholakpur Champ with high arrow velocity!',
        stats: { windResist: 0.5, aimGuide: 1.0, powerBoost: 1.35, speed: 1.2 }
    },
    {
        id: 'panda',
        name: 'Po (Panda)',
        emoji: '🐼',
        bg: 'linear-gradient(135deg, #424242 0%, #212121 100%)',
        perk: 'Dragon Warrior Inner Peace Stability',
        quote: 'Steady grip with zero hand sway!',
        stats: { windResist: 0.6, aimGuide: 1.2, powerBoost: 1.0, speed: 1.0 }
    },
    {
        id: 'masha',
        name: 'Masha',
        emoji: '👧🏼',
        bg: 'linear-gradient(135deg, #EC407A 0%, #AD1457 100%)',
        perk: 'Playful Energy! Fast Arrow Reload',
        quote: 'Quick & energetic shooter!',
        stats: { windResist: 0.4, aimGuide: 1.0, powerBoost: 1.0, speed: 1.3 }
    },
    {
        id: 'doraemon',
        name: 'Doraemon',
        emoji: '🐱',
        bg: 'linear-gradient(135deg, #29B6F6 0%, #0277BD 100%)',
        perk: 'Gadget Laser Aiming Line Preview',
        quote: '22nd-century precision aiming assistant!',
        stats: { windResist: 0.7, aimGuide: 2.0, powerBoost: 1.1, speed: 1.05 }
    },
    {
        id: 'pikachu',
        name: 'Pikachu',
        emoji: '⚡',
        bg: 'linear-gradient(135deg, #FFEE58 0%, #F57F17 100%)',
        perk: 'Thunderbolt Shot! Extra Score Radius',
        quote: 'Pika Pika! High precision lightning hits!',
        stats: { windResist: 0.6, aimGuide: 1.3, powerBoost: 1.2, speed: 1.25 }
    },
    {
        id: 'motupatlu',
        name: 'Motu Patlu',
        emoji: '🥐',
        bg: 'linear-gradient(135deg, #AB47BC 0%, #6A1B9A 100%)',
        perk: 'Samosa Power! Double Score Bonus',
        quote: 'Khali pet dimaag ki batti nahi jalati!',
        stats: { windResist: 0.5, aimGuide: 1.1, powerBoost: 1.1, speed: 1.1 }
    },
    {
        id: 'shinchan',
        name: 'Shinchan',
        emoji: '👶🏻',
        bg: 'linear-gradient(135deg, #EF5350 0%, #C62828 100%)',
        perk: 'Action Kamen Style! Bonus Star Luck',
        quote: 'Buri Buri Zaemon Star Luck!',
        stats: { windResist: 0.5, aimGuide: 1.0, powerBoost: 1.0, speed: 1.0 }
    }
];

class CharacterFactory {
    static create3DCharacter(charId) {
        const group = new THREE.Group();
        group.name = "cartoon_hero_3d";

        if (charId === 'doraemon') {
            // Doraemon: Blue sphere head, cat whiskers, red collar bell, pouch
            const bodyMat = new THREE.MeshStandardMaterial({ color: 0x0288D1, roughness: 0.3 });
            const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.3 });

            // Body
            const bodyGeo = new THREE.SphereGeometry(0.35, 24, 24);
            const body = new THREE.Mesh(bodyGeo, bodyMat);
            body.position.y = 0.5;
            group.add(body);

            // Belly Pouch
            const bellyGeo = new THREE.SphereGeometry(0.26, 24, 24);
            const belly = new THREE.Mesh(bellyGeo, whiteMat);
            belly.position.set(0, 0.48, 0.12);
            group.add(belly);

            // Head
            const headGeo = new THREE.SphereGeometry(0.32, 24, 24);
            const head = new THREE.Mesh(headGeo, bodyMat);
            head.position.y = 1.05;
            group.add(head);

            // Face White Oval
            const faceGeo = new THREE.SphereGeometry(0.26, 24, 24);
            const face = new THREE.Mesh(faceGeo, whiteMat);
            face.position.set(0, 1.02, 0.1);
            group.add(face);

            // Red Nose
            const noseGeo = new THREE.SphereGeometry(0.04, 16, 16);
            const noseMat = new THREE.MeshStandardMaterial({ color: 0xD32F2F });
            const nose = new THREE.Mesh(noseGeo, noseMat);
            nose.position.set(0, 1.08, 0.34);
            group.add(nose);
        } else if (charId === 'pikachu') {
            // Pikachu: Yellow body, pointy ears, red cheeks
            const pikaMat = new THREE.MeshStandardMaterial({ color: 0xFFEB3B, roughness: 0.4 });
            const redMat = new THREE.MeshStandardMaterial({ color: 0xFF1744 });

            // Body & Head
            const bodyGeo = new THREE.CylinderGeometry(0.25, 0.3, 0.7, 16);
            const body = new THREE.Mesh(bodyGeo, pikaMat);
            body.position.y = 0.55;
            group.add(body);

            const headGeo = new THREE.SphereGeometry(0.28, 24, 24);
            const head = new THREE.Mesh(headGeo, pikaMat);
            head.position.y = 1.1;
            group.add(head);

            // Pointy Ears
            for (let side of [-1, 1]) {
                const earGeo = new THREE.ConeGeometry(0.07, 0.35, 12);
                const ear = new THREE.Mesh(earGeo, pikaMat);
                ear.position.set(side * 0.2, 1.4, 0);
                ear.rotation.z = side * -0.4;
                group.add(ear);

                // Red Cheek
                const cheekGeo = new THREE.SphereGeometry(0.05, 12, 12);
                const cheek = new THREE.Mesh(cheekGeo, redMat);
                cheek.position.set(side * 0.18, 1.05, 0.22);
                group.add(cheek);
            }
        } else if (charId === 'singham') {
            // Little Singham: Police khaki/orange uniform, lion ears
            const singhamMat = new THREE.MeshStandardMaterial({ color: 0xFF9800, roughness: 0.4 });
            const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFCC80, roughness: 0.5 });

            const bodyGeo = new THREE.CylinderGeometry(0.22, 0.26, 0.75, 16);
            const body = new THREE.Mesh(bodyGeo, singhamMat);
            body.position.y = 0.55;
            group.add(body);

            const headGeo = new THREE.SphereGeometry(0.25, 24, 24);
            const head = new THREE.Mesh(headGeo, skinMat);
            head.position.y = 1.1;
            group.add(head);

            // Hair/Lion ears
            for (let side of [-1, 1]) {
                const earGeo = new THREE.SphereGeometry(0.08, 12, 12);
                const ear = new THREE.Mesh(earGeo, singhamMat);
                ear.position.set(side * 0.22, 1.25, 0);
                group.add(ear);
            }
        } else if (charId === 'panda') {
            // Po (Panda): Black and white panda body
            const blackMat = new THREE.MeshStandardMaterial({ color: 0x212121, roughness: 0.6 });
            const whiteMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF, roughness: 0.6 });

            const bodyGeo = new THREE.SphereGeometry(0.38, 24, 24);
            const body = new THREE.Mesh(bodyGeo, whiteMat);
            body.position.y = 0.55;
            group.add(body);

            const headGeo = new THREE.SphereGeometry(0.3, 24, 24);
            const head = new THREE.Mesh(headGeo, whiteMat);
            head.position.y = 1.15;
            group.add(head);

            // Black Ears & Eye Patches
            for (let side of [-1, 1]) {
                const earGeo = new THREE.SphereGeometry(0.08, 12, 12);
                const ear = new THREE.Mesh(earGeo, blackMat);
                ear.position.set(side * 0.24, 1.38, 0);
                group.add(ear);
            }
        } else {
            // Generic Kid Hero Model (Bheem, Masha, Shinchan, Motu Patlu)
            let shirtColor = 0xFF5722;
            if (charId === 'masha') shirtColor = 0xEC407A;
            if (charId === 'bheem') shirtColor = 0xFF7043;
            if (charId === 'shinchan') shirtColor = 0xEF5350;
            if (charId === 'motupatlu') shirtColor = 0xAB47BC;

            const shirtMat = new THREE.MeshStandardMaterial({ color: shirtColor, roughness: 0.4 });
            const skinMat = new THREE.MeshStandardMaterial({ color: 0xFFCC80, roughness: 0.5 });

            const bodyGeo = new THREE.CylinderGeometry(0.22, 0.25, 0.7, 16);
            const body = new THREE.Mesh(bodyGeo, shirtMat);
            body.position.y = 0.55;
            group.add(body);

            const headGeo = new THREE.SphereGeometry(0.26, 24, 24);
            const head = new THREE.Mesh(headGeo, skinMat);
            head.position.y = 1.1;
            group.add(head);
        }

        // Add 3D Bow in hand of Character
        const miniBow = BowFactory.createBowMesh('wooden');
        miniBow.scale.set(0.6, 0.6, 0.6);
        miniBow.position.set(-0.32, 0.75, 0.2);
        miniBow.rotation.y = Math.PI / 3;
        group.add(miniBow);

        group.traverse(c => { if (c.isMesh) c.castShadow = true; });
        return group;
    }
}

window.CHARACTERS = CHARACTERS;
window.CharacterFactory = CharacterFactory;
