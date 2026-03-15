import React, { useEffect } from 'react';
import CharacterCreation from './screens/CharacterCreation';
import WorldMap from './screens/WorldMap';
import MonthSummary from './screens/MonthSummary';
import YearBanner from './screens/YearBanner';
import GameOver from './screens/GameOver';
import { useGameState } from './game/GameState';

export default function App() {
  const gs = useGameState();

  useEffect(() => {
    document.fonts.ready.then(() => {
      gs.setCurrentScreen('creation');
    });
  }, []);

  return (
    <div style={{
      maxWidth: 480,
      margin: '0 auto',
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {gs.currentScreen === 'loading' && (
        <div style={{
          width: '100%',
          height: '100vh',
          background: '#0a0f1e',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            color: '#ffffff',
            fontFamily: 'Nunito, sans-serif',
            fontSize: 18,
            animation: 'loadingPulse 1.5s infinite',
          }}>
            Loading...
          </span>
        </div>
      )}

      {gs.currentScreen === 'creation' && (
        <CharacterCreation
          onStart={(playerData) => {
            gs.setPlayerInfo(playerData.name, playerData.avatarIndex);
            gs.snapshotStats();
            gs.setCurrentScreen('world');
          }}
        />
      )}

      {gs.currentScreen === 'world' && (
        <WorldMap
          playerName={gs.playerName}
          playerAvatar={gs.playerAvatar}
          finances={gs.finances}
          health={gs.health}
          mental={gs.mental}
          relationships={gs.relationships}
          year={gs.year}
          month={gs.month}
          actionsLeft={gs.actionsLeft}
          activeBuilding={gs.activeBuilding}
          selectedScenario={gs.selectedScenario}
          cardOpen={gs.cardOpen}
          cardClosing={gs.cardClosing}
          setActiveBuilding={gs.setActiveBuilding}
          setSelectedScenario={gs.setSelectedScenario}
          setCardOpen={gs.setCardOpen}
          setCardClosing={gs.setCardClosing}
          applyImpacts={gs.applyImpacts}
          useAction={gs.useAction}
          onSummary={() => gs.setCurrentScreen('summary')}
          onYearBanner={() => gs.setCurrentScreen('yearBanner')}
          onGameOver={() => gs.setCurrentScreen('gameOver')}
        />
      )}

      {gs.currentScreen === 'summary' && (
        <MonthSummary
          stats={{
            finances: gs.finances,
            health: gs.health,
            mental: gs.mental,
            relationships: gs.relationships,
          }}
          previousStats={gs.previousStats}
          month={gs.month}
          year={gs.year}
          onNextMonth={gs.handleNextMonth}
        />
      )}

      {gs.currentScreen === 'yearBanner' && (
        <YearBanner
          year={gs.year}
          onDismiss={() => {
            gs.setShowYearBanner(false);
            gs.setCurrentScreen('world');
          }}
        />
      )}

      {gs.currentScreen === 'gameOver' && (
        <GameOver
          reason={gs.gameOverReason}
          year={gs.year}
          month={gs.month}
          onRestart={() => gs.resetGame()}
        />
      )}
    </div>
  );
}
