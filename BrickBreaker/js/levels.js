/**
 * 🗺️ LevelManager - 25 Level Map Generator & Layout Definitions
 */
class LevelManager {
  constructor() {
    this.levelDefs = [];
    this.generateLevelsData();
  }

  generateLevelsData() {
    this.levelDefs = [];

    for (let i = 1; i <= 25; i++) {
      const rows = Math.min(5 + Math.floor(i / 3), 9);
      const cols = 10;
      const grid = [];

      for (let r = 0; r < rows; r++) {
        const rowArr = [];
        for (let c = 0; c < cols; c++) {
          let cell = 1; // default normal 1-hit brick

          // Level layout patterns
          if (i === 1) { // Simple Sunny Valley
            cell = (r < 3) ? 1 : 0;
          } else if (i === 2) { // Rainbow Arch
            cell = (Math.abs(c - 4.5) < r + 1) ? 1 : 0;
          } else if (i === 3) { // Pyramid Power
            cell = (c >= r && c < cols - r) ? 1 : 0;
          } else if (i === 4) { // Silver Castle
            cell = (r === 1 && (c === 3 || c === 6)) ? 2 : 1;
          } else if (i === 5) { // Gold Fortress
            cell = (r === 2 && c >= 3 && c <= 6) ? 3 : (r === 1 ? 2 : 1);
          } else if (i >= 6 && i <= 7) { // Explosive Volcano
            if ((r === 1 || r === 3) && (c === 2 || c === 7)) cell = 'E';
            else cell = (r % 2 === 0) ? 1 : 2;
          } else if (i >= 8 && i <= 9) { // Moving Bricks
            if (r === 2) cell = 'M';
            else cell = 1;
          } else if (i >= 10 && i <= 11) { // Stone Obstacles
            if (r === 2 && (c === 3 || c === 6)) cell = 'S';
            else cell = (r === 0) ? 2 : 1;
          } else if (i >= 12 && i <= 13) { // Rainbow Magic
            if (r === 1 && c % 2 === 0) cell = 'R';
            else cell = 1;
          } else if (i >= 14 && i <= 15) { // Space Invader
            cell = ((r + c) % 2 === 0) ? 1 : 2;
            if (r === 0 && (c === 1 || c === 8)) cell = 'E';
          } else if (i >= 16 && i <= 18) { // Tough Mixed
            if (r === 0) cell = 3;
            else if (r === 1) cell = 2;
            else if (r === 2 && c % 3 === 0) cell = 'S';
            else cell = 1;
          } else if (i >= 19 && i <= 22) { // Stars & Explosive
            if (r === 2 && (c === 2 || c === 7)) cell = 'E';
            else if (r === 1 && (c === 4 || c === 5)) cell = 'R';
            else if (r === 0) cell = 3;
            else cell = 1;
          } else { // Boss Levels 23 - 25
            if (r === 0) cell = 3;
            else if (r === 1 && (c === 2 || c === 7)) cell = 'E';
            else if (r === 2 && (c === 4 || c === 5)) cell = 'S';
            else if (r === 3) cell = 'M';
            else cell = (c % 2 === 0) ? 2 : 1;
          }

          rowArr.push(cell);
        }
        grid.push(rowArr);
      }

      this.levelDefs.push(grid);
    }
  }

  buildBricksForLevel(levelNum, canvasWidth, canvasHeight = 600) {
    const layout = this.levelDefs[levelNum - 1] || this.levelDefs[0];
    const scaleY = Math.max(1.0, canvasHeight / 600);
    const padding = 8;
    const paddingY = Math.round(8 * Math.min(1.4, scaleY));
    const offsetTop = Math.round(60 * scaleY);
    const offsetLeft = 45;
    const brickW = (canvasWidth - (offsetLeft * 2) - (padding * 9)) / 10;
    const brickH = Math.round(22 * Math.min(1.4, scaleY));
    const bricks = [];

    for (let r = 0; r < layout.length; r++) {
      for (let c = 0; c < 10; c++) {
        const val = layout[r][c];
        if (val === 0) continue;

        let hp = 1;
        let type = 'normal';
        let color = `hsl(${ (r * 45 + levelNum * 30) % 360 }, 85%, 60%)`;
        let isMoving = false;

        if (val === 2) { hp = 2; type = 'silver'; color = '#94a3b8'; }
        else if (val === 3) { hp = 3; type = 'gold'; color = '#fbbf24'; }
        else if (val === 'E') { hp = 1; type = 'explosive'; color = '#ef4444'; }
        else if (val === 'M') { hp = 1; type = 'moving'; color = '#38bdf8'; isMoving = true; }
        else if (val === 'S') { hp = 999; type = 'stone'; color = '#64748b'; }
        else if (val === 'R') { hp = 1; type = 'rainbow'; color = '#c084fc'; }

        const xPos = offsetLeft + c * (brickW + padding);
        const yPos = offsetTop + r * (brickH + paddingY);

        bricks.push({
          x: xPos,
          y: yPos,
          w: brickW,
          h: brickH,
          hp: hp,
          maxHp: hp,
          type: type,
          color: color,
          isMoving: isMoving,
          moveDx: isMoving ? (r % 2 === 0 ? 1.5 : -1.5) : 0,
          initialX: xPos
        });
      }
    }

    return bricks;
  }
}

const levelManager = new LevelManager();
