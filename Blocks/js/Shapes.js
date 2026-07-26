/**
 * Shapes.js
 * Definitions for colorful block shapes, rotation functions, and cartoon color themes.
 */

export const COLORS = {
  CYAN: {
    main: '#00f0ff',
    top: '#70f8ff',
    bottom: '#00b8c4',
    border: '#00838c',
    emoji: '💧'
  },
  BLUE: {
    main: '#3a86ff',
    top: '#70a6ff',
    bottom: '#2563eb',
    border: '#1d4ed8',
    emoji: '🐬'
  },
  ORANGE: {
    main: '#ff7b00',
    top: '#ffa24d',
    bottom: '#e05300',
    border: '#b34200',
    emoji: '🍊'
  },
  YELLOW: {
    main: '#ffcc00',
    top: '#ffe066',
    bottom: '#cc9900',
    border: '#997300',
    emoji: '⭐'
  },
  GREEN: {
    main: '#38b000',
    top: '#70e000',
    bottom: '#2b8a00',
    border: '#1c5c00',
    emoji: '🥝'
  },
  PURPLE: {
    main: '#9d4edd',
    top: '#c77dff',
    bottom: '#7b2cbf',
    border: '#5a189a',
    emoji: '🍇'
  },
  PINK: {
    main: '#ff4d6d',
    top: '#ff85a1',
    bottom: '#c9184a',
    border: '#a01a3e',
    emoji: '🍓'
  }
};

export const COLOR_KEYS = Object.keys(COLORS);

/**
 * Clean compact shape definitions.
 */
export const SHAPES = [
  // 1. I-Piece (Line 4x1)
  {
    name: 'I',
    matrix: [
      [1, 1, 1, 1]
    ],
    color: COLORS.CYAN
  },
  // 2. J-Piece
  {
    name: 'J',
    matrix: [
      [1, 0, 0],
      [1, 1, 1]
    ],
    color: COLORS.BLUE
  },
  // 3. L-Piece
  {
    name: 'L',
    matrix: [
      [0, 0, 1],
      [1, 1, 1]
    ],
    color: COLORS.ORANGE
  },
  // 4. O-Piece (Square 2x2)
  {
    name: 'O',
    matrix: [
      [1, 1],
      [1, 1]
    ],
    color: COLORS.YELLOW
  },
  // 5. S-Piece
  {
    name: 'S',
    matrix: [
      [0, 1, 1],
      [1, 1, 0]
    ],
    color: COLORS.GREEN
  },
  // 6. T-Piece
  {
    name: 'T',
    matrix: [
      [0, 1, 0],
      [1, 1, 1]
    ],
    color: COLORS.PURPLE
  },
  // 7. Z-Piece
  {
    name: 'Z',
    matrix: [
      [1, 1, 0],
      [0, 1, 1]
    ],
    color: COLORS.PINK
  },
  // 8. Single Dot
  {
    name: 'DOT',
    matrix: [
      [1]
    ],
    color: COLORS.YELLOW
  },
  // 9. Mini Line (2x1)
  {
    name: 'MINI_I',
    matrix: [
      [1, 1]
    ],
    color: COLORS.GREEN
  }
];

/**
 * Rotates an N x M matrix clockwise.
 */
export function rotateMatrix(matrix) {
  const rows = matrix.length;
  const cols = matrix[0].length;
  const result = [];

  for (let c = 0; c < cols; c++) {
    const newRow = [];
    for (let r = rows - 1; r >= 0; r--) {
      newRow.push(matrix[r][c]);
    }
    result.push(newRow);
  }
  return result;
}

/**
 * Returns a random shape instance with a fresh color assignment.
 */
export function getRandomShape() {
  const template = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  const randomColorKey = COLOR_KEYS[Math.floor(Math.random() * COLOR_KEYS.length)];
  
  return {
    name: template.name,
    matrix: template.matrix.map(row => [...row]),
    color: COLORS[randomColorKey]
  };
}
