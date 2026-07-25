/* ==========================================================================
   Bow Selection & 3D Procedural Mesh Generators
   ========================================================================== */

const BOWS = [
    {
        id: 'wooden',
        name: 'Wooden Classic Bow',
        iconClass: 'fa-solid fa-tree',
        color: '#8D6E63',
        description: 'Traditional carved wooden bow with balanced handling.',
        stats: { power: 60, speed: 65, stability: 70, aimAssist: 50 },
        arrowColor: 0xffffff
    },
    {
        id: 'compound',
        name: 'Cyber Compound Bow',
        iconClass: 'fa-solid fa-microchip',
        color: '#00BCD4',
        description: 'High-tech composite bow with dual pulley wheels for high speed.',
        stats: { power: 90, speed: 92, stability: 85, aimAssist: 70 },
        arrowColor: 0x00ffff
    },
    {
        id: 'phoenix',
        name: 'Golden Phoenix Bow',
        iconClass: 'fa-solid fa-fire',
        color: '#FFC107',
        description: 'Mythical golden bow forged with fiery phoenix energy.',
        stats: { power: 95, speed: 85, stability: 90, aimAssist: 80 },
        arrowColor: 0xff9800
    },
    {
        id: 'doraemon_gadget',
        name: 'Doraemon Future Bow',
        iconClass: 'fa-solid fa-wand-magic-sparkles',
        color: '#29B6F6',
        description: 'Futuristic gadget bow with full trajectory laser prediction.',
        stats: { power: 80, speed: 80, stability: 100, aimAssist: 100 },
        arrowColor: 0x00e5ff
    },
    {
        id: 'thunder',
        name: 'Thunder Bolt Bow',
        iconClass: 'fa-solid fa-bolt',
        color: '#E040FB',
        description: 'Harnesses lightning for ultra-powerful explosive target impacts!',
        stats: { power: 100, speed: 95, stability: 80, aimAssist: 60 },
        arrowColor: 0xe040fb
    }
];

class BowFactory {
    static createBowMesh(bowId) {
        const group = new THREE.Group();
        const bowDef = BOWS.find(b => b.id === bowId) || BOWS[0];

        let handleColor = 0x5D4037;
        let limbColor = 0x8D6E63;
        let stringColor = 0xEEEEEE;

        if (bowId === 'compound') {
            handleColor = 0x263238;
            limbColor = 0x00BCD4;
            stringColor = 0x00E5FF;
        } else if (bowId === 'phoenix') {
            handleColor = 0xB71C1C;
            limbColor = 0xFFC107;
            stringColor = 0xFFE082;
        } else if (bowId === 'doraemon_gadget') {
            handleColor = 0x0277BD;
            limbColor = 0x29B6F6;
            stringColor = 0xE0F7FA;
        } else if (bowId === 'thunder') {
            handleColor = 0x4A148C;
            limbColor = 0xE040FB;
            stringColor = 0xEA80FC;
        }

        // Center Handle / Riser
        const handleGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.4, 16);
        const handleMat = new THREE.MeshStandardMaterial({ color: handleColor, roughness: 0.4, metalness: 0.3 });
        const handle = new THREE.Mesh(handleGeo, handleMat);
        group.add(handle);

