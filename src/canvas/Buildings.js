import { toScreen, colorShade } from '../utils/helpers';
import { BUILDINGS } from '../constants';

// ─── Geometry helpers ──────────────────────────────────

function lerp(a, b, t) {
  return { x: a.x + (b.x - a.x) * t, y: a.y + (b.y - a.y) * t };
}

function facePoint(tl, tr, bl, br, u, v) {
  const top = lerp(tl, tr, u);
  const bot = lerp(bl, br, u);
  return lerp(top, bot, v);
}

function getCorners(b, ox, oy, tw, th) {
  const topBase = toScreen(b.gridCol, b.gridRow, ox, oy, tw, th);
  const rightBase = toScreen(b.gridCol + b.tileW, b.gridRow, ox, oy, tw, th);
  const bottomBase = toScreen(b.gridCol + b.tileW, b.gridRow + b.tileD, ox, oy, tw, th);
  const leftBase = toScreen(b.gridCol, b.gridRow + b.tileD, ox, oy, tw, th);
  const h = b.height;
  const topElev = { x: topBase.x, y: topBase.y - h };
  const rightElev = { x: rightBase.x, y: rightBase.y - h };
  const bottomElev = { x: bottomBase.x, y: bottomBase.y - h };
  const leftElev = { x: leftBase.x, y: leftBase.y - h };
  return {
    topBase, rightBase, bottomBase, leftBase,
    topElev, rightElev, bottomElev, leftElev,
    lf: { tl: leftElev, tr: topElev, bl: leftBase, br: topBase },
    rf: { tl: bottomElev, tr: rightElev, bl: bottomBase, br: rightBase },
    tf: { tl: topElev, tr: rightElev, bl: leftElev, br: bottomElev },
  };
}

function drawRoundedRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.lineTo(x + w, y + h - r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.lineTo(x + r, y + h);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.lineTo(x, y + r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

// ─── Generate stable window lit states ─────────────────

export function generateWindowStates() {
  return {
    workplace_left: Array.from({ length: 24 }, () => Math.random() < 0.7),
    workplace_right: Array.from({ length: 24 }, () => Math.random() < 0.7),
    bank_left: Array.from({ length: 4 }, () => Math.random() < 0.7),
    bank_right: Array.from({ length: 4 }, () => Math.random() < 0.7),
    casino_left: Array.from({ length: 12 }, () => Math.random() < 0.7),
    casino_right: Array.from({ length: 12 }, () => Math.random() < 0.7),
  };
}

// ─── Label drawing ─────────────────────────────────────

function drawLabel(ctx, text, centerX, baseY) {
  ctx.font = 'bold 11px Nunito';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const metrics = ctx.measureText(text);
  const pillW = metrics.width + 12;
  const pillH = 16;
  drawRoundedRect(ctx, centerX - pillW / 2, baseY - pillH / 2, pillW, pillH, 8);
  ctx.fillStyle = 'rgba(0,0,0,0.65)';
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.fillText(text, centerX, baseY);
}

// ─── Window grid drawing ───────────────────────────────

function drawWindows(ctx, face, cols, rows, litStates, opts) {
  const margin = 0.15;
  const winColor = (opts && opts.litColor) || 'rgba(255,240,180,0.9)';
  const glowColor = (opts && opts.glowColor) || 'rgba(255,240,180,0.3)';
  const unlitColor = (opts && opts.unlitColor) || 'rgba(100,130,180,0.35)';
  const allLit = opts && opts.allLit;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const u = margin + (c + 0.5) / cols * (1 - 2 * margin);
      const v = margin + (r + 0.5) / rows * (1 - 2 * margin);
      const p = facePoint(face.tl, face.tr, face.bl, face.br, u, v);
      const idx = r * cols + c;
      const isLit = allLit || (litStates && litStates[idx]);
      if (isLit) {
        ctx.fillStyle = glowColor;
        ctx.fillRect(p.x - 3.5, p.y - 4.5, 7, 9);
        ctx.fillStyle = winColor;
        ctx.fillRect(p.x - 2.5, p.y - 3.5, 5, 7);
        // Window sill
        ctx.fillStyle = 'rgba(0,0,0,0.1)';
        ctx.fillRect(p.x - 3, p.y + 3, 6, 1);
        // Lintel
        ctx.fillRect(p.x - 3, p.y - 4, 6, 1);
      } else {
        ctx.fillStyle = unlitColor;
        ctx.fillRect(p.x - 2.5, p.y - 3.5, 5, 7);
        ctx.fillStyle = 'rgba(0,0,0,0.08)';
        ctx.fillRect(p.x - 3, p.y + 3, 6, 1);
      }
    }
  }
}

// ─── Shadow drawing ────────────────────────────────────

