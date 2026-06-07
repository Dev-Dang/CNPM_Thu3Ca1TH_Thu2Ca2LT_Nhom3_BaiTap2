import {CELL_STATE} from '../constants/gameConstants';
import {isFleetDefeated} from "./fleetConfig.js";

/**
 * Bảng điểm theo loại tàu
 */
export const SHIP_POINTS = {
    destroyer: 20,
    submarine: 30,
    cruiser: 30,
    battleship: 40,
    carrier: 50,
};

/**
 * [UC-03 / 3.1.3, 3.6.2] Kiểm tra ô đã chọn: xác nhận nằm trong bảng 10x10 và chưa bị tấn công.
 * [UC-04 / 4.2.1] Dùng lại để lọc ô hợp lệ trong computerTargetQueue (Luồng thay thế 4.2).
 */
export function validateCoordinate(row, col, board) {
    const rowCount = board.length;
    const colCount = board[0]?.length ?? 0;

    if (row < 0 || row >= rowCount || col < 0 || col >= colCount) return false;
    const state = board[row][col].state;
    return state !== CELL_STATE.HIT && state !== CELL_STATE.MISS && state !== CELL_STATE.SUNK;
}

/**
 * [UC-03 / 3.1.4, 3.2.1, 3.3.1] Xác định kết quả tấn công (kiểm tra tàu và đếm số ô còn lại).
 * [UC-04 / 4.1.3] Dùng lại bên trong processAttack để xác định Miss / Hit / Sunk.
 */
export function getCellAttackInfo(row, col, board, fleet) {
    const cell = board[row][col];
    if (!cell.shipId) return {hasShip: false, ship: null, remainingCells: 0};

    const ship = fleet.find((s) => s.id === cell.shipId);
    if (!ship) return {hasShip: false, ship: null, remainingCells: 0};

    const remainingCells = ship.positions.filter(({row: r, col: c}) => {
        const s = board[r][c].state;
        return s !== CELL_STATE.HIT && s !== CELL_STATE.SUNK && !(r === row && c === col);
    }).length;

    return {hasShip: true, ship, remainingCells};
}

/**
 * [UC-03 / 3.1.5, 3.2.2] Đánh dấu ô vừa tấn công bằng ký hiệu Miss/Hit.
 * [UC-04 / 4.1.3] Dùng lại bên trong processAttack để cập nhật board sau khi xác định kết quả.
 */
export function markCell(row, col, newState, board) {
    const newBoard = board.map((r) => r.map((c) => ({...c})));
    newBoard[row][col] = {...newBoard[row][col], state: newState};
    return newBoard;
}

/**
 * [UC-03 / 3.3.2] Đánh dấu toàn bộ ô của tàu bị nhấn chìm đồng loạt bằng ký hiệu Sunk.
 * [UC-04 / 4.1.3] Dùng lại bên trong processAttack cho trường hợp kết quả Sunk.
 */
export function markAllShipCells(ship, board) {
    const newBoard = board.map((r) => r.map((c) => ({...c})));
    ship.positions.forEach(({row: r, col: c}) => {
        newBoard[r][c] = {...newBoard[r][c], state: CELL_STATE.SUNK};
    });
    return newBoard;
}

/**
 * [UC-03 / 3.1.6, 3.4.1] Kiểm tra điều kiện kết thúc ván (toàn bộ tàu đối thủ bị nhấn chìm).
 * [UC-04 / 4.1.5] Dùng lại trong computerAttack để kiểm tra isGameOver sau bước 4.1.4.
 * Lưu ý: với lượt Máy tính, isGameOver đã được tính sẵn bên trong processAttack (bước 4.1.3),
 * hàm này được gọi trực tiếp ở UC-03 (playerAttack) và gián tiếp qua isFleetDefeated ở UC-04.
 */
export function checkEndGame(fleet, board) {
    return fleet.every((ship) =>
        ship.positions.every(({row: r, col: c}) => board[r][c].state === CELL_STATE.SUNK)
    );
}
export function processAttack(board, fleet, row, col) {
    // [4.1.3] Kiểm tra ô bị tấn công: xác định có tàu không và còn bao nhiêu ô chưa bị bắn
    const {hasShip, ship, remainingCells} = getCellAttackInfo(row, col, board, fleet);

    if (!hasShip) {
        // [4.1.3 — Miss] Ô không chứa tàu → đánh dấu Miss, trả kết quả
        return {
            board: markCell(row, col, CELL_STATE.MISS, board),
            fleet,
            result: 'miss',
            isGameOver: false,
        };
    }

    // Ô chứa tàu → tăng hitCount
    const newFleet = fleet.map((s) =>
        s.id === ship.id ? {...s, hitCount: s.hitCount + 1} : s
    );

    if (remainingCells === 0) {
        // [4.1.3 — Sunk] Đây là ô cuối cùng của tàu → đánh dấu toàn bộ ô tàu bằng ký hiệu Sunk
        const updatedShip = newFleet.find((s) => s.id === ship.id);

        // [4.1.5] Tính sẵn cờ isGameOver để computerAttack dùng ở bước 4.1.5
        const checkGameOver = isFleetDefeated(newFleet);

        return {
            board: markAllShipCells(updatedShip, markCell(row, col, CELL_STATE.HIT, board)),
            fleet: newFleet,
            result: 'sunk',
            isGameOver: checkGameOver,
        };
    }

    // [4.1.3 — Hit] Tàu còn ô khác chưa bị tấn công → đánh dấu Hit
    return {
        board: markCell(row, col, CELL_STATE.HIT, board),
        fleet: newFleet,
        result: 'hit',
        isGameOver: false,
    };
}

/**
 * Quy tắc tính hệ số combo dựa trên chuỗi bắn trúng liên tiếp
 * - Phát thứ 1: x1
 * - Phát thứ 2: x2
 * - Phát thứ 3 trở đi: x3
 */
export function calculateComboMultiplier(streak) {
    if (streak <= 1) return 1;
    if (streak === 2) return 2;
    return 3;
}