import { toScreen } from '../utils/helpers';

// Pre-computed ambient particle positions
const AMBIENT_PARTICLES = [];
for (let i = 0; i < 8; i++) {
  AMBIENT_PARTICLES.push({
    baseX: (i * 0.13 + 0.05) % 1,
    baseY: (i * 0.17 + 0.1) % 0.8 + 0.1,
    size: 1 + (i % 3) * 0.5,
    speedX: 0.00002 + (i % 4) * 0.000008,
    speedY: -0.00001 - (i % 3) * 0.000005,
    phase: i * 1.7,
  });
}

export function drawAmbientEffects(ctx, config, timestamp) {
  const { width, height } = config;
  const now = timestamp || 0;

  // Floating dust motes / pollen
  ctx.fillStyle = 'rgba(255,255,220,0.35)';
  for (let i = 0; i < AMBIENT_PARTICLES.length; i++) {
    const p = AMBIENT_PARTICLES[i];
    const px = ((p.baseX + now * p.speedX + Math.sin(now / 3000 + p.phase) * 0.02) % 1) * width;
    const py = ((p.baseY + now * p.speedY + Math.cos(now / 2500 + p.phase) * 0.015 + 1) % 1) * height;
    const size = p.size * (0.8 + Math.sin(now / 1500 + p.phase) * 0.2);

    ctx.globalAlpha = 0.2 + Math.sin(now / 2000 + p.phase) * 0.1;
    ctx.beginPath();
    ctx.arc(px, py, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // Subtle depth haze on lower portion (distant tiles appear slightly faded)
  const hazeGrad = ctx.createLinearGradient(0, height * 0.7, 0, height);
  hazeGrad.addColorStop(0, 'rgba(200,220,240,0)');
  hazeGrad.addColorStop(1, 'rgba(200,220,240,0.06)');
  ctx.fillStyle = hazeGrad;
  ctx.fillRect(0, height * 0.7, width, height * 0.3);

  // Sun light rays (diagonal transparent gradient from top-left)
  ctx.save();
  const rayAlpha = 0.03 + Math.sin(now / 5000) * 0.01;
  ctx.globalAlpha = rayAlpha;
  const rayGrad = ctx.createLinearGradient(0, 0, width * 0.6, height * 0.6);
  rayGrad.addColorStop(0, 'rgba(255,255,200,1)');
  rayGrad.addColorStop(0.3, 'rgba(255,255,200,0.5)');
  rayGrad.addColorStop(1, 'rgba(255,255,200,0)');
  ctx.fillStyle = rayGrad;
  ctx.fillRect(0, 0, width, height);
  ctx.restore();
}

export function drawSelectionGlow(ctx, building, originX, originY, tw, th, timestamp) {
  if (!building) return;

  const b = building;
  const topElev = toScreen(b.gridCol, b.gridRow, originX, originY, tw, th);
  const rightElev = toScreen(b.gridCol + b.tileW, b.gridRow, originX, originY, tw, th);
  const bottomElev = toScreen(b.gridCol + b.tileW, b.gridRow + b.tileD, originX, originY, tw, th);
  const leftElev = toScreen(b.gridCol, b.gridRow + b.tileD, originX, originY, tw, th);

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

  ctx.globalAlpha = 0.12;
  ctx.fillStyle = b.accentColor;
  ctx.fill();

  // Expanding ring effect
  const ringProgress = ((timestamp || 0) / 1500) % 1;
  const ringAlpha = (1 - ringProgress) * 0.2;
  const ringScale = 1 + ringProgress * 0.3;

  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale((rx / 10) * ringScale, (ry / 10) * ringScale);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.restore();
  ctx.globalAlpha = ringAlpha;
  ctx.strokeStyle = b.accentColor;
  ctx.lineWidth = 1.5;
  ctx.stroke();

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