function drawShadow(ctx, b, ox, oy, tw, th) {
  const topBase = toScreen(b.gridCol, b.gridRow, ox, oy, tw, th);
  const rightBase = toScreen(b.gridCol + b.tileW, b.gridRow, ox, oy, tw, th);
  const bottomBase = toScreen(b.gridCol + b.tileW, b.gridRow + b.tileD, ox, oy, tw, th);
  const leftBase = toScreen(b.gridCol, b.gridRow + b.tileD, ox, oy, tw, th);
  const sx = 10, sy = 5;
  const stretch = (rightBase.x - leftBase.x) * 0.25;

  // Soft outer shadow
  ctx.beginPath();
  ctx.moveTo(topBase.x + sx - 2, topBase.y + sy - 1);
  ctx.lineTo(rightBase.x + sx + stretch + 2, rightBase.y + sy - 1);
  ctx.lineTo(bottomBase.x + sx + stretch + 2, bottomBase.y + sy + 2);
  ctx.lineTo(leftBase.x + sx - 2, leftBase.y + sy + 2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(20,30,10,0.08)';
  ctx.fill();

  // Main shadow
  ctx.beginPath();
  ctx.moveTo(topBase.x + sx, topBase.y + sy);
  ctx.lineTo(rightBase.x + sx + stretch, rightBase.y + sy);
  ctx.lineTo(bottomBase.x + sx + stretch, bottomBase.y + sy);
  ctx.lineTo(leftBase.x + sx, leftBase.y + sy);
  ctx.closePath();
  ctx.fillStyle = 'rgba(20,30,10,0.2)';
  ctx.fill();
}

// ─── Generic 3-face isometric box ──────────────────────

function drawBuildingBox(ctx, b, c) {
  // Left face (brighter)
  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(c.topBase.x, c.topBase.y);
  ctx.lineTo(c.leftBase.x, c.leftBase.y);
  ctx.lineTo(c.leftElev.x, c.leftElev.y);
  ctx.closePath();
  ctx.fillStyle = colorShade(b.wallColor, 0.85);
  ctx.fill();

  // Ambient occlusion at base of left face
  const aoHeight = 6;
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.beginPath();
  ctx.moveTo(c.topBase.x, c.topBase.y);
  ctx.lineTo(c.leftBase.x, c.leftBase.y);
  ctx.lineTo(c.leftBase.x, c.leftBase.y - aoHeight);
  ctx.lineTo(c.topBase.x, c.topBase.y - aoHeight);
  ctx.closePath();
  ctx.fill();

  // Far-left edge stroke
  ctx.beginPath();
  ctx.moveTo(c.leftElev.x, c.leftElev.y);
  ctx.lineTo(c.leftBase.x, c.leftBase.y);
  ctx.strokeStyle = 'rgba(0,0,0,0.12)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Right face (darker)
  ctx.beginPath();
  ctx.moveTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(c.rightBase.x, c.rightBase.y);
  ctx.lineTo(c.bottomBase.x, c.bottomBase.y);
  ctx.lineTo(c.bottomElev.x, c.bottomElev.y);
  ctx.closePath();
  ctx.fillStyle = colorShade(b.wallColor, 0.7);
  ctx.fill();

  // Ambient occlusion at base of right face
  ctx.fillStyle = 'rgba(0,0,0,0.06)';
  ctx.beginPath();
  ctx.moveTo(c.rightBase.x, c.rightBase.y);
  ctx.lineTo(c.bottomBase.x, c.bottomBase.y);
  ctx.lineTo(c.bottomBase.x, c.bottomBase.y - aoHeight);
  ctx.lineTo(c.rightBase.x, c.rightBase.y - aoHeight);
  ctx.closePath();
  ctx.fill();

  // Far-right edge stroke
  ctx.beginPath();
  ctx.moveTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(c.rightBase.x, c.rightBase.y);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Foundation strip (2px darker band at ground level)
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  // Left face foundation
  ctx.beginPath();
  ctx.moveTo(c.topBase.x, c.topBase.y);
  ctx.lineTo(c.leftBase.x, c.leftBase.y);
  ctx.lineTo(c.leftBase.x, c.leftBase.y - 2);
  ctx.lineTo(c.topBase.x, c.topBase.y - 2);
  ctx.closePath();
  ctx.fill();
  // Right face foundation
  ctx.beginPath();
  ctx.moveTo(c.rightBase.x, c.rightBase.y);
  ctx.lineTo(c.bottomBase.x, c.bottomBase.y);
  ctx.lineTo(c.bottomBase.x, c.bottomBase.y - 2);
  ctx.lineTo(c.rightBase.x, c.rightBase.y - 2);
  ctx.closePath();
  ctx.fill();

  // Top face (roof)
  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(c.bottomElev.x, c.bottomElev.y);
  ctx.lineTo(c.leftElev.x, c.leftElev.y);
  ctx.closePath();
  ctx.fillStyle = b.roofColor;
  ctx.fill();
  // Top-left highlight
  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(c.leftElev.x, c.leftElev.y);
  ctx.strokeStyle = 'rgba(255,255,255,0.2)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Accent border on top face
  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(c.bottomElev.x, c.bottomElev.y);
  ctx.lineTo(c.leftElev.x, c.leftElev.y);
  ctx.closePath();
  ctx.globalAlpha = 0.6;
  ctx.strokeStyle = b.accentColor;
  ctx.lineWidth = 2;
  ctx.stroke();
  ctx.globalAlpha = 1.0;
}

// ─── Peaked roof helper ────────────────────────────────

function drawPeakedRoof(ctx, c, frontColor, backColor, ridgeColor) {
  const frontPeak = {
    x: (c.topElev.x + c.rightElev.x) / 2,
    y: (c.topElev.y + c.rightElev.y) / 2 - 15,
  };
  const backPeak = {
    x: (c.leftElev.x + c.bottomElev.x) / 2,
    y: (c.leftElev.y + c.bottomElev.y) / 2 - 15,
  };

  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(frontPeak.x, frontPeak.y);
  ctx.lineTo(backPeak.x, backPeak.y);
  ctx.lineTo(c.leftElev.x, c.leftElev.y);
  ctx.closePath();
  ctx.fillStyle = backColor;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(frontPeak.x, frontPeak.y);
  ctx.lineTo(backPeak.x, backPeak.y);
  ctx.lineTo(c.bottomElev.x, c.bottomElev.y);
  ctx.closePath();
  ctx.fillStyle = frontColor;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(frontPeak.x, frontPeak.y);
  ctx.lineTo(c.rightElev.x, c.rightElev.y);
  ctx.closePath();
  ctx.fillStyle = frontColor;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(c.leftElev.x, c.leftElev.y);
  ctx.lineTo(backPeak.x, backPeak.y);
  ctx.lineTo(c.bottomElev.x, c.bottomElev.y);
  ctx.closePath();
  ctx.fillStyle = backColor;
  ctx.fill();

  ctx.beginPath();
  ctx.moveTo(frontPeak.x, frontPeak.y);
  ctx.lineTo(backPeak.x, backPeak.y);
  ctx.strokeStyle = ridgeColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  return { frontPeak, backPeak };
}

// ─── Animated smoke helper ─────────────────────────────

function drawSmoke(ctx, baseX, baseY, timestamp, scale) {
  const s = scale || 1;
  const t = timestamp || 0;
  const wisps = [
    { offset: 0, dx: 0, size: 3, speed: 800, drift: 2 },
    { offset: -6, dx: 2, size: 4, speed: 1000, drift: 3 },
    { offset: -12, dx: 4, size: 3.5, speed: 900, drift: 2.5 },
    { offset: -18, dx: 3, size: 2.5, speed: 1100, drift: 1.5 },
  ];
  for (let i = 0; i < wisps.length; i++) {
    const w = wisps[i];
    const phase = t / w.speed + i * 1.3;
    const wispY = baseY + w.offset * s - (t * 0.005 % 30) * s;
    const wispX = baseX + w.dx * s + Math.sin(phase) * w.drift * s;
    const alpha = Math.max(0, 0.2 - i * 0.04);
    ctx.beginPath();
    ctx.arc(wispX, wispY, w.size * s, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,200,210,' + alpha + ')';
    ctx.fill();
  }
}

// ─── Floor division lines ──────────────────────────────

function drawFloorLines(ctx, face, floors) {
  ctx.strokeStyle = 'rgba(0,0,0,0.06)';
  ctx.lineWidth = 0.5;
  for (let f = 1; f < floors; f++) {
    const v = f / floors;
    const start = facePoint(face.tl, face.tr, face.bl, face.br, 0, v);
    const end = facePoint(face.tl, face.tr, face.bl, face.br, 1, v);
    ctx.beginPath();
    ctx.moveTo(start.x, start.y);
    ctx.lineTo(end.x, end.y);
    ctx.stroke();
  }
}

// ─── 1. HOME ───────────────────────────────────────────

function drawHomeDetails(ctx, b, c, timestamp) {
  const { frontPeak, backPeak } = drawPeakedRoof(ctx, c, '#a83228', '#c0392b', '#8a2820');

  // Chimney on right slope
  const ridgeMid = { x: (frontPeak.x + backPeak.x) / 2, y: (frontPeak.y + backPeak.y) / 2 };
  const chimneyPos = lerp(ridgeMid, c.rightElev, 0.55);
  ctx.fillStyle = '#b8a898';
  ctx.fillRect(chimneyPos.x - 2, chimneyPos.y - 10, 4, 10);
  ctx.fillStyle = '#a89888';
  ctx.fillRect(chimneyPos.x - 3, chimneyPos.y - 11, 6, 2);

  // Animated smoke
  drawSmoke(ctx, chimneyPos.x, chimneyPos.y - 12, timestamp, 0.8);

  // Door on left face
  const doorPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.88);
  ctx.fillStyle = '#4a3520';
  ctx.fillRect(doorPos.x - 2, doorPos.y - 8, 4, 8);
  ctx.beginPath();
  ctx.arc(doorPos.x + 1, doorPos.y - 8 + 8 * 0.7, 1, 0, Math.PI * 2);
  ctx.fillStyle = '#d4a017';
  ctx.fill();

  // Porch light next to door
  ctx.beginPath();
  ctx.arc(doorPos.x - 4, doorPos.y - 6, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,220,150,0.8)';
  ctx.fill();
  // Light glow
  ctx.beginPath();
  ctx.arc(doorPos.x - 4, doorPos.y - 6, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,220,150,0.1)';
  ctx.fill();

  // Windows with flower boxes
  drawWindows(ctx, c.lf, 2, 1, null, { allLit: true });
  drawWindows(ctx, c.rf, 2, 1, null, { allLit: true });

  // Flower boxes under left face windows
  for (let i = 0; i < 2; i++) {
    const u = 0.15 + (i + 0.5) / 2 * 0.7;
    const p = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, u, 0.55);
    ctx.fillStyle = '#6a4a2a';
    ctx.fillRect(p.x - 3, p.y + 1, 6, 2);
    // Flowers
    const fColors = ['#e74c3c', '#f5c842', '#bc80bd'];
    for (let f = 0; f < 3; f++) {
      ctx.beginPath();
      ctx.arc(p.x - 2 + f * 2, p.y, 1, 0, Math.PI * 2);
      ctx.fillStyle = fColors[f % fColors.length];
      ctx.fill();
    }
  }

  // Garden stepping stones
  const stoneY = c.leftBase.y + 3;
  const stoneX = c.leftBase.x;
  ctx.fillStyle = 'rgba(200,190,160,0.5)';
  for (let s = 0; s < 3; s++) {
    ctx.save();
    ctx.translate(stoneX - s * 3 - 2, stoneY + s * 1.5);
    ctx.scale(1, 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();
  }
}

