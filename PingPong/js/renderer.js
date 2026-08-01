/**
 * 🏓 Renderer - Canvas Drawing Routines for Table, Paddles, Ball, Particles
 */
class Renderer {
  static drawTable(ctx, width, height, isVertical) {
    // Lime green table surface
    ctx.fillStyle = '#7cb342';
    ctx.fillRect(0, 0, width, height);

    // Table gradient highlight
    const grad = ctx.createLinearGradient(0, 0, 0, height);
    grad.addColorStop(0, 'rgba(255,255,255,0.15)');
    grad.addColorStop(0.5, 'rgba(0,0,0,0)');
    grad.addColorStop(1, 'rgba(0,0,0,0.15)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, width, height);

    // White outer border lines
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 6;
    ctx.strokeRect(6, 6, width - 12, height - 12);

    // Center Net Line (Dashed)
    ctx.save();
    ctx.beginPath();
    ctx.setLineDash([12, 10]);
    ctx.lineWidth = 4;
    if (isVertical) {
      ctx.moveTo(6, height / 2);
      ctx.lineTo(width - 6, height / 2);
    } else {
      ctx.moveTo(width / 2, 6);
      ctx.lineTo(width / 2, height - 6);
    }
    ctx.stroke();
    ctx.restore();

    // Center Circle
    ctx.beginPath();
    ctx.arc(width / 2, height / 2, Math.min(width, height) * 0.1, 0, Math.PI * 2);
    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(255,255,255,0.5)';
    ctx.stroke();
  }

  static drawPaddle(ctx, paddle, isPlayer, selectedAvatar, paddleWidth, paddleHeight, isVertical) {
    let x, y, w, h;
    if (isVertical) {
      x = paddle.x - paddleWidth / 2;
      y = paddle.y;
      w = paddleWidth;
      h = paddleHeight;
    } else {
      x = paddle.x;
      y = paddle.y - paddleHeight / 2;
      w = paddleWidth;
      h = paddleHeight;
    }
    const radius = 10;

    ctx.save();

    if (isPlayer) {
      switch (selectedAvatar) {
        case 'kitty':
          ctx.fillStyle = '#ff80ab';
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, radius);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Paw Pads
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          ctx.arc(x + w / 2, y + h / 2, 5, 0, Math.PI * 2);
          ctx.fill();
          break;

        case 'froggy':
          ctx.fillStyle = '#00e676';
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, radius);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3;
          ctx.stroke();

          // Frog Eyes
          ctx.fillStyle = '#fff';
          ctx.beginPath();
          if (isVertical) {
            ctx.arc(x + 15, y + h / 2, 4, 0, Math.PI * 2);
            ctx.arc(x + w - 15, y + h / 2, 4, 0, Math.PI * 2);
          } else {
            ctx.arc(x + w / 2, y + 15, 4, 0, Math.PI * 2);
            ctx.arc(x + w / 2, y + h - 15, 4, 0, Math.PI * 2);
          }
          ctx.fill();
          break;

        case 'rocket':
          ctx.fillStyle = '#ff9800';
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, radius);
          ctx.fill();
          ctx.strokeStyle = '#ffeb3b';
          ctx.lineWidth = 3;
          ctx.stroke();
          break;

        case 'star':
        default:
          ctx.fillStyle = '#ffca28';
          ctx.beginPath();
          ctx.roundRect(x, y, w, h, radius);
          ctx.fill();
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 3;
          ctx.stroke();
          break;
      }
    } else {
      // AI Robot Paddle
      ctx.fillStyle = '#00bcd4';
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, radius);
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 3;
      ctx.stroke();

      // Robot Eye
      ctx.fillStyle = '#ffeb3b';
      ctx.beginPath();
      ctx.arc(x + w / 2, y + h / 2, 5, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.restore();
  }

  static drawBall(ctx, ball, ballRadius, ballTrail) {
    // Draw Motion Trail
    for (let i = 0; i < ballTrail.length; i++) {
      const pt = ballTrail[i];
      const alpha = (i + 1) / ballTrail.length * 0.45;
      const size = ballRadius * ((i + 1) / ballTrail.length);
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(255, 64, 129, ${alpha})`;
      ctx.fill();
    }

    // Main Ball
    ctx.save();
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ballRadius, 0, Math.PI * 2);

    const ballGrad = ctx.createRadialGradient(
      ball.x - 3, ball.y - 3, 2,
      ball.x, ball.y, ballRadius
    );
    ballGrad.addColorStop(0, '#ff80ab');
    ballGrad.addColorStop(0.7, '#ff1744');
    ballGrad.addColorStop(1, '#d50000');

    ctx.fillStyle = ballGrad;
    ctx.fill();
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Highlight
    ctx.beginPath();
    ctx.arc(ball.x - 3, ball.y - 3, ballRadius * 0.3, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
    ctx.fill();
    ctx.restore();
  }
}
