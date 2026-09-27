/**
 * Study With Fun - Pre-Primary Comprehensive Game Data
 * 36 Progressive Levels across 5 Themed Worlds (108 Stars Total)
 * Includes Letter Color Palettes & Asset Dictionaries
 */

// Unique color palette per letter for Capital & Small matching
const LETTER_COLOR_PALETTE = {
  'A': { name: 'Ruby Red', color: '#E11D48', bg: '#FFE4E6', border: '#BE123C' },
  'B': { name: 'Ocean Blue', color: '#0284C7', bg: '#E0F2FE', border: '#0369A1' },
  'C': { name: 'Sunset Coral', color: '#F97316', bg: '#FFEDD5', border: '#EA580C' },
  'D': { name: 'Emerald', color: '#059669', bg: '#D1FAE5', border: '#047857' },
  'E': { name: 'Amber Glow', color: '#D97706', bg: '#FEF3C7', border: '#B45309' },
  'F': { name: 'Purple Berry', color: '#7C3AED', bg: '#EDE9FE', border: '#6D28D9' },
  'G': { name: 'Teal Forest', color: '#0D9488', bg: '#CCFBF1', border: '#0F766E' },
  'H': { name: 'Honey Gold', color: '#D97706', bg: '#FEF3C7', border: '#B45309' },
  'I': { name: 'Ice Blue', color: '#0284C7', bg: '#E0F2FE', border: '#0369A1' },
  'J': { name: 'Jade Teal', color: '#0D9488', bg: '#CCFBF1', border: '#0F766E' },
  'K': { name: 'Kiwi Green', color: '#65A30D', bg: '#ECFCCB', border: '#4D7C0F' },
  'L': { name: 'Lavender', color: '#8B5CF6', bg: '#EDE9FE', border: '#7C3AED' },
  'M': { name: 'Magenta', color: '#C026D3', bg: '#FAE8FF', border: '#A21CAF' },
  'N': { name: 'Navy', color: '#1E40AF', bg: '#DBEAFE', border: '#1E3A8A' },
  'O': { name: 'Orange', color: '#EA580C', bg: '#FFEDD5', border: '#C2410C' },
  'P': { name: 'Purple', color: '#9333EA', bg: '#F3E8FF', border: '#7E22CE' },
  'Q': { name: 'Rose', color: '#E11D48', bg: '#FFE4E6', border: '#BE123C' },
  'R': { name: 'Red', color: '#DC2626', bg: '#FEE2E2', border: '#B91C1C' },
  'S': { name: 'Sun Yellow', color: '#CA8A04', bg: '#FEF9C3', border: '#A16207' },
  'T': { name: 'Turquoise', color: '#0891B2', bg: '#CFFAFE', border: '#0E7490' },
  'U': { name: 'Blue', color: '#2563EB', bg: '#DBEAFE', border: '#1D4ED8' },
  'V': { name: 'Violet', color: '#7C3AED', bg: '#EDE9FE', border: '#6D28D9' },
  'W': { name: 'Watermelon Pink', color: '#F43F5E', bg: '#FFE4E6', border: '#E11D48' },
  'X': { name: 'Amber', color: '#D97706', bg: '#FEF3C7', border: '#B45309' },
  'Y': { name: 'Yellow', color: '#EAB308', bg: '#FEF08A', border: '#CA8A04' },
  'Z': { name: 'Zebra Dark', color: '#334155', bg: '#E2E8F0', border: '#1E293B' }
};

