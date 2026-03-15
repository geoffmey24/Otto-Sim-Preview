import { toScreen } from '../utils/helpers';

export function drawGround(ctx, config) {
  const { originX, originY, tileWidth, tileHeight, gridSize, width, height } = config;
  const tw = tileWidth;
  const th = tileHeight;

  // Sky gradient
  const skyGrad = ctx.createLinearGradient(0, 0, 0, height);
  skyGrad.addColorStop(0, '#87CEEB');
  skyGrad.addColorStop(0.4, '#b8e4f7');
  skyGrad.addColorStop(1.0, '#d4f0a0');
  ctx.fillStyle = skyGrad;
  ctx.fillRect(0, 0, width, height);

  // Ground tiles — back-to-front (row then col)
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

      // Checkerboard with darker patch variation
      let fillColor;
      if ((col * 7 + row * 13) % 5 === 0) {
        fillColor = '#4a8a3a';
      } else if ((col + row) % 2 === 0) {
        fillColor = '#5a8a3a';
      } else {
        fillColor = '#6aaa45';
      }

      ctx.fillStyle = fillColor;
      ctx.fill();

      // Highlight on top-left edge (top -> left)
      ctx.beginPath();
      ctx.moveTo(top.x, top.y);
      ctx.lineTo(left.x, left.y);
      ctx.strokeStyle = 'rgba(255,255,255,0.06)';
      ctx.lineWidth = 1;
      ctx.stroke();
    }
  }
}

export function drawRoads(ctx, config) {
  const { originX, originY, tileWidth, tileHeight, gridSize } = config;
  const tw = tileWidth;
  const th = tileHeight;

  // Helper: draw a filled isometric diamond for a tile
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

  function drawSidewalkEdges(top, right, bottom, left) {
    // Top-right sidewalk edge (top -> right)
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(right.x, right.y);
    ctx.strokeStyle = '#c8b89a';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Bottom-left sidewalk edge (left -> bottom)
    ctx.beginPath();
    ctx.moveTo(left.x, left.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.strokeStyle = '#c8b89a';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  function drawSidewalkEdgesVertical(top, right, bottom, left) {
    // Top-left sidewalk edge (top -> left)
    ctx.beginPath();
    ctx.moveTo(top.x, top.y);
    ctx.lineTo(left.x, left.y);
    ctx.strokeStyle = '#c8b89a';
    ctx.lineWidth = 3;
    ctx.stroke();

    // Bottom-right sidewalk edge (right -> bottom)
    ctx.beginPath();
    ctx.moveTo(right.x, right.y);
    ctx.lineTo(bottom.x, bottom.y);
    ctx.strokeStyle = '#c8b89a';
    ctx.lineWidth = 3;
    ctx.stroke();
  }

  // Horizontal road on row 10
  for (let col = 0; col < gridSize; col++) {
    const { top, right, bottom, left } = drawTilePath(col, 10);

    // Road surface
    fillDiamond(top, right, bottom, left, '#7a7a8a');

    // Sidewalk edges
    drawSidewalkEdges(top, right, bottom, left);

    // Center line markings every 3rd tile
    if (col % 3 === 0) {
      const cx = (top.x + bottom.x) / 2;
      const cy = (top.y + bottom.y) / 2;
      // Isometric-aligned dash: runs along the horizontal road direction (top-right to bottom-left)
      const dx = (right.x - left.x) / 2;
      const dy = (right.y - left.y) / 2;
      const len = 0.15;
      ctx.beginPath();
      ctx.moveTo(cx - dx * len, cy - dy * len);
      ctx.lineTo(cx + dx * len, cy + dy * len);
      ctx.strokeStyle = 'rgba(255,255,220,0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Vertical road on col 10
  for (let row = 0; row < gridSize; row++) {
    // Skip intersection — drawn separately
    if (row === 10) continue;

    const { top, right, bottom, left } = drawTilePath(10, row);

    // Road surface
    fillDiamond(top, right, bottom, left, '#7a7a8a');

    // Sidewalk edges (left and right for vertical road)
    drawSidewalkEdgesVertical(top, right, bottom, left);

    // Center line markings every 3rd row
    if (row % 3 === 0) {
      const cx = (top.x + bottom.x) / 2;
      const cy = (top.y + bottom.y) / 2;
      // Isometric-aligned dash: runs along the vertical road direction (top-left to bottom-right)
      const dx = (left.x - right.x) / 2;
      const dy = (left.y - right.y) / 2;
      const len = 0.15;
      ctx.beginPath();
      ctx.moveTo(cx - dx * len, cy - dy * len);
      ctx.lineTo(cx + dx * len, cy + dy * len);
      ctx.strokeStyle = 'rgba(255,255,220,0.7)';
      ctx.lineWidth = 2;
      ctx.stroke();
    }
  }

  // Intersection at (10, 10)
  const inter = drawTilePath(10, 10);
  fillDiamond(inter.top, inter.right, inter.bottom, inter.left, '#7a7a8a');

  // Crosswalk markings — 4 short dashed lines forming an X across the tile
  const icx = (inter.top.x + inter.bottom.x) / 2;
  const icy = (inter.top.y + inter.bottom.y) / 2;

  ctx.strokeStyle = 'rgba(255,255,255,0.6)';
  ctx.lineWidth = 2;

  // Diagonal toward top-right
  const hrDx = (inter.right.x - inter.left.x);
  const hrDy = (inter.right.y - inter.left.y);
  // Diagonal toward top-left
  const vrDx = (inter.top.x - inter.bottom.x);
  const vrDy = (inter.top.y - inter.bottom.y);

  // Draw 4 crosswalk stripes across horizontal road direction
  for (let s = -1.5; s <= 1.5; s += 1) {
    const offX = vrDx * s * 0.08;
    const offY = vrDy * s * 0.08;
    ctx.beginPath();
    ctx.moveTo(icx + offX - hrDx * 0.12, icy + offY - hrDy * 0.12);
    ctx.lineTo(icx + offX + hrDx * 0.12, icy + offY + hrDy * 0.12);
    ctx.stroke();
  }

  // Draw 4 crosswalk stripes across vertical road direction
  for (let s = -1.5; s <= 1.5; s += 1) {
    const offX = hrDx * s * 0.08;
    const offY = hrDy * s * 0.08;
    ctx.beginPath();
    ctx.moveTo(icx + offX - vrDx * 0.12, icy + offY - vrDy * 0.12);
    ctx.lineTo(icx + offX + vrDx * 0.12, icy + offY + vrDy * 0.12);
    ctx.stroke();
  }
}
