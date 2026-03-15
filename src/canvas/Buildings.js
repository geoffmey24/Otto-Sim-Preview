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
      } else {
        ctx.fillStyle = unlitColor;
        ctx.fillRect(p.x - 2.5, p.y - 3.5, 5, 7);
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
  const sx = 8, sy = 4;
  const stretch = (rightBase.x - leftBase.x) * 0.2;
  ctx.beginPath();
  ctx.moveTo(topBase.x + sx, topBase.y + sy);
  ctx.lineTo(rightBase.x + sx + stretch, rightBase.y + sy);
  ctx.lineTo(bottomBase.x + sx + stretch, bottomBase.y + sy);
  ctx.lineTo(leftBase.x + sx, leftBase.y + sy);
  ctx.closePath();
  ctx.fillStyle = 'rgba(20,30,10,0.18)';
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
  // Far-left edge stroke
  ctx.beginPath();
  ctx.moveTo(c.leftElev.x, c.leftElev.y);
  ctx.lineTo(c.leftBase.x, c.leftBase.y);
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
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
  // Far-right edge stroke
  ctx.beginPath();
  ctx.moveTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(c.rightBase.x, c.rightBase.y);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();

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

  // Left slope (visible, lighter)
  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(frontPeak.x, frontPeak.y);
  ctx.lineTo(backPeak.x, backPeak.y);
  ctx.lineTo(c.leftElev.x, c.leftElev.y);
  ctx.closePath();
  ctx.fillStyle = backColor;
  ctx.fill();

  // Right slope (visible, darker)
  ctx.beginPath();
  ctx.moveTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(frontPeak.x, frontPeak.y);
  ctx.lineTo(backPeak.x, backPeak.y);
  ctx.lineTo(c.bottomElev.x, c.bottomElev.y);
  ctx.closePath();
  ctx.fillStyle = frontColor;
  ctx.fill();

  // Front gable triangle
  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(frontPeak.x, frontPeak.y);
  ctx.lineTo(c.rightElev.x, c.rightElev.y);
  ctx.closePath();
  ctx.fillStyle = frontColor;
  ctx.fill();

  // Back gable triangle
  ctx.beginPath();
  ctx.moveTo(c.leftElev.x, c.leftElev.y);
  ctx.lineTo(backPeak.x, backPeak.y);
  ctx.lineTo(c.bottomElev.x, c.bottomElev.y);
  ctx.closePath();
  ctx.fillStyle = backColor;
  ctx.fill();

  // Ridge line
  ctx.beginPath();
  ctx.moveTo(frontPeak.x, frontPeak.y);
  ctx.lineTo(backPeak.x, backPeak.y);
  ctx.strokeStyle = ridgeColor;
  ctx.lineWidth = 1;
  ctx.stroke();

  return { frontPeak, backPeak };
}

// ─── 1. HOME ───────────────────────────────────────────