// High-fidelity, kid-friendly vector illustrations for items that lack uniform OS emoji font support on desktop/laptops
const GAME_SVGS = {
  carWheel: `<svg class="game-svg-icon" viewBox="0 0 100 100" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <radialGradient id="svg-wheel-tire" cx="50%" cy="50%" r="50%">
        <stop offset="60%" stop-color="#1E293B"/>
        <stop offset="90%" stop-color="#0F172A"/>
        <stop offset="100%" stop-color="#020617"/>
      </radialGradient>
      <radialGradient id="svg-wheel-rim" cx="35%" cy="35%" r="65%">
        <stop offset="0%" stop-color="#F8FAFC"/>
        <stop offset="60%" stop-color="#CBD5E1"/>
        <stop offset="100%" stop-color="#94A3B8"/>
      </radialGradient>
      <radialGradient id="svg-wheel-hub" cx="40%" cy="40%" r="60%">
        <stop offset="0%" stop-color="#38BDF8"/>
        <stop offset="100%" stop-color="#0284C7"/>
      </radialGradient>
    </defs>
    <circle cx="50" cy="50" r="46" fill="url(#svg-wheel-tire)" stroke="#334155" stroke-width="2"/>
    <path d="M50 4 v4 M50 92 v4 M4 50 h4 M92 50 h4 M17 17 l3 3 M80 80 l3 3 M17 83 l3 -3 M80 20 l3 -3" stroke="#475569" stroke-width="3" stroke-linecap="round"/>
    <circle cx="50" cy="50" r="31" fill="url(#svg-wheel-rim)" stroke="#64748B" stroke-width="2"/>
    <circle cx="50" cy="50" r="23" fill="none" stroke="#64748B" stroke-width="4" stroke-dasharray="14 10"/>
    <circle cx="50" cy="50" r="13" fill="url(#svg-wheel-hub)" stroke="#0369A1" stroke-width="2"/>
    <circle cx="50" cy="50" r="4" fill="#FFFFFF"/>
    <circle cx="50" cy="40" r="2.2" fill="#475569"/>
    <circle cx="58" cy="46" r="2.2" fill="#475569"/>
    <circle cx="55" cy="56" r="2.2" fill="#475569"/>
    <circle cx="45" cy="56" r="2.2" fill="#475569"/>
    <circle cx="42" cy="46" r="2.2" fill="#475569"/>
  </svg>`,

  heavyRock: `<svg class="game-svg-icon" viewBox="0 0 100 100" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="svg-rock-grad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#94A3B8"/>
        <stop offset="50%" stop-color="#64748B"/>
        <stop offset="100%" stop-color="#334155"/>
      </linearGradient>
      <linearGradient id="svg-rock-facet" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#CBD5E1" stop-opacity="0.85"/>
        <stop offset="100%" stop-color="#94A3B8" stop-opacity="0.2"/>
      </linearGradient>
    </defs>
    <ellipse cx="50" cy="85" rx="38" ry="9" fill="#000000" opacity="0.18"/>
    <path d="M 22 78 C 12 74, 10 56, 18 42 C 24 30, 36 16, 52 14 C 68 12, 82 24, 88 38 C 94 52, 92 70, 80 80 C 70 86, 32 86, 22 78 Z" fill="url(#svg-rock-grad)" stroke="#1E293B" stroke-width="3.5" stroke-linejoin="round"/>
    <path d="M 26 40 L 48 24 L 62 42 L 38 56 Z" fill="url(#svg-rock-facet)"/>
    <path d="M 52 14 L 68 28 L 86 36 L 62 42 Z" fill="#E2E8F0" opacity="0.4"/>
    <path d="M 38 56 L 62 42 L 78 60 L 56 78 Z" fill="#1E293B" opacity="0.25"/>
    <path d="M 62 42 L 70 52 L 66 60" stroke="#1E293B" stroke-width="2.5" stroke-linecap="round" fill="none"/>
    <path d="M 38 56 L 44 68" stroke="#1E293B" stroke-width="2" stroke-linecap="round" fill="none"/>
    <circle cx="34" cy="30" r="3" fill="#FFFFFF" opacity="0.6"/>
    <circle cx="44" cy="22" r="2" fill="#FFFFFF" opacity="0.6"/>
  </svg>`,

  lightFeather: `<svg class="game-svg-icon" viewBox="0 0 100 100" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="svg-feather-grad1" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#38BDF8"/>
        <stop offset="50%" stop-color="#818CF8"/>
        <stop offset="100%" stop-color="#C084FC"/>
      </linearGradient>
      <linearGradient id="svg-feather-grad2" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#7DD3FC"/>
        <stop offset="50%" stop-color="#A5B4FC"/>
        <stop offset="100%" stop-color="#E879F9"/>
      </linearGradient>
    </defs>
    <path d="M 82 14 C 76 22, 60 26, 44 38 C 30 48, 22 62, 18 80 C 26 78, 36 72, 46 64 C 62 50, 76 34, 82 14 Z" fill="url(#svg-feather-grad1)"/>
    <path d="M 82 14 C 74 16, 56 20, 42 32 C 28 44, 20 60, 16 78 C 22 76, 32 70, 40 60 C 56 46, 72 28, 82 14 Z" fill="url(#svg-feather-grad2)" opacity="0.85"/>
    <path d="M 68 25 L 60 30 M 52 38 L 42 44 M 38 52 L 28 58 M 72 20 L 78 26 M 58 32 L 66 40 M 44 46 L 50 54" stroke="#FFFFFF" stroke-width="1.8" stroke-linecap="round" opacity="0.6"/>
    <path d="M 84 12 C 68 32, 44 56, 12 88" stroke="#FFFFFF" stroke-width="3" stroke-linecap="round" fill="none"/>
    <path d="M 84 12 C 68 32, 44 56, 12 88" stroke="#E0F2FE" stroke-width="2" stroke-linecap="round" fill="none"/>
    <path d="M 16 84 L 8 92" stroke="#CBD5E1" stroke-width="2.5" stroke-linecap="round"/>
    <circle cx="78" cy="38" r="2.5" fill="#38BDF8" opacity="0.7"/>
    <circle cx="32" cy="28" r="2" fill="#C084FC" opacity="0.7"/>
    <circle cx="20" cy="46" r="2.5" fill="#F472B6" opacity="0.7"/>
  </svg>`,

  blackCrow: `<svg class="game-svg-icon" viewBox="0 0 100 100" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="svg-crow-body" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#334155"/>
        <stop offset="40%" stop-color="#1E293B"/>
        <stop offset="100%" stop-color="#0F172A"/>
      </linearGradient>
      <linearGradient id="svg-crow-beak" x1="0%" y1="0%" x2="100%" y2="50%">
        <stop offset="0%" stop-color="#FBBF24"/>
        <stop offset="100%" stop-color="#F59E0B"/>
      </linearGradient>
    </defs>
    <path d="M 28 62 L 10 74 L 14 62 L 8 68 L 22 56 Z" fill="#0F172A"/>
    <path d="M 42 74 L 40 88 M 40 88 L 34 88 M 40 88 L 44 88 M 54 74 L 54 88 M 54 88 L 48 88 M 54 88 L 58 88" stroke="#D97706" stroke-width="3" stroke-linecap="round"/>
    <ellipse cx="46" cy="56" rx="24" ry="20" fill="url(#svg-crow-body)" stroke="#0F172A" stroke-width="1.5"/>
    <path d="M 34 46 C 44 46, 56 52, 54 64 C 52 74, 38 74, 26 66 C 24 58, 28 48, 34 46 Z" fill="#0F172A" stroke="#334155" stroke-width="2"/>
    <path d="M 32 54 C 40 54, 48 60, 44 68 M 28 60 C 34 60, 40 64, 36 70" stroke="#475569" stroke-width="1.8" stroke-linecap="round"/>
    <circle cx="62" cy="34" r="16" fill="url(#svg-crow-body)" stroke="#0F172A" stroke-width="1.5"/>
    <circle cx="67" cy="32" r="5" fill="#FFFFFF"/>
    <circle cx="68" cy="32" r="2.8" fill="#0F172A"/>
    <circle cx="69.5" cy="30.5" r="1.2" fill="#FFFFFF"/>
    <path d="M 74 30 L 94 36 C 88 40, 80 42, 74 42 Z" fill="url(#svg-crow-beak)" stroke="#D97706" stroke-width="1.5"/>
    <path d="M 74 36 L 90 36" stroke="#B45309" stroke-width="1"/>
    <path d="M 58 20 C 58 14, 52 14, 54 20 M 62 19 C 64 12, 58 12, 60 19" stroke="#334155" stroke-width="2" stroke-linecap="round"/>
  </svg>`,

  cutSandwich: `<svg class="game-svg-icon" viewBox="0 0 100 100" width="1em" height="1em" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="svg-sandwich-crust" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#D97706"/>
        <stop offset="100%" stop-color="#B45309"/>
      </linearGradient>
      <linearGradient id="svg-sandwich-bread" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stop-color="#FEF3C7"/>
        <stop offset="100%" stop-color="#FDE68A"/>
      </linearGradient>
    </defs>
    <polygon points="50,18 88,82 12,82" fill="#000000" opacity="0.12" transform="translate(0, 4)"/>
    <polygon points="50,14 88,78 12,78" fill="url(#svg-sandwich-crust)" stroke="#92400E" stroke-width="3" stroke-linejoin="round"/>
    <polygon points="50,18 84,75 16,75" fill="url(#svg-sandwich-bread)"/>
    <path d="M 14 68 Q 22 62, 30 68 Q 38 62, 46 68 Q 54 62, 62 68 Q 70 62, 78 68 Q 84 64, 86 68" stroke="#10B981" stroke-width="5" fill="none" stroke-linecap="round"/>
    <rect x="24" y="65" width="14" height="4" rx="2" fill="#EF4444"/>
    <rect x="52" y="65" width="16" height="4" rx="2" fill="#EF4444"/>
    <path d="M 18 70 L 82 70 L 76 74 L 64 74 L 60 77 L 54 74 L 40 74 L 36 78 L 30 74 Z" fill="#F59E0B"/>
    <polygon points="50,22 82,72 18,72" fill="#FEF08A" stroke="#D97706" stroke-width="2" stroke-linejoin="round"/>
    <circle cx="48" cy="42" r="1.5" fill="#D97706" opacity="0.6"/>
    <circle cx="56" cy="50" r="1.8" fill="#D97706" opacity="0.6"/>
    <circle cx="42" cy="56" r="1.5" fill="#D97706" opacity="0.6"/>
    <circle cx="64" cy="62" r="1.5" fill="#D97706" opacity="0.6"/>
    <circle cx="34" cy="64" r="1.8" fill="#D97706" opacity="0.6"/>
  </svg>`
};

