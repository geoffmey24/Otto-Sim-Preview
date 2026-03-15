export function toScreen(col, row, originX, originY, tw, th) {
  return {
    x: originX + (col - row) * tw / 2,
    y: originY + (col + row) * th / 2,
  };
}

export function toGrid(mouseX, mouseY, originX, originY, tw, th) {
  const offsetX = mouseX - originX;
  const offsetY = mouseY - originY;
  let col = Math.round((offsetX / (tw / 2) + offsetY / (th / 2)) / 2);
  let row = Math.round((offsetY / (th / 2) - offsetX / (tw / 2)) / 2);
  col = Math.min(Math.max(col, 0), 19);
  row = Math.min(Math.max(row, 0), 19);
  return { col, row };
}

export function colorShade(hex, factor) {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  const clamp = (v) => Math.min(255, Math.max(0, Math.round(v)));
  const rr = clamp(r * factor);
  const gg = clamp(g * factor);
  const bb = clamp(b * factor);
  return '#' + [rr, gg, bb].map((v) => v.toString(16).padStart(2, '0')).join('');
}

export function clamp(val, min, max) {
  return Math.min(Math.max(val, min), max);
}

export function distance(c1, r1, c2, r2) {
  return Math.sqrt((c1 - c2) ** 2 + (r1 - r2) ** 2);
}
