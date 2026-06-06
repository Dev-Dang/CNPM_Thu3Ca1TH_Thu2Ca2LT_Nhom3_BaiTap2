// ================================================================
// boardUtils.js — UC-02 (Đặt Tàu)
// ================================================================

import {BOARD_SIZE, CELL_STATE} from '../constants/gameConstants.js';

/**
 * Tạo bảng 10×10 rỗng (RUL-01). Đã implement — không cần thay đổi.
 * @returns {Cell[][]}
 */
export function createBoard() {
    return Array.from({length: BOARD_SIZE}, (_, row) =>
        Array.from({length: BOARD_SIZE}, (_, col) => ({
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
        row: orientation === 'V' ? row + i : row,
        col: orientation === 'H' ? col + i : col,
    }));
}

/**
 * Kiểm tra vị trí đặt tàu có hợp lệ không (UC-02: RUL-04, RUL-05).
 *
 * [2.5] isValidPlacement(board, row, col, size, dir) → boolean
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
    const positions = getShipPositions(row, col, size, orientation);

    for (const pos of positions) {
        // [2.5] RUL-04: Không vượt biên bảng
        if (pos.row < 0 || pos.row >= BOARD_SIZE || pos.col < 0 || pos.col >= BOARD_SIZE) {
            return false;                                        // [2.5] → boolean (false)
        }
        // [2.5] RUL-05: Không đè lên tàu khác
        if (board[pos.row][pos.col].state !== CELL_STATE.EMPTY) {
            return false;                                        // [2.5] → boolean (false)
        }
    }

    return true;                                             // [2.5] → boolean (true)
}

/**
 * Đặt tàu lên bảng, trả về board mới (immutable). (UC-02)
 *
 * [2.6] placeShipOnBoard(board, row, col, size, dir) → newBoard
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

    // [2.6] Deep copy board (immutable)
    const newBoard = board.map((r) => r.map((cell) => ({...cell})));

    for (const pos of positions) {
        newBoard[pos.row][pos.col] = {
            ...newBoard[pos.row][pos.col],
            state: CELL_STATE.SHIP,
            shipId,
        };
    }

    return {board: newBoard, positions};                   // [2.6] → newBoard
}

/**
 * Xóa tàu khỏi bảng, trả về board mới (dùng khi tái đặt). (UC-02)
 * @param {Cell[][]} board
 * @param {{ row: number, col: number }[]} positions
 * @returns {Cell[][]}
 */
export function removeShipFromBoard(board, positions) {
    // Deep copy board (immutable)
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
 * [2.1] placeFleetRandomly(emptyBoard, fleet) → { computerBoard, computerFleet }
 *
 * @param {Cell[][]} board
 * @param {Ship[]} fleet
 * @returns {{ board: Cell[][], fleet: Ship[] }}
 */
export function placeFleetRandomly(board, fleet) {
    let currentBoard = board.map((r) => r.map((cell) => ({...cell})));
    const orientations = ['H', 'V'];

    // [2.1] Lặp qua từng tàu trong fleet, thử ngẫu nhiên cho đến khi đặt được
    const placedFleet = fleet.map((ship) => {
        let placed = false;
        let positions = [];

        // Retry cho đến khi tìm được vị trí hợp lệ
        while (!placed) {
            const orientation = orientations[Math.floor(Math.random() * 2)];
            const row = Math.floor(Math.random() * BOARD_SIZE);
            const col = Math.floor(Math.random() * BOARD_SIZE);

            if (isValidPlacement(currentBoard, row, col, ship.size, orientation)) {
                const result = placeShipOnBoard(currentBoard, row, col, ship.size, orientation, ship.id);
                currentBoard = result.board;
                positions = result.positions;
                placed = true;

                return {...ship, orientation, positions, placed: true};
            }
        }

        return {...ship, positions, placed: true};
    });

    return {board: currentBoard, fleet: placedFleet};     // [2.1] → { computerBoard, computerFleet }
}
