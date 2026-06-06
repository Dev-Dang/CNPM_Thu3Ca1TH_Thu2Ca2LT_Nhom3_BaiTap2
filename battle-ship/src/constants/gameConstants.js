export const BOARD_SIZE = 10;

export const PHASES = {
  SETUP: 'SETUP',
  PLAYER_TURN: 'PLAYER_TURN',
  CPU_TURN: 'CPU_TURN',
  GAME_OVER: 'GAME_OVER',
  INVALID_PLACEMENT: 'INVALID_PLACEMENT'
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

export const WINNER = {
  PLAYER: 'player',
  COMPUTER: 'computer',
};

export const DELAY_MS = 500;
