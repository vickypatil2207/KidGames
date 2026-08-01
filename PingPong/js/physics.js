/**
 * 🏓 PhysicsEngine - Collision Detection & Ball Trajectory Physics
 */
class PhysicsEngine {
  static checkWallCollision(ball, ballRadius, width, height, isVertical, onWallHit) {
    if (isVertical) {
      // Bouncing off Left & Right walls in vertical mode
      if (ball.x - ballRadius <= 0) {
        ball.x = ballRadius;
        ball.vx *= -1;
        onWallHit(ball.x, ball.y);
      } else if (ball.x + ballRadius >= width) {
        ball.x = width - ballRadius;
        ball.vx *= -1;
        onWallHit(ball.x, ball.y);
      }
    } else {
      // Bouncing off Top & Bottom walls in horizontal mode
      if (ball.y - ballRadius <= 0) {
        ball.y = ballRadius;
        ball.vy *= -1;
        onWallHit(ball.x, ball.y);
      } else if (ball.y + ballRadius >= height) {
        ball.y = height - ballRadius;
        ball.vy *= -1;
        onWallHit(ball.x, ball.y);
      }
    }
  }

  static checkPaddleCollision(ball, ballRadius, player, ai, paddleWidth, paddleHeight, isVertical, onPaddleHit) {
    if (isVertical) {
      const halfW = paddleWidth / 2;

      // Bottom Paddle (Player)
      if (ball.vy > 0) {
        if (
          ball.y + ballRadius >= player.y &&
          ball.y - ballRadius <= player.y + paddleHeight &&
          ball.x >= player.x - halfW &&
          ball.x <= player.x + halfW
        ) {
          ball.y = player.y - ballRadius;
          onPaddleHit('player', player.x);
        }
      }
      // Top Paddle (AI)
      else if (ball.vy < 0) {
        if (
          ball.y - ballRadius <= ai.y + paddleHeight &&
          ball.y + ballRadius >= ai.y &&
          ball.x >= ai.x - halfW &&
          ball.x <= ai.x + halfW
        ) {
          ball.y = ai.y + paddleHeight + ballRadius;
          onPaddleHit('ai', ai.x);
        }
      }
    } else {
      const halfH = paddleHeight / 2;

      // Left Paddle (Player)
      if (ball.vx < 0) {
        if (
          ball.x - ballRadius <= player.x + paddleWidth &&
          ball.x + ballRadius >= player.x &&
          ball.y >= player.y - halfH &&
          ball.y <= player.y + halfH
        ) {
          ball.x = player.x + paddleWidth + ballRadius;
          onPaddleHit('player', player.y);
        }
      } 
      // Right Paddle (AI)
      else if (ball.vx > 0) {
        if (
          ball.x + ballRadius >= ai.x &&
          ball.x - ballRadius <= ai.x + paddleWidth &&
          ball.y >= ai.y - halfH &&
          ball.y <= ai.y + halfH
        ) {
          ball.x = ai.x - ballRadius;
          onPaddleHit('ai', ai.y);
        }
      }
    }
  }

  static calculateReturnAngle(ballPos, paddlePos, paddleLength, ballSpeed, isGoingReverse, isVertical) {
    const hitOffset = Math.max(-1, Math.min(1, (ballPos - paddlePos) / (paddleLength / 2)));
    const maxAngle = 55 * (Math.PI / 180);
    const returnAngle = hitOffset * maxAngle;

    if (isVertical) {
      // isGoingReverse = true when AI at top hits DOWN (+1 dir)
      // isGoingReverse = false when Player at bottom hits UP (-1 dir)
      const dir = isGoingReverse ? 1 : -1;
      return {
        vx: Math.sin(returnAngle) * ballSpeed,
        vy: Math.cos(returnAngle) * ballSpeed * dir
      };
    } else {
      // isGoingReverse = true when AI at right hits LEFT (-1 dir)
      // isGoingReverse = false when Player at left hits RIGHT (+1 dir)
      const dir = isGoingReverse ? -1 : 1;
      return {
        vx: Math.cos(returnAngle) * ballSpeed * dir,
        vy: Math.sin(returnAngle) * ballSpeed
      };
    }
  }
}
