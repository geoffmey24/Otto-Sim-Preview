// Game logic utilities - to be implemented
export function applyDecay(stats, decay) {
  return {
    finances: stats.finances + decay.finances,
    health: stats.health + decay.health,
    mental: stats.mental + decay.mental,
    relationships: stats.relationships + decay.relationships,
  };
}
