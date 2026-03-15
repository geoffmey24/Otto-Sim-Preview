import { toScreen } from '../utils/helpers';
import { TREE_POSITIONS } from '../constants';

// Pre-sort trees once at module load (static data, never changes)
const sortedTrees = [...TREE_POSITIONS].sort((a, b) => a.row - b.row);

export function drawTrees(ctx, config) {
  const { originX: ox, originY: oy, tileWidth: tw, tileHeight: th } = config;

  for (let i = 0; i < sortedTrees.length; i++) {
    const tree = sortedTrees[i];
    const s = tree.scale;
    const pos = toScreen(tree.col, tree.row, ox, oy, tw, th);
    const sx = pos.x;
    const sy = pos.y;

    // Shadow
    ctx.save();
    ctx.translate(sx + 4 * s, sy);
    ctx.scale(1, 0.5);
    ctx.beginPath();
    ctx.arc(0, 0, 10 * s, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(20,40,10,0.18)';
    ctx.fill();
    ctx.restore();

    // Trunk
    ctx.fillStyle = '#8B6914';
    ctx.fillRect(sx - 2 * s, sy - 10 * s, 4 * s, 10 * s);
    // Darker right edge
    ctx.fillStyle = '#6a5210';
    ctx.fillRect(sx + 1 * s, sy - 10 * s, 1 * s, 10 * s);

    // Canopy
    const cx = sx;
    const cy = sy - 14 * s;
    const grad = ctx.createRadialGradient(cx, cy - 2 * s, 2 * s, cx, cy, 12 * s);
    grad.addColorStop(0, '#5aaa3a');
    grad.addColorStop(0.7, '#3a8a2a');
    grad.addColorStop(1, '#2a6a1a');
    ctx.beginPath();
    ctx.arc(cx, cy, 12 * s, 0, Math.PI * 2);
    ctx.fillStyle = grad;
    ctx.fill();

    // Canopy highlight
    ctx.beginPath();
    ctx.arc(cx - 2 * s, cy - 2 * s, 6 * s, 0, Math.PI * 2);
    ctx.fillStyle = 'rgba(255,255,255,0.08)';
    ctx.fill();
  }
}