// 5 Progressive Worlds Metadata
const GAME_WORLDS = [
  {
    id: 1,
    name: 'Discovery Garden',
    range: 'Levels 1 – 8',
    icon: '🌱',
    color: '#10B981',
    bgGrad: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    desc: 'Explore early ABCs, in-between letters, colors, friendly shapes, and 1-5 numbers!'
  },
  {
    id: 2,
    name: 'Junior Explorers',
    range: 'Levels 9 – 15',
    icon: '🚀',
    color: '#3B82F6',
    bgGrad: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    desc: 'Uncover picture matches, odd-one-out detectives, in-between ABCs, and 3-letter CVC phonics!'
  },
  {
    id: 3,
    name: 'Adventure Academy',
    range: 'Levels 16 – 22',
    icon: '🏝️',
    color: '#8B5CF6',
    bgGrad: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    desc: 'Master number stepping stones, in-between teen numbers, letter pairs, and shape mysteries!'
  },
  {
    id: 4,
    name: 'Brainy Champions',
    range: 'Levels 23 – 29',
    icon: '🏰',
    color: '#EC4899',
    bgGrad: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    desc: 'Hop through skip-counting, tricky in-between letters, and 4-letter words!'
  },
  {
    id: 5,
    name: 'Grand Master Legends',
    range: 'Levels 30 – 36',
    icon: '👑',
    color: '#F59E0B',
    bgGrad: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    desc: 'The Ultimate Grand Trophy! Conquer all skills to become an official Graduate!'
  }
];