// ─── 2. WORKPLACE ──────────────────────────────────────

function drawWorkplaceDetails(ctx, b, c, ws, timestamp) {
  // Floor division lines
  drawFloorLines(ctx, c.lf, 6);
  drawFloorLines(ctx, c.rf, 6);

  // Dense window grid: 4 cols x 6 rows
  drawWindows(ctx, c.lf, 4, 6, ws.workplace_left);
  drawWindows(ctx, c.rf, 4, 6, ws.workplace_right);

  // Glass lobby on left face bottom center
  const lobbyPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.9);
  ctx.fillStyle = 'rgba(180,220,255,0.7)';
  ctx.fillRect(lobbyPos.x - 4, lobbyPos.y - 12, 8, 12);

  // Lobby glass reflection sweep
  const sweepProgress = ((timestamp || 0) / 3000) % 1;
  const sweepX = lobbyPos.x - 4 + sweepProgress * 12;
  ctx.fillStyle = 'rgba(255,255,255,0.15)';
  ctx.fillRect(sweepX - 1, lobbyPos.y - 12, 2, 12);

  // Lobby divider
  ctx.beginPath();
  ctx.moveTo(lobbyPos.x, lobbyPos.y);
  ctx.lineTo(lobbyPos.x, lobbyPos.y - 12);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Revolving door detail
  ctx.beginPath();
  ctx.arc(lobbyPos.x, lobbyPos.y - 4, 3, 0, Math.PI * 2);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  // Cross inside revolving door
  ctx.beginPath();
  ctx.moveTo(lobbyPos.x - 2, lobbyPos.y - 4);
  ctx.lineTo(lobbyPos.x + 2, lobbyPos.y - 4);
  ctx.moveTo(lobbyPos.x, lobbyPos.y - 6);
  ctx.lineTo(lobbyPos.x, lobbyPos.y - 2);
  ctx.stroke();

  // HVAC units on roof
  const hvac1 = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.7, 0.7);
  const hvac2 = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.85, 0.8);
  [hvac1, hvac2].forEach(function (p) {
    ctx.fillStyle = '#607a95';
    ctx.fillRect(p.x - 2, p.y - 3, 4, 3);
    ctx.fillStyle = '#708090';
    ctx.fillRect(p.x - 2, p.y - 4, 4, 1);
    // Fan detail (spinning with timestamp)
    const fanAngle = (timestamp || 0) / 200;
    ctx.strokeStyle = '#5a6a7a';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(p.x + Math.cos(fanAngle) * 1.5, p.y - 3.5 + Math.sin(fanAngle) * 0.5);
    ctx.lineTo(p.x - Math.cos(fanAngle) * 1.5, p.y - 3.5 - Math.sin(fanAngle) * 0.5);
    ctx.stroke();
  });

  // Antenna from center-back of roof
  const antennaBase = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.3, 0.8);
  ctx.beginPath();
  ctx.moveTo(antennaBase.x, antennaBase.y);
  ctx.lineTo(antennaBase.x, antennaBase.y - 12);
  ctx.strokeStyle = '#708090';
  ctx.lineWidth = 1;
  ctx.stroke();
  const crossY = antennaBase.y - 12 * 0.6;
  ctx.beginPath();
  ctx.moveTo(antennaBase.x - 2, crossY);
  ctx.lineTo(antennaBase.x + 2, crossY);
  ctx.stroke();

  // Blinking red light on antenna tip
  const blinkOn = Math.sin((timestamp || 0) / 750) > 0.3;
  if (blinkOn) {
    ctx.beginPath();
    ctx.arc(antennaBase.x, antennaBase.y - 13, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,50,50,0.9)';
    ctx.fill();
    // Glow
    ctx.beginPath();
    ctx.arc(antennaBase.x, antennaBase.y - 13, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,50,50,0.15)';
    ctx.fill();
  }
}

// ─── 3. BANK ───────────────────────────────────────────

