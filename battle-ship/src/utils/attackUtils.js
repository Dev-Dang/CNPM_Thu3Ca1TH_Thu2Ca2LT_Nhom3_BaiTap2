import { BOARD_SIZE, CELL_STATE } from '../constants/gameConstants';

/**
 * 3.3 — Kiểm tra tọa độ hợp lệ và chưa bị tấn công.
 * @returns {boolean} isValid
 */
export function validateCoordinate(row, col, board) {
  if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) return false;
  const state = board[row][col].state;
  return state !== CELL_STATE.HIT && state !== CELL_STATE.MISS && state !== CELL_STATE.SUNK;
}

/**
 * 3.4 — Kiểm tra ô có tàu không, trả về thông tin tàu và số ô còn lại.
 * fleet[i].positions = [{ row, col }, ...]   ← shape từ boardUtils
 * @returns {{ hasShip: boolean, ship: object|null, remainingCells: number }}
 */
export function checkCell(row, col, board, fleet) {
  const cell = board[row][col];
  if (!cell.shipId) return { hasShip: false, ship: null, remainingCells: 0 };

  const ship = fleet.find((s) => s.id === cell.shipId);
  if (!ship) return { hasShip: false, ship: null, remainingCells: 0 };

  const remainingCells = ship.positions.filter(({ row: r, col: c }) => {
    const s = board[r][c].state;
    return s !== CELL_STATE.HIT && s !== CELL_STATE.SUNK && !(r === row && c === col);
  }).length;

  return { hasShip: true, ship, remainingCells };
}

/**
 * 3.5 / 3.A1.2 / 3.A2.2 — Đánh dấu một ô.
 * @returns {Cell[][]} newBoard (immutable)
 */
export function markCell(row, col, newState, board) {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  newBoard[row][col] = { ...newBoard[row][col], state: newState };
  return newBoard;
}

/**
 * 3.A2.2 — Đánh dấu toàn bộ ô của tàu bị nhấn chìm thành SUNK.
 * @returns {Cell[][]} newBoard (immutable)
 */
export function markAllShipCells(ship, board) {
  const newBoard = board.map((r) => r.map((c) => ({ ...c })));
  ship.positions.forEach(({ row: r, col: c }) => {
    newBoard[r][c] = { ...newBoard[r][c], state: CELL_STATE.SUNK };
  });
  return newBoard;
}

/**
 * 3.6 — Kiểm tra tất cả tàu địch đã bị nhấn chìm chưa.
 * @returns {boolean} isOver
 */
export function checkEndGame(fleet, board) {
  return fleet.every((ship) =>
    ship.positions.every(({ row: r, col: c }) => board[r][c].state === CELL_STATE.SUNK)
  );
}