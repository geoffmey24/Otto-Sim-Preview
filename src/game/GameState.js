// Game state management - to be implemented
import { STARTING_STATS } from '../constants';

export function createInitialState() {
  return {
    stats: { ...STARTING_STATS },
    month: 1,
    year: 1,
    actionsRemaining: 4,
  };
}