function drawBankDetails(ctx, b, c, ws, timestamp) {
  // Columns on left face with marble texture
  for (let i = 0; i < 3; i++) {
    const u = 0.2 + i * 0.3;
    const colTop = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, u, 0.05);
    const colBot = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, u, 0.95);
    const colH = colBot.y - colTop.y;
    ctx.fillStyle = '#faf5ed';
    ctx.fillRect(colTop.x - 1.5, colTop.y, 3, colH);
    // Highlight left edge
    ctx.beginPath();
    ctx.moveTo(colTop.x - 1.5, colTop.y);
    ctx.lineTo(colTop.x - 1.5, colBot.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    ctx.stroke();
    // Shadow right edge
    ctx.beginPath();
    ctx.moveTo(colTop.x + 1.5, colTop.y);
    ctx.lineTo(colTop.x + 1.5, colBot.y);
    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.stroke();
    // Marble veins
    ctx.strokeStyle = 'rgba(200,190,170,0.15)';
    ctx.lineWidth = 0.3;
    ctx.beginPath();
    ctx.moveTo(colTop.x - 1, colTop.y + colH * 0.2);
    ctx.lineTo(colTop.x + 1, colTop.y + colH * 0.5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(colTop.x + 0.5, colTop.y + colH * 0.6);
    ctx.lineTo(colTop.x - 0.5, colTop.y + colH * 0.85);
    ctx.stroke();
  }

  // Pediment triangle
  const pedLeft = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.1, 0.02);
  const pedRight = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.9, 0.02);
  const pedPeak = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, -0.06);
  ctx.beginPath();
  ctx.moveTo(pedLeft.x, pedLeft.y);
  ctx.lineTo(pedPeak.x, pedPeak.y);
  ctx.lineTo(pedRight.x, pedRight.y);
  ctx.closePath();
  ctx.fillStyle = '#ede5d5';
  ctx.fill();
  ctx.beginPath();
  ctx.moveTo(pedLeft.x, pedLeft.y);
  ctx.lineTo(pedRight.x, pedRight.y);
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Clock on pediment
  const clockPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, -0.01);
  ctx.beginPath();
  ctx.arc(clockPos.x, clockPos.y, 3, 0, Math.PI * 2);
  ctx.strokeStyle = '#8a7a5a';
  ctx.lineWidth = 0.5;
  ctx.stroke();
  // Clock hands
  const hourAngle = ((timestamp || 0) / 30000) % (Math.PI * 2);
  const minAngle = ((timestamp || 0) / 5000) % (Math.PI * 2);
  ctx.beginPath();
  ctx.moveTo(clockPos.x, clockPos.y);
  ctx.lineTo(clockPos.x + Math.cos(hourAngle - Math.PI / 2) * 1.5, clockPos.y + Math.sin(hourAngle - Math.PI / 2) * 1.5);
  ctx.strokeStyle = '#4a3a2a';
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(clockPos.x, clockPos.y);
  ctx.lineTo(clockPos.x + Math.cos(minAngle - Math.PI / 2) * 2, clockPos.y + Math.sin(minAngle - Math.PI / 2) * 2);
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Arched windows
  function drawArchedWindows(face, litArr) {
    for (let i = 0; i < 4; i++) {
      const u = 0.12 + (i + 0.5) / 4 * 0.76;
      const p = facePoint(face.tl, face.tr, face.bl, face.br, u, 0.5);
      const isLit = litArr[i];
      ctx.fillStyle = isLit ? 'rgba(255,240,180,0.9)' : 'rgba(100,130,180,0.35)';
      ctx.fillRect(p.x - 2, p.y - 4, 4, 9);
      ctx.beginPath();
      ctx.arc(p.x, p.y - 4, 2, Math.PI, 0);
      ctx.fill();
      if (isLit) {
        ctx.fillStyle = 'rgba(255,240,180,0.3)';
        ctx.fillRect(p.x - 3, p.y - 5, 6, 11);
      }
    }
  }
  drawArchedWindows(c.lf, ws.bank_left);
  drawArchedWindows(c.rf, ws.bank_right);

  // Polished entrance steps
  const stepColors = ['#ddd5bd', '#e5ddc5', '#ede5d5'];
  for (let s = 0; s < 3; s++) {
    const v = 1.0 + (3 - s) * 0.02;
    const outOffset = (3 - s) * 1.5;
    const sleft = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.25, v);
    const sright = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.75, v);
    ctx.beginPath();
    ctx.moveTo(sleft.x - outOffset * 0.9, sleft.y - outOffset * 0.45);
    ctx.lineTo(sright.x - outOffset * 0.9, sright.y - outOffset * 0.45);
    ctx.lineTo(sright.x - outOffset * 0.9, sright.y - outOffset * 0.45 + 2);
    ctx.lineTo(sleft.x - outOffset * 0.9, sleft.y - outOffset * 0.45 + 2);
    ctx.closePath();
    ctx.fillStyle = stepColors[s];
    ctx.fill();
    // Step highlight
    ctx.beginPath();
    ctx.moveTo(sleft.x - outOffset * 0.9, sleft.y - outOffset * 0.45);
    ctx.lineTo(sright.x - outOffset * 0.9, sright.y - outOffset * 0.45);
    ctx.strokeStyle = 'rgba(255,255,255,0.15)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Flag pole
  ctx.beginPath();
  ctx.moveTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(c.rightElev.x, c.rightElev.y - 10);
  ctx.strokeStyle = '#708090';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#f5c842';
  ctx.fillRect(c.rightElev.x + 1, c.rightElev.y - 10, 5, 3);
}

// ─── 4. GYM ────────────────────────────────────────────

function drawGymDetails(ctx, b, c, timestamp) {
  function drawPanoramicWindows(face) {
    const winTop = 0.4;
    const winBot = 0.9;
    const winLeft = 0.1;
    const winRight = 0.9;
    const tl = facePoint(face.tl, face.tr, face.bl, face.br, winLeft, winTop);
    const tr = facePoint(face.tl, face.tr, face.bl, face.br, winRight, winTop);
    const bl = facePoint(face.tl, face.tr, face.bl, face.br, winLeft, winBot);
    const br = facePoint(face.tl, face.tr, face.bl, face.br, winRight, winBot);
    ctx.beginPath();
    ctx.moveTo(tl.x, tl.y);
    ctx.lineTo(tr.x, tr.y);
    ctx.lineTo(br.x, br.y);
    ctx.lineTo(bl.x, bl.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,240,200,0.85)';
    ctx.fill();

    // Glass reflection sweep
    const sweepT = ((timestamp || 0) / 4000) % 1;
    const sweepPos = lerp(tl, tr, sweepT);
    const sweepBot = lerp(bl, br, sweepT);
    ctx.beginPath();
    ctx.moveTo(sweepPos.x - 2, sweepPos.y);
    ctx.lineTo(sweepPos.x + 2, sweepPos.y);
    ctx.lineTo(sweepBot.x + 2, sweepBot.y);
    ctx.lineTo(sweepBot.x - 2, sweepBot.y);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.15)';
    ctx.fill();

    // Mullion lines
    ctx.strokeStyle = 'rgba(255,255,255,0.3)';
    ctx.lineWidth = 1;
    for (let m = 1; m <= 3; m++) {
      const t = m / 4;
      const ml = lerp(tl, bl, t);
      const mr = lerp(tr, br, t);
      ctx.beginPath();
      ctx.moveTo(ml.x, ml.y);
      ctx.lineTo(mr.x, mr.y);
      ctx.stroke();
    }

    // Equipment silhouettes inside
    ctx.fillStyle = 'rgba(0,0,0,0.08)';
    // Treadmill shape
    const eq1 = facePoint(face.tl, face.tr, face.bl, face.br, 0.3, 0.75);
    ctx.fillRect(eq1.x - 2, eq1.y - 4, 4, 4);
    ctx.fillRect(eq1.x - 1, eq1.y - 6, 2, 2);
    // Weights
    const eq2 = facePoint(face.tl, face.tr, face.bl, face.br, 0.7, 0.75);
    ctx.fillRect(eq2.x - 3, eq2.y - 1, 6, 1);
    ctx.fillRect(eq2.x - 1, eq2.y - 3, 2, 3);
  }
  drawPanoramicWindows(c.lf);
  drawPanoramicWindows(c.rf);

  // GYM signage
  const signPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.25);
  ctx.fillStyle = 'rgba(0,0,0,0.4)';
  ctx.fillRect(signPos.x - 10, signPos.y - 5, 20, 10);
  ctx.font = 'bold 7px Nunito';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#FC8D59';
  ctx.fillText('GYM', signPos.x, signPos.y);

  // Rooftop skylight
  const skylight = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.5, 0.5);
  ctx.fillStyle = 'rgba(200,230,255,0.3)';
  ctx.fillRect(skylight.x - 4, skylight.y - 2, 8, 4);
  ctx.strokeStyle = 'rgba(255,255,255,0.1)';
  ctx.lineWidth = 1;
  ctx.strokeRect(skylight.x - 4, skylight.y - 2, 8, 4);

  // Ventilation grate on roof
  const vent = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.8, 0.3);
  ctx.fillStyle = '#4a5a6a';
  ctx.fillRect(vent.x - 2, vent.y - 1, 4, 2);
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 0.3;
  for (let g = 0; g < 3; g++) {
    ctx.beginPath();
    ctx.moveTo(vent.x - 2 + g * 1.5, vent.y - 1);
    ctx.lineTo(vent.x - 2 + g * 1.5, vent.y + 1);
    ctx.stroke();
  }
}

// ─── 5. BAR ────────────────────────────────────────────

