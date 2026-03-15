import React, { useRef, useEffect } from 'react';
import { setupCanvas, startRenderLoop } from '../canvas/IsometricEngine';
import { drawGround, drawRoads } from '../canvas/Ground';
import { drawAllBuildings, generateWindowStates } from '../canvas/Buildings';
import { GRID } from '../constants';

export default function WorldMap({ playerName, playerAvatar, onSummary, onYearBanner, onGameOver }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const windowStatesRef = useRef(null);

  useEffect(() => {
    // Generate stable window states once
    if (!windowStatesRef.current) {
      windowStatesRef.current = generateWindowStates();
    }

    const { ctx, width, height, originX, originY } = setupCanvas(canvasRef, containerRef);

    const config = {
      originX,
      originY,
      tileWidth: GRID.tileWidth,
      tileHeight: GRID.tileHeight,
      gridSize: GRID.gridSize,
      width,
      height,
    };

    const cleanup = startRenderLoop(() => {
      ctx.clearRect(0, 0, width, height);
      drawGround(ctx, config);
      drawRoads(ctx, config);
      drawAllBuildings(ctx, config, windowStatesRef.current);
    });

    return cleanup;
  }, []);

  return (
    <div
      ref={containerRef}
      style={{
        width: '100%',
        height: '100vh',
        position: 'relative',
        background: '#0a0f1e',
        overflow: 'hidden',
      }}
    >
      <canvas
        ref={canvasRef}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
