import React, { useRef, useEffect, useCallback } from 'react';
import { setupCanvas, startRenderLoop } from '../canvas/IsometricEngine';
import { drawGround, drawRoads } from '../canvas/Ground';
import { drawAllBuildings, generateWindowStates } from '../canvas/Buildings';
import { drawTrees } from '../canvas/Vegetation';
import { drawCar, createNPCs, updateNPC, drawNPC, drawPlayer } from '../canvas/Characters';
import { GRID, BUILDINGS } from '../constants';
import { toGrid, distance } from '../utils/helpers';

export default function WorldMap({ playerName, playerAvatar, onSummary, onYearBanner, onGameOver }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const windowStatesRef = useRef(null);
  const carColRef = useRef(-2);
  const npcsRef = useRef(null);
  const playerPosRef = useRef({ col: 10, row: 10 });
  const targetPosRef = useRef({ col: 10, row: 10 });
  const pendingBuildingRef = useRef(null);
  const configRef = useRef(null);

  useEffect(() => {
    if (!windowStatesRef.current) {
      windowStatesRef.current = generateWindowStates();
    }
    if (!npcsRef.current) {
      npcsRef.current = createNPCs();
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
    configRef.current = config;

    const cleanup = startRenderLoop(() => {
      // ─── Update phase ───
      // Car movement
      carColRef.current += 0.025;
      if (carColRef.current > 21) carColRef.current = -2;

      // NPC movement
      const npcs = npcsRef.current;
      for (let i = 0; i < npcs.length; i++) {
        updateNPC(npcs[i]);
      }

      // Player smooth movement
      const pp = playerPosRef.current;
      const tp = targetPosRef.current;
      pp.col += (tp.col - pp.col) * 0.12;
      pp.row += (tp.row - pp.row) * 0.12;
      if (distance(pp.col, pp.row, tp.col, tp.row) < 0.1) {
        pp.col = tp.col;
        pp.row = tp.row;
      }

      // Check if player arrived at pending building
      if (pendingBuildingRef.current) {
        const b = pendingBuildingRef.current;
        const bcx = b.gridCol + b.tileW / 2;
        const bcy = b.gridRow + b.tileD / 2;
        if (distance(pp.col, pp.row, bcx, bcy) < 0.5) {
          pendingBuildingRef.current = null;
        }
      }

      // ─── Render phase ───
      // 1. Clear
      ctx.clearRect(0, 0, width, height);
      // 2-3. Sky + ground tiles
      drawGround(ctx, config);
      // 4-5. Roads + markings
      drawRoads(ctx, config);
      // 6-9. Buildings (shadows, park grass, buildings, park elements, labels)
      drawAllBuildings(ctx, config, windowStatesRef.current);
      // 10. Trees
      drawTrees(ctx, config);

      // 11. NPCs (sorted back-to-front by row)
      const npcsSorted = [...npcs].sort((a, b) => a.row - b.row);
      for (let i = 0; i < npcsSorted.length; i++) {
        drawNPC(ctx, npcsSorted[i], config);
      }

      // 12. Car
      drawCar(ctx, carColRef.current, config);

      // 13-14. Player character + name tag
      drawPlayer(ctx, pp.col, pp.row, playerAvatar, playerName, config);
    });

    return cleanup;
  }, [playerName, playerAvatar]);

  // ─── Click/touch handling ───
  const handleInteraction = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    const config = configRef.current;
    if (!canvas || !config) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const gridPos = toGrid(x, y, config.originX, config.originY, config.tileWidth, config.tileHeight);

    // Check if clicked near a building
    for (let i = 0; i < BUILDINGS.length; i++) {
      const b = BUILDINGS[i];
      const bcx = b.gridCol + b.tileW / 2;
      const bcy = b.gridRow + b.tileD / 2;
      if (distance(gridPos.col, gridPos.row, bcx, bcy) < 2.0) {
        targetPosRef.current = { col: bcx, row: bcy };
        pendingBuildingRef.current = b;
        return;
      }
    }

    // Otherwise move to clicked tile
    targetPosRef.current = { col: gridPos.col, row: gridPos.row };
    pendingBuildingRef.current = null;
  }, []);

  const handleClick = useCallback((e) => {
    handleInteraction(e.clientX, e.clientY);
  }, [handleInteraction]);

  const handleTouch = useCallback((e) => {
    e.preventDefault();
    if (e.touches.length > 0) {
      handleInteraction(e.touches[0].clientX, e.touches[0].clientY);
    }
  }, [handleInteraction]);

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
        onClick={handleClick}
        onTouchStart={handleTouch}
        style={{
          width: '100%',
          height: '100%',
          display: 'block',
        }}
      />
    </div>
  );
}