function drawBarDetails(ctx, b, c, timestamp) {
  // Brick texture on both faces (enhanced)
  function drawBrickTexture(face) {
    const rows = 8;
    const cols = 6;
    for (let r = 0; r < rows; r++) {
      const v0 = r / rows;
      const v1 = (r + 1) / rows;
      // Alternate brick shade
      const brickAlpha = r % 2 === 0 ? 0.04 : 0;
      if (brickAlpha > 0) {
        const start = facePoint(face.tl, face.tr, face.bl, face.br, 0, v0);
        const end1 = facePoint(face.tl, face.tr, face.bl, face.br, 1, v0);
        const end2 = facePoint(face.tl, face.tr, face.bl, face.br, 1, v1);
        const start2 = facePoint(face.tl, face.tr, face.bl, face.br, 0, v1);
        ctx.beginPath();
        ctx.moveTo(start.x, start.y);
        ctx.lineTo(end1.x, end1.y);
        ctx.lineTo(end2.x, end2.y);
        ctx.lineTo(start2.x, start2.y);
        ctx.closePath();
        ctx.fillStyle = 'rgba(120,80,50,' + brickAlpha + ')';
        ctx.fill();
      }
    }
    // Mortar lines
    ctx.strokeStyle = 'rgba(180,140,100,0.3)';
    ctx.lineWidth = 0.5;
    for (let r = 1; r < rows; r++) {
      const v = r / rows;
      const start = facePoint(face.tl, face.tr, face.bl, face.br, 0, v);
      const end = facePoint(face.tl, face.tr, face.bl, face.br, 1, v);
      ctx.beginPath();
      ctx.moveTo(start.x, start.y);
      ctx.lineTo(end.x, end.y);
      ctx.stroke();
    }
    for (let r = 0; r < rows; r++) {
      const v0 = r / rows;
      const v1 = (r + 1) / rows;
      const offset = (r % 2 === 0) ? 0 : 0.5 / cols;
      for (let ci = 1; ci < cols; ci++) {
        const u = ci / cols + offset;
        if (u >= 1) continue;
        const pt = facePoint(face.tl, face.tr, face.bl, face.br, u, v0);
        const pb = facePoint(face.tl, face.tr, face.bl, face.br, u, v1);
        ctx.beginPath();
        ctx.moveTo(pt.x, pt.y);
        ctx.lineTo(pb.x, pb.y);
        ctx.stroke();
      }
    }
  }
  drawBrickTexture(c.lf);
  drawBrickTexture(c.rf);

  // Warm-lit windows
  drawWindows(ctx, c.lf, 2, 1, null, {
    allLit: true,
    litColor: 'rgba(255,200,120,0.9)',
    glowColor: 'rgba(255,200,120,0.3)',
  });
  drawWindows(ctx, c.rf, 2, 1, null, {
    allLit: true,
    litColor: 'rgba(255,200,120,0.9)',
    glowColor: 'rgba(255,200,120,0.3)',
  });

  // Light spill on ground from windows
  const groundGlow = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 1.1);
  ctx.save();
  ctx.translate(groundGlow.x - 4, groundGlow.y + 2);
  ctx.scale(1.5, 0.4);
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,200,120,0.06)';
  ctx.fill();
  ctx.restore();

  // Awning
  const awL = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.05, 0.6);
  const awR = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.95, 0.6);
  const outX = -5, outY = -3;
  ctx.beginPath();
  ctx.moveTo(awL.x, awL.y);
  ctx.lineTo(awR.x, awR.y);
  ctx.lineTo(awR.x + outX, awR.y + outY);
  ctx.lineTo(awL.x + outX, awL.y + outY);
  ctx.closePath();
  ctx.fillStyle = '#8b2020';
  ctx.fill();
  const scallops = 4;
  for (let s = 0; s < scallops; s++) {
    const t = (s + 0.5) / scallops;
    const sp = lerp(
      { x: awL.x + outX, y: awL.y + outY },
      { x: awR.x + outX, y: awR.y + outY },
      t
    );
    ctx.beginPath();
    ctx.arc(sp.x, sp.y + 2, 3, 0, Math.PI);
    ctx.fillStyle = '#8b2020';
    ctx.fill();
  }

  // Hanging light (flickers)
  const lightPos = lerp(
    { x: awL.x + outX, y: awL.y + outY },
    { x: awR.x + outX, y: awR.y + outY },
    0.5
  );
  const flicker = 0.6 + Math.sin((timestamp || 0) / 300) * 0.2 + Math.sin((timestamp || 0) / 170) * 0.15;
  ctx.beginPath();
  ctx.arc(lightPos.x, lightPos.y + 4, 2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,220,150,' + flicker + ')';
  ctx.fill();
  // Light glow
  ctx.beginPath();
  ctx.arc(lightPos.x, lightPos.y + 4, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,220,150,' + (flicker * 0.08) + ')';
  ctx.fill();

  // Door
  const doorPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.88);
  ctx.fillStyle = '#3a2515';
  ctx.fillRect(doorPos.x - 2.5, doorPos.y - 9, 5, 9);
  ctx.fillStyle = 'rgba(255,200,120,0.7)';
  ctx.fillRect(doorPos.x - 1.5, doorPos.y - 9, 3, 3);

  // BAR sign (neon-like)
  const signPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.7);
  ctx.fillStyle = '#2a1a10';
  ctx.fillRect(signPos.x - 7, signPos.y - 3, 14, 6);
  ctx.strokeStyle = '#5a3a2a';
  ctx.lineWidth = 1;
  ctx.strokeRect(signPos.x - 7, signPos.y - 3, 14, 6);
  ctx.save();
  ctx.shadowColor = 'rgba(245,200,66,0.4)';
  ctx.shadowBlur = 4;
  ctx.font = 'bold 5px Nunito';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f5c842';
  ctx.fillText('BAR', signPos.x, signPos.y);
  ctx.restore();
}

// ─── 6. CASINO ─────────────────────────────────────────