function drawHomeDetails(ctx, b, c) {
  // Peaked red roof
  const { frontPeak, backPeak } = drawPeakedRoof(ctx, c, '#a83228', '#c0392b', '#8a2820');

  // Chimney on right slope
  const ridgeMid = { x: (frontPeak.x + backPeak.x) / 2, y: (frontPeak.y + backPeak.y) / 2 };
  const chimneyPos = lerp(ridgeMid, c.rightElev, 0.55);
  ctx.fillStyle = '#b8a898';
  ctx.fillRect(chimneyPos.x - 2, chimneyPos.y - 10, 4, 10);
  ctx.fillStyle = '#a89888';
  ctx.fillRect(chimneyPos.x - 3, chimneyPos.y - 11, 6, 2);

  // Smoke wisps
  ctx.fillStyle = 'rgba(200,200,200,0.2)';
  ctx.beginPath();
  ctx.arc(chimneyPos.x, chimneyPos.y - 14, 3, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(chimneyPos.x + 2, chimneyPos.y - 20, 4, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(chimneyPos.x + 4, chimneyPos.y - 26, 3, 0, Math.PI * 2);
  ctx.fill();

  // Door on left face
  const doorPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.88);
  ctx.fillStyle = '#4a3520';
  ctx.fillRect(doorPos.x - 2, doorPos.y - 8, 4, 8);
  ctx.beginPath();
  ctx.arc(doorPos.x + 1, doorPos.y - 8 + 8 * 0.7, 1, 0, Math.PI * 2);
  ctx.fillStyle = '#d4a017';
  ctx.fill();

  // Windows: 2 per face, all lit
  drawWindows(ctx, c.lf, 2, 1, null, { allLit: true });
  drawWindows(ctx, c.rf, 2, 1, null, { allLit: true });
}

// ─── 2. WORKPLACE ──────────────────────────────────────

function drawWorkplaceDetails(ctx, b, c, ws) {
  // Dense window grid: 4 cols x 6 rows
  drawWindows(ctx, c.lf, 4, 6, ws.workplace_left);
  drawWindows(ctx, c.rf, 4, 6, ws.workplace_right);

  // Glass lobby on left face bottom center
  const lobbyPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.9);
  ctx.fillStyle = 'rgba(180,220,255,0.7)';
  ctx.fillRect(lobbyPos.x - 4, lobbyPos.y - 12, 8, 12);
  ctx.beginPath();
  ctx.moveTo(lobbyPos.x, lobbyPos.y);
  ctx.lineTo(lobbyPos.x, lobbyPos.y - 12);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // HVAC units on roof (back-right area)
  const hvac1 = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.7, 0.7);
  const hvac2 = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.85, 0.8);
  [hvac1, hvac2].forEach(function (p) {
    ctx.fillStyle = '#607a95';
    ctx.fillRect(p.x - 2, p.y - 3, 4, 3);
    ctx.fillStyle = '#708090';
    ctx.fillRect(p.x - 2, p.y - 4, 4, 1);
  });

  // Antenna from center-back of roof
  const antennaBase = facePoint(c.tf.tl, c.tf.tr, c.tf.bl, c.tf.br, 0.3, 0.8);
  ctx.beginPath();
  ctx.moveTo(antennaBase.x, antennaBase.y);
  ctx.lineTo(antennaBase.x, antennaBase.y - 12);
  ctx.strokeStyle = '#708090';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Crossbar at 60% height
  const crossY = antennaBase.y - 12 * 0.6;
  ctx.beginPath();
  ctx.moveTo(antennaBase.x - 2, crossY);
  ctx.lineTo(antennaBase.x + 2, crossY);
  ctx.stroke();
}

// ─── 3. BANK ───────────────────────────────────────────

function drawBankDetails(ctx, b, c, ws) {
  // Columns on left face: 3 evenly spaced
  const colHeight = b.height - 8;
  for (let i = 0; i < 3; i++) {
    const u = 0.2 + i * 0.3;
    const colTop = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, u, 0.05);
    const colBot = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, u, 0.95);
    ctx.fillStyle = '#faf5ed';
    ctx.fillRect(colTop.x - 1.5, colTop.y, 3, colBot.y - colTop.y);
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
  }

  // Pediment triangle above columns on left face
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

  // Arched windows: 4 per face
  function drawArchedWindows(face, litArr) {
    for (let i = 0; i < 4; i++) {
      const u = 0.12 + (i + 0.5) / 4 * 0.76;
      const p = facePoint(face.tl, face.tr, face.bl, face.br, u, 0.5);
      const isLit = litArr[i];
      ctx.fillStyle = isLit ? 'rgba(255,240,180,0.9)' : 'rgba(100,130,180,0.35)';
      ctx.fillRect(p.x - 2, p.y - 4, 4, 9);
      // Semicircular arch top
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

  // Entrance steps at base of left face
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
  }

  // Flag pole from front-right corner of roof
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

function drawGymDetails(ctx, b, c) {
  // Panoramic windows on each face
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
    // Mullion lines: 3 horizontal dividers
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
  }
  drawPanoramicWindows(c.lf);
  drawPanoramicWindows(c.rf);

  // GYM signage on left face
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
}

