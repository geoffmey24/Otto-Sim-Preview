import { toScreen } from '../utils/helpers';

export function drawSelectionGlow(ctx, building, originX, originY, tw, th, timestamp) {
  if (!building) return;

  const b = building;
  const topElev = toScreen(b.gridCol, b.gridRow, originX, originY, tw, th);
  const rightElev = toScreen(b.gridCol + b.tileW, b.gridRow, originX, originY, tw, th);
  const bottomElev = toScreen(b.gridCol + b.tileW, b.gridRow + b.tileD, originX, originY, tw, th);
  const leftElev = toScreen(b.gridCol, b.gridRow + b.tileD, originX, originY, tw, th);

  // Adjust for building height (elevated positions)
  const h = b.height || 0;
  const te = { x: topElev.x, y: topElev.y - h };
  const re = { x: rightElev.x, y: rightElev.y - h };
  const be = { x: bottomElev.x, y: bottomElev.y - h };
  const le = { x: leftElev.x, y: leftElev.y - h };

  // Soft radial glow beneath (on ground, 30% larger)
  const cx = (topElev.x + bottomElev.x) / 2;
  const cy = (topElev.y + bottomElev.y) / 2;
  const rx = Math.abs(rightElev.x - leftElev.x) * 0.65;
  const ry = Math.abs(topElev.y - bottomElev.y) * 0.65;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(rx / 10, ry / 10);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.restore();

  ctx.globalAlpha = 0.1;
  ctx.fillStyle = b.accentColor;
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // White outline on top face
  ctx.beginPath();
  ctx.moveTo(te.x, te.y);
  ctx.lineTo(re.x, re.y);
  ctx.lineTo(be.x, be.y);
  ctx.lineTo(le.x, le.y);
  ctx.closePath();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.globalAlpha = 0.5;
  ctx.stroke();

  // Accent color pulsing outline
  ctx.beginPath();
  ctx.moveTo(te.x, te.y);
  ctx.lineTo(re.x, re.y);
  ctx.lineTo(be.x, be.y);
  ctx.lineTo(le.x, le.y);
  ctx.closePath();
  ctx.strokeStyle = b.accentColor;
  ctx.lineWidth = 2;
  ctx.globalAlpha = Math.sin(timestamp / 400) * 0.25 + 0.75;
  ctx.stroke();

  ctx.globalAlpha = 1.0;
}
