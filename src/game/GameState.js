import { useState, useCallback } from 'react';
import { STARTING_STATS, DECAY, ACTIONS_PER_MONTH } from '../constants';

function clampStat(v) {
  return Math.min(100, Math.max(0, v));
}

export function useGameState() {
  const [finances, setFinances] = useState(STARTING_STATS.finances);
  const [health, setHealth] = useState(STARTING_STATS.health);
  const [mental, setMental] = useState(STARTING_STATS.mental);
  const [relationships, setRelationships] = useState(STARTING_STATS.relationships);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(1);
  const [actionsLeft, setActionsLeft] = useState(ACTIONS_PER_MONTH);
  const [playerName, setPlayerName] = useState('');
  const [playerAvatar, setPlayerAvatar] = useState(0);
  const [currentScreen, setCurrentScreen] = useState('loading');
  const [activeBuilding, setActiveBuilding] = useState(null);
  const [selectedScenario, setSelectedScenario] = useState(null);
  const [cardOpen, setCardOpen] = useState(false);
  const [cardClosing, setCardClosing] = useState(false);
  const [gameOverReason, setGameOverReason] = useState(null);
  const [showMonthSummary, setShowMonthSummary] = useState(false);
  const [showYearBanner, setShowYearBanner] = useState(false);
  const [previousStats, setPreviousStats] = useState(null);

  const setPlayerInfo = useCallback((name, avatarIndex) => {
    setPlayerName(name);
    setPlayerAvatar(avatarIndex);
  }, []);

  const checkGameOver = useCallback((fin, hp, mnt, rel) => {
    if (fin <= 0) return { isOver: true, reason: 'finances' };
    if (hp <= 0) return { isOver: true, reason: 'health' };
    if (mnt <= 0) return { isOver: true, reason: 'mental' };
    if (rel <= 0) return { isOver: true, reason: 'relationships' };
    return { isOver: false };
  }, []);

  const applyImpacts = useCallback((impacts) => {
    setFinances(prev => {
      const v = clampStat(prev + (impacts.finances || 0));
      return v;
    });
    setHealth(prev => {
      const v = clampStat(prev + (impacts.health || 0));
      return v;
    });
    setMental(prev => {
      const v = clampStat(prev + (impacts.mental || 0));
      return v;
    });
    setRelationships(prev => {
      const v = clampStat(prev + (impacts.relationships || 0));
      return v;
    });
    // Check game over after state settles (use setTimeout to read updated state)
    setTimeout(() => {
      setFinances(f => {
        setHealth(h => {
          setMental(m => {
            setRelationships(r => {
              const result = checkGameOver(f, h, m, r);
              if (result.isOver) {
                setGameOverReason(result.reason);
                setCurrentScreen('gameOver');
              }
              return r;
            });
            return m;
          });
          return h;
        });
        return f;
      });
    }, 50);
  }, [checkGameOver]);

  const applyDecay = useCallback(() => {
    setFinances(prev => clampStat(prev + DECAY.finances));
    setHealth(prev => clampStat(prev + DECAY.health));
    setMental(prev => clampStat(prev + DECAY.mental));
    setRelationships(prev => clampStat(prev + DECAY.relationships));
  }, []);

  const snapshotStats = useCallback(() => {
    setPreviousStats({ finances, health, mental, relationships });
  }, [finances, health, mental, relationships]);

  const useAction = useCallback(() => {
    setActionsLeft(prev => Math.max(0, prev - 1));
  }, []);

  const advanceMonth = useCallback(() => {
    setMonth(prev => {
      if (prev >= 12) {
        setYear(y => y + 1);
        setShowYearBanner(true);
        return 1;
      }
      return prev + 1;
    });
    setActionsLeft(ACTIONS_PER_MONTH);
  }, []);

  // Called when the player clicks "Next Month" in MonthSummary.
  // Applies monthly decay, checks game over, and if alive: snapshots stats,
  // advances month, and navigates to yearBanner or world.
  const handleNextMonth = useCallback(() => {
    // Apply decay
    setFinances(prev => clampStat(prev + DECAY.finances));
    setHealth(prev => clampStat(prev + DECAY.health));
    setMental(prev => clampStat(prev + DECAY.mental));
    setRelationships(prev => clampStat(prev + DECAY.relationships));

    // After decay settles, read final values via nested setState
    setTimeout(() => {
      setFinances(f => {
        setHealth(h => {
          setMental(m => {
            setRelationships(r => {
              const result = checkGameOver(f, h, m, r);
              if (result.isOver) {
                setGameOverReason(result.reason);
                setCurrentScreen('gameOver');
              } else {
                // Snapshot post-decay stats as baseline for next month
                setPreviousStats({ finances: f, health: h, mental: m, relationships: r });
                // Advance month
                setMonth(prev => {
                  if (prev >= 12) {
                    setYear(y => y + 1);
                    setShowYearBanner(true);
                    // Navigate to yearBanner after a tick
                    setTimeout(() => setCurrentScreen('yearBanner'), 20);
                    return 1;
                  }
                  setCurrentScreen('world');
                  return prev + 1;
                });
                setActionsLeft(ACTIONS_PER_MONTH);
              }
              return r;
            });
            return m;
          });
          return h;
        });
        return f;
      });
    }, 50);
  }, [checkGameOver]);

  const resetGame = useCallback(() => {
    setFinances(STARTING_STATS.finances);
    setHealth(STARTING_STATS.health);
    setMental(STARTING_STATS.mental);
    setRelationships(STARTING_STATS.relationships);
    setMonth(1);
    setYear(1);
    setActionsLeft(ACTIONS_PER_MONTH);
    setPlayerName('');
    setPlayerAvatar(0);
    setCurrentScreen('creation');
    setActiveBuilding(null);
    setSelectedScenario(null);
    setCardOpen(false);
    setCardClosing(false);
    setGameOverReason(null);
    setShowMonthSummary(false);
    setShowYearBanner(false);
    setPreviousStats(null);
  }, []);

  return {
    // State
    finances, health, mental, relationships,
    month, year, actionsLeft,
    playerName, playerAvatar,
    currentScreen, setCurrentScreen,
    activeBuilding, setActiveBuilding,
    selectedScenario, setSelectedScenario,
    cardOpen, setCardOpen,
    cardClosing, setCardClosing,
    gameOverReason,
    showMonthSummary, setShowMonthSummary,
    showYearBanner, setShowYearBanner,
    previousStats,
    // Functions
    setPlayerInfo,
    applyImpacts,
    applyDecay,
    useAction,
    checkGameOver: () => checkGameOver(finances, health, mental, relationships),
    advanceMonth,
    handleNextMonth,
    resetGame,
    snapshotStats,
  };
}