// ─── 5. BAR ────────────────────────────────────────────

function drawBarDetails(ctx, b, c) {
  // Brick texture on both faces
  function drawBrickTexture(face) {
    const rows = 8;
    const cols = 6;
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

  // Warm-lit windows: 2 per face
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

  // Awning on left face at 60% height
  const awL = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.05, 0.6);
  const awR = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.95, 0.6);
  const outX = -5, outY = -3; // outward from left face
  ctx.beginPath();
  ctx.moveTo(awL.x, awL.y);
  ctx.lineTo(awR.x, awR.y);
  ctx.lineTo(awR.x + outX, awR.y + outY);
  ctx.lineTo(awL.x + outX, awL.y + outY);
  ctx.closePath();
  ctx.fillStyle = '#8b2020';
  ctx.fill();
  // Scalloped arcs along bottom edge of awning
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

  // Hanging light below awning center
  const lightPos = lerp(
    { x: awL.x + outX, y: awL.y + outY },
    { x: awR.x + outX, y: awR.y + outY },
    0.5
  );
  ctx.beginPath();
  ctx.arc(lightPos.x, lightPos.y + 4, 2, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,220,150,0.8)';
  ctx.fill();

  // Door on left face bottom center
  const doorPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.88);
  ctx.fillStyle = '#3a2515';
  ctx.fillRect(doorPos.x - 2.5, doorPos.y - 9, 5, 9);
  // Door window
  ctx.fillStyle = 'rgba(255,200,120,0.7)';
  ctx.fillRect(doorPos.x - 1.5, doorPos.y - 9, 3, 3);

  // BAR sign above door
  const signPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.7);
  ctx.fillStyle = '#2a1a10';
  ctx.fillRect(signPos.x - 7, signPos.y - 3, 14, 6);
  ctx.strokeStyle = '#5a3a2a';
  ctx.lineWidth = 1;
  ctx.strokeRect(signPos.x - 7, signPos.y - 3, 14, 6);
  ctx.font = 'bold 5px Nunito';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f5c842';
  ctx.fillText('BAR', signPos.x, signPos.y);
}

// ─── 6. CASINO ─────────────────────────────────────────

function drawCasinoDetails(ctx, b, c, ws) {
  // Gold-glowing windows: 3 cols x 4 rows
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
          // Double glow
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

  // Animated neon border on left and right faces
  const neonAlpha = Math.sin(Date.now() / 400) * 0.3 + 0.7;
  ctx.globalAlpha = neonAlpha;
  ctx.strokeStyle = '#f5c842';
  ctx.lineWidth = 2;
  // Left face outline
  ctx.beginPath();
  ctx.moveTo(c.topElev.x, c.topElev.y);
  ctx.lineTo(c.topBase.x, c.topBase.y);
  ctx.lineTo(c.leftBase.x, c.leftBase.y);
  ctx.lineTo(c.leftElev.x, c.leftElev.y);
  ctx.closePath();
  ctx.stroke();
  // Right face outline
  ctx.beginPath();
  ctx.moveTo(c.rightElev.x, c.rightElev.y);
  ctx.lineTo(c.rightBase.x, c.rightBase.y);
  ctx.lineTo(c.bottomBase.x, c.bottomBase.y);
  ctx.lineTo(c.bottomElev.x, c.bottomElev.y);
  ctx.closePath();
  ctx.stroke();
  ctx.globalAlpha = 1.0;

  // Marquee text with glow
  const marqueePos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.3);
  ctx.shadowColor = 'rgba(245,200,66,0.6)';
  ctx.shadowBlur = 6;
  ctx.font = 'bold 8px Nunito';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f5c842';
  ctx.fillText('CASINO', marqueePos.x, marqueePos.y);
  ctx.shadowColor = 'transparent';
  ctx.shadowBlur = 0;

  // Gold entrance
  const entrancePos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.88);
  ctx.fillStyle = '#0a0a2a';
  ctx.fillRect(entrancePos.x - 3.5, entrancePos.y - 10, 7, 10);
  ctx.strokeStyle = '#f5c842';
  ctx.lineWidth = 1;
  ctx.strokeRect(entrancePos.x - 3.5, entrancePos.y - 10, 7, 10);

  // Rooftop golden spire
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

