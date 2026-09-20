/**
 * Study With Fun - Pre-Primary Comprehensive Game Data
 * 30 Progressive Levels across 5 Themed Worlds (90 Stars Total)
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

// 5 Progressive Worlds Metadata
const GAME_WORLDS = [
  {
    id: 1,
    name: 'Discovery Garden',
    range: 'Levels 1 – 6',
    icon: '🌱',
    color: '#10B981',
    bgGrad: 'linear-gradient(135deg, #10B981 0%, #059669 100%)',
    desc: 'Explore early ABCs, bright colors, friendly shapes, and 1-5 counting!'
  },
  {
    id: 2,
    name: 'Junior Explorers',
    range: 'Levels 7 – 12',
    icon: '🚀',
    color: '#3B82F6',
    bgGrad: 'linear-gradient(135deg, #3B82F6 0%, #1D4ED8 100%)',
    desc: 'Uncover picture matches, odd-one-out detectives, and 3-letter CVC phonics!'
  },
  {
    id: 3,
    name: 'Adventure Academy',
    range: 'Levels 13 – 18',
    icon: '🏝️',
    color: '#8B5CF6',
    bgGrad: 'linear-gradient(135deg, #8B5CF6 0%, #6D28D9 100%)',
    desc: 'Master number stepping stones, 4-5 letter pairs, and shape mysteries!'
  },
  {
    id: 4,
    name: 'Brainy Champions',
    range: 'Levels 19 – 24',
    icon: '🏰',
    color: '#EC4899',
    bgGrad: 'linear-gradient(135deg, #EC4899 0%, #BE185D 100%)',
    desc: 'Hop through skip-counting, tricky look-alike letters, and 4-letter words!'
  },
  {
    id: 5,
    name: 'Grand Master Legends',
    range: 'Levels 25 – 30',
    icon: '👑',
    color: '#F59E0B',
    bgGrad: 'linear-gradient(135deg, #F59E0B 0%, #D97706 100%)',
    desc: 'The Ultimate Grand Trophy! Conquer all skills to become an official Graduate!'
  }
];

// 30 Comprehensive Pre-Primary Levels
const GAME_LEVELS = [
  /* ====================================================================
     WORLD 1: DISCOVERY GARDEN (LEVELS 1 - 6)
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
    title: 'World of Colors',
    subtitle: 'Discover what bright color each yummy fruit and friend has!',
    badge: '🎨 Level 2',
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
    id: 3,
    worldId: 1,
    title: 'Counting Numbers (1-5)',
    subtitle: 'Count the cute items and tap the right number!',
    badge: '🔢 Level 3',
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
    id: 4,
    worldId: 1,
    title: 'Fun with Shapes',
    subtitle: 'Identify round circles, sturdy squares, and yummy pizza triangles!',
    badge: '🔷 Level 4',
    icon: '⭕',
    type: 'identify_shape',
    color: '#06D6A0',
    bgGrad: 'linear-gradient(135deg, #06D6A0 0%, #118AB2 100%)',
    rounds: [
      { item: '🛞', name: 'Car Wheel', answer: 'Circle', icon: '⭕', options: ['Circle', 'Square', 'Triangle', 'Star'] },
      { item: '🎁', name: 'Gift Box', answer: 'Square', icon: '⏹️', options: ['Triangle', 'Square', 'Circle', 'Rectangle'] },
      { item: '🍕', name: 'Pizza Slice', answer: 'Triangle', icon: '🔺', options: ['Circle', 'Star', 'Triangle', 'Square'] },
      { item: '🚪', name: 'Room Door', answer: 'Rectangle', icon: '▭', options: ['Rectangle', 'Circle', 'Square', 'Diamond'] },
      { item: '⭐', name: 'Night Star', answer: 'Star', icon: '⭐', options: ['Square', 'Star', 'Triangle', 'Circle'] }
    ]
  },
  {
    id: 5,
    worldId: 1,
    title: 'Big or Small? (Opposites)',
    subtitle: 'Compare two buddies and choose which is Big or Small!',
    badge: '⚖️ Level 5',
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
    id: 6,
    worldId: 1,
    title: 'Match Big & Small (A-H)',
    subtitle: 'Connect Capital and Small letters together!',
    badge: '🧩 Level 6',
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
     WORLD 2: JUNIOR EXPLORERS (LEVELS 7 - 12)
     ==================================================================== */
  {
    id: 7,
    worldId: 2,
    title: 'Spot the Odd One Out',
    subtitle: 'Can you spot which one is different in the row?',
    badge: '🔍 Level 7',
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
    id: 8,
    worldId: 2,
    title: 'Picture to Alphabet (A-H)',
    subtitle: 'Connect each picture to its first starting letter!',
    badge: '🖼️ Level 8',
    icon: '🍎',
    type: 'match_picture',
    color: '#E11D48',
    bgGrad: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
    rounds: [
      {
        pairs: [
          { item: '🍎 Apple', letter: 'A' },
          { item: '🐱 Cat', letter: 'C' },
          { item: '🐶 Dog', letter: 'D' }
        ]
      },
      {
        pairs: [
          { item: '🐘 Elephant', letter: 'E' },
          { item: '🐟 Fish', letter: 'F' },
          { item: '🍇 Grapes', letter: 'G' }
        ]
      },
      {
        pairs: [
          { item: '⚽ Ball', letter: 'B' },
          { item: '🏠 House', letter: 'H' },
          { item: '🦆 Duck', letter: 'D' }
        ]
      }
    ]
  },
  {
    id: 9,
    worldId: 2,
    title: 'Counting Adventure (6-10)',
    subtitle: 'Count more delightful toys and animal buddies!',
    badge: '🔢 Level 9',
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
    id: 10,
    worldId: 2,
    title: 'Missing Phonics Letter (CVC)',
    subtitle: 'Spell the animal or object by filling the missing letter!',
    badge: '📖 Level 10',
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
    id: 11,
    worldId: 2,
    title: 'Tall, Short & Heavy (Opposites)',
    subtitle: 'Compare height and weight with fun animal buddies!',
    badge: '⚖️ Level 11',
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
        cardA: { emoji: '🪨', label: 'Heavy Rock', value: 'Heavy' },
        cardB: { emoji: '🪶', label: 'Light Feather', value: 'Light' }
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
    id: 12,
    worldId: 2,
    title: 'Next Alphabet (N-Z)',
    subtitle: 'Keep the alphabet train chugging along to the end!',
    badge: '🔤 Level 12',
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
     WORLD 3: ADVENTURE ACADEMY (LEVELS 13 - 18)
     ==================================================================== */
  {
    id: 13,
    worldId: 3,
    title: 'What Number Next? (1-10)',
    subtitle: 'Hop along the colorful number stepping stones!',
    badge: '🔢 Level 13',
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
    id: 14,
    worldId: 3,
    title: 'Color Detective',
    subtitle: 'Identify more delightful colors in nature and treats!',
    badge: '🎨 Level 14',
    icon: '🍇',
    type: 'identify_color',
    color: '#9333EA',
    bgGrad: 'linear-gradient(135deg, #9333EA 0%, #7E22CE 100%)',
    rounds: [
      { item: '🍇', name: 'Grapes', answer: 'Purple', hex: '#A855F7', options: ['Purple', 'Green', 'Orange', 'Red'] },
      { item: '🦩', name: 'Flamingo', answer: 'Pink', hex: '#EC4899', options: ['Blue', 'Pink', 'Yellow', 'Green'] },
      { item: '🍫', name: 'Chocolate Bar', answer: 'Brown', hex: '#78350F', options: ['Black', 'Brown', 'Purple', 'Red'] },
      { item: '🐦‍⬛', name: 'Crow', answer: 'Black', hex: '#1E293B', options: ['Blue', 'Black', 'Brown', 'Green'] },
      { item: '⛄', name: 'Snowman', answer: 'White', hex: '#F8FAFC', options: ['Yellow', 'White', 'Pink', 'Blue'] }
    ]
  },
  {
    id: 15,
    worldId: 3,
    title: 'Match Big & Small (I-P)',
    subtitle: 'Pair up 4 Capital and Small letter buddies!',
    badge: '🧩 Level 15',
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
          { upper: 'N', lower: 'n', word: 'Nest 🪺' },
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
    id: 16,
    worldId: 3,
    title: 'Shape Detective',
    subtitle: 'Find diamond kites, chalkboard rectangles, and star trophies!',
    badge: '🔷 Level 16',
    icon: '🪁',
    type: 'identify_shape',
    color: '#0891B2',
    bgGrad: 'linear-gradient(135deg, #0891B2 0%, #0E7490 100%)',
    rounds: [
      { item: '🪁', name: 'Flying Kite', answer: 'Diamond', icon: '🔷', options: ['Circle', 'Diamond', 'Triangle', 'Square'] },
      { item: '📋', name: 'School Chalkboard', answer: 'Rectangle', icon: '▭', options: ['Square', 'Rectangle', 'Circle', 'Star'] },
      { item: '⏰', name: 'Wall Clock', answer: 'Circle', icon: '⭕', options: ['Triangle', 'Circle', 'Diamond', 'Rectangle'] },
      { item: '🥪', name: 'Cut Sandwich', answer: 'Triangle', icon: '🔺', options: ['Square', 'Circle', 'Triangle', 'Diamond'] },
      { item: '🧇', name: 'Square Waffle', answer: 'Square', icon: '⏹️', options: ['Square', 'Circle', 'Rectangle', 'Star'] }
    ]
  },
  {
    id: 17,
    worldId: 3,
    title: 'Tricky Odd One Out',
    subtitle: 'Look closely at letters and numbers that look similar!',
    badge: '🔍 Level 17',
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
    id: 18,
    worldId: 3,
    title: 'Word Builder (4-Letters)',
    subtitle: 'Solve tricky 4-letter words with missing phonics letters!',
    badge: '📖 Level 18',
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
     WORLD 4: BRAINY CHAMPIONS (LEVELS 19 - 24)
     ==================================================================== */
  {
    id: 19,
    worldId: 4,
    title: 'Skip Counting (2s & 5s)',
    subtitle: 'Hop by twos and fives to discover the next number!',
    badge: '🦘 Level 19',
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
    id: 20,
    worldId: 4,
    title: 'Picture to Alphabet (I-P)',
    subtitle: 'Match animals and objects to their starting letter!',
    badge: '🖼️ Level 20',
    icon: '🦁',
    type: 'match_picture',
    color: '#6366F1',
    bgGrad: 'linear-gradient(135deg, #6366F1 0%, #4F46E5 100%)',
    rounds: [
      {
        pairs: [
          { item: '🍦 Ice Cream', letter: 'I' },
          { item: '🪁 Kite', letter: 'K' },
          { item: '🦁 Lion', letter: 'L' },
          { item: '🐵 Monkey', letter: 'M' }
        ]
      },
      {
        pairs: [
          { item: '🪺 Nest', letter: 'N' },
          { item: '🍊 Orange', letter: 'O' },
          { item: '🐼 Panda', letter: 'P' },
          { item: '🧃 Juice', letter: 'J' }
        ]
      },
      {
        pairs: [
          { item: '🌙 Moon', letter: 'M' },
          { item: '🍋 Lemon', letter: 'L' },
          { item: '🦜 Parrot', letter: 'P' },
          { item: '🐨 Koala', letter: 'K' }
        ]
      }
    ]
  },
  {
    id: 21,
    worldId: 4,
    title: 'Counting Big Groups (11-15)',
    subtitle: 'Count larger bunches of colorful gems and sweet treats!',
    badge: '🔢 Level 21',
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
    id: 22,
    worldId: 4,
    title: 'Hard, Soft & Fast (Opposites)',
    subtitle: 'Feel the touch and speed with cool opposite cards!',
    badge: '⚖️ Level 22',
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
    id: 23,
    worldId: 4,
    title: 'Master Letter Match (Q-Z)',
    subtitle: 'Match 4 Capital and Small letter buddies from Q to Z!',
    badge: '🧩 Level 23',
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
    id: 24,
    worldId: 4,
    title: 'Phonics Superstar',
    subtitle: 'Spell cool animals and objects by solving the missing letter!',
    badge: '📖 Level 24',
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
     WORLD 5: GRAND MASTER LEGENDS (LEVELS 25 - 30)
     ==================================================================== */
  {
    id: 25,
    worldId: 5,
    title: 'Skip Counting by 10s',
    subtitle: 'Count big leaps of 10 like a counting rocket!',
    badge: '🦘 Level 25',
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
    id: 26,
    worldId: 5,
    title: 'Picture to Alphabet Master (Q-Z)',
    subtitle: 'Match 4 magical objects to their starting letters!',
    badge: '🖼️ Level 26',
    icon: '🦄',
    type: 'match_picture',
    color: '#7C3AED',
    bgGrad: 'linear-gradient(135deg, #7C3AED 0%, #6D28D9 100%)',
    rounds: [
      {
        pairs: [
          { item: '👑 Queen', letter: 'Q' },
          { item: '🌹 Rose', letter: 'R' },
          { item: '☀️ Sun', letter: 'S' },
          { item: '🐯 Tiger', letter: 'T' }
        ]
      },
      {
        pairs: [
          { item: '☂️ Umbrella', letter: 'U' },
          { item: '🎻 Violin', letter: 'V' },
          { item: '🍉 Watermelon', letter: 'W' },
          { item: '🪀 Yoyo', letter: 'Y' }
        ]
      },
      {
        pairs: [
          { item: '🦄 Unicorn', letter: 'U' },
          { item: '⌚ Watch', letter: 'W' },
          { item: '🦓 Zebra', letter: 'Z' },
          { item: '👑 Quilt', letter: 'Q' }
        ]
      }
    ]
  },
  {
    id: 27,
    worldId: 5,
    title: 'Super Visual Sleuth',
    subtitle: 'Spot the trickiest odd-one-out patterns like a real detective!',
    badge: '🔍 Level 27',
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
    id: 28,
    worldId: 5,
    title: 'Mega Counting (16-20)',
    subtitle: 'Count big clusters of shining stars and flying butterflies!',
    badge: '🔢 Level 28',
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
    id: 29,
    worldId: 5,
    title: '5-Letter Word Challenge',
    subtitle: 'Spell big 5-letter words by choosing the missing letter!',
    badge: '📖 Level 29',
    icon: '🚂',
    type: 'missing_letter',
    color: '#E11D48',
    bgGrad: 'linear-gradient(135deg, #E11D48 0%, #BE123C 100%)',
    rounds: [
      { word: 'T R _ I N', answer: 'A', full: 'TRAIN', icon: '🚂', hint: 'Choo choo! Chugs on the railway tracks!', options: ['A', 'E', 'I', 'O'] },
      { word: 'S M _ L E', answer: 'I', full: 'SMILE', icon: '😊', hint: 'Show your happy smiling face!', options: ['I', 'Y', 'E', 'O'] },
      { word: 'C L _ U D', answer: 'O', full: 'CLOUD', icon: '☁️', hint: 'Floats fluffy in the blue sky!', options: ['O', 'A', 'U', 'I'] },
      { word: 'P L _ N T', answer: 'A', full: 'PLANT', icon: '🪴', hint: 'Grows green in a pretty pot!', options: ['A', 'E', 'I', 'O'] },
      { word: 'H _ U S E', answer: 'O', full: 'HOUSE', icon: '🏠', hint: 'Our warm and cozy home!', options: ['O', 'A', 'E', 'U'] }
    ]
  },
  {
    id: 30,
    worldId: 5,
    title: 'Ultimate Academy Champion',
    subtitle: 'The Grand Finale! Master skip counting, big words, and alphabet loops!',
    badge: '👑 Level 30 (Grand Finale)',
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
window.GAME_WORLDS = GAME_WORLDS;
window.GAME_LEVELS = GAME_LEVELS;
