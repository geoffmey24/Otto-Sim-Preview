import { toScreen } from '../utils/helpers';

// Pre-computed deterministic seed for tile variation
function tileSeed(col, row) {
  return ((col * 2654435761) ^ (row * 2246822519)) >>> 0;
}

// Pre-computed cloud positions (static, calculated once)
const CLOUDS = [
  { x: 0.12, y: 0.08, scaleX: 60, scaleY: 18, alpha: 0.35 },
  { x: 0.38, y: 0.05, scaleX: 80, scaleY: 22, alpha: 0.25 },
  { x: 0.65, y: 0.10, scaleX: 50, scaleY: 15, alpha: 0.30 },
  { x: 0.85, y: 0.06, scaleX: 70, scaleY: 20, alpha: 0.20 },
  { x: 0.25, y: 0.14, scaleX: 45, scaleY: 14, alpha: 0.22 },
];

// Grass color palette for variety
const GRASS_COLORS = [
  '#5a8a3a', '#5e9040', '#528535', '#6aaa45',
  '#4e8032', '#5c9538', '#639a42', '#4a7a2a',
];

// Dirt/worn patches near roads (tiles adjacent to road row/col 10)
function isNearRoad(col, row) {
  return Math.abs(col - 10) <= 1 || Math.abs(row - 10) <= 1;
}