function drawHospitalDetails(ctx, b, c) {
  // Uniform window grid: 3 cols x 4 rows, all same clinical light
  function drawClinicalWindows(face) {
    const margin = 0.15;
    for (let r = 0; r < 4; r++) {
      for (let ci = 0; ci < 3; ci++) {
        const u = margin + (ci + 0.5) / 3 * (1 - 2 * margin);
        const v = margin + (r + 0.5) / 4 * (1 - 2 * margin);
        const p = facePoint(face.tl, face.tr, face.bl, face.br, u, v);
        ctx.fillStyle = 'rgba(220,235,255,0.8)';
        ctx.fillRect(p.x - 2.5, p.y - 3.5, 5, 7);
      }
    }
  }
  drawClinicalWindows(c.lf);
  drawClinicalWindows(c.rf);

  // Red cross on left face center
  const crossCenter = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.45);
  ctx.fillStyle = '#eb5757';
  ctx.fillRect(crossCenter.x - 2, crossCenter.y - 7, 4, 14);
  ctx.fillRect(crossCenter.x - 7, crossCenter.y - 2, 14, 4);

  // Double doors at bottom center of left face
  const doorPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.9);
  ctx.fillStyle = '#e0e0e8';
  ctx.fillRect(doorPos.x - 5, doorPos.y - 10, 10, 10);
  // Vertical divider
  ctx.beginPath();
  ctx.moveTo(doorPos.x, doorPos.y);
  ctx.lineTo(doorPos.x, doorPos.y - 10);
  ctx.strokeStyle = 'rgba(0,0,0,0.1)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Semicircular arch window above doors
  ctx.beginPath();
  ctx.arc(doorPos.x, doorPos.y - 10, 5, Math.PI, 0, false);
  ctx.fillStyle = 'rgba(220,240,255,0.6)';
  ctx.fill();

  // Ambulance bay on right face bottom
  const bayPos = facePoint(c.rf.tl, c.rf.tr, c.rf.bl, c.rf.br, 0.5, 0.9);
  ctx.fillStyle = '#d0d0d8';
  ctx.fillRect(bayPos.x - 6, bayPos.y - 8, 12, 8);
}

// ─── 8. PARK ───────────────────────────────────────────

