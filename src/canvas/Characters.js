import { toScreen, colorShade } from '../utils/helpers';
import { AVATARS } from '../constants';

// ─── Car ───────────────────────────────────────────────

export function drawCar(ctx, carCol, config) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;
  const pos = toScreen(carCol, 10, ox, oy, tw, th);
  const cx = pos.x;
  const cy = pos.y;

  // Car shadow on road
  ctx.save();
  ctx.translate(cx + 6, cy + 3);
  ctx.scale(1.2, 0.4);
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.15)';
  ctx.fill();
  ctx.restore();

  // Isometric car body dimensions (slightly larger)
  const bw = 14;
  const bd = 6;
  const bh = 8;
  const cabH = 6; // cabin height above body

  // Body corners
  const topFront = { x: cx + bw * 0.5, y: cy - bh + bd * 0.25 };
  const topRight = { x: cx + bw, y: cy - bh + bd * 0.5 };
  const topBack  = { x: cx + bw * 0.5, y: cy - bh + bd * 0.75 };
  const topLeft  = { x: cx, y: cy - bh + bd * 0.5 };

  const botFront = { x: topFront.x, y: topFront.y + bh };
  const botRight = { x: topRight.x, y: topRight.y + bh };
  const botBack  = { x: topBack.x, y: topBack.y + bh };
  const botLeft  = { x: topLeft.x, y: topLeft.y + bh };

  // ─── Lower body ───
  // Left face
  ctx.beginPath();
  ctx.moveTo(topFront.x, topFront.y);
  ctx.lineTo(botFront.x, botFront.y);
  ctx.lineTo(botLeft.x, botLeft.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();
  ctx.fillStyle = '#c0392b';
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(botLeft.x, botLeft.y);
  ctx.lineTo(botBack.x, botBack.y);
  ctx.lineTo(topBack.x, topBack.y);
  ctx.closePath();
  ctx.fillStyle = '#a5311f';
  ctx.fill();

  // Top face (hood)
  ctx.beginPath();
  ctx.moveTo(topFront.x, topFront.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(topBack.x, topBack.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();
  ctx.fillStyle = '#e74c3c';
  ctx.fill();

  // ─── Cabin (upper portion, rear 55%) ───
  const cabFrontT = 0.45; // cabin starts 45% from front
  const cabFL = {
    x: topFront.x * (1 - cabFrontT) + topLeft.x * cabFrontT,
    y: topFront.y * (1 - cabFrontT) + topLeft.y * cabFrontT,
  };
  const cabFR = {
    x: topRight.x * (1 - cabFrontT) + topBack.x * cabFrontT,
    y: topRight.y * (1 - cabFrontT) + topBack.y * cabFrontT,
  };

  // Cabin top corners (elevated)
  const cabTopFL = { x: cabFL.x, y: cabFL.y - cabH };
  const cabTopFR = { x: cabFR.x, y: cabFR.y - cabH };
  const cabTopBL = { x: topLeft.x, y: topLeft.y - cabH };
  const cabTopBR = { x: topBack.x, y: topBack.y - cabH };

  // Cabin left face
  ctx.beginPath();
  ctx.moveTo(cabTopFL.x, cabTopFL.y);
  ctx.lineTo(cabFL.x, cabFL.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.lineTo(cabTopBL.x, cabTopBL.y);
  ctx.closePath();
  ctx.fillStyle = '#b8322a';
  ctx.fill();

  // Cabin right face
  ctx.beginPath();
  ctx.moveTo(cabTopBL.x, cabTopBL.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.lineTo(topBack.x, topBack.y);
  ctx.lineTo(cabTopBR.x, cabTopBR.y);
  ctx.closePath();
  ctx.fillStyle = '#952a22';
  ctx.fill();

  // Cabin top
  ctx.beginPath();
  ctx.moveTo(cabTopFL.x, cabTopFL.y);
  ctx.lineTo(cabTopFR.x, cabTopFR.y);
  ctx.lineTo(cabTopBR.x, cabTopBR.y);
  ctx.lineTo(cabTopBL.x, cabTopBL.y);
  ctx.closePath();
  ctx.fillStyle = '#e74c3c';
  ctx.fill();

  // ─── Windows ───
  // Front windshield (angled front face of cabin)
  ctx.beginPath();
  ctx.moveTo(cabTopFL.x + 1, cabTopFL.y + 1);
  ctx.lineTo(cabTopFR.x - 1, cabTopFR.y + 1);
  ctx.lineTo(cabFR.x - 1, cabFR.y - 1);
  ctx.lineTo(cabFL.x + 1, cabFL.y - 1);
  ctx.closePath();
  ctx.fillStyle = 'rgba(160,210,255,0.75)';
  ctx.fill();
  // Windshield glare
  ctx.beginPath();
  ctx.moveTo(cabTopFL.x + 1, cabTopFL.y + 1);
  ctx.lineTo(cabFL.x + 1, cabFL.y - 1);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Side windows on left face
  const swTL = { x: cabTopFL.x + 1, y: cabTopFL.y + 1 };
  const swBL = { x: cabFL.x + 1, y: cabFL.y };
  const swTR = { x: cabTopBL.x - 1, y: cabTopBL.y + 1 };
  const swBR = { x: topLeft.x - 1, y: topLeft.y };
  ctx.beginPath();
  ctx.moveTo(swTL.x, swTL.y);
  ctx.lineTo(swBL.x, swBL.y);
  ctx.lineTo(swBR.x, swBR.y);
  ctx.lineTo(swTR.x, swTR.y);
  ctx.closePath();
  ctx.fillStyle = 'rgba(160,210,255,0.65)';
  ctx.fill();
  // Window divider (door line)
  const midU = 0.5;
  ctx.beginPath();
  ctx.moveTo(swTL.x * (1 - midU) + swTR.x * midU, swTL.y * (1 - midU) + swTR.y * midU);
  ctx.lineTo(swBL.x * (1 - midU) + swBR.x * midU, swBL.y * (1 - midU) + swBR.y * midU);
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // ─── Door line on left face body ───
  const doorX = (topFront.x + topLeft.x) / 2;
  const doorY1 = (topFront.y + topLeft.y) / 2;
  const doorY2 = (botFront.y + botLeft.y) / 2;
  ctx.beginPath();
  ctx.moveTo(doorX, doorY1);
  ctx.lineTo(doorX, doorY2);
  ctx.strokeStyle = 'rgba(0,0,0,0.15)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // ─── Wheels ───
  const wheelPositions = [
    { x: botFront.x - 2, y: botFront.y + 1 },
    { x: botLeft.x + 2, y: botLeft.y + 1 },
  ];
  for (let i = 0; i < wheelPositions.length; i++) {
    const wp = wheelPositions[i];
    ctx.save();
    ctx.translate(wp.x, wp.y);
    ctx.scale(1, 0.5);
    // Tire
    ctx.beginPath();
    ctx.arc(0, 0, 3.5, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    // Hubcap
    ctx.beginPath();
    ctx.arc(0, 0, 1.8, 0, Math.PI * 2);
    ctx.fillStyle = '#888';
    ctx.fill();
    // Hubcap center
    ctx.beginPath();
    ctx.arc(0, 0, 0.8, 0, Math.PI * 2);
    ctx.fillStyle = '#aaa';
    ctx.fill();
    ctx.restore();
  }

  // Back wheels (visible on right face)
  const backWheels = [
    { x: botBack.x + 2, y: botBack.y + 1 },
    { x: botRight.x - 2, y: botRight.y + 1 },
  ];
  for (let i = 0; i < backWheels.length; i++) {
    const wp = backWheels[i];
    ctx.save();
    ctx.translate(wp.x, wp.y);
    ctx.scale(1, 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#1a1a1a';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(0, 0, 1.5, 0, Math.PI * 2);
    ctx.fillStyle = '#777';
    ctx.fill();
    ctx.restore();
  }

  // ─── Headlights ───
  ctx.fillStyle = 'rgba(255,255,200,0.9)';
  ctx.beginPath();
  ctx.arc(botFront.x - 1, botFront.y - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(topRight.x - 1, topRight.y + bh - 2, 1.5, 0, Math.PI * 2);
  ctx.fill();

  // Headlight glow on road
  ctx.save();
  ctx.translate(botFront.x + 3, botFront.y + 2);
  ctx.scale(1.5, 0.3);
  ctx.beginPath();
  ctx.arc(0, 0, 6, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,200,0.06)';
  ctx.fill();
  ctx.restore();

  // ─── Tail lights ───
  ctx.fillStyle = 'rgba(255,50,50,0.8)';
  ctx.beginPath();
  ctx.arc(botBack.x + 1, botBack.y - 2, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(botLeft.x - 1, botLeft.y - 2, 1, 0, Math.PI * 2);
  ctx.fill();

  // Side mirror (left face)
  ctx.fillStyle = '#e74c3c';
  ctx.fillRect(topFront.x - 2, topFront.y + 2, 2, 1);
}

// ─── Second car on vertical road ─────────────────────────

export function drawCar2(ctx, carRow, config) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;
  const pos = toScreen(10, carRow, ox, oy, tw, th);
  const cx = pos.x;
  const cy = pos.y;

  // Shadow
  ctx.save();
  ctx.translate(cx + 4, cy + 2);
  ctx.scale(0.8, 0.5);
  ctx.beginPath();
  ctx.arc(0, 0, 8, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fill();
  ctx.restore();

  // Simple blue car (smaller, facing different direction)
  const bw = 10;
  const bd = 5;
  const bh = 7;

  // Body - rotated 90 degrees for vertical road
  const topFront = { x: cx - bd * 0.25, y: cy - bh + bw * 0.25 };
  const topRight = { x: cx - bd * 0.5, y: cy - bh + bw * 0.5 };
  const topBack  = { x: cx - bd * 0.25, y: cy - bh + bw * 0.75 };
  const topLeft  = { x: cx, y: cy - bh + bw * 0.5 };

  const botFront = { x: topFront.x, y: topFront.y + bh };
  const botRight = { x: topRight.x, y: topRight.y + bh };
  const botBack  = { x: topBack.x, y: topBack.y + bh };
  const botLeft  = { x: topLeft.x, y: topLeft.y + bh };

  // Left face
  ctx.beginPath();
  ctx.moveTo(topFront.x, topFront.y);
  ctx.lineTo(botFront.x, botFront.y);
  ctx.lineTo(botLeft.x, botLeft.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();
  ctx.fillStyle = '#2980b9';
  ctx.fill();

  // Right face
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(botLeft.x, botLeft.y);
  ctx.lineTo(botBack.x, botBack.y);
  ctx.lineTo(topBack.x, topBack.y);
  ctx.closePath();
  ctx.fillStyle = '#1f6a9a';
  ctx.fill();

  // Top face
  ctx.beginPath();
  ctx.moveTo(topFront.x, topFront.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(topBack.x, topBack.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();
  ctx.fillStyle = '#3498db';
  ctx.fill();

  // Windshield (front portion)
  const wsT = 0.35;
  const wsFL = { x: topFront.x * (1 - wsT) + topLeft.x * wsT, y: topFront.y * (1 - wsT) + topLeft.y * wsT };
  const wsFR = { x: topRight.x * (1 - wsT) + topBack.x * wsT, y: topRight.y * (1 - wsT) + topBack.y * wsT };
  ctx.beginPath();
  ctx.moveTo(topFront.x, topFront.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(wsFR.x, wsFR.y);
  ctx.lineTo(wsFL.x, wsFL.y);
  ctx.closePath();
  ctx.fillStyle = 'rgba(160,210,255,0.7)';
  ctx.fill();

  // Wheels
  ctx.save();
  ctx.translate(botFront.x, botFront.y + 1);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  ctx.restore();

  ctx.save();
  ctx.translate(botLeft.x, botLeft.y + 1);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.arc(0, 0, 2.5, 0, Math.PI * 2);
  ctx.fillStyle = '#1a1a1a';
  ctx.fill();
  ctx.restore();
}

// ─── NPC ───────────────────────────────────────────────

export function createNPCs() {
  return [
    { col: 2, row: 9.5, dir: 1, walkPhase: 0, speed: 0.012, minCol: 2, maxCol: 8, axis: 'col', skinTone: '#FDBCB4', jacketColor: '#3498db', pantsColor: '#2c3e50', hatColor: null },
    { col: 12, row: 10.5, dir: 1, walkPhase: 0, speed: 0.010, minCol: 12, maxCol: 18, axis: 'col', skinTone: '#C68642', jacketColor: '#e67e22', pantsColor: '#34495e', hatColor: '#5a3825' },
    { col: 10.5, row: 2, dir: 1, walkPhase: 0, speed: 0.011, minRow: 2, maxRow: 8, axis: 'row', skinTone: '#FDDBB4', jacketColor: '#9b59b6', pantsColor: '#2c3e50', hatColor: null },
    { col: 5, row: 10.5, dir: -1, walkPhase: 1.5, speed: 0.009, minCol: 3, maxCol: 9, axis: 'col', skinTone: '#8D5524', jacketColor: '#27ae60', pantsColor: '#1a1a2e', hatColor: '#c0392b' },
    { col: 10.5, row: 14, dir: -1, walkPhase: 0.8, speed: 0.010, minRow: 12, maxRow: 18, axis: 'row', skinTone: '#FDBCB4', jacketColor: '#e74c3c', pantsColor: '#2c3e50', hatColor: null },
  ];
}

export function updateNPC(npc) {
  if (npc.axis === 'col') {
    npc.col += npc.speed * npc.dir;
    if (npc.col > npc.maxCol) { npc.col = npc.maxCol; npc.dir = -1; }
    if (npc.col < npc.minCol) { npc.col = npc.minCol; npc.dir = 1; }
  } else {
    npc.row += npc.speed * npc.dir;
    if (npc.row > npc.maxRow) { npc.row = npc.maxRow; npc.dir = -1; }
    if (npc.row < npc.minRow) { npc.row = npc.minRow; npc.dir = 1; }
  }
  npc.walkPhase += 0.15;
}

export function drawNPC(ctx, npc, config) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;
  const pos = toScreen(npc.col, npc.row, ox, oy, tw, th);
  const sx = pos.x;
  const sy = pos.y;
  const wp = npc.walkPhase;

  // Foot shadow
  ctx.save();
  ctx.translate(sx, sy + 1);
  ctx.scale(1, 0.3);
  ctx.beginPath();
  ctx.arc(0, 0, 4, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.fill();
  ctx.restore();

  // Torso bob
  const bob = Math.abs(Math.sin(wp)) * 0.5;

  // Legs with better walk cycle
  const legSwing = Math.sin(wp) * 3;
  ctx.strokeStyle = npc.pantsColor;
  ctx.lineWidth = 2;
  // Left leg
  ctx.beginPath();
  ctx.moveTo(sx - 1.5, sy - 3 - bob);
  ctx.lineTo(sx - 1.5 + legSwing, sy + 1);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(sx + 1.5, sy - 3 - bob);
  ctx.lineTo(sx + 1.5 - legSwing, sy + 1);
  ctx.stroke();

  // Body (torso)
  ctx.fillStyle = npc.jacketColor;
  ctx.fillRect(sx - 3, sy - 11 - bob, 6, 9);
  // Shirt detail (slightly darker bottom)
  ctx.fillStyle = colorShade(npc.jacketColor, 0.85);
  ctx.fillRect(sx - 3, sy - 5 - bob, 6, 3);

  // Arms with swing animation
  const armSwing = Math.sin(wp + Math.PI) * 2.5;
  ctx.strokeStyle = npc.jacketColor;
  ctx.lineWidth = 1.5;
  // Left arm
  ctx.beginPath();
  ctx.moveTo(sx - 3, sy - 9 - bob);
  ctx.lineTo(sx - 4 + armSwing * 0.5, sy - 4 - bob);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(sx + 3, sy - 9 - bob);
  ctx.lineTo(sx + 4 - armSwing * 0.5, sy - 4 - bob);
  ctx.stroke();

  // Hands
  ctx.fillStyle = npc.skinTone;
  ctx.beginPath();
  ctx.arc(sx - 4 + armSwing * 0.5, sy - 4 - bob, 1, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sx + 4 - armSwing * 0.5, sy - 4 - bob, 1, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.fillStyle = npc.skinTone;
  ctx.fillRect(sx - 1, sy - 13 - bob, 2, 2);

  // Head
  ctx.beginPath();
  ctx.arc(sx, sy - 15 - bob, 3.5, 0, Math.PI * 2);
  ctx.fillStyle = npc.skinTone;
  ctx.fill();

  // Hair / hat
  if (npc.hatColor) {
    // Hat (cap shape)
    ctx.beginPath();
    ctx.arc(sx, sy - 16 - bob, 4, Math.PI, 0);
    ctx.fillStyle = npc.hatColor;
    ctx.fill();
    // Hat brim
    ctx.fillRect(sx - 5, sy - 16 - bob, 10, 1.5);
  } else {
    // Hair
    ctx.beginPath();
    ctx.arc(sx, sy - 17 - bob, 3, Math.PI * 0.8, Math.PI * 0.2);
    ctx.fillStyle = '#3a2a1a';
    ctx.fill();
  }

  // Eyes (tiny dots)
  ctx.fillStyle = '#1a1a1a';
  const eyeDir = npc.dir > 0 ? 1 : -1;
  ctx.fillRect(sx - 1.5 + eyeDir * 0.5, sy - 16 - bob, 1, 1);
  ctx.fillRect(sx + 0.5 + eyeDir * 0.5, sy - 16 - bob, 1, 1);
}

// ─── Player character ──────────────────────────────────

export function drawPlayer(ctx, col, row, avatarIndex, playerNameText, config, targetCol, targetRow) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;
  const avatar = AVATARS[avatarIndex];
  const pos = toScreen(col, row, ox, oy, tw, th);
  const sx = pos.x;
  const sy = pos.y;

  // Calculate if moving
  const dx = (targetCol || col) - col;
  const dy = (targetRow || row) - row;
  const isMoving = Math.abs(dx) > 0.05 || Math.abs(dy) > 0.05;
  const walkPhase = isMoving ? Date.now() * 0.008 : 0;
  const bob = isMoving ? Math.abs(Math.sin(walkPhase)) * 0.8 : 0;

  // Golden halo (ground glow)
  ctx.save();
  ctx.translate(sx, sy + 1);
  ctx.scale(1, 0.4);
  const haloGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 12);
  haloGrad.addColorStop(0, 'rgba(245,200,66,0.5)');
  haloGrad.addColorStop(0.5, 'rgba(245,200,66,0.15)');
  haloGrad.addColorStop(1, 'rgba(245,200,66,0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 12, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Foot shadow
  ctx.save();
  ctx.translate(sx, sy + 1);
  ctx.scale(1, 0.3);
  ctx.beginPath();
  ctx.arc(0, 0, 5, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(0,0,0,0.12)';
  ctx.fill();
  ctx.restore();

  // Legs with walk animation
  const legColor = colorShade(avatar.shirtColor, 0.5);
  const legSwing = isMoving ? Math.sin(walkPhase) * 3.5 : 0;

  ctx.strokeStyle = legColor;
  ctx.lineWidth = 2;
  // Left leg
  ctx.beginPath();
  ctx.moveTo(sx - 1.5, sy - 2 - bob);
  ctx.lineTo(sx - 2 + legSwing, sy + 3);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(sx + 1.5, sy - 2 - bob);
  ctx.lineTo(sx + 2 - legSwing, sy + 3);
  ctx.stroke();

  // Shoes
  ctx.fillStyle = '#2c2c2c';
  ctx.beginPath();
  ctx.arc(sx - 2 + legSwing, sy + 3, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sx + 2 - legSwing, sy + 3, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Body
  ctx.fillStyle = avatar.shirtColor;
  ctx.fillRect(sx - 3, sy - 13 - bob, 6, 11);
  // Shirt detail (collar)
  ctx.fillStyle = colorShade(avatar.shirtColor, 1.15);
  ctx.fillRect(sx - 2, sy - 13 - bob, 4, 2);

  // Arms with swing
  const armSwing = isMoving ? Math.sin(walkPhase + Math.PI) * 3 : 0;
  ctx.strokeStyle = avatar.shirtColor;
  ctx.lineWidth = 2;
  // Left arm
  ctx.beginPath();
  ctx.moveTo(sx - 3, sy - 11 - bob);
  ctx.lineTo(sx - 5 + armSwing * 0.5, sy - 5 - bob);
  ctx.stroke();
  // Right arm
  ctx.beginPath();
  ctx.moveTo(sx + 3, sy - 11 - bob);
  ctx.lineTo(sx + 5 - armSwing * 0.5, sy - 5 - bob);
  ctx.stroke();

  // Hands
  ctx.fillStyle = avatar.skinTone;
  ctx.beginPath();
  ctx.arc(sx - 5 + armSwing * 0.5, sy - 5 - bob, 1.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(sx + 5 - armSwing * 0.5, sy - 5 - bob, 1.2, 0, Math.PI * 2);
  ctx.fill();

  // Neck
  ctx.fillStyle = avatar.skinTone;
  ctx.fillRect(sx - 1.5, sy - 15 - bob, 3, 2.5);

  // Head
  ctx.beginPath();
  ctx.arc(sx, sy - 18 - bob, 4.5, 0, Math.PI * 2);
  ctx.fillStyle = avatar.skinTone;
  ctx.fill();

  // Hair
  ctx.beginPath();
  ctx.arc(sx, sy - 20 - bob, 4, Math.PI * 0.85, Math.PI * 0.15);
  ctx.fillStyle = avatar.hairColor;
  ctx.fill();
  // Side hair
  ctx.fillRect(sx - 4.5, sy - 20 - bob, 1.5, 4);
  ctx.fillRect(sx + 3, sy - 20 - bob, 1.5, 4);

  // Eyes
  ctx.fillStyle = '#1a1a1a';
  ctx.fillRect(sx - 2, sy - 19 - bob, 1.2, 1.2);
  ctx.fillRect(sx + 0.8, sy - 19 - bob, 1.2, 1.2);

  // Mouth
  ctx.beginPath();
  ctx.arc(sx, sy - 16.5 - bob, 1.5, 0.1, Math.PI - 0.1);
  ctx.strokeStyle = 'rgba(0,0,0,0.2)';
  ctx.lineWidth = 0.5;
  ctx.stroke();

  // Name tag with background
  ctx.save();
  ctx.font = 'bold 9px Nunito';
  ctx.textAlign = 'center';
  const nameWidth = ctx.measureText(playerNameText).width;

  // Tag background
  ctx.fillStyle = 'rgba(0,0,0,0.5)';
  const tagPadX = 4;
  const tagPadY = 2;
  const tagY = sy - 28 - bob;
  ctx.beginPath();
  const rr = 4;
  const rx = sx - nameWidth / 2 - tagPadX;
  const ry = tagY - 6 - tagPadY;
  const rw = nameWidth + tagPadX * 2;
  const rh = 12 + tagPadY * 2;
  ctx.moveTo(rx + rr, ry);
  ctx.lineTo(rx + rw - rr, ry);
  ctx.arcTo(rx + rw, ry, rx + rw, ry + rr, rr);
  ctx.lineTo(rx + rw, ry + rh - rr);
  ctx.arcTo(rx + rw, ry + rh, rx + rw - rr, ry + rh, rr);
  ctx.lineTo(rx + rr, ry + rh);
  ctx.arcTo(rx, ry + rh, rx, ry + rh - rr, rr);
  ctx.lineTo(rx, ry + rr);
  ctx.arcTo(rx, ry, rx + rr, ry, rr);
  ctx.closePath();
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.fillText(playerNameText, sx, tagY);
  ctx.restore();
}
