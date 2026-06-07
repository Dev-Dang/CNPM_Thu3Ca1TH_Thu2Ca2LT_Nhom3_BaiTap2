export const PHASES = {
  SETUP: 'SETUP',
  PLAYER_TURN: 'PLAYER_TURN',
  CPU_TURN: 'CPU_TURN',
  GAME_OVER: 'GAME_OVER',
  INVALID_PLACEMENT: 'INVALID_PLACEMENT',
  ERROR: 'ERROR',
};

export const CELL_STATE = {
  EMPTY: 'empty',
  SHIP: 'ship',
  HIT: 'hit',
  MISS: 'miss',
  SUNK: 'sunk',
};

export const ORIENTATION = {
  HORIZONTAL: 'H',
  VERTICAL: 'V',
};

export const SHIP_TYPES = {
  CARRIER: {id: 'carrier', name: 'Tàu Sân Bay', size: 5},
  BATTLESHIP: {id: 'battleship', name: 'Thiết Giáp Hạm', size: 4},
  CRUISER: {id: 'cruiser', name: 'Tàu Tuần Dương', size: 3},
  SUBMARINE: {id: 'submarine', name: 'Tàu Ngầm', size: 3},
  DESTROYER: {id: 'destroyer', name: 'Tàu Khu Trục', size: 2},
};

export const DIFFICULTY = {
  EASY: {
    id: 'easy',
    boardSize: 10,
    fleet: [
      {ship: SHIP_TYPES.CARRIER, count: 1},
      {ship: SHIP_TYPES.BATTLESHIP, count: 1},
      {ship: SHIP_TYPES.CRUISER, count: 1},
      {ship: SHIP_TYPES.SUBMARINE, count: 1},
      {ship: SHIP_TYPES.DESTROYER, count: 1},
    ],
  },

  NORMAL: {
    id: 'normal',
    boardSize: 12,
    fleet: [
      {ship: SHIP_TYPES.CARRIER, count: 1},
      {ship: SHIP_TYPES.BATTLESHIP, count: 2},
      {ship: SHIP_TYPES.CRUISER, count: 2},
      {ship: SHIP_TYPES.SUBMARINE, count: 1},
      {ship: SHIP_TYPES.DESTROYER, count: 2},
    ],
  },
};

export const DEFAULT_DIFFICULTY = DIFFICULTY.EASY;

export function getDifficultyById(difficultyId) {
  return Object.values(DIFFICULTY).find(
    (difficulty) => difficulty.id === difficultyId
  ) ?? DEFAULT_DIFFICULTY;
}

export const WINNER = {
  PLAYER: 'player',
  COMPUTER: 'computer',
};

export const DELAY_MS = 500;