function drawPark(ctx, b, ox, oy, tw, th) {
  // Enhanced grass tiles for 3x3 area
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

  // Park center
  const pcx = toScreen(b.gridCol + b.tileW / 2, b.gridRow + b.tileD / 2, ox, oy, tw, th);

  // Fountain
  // Base pool (isometric ellipse)
  ctx.save();
  ctx.translate(pcx.x, pcx.y);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.restore();
  ctx.fillStyle = '#7ab8d4';
  ctx.fill();
  ctx.strokeStyle = '#5a98b4';
  ctx.lineWidth = 1;
  ctx.stroke();

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

  // Water spray dots
  ctx.fillStyle = '#c8e8f4';
  ctx.beginPath(); ctx.arc(pcx.x, pcx.y - 16, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(pcx.x - 3, pcx.y - 18, 2, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.arc(pcx.x + 3, pcx.y - 18, 2, 0, Math.PI * 2); ctx.fill();

  // Bench (12px to the right of fountain)
  const benchX = pcx.x + 12;
  const benchY = pcx.y + 2;
  // Legs
  ctx.fillStyle = '#6a5210';
  ctx.fillRect(benchX - 5, benchY, 1, 4);
  ctx.fillRect(benchX + 4, benchY, 1, 4);
  // Seat
  ctx.fillStyle = '#8B6914';
  ctx.fillRect(benchX - 5, benchY - 1, 10, 3);
  // Seat highlight
  ctx.beginPath();
  ctx.moveTo(benchX - 5, benchY - 1);
  ctx.lineTo(benchX + 5, benchY - 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.15)';
  ctx.lineWidth = 1;
  ctx.stroke();
  // Back rest
  ctx.fillStyle = '#7a5a12';
  ctx.fillRect(benchX - 5, benchY - 4, 10, 1);

  // Flower beds at 4 diagonal corners
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
    ctx.fillStyle = flowerColors[i];
    const offsets = [[-2, -1], [2, 0], [0, 2], [1, -2]];
    offsets.forEach(function (off) {
      ctx.beginPath();
      ctx.arc(fp.x + off[0], fp.y + off[1], 2, 0, Math.PI * 2);
      ctx.fill();
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

  // Label
  drawLabel(ctx, 'Park', borderBottom.x, borderBottom.y + 8);
}

// ─── 9. FRIENDS HOUSE ──────────────────────────────────

function drawFriendsDetails(ctx, b, c) {
  // Peaked green roof
  drawPeakedRoof(ctx, c, '#3a6a3a', '#4a7a4a', '#2a5a2a');

  // Door on left face
  const doorPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.88);
  ctx.fillStyle = '#5a4a30';
  ctx.fillRect(doorPos.x - 2, doorPos.y - 8, 4, 8);
  ctx.beginPath();
  ctx.arc(doorPos.x + 1, doorPos.y - 8 + 8 * 0.7, 1, 0, Math.PI * 2);
  ctx.fillStyle = '#c0c0c0';
  ctx.fill();

  // Welcome mat
  const matPos = facePoint(c.lf.tl, c.lf.tr, c.lf.bl, c.lf.br, 0.5, 0.97);
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#b89a6a';
  ctx.fillRect(matPos.x - 3, matPos.y - 1, 5, 2);
  ctx.globalAlpha = 1.0;

  // Mailbox at front-right corner, ground level
  const mailboxX = c.rightBase.x + 4;
  const mailboxY = c.rightBase.y;
  // Post
  ctx.fillStyle = '#6a5a4a';
  ctx.fillRect(mailboxX - 0.5, mailboxY - 4, 1, 4);
  // Box body
  ctx.fillStyle = '#4a7aba';
  ctx.fillRect(mailboxX - 2, mailboxY - 9, 3, 5);
  // Red flag
  ctx.beginPath();
  ctx.moveTo(mailboxX + 1, mailboxY - 9);
  ctx.lineTo(mailboxX + 3, mailboxY - 8);
  ctx.lineTo(mailboxX + 1, mailboxY - 7);
  ctx.closePath();
  ctx.fillStyle = '#eb5757';
  ctx.fill();

  // Windows: 2 per face, warm lit
  drawWindows(ctx, c.lf, 2, 1, null, { allLit: true });
  drawWindows(ctx, c.rf, 2, 1, null, { allLit: true });
}

// Pre-sort buildings once at module load (static data)
const sortedBuildings = [...BUILDINGS].sort(
  (a, b) => (a.gridCol + a.gridRow) - (b.gridCol + b.gridRow)
);

// ─── Main export ───────────────────────────────────────

export function drawAllBuildings(ctx, config, windowStates) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;

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
      drawPark(ctx, b, ox, oy, tw, th);
      continue;
    }

    const c = getCorners(b, ox, oy, tw, th);
    drawBuildingBox(ctx, b, c);

    switch (b.id) {
      case 'home': drawHomeDetails(ctx, b, c); break;
      case 'workplace': drawWorkplaceDetails(ctx, b, c, windowStates); break;
      case 'bank': drawBankDetails(ctx, b, c, windowStates); break;
      case 'gym': drawGymDetails(ctx, b, c); break;
      case 'bar': drawBarDetails(ctx, b, c); break;
      case 'casino': drawCasinoDetails(ctx, b, c, windowStates); break;
      case 'hospital': drawHospitalDetails(ctx, b, c); break;
      case 'friends': drawFriendsDetails(ctx, b, c); break;
    }

    drawLabel(ctx, b.name, c.bottomBase.x, c.bottomBase.y + 8);
  }
}
