# 🍓 2048 Kids Edition

A bright, friendly 2048 game built for kids — vanilla HTML, CSS, and JavaScript
with a clean object-oriented architecture and zero runtime dependencies.

![board screenshot](./screenshots/08-extended-play.png)

## ✨ Features

- **Kid-friendly UI** — pastel colors, big rounded tiles, playful fonts (Fredoka / Baloo 2),
  floating background bubbles, encouraging animations.
- **Smooth animations** — tiles glide into place, merges pulse, spawns pop, the
  board shakes when an invalid move is rejected.
- **2048 celebration** — confetti burst + cheerful arpeggio when you reach the magic tile.
- **Sound effects** — generated entirely with the Web Audio API (no asset files).
- **Single-step Undo** — kids can take back a mistake with one tap.
- **Best score** — persisted in `localStorage`.
- **Touch + mouse + keyboard** — swipe on mobile, click-and-drag or arrow keys
  (WASD also works) on desktop.
- **Reduced-motion friendly** — respects the user's `prefers-reduced-motion` setting.

## 🗂 Folder structure

```
2048-game/
├── index.html              # Game shell + DOM nodes
├── css/
│   └── styles.css          # All visual styling
├── js/
│   ├── Tile.js             # OOP: a single tile
│   ├── Board.js            # OOP: pure grid + move logic
│   ├── UI.js               # OOP: rendering, animations, input handlers
│   ├── SoundManager.js     # OOP: Web Audio sound effects
│   ├── Game.js             # OOP: top-level controller (state, undo, win/lose)
│   └── main.js             # Bootstrap / wiring
├── screenshots/            # Reference screenshots
└── README.md
```

## 🧱 Object-oriented design

Each concept in the game lives in its own ES6 `class`, and the modules export them
with named exports.

| Class            | Responsibility                                                              |
|------------------|-----------------------------------------------------------------------------|
| `Tile`           | Holds a tile's value + position, knows its CSS class, can serialize itself. |
| `Board`          | Pure logic grid: slide/merge in 4 directions, win/lose checks, snapshots.   |
| `UI`             | The View — owns the DOM, renders, animates, attaches input handlers.        |
| `SoundManager`   | Generates friendly SFX on demand via Web Audio.                             |
| `Game`           | The Director — orchestrates `Board`, `UI`, `SoundManager`, undo, persistence.|

The `Game` never touches the DOM directly, and the `Board` never knows about
animations or sounds — keeping concerns separated. Adding features (e.g. a
4×4 → 5×5 mode, hint system, AI autoplay) means adding or extending a single class.

## 🎮 How to play

1. Use **arrow keys** (or **WASD**) to slide the tiles.
2. On a phone / tablet, **swipe** in any direction on the board.
3. Two tiles with the **same number** merge into one of double the value.
4. Reach **2048** to win — then keep going for a higher score!
5. Made a mistake? Tap **Undo** to take back one move.

## 🚀 Running locally

Because the game is plain ES modules, just serve the folder over HTTP:

```bash
# from the project root
python3 -m http.server 8000
# then open http://localhost:8000
```

Or with Node:

```bash
npx http-server -p 8000
```

## 🧪 Tests

Two lightweight test scripts are included.

```bash
node test-board.mjs   # 25 unit tests over Board.move() edge cases
node test-ui.mjs      # Browser-driven smoke test (Playwright)
node test-win.mjs     # Visual verification of the win / lose overlays
```

Both must report `0 errors`.

## 📦 Browser support

Anything evergreen (Chrome, Edge, Firefox, Safari) — uses `backdrop-filter`
(progressive enhancement), CSS Grid, ES modules, and the Web Audio API.