export function drawGround(ctx, config, timestamp) {
  const { originX, originY, tileWidth, tileHeight, gridSize, width, height } = config;
  const tw = tileWidth;
  const th = tileHeight;
  const now = timestamp || 0;

  // ─── Rich sky gradient ─────────────────────────────────
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height * 0.6);
  skyGrad.addColorStop(0, '#5BA3D9');
  skyGrad.addColorStop(0.25, '#7EC8E3');
  skyGrad.addColorStop(0.5, '#A8DCF0');
  skyGrad.addColorStop(0.75, '#D4EDDA');
  skyGrad.addColorStop(1.0, '#E8F5C8');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // ─── Animated clouds ───────────────────────────────────
  for (let i = 0; i < CLOUDS.length; i++) {
    const cloud = CLOUDS[i];
    const drift = (now * 0.003 + i * 200) % (width + 200) - 100;
    const cx = cloud.x * width + drift * 0.15;
    const cy = cloud.y * height;

    ctx.globalAlpha = cloud.alpha;
    ctx.fillStyle = '#ffffff';

    // Main body
    ctx.beginPath();
    ctx.save();
    ctx.translate(cx, cy);
    ctx.scale(cloud.scaleX / 20, cloud.scaleY / 20);
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();

    // Left puff
    ctx.beginPath();
    ctx.save();
    ctx.translate(cx - cloud.scaleX * 0.5, cy + 2);
    ctx.scale(cloud.scaleX * 0.6 / 20, cloud.scaleY * 0.7 / 20);
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();

    // Right puff
    ctx.beginPath();
    ctx.save();
    ctx.translate(cx + cloud.scaleX * 0.45, cy + 1);
    ctx.scale(cloud.scaleX * 0.55 / 20, cloud.scaleY * 0.65 / 20);
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();

    // Top puff
    ctx.beginPath();
    ctx.save();
    ctx.translate(cx + cloud.scaleX * 0.15, cy - cloud.scaleY * 0.4);
    ctx.scale(cloud.scaleX * 0.4 / 20, cloud.scaleY * 0.5 / 20);
    ctx.arc(0, 0, 20, 0, Math.PI * 2);
    ctx.restore();
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;

  // ─── Ground tiles with texture ─────────────────────────
  for (let row = 0; row < gridSize; row++) {
    for (let col = 0; col < gridSize; col++) {
      const top = toScreen(col, row, originX, originY, tw, th);
      const right = toScreen(col + 1, row, originX, originY, tw, th);
      const bottom = toScreen(col + 1, row + 1, originX, originY, tw, th);
      const left = toScreen(col, row + 1, originX, originY, tw, th);

      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(right.x, right.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.lineTo(left.x, left.y);
      ctx.closePath();

      // Rich grass color from deterministic seed
      const seed = tileSeed(col, row);
      const colorIdx = seed % GRASS_COLORS.length;
      ctx.fillStyle = GRASS_COLORS[colorIdx];
      ctx.fill();

      // Dirt patches near roads
      if (isNearRoad(col, row)) {
        ctx.fillStyle = 'rgba(160,140,100,0.12)';
        ctx.fill();
      }

      // Subtle dark bottom-right edge
      ctx.beginPath();
      ctx.moveTo(right.x, right.y);
      ctx.lineTo(bottom.x, bottom.y);
      ctx.lineTo(left.x, left.y);
      ctx.strokeStyle = 'rgba(0,40,0,0.08)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Highlight on top-left edge
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(left.x, left.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.07)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Grass texture strokes (deterministic, 2-3 per tile)
      const cx = (top.x + bottom.x) / 2;
      const cy = (top.y + bottom.y) / 2;
      const grassCount = 2 + (seed >> 8) % 2;
      ctx.strokeStyle = 'rgba(40,80,20,0.15)';
      ctx.lineWidth = 0.5;
      for (let g = 0; g < grassCount; g++) {
        const gSeed = tileSeed(col + g * 7, row + g * 11);
        const gx = cx + ((gSeed % 20) - 10) * (tw / 64);
        const gy = cy + (((gSeed >> 4) % 12) - 6) * (th / 32);
        const angle = ((gSeed >> 8) % 6) * 0.5 - 1.5;
        ctx.beginPath();
        ctx.moveTo(gx, gy);
        ctx.lineTo(gx + Math.cos(angle) * 3, gy + Math.sin(angle) * 3 - 2);
        ctx.stroke();
      }
    }
  }
}

export function drawRoads(ctx, config) {
  const { originX, originY, tileWidth, tileHeight, gridSize } = config;
  const tw = tileWidth;
  const th = tileHeight;

  function drawTilePath(col, row) {
    const top = toScreen(col, row, originX, originY, tw, th);
    const right = toScreen(col + 1, row, originX, originY, tw, th);
    const bottom = toScreen(col + 1, row + 1, originX, originY, tw, th);
    const left = toScreen(col, row + 1, originX, originY, tw, th);
    return { top, right, bottom, left };
  }

  function fillDiamond(top, right, bottom, left, color) {
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.lineTo(left.x, left.y);
    ctx.closePath();
    ctx.fillStyle = color;
    ctx.fill();
  }

  // ─── Sidewalk strips (drawn before road so road overlaps inner edge) ───

  // Horizontal road sidewalks (row 9.85 and row 11.15 strips)
  for (let col = 0; col < gridSize; col++) {
    // Top sidewalk strip
    const swTop = {
      a: toScreen(col, 9.8, originX, originY, tw, th),
      b: toScreen(col + 1, 9.8, originX, originY, tw, th),
      c: toScreen(col + 1, 10, originX, originY, tw, th),
      d: toScreen(col, 10, originX, originY, tw, th),
    };
    ctx.beginPath();
    ctx.moveTo(swTop.a.x, swTop.a.y);
    ctx.lineTo(swTop.b.x, swTop.b.y);
    ctx.lineTo(swTop.c.x, swTop.c.y);
    ctx.lineTo(swTop.d.x, swTop.d.y);
    ctx.closePath();
    ctx.fillStyle = '#c8b89a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Bottom sidewalk strip
    const swBot = {
      a: toScreen(col, 11, originX, originY, tw, th),
      b: toScreen(col + 1, 11, originX, originY, tw, th),
      c: toScreen(col + 1, 11.2, originX, originY, tw, th),
      d: toScreen(col, 11.2, originX, originY, tw, th),
    };
    ctx.beginPath();
    ctx.moveTo(swBot.a.x, swBot.a.y);
    ctx.lineTo(swBot.b.x, swBot.b.y);
    ctx.lineTo(swBot.c.x, swBot.c.y);
    ctx.lineTo(swBot.d.x, swBot.d.y);
    ctx.closePath();
    ctx.fillStyle = '#c8b89a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // Vertical road sidewalks
  for (let row = 0; row < gridSize; row++) {
    // Left sidewalk strip
    const swLeft = {
      a: toScreen(9.8, row, originX, originY, tw, th),
      b: toScreen(10, row, originX, originY, tw, th),
      c: toScreen(10, row + 1, originX, originY, tw, th),
      d: toScreen(9.8, row + 1, originX, originY, tw, th),
    };
    ctx.beginPath();
    ctx.moveTo(swLeft.a.x, swLeft.a.y);
    ctx.lineTo(swLeft.b.x, swLeft.b.y);
    ctx.lineTo(swLeft.c.x, swLeft.c.y);
    ctx.lineTo(swLeft.d.x, swLeft.d.y);
    ctx.closePath();
    ctx.fillStyle = '#c8b89a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5;
    ctx.stroke();

    // Right sidewalk strip
    const swRight = {
      a: toScreen(11, row, originX, originY, tw, th),
      b: toScreen(11.2, row, originX, originY, tw, th),
      c: toScreen(11.2, row + 1, originX, originY, tw, th),
      d: toScreen(11, row + 1, originX, originY, tw, th),
    };
    ctx.beginPath();
    ctx.moveTo(swRight.a.x, swRight.a.y);
    ctx.lineTo(swRight.b.x, swRight.b.y);
    ctx.lineTo(swRight.c.x, swRight.c.y);
    ctx.lineTo(swRight.d.x, swRight.d.y);
    ctx.closePath();
    ctx.fillStyle = '#c8b89a';
    ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.06)';
    ctx.lineWidth = 0.5;
    ctx.stroke();
  }

  // ─── Horizontal road on row 10 ─────────────────────────
  for (let col = 0; col < gridSize; col++) {
    const { top, right, bottom, left } = drawTilePath(col, 10);

    // Road surface — darker asphalt base
    fillDiamond(top, right, bottom, left, '#686878');

    // Asphalt texture speckles (deterministic)
    const seed = tileSeed(col, 10);
    ctx.fillStyle = 'rgba(90,90,100,0.3)';
    for (let s = 0; s < 4; s++) {
      const ss = tileSeed(col + s * 3, 10 + s * 5);
      const cx = top.x + (right.x - top.x) * ((ss % 80) / 100) + (bottom.x - top.x) * (((ss >> 8) % 80) / 100);
      const cy = top.y + (right.y - top.y) * ((ss % 80) / 100) + (bottom.y - top.y) * (((ss >> 8) % 80) / 100);
      ctx.fillRect(cx, cy, 1, 1);
    }

    // Curb effect — darker edges
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.strokeStyle = 'rgba(40,40,50,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.strokeStyle = 'rgba(40,40,50,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // White lane edge lines
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Double-yellow center line dashes every 2nd tile
    if (col % 2 === 0 && !(col === 10)) {
      const cx1 = (top.x + bottom.x) / 2;
      const cy1 = (top.y + bottom.y) / 2;
      const dx = (right.x - left.x) / 2;
      const dy = (right.y - left.y) / 2;
      const len = 0.18;

      // First yellow line (offset slightly)
      ctx.beginPath();
      ctx.moveTo(cx1 - dx * len - 0.5, cy1 - dy * len - 0.25);
      ctx.lineTo(cx1 + dx * len - 0.5, cy1 + dy * len - 0.25);
      ctx.strokeStyle = 'rgba(255,220,50,0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Second yellow line
      ctx.beginPath();
      ctx.moveTo(cx1 - dx * len + 0.5, cy1 - dy * len + 0.25);
      ctx.lineTo(cx1 + dx * len + 0.5, cy1 + dy * len + 0.25);
      ctx.strokeStyle = 'rgba(255,220,50,0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // ─── Vertical road on col 10 ───────────────────────────
  for (let row = 0; row < gridSize; row++) {
    if (row === 10) continue;

    const { top, right, bottom, left } = drawTilePath(10, row);

    // Road surface
    fillDiamond(top, right, bottom, left, '#686878');

    // Asphalt texture
    const seed = tileSeed(10, row);
    ctx.fillStyle = 'rgba(90,90,100,0.3)';
    for (let s = 0; s < 4; s++) {
      const ss = tileSeed(10 + s * 3, row + s * 5);
      const cx = top.x + (left.x - top.x) * ((ss % 80) / 100) + (bottom.x - top.x) * (((ss >> 8) % 80) / 100);
      const cy = top.y + (left.y - top.y) * ((ss % 80) / 100) + (bottom.y - top.y) * (((ss >> 8) % 80) / 100);
      ctx.fillRect(cx, cy, 1, 1);
    }

    // Curb effect
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(left.x, left.y);
    ctx.strokeStyle = 'rgba(40,40,50,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.strokeStyle = 'rgba(40,40,50,0.25)';
    ctx.lineWidth = 2;
    ctx.stroke();

    // White lane edge lines
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(left.x, left.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.strokeStyle = 'rgba(255,255,255,0.2)';
    ctx.lineWidth = 1;
    ctx.stroke();

    // Double-yellow center line dashes
    if (row % 2 === 0) {
      const cx1 = (top.x + bottom.x) / 2;
      const cy1 = (top.y + bottom.y) / 2;
      const dx = (left.x - right.x) / 2;
      const dy = (left.y - right.y) / 2;
      const len = 0.18;

      ctx.beginPath();
      ctx.moveTo(cx1 - dx * len - 0.5, cy1 - dy * len - 0.25);
      ctx.lineTo(cx1 + dx * len - 0.5, cy1 + dy * len - 0.25);
      ctx.strokeStyle = 'rgba(255,220,50,0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx1 - dx * len + 0.5, cy1 - dy * len + 0.25);
      ctx.lineTo(cx1 + dx * len + 0.5, cy1 + dy * len + 0.25);
      ctx.strokeStyle = 'rgba(255,220,50,0.7)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }

  // ─── Intersection at (10, 10) ──────────────────────────
  const inter = drawTilePath(10, 10);
  fillDiamond(inter.top, inter.right, inter.bottom, inter.left, '#686878');

  const icx = (inter.top.x + inter.bottom.x) / 2;
  const icy = (inter.top.y + inter.bottom.y) / 2;

  // Diagonal directions
  const hrDx = (inter.right.x - inter.left.x);
  const hrDy = (inter.right.y - inter.left.y);
  const vrDx = (inter.top.x - inter.bottom.x);
  const vrDy = (inter.top.y - inter.bottom.y);

  // Thick crosswalk stripes (wider, more visible)
  ctx.strokeStyle = 'rgba(255,255,255,0.7)';
  ctx.lineWidth = 2.5;

  // Horizontal direction stripes
  for (let s = -2; s <= 2; s++) {
    const offX = vrDx * s * 0.07;
    const offY = vrDy * s * 0.07;
    ctx.beginPath();
    ctx.moveTo(icx + offX - hrDx * 0.15, icy + offY - hrDy * 0.15);
    ctx.lineTo(icx + offX + hrDx * 0.15, icy + offY + hrDy * 0.15);
    ctx.stroke();
  }

  // Vertical direction stripes
  for (let s = -2; s <= 2; s++) {
    const offX = hrDx * s * 0.07;
    const offY = hrDy * s * 0.07;
    ctx.beginPath();
    ctx.moveTo(icx + offX - vrDx * 0.15, icy + offY - vrDy * 0.15);
    ctx.lineTo(icx + offX + vrDx * 0.15, icy + offY + vrDy * 0.15);
    ctx.stroke();
  }

  // Stop lines before intersection (all 4 approaches)
  ctx.strokeStyle = 'rgba(255,255,255,0.5)';
  ctx.lineWidth = 2;

  // Approach from left (horizontal road, col 9 → 10)
  const stopLeft = drawTilePath(9, 10);
  ctx.beginPath();
  ctx.moveTo(stopLeft.right.x, stopLeft.right.y);
  ctx.lineTo(stopLeft.bottom.x, stopLeft.bottom.y);
  ctx.stroke();

  // Approach from right (horizontal road, col 11 → 10)
  const stopRight = drawTilePath(11, 10);
  ctx.beginPath();
  ctx.moveTo(stopRight.top.x, stopRight.top.y);
  ctx.lineTo(stopRight.left.x, stopRight.left.y);
  ctx.stroke();

  // Approach from top (vertical road, row 9 → 10)
  const stopTop = drawTilePath(10, 9);
  ctx.beginPath();
  ctx.moveTo(stopTop.left.x, stopTop.left.y);
  ctx.lineTo(stopTop.bottom.x, stopTop.bottom.y);
  ctx.stroke();

  // Approach from bottom (vertical road, row 11 → 10)
  const stopBot = drawTilePath(10, 11);
  ctx.beginPath();
  ctx.moveTo(stopBot.top.x, stopBot.top.y);
  ctx.lineTo(stopBot.right.x, stopBot.right.y);
  ctx.stroke();
}