function drawCasinoDetails(ctx, b, c, ws, timestamp) {
  // Floor lines
  drawFloorLines(ctx, c.lf, 4);
  drawFloorLines(ctx, c.rf, 4);

  // Gold-glowing windows
  function drawCasinoWindows(face, litArr) {
    const margin = 0.15;
    for (let r = 0; r < 4; r++) {
      for (let ci = 0; ci < 3; ci++) {
        const u = margin + (ci + 0.5) / 3 * (1 - 2 * margin);
        const v = margin + (r + 0.5) / 4 * (1 - 2 * margin);
        const p = facePoint(face.tl, face.tr, face.bl, face.br, u, v);
        const idx = r * 3 + ci;
        const isLit = litArr[idx];
        if (isLit) {
          ctx.fillStyle = 'rgba(245,200,66,0.2)';
          ctx.fillRect(p.x - 4.5, p.y - 5.5, 9, 11);
          ctx.fillStyle = 'rgba(245,200,66,0.85)';
          ctx.fillRect(p.x - 2.5, p.y - 3.5, 5, 7);
        } else {
          ctx.fillStyle = 'rgba(100,130,180,0.35)';
          ctx.fillRect(p.x - 2.5, p.y - 3.5, 5, 7);
        }
      }
    }
  }
  drawCasinoWindows(c.lf, ws.casino_left);
  drawCasinoWindows(c.rf, ws.casino_right);

  // Animated chasing lights around border
  const t = timestamp || 0;
  const chaseCount = 12;
  const activeLight = Math.floor(t / 150) % chaseCount;

  // Left face border lights
  for (let i = 0; i < chaseCount; i++) {
    const u = (i % 4 + 0.5) / 4;
    const isTop = i < 4;
    const isBot = i >= 8;
    let lp;
    if (isTop) {
      lp = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, u, 0.02);
    } else if (isBot) {
      lp = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, u, 0.98);
    } else {
      const side = i < 6 ? 0.02 : 0.98;
      lp = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, side, 0.25 + ((i - 4) % 2) * 0.5);
    }
    const isActive = i === activeLight || i === (activeLight + 1) % chaseCount;
    ctx.beginPath();
    ctx.arc(lp.x, lp.y, 1.2, 0, Math.PI * 2);
    ctx.fillStyle = isActive ? 'rgba(245,200,66,0.9)' : 'rgba(245,200,66,0.2)';
    ctx.fill();
    if (isActive) {
      ctx.beginPath();
      ctx.arc(lp.x, lp.y, 3, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(245,200,66,0.15)';
      ctx.fill();
    }
  }

  // Neon border (pulsing)
  const neonAlpha = Math.sin(t / 400) * 0.3 + 0.7;
  ctx.globalAlpha = neonAlpha;
  ctx.strokeStyle = '#f5c842';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(c.topBase.x, c.topBase.y);
  ctx.lineTo(c.leftBase.x, c.leftBase.y);
  ctx.lineTo(c.leftElev.x, c.leftElev.y);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(c.rightBase.x, c.rightBase.y);
  ctx.lineTo(c.bottomBase.x, c.bottomBase.y);
  ctx.lineTo(c.bottomElev.x, c.bottomElev.y);
  ctx.closePath();
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Marquee text with enhanced neon bloom
  const marqueePos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.3);
  ctx.save();
  ctx.shadowColor = 'rgba(245,200,66,0.7)';
  ctx.shadowBlur = 10;
  ctx.font = 'bold 8px Nunito';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f5c842';
  ctx.fillText('CASINO', marqueePos.x, marqueePos.y);
  ctx.shadowBlur = 0;
  ctx.restore();

  // Gold entrance with red carpet
  const entrancePos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.88);
  // Red carpet
  ctx.fillStyle = 'rgba(180,30,30,0.6)';
  ctx.fillRect(entrancePos.x - 3, entrancePos.y, 6, 5);
  // Entrance
  ctx.fillStyle = '#0a0a2a';
  ctx.fillRect(entrancePos.x - 3.5, entrancePos.y - 10, 7, 10);
  ctx.strokeStyle = '#f5c842';
  ctx.lineWidth = 1;
  ctx.strokeRect(entrancePos.x - 3.5, entrancePos.y - 10, 7, 10);

  // Spotlight beams sweeping from roof
  const spotAngle1 = Math.sin(t / 3000) * 0.4;
  const spotAngle2 = Math.sin(t / 3000 + Math.PI) * 0.4;
  const roofCenter = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.5, 0.5);

  ctx.globalAlpha = 0.06;
  ctx.fillStyle = '#f5c842';
  // Spot 1
  ctx.beginPath();
  ctx.moveTo(roofCenter.x, roofCenter.y);
  ctx.lineTo(roofCenter.x - 20 + spotAngle1 * 30, roofCenter.y - 40);
  ctx.lineTo(roofCenter.x - 10 + spotAngle1 * 30, roofCenter.y - 40);
  ctx.closePath();
  ctx.fill();
  // Spot 2
  ctx.beginPath();
  ctx.moveTo(roofCenter.x, roofCenter.y);
  ctx.lineTo(roofCenter.x + 15 + spotAngle2 * 30, roofCenter.y - 35);
  ctx.lineTo(roofCenter.x + 25 + spotAngle2 * 30, roofCenter.y - 35);
  ctx.closePath();
  ctx.fill();
  ctx.globalAlpha = 1.0;

  // Golden spire
  const spireBase = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.5, 0.5);
  ctx.globalAlpha = 0.4;
  ctx.beginPath();
  ctx.moveTo(spireBase.x, spireBase.y - 8);
  ctx.lineTo(spireBase.x - 4, spireBase.y);
  ctx.lineTo(spireBase.x + 4, spireBase.y);
  ctx.closePath();
  ctx.fillStyle = '#f5c842';
  ctx.fill();
  ctx.globalAlpha = 1.0;
}

// ─── 7. HOSPITAL ───────────────────────────────────────

function drawHospitalDetails(ctx, b, c, timestamp) {
  // Floor lines
  drawFloorLines(ctx, c.lf, 4);
  drawFloorLines(ctx, c.rf, 4);

  // Clinical windows
  function drawClinicalWindows(face) {
    const margin = 0.15;
    for (let r = 0; r < 4; r++) {
      for (let ci = 0; ci < 3; ci++) {
        const u = margin + (ci + 0.5) / 3 * (1 - 2 * margin);
        const v = margin + (r + 0.5) / 4 * (1 - 2 * margin);
        const p = facePoint(face.tl, face.tr, face.bl, face.br, u, v);
        ctx.fillStyle = 'rgba(220,235,255,0.8)';
        ctx.fillRect(p.x - 2.5, p.y - 3.5, 5, 7);
        // Window frame
        ctx.strokeStyle = 'rgba(0,0,0,0.05)';
        ctx.lineWidth = 0.5;
        ctx.strokeRect(p.x - 2.5, p.y - 3.5, 5, 7);
      }
    }
  }
  drawClinicalWindows(c.lf);
  drawClinicalWindows(c.rf);

  // Red cross on left face
  const crossCenter = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.45);
  ctx.fillStyle = '#eb5757';
  ctx.fillRect(crossCenter.x - 2, crossCenter.y - 7, 4, 14);
  ctx.fillRect(crossCenter.x - 7, crossCenter.y - 2, 14, 4);

  // Emergency entrance canopy
  const canopyCenter = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.82);
  ctx.fillStyle = 'rgba(220,220,230,0.9)';
  ctx.beginPath();
  ctx.moveTo(canopyCenter.x - 8, canopyCenter.y);
  ctx.lineTo(canopyCenter.x, canopyCenter.y - 4);
  ctx.lineTo(canopyCenter.x + 8, canopyCenter.y);
  ctx.closePath();
  ctx.fill();
  // Small red cross on canopy
  ctx.fillStyle = '#eb5757';
  ctx.fillRect(canopyCenter.x - 0.5, canopyCenter.y - 3, 1, 3);
  ctx.fillRect(canopyCenter.x - 1.5, canopyCenter.y - 2, 3, 1);

  // Double doors
  const doorPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.9);
  ctx.fillStyle = '#e0e0e8';
  ctx.fillRect(doorPos.x - 5, doorPos.y - 10, 10, 10);
  ctx.beginPath();
  ctx.moveTo(doorPos.x, doorPos.y);
  ctx.lineTo(doorPos.x, doorPos.y - 10);
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(doorPos.x, doorPos.y - 10, 5, Math.PI, 0, false);
  ctx.fillStyle = 'rgba(220,240,255,0.6)';
  ctx.fill();

  // Ambulance at bay
  const bayPos = facePoint(c.rf.tl, c.rf.tr, c.rf.bl, c.rf.br, 0.5, 0.9);
  // Bay opening
  ctx.fillStyle = '#d0d0d8';
  ctx.fillRect(bayPos.x - 6, bayPos.y - 8, 12, 8);
  // Ambulance body (white box)
  ctx.fillStyle = '#f0f0f4';
  ctx.fillRect(bayPos.x - 5, bayPos.y - 6, 9, 5);
  // Red stripe
  ctx.fillStyle = '#eb5757';
  ctx.fillRect(bayPos.x - 5, bayPos.y - 4, 9, 1.5);
  // Wheels
  ctx.fillStyle = '#2c2c2c';
  ctx.beginPath();
  ctx.arc(bayPos.x - 3, bayPos.y - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(bayPos.x + 3, bayPos.y - 1, 1.5, 0, Math.PI * 2);
  ctx.fill();
  // Flashing light on ambulance
  const flashOn = Math.sin((timestamp || 0) / 500) > 0;
  if (flashOn) {
    ctx.beginPath();
    ctx.arc(bayPos.x, bayPos.y - 7, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(50,50,255,0.8)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bayPos.x, bayPos.y - 7, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(50,50,255,0.1)';
    ctx.fill();
  } else {
    ctx.beginPath();
    ctx.arc(bayPos.x, bayPos.y - 7, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,50,50,0.8)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(bayPos.x, bayPos.y - 7, 4, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,50,50,0.1)';
    ctx.fill();
  }

  // Helipad H on roof
  const heliCenter = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.5, 0.5);
  // Circle
  ctx.beginPath();
  ctx.save();
  ctx.translate(heliCenter.x, heliCenter.y);
  ctx.scale(1, 0.5);
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // H
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(heliCenter.x - 3, heliCenter.y - 2);
  ctx.lineTo(heliCenter.x - 3, heliCenter.y + 2);
  ctx.moveTo(heliCenter.x + 3, heliCenter.y - 2);
  ctx.lineTo(heliCenter.x + 3, heliCenter.y + 2);
  ctx.moveTo(heliCenter.x - 3, heliCenter.y);
  ctx.lineTo(heliCenter.x + 3, heliCenter.y);
  ctx.stroke();
}

