import React, { useState, useEffect } from 'react';
import CharacterCreation from './screens/CharacterCreation';
import WorldMap from './screens/WorldMap';
import MonthSummary from './screens/MonthSummary';
import YearBanner from './screens/YearBanner';
import GameOver from './screens/GameOver';

export default function App() {
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState(0);

  useEffect(() => {
    document.fonts.ready.then(() => {
      setCurrentScreen('creation');
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
      {currentScreen === 'loading' && (
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

      {currentScreen === 'creation' && (
        <CharacterCreation
          onComplete={(name, avatar) => {
            setPlayerName(name);
            setPlayerAvatar(avatar);
            setCurrentScreen('world');
          }}
        />
      )}

      {currentScreen === 'world' && (
        <WorldMap
          playerName={playerName}
          playerAvatar={playerAvatar}
          onSummary={() => setCurrentScreen('summary')}
          onYearBanner={() => setCurrentScreen('yearBanner')}
          onGameOver={() => setCurrentScreen('gameOver')}
        />
      )}

      {currentScreen === 'summary' && (
        <MonthSummary
          onContinue={() => setCurrentScreen('world')}
        />
      )}

      {currentScreen === 'yearBanner' && (
        <YearBanner
          onContinue={() => setCurrentScreen('world')}
        />
      )}

      {currentScreen === 'gameOver' && (
        <GameOver
          onRestart={() => {
            setPlayerName('');
            setPlayerAvatar(0);
            setCurrentScreen('creation');
          }}
        />
      )}
    </div>
  );
}
