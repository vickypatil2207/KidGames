/* ==========================================================================
   Cartoon Characters Definition & Stats
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

window.CHARACTERS = CHARACTERS;
