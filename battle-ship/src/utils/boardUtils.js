// ================================================================
// boardUtils.js — UC-02 (Đặt Tàu)
// ================================================================

import {
  CELL_STATE,
  DEFAULT_DIFFICULTY,
  ORIENTATION,
} from '../constants/gameConstants.js';

/**
 * Tạo bảng rỗng theo kích thước cấu hình độ khó.
 * Mặc định dùng DEFAULT_DIFFICULTY.boardSize.
 *
 * @param {number} size
 * @returns {Cell[][]}
 */
export function createBoard(size = DEFAULT_DIFFICULTY.boardSize) {
  return Array.from({length: size}, (_, row) =>
    Array.from({length: size}, (_, col) => ({
      row,
      col,
      state: CELL_STATE.EMPTY,
      shipId: null,
    }))
  );
}

/**
 * Trả về mảng các tọa độ {row, col} mà tàu sẽ chiếm. (UC-02)
 * @param {number} row
 * @param {number} col
 * @param {number} size
 * @param {string} orientation - 'H' | 'V'
 * @returns {{ row: number, col: number }[]}
 */
export function getShipPositions(row, col, size, orientation) {
  return Array.from({length: size}, (_, i) => ({
    row: orientation === ORIENTATION.VERTICAL ? row + i : row,
    col: orientation === ORIENTATION.HORIZONTAL ? col + i : col,
  }));
}

/**
 * Tính ô đầu tàu từ ô/segment đang được giữ làm điểm neo khi kéo thả.
 *
 * @param {number} row
 * @param {number} col
 * @param {number} pivotIndex
 * @param {string} orientation
 * @returns {{ row: number, col: number }}
 */
export function getShipAnchorFromPivot(row, col, pivotIndex, orientation) {
  return {
    row: orientation === ORIENTATION.VERTICAL ? row - pivotIndex : row,
    col: orientation === ORIENTATION.HORIZONTAL ? col - pivotIndex : col,
  };
}

/**
 * Kiểm tra vị trí đặt tàu có hợp lệ không (UC-02: RUL-04, RUL-05).
 *
 * [2.2.3b/2.2.3c] isValidPlacement(board, row, col, size, dir) → boolean
 *       - RUL-04: Không vượt biên bảng
 *       - RUL-05: Không đè lên tàu khác
 *
 * @param {Cell[][]} board
 * @param {number} row
 * @param {number} col
 * @param {number} size
 * @param {string} orientation
 * @returns {boolean}
 */
export function isValidPlacement(board, row, col, size, orientation) {
  const rows = board.length;
  const cols = board[0]?.length ?? 0;
  const positions = getShipPositions(row, col, size, orientation);

  for (const pos of positions) {
    if (pos.row < 0 || pos.row >= rows || pos.col < 0 || pos.col >= cols) {
      return false;
    }

    if (board[pos.row][pos.col].state !== CELL_STATE.EMPTY) {
      return false;
    }
  }

  return true;
}

/**
 * Đặt tàu lên bảng, trả về board mới (immutable). (UC-02)
 *
 * [2.2.4] placeShipOnBoard(board, row, col, size, dir) → newBoard
 *
 * @param {Cell[][]} board
 * @param {number} row
 * @param {number} col
 * @param {number} size
 * @param {string} orientation
 * @param {string} shipId
 * @returns {{ board: Cell[][], positions: { row: number, col: number }[] }}
 */
export function placeShipOnBoard(board, row, col, size, orientation, shipId) {
  const positions = getShipPositions(row, col, size, orientation);
  const newBoard = board.map((r) => r.map((cell) => ({...cell})));

  for (const pos of positions) {
    newBoard[pos.row][pos.col] = {
      ...newBoard[pos.row][pos.col],
      state: CELL_STATE.SHIP,
      shipId,
    };
  }

  return {board: newBoard, positions};
}

/**
 * Xóa tàu khỏi bảng, trả về board mới (dùng khi tái đặt). (UC-02)
 * @param {Cell[][]} board
 * @param {{ row: number, col: number }[]} positions
 * @returns {Cell[][]}
 */
export function removeShipFromBoard(board, positions) {
  const newBoard = board.map((r) => r.map((cell) => ({...cell})));

  for (const pos of positions) {
    newBoard[pos.row][pos.col] = {
      ...newBoard[pos.row][pos.col],
      state: CELL_STATE.EMPTY,
      shipId: null,
    };
  }

  return newBoard;
}

/**
 * Kiểm tra ô đã bị tấn công trước đó chưa. (UC-03)
 * @param {Cell[][]} board
 * @param {number} row
 * @param {number} col
 * @returns {boolean}
 */
export function isCellAlreadyAttacked(board, row, col) {
  const state = board[row][col].state;
  return state === CELL_STATE.HIT || state === CELL_STATE.MISS;
}

/**
 * Đặt toàn bộ hạm đội ngẫu nhiên lên bảng. (UC-02 — khởi tạo hạm đội máy tính)
 *
 * [2.1.1d/2.4.3] placeFleetRandomly(emptyBoard, fleet) → { board, fleet }
 *
 * @param {Cell[][]} board
 * @param {Ship[]} fleet
 * @returns {{ board: Cell[][], fleet: Ship[] }}
 */
export function placeFleetRandomly(board, fleet) {
  let currentBoard = board.map((r) => r.map((cell) => ({...cell})));

  const orientations = [ORIENTATION.HORIZONTAL, ORIENTATION.VERTICAL];
  const rowCount = currentBoard.length;
  const colCount = currentBoard[0]?.length ?? 0;
  const maxAttemptsPerShip = 200;

  const placedFleet = fleet.map((ship) => {
    let attempts = 0;

    while (attempts < maxAttemptsPerShip) {
      attempts += 1;

      const orientation = orientations[Math.floor(Math.random() * orientations.length)];
      const row = Math.floor(Math.random() * rowCount);
      const col = Math.floor(Math.random() * colCount);

      if (isValidPlacement(currentBoard, row, col, ship.size, orientation)) {
        const result = placeShipOnBoard(currentBoard, row, col, ship.size, orientation, ship.id);
        currentBoard = result.board;

        return {...ship, orientation, positions: result.positions, placed: true};
      }
    }

    throw new Error('FLEET_RANDOM_PLACEMENT_FAILED');
  });

  return {board: currentBoard, fleet: placedFleet};
}