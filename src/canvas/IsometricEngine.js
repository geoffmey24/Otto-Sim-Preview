export function setupCanvas(canvasRef, containerRef) {
  const canvas = canvasRef.current;
  const container = containerRef.current;
  const dpr = window.devicePixelRatio || 1;
  const rect = container.getBoundingClientRect();

  canvas.width = rect.width * dpr;
  canvas.height = rect.height * dpr;

  const ctx = canvas.getContext('2d');
  ctx.scale(dpr, dpr);

  canvas.style.width = rect.width + 'px';
  canvas.style.height = rect.height + 'px';

  const originX = rect.width / 2;
  const originY = 80;

  return { ctx, width: rect.width, height: rect.height, originX, originY };
}

export function startRenderLoop(drawFrameFn) {
  let frameId;

  function loop() {
    drawFrameFn();
    frameId = requestAnimationFrame(loop);
  }

  frameId = requestAnimationFrame(loop);

  return function cleanup() {
    cancelAnimationFrame(frameId);
  };
}