// 36 Comprehensive Pre-Primary Levels
const GAME_LEVELS = [
  /* ====================================================================
     WORLD 1: DISCOVERY GARDEN (LEVELS 1 - 8)
     ==================================================================== */
  {
    id: 1,
    worldId: 1,
    title: 'Next Alphabet (A-M)',
    subtitle: 'Find what comes next in the ABC train!',
    badge: '🔤 Level 1',
    icon: '🅰️',
    type: 'next_alpha',
    color: '#FF6B6B',
    bgGrad: 'linear-gradient(135deg, #FF6B6B 0%, #FF8E53 100%)',
    rounds: [
      { seq: ['A', 'B', 'C'], answer: 'D', options: ['D', 'E', 'B', 'C'], phonic: 'D is for Dog 🐶' },
      { seq: ['D', 'E', 'F'], answer: 'G', options: ['H', 'G', 'F', 'C'], phonic: 'G is for Grapes 🍇' },
      { seq: ['G', 'H', 'I'], answer: 'J', options: ['K', 'L', 'J', 'M'], phonic: 'J is for Juice 🧃' },
      { seq: ['J', 'K', 'L'], answer: 'M', options: ['N', 'O', 'M', 'K'], phonic: 'M is for Monkey 🐵' },
      { seq: ['B', 'C', 'D'], answer: 'E', options: ['E', 'F', 'A', 'G'], phonic: 'E is for Elephant 🐘' }
    ]
  },
  {
    id: 2,
    worldId: 1,
    title: 'In-Between Alphabet (A-J)',
    subtitle: 'Find what friendly letter is hiding in the middle!',
    badge: '🔤 Level 2',
    icon: '🔤',
    type: 'between_alpha',
    color: '#0EA5E9',
    bgGrad: 'linear-gradient(135deg, #0EA5E9 0%, #0284C7 100%)',
    rounds: [
      { before: 'A', after: 'C', answer: 'B', options: ['B', 'D', 'E', 'C'], phonic: 'B is for Butterfly 🦋' },
      { before: 'C', after: 'E', answer: 'D', options: ['B', 'D', 'F', 'A'], phonic: 'D is for Dinosaur 🦕' },
      { before: 'F', after: 'H', answer: 'G', options: ['E', 'I', 'G', 'J'], phonic: 'G is for Giraffe 🦒' },
      { before: 'D', after: 'F', answer: 'E', options: ['C', 'E', 'G', 'B'], phonic: 'E is for Elephant 🐘' },
      { before: 'H', after: 'J', answer: 'I', options: ['K', 'G', 'I', 'H'], phonic: 'I is for Ice Cream 🍦' }
    ]
  },
  {
    id: 3,
    worldId: 1,
    title: 'World of Colors',
    subtitle: 'Discover what bright color each yummy fruit and friend has!',
    badge: '🎨 Level 3',
    icon: '🎨',
    type: 'identify_color',
    color: '#F97316',
    bgGrad: 'linear-gradient(135deg, #F97316 0%, #EA580C 100%)',
    rounds: [
      { item: '🍎', name: 'Apple', answer: 'Red', hex: '#EF4444', options: ['Red', 'Blue', 'Green', 'Yellow'] },
      { item: '☀️', name: 'Sun', answer: 'Yellow', hex: '#EAB308', options: ['Green', 'Yellow', 'Purple', 'Red'] },
      { item: '🍃', name: 'Leaf', answer: 'Green', hex: '#10B981', options: ['Blue', 'Green', 'Orange', 'Pink'] },
      { item: '🌊', name: 'Ocean Wave', answer: 'Blue', hex: '#3B82F6', options: ['Yellow', 'Red', 'Blue', 'Green'] },
      { item: '🥕', name: 'Carrot', answer: 'Orange', hex: '#F97316', options: ['Orange', 'Purple', 'Blue', 'Pink'] }
    ]
  },
  {
    id: 4,
    worldId: 1,
    title: 'Counting Numbers (1-5)',
    subtitle: 'Count the cute items and tap the right number!',
    badge: '🔢 Level 4',
    icon: '🍎',
    type: 'count_items',
    color: '#4ECDC4',
    bgGrad: 'linear-gradient(135deg, #4ECDC4 0%, #2980B9 100%)',
    rounds: [
      { item: '🍎', name: 'Apples', count: 3, options: [2, 3, 4, 1] },
      { item: '⭐', name: 'Stars', count: 5, options: [3, 4, 5, 2] },
      { item: '🐶', name: 'Puppies', count: 2, options: [1, 2, 3, 4] },
      { item: '🎈', name: 'Balloons', count: 4, options: [5, 4, 3, 2] },
      { item: '🍓', name: 'Strawberries', count: 1, options: [1, 2, 3, 4] }
    ]
  },
  {
    id: 5,
    worldId: 1,
    title: 'In-Between Numbers (1-10)',
    subtitle: 'Which number sits right in the middle? 4 ➔ ? ➔ 6!',
    badge: '🔢 Level 5',
    icon: '🎯',
    type: 'between_num',
    color: '#10B981',
    bgGrad: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    rounds: [
      { before: 1, after: 3, answer: 2, options: [2, 4, 3, 5], hint: 'What number is between 1 and 3?' },
      { before: 4, after: 6, answer: 5, options: [3, 5, 7, 6], hint: 'What number is between 4 and 6?' },
      { before: 6, after: 8, answer: 7, options: [5, 9, 7, 8], hint: 'What number is between 6 and 8?' },
      { before: 2, after: 4, answer: 3, options: [5, 1, 3, 4], hint: 'What number is between 2 and 4?' },
      { before: 7, after: 9, answer: 8, options: [6, 8, 10, 7], hint: 'What number is between 7 and 9?' }
    ]
  },
  {
    id: 6,
    worldId: 1,
    title: 'Fun with Shapes',
    subtitle: 'Identify round circles, sturdy squares, and yummy pizza triangles!',
    badge: '🔷 Level 6',
    icon: '⭕',
    type: 'identify_shape',
    color: '#06D6A0',
    bgGrad: 'linear-gradient(135deg, #06D6A0 0%, #118AB2 100%)',
    rounds: [
      { item: GAME_SVGS.carWheel, name: 'Car Wheel', answer: 'Circle', icon: '⭕', options: ['Circle', 'Square', 'Triangle', 'Star'] },
      { item: '🎁', name: 'Gift Box', answer: 'Square', icon: '⏹️', options: ['Triangle', 'Square', 'Circle', 'Rectangle'] },
      { item: '🍕', name: 'Pizza Slice', answer: 'Triangle', icon: '🔺', options: ['Circle', 'Star', 'Triangle', 'Square'] },
      { item: '🚪', name: 'Room Door', answer: 'Rectangle', icon: '▭', options: ['Rectangle', 'Circle', 'Square', 'Diamond'] },
      { item: '⭐', name: 'Night Star', answer: 'Star', icon: '⭐', options: ['Square', 'Star', 'Triangle', 'Circle'] }
    ]
  },
  {
    id: 7,
    worldId: 1,
    title: 'Big or Small? (Opposites)',
    subtitle: 'Compare two buddies and choose which is Big or Small!',
    badge: '⚖️ Level 7',
    icon: '🐘',
    type: 'compare_opposites',
    color: '#845EC2',
    bgGrad: 'linear-gradient(135deg, #845EC2 0%, #D65DB1 100%)',
    rounds: [
      {
        question: 'Which one is BIG?',
        target: 'Big',
        cardA: { emoji: '🐘', label: 'Elephant', value: 'Big' },
        cardB: { emoji: '🐭', label: 'Little Mouse', value: 'Small' }
      },
      {
        question: 'Which one is SMALL?',
        target: 'Small',
        cardA: { emoji: '🌳', label: 'Big Tree', value: 'Big' },
        cardB: { emoji: '🌱', label: 'Tiny Sprout', value: 'Small' }
      },
      {
        question: 'Which one is BIG?',
        target: 'Big',
        cardA: { emoji: '🐳', label: 'Blue Whale', value: 'Big' },
        cardB: { emoji: '🐟', label: 'Goldfish', value: 'Small' }
      },
      {
        question: 'Which one is SMALL?',
        target: 'Small',
        cardA: { emoji: '🍉', label: 'Watermelon', value: 'Big' },
        cardB: { emoji: '🍒', label: 'Cherries', value: 'Small' }
      },
      {
        question: 'Which one is BIG?',
        target: 'Big',
        cardA: { emoji: '🚌', label: 'School Bus', value: 'Big' },
        cardB: { emoji: '🛹', label: 'Skateboard', value: 'Small' }
      }
    ]
  },
  {
    id: 8,
    worldId: 1,
    title: 'Match Big & Small (A-H)',
    subtitle: 'Connect Capital and Small letters together!',
    badge: '🧩 Level 8',
    icon: 'Aa',
    type: 'match_letters',
    color: '#FFBE0B',
    bgGrad: 'linear-gradient(135deg, #FFBE0B 0%, #FB5607 100%)',
    rounds: [
      {
        pairs: [
          { upper: 'B', lower: 'b', word: 'Blue Ball ⚽' },
          { upper: 'R', lower: 'r', word: 'Red Rose 🌹' },
          { upper: 'Y', lower: 'y', word: 'Yellow Yoyo 🪀' }
        ]
      },
      {
        pairs: [
          { upper: 'A', lower: 'a', word: 'Apple 🍎' },
          { upper: 'D', lower: 'd', word: 'Duck 🦆' },
          { upper: 'C', lower: 'c', word: 'Cat 🐱' }
        ]
      },
      {
        pairs: [
          { upper: 'E', lower: 'e', word: 'Egg 🥚' },
          { upper: 'F', lower: 'f', word: 'Fish 🐟' },
          { upper: 'H', lower: 'h', word: 'House 🏠' }
        ]
      }
    ]
  },

  /* ====================================================================
     WORLD 2: JUNIOR EXPLORERS (LEVELS 9 - 15)
     ==================================================================== */
  {
    id: 9,
    worldId: 2,
    title: 'Spot the Odd One Out',
    subtitle: 'Can you spot which one is different in the row?',
    badge: '🔍 Level 9',
    icon: '👀',
    type: 'odd_one_out',
    color: '#0284C7',
    bgGrad: 'linear-gradient(135deg, #0284C7 0%, #0369A1 100%)',
    rounds: [
      { items: ['1', '2', '1', '1', '1'], answer: '2', question: 'Find the different number!' },
      { items: ['A', 'A', 'A', 'B', 'A'], answer: 'B', question: 'Find the different letter!' },
      { items: ['🍎', '🍎', '🍌', '🍎', '🍎'], answer: '🍌', question: 'Find the different fruit!' },
      { items: ['3', '3', '3', '3', '8'], answer: '8', question: 'Find the different number!' },
      { items: ['C', 'O', 'C', 'C', 'C'], answer: 'O', question: 'Find the different letter!' }
    ]
  },
  {
    id: 10,
    worldId: 2,
    title: 'Picture to Alphabet (A-H)',
    subtitle: 'Connect each picture to its first starting letter!',
    badge: '🖼️ Level 10',
    icon: '🍎',
    type: 'match_picture',
    color: '#E11D48',
    bgGrad: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
    rounds: [
      {
        pairs: [
          { emoji: '🍎', word: 'Apple', letter: 'A' },
          { emoji: '🐱', word: 'Cat', letter: 'C' },
          { emoji: '🐶', word: 'Dog', letter: 'D' }
        ]
      },
      {
        pairs: [
          { emoji: '🐘', word: 'Elephant', letter: 'E' },
          { emoji: '🐟', word: 'Fish', letter: 'F' },
          { emoji: '🍇', word: 'Grapes', letter: 'G' }
        ]
      },
      {
        pairs: [
          { emoji: '⚽', word: 'Ball', letter: 'B' },
          { emoji: '🏠', word: 'House', letter: 'H' },
          { emoji: '🦆', word: 'Duck', letter: 'D' }
        ]
      }
    ]
  },
  {
    id: 11,
    worldId: 2,
    title: 'Counting Adventure (6-10)',
    subtitle: 'Count more delightful toys and animal buddies!',
    badge: '🔢 Level 11',
    icon: '🦁',
    type: 'count_items',
    color: '#06D6A0',
    bgGrad: 'linear-gradient(135deg, #06D6A0 0%, #1B9AAA 100%)',
    rounds: [
      { item: '🚗', name: 'Cars', count: 6, options: [5, 6, 7, 8] },
      { item: '🦁', name: 'Lions', count: 7, options: [6, 7, 8, 9] },
      { item: '🚀', name: 'Rockets', count: 8, options: [7, 8, 9, 10] },
      { item: '🍦', name: 'Ice Creams', count: 9, options: [8, 9, 7, 10] },
      { item: '🦋', name: 'Butterflies', count: 10, options: [8, 9, 10, 7] }
    ]
  },
  {
    id: 12,
    worldId: 2,
    title: 'Missing Phonics Letter (CVC)',
    subtitle: 'Spell the animal or object by filling the missing letter!',
    badge: '📖 Level 12',
    icon: '🐱',
    type: 'missing_letter',
    color: '#E63946',
    bgGrad: 'linear-gradient(135deg, #E63946 0%, #F4A261 100%)',
    rounds: [
      { word: 'C _ T', answer: 'A', full: 'CAT', icon: '🐱', hint: 'Meow! It is a cat!', options: ['A', 'O', 'U', 'E'] },
      { word: 'S _ N', answer: 'U', full: 'SUN', icon: '☀️', hint: 'Shining bright in the sky!', options: ['U', 'A', 'I', 'O'] },
      { word: 'D _ G', answer: 'O', full: 'DOG', icon: '🐶', hint: 'Woof woof! Loyal puppy!', options: ['O', 'A', 'U', 'I'] },
      { word: 'P _ N', answer: 'E', full: 'PEN', icon: '🖊️', hint: 'We write and draw with it!', options: ['E', 'A', 'U', 'O'] },
      { word: 'B _ X', answer: 'O', full: 'BOX', icon: '📦', hint: 'A gift comes inside it!', options: ['O', 'E', 'A', 'U'] }
    ]
  },
  {
    id: 13,
    worldId: 2,
    title: 'Tall, Short & Heavy (Opposites)',
    subtitle: 'Compare height and weight with fun animal buddies!',
    badge: '⚖️ Level 13',
    icon: '🦒',
    type: 'compare_opposites',
    color: '#0D9488',
    bgGrad: 'linear-gradient(135deg, #0D9488 0%, #0F766E 100%)',
    rounds: [
      {
        question: 'Which one is TALL?',
        target: 'Tall',
        cardA: { emoji: '🦒', label: 'Giraffe', value: 'Tall' },
        cardB: { emoji: '🐢', label: 'Turtle', value: 'Short' }
      },
      {
        question: 'Which one is SHORT?',
        target: 'Short',
        cardA: { emoji: '🌲', label: 'Pine Tree', value: 'Tall' },
        cardB: { emoji: '🍄', label: 'Mushroom', value: 'Short' }
      },
      {
        question: 'Which one is HEAVY?',
        target: 'Heavy',
        cardA: { emoji: GAME_SVGS.heavyRock, label: 'Heavy Rock', value: 'Heavy' },
        cardB: { emoji: GAME_SVGS.lightFeather, label: 'Light Feather', value: 'Light' }
      },
      {
        question: 'Which one is LIGHT?',
        target: 'Light',
        cardA: { emoji: '🎈', label: 'Party Balloon', value: 'Light' },
        cardB: { emoji: '⚓', label: 'Ship Anchor', value: 'Heavy' }
      },
      {
        question: 'Which one is TALL?',
        target: 'Tall',
        cardA: { emoji: '🗼', label: 'Tall Tower', value: 'Tall' },
        cardB: { emoji: '⛺', label: 'Small Tent', value: 'Short' }
      }
    ]
  },
  {
    id: 14,
    worldId: 2,
    title: 'In-Between Alphabet (K-T)',
    subtitle: 'Spot the missing letter hopping between friends!',
    badge: '🔤 Level 14',
    icon: '🚂',
    type: 'between_alpha',
    color: '#8B5CF6',
    bgGrad: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    rounds: [
      { before: 'J', after: 'L', answer: 'K', options: ['M', 'K', 'I', 'N'], phonic: 'K is for Kangaroo 🦘' },
      { before: 'L', after: 'N', answer: 'M', options: ['O', 'L', 'M', 'K'], phonic: 'M is for Monkey 🐵' },
      { before: 'N', after: 'P', answer: 'O', options: ['Q', 'O', 'P', 'R'], phonic: 'O is for Owl 🦉' },
      { before: 'P', after: 'R', answer: 'Q', options: ['S', 'P', 'Q', 'T'], phonic: 'Q is for Queen 👑' },
      { before: 'R', after: 'T', answer: 'S', options: ['U', 'R', 'S', 'Q'], phonic: 'S is for Star ⭐' }
    ]
  },
  {
    id: 15,
    worldId: 2,
    title: 'Next Alphabet (N-Z)',
    subtitle: 'Keep the alphabet train chugging along to the end!',
    badge: '🔤 Level 15',
    icon: '🚂',
    type: 'next_alpha',
    color: '#9B5DE5',
    bgGrad: 'linear-gradient(135deg, #9B5DE5 0%, #F15BB5 100%)',
    rounds: [
      { seq: ['N', 'O', 'P'], answer: 'Q', options: ['Q', 'R', 'P', 'S'], phonic: 'Q is for Queen 👑' },
      { seq: ['P', 'Q', 'R'], answer: 'S', options: ['T', 'S', 'U', 'R'], phonic: 'S is for Sun ☀️' },
      { seq: ['S', 'T', 'U'], answer: 'V', options: ['W', 'V', 'X', 'T'], phonic: 'V is for Van 🚐' },
      { seq: ['W', 'X', 'Y'], answer: 'Z', options: ['Z', 'A', 'X', 'W'], phonic: 'Z is for Zebra 🦓' },
      { seq: ['m', 'n', 'o'], answer: 'p', options: ['p', 'q', 'r', 'o'], phonic: 'P is for Penguin 🐧' }
    ]
  },

  /* ====================================================================
     WORLD 3: ADVENTURE ACADEMY (LEVELS 16 - 22)
     ==================================================================== */
  {
    id: 16,
    worldId: 3,
    title: 'What Number Next? (1-10)',
    subtitle: 'Hop along the colorful number stepping stones!',
    badge: '🔢 Level 16',
    icon: '1️⃣',
    type: 'next_num',
    color: '#F77F00',
    bgGrad: 'linear-gradient(135deg, #F77F00 0%, #FCBF49 100%)',
    rounds: [
      { seq: [1, 2, 3], answer: 4, options: [4, 5, 2, 3] },
      { seq: [4, 5, 6], answer: 7, options: [6, 7, 8, 9] },
      { seq: [7, 8, 9], answer: 10, options: [9, 10, 8, 6] },
      { seq: [2, 3, 4], answer: 5, options: [5, 6, 3, 7] },
      { seq: [5, 6, 7], answer: 8, options: [7, 8, 9, 10] }
    ]
  },
  {
    id: 17,
    worldId: 3,
    title: 'In-Between Numbers (10-20)',
    subtitle: 'Find the secret teen number hidden in between!',
    badge: '🔢 Level 17',
    icon: '🔢',
    type: 'between_num',
    color: '#F59E0B',
    bgGrad: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    rounds: [
      { before: 10, after: 12, answer: 11, options: [11, 13, 9, 12], hint: 'What number is between 10 and 12?' },
      { before: 12, after: 14, answer: 13, options: [15, 11, 13, 14], hint: 'What number is between 12 and 14?' },
      { before: 14, after: 16, answer: 15, options: [17, 15, 13, 16], hint: 'What number is between 14 and 16?' },
      { before: 16, after: 18, answer: 17, options: [19, 15, 17, 18], hint: 'What number is between 16 and 18?' },
      { before: 18, after: 20, answer: 19, options: [17, 19, 21, 20], hint: 'What number is between 18 and 20?' }
    ]
  },
  {
    id: 18,
    worldId: 3,
    title: 'Color Detective',
    subtitle: 'Identify more delightful colors in nature and treats!',
    badge: '🎨 Level 18',
    icon: '🍇',
    type: 'identify_color',
    color: '#9333EA',
    bgGrad: 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)',
    rounds: [
      { item: '🍇', name: 'Grapes', answer: 'Purple', hex: '#A855F7', options: ['Purple', 'Green', 'Orange', 'Red'] },
      { item: '🦩', name: 'Flamingo', answer: 'Pink', hex: '#EC4899', options: ['Blue', 'Pink', 'Yellow', 'Green'] },
      { item: '🍫', name: 'Chocolate Bar', answer: 'Brown', hex: '#78350F', options: ['Black', 'Brown', 'Purple', 'Red'] },
      { item: GAME_SVGS.blackCrow, name: 'Crow', answer: 'Black', hex: '#1E293B', options: ['Blue', 'Black', 'Brown', 'Green'] },
      { item: '⛄', name: 'Snowman', answer: 'White', hex: '#F8FAFC', options: ['Yellow', 'White', 'Pink', 'Blue'] }
    ]
  },
  {
    id: 19,
    worldId: 3,
    title: 'Match Big & Small (I-P)',
    subtitle: 'Pair up 4 Capital and Small letter buddies!',
    badge: '🧩 Level 19',
    icon: 'Ii',
    type: 'match_letters',
    color: '#3A86FF',
    bgGrad: 'linear-gradient(135deg, #3A86FF 0%, #00F5D4 100%)',
    rounds: [
      {
        pairs: [
          { upper: 'I', lower: 'i', word: 'Ice Cream 🍦' },
          { upper: 'J', lower: 'j', word: 'Juice 🧃' },
          { upper: 'K', lower: 'k', word: 'Kite 🪁' },
          { upper: 'L', lower: 'l', word: 'Lion 🦁' }
        ]
      },
      {
        pairs: [
          { upper: 'M', lower: 'm', word: 'Moon 🌙' },
          { upper: 'N', lower: 'n', word: 'Nut 🥜' },
          { upper: 'O', lower: 'o', word: 'Orange 🍊' },
          { upper: 'P', lower: 'p', word: 'Panda 🐼' }
        ]
      },
      {
        pairs: [
          { upper: 'I', lower: 'i', word: 'Igloo 🧊' },
          { upper: 'K', lower: 'k', word: 'Koala 🐨' },
          { upper: 'L', lower: 'l', word: 'Lemon 🍋' },
          { upper: 'M', lower: 'm', word: 'Monkey 🐵' }
        ]
      }
    ]
  },
  {
    id: 20,
    worldId: 3,
    title: 'Shape Detective',
    subtitle: 'Find diamond kites, chalkboard rectangles, and star trophies!',
    badge: '🔷 Level 20',
    icon: '🪁',
    type: 'identify_shape',
    color: '#0891B2',
    bgGrad: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
    rounds: [
      { item: '🪁', name: 'Flying Kite', answer: 'Diamond', icon: '🔷', options: ['Circle', 'Diamond', 'Triangle', 'Square'] },
      { item: '📋', name: 'School Chalkboard', answer: 'Rectangle', icon: '▭', options: ['Square', 'Rectangle', 'Circle', 'Star'] },
      { item: '⏰', name: 'Wall Clock', answer: 'Circle', icon: '⭕', options: ['Triangle', 'Circle', 'Diamond', 'Rectangle'] },
      { item: GAME_SVGS.cutSandwich, name: 'Cut Sandwich', answer: 'Triangle', icon: '🔺', options: ['Square', 'Circle', 'Triangle', 'Diamond'] },
      { item: '🧇', name: 'Square Waffle', answer: 'Square', icon: '⏹️', options: ['Square', 'Circle', 'Rectangle', 'Star'] }
    ]
  },
  {
    id: 21,
    worldId: 3,
    title: 'Tricky Odd One Out',
    subtitle: 'Look closely at letters and numbers that look similar!',
    badge: '🔍 Level 21',
    icon: '🧐',
    type: 'odd_one_out',
    color: '#D97706',
    bgGrad: 'linear-gradient(135deg, #D97706 0%, #B45309 100%)',
    rounds: [
      { items: ['6', '6', '6', '9', '6'], answer: '9', question: 'Find the upside-down number!' },
      { items: ['p', 'p', 'q', 'p', 'p'], answer: 'q', question: 'Spot the flipped letter!' },
      { items: ['M', 'M', 'W', 'M', 'M'], answer: 'W', question: 'Find the upside-down letter!' },
      { items: ['b', 'd', 'b', 'b', 'b'], answer: 'd', question: 'Spot the flipped letter!' },
      { items: ['⭐', '⭐', '⭐', '🌟', '⭐'], answer: '🌟', question: 'Find the glowing star!' }
    ]
  },
  {
    id: 22,
    worldId: 3,
    title: 'Word Builder (4-Letters)',
    subtitle: 'Solve tricky 4-letter words with missing phonics letters!',
    badge: '📖 Level 22',
    icon: '🐸',
    type: 'missing_letter',
    color: '#EC4899',
    bgGrad: 'linear-gradient(135deg, #EC4899 0%, #8B5CF6 100%)',
    rounds: [
      { word: 'F R _ G', answer: 'O', full: 'FROG', icon: '🐸', hint: 'Ribbit! Hops near the pond!', options: ['O', 'A', 'U', 'E'] },
      { word: 'D _ C K', answer: 'U', full: 'DUCK', icon: '🦆', hint: 'Quack quack! Swims in the pond!', options: ['U', 'O', 'I', 'A'] },
      { word: 'B _ R D', answer: 'I', full: 'BIRD', icon: '🐦', hint: 'Chirp chirp! Sings in the tree!', options: ['I', 'E', 'A', 'O'] },
      { word: 'K _ N G', answer: 'I', full: 'KING', icon: '👑', hint: 'Wears a shiny golden crown!', options: ['I', 'A', 'O', 'E'] },
      { word: 'B _ A T', answer: 'O', full: 'BOAT', icon: '⛵', hint: 'Sails across the sunny ocean!', options: ['O', 'U', 'E', 'A'] }
    ]
  },

  /* ====================================================================
     WORLD 4: BRAINY CHAMPIONS (LEVELS 23 - 29)
     ==================================================================== */
  {
    id: 23,
    worldId: 4,
    title: 'Skip Counting (2s & 5s)',
    subtitle: 'Hop by twos and fives to discover the next number!',
    badge: '🦘 Level 23',
    icon: '🦘',
    type: 'next_num',
    color: '#0EA5E9',
    bgGrad: 'linear-gradient(135deg, #0EA5E9 0%, #3B82F6 100%)',
    rounds: [
      { seq: [2, 4, 6], answer: 8, options: [8, 7, 9, 10] },
      { seq: [4, 6, 8], answer: 10, options: [9, 10, 11, 12] },
      { seq: [5, 10, 15], answer: 20, options: [18, 20, 25, 16] },
      { seq: [10, 12, 14], answer: 16, options: [15, 16, 17, 18] },
      { seq: [10, 15, 20], answer: 25, options: [22, 24, 25, 30] }
    ]
  },
  {
    id: 24,
    worldId: 4,
    title: 'Picture to Alphabet (I-P)',
    subtitle: 'Match animals and objects to their starting letter!',
    badge: '🖼️ Level 24',
    icon: '🦁',
    type: 'match_picture',
    color: '#6366F1',
    bgGrad: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    rounds: [
      {
        pairs: [
          { emoji: '🍦', word: 'Ice Cream', letter: 'I' },
          { emoji: '🪁', word: 'Kite', letter: 'K' },
          { emoji: '🦁', word: 'Lion', letter: 'L' },
          { emoji: '🐵', word: 'Monkey', letter: 'M' }
        ]
      },
      {
        pairs: [
          { emoji: '👃', word: 'Nose', letter: 'N' },
          { emoji: '🍊', word: 'Orange', letter: 'O' },
          { emoji: '🐼', word: 'Panda', letter: 'P' },
          { emoji: '🧃', word: 'Juice', letter: 'J' }
        ]
      },
      {
        pairs: [
          { emoji: '🌙', word: 'Moon', letter: 'M' },
          { emoji: '🍋', word: 'Lemon', letter: 'L' },
          { emoji: '🦜', word: 'Parrot', letter: 'P' },
          { emoji: '🔑', word: 'Key', letter: 'K' }
        ]
      }
    ]
  },
  {
    id: 25,
    worldId: 4,
    title: 'Counting Big Groups (11-15)',
    subtitle: 'Count larger bunches of colorful gems and sweet treats!',
    badge: '🔢 Level 25',
    icon: '🧁',
    type: 'count_items',
    color: '#10B981',
    bgGrad: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    rounds: [
      { item: '🧁', name: 'Cupcakes', count: 11, options: [10, 11, 12, 13] },
      { item: '🍬', name: 'Candies', count: 12, options: [11, 12, 13, 14] },
      { item: '💎', name: 'Gems', count: 13, options: [12, 13, 14, 15] },
      { item: '🌸', name: 'Flowers', count: 14, options: [13, 14, 15, 12] },
      { item: '🍕', name: 'Pizza Slices', count: 15, options: [13, 14, 15, 16] }
    ]
  },
  {
    id: 26,
    worldId: 4,
    title: 'Hard, Soft & Fast (Opposites)',
    subtitle: 'Feel the touch and speed with cool opposite cards!',
    badge: '⚖️ Level 26',
    icon: '🧱',
    type: 'compare_opposites',
    color: '#CA8A04',
    bgGrad: 'linear-gradient(135deg, #CA8A04 0%, #A16207 100%)',
    rounds: [
      {
        question: 'Which one is HARD?',
        target: 'Hard',
        cardA: { emoji: '🧱', label: 'Hard Brick', value: 'Hard' },
        cardB: { emoji: '🧸', label: 'Soft Teddy', value: 'Soft' }
      },
      {
        question: 'Which one is SOFT?',
        target: 'Soft',
        cardA: { emoji: '☁️', label: 'Fluffy Cloud', value: 'Soft' },
        cardB: { emoji: '🔨', label: 'Iron Hammer', value: 'Hard' }
      },
      {
        question: 'Which one is FAST?',
        target: 'Fast',
        cardA: { emoji: '🐆', label: 'Cheetah', value: 'Fast' },
        cardB: { emoji: '🐌', label: 'Snail', value: 'Slow' }
      },
      {
        question: 'Which one is SLOW?',
        target: 'Slow',
        cardA: { emoji: '🚀', label: 'Space Rocket', value: 'Fast' },
        cardB: { emoji: '🦥', label: 'Cute Sloth', value: 'Slow' }
      },
      {
        question: 'Which one is HOT?',
        target: 'Hot',
        cardA: { emoji: '🔥', label: 'Campfire', value: 'Hot' },
        cardB: { emoji: '🧊', label: 'Ice Cube', value: 'Cold' }
      }
    ]
  },
  {
    id: 27,
    worldId: 4,
    title: 'Master Letter Match (Q-Z)',
    subtitle: 'Match 4 Capital and Small letter buddies from Q to Z!',
    badge: '🧩 Level 27',
    icon: 'Qq',
    type: 'match_letters',
    color: '#7209B7',
    bgGrad: 'linear-gradient(135deg, #7209B7 0%, #4361EE 100%)',
    rounds: [
      {
        pairs: [
          { upper: 'Q', lower: 'q', word: 'Queen 👑' },
          { upper: 'R', lower: 'r', word: 'Red Rose 🌹' },
          { upper: 'S', lower: 's', word: 'Yellow Sun ☀️' },
          { upper: 'T', lower: 't', word: 'Tiger 🐯' }
        ]
      },
      {
        pairs: [
          { upper: 'U', lower: 'u', word: 'Blue Umbrella ☂️' },
          { upper: 'V', lower: 'v', word: 'Violin 🎻' },
          { upper: 'W', lower: 'w', word: 'Watermelon 🍉' },
          { upper: 'Y', lower: 'y', word: 'Yellow Yoyo 🪀' }
        ]
      },
      {
        pairs: [
          { upper: 'Q', lower: 'q', word: 'Quilt 🧵' },
          { upper: 'S', lower: 's', word: 'Golden Star ⭐' },
          { upper: 'W', lower: 'w', word: 'Watch ⌚' },
          { upper: 'Z', lower: 'z', word: 'Zebra 🦓' }
        ]
      }
    ]
  },
  {
    id: 28,
    worldId: 4,
    title: 'In-Between Tricky Letters (U-Z & Mix)',
    subtitle: 'Master the ending letters and lowercase letter bridges!',
    badge: '🔤 Level 28',
    icon: '🌉',
    type: 'between_alpha',
    color: '#EC4899',
    bgGrad: 'linear-gradient(135deg, #EC4899 0%, #DB2777 100%)',
    rounds: [
      { before: 'U', after: 'W', answer: 'V', options: ['X', 'V', 'T', 'U'], phonic: 'V is for Van 🚐' },
      { before: 'W', after: 'Y', answer: 'X', options: ['Z', 'W', 'X', 'V'], phonic: 'X is for Xylophone 🎶' },
      { before: 'X', after: 'Z', answer: 'Y', options: ['W', 'Y', 'A', 'Z'], phonic: 'Y is for Yoyo 🪀' },
      { before: 'b', after: 'd', answer: 'c', options: ['e', 'a', 'c', 'd'], phonic: 'C is for Cat 🐱' },
      { before: 'p', after: 'r', answer: 'q', options: ['s', 'o', 'q', 'p'], phonic: 'Q is for Quilt 🧵' }
    ]
  },
  {
    id: 29,
    worldId: 4,
    title: 'Phonics Superstar',
    subtitle: 'Spell cool animals and objects by solving the missing letter!',
    badge: '📖 Level 29',
    icon: '🦁',
    type: 'missing_letter',
    color: '#DC2626',
    bgGrad: 'linear-gradient(135deg, #DC2626 0%, #B91C1C 100%)',
    rounds: [
      { word: 'L _ O N', answer: 'I', full: 'LION', icon: '🦁', hint: 'Roar! King of the jungle!', options: ['I', 'E', 'O', 'A'] },
      { word: 'M _ O N', answer: 'O', full: 'MOON', icon: '🌙', hint: 'Glows in the night sky!', options: ['O', 'U', 'A', 'E'] },
      { word: 'B _ A R', answer: 'E', full: 'BEAR', icon: '🐻', hint: 'Loves sweet honey!', options: ['E', 'I', 'O', 'U'] },
      { word: 'S T _ R', answer: 'A', full: 'STAR', icon: '⭐', hint: 'Twinkles bright in the dark!', options: ['A', 'E', 'I', 'O'] },
      { word: 'K _ T E', answer: 'I', full: 'KITE', icon: '🪁', hint: 'Flies high in the wind!', options: ['I', 'A', 'O', 'U'] }
    ]
  },

  /* ====================================================================
     WORLD 5: GRAND MASTER LEGENDS (LEVELS 30 - 36)
     ==================================================================== */
  {
    id: 30,
    worldId: 5,
    title: 'Skip Counting by 10s',
    subtitle: 'Count big leaps of 10 like a counting rocket!',
    badge: '🦘 Level 30',
    icon: '🔟',
    type: 'next_num',
    color: '#2563EB',
    bgGrad: 'linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)',
    rounds: [
      { seq: [10, 20, 30], answer: 40, options: [35, 40, 45, 50] },
      { seq: [20, 30, 40], answer: 50, options: [45, 50, 55, 60] },
      { seq: [30, 40, 50], answer: 60, options: [55, 60, 65, 70] },
      { seq: [40, 50, 60], answer: 70, options: [65, 70, 75, 80] },
      { seq: [50, 60, 70], answer: 80, options: [75, 80, 85, 90] }
    ]
  },
  {
    id: 31,
    worldId: 5,
    title: 'In-Between Big Numbers (20-50)',
    subtitle: 'Bridge the gap between bigger numbers like a math champion!',
    badge: '🔢 Level 31',
    icon: '🚀',
    type: 'between_num',
    color: '#3B82F6',
    bgGrad: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    rounds: [
      { before: 21, after: 23, answer: 22, options: [24, 22, 20, 23], hint: 'What number is between 21 and 23?' },
      { before: 28, after: 30, answer: 29, options: [31, 27, 29, 30], hint: 'What number is between 28 and 30?' },
      { before: 34, after: 36, answer: 35, options: [33, 35, 37, 36], hint: 'What number is between 34 and 36?' },
      { before: 41, after: 43, answer: 42, options: [40, 44, 42, 43], hint: 'What number is between 41 and 43?' },
      { before: 47, after: 49, answer: 48, options: [50, 46, 48, 49], hint: 'What number is between 47 and 49?' }
    ]
  },
  {
    id: 32,
    worldId: 5,
    title: 'Picture to Alphabet Master (Q-Z)',
    subtitle: 'Match 4 magical objects to their starting letters!',
    badge: '🖼️ Level 32',
    icon: '🦄',
    type: 'match_picture',
    color: '#7C3AED',
    bgGrad: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    rounds: [
      {
        pairs: [
          { emoji: '👑', word: 'Queen', letter: 'Q' },
          { emoji: '🌹', word: 'Rose', letter: 'R' },
          { emoji: '☀️', word: 'Sun', letter: 'S' },
          { emoji: '🐯', word: 'Tiger', letter: 'T' }
        ]
      },
      {
        pairs: [
          { emoji: '☂️', word: 'Umbrella', letter: 'U' },
          { emoji: '🚐', word: 'Van', letter: 'V' },
          { emoji: '🍉', word: 'Watermelon', letter: 'W' },
          { emoji: '⛵', word: 'Yacht', letter: 'Y' }
        ]
      },
      {
        pairs: [
          { emoji: '🦄', word: 'Unicorn', letter: 'U' },
          { emoji: '⌚', word: 'Watch', letter: 'W' },
          { emoji: '🦓', word: 'Zebra', letter: 'Z' },
          { emoji: '👸', word: 'Queen', letter: 'Q' }
        ]
      }
    ]
  },
  {
    id: 33,
    worldId: 5,
    title: 'Super Visual Sleuth',
    subtitle: 'Spot the trickiest odd-one-out patterns like a real detective!',
    badge: '🔍 Level 33',
    icon: '🕵️',
    type: 'odd_one_out',
    color: '#0D9488',
    bgGrad: 'linear-gradient(135deg, #0D9488 0%, #047857 100%)',
    rounds: [
      { items: ['10', '10', '01', '10', '10'], answer: '01', question: 'Find the backward number!' },
      { items: ['b', 'b', 'd', 'b', 'b'], answer: 'd', question: 'Spot the different letter!' },
      { items: ['🔵', '🔵', '🔴', '🔵', '🔵'], answer: '🔴', question: 'Find the different colored circle!' },
      { items: ['N', 'N', 'Z', 'N', 'N'], answer: 'Z', question: 'Spot the rotated letter!' },
      { items: ['20', '20', '20', '22', '20'], answer: '22', question: 'Spot the odd number!' }
    ]
  },
  {
    id: 34,
    worldId: 5,
    title: 'Mega Counting (16-20)',
    subtitle: 'Count big clusters of shining stars and flying butterflies!',
    badge: '🔢 Level 34',
    icon: '🌟',
    type: 'count_items',
    color: '#059669',
    bgGrad: 'linear-gradient(135deg, #059669 0%, #047857 100%)',
    rounds: [
      { item: '🌟', name: 'Golden Stars', count: 16, options: [14, 15, 16, 17] },
      { item: '🎈', name: 'Balloons', count: 17, options: [15, 16, 17, 18] },
      { item: '🦋', name: 'Butterflies', count: 18, options: [16, 17, 18, 19] },
      { item: '🍬', name: 'Candies', count: 19, options: [17, 18, 19, 20] },
      { item: '⭐', name: 'Superstars', count: 20, options: [18, 19, 20, 16] }
    ]
  },
  {
    id: 35,
    worldId: 5,
    title: '5-Letter Word Challenge',
    subtitle: 'Spell big 5-letter words by choosing the missing letter!',
    badge: '📖 Level 35',
    icon: '🚂',
    type: 'missing_letter',
    color: '#E11D48',
    bgGrad: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
    rounds: [
      { word: 'T R _ I N', answer: 'A', full: 'TRAIN', icon: '🚂', hint: 'Choo choo! Chugs on the railway tracks!', options: ['A', 'E', 'I', 'O'] },
      { word: 'S M _ L E', answer: 'I', full: 'SMILE', icon: '😊', hint: 'Show your happy smiling face!', options: ['I', 'Y', 'E', 'O'] },
      { word: 'C L _ U D', answer: 'O', full: 'CLOUD', icon: '☁️', hint: 'Floats fluffy in the blue sky!', options: ['O', 'A', 'U', 'I'] },
      { word: 'P L _ N T', answer: 'A', full: 'PLANT', icon: '🌱', hint: 'Grows green with lovely leaves!', options: ['A', 'E', 'I', 'O'] },
      { word: 'H _ U S E', answer: 'O', full: 'HOUSE', icon: '🏠', hint: 'Our warm and cozy home!', options: ['O', 'A', 'E', 'U'] }
    ]
  },
  {
    id: 36,
    worldId: 5,
    title: 'Ultimate Academy Champion',
    subtitle: 'The Grand Finale! Master skip counting, big words, and alphabet loops!',
    badge: '👑 Level 36 (Grand Finale)',
    icon: '👑',
    type: 'mixed_champion',
    color: '#F59E0B',
    bgGrad: 'linear-gradient(135deg, #F59E0B 0%, #EF4444 100%)',
    rounds: [
      {
        subType: 'next_num',
        seq: [10, 20, 30],
        answer: 40,
        options: [35, 40, 45, 50],
        hint: 'Skip counting by 10! What comes next?'
      },
      {
        subType: 'identify_color',
        item: '🌈',
        name: 'Sun in Rainbow Sky',
        answer: 'Yellow',
        hex: '#EAB308',
        options: ['Yellow', 'Green', 'Red', 'Blue'],
        hint: 'What color is the warm bright sun?'
      },
      {
        subType: 'missing_letter',
        word: 'T R _ I N',
        answer: 'A',
        full: 'TRAIN',
        icon: '🚂',
        hint: 'Choo choo! Chugs on the railway tracks!',
        options: ['A', 'E', 'I', 'O']
      },
      {
        subType: 'count_items',
        item: '⭐',
        name: 'Super Stars',
        count: 16,
        options: [14, 15, 16, 17]
      },
      {
        subType: 'next_alpha',
        seq: ['X', 'Y', 'Z'],
        answer: 'A',
        options: ['A', 'B', 'W', 'Z'],
        hint: 'The alphabet loops back to the start!',
        phonic: 'A is for Apple 🍎'
      }
    ]
  }
];

// Attach to window
window.LETTER_COLOR_PALETTE = LETTER_COLOR_PALETTE;
window.GAME_SVGS = GAME_SVGS;
window.GAME_WORLDS = GAME_WORLDS;
window.GAME_LEVELS = GAME_LEVELS;
