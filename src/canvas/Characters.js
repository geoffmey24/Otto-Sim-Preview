import { toScreen, colorShade } from '../utils/helpers';
import { AVATARS } from '../constants';

// ─── Car ───────────────────────────────────────────────

export function drawCar(ctx, carCol, config) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;
  const pos = toScreen(carCol, 10, ox, oy, tw, th);
  const cx = pos.x;
  const cy = pos.y;

  // Isometric car body dimensions
  const bw = 12; // half-width along col axis
  const bd = 5;  // half-depth along row axis
  const bh = 12; // height

  // Top face corner offsets (isometric)
  const topFront = { x: cx + bw * 0.5, y: cy - bh + bd * 0.25 };
  const topRight = { x: cx + bw, y: cy - bh + bd * 0.5 };
  const topBack  = { x: cx + bw * 0.5, y: cy - bh + bd * 0.75 };
  const topLeft  = { x: cx, y: cy - bh + bd * 0.5 };

  const botFront = { x: topFront.x, y: topFront.y + bh };
  const botRight = { x: topRight.x, y: topRight.y + bh };
  const botBack  = { x: topBack.x, y: topBack.y + bh };
  const botLeft  = { x: topLeft.x, y: topLeft.y + bh };

  // Left face (darker red)
  ctx.beginPath();
  ctx.moveTo(topFront.x, topFront.y);
  ctx.lineTo(botFront.x, botFront.y);
  ctx.lineTo(botLeft.x, botLeft.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();
  ctx.fillStyle = '#c0392b';
  ctx.fill();

  // Right face (darkest red)
  ctx.beginPath();
  ctx.moveTo(topLeft.x, topLeft.y);
  ctx.lineTo(botLeft.x, botLeft.y);
  ctx.lineTo(botBack.x, botBack.y);
  ctx.lineTo(topBack.x, topBack.y);
  ctx.closePath();
  ctx.fillStyle = '#a5311f';
  ctx.fill();

  // Top face (red)
  ctx.beginPath();
  ctx.moveTo(topFront.x, topFront.y);
  ctx.lineTo(topRight.x, topRight.y);
  ctx.lineTo(topBack.x, topBack.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();
  ctx.fillStyle = '#e74c3c';
  ctx.fill();

  // Windshield on top face (back 30%)
  const wsFL = { x: topFront.x * 0.3 + topLeft.x * 0.7, y: topFront.y * 0.3 + topLeft.y * 0.7 };
  const wsFR = { x: topRight.x * 0.3 + topBack.x * 0.7, y: topRight.y * 0.3 + topBack.y * 0.7 };
  ctx.beginPath();
  ctx.moveTo(wsFL.x, wsFL.y);
  ctx.lineTo(wsFR.x, wsFR.y);
  ctx.lineTo(topBack.x, topBack.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.closePath();
  ctx.fillStyle = 'rgba(180,220,255,0.7)';
  ctx.fill();
  // Highlight on windshield
  ctx.beginPath();
  ctx.moveTo(wsFL.x, wsFL.y);
  ctx.lineTo(topLeft.x, topLeft.y);
  ctx.strokeStyle = 'rgba(255,255,255,0.4)';
  ctx.lineWidth = 1;
  ctx.stroke();

  // Wheels (4 small ellipses at bottom corners)
  const wheelPositions = [
    { x: botFront.x - 1, y: botFront.y + 1 },
    { x: botRight.x - 1, y: botRight.y + 1 },
    { x: botLeft.x + 1, y: botLeft.y + 1 },
    { x: botBack.x + 1, y: botBack.y + 1 },
  ];
  for (let i = 0; i < wheelPositions.length; i++) {
    const wp = wheelPositions[i];
    ctx.save();
    ctx.translate(wp.x, wp.y);
    ctx.scale(1, 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#2c2c2c';
    ctx.fill();
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = 1;
    ctx.stroke();
    ctx.restore();
  }

  // Headlights on front face
  ctx.fillStyle = 'rgba(255,255,200,0.8)';
  ctx.fillRect(botFront.x - 2, botFront.y - 3, 2, 1);
  ctx.fillRect(botFront.x - 2, botFront.y - 1, 2, 1);
}

// ─── NPC ───────────────────────────────────────────────

export function createNPCs() {
  return [
    { col: 2, row: 9.5, dir: 1, walkPhase: 0, speed: 0.012, minCol: 2, maxCol: 8, axis: 'col', skinTone: '#FDBCB4', jacketColor: '#3498db' },
    { col: 12, row: 10.5, dir: 1, walkPhase: 0, speed: 0.010, minCol: 12, maxCol: 18, axis: 'col', skinTone: '#C68642', jacketColor: '#e67e22' },
    { col: 10.5, row: 2, dir: 1, walkPhase: 0, speed: 0.011, minRow: 2, maxRow: 8, axis: 'row', skinTone: '#FDDBB4', jacketColor: '#9b59b6' },
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

  // Head
  ctx.beginPath();
  ctx.arc(sx, sy - 14, 3, 0, Math.PI * 2);
  ctx.fillStyle = npc.skinTone;
  ctx.fill();

  // Body
  ctx.fillStyle = npc.jacketColor;
  ctx.fillRect(sx - 2, sy - 11, 4, 8);

  // Legs with walk animation
  const legColor = colorShade(npc.jacketColor, 0.6);
  ctx.strokeStyle = legColor;
  ctx.lineWidth = 1;
  // Left leg
  ctx.beginPath();
  ctx.moveTo(sx - 1, sy - 3);
  ctx.lineTo(sx - 1 + Math.sin(npc.walkPhase) * 2, sy + 1);
  ctx.stroke();
  // Right leg
  ctx.beginPath();
  ctx.moveTo(sx + 1, sy - 3);
  ctx.lineTo(sx + 1 - Math.sin(npc.walkPhase) * 2, sy + 1);
  ctx.stroke();
}

// ─── Player character ──────────────────────────────────

export function drawPlayer(ctx, col, row, avatarIndex, playerNameText, config) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;
  const avatar = AVATARS[avatarIndex];
  const pos = toScreen(col, row, ox, oy, tw, th);
  const sx = pos.x;
  const sy = pos.y;

  // Golden halo
  ctx.save();
  ctx.translate(sx, sy);
  ctx.scale(1, 0.5);
  const haloGrad = ctx.createRadialGradient(0, 0, 2, 0, 0, 10);
  haloGrad.addColorStop(0, 'rgba(245,200,66,0.5)');
  haloGrad.addColorStop(1, 'rgba(245,200,66,0)');
  ctx.fillStyle = haloGrad;
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Hair (semicircle on top of head)
  ctx.beginPath();
  ctx.arc(sx, sy - 18, 3, Math.PI, 0);
  ctx.fillStyle = avatar.hairColor;
  ctx.fill();

  // Head
  ctx.beginPath();
  ctx.arc(sx, sy - 16, 4, 0, Math.PI * 2);
  ctx.fillStyle = avatar.skinTone;
  ctx.fill();

  // Body
  ctx.fillStyle = avatar.shirtColor;
  ctx.fillRect(sx - 2.5, sy - 12, 5, 10);

  // Legs
  ctx.strokeStyle = colorShade(avatar.shirtColor, 0.6);
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(sx - 1, sy - 2);
  ctx.lineTo(sx - 2, sy + 3);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx + 1, sy - 2);
  ctx.lineTo(sx + 2, sy + 3);
  ctx.stroke();

  // Name tag
  ctx.save();
  ctx.shadowColor = 'rgba(0,0,0,0.5)';
  ctx.shadowBlur = 3;
  ctx.font = 'bold 8px Nunito';
  ctx.fillStyle = '#ffffff';
  ctx.textAlign = 'center';
  ctx.fillText(playerNameText, sx, sy - 24);
  ctx.restore();
}
