import { toScreen } from '../utils/helpers';
import { TREE_POSITIONS, BUSH_POSITIONS } from '../constants';

// Pre-sort trees once at module load (static data, never changes)
const sortedTrees = [...TREE_POSITIONS].sort((a, b) => a.row - b.row);
const sortedBushes = BUSH_POSITIONS ? [...BUSH_POSITIONS].sort((a, b) => a.row - b.row) : [];

// Tree type renderers
function drawRoundTree(ctx, sx, sy, s, timestamp, treeIdx) {
  // Wind sway offset
  const sway = Math.sin((timestamp || 0) / 1200 + treeIdx * 2.1) * 1.2 * s;

  // Shadow with dappled effect
  ctx.save();
  ctx.translate(sx + 4 * s, sy);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.arc(0, 0, 12 * s, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20,40,10,0.2)';
  ctx.fill();
  // Dappled shadow spots
  for (let d = 0; d < 3; d++) {
    ctx.beginPath();
    ctx.arc(
      Math.cos(d * 2.1) * 6 * s,
      Math.sin(d * 2.1) * 6 * s,
      3 * s,
      0, Math.PI * 2
    );
    ctx.fillStyle = 'rgba(20,40,10,0.08)';
    ctx.fill();
  }
  ctx.restore();

  // Trunk with bark texture
  const trunkX = sx;
  const trunkW = 4 * s;
  const trunkH = 12 * s;
  ctx.fillStyle = '#7a5a14';
  ctx.fillRect(trunkX - trunkW / 2, sy - trunkH, trunkW, trunkH);
  // Darker right edge
  ctx.fillStyle = '#5a4210';
  ctx.fillRect(trunkX + trunkW / 2 - 1 * s, sy - trunkH, 1 * s, trunkH);
  // Bark lines
  ctx.strokeStyle = 'rgba(60,40,10,0.2)';
  ctx.lineWidth = 0.5;
  for (let bk = 1; bk <= 3; bk++) {
    const by = sy - trunkH * bk / 4;
    ctx.beginPath();
    ctx.moveTo(trunkX - trunkW / 2, by);
    ctx.lineTo(trunkX + trunkW / 2, by);
    ctx.stroke();
  }

  // Canopy - main mass with sway
  const cx = sx + sway;
  const cy = sy - 16 * s;

  // Canopy layers (overlapping circles for leaf cluster effect)
  const clusters = [
    { dx: 0, dy: 0, r: 12, c0: '#4aaa2a', c1: '#2a7a1a' },
    { dx: -5, dy: -2, r: 8, c0: '#5abb3a', c1: '#3a9a2a' },
    { dx: 6, dy: -1, r: 7, c0: '#4a9a28', c1: '#2a7a18' },
    { dx: -2, dy: -6, r: 7, c0: '#5aaa35', c1: '#3a8a25' },
    { dx: 3, dy: -5, r: 6, c0: '#60b040', c1: '#40901a' },
    { dx: 0, dy: 4, r: 6, c0: '#3a8a22', c1: '#2a6a14' },
  ];

  for (let i = 0; i < clusters.length; i++) {
    const cl = clusters[i];
    const clx = cx + cl.dx * s;
    const cly = cy + cl.dy * s;
    const clr = cl.r * s;
    const grad = ctx.createRadialGradient(clx - 1 * s, cly - 1 * s, 1 * s, clx, cly, clr);
    grad.addColorStop(0, cl.c0);
    grad.addColorStop(1, cl.c1);
    ctx.beginPath();
    ctx.arc(clx, cly, clr, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Canopy highlight (sunlit side)
  ctx.beginPath();
  ctx.arc(cx - 3 * s, cy - 4 * s, 5 * s, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.08)';
  ctx.fill();

  // Leaf detail dots
  ctx.fillStyle = 'rgba(80,160,40,0.3)';
  for (let ld = 0; ld < 5; ld++) {
    const ldx = cx + Math.cos(ld * 1.3 + treeIdx) * 8 * s;
    const ldy = cy + Math.sin(ld * 1.7 + treeIdx) * 8 * s;
    ctx.beginPath();
    ctx.arc(ldx, ldy, 1.5 * s, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawPineTree(ctx, sx, sy, s, timestamp, treeIdx) {
  const sway = Math.sin((timestamp || 0) / 1400 + treeIdx * 1.7) * 0.8 * s;

  // Shadow
  ctx.save();
  ctx.translate(sx + 3 * s, sy);
  ctx.scale(1, 0.5);
  ctx.beginPath();
  ctx.arc(0, 0, 8 * s, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20,40,10,0.18)';
  ctx.fill();
  ctx.restore();

  // Trunk
  ctx.fillStyle = '#6a4a10';
  ctx.fillRect(sx - 1.5 * s, sy - 8 * s, 3 * s, 8 * s);
  ctx.fillStyle = '#4a3510';
  ctx.fillRect(sx + 0.5 * s, sy - 8 * s, 1 * s, 8 * s);

  // Conical canopy layers (3 triangles stacked)
  const cx = sx + sway;
  const layers = [
    { y: sy - 10 * s, w: 14, h: 10, color: '#2a6a1a' },
    { y: sy - 17 * s, w: 11, h: 9, color: '#3a7a2a' },
    { y: sy - 23 * s, w: 8, h: 8, color: '#4a8a35' },
  ];

  for (let i = 0; i < layers.length; i++) {
    const l = layers[i];
    ctx.beginPath();
    ctx.moveTo(cx, l.y - l.h * s * 0.1);
    ctx.lineTo(cx - l.w * s * 0.5, l.y + l.h * s * 0.5);
    ctx.lineTo(cx + l.w * s * 0.5, l.y + l.h * s * 0.5);
    ctx.closePath();
    ctx.fillStyle = l.color;
    ctx.fill();
    // Snow/highlight on left edge
    ctx.beginPath();
    ctx.moveTo(cx, l.y - l.h * s * 0.1);
    ctx.lineTo(cx - l.w * s * 0.5, l.y + l.h * s * 0.5);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 1;
    ctx.stroke();
  }
}

function drawOakTree(ctx, sx, sy, s, timestamp, treeIdx) {
  const sway = Math.sin((timestamp || 0) / 1000 + treeIdx * 3.1) * 1.5 * s;

  // Shadow - wide and spreading
  ctx.save();
  ctx.translate(sx + 5 * s, sy);
  ctx.scale(1.3, 0.4);
  ctx.beginPath();
  ctx.arc(0, 0, 14 * s, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(20,40,10,0.18)';
  ctx.fill();
  ctx.restore();

  // Thick trunk
  ctx.fillStyle = '#6a4a14';
  ctx.fillRect(sx - 3 * s, sy - 10 * s, 6 * s, 10 * s);
  ctx.fillStyle = '#4a3510';
  ctx.fillRect(sx + 2 * s, sy - 10 * s, 1 * s, 10 * s);
  // Bark texture
  ctx.strokeStyle = 'rgba(50,30,10,0.2)';
  ctx.lineWidth = 0.5;
  ctx.beginPath();
  ctx.moveTo(sx - 3 * s, sy - 5 * s);
  ctx.lineTo(sx + 3 * s, sy - 5 * s);
  ctx.stroke();

  // Branches (2 short lines from trunk)
  ctx.strokeStyle = '#6a4a14';
  ctx.lineWidth = 2 * s;
  ctx.beginPath();
  ctx.moveTo(sx - 1 * s, sy - 9 * s);
  ctx.lineTo(sx - 8 * s + sway, sy - 14 * s);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(sx + 1 * s, sy - 8 * s);
  ctx.lineTo(sx + 7 * s + sway, sy - 13 * s);
  ctx.stroke();

  // Wide spreading canopy (multiple overlapping circles)
  const cx = sx + sway;
  const cy = sy - 15 * s;
  const clumps = [
    { dx: 0, dy: -2, r: 10 },
    { dx: -8, dy: 0, r: 8 },
    { dx: 8, dy: 1, r: 7 },
    { dx: -4, dy: -5, r: 7 },
    { dx: 5, dy: -4, r: 6 },
    { dx: -6, dy: 3, r: 5 },
    { dx: 7, dy: 4, r: 5 },
  ];

  for (let i = 0; i < clumps.length; i++) {
    const cl = clumps[i];
    const clx = cx + cl.dx * s;
    const cly = cy + cl.dy * s;
    const grad = ctx.createRadialGradient(clx, cly - 2 * s, 1 * s, clx, cly, cl.r * s);
    grad.addColorStop(0, '#5aaa2a');
    grad.addColorStop(0.6, '#3a8a1a');
    grad.addColorStop(1, '#2a6a12');
    ctx.beginPath();
    ctx.arc(clx, cly, cl.r * s, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();
  }

  // Highlight
  ctx.beginPath();
  ctx.arc(cx - 4 * s, cy - 3 * s, 5 * s, 0, Math.PI * 2);
  ctx.fillStyle = 'rgba(255,255,255,0.06)';
  ctx.fill();
}

export function drawTrees(ctx, config, timestamp) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;

  for (let i = 0; i < sortedTrees.length; i++) {
    const tree = sortedTrees[i];
    const s = tree.scale;
    const pos = toScreen(tree.col, tree.row, ox, oy, tw, th);
    const sx = pos.x;
    const sy = pos.y;
    const type = tree.type || 'round';

    if (type === 'pine') {
      drawPineTree(ctx, sx, sy, s, timestamp, i);
    } else if (type === 'oak') {
      drawOakTree(ctx, sx, sy, s, timestamp, i);
    } else {
      drawRoundTree(ctx, sx, sy, s, timestamp, i);
    }
  }

  // Draw bushes
  for (let i = 0; i < sortedBushes.length; i++) {
    const bush = sortedBushes[i];
    const pos = toScreen(bush.col, bush.row, ox, oy, tw, th);
    const bs = bush.scale || 0.6;
    const bx = pos.x;
    const by = pos.y;
    const sway = Math.sin((timestamp || 0) / 1500 + i * 2.5) * 0.5 * bs;

    // Bush shadow
    ctx.save();
    ctx.translate(bx + 2 * bs, by);
    ctx.scale(1, 0.4);
    ctx.beginPath();
    ctx.arc(0, 0, 6 * bs, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20,40,10,0.12)';
    ctx.fill();
    ctx.restore();

    // Bush clusters
    const bushClusters = [
      { dx: 0, dy: -3, r: 5, c: '#4a9a2a' },
      { dx: -3, dy: -1, r: 4, c: '#3a8a20' },
      { dx: 3, dy: -2, r: 4, c: '#5aaa35' },
      { dx: 0, dy: 0, r: 3, c: '#2a7a18' },
    ];

    for (let j = 0; j < bushClusters.length; j++) {
      const cl = bushClusters[j];
      ctx.beginPath();
      ctx.arc(bx + cl.dx * bs + sway, by + cl.dy * bs, cl.r * bs, 0, Math.PI * 2);
      ctx.fillStyle = cl.c;
      ctx.fill();
    }

    // Highlight
    ctx.beginPath();
    ctx.arc(bx - 1 * bs + sway, by - 4 * bs, 2 * bs, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.06)';
    ctx.fill();
  }
}