        // Upper & Lower Curved Limbs using Curve / Extrude
        const curveUpper = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, 0.2, 0),
            new THREE.Vector3(0, 0.6, -0.1),
            new THREE.Vector3(0, 1.0, -0.2),
            new THREE.Vector3(0, 1.2, 0.1)
        );
        const limbGeoUpper = new THREE.TubeGeometry(curveUpper, 20, 0.025, 8, false);
        const limbMat = new THREE.MeshStandardMaterial({ 
            color: limbColor, 
            roughness: 0.3, 
            metalness: bowId === 'wooden' ? 0.1 : 0.8,
            emissive: (bowId === 'phoenix' || bowId === 'thunder') ? limbColor : 0x000000,
            emissiveIntensity: 0.3
        });
        const limbUpper = new THREE.Mesh(limbGeoUpper, limbMat);
        group.add(limbUpper);

        const curveLower = new THREE.CubicBezierCurve3(
            new THREE.Vector3(0, -0.2, 0),
            new THREE.Vector3(0, -0.6, -0.1),
            new THREE.Vector3(0, -1.0, -0.2),
            new THREE.Vector3(0, -1.2, 0.1)
        );
        const limbGeoLower = new THREE.TubeGeometry(curveLower, 20, 0.025, 8, false);
        const limbLower = new THREE.Mesh(limbGeoLower, limbMat);
        group.add(limbLower);

        // Compound Bow Pulley Wheels
        if (bowId === 'compound' || bowId === 'doraemon_gadget') {
            const wheelGeo = new THREE.CylinderGeometry(0.08, 0.08, 0.02, 16);
            const wheelMat = new THREE.MeshStandardMaterial({ color: 0x37474F, metalness: 0.9 });
            
            const wheelTop = new THREE.Mesh(wheelGeo, wheelMat);
            wheelTop.rotation.z = Math.PI / 2;
            wheelTop.position.set(0, 1.2, 0.1);
            group.add(wheelTop);

            const wheelBottom = new THREE.Mesh(wheelGeo, wheelMat);
            wheelBottom.rotation.z = Math.PI / 2;
            wheelBottom.position.set(0, -1.2, 0.1);
            group.add(wheelBottom);
        }

        // Bowstring
        const stringMat = new THREE.LineBasicMaterial({ color: stringColor, linewidth: 2 });
        const stringPoints = [
            new THREE.Vector3(0, 1.2, 0.1),
            new THREE.Vector3(0, 0, 0), // String nock position (will flex back during draw)
            new THREE.Vector3(0, -1.2, 0.1)
        ];
        const stringGeo = new THREE.BufferGeometry().setFromPoints(stringPoints);
        const stringLine = new THREE.Line(stringGeo, stringMat);
        stringLine.name = "bowString";
        group.add(stringLine);

        // Scope sight on riser
        const sightGeo = new THREE.RingGeometry(0.02, 0.035, 16);
        const sightMat = new THREE.MeshBasicMaterial({ color: (bowId === 'doraemon_gadget') ? 0x00FF00 : 0xFF3D00, side: THREE.DoubleSide });
        const sight = new THREE.Mesh(sightGeo, sightMat);
        sight.position.set(0, 0.15, 0.06);
        group.add(sight);

        group.userData = { bowDef: bowDef, stringPoints: stringPoints, stringLine: stringLine };
        return group;
    }

    static createArrowMesh(bowId) {
        const group = new THREE.Group();
        const bowDef = BOWS.find(b => b.id === bowId) || BOWS[0];

        // Arrow Shaft
        const shaftGeo = new THREE.CylinderGeometry(0.008, 0.008, 1.2, 12);
        const shaftMat = new THREE.MeshStandardMaterial({ color: 0x37474F, roughness: 0.5 });
        const shaft = new THREE.Mesh(shaftGeo, shaftMat);
        shaft.rotation.x = Math.PI / 2;
        group.add(shaft);

        // Arrow Metal Tip (Arrowhead)
        const tipGeo = new THREE.ConeGeometry(0.018, 0.1, 12);
        const tipMat = new THREE.MeshStandardMaterial({ 
            color: bowDef.arrowColor, 
            metalness: 0.9, 
            roughness: 0.1,
            emissive: bowDef.arrowColor,
            emissiveIntensity: 0.5 
        });
        const tip = new THREE.Mesh(tipGeo, tipMat);
        tip.rotation.x = -Math.PI / 2;
        tip.position.z = -0.65;
        group.add(tip);

        // Fletching Vanes (3 Feathers at back)
        const fletchMat = new THREE.MeshStandardMaterial({ color: bowDef.arrowColor, side: THREE.DoubleSide });
        for (let i = 0; i < 3; i++) {
            const fletchGeo = new THREE.PlaneGeometry(0.04, 0.12);
            const fletch = new THREE.Mesh(fletchGeo, fletchMat);
            fletch.rotation.z = (i * Math.PI * 2 / 3);
            fletch.position.set(Math.cos(i * Math.PI * 2 / 3) * 0.02, Math.sin(i * Math.PI * 2 / 3) * 0.02, 0.52);
            group.add(fletch);
        }

        return group;
    }
}

window.BOWS = BOWS;
window.BowFactory = BowFactory;
