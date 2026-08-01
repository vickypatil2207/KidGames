/**
 * 🏓 AIOpponent - AI Opponent Behavior & Difficulty Manager
 */
class AIOpponent {
  constructor(difficultySettings) {
    this.settings = difficultySettings;
  }

  update(ai, ball, difficulty, canvasWidth, canvasHeight, paddleLength, isVertical) {
    const aiConf = this.settings[difficulty] || this.settings.easy;
    const halfL = paddleLength / 2;

    if (isVertical) {
      // In vertical mode, AI paddle is at top moving along X-axis
      let targetX = ball.x;

      // Return to center when ball moves away towards player (downward vy > 0)
      if (ball.vy > 0) {
        targetX = canvasWidth / 2;
      }

      const diffX = targetX - ai.x;

      // Smooth lerp movement with velocity clamping
      ai.x += Math.max(-aiConf.maxSpeed, Math.min(aiConf.maxSpeed, diffX * aiConf.lerp));

      // Clamp to left/right boundaries
      ai.x = Math.max(halfL, Math.min(canvasWidth - halfL, ai.x));
    } else {
      // In horizontal mode, AI paddle is at right moving along Y-axis
      let targetY = ball.y;

      // Return to center when ball moves away towards player (leftward vx < 0)
      if (ball.vx < 0) {
        targetY = canvasHeight / 2;
      }

      const diffY = targetY - ai.y;

      // Smooth lerp movement with velocity clamping
      ai.y += Math.max(-aiConf.maxSpeed, Math.min(aiConf.maxSpeed, diffY * aiConf.lerp));

      // Clamp to table top/bottom boundaries
      ai.y = Math.max(halfL, Math.min(canvasHeight - halfL, ai.y));
    }
  }
}
