import { describe, expect, it } from 'vitest';
import gameReducer, {
  autoPlacePlayerFleet,
  placeShip,
  startBattle,
  startGame,
} from '../store/gameSlice.js';
import {
  CELL_STATE,
  DIFFICULTY,
  ORIENTATION,
  PHASES,
} from '../constants/gameConstants.js';
import {
  createBoard,
  getShipAnchorFromPivot,
  getShipPositions,
  isValidPlacement,
  placeShipOnBoard,
} from '../utils/boardUtils.js';

describe('UC-02 - Thiết lập bảng và đặt tàu', () => {
  it('TC-02-01 Khởi tạo giai đoạn thiết lập theo độ khó đã chọn', () => {
    const state = gameReducer(undefined, startGame(DIFFICULTY.NORMAL.id));

    expect(state.phase).toBe(PHASES.SETUP);
    expect(state.difficulty).toBe(DIFFICULTY.NORMAL.id);
    expect(state.boardSize).toBe(DIFFICULTY.NORMAL.boardSize);
    expect(state.playerBoard).toHaveLength(DIFFICULTY.NORMAL.boardSize);
    expect(state.playerBoard[0]).toHaveLength(DIFFICULTY.NORMAL.boardSize);
    expect(state.playerFleet).toHaveLength(8);
    expect(state.playerFleet.every((ship) => ship.placed === false)).toBe(true);
    expect(state.computerFleet).toHaveLength(8);
    expect(state.computerFleet.every((ship) => ship.placed === true)).toBe(true);
    expect(state.errorMessage).toBeNull();
  });

  it('TC-02-02 Đặt tàu người chơi vào vị trí hợp lệ', () => {
    const setupState = gameReducer(undefined, startGame(DIFFICULTY.EASY.id));
    const ship = setupState.playerFleet[0];

    const state = gameReducer(
      setupState,
      placeShip({
        shipId: ship.id,
        row: 0,
        col: 0,
        orientation: ORIENTATION.HORIZONTAL,
      })
    );

    const placedShip = state.playerFleet.find((item) => item.id === ship.id);

    expect(state.phase).toBe(PHASES.SETUP);
    expect(state.selectedShipId).toBe(ship.id);
    expect(state.errorMessage).toBeNull();
    expect(placedShip.placed).toBe(true);
    expect(placedShip.positions).toEqual([
      { row: 0, col: 0 },
      { row: 0, col: 1 },
      { row: 0, col: 2 },
      { row: 0, col: 3 },
      { row: 0, col: 4 },
    ]);
    expect(state.playerBoard[0][0].state).toBe(CELL_STATE.SHIP);
    expect(state.playerBoard[0][0].shipId).toBe(ship.id);
  });

  it('TC-02-03 Giữ nguyên bố cục khi vị trí đặt tàu không hợp lệ', () => {
    const setupState = gameReducer(undefined, startGame(DIFFICULTY.EASY.id));
    const ship = setupState.playerFleet[0];

    const state = gameReducer(
      setupState,
      placeShip({
        shipId: ship.id,
        row: 0,
        col: 8,
        orientation: ORIENTATION.HORIZONTAL,
      })
    );

    expect(state.phase).toBe(PHASES.INVALID_PLACEMENT);
    expect(state.errorMessage).toBe('Vị trí không hợp lệ. Vui lòng chọn vị trí khác.');
    expect(state.playerFleet[0].placed).toBe(false);
    expect(state.playerBoard.flat().every((cell) => cell.state === CELL_STATE.EMPTY)).toBe(true);
  });

  it('TC-02-04 Tự động đặt toàn bộ hạm đội và cho phép bắt đầu tấn công', () => {
    const setupState = gameReducer(undefined, startGame(DIFFICULTY.EASY.id));
    const autoPlacedState = gameReducer(setupState, autoPlacePlayerFleet());

    expect(autoPlacedState.phase).toBe(PHASES.SETUP);
    expect(autoPlacedState.playerFleet.every((ship) => ship.placed)).toBe(true);
    expect(autoPlacedState.playerFleet.every((ship) => ship.positions.length === ship.size)).toBe(true);

    const battleState = gameReducer(autoPlacedState, startBattle());

    expect(battleState.phase).toBe(PHASES.PLAYER_TURN);
    expect(battleState.errorMessage).toBeNull();
  });

  it('TC-02-05 Kiểm tra tọa độ tàu trước khi ghi lên bảng', () => {
    const board = createBoard(5);

    expect(getShipPositions(1, 1, 3, ORIENTATION.HORIZONTAL)).toEqual([
      { row: 1, col: 1 },
      { row: 1, col: 2 },
      { row: 1, col: 3 },
    ]);
    expect(getShipAnchorFromPivot(2, 3, 1, ORIENTATION.HORIZONTAL)).toEqual({ row: 2, col: 2 });
    expect(isValidPlacement(board, 0, 0, 5, ORIENTATION.VERTICAL)).toBe(true);
    expect(isValidPlacement(board, 0, 1, 5, ORIENTATION.HORIZONTAL)).toBe(false);

    const { board: occupiedBoard } = placeShipOnBoard(
      board,
      0,
      0,
      2,
      ORIENTATION.HORIZONTAL,
      'destroyer'
    );

    expect(isValidPlacement(occupiedBoard, 0, 0, 2, ORIENTATION.VERTICAL)).toBe(false);
  });
});
