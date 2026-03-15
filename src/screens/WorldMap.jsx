import React, { useRef, useEffect, useCallback } from 'react';
import { setupCanvas, startRenderLoop } from '../canvas/IsometricEngine';
import { drawGround, drawRoads } from '../canvas/Ground';
import { drawAllBuildings, generateWindowStates } from '../canvas/Buildings';
import { drawTrees } from '../canvas/Vegetation';
import { drawCar, createNPCs, updateNPC, drawNPC, drawPlayer } from '../canvas/Characters';
import { drawSelectionGlow } from '../canvas/Effects';
import HUD from '../components/HUD';
import DecisionCard from '../components/DecisionCard';
import { GRID, BUILDINGS } from '../constants';
import { toGrid, distance } from '../utils/helpers';
import { SCENARIOS } from '../game/Scenarios';

export default function WorldMap({
  playerName, playerAvatar,
  finances, health, mental, relationships,
  year, month, actionsLeft,
  activeBuilding, selectedScenario,
  cardOpen, cardClosing,
  setActiveBuilding, setSelectedScenario,
  setCardOpen, setCardClosing,
  applyImpacts, useAction,
  onSummary, onYearBanner, onGameOver,
}) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const windowStatesRef = useRef(null);
  const carColRef = useRef(-2);
  const npcsRef = useRef(null);
  const playerPosRef = useRef({ col: 10, row: 10 });
  const targetPosRef = useRef({ col: 10, row: 10 });
  const pendingBuildingRef = useRef(null);
  const configRef = useRef(null);
  const arrivedRef = useRef(false);
  const cardGuardRef = useRef(false);
  const actionsLeftRef = useRef(actionsLeft);

  // Keep actionsLeft ref in sync for use in render loop guard
  useEffect(() => {
    actionsLeftRef.current = actionsLeft;
  }, [actionsLeft]);

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

    const cleanup = startRenderLoop((timestamp) => {
      // Update phase
      carColRef.current += 0.025;
      if (carColRef.current > 21) carColRef.current = -2;

      const npcs = npcsRef.current;
      for (let i = 0; i < npcs.length; i++) {
        updateNPC(npcs[i]);
      }

      const pp = playerPosRef.current;
      const tp = targetPosRef.current;
      pp.col += (tp.col - pp.col) * 0.12;
      pp.row += (tp.row - pp.row) * 0.12;
      if (distance(pp.col, pp.row, tp.col, tp.row) < 0.1) {
        pp.col = tp.col;
        pp.row = tp.row;
      }

      // Building arrival detection
      if (pendingBuildingRef.current && !arrivedRef.current && !cardGuardRef.current) {
        const b = pendingBuildingRef.current;
        const bcx = b.gridCol + b.tileW / 2;
        const bcy = b.gridRow + b.tileD / 2;
        if (distance(pp.col, pp.row, bcx, bcy) < 0.5) {
          arrivedRef.current = true;
          // Guard: no actions left means no card
          if (actionsLeftRef.current <= 0) {
            pendingBuildingRef.current = null;
          } else {
            const scenarios = SCENARIOS[b.id];
            if (scenarios && scenarios.length > 0) {
              const pick = scenarios[Math.floor(Math.random() * scenarios.length)];
              setActiveBuilding(b);
              setSelectedScenario(pick);
              cardGuardRef.current = true;
              setTimeout(() => {
                setCardOpen(true);
              }, 600);
            }
          }
        }
      }

      // Render phase
      const now = timestamp || Date.now();
      ctx.clearRect(0, 0, width, height);
      drawGround(ctx, config);
      drawRoads(ctx, config);
      drawAllBuildings(ctx, config, windowStatesRef.current);
      drawTrees(ctx, config);

      // Draw selection glow on active building
      if (pendingBuildingRef.current) {
        drawSelectionGlow(ctx, pendingBuildingRef.current, config.originX, config.originY, config.tileWidth, config.tileHeight, now);
      }

      const npcsSorted = [...npcs].sort((a, b) => a.row - b.row);
      for (let i = 0; i < npcsSorted.length; i++) {
        drawNPC(ctx, npcsSorted[i], config);
      }

      drawCar(ctx, carColRef.current, config);
      drawPlayer(ctx, pp.col, pp.row, playerAvatar, playerName, config);
    });

    return cleanup;
  }, [playerName, playerAvatar, setActiveBuilding, setSelectedScenario, setCardOpen]);

  const handleInteraction = useCallback((clientX, clientY) => {
    // Guard: card open/closing or no actions left
    if (cardGuardRef.current) return;
    if (actionsLeftRef.current <= 0) return;

    const canvas = canvasRef.current;
    const config = configRef.current;
    if (!canvas || !config) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    const gridPos = toGrid(x, y, config.originX, config.originY, config.tileWidth, config.tileHeight);

    for (let i = 0; i < BUILDINGS.length; i++) {
      const b = BUILDINGS[i];
      const bcx = b.gridCol + b.tileW / 2;
      const bcy = b.gridRow + b.tileD / 2;
      if (distance(gridPos.col, gridPos.row, bcx, bcy) < 2.0) {
        targetPosRef.current = { col: bcx, row: bcy };
        pendingBuildingRef.current = b;
        arrivedRef.current = false;
        return;
      }
    }

    targetPosRef.current = { col: gridPos.col, row: gridPos.row };
    pendingBuildingRef.current = null;
    arrivedRef.current = false;
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

  const handleCardChoice = useCallback((impacts) => {
    applyImpacts(impacts);
    useAction();
  }, [applyImpacts, useAction]);

  const handleCardClose = useCallback(() => {
    setCardOpen(false);
    setCardClosing(false);
    setActiveBuilding(null);
    setSelectedScenario(null);
    pendingBuildingRef.current = null;
    arrivedRef.current = false;
    cardGuardRef.current = false;
  }, [setCardOpen, setCardClosing, setActiveBuilding, setSelectedScenario]);

  // Watch for actionsLeft hitting 0 to trigger month summary
  useEffect(() => {
    if (actionsLeft <= 0 && !cardOpen && !cardGuardRef.current) {
      const timer = setTimeout(() => {
        onSummary();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [actionsLeft, cardOpen, onSummary]);

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
          touchAction: 'none',
        }}
      />
      <HUD
        playerName={playerName}
        avatarIndex={playerAvatar}
        year={year}
        month={month}
        actionsLeft={actionsLeft}
        finances={finances}
        health={health}
        mental={mental}
        relationships={relationships}
      />

      {cardOpen && selectedScenario && activeBuilding && (
        <DecisionCard
          scenario={selectedScenario}
          locationName={activeBuilding.name}
          actionsLeft={actionsLeft}
          onChoice={handleCardChoice}
          onClose={handleCardClose}
        />
      )}
    </div>
  );
}