// ─── 8. PARK ───────────────────────────────────────────

function drawPark(ctx, b, ox, oy, tw, th, timestamp) {
  const t = timestamp || 0;

  // Enhanced grass tiles
  for (let dr = 0; dr < b.tileD; dr++) {
    for (let dc = 0; dc < b.tileW; dc++) {
      const col = b.gridCol + dc;
      const row = b.gridRow + dr;
      const top = toScreen(col, row, ox, oy, tw, th);
      const right = toScreen(col + 1, row, ox, oy, tw, th);
      const bottom = toScreen(col + 1, row + 1, ox, oy, tw, th);
      const left = toScreen(col, row + 1, ox, oy, tw, th);
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(right.x, right.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.lineTo(left.x, left.y);
      ctx.closePath();
      ctx.fillStyle = (dc + dr) % 2 === 0 ? '#6aba50' : '#78ca5a';
      ctx.fill();
    }
  }

  const pcx = toScreen(b.gridCol + b.tileW / 2, b.gridRow + b.tileD / 2, ox, oy, tw, th);

  // ─── Fountain with animation ───
  // Base pool
  ctx.save();
  ctx.translate(pcx.x, pcx.y);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.restore();
  ctx.fillStyle = '#7ab8d4';
  ctx.fill();
  ctx.strokeStyle = '#5a98b4';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Animated ripple rings
  const rippleCount = 2;
  for (let r = 0; r < rippleCount; r++) {
    const rippleProgress = ((t / 1500) + r * 0.5) % 1;
    const rippleRadius = 4 + rippleProgress * 6;
    const rippleAlpha = (1 - rippleProgress) * 0.2;
    ctx.save();
    ctx.translate(pcx.x, pcx.y);
    ctx.scale(1, 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, rippleRadius, 0, Math.PI * 2);
    ctx.restore();
    ctx.strokeStyle = 'rgba(255,255,255,' + rippleAlpha + ')';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Inner pool
  ctx.save();
  ctx.translate(pcx.x, pcx.y);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.restore();
  ctx.fillStyle = '#8ac8e4';
  ctx.fill();

  // Water highlight
  ctx.save();
  ctx.translate(pcx.x, pcx.y);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.arc(-3, -2, 4, Math.PI * 0.8, Math.PI * 1.3);
  ctx.restore();
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // Spout
  ctx.fillStyle = '#b0d8e8';
  ctx.fillRect(pcx.x - 1, pcx.y - 14, 2, 14);

  // Animated water spray
  const sprayCount = 5;
  for (let s = 0; s < sprayCount; s++) {
    const angle = (s / sprayCount) * Math.PI * 2 + t / 800;
    const radius = 4 + Math.sin(t / 400 + s * 1.3) * 2;
    const sy = pcx.y - 16 - Math.abs(Math.sin(t / 300 + s * 0.8)) * 4;
    const sx = pcx.x + Math.cos(angle) * radius;
    ctx.beginPath();
    ctx.arc(sx, sy, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(200,230,244,0.6)';
    ctx.fill();
  }

  // ─── Bench ───
  const benchX = pcx.x + 12;
  const benchY = pcx.y + 2;
  ctx.fillStyle = '#6a5210';
  ctx.fillRect(benchX - 5, benchY, 1, 4);
  ctx.fillRect(benchX + 4, benchY, 1, 4);
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(benchX - 5, benchY - 1, 10, 3);
  ctx.beginPath();
  ctx.moveTo(benchX - 5, benchY - 1);
  ctx.lineTo(benchX + 5, benchY - 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();
  ctx.fillStyle = '#7a5a12';
  ctx.fillRect(benchX - 5, benchY - 4, 10, 1);

  // ─── Lamp posts ───
  const lampPositions = [
    toScreen(b.gridCol + 0.5, b.gridRow + 0.5, ox, oy, tw, th),
    toScreen(b.gridCol + b.tileW - 0.5, b.gridRow + b.tileD - 0.5, ox, oy, tw, th),
  ];
  for (let lp = 0; lp < lampPositions.length; lp++) {
    const lamp = lampPositions[lp];
    // Post
    ctx.fillStyle = '#4a4a4a';
    ctx.fillRect(lamp.x - 0.5, lamp.y - 12, 1, 12);
    // Lamp head
    ctx.fillStyle = '#6a6a6a';
    ctx.fillRect(lamp.x - 2, lamp.y - 13, 4, 2);
    // Light glow
    ctx.beginPath();
    ctx.arc(lamp.x, lamp.y - 12, 5, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,240,200,0.08)';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(lamp.x, lamp.y - 12, 2, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,240,200,0.3)';
    ctx.fill();
  }

  // ─── Enhanced flower beds ───
  const topCorner = toScreen(b.gridCol + b.tileW / 2, b.gridRow, ox, oy, tw, th);
  const rightCorner = toScreen(b.gridCol + b.tileW, b.gridRow + b.tileD / 2, ox, oy, tw, th);
  const bottomCorner = toScreen(b.gridCol + b.tileW / 2, b.gridRow + b.tileD, ox, oy, tw, th);
  const leftCorner = toScreen(b.gridCol, b.gridRow + b.tileD / 2, ox, oy, tw, th);

  const flowerColors = ['#e74c3c', '#f5c842', '#bc80bd', '#56ccf2'];
  const flowerCorners = [
    lerp(pcx, topCorner, 0.7),
    lerp(pcx, rightCorner, 0.7),
    lerp(pcx, bottomCorner, 0.7),
    lerp(pcx, leftCorner, 0.7),
  ];
  flowerCorners.forEach(function (fp, i) {
    const offsets = [[-2, -1], [2, 0], [0, 2], [1, -2], [-1, 1]];
    // Stems
    ctx.strokeStyle = '#3a7a2a';
    ctx.lineWidth = 0.5;
    offsets.forEach(function (off) {
      ctx.beginPath();
      ctx.moveTo(fp.x + off[0], fp.y + off[1]);
      ctx.lineTo(fp.x + off[0], fp.y + off[1] + 3);
      ctx.stroke();
    });
    // Flowers
    ctx.fillStyle = flowerColors[i];
    offsets.forEach(function (off) {
      ctx.beginPath();
      ctx.arc(fp.x + off[0], fp.y + off[1], 2, 0, Math.PI * 2);
      ctx.fill();
      // Flower center
      ctx.beginPath();
      ctx.arc(fp.x + off[0], fp.y + off[1], 0.8, 0, Math.PI * 2);
      ctx.fillStyle = '#f5c842';
      ctx.fill();
      ctx.fillStyle = flowerColors[i];
    });
  });

  // Park dashed border
  const borderTop = toScreen(b.gridCol, b.gridRow, ox, oy, tw, th);
  const borderRight = toScreen(b.gridCol + b.tileW, b.gridRow, ox, oy, tw, th);
  const borderBottom = toScreen(b.gridCol + b.tileW, b.gridRow + b.tileD, ox, oy, tw, th);
  const borderLeft = toScreen(b.gridCol, b.gridRow + b.tileD, ox, oy, tw, th);
  ctx.setLineDash([4, 4]);
  ctx.strokeStyle = '#6fcf97';
  ctx.globalAlpha = 0.3;
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(borderTop.x, borderTop.y);
  ctx.lineTo(borderRight.x, borderRight.y);
  ctx.lineTo(borderBottom.x, borderBottom.y);
  ctx.lineTo(borderLeft.x, borderLeft.y);
  ctx.closePath();
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.globalAlpha = 1.0;

  drawLabel(ctx, 'Park', borderBottom.x, borderBottom.y + 8);
}

// ─── 9. FRIENDS HOUSE ──────────────────────────────────

function drawFriendsDetails(ctx, b, c, timestamp) {
  // Peaked green roof
  const { frontPeak, backPeak } = drawPeakedRoof(ctx, c, '#3a6a3a', '#4a7a4a', '#2a5a2a');

  // Chimney smoke (lighter than home)
  const ridgeMid = { x: (frontPeak.x + backPeak.x) / 2, y: (frontPeak.y + backPeak.y) / 2 };
  const chimneyPos = lerp(ridgeMid, c.bottomElev, 0.5);
  ctx.fillStyle = '#a89888';
  ctx.fillRect(chimneyPos.x - 1.5, chimneyPos.y - 8, 3, 8);
  ctx.fillStyle = '#988878';
  ctx.fillRect(chimneyPos.x - 2, chimneyPos.y - 9, 4, 2);
  drawSmoke(ctx, chimneyPos.x, chimneyPos.y - 10, timestamp, 0.6);

  // Door
  const doorPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.88);
  ctx.fillStyle = '#5a4a30';
  ctx.fillRect(doorPos.x - 2, doorPos.y - 8, 4, 8);
  ctx.beginPath();
  ctx.arc(doorPos.x + 1, doorPos.y - 8 + 8 * 0.7, 1, 0, Math.PI * 2);
  ctx.fillStyle = '#c0c0c0';
  ctx.fill();

  // Porch light
  ctx.beginPath();
  ctx.arc(doorPos.x - 4, doorPos.y - 6, 1.5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,220,150,0.7)';
  ctx.fill();
  ctx.beginPath();
  ctx.arc(doorPos.x - 4, doorPos.y - 6, 5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,220,150,0.06)';
  ctx.fill();

  // Welcome mat
  const matPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.97);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#b89a6a';
  ctx.fillRect(matPos.x - 3, matPos.y - 1, 5, 2);
  ctx.globalAlpha = 1.0;

  // Picket fence sections at front
  const fenceStart = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.05, 1.05);
  const fenceEnd = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.35, 1.05);
  // Horizontal rail
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(fenceStart.x, fenceStart.y - 3);
  ctx.lineTo(fenceEnd.x, fenceEnd.y - 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(fenceStart.x, fenceStart.y - 1);
  ctx.lineTo(fenceEnd.x, fenceEnd.y - 1);
  ctx.stroke();
  // Pickets
  for (let p = 0; p < 4; p++) {
    const pt = lerp(fenceStart, fenceEnd, p / 3);
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(pt.x, pt.y - 5);
    ctx.stroke();
    // Pointed top
    ctx.beginPath();
    ctx.moveTo(pt.x - 0.5, pt.y - 5);
    ctx.lineTo(pt.x, pt.y - 6);
    ctx.lineTo(pt.x + 0.5, pt.y - 5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();
  }

  // Right side fence
  const fenceStart2 = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.65, 1.05);
  const fenceEnd2 = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.95, 1.05);
  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(fenceStart2.x, fenceStart2.y - 3);
  ctx.lineTo(fenceEnd2.x, fenceEnd2.y - 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(fenceStart2.x, fenceStart2.y - 1);
  ctx.lineTo(fenceEnd2.x, fenceEnd2.y - 1);
  ctx.stroke();
  for (let p = 0; p < 4; p++) {
    const pt = lerp(fenceStart2, fenceEnd2, p / 3);
    ctx.beginPath();
    ctx.moveTo(pt.x, pt.y);
    ctx.lineTo(pt.x, pt.y - 5);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(pt.x - 0.5, pt.y - 5);
    ctx.lineTo(pt.x, pt.y - 6);
    ctx.lineTo(pt.x + 0.5, pt.y - 5);
    ctx.closePath();
    ctx.fillStyle = 'rgba(255,255,255,0.6)';
    ctx.fill();
  }

  // Garden flowers in front
  const gardenBase = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.2, 1.08);
  const gardenColors = ['#e74c3c', '#f5c842', '#56ccf2'];
  for (let g = 0; g < 3; g++) {
    const gx = gardenBase.x + g * 4;
    const gy = gardenBase.y;
    // Stem
    ctx.strokeStyle = '#3a7a2a';
    ctx.lineWidth = 0.5;
    ctx.beginPath();
    ctx.moveTo(gx, gy);
    ctx.lineTo(gx, gy + 3);
    ctx.stroke();
    // Flower
    ctx.beginPath();
    ctx.arc(gx, gy, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = gardenColors[g];
    ctx.fill();
  }

  // Mailbox
  const mailboxX = c.rightBase.x + 4;
  const mailboxY = c.rightBase.y;
  ctx.fillStyle = '#6a5a4a';
  ctx.fillRect(mailboxX - 0.5, mailboxY - 4, 1, 4);
  ctx.fillStyle = '#4a7aba';
  ctx.fillRect(mailboxX - 2, mailboxY - 9, 3, 5);
  ctx.beginPath();
  ctx.moveTo(mailboxX + 1, mailboxY - 9);
  ctx.lineTo(mailboxX + 3, mailboxY - 8);
  ctx.lineTo(mailboxX + 1, mailboxY - 7);
  ctx.closePath();
  ctx.fillStyle = '#eb5757';
  ctx.fill();

  // Windows
  drawWindows(ctx, c.lf, 2, 1, null, { allLit: true });
  drawWindows(ctx, c.rf, 2, 1, null, { allLit: true });
}

// Pre-sort buildings once at module load (static data)
const sortedBuildings = [...BUILDINGS].sort(
  (a, b) => (a.gridCol + a.gridRow) - (b.gridCol + b.gridRow)
);

// ─── Main export ───────────────────────────────────────

export function drawAllBuildings(ctx, config, windowStates, timestamp) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;
  const t = timestamp || 0;

  const sorted = sortedBuildings;

  // First pass: shadows (skip park)
  for (let i = 0; i < sorted.length; i++) {
    const b = sorted[i];
    if (b.type === 'park') continue;
    drawShadow(ctx, b, ox, oy, tw, th);
  }

  // Second pass: buildings back-to-front
  for (let i = 0; i < sorted.length; i++) {
    const b = sorted[i];

    if (b.type === 'park') {
      drawPark(ctx, b, ox, oy, tw, th, t);
      continue;
    }

    const c = getCorners(b, ox, oy, tw, th);
    drawBuildingBox(ctx, b, c);

    switch (b.id) {
      case 'home': drawHomeDetails(ctx, b, c, t); break;
      case 'workplace': drawWorkplaceDetails(ctx, b, c, windowStates, t); break;
      case 'bank': drawBankDetails(ctx, b, c, windowStates, t); break;
      case 'gym': drawGymDetails(ctx, b, c, t); break;
      case 'bar': drawBarDetails(ctx, b, c, t); break;
      case 'casino': drawCasinoDetails(ctx, b, c, windowStates, t); break;
      case 'hospital': drawHospitalDetails(ctx, b, c, t); break;
      case 'friends': drawFriendsDetails(ctx, b, c, t); break;
    }

    drawLabel(ctx, b.name, c.bottomBase.x, c.bottomBase.y + 8);
  }
}
