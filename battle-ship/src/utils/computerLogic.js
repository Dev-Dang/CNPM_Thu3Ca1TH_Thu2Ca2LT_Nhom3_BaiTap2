import {validateCoordinate} from './attackUtils.js';

/**
 * Lấy danh sách ô liền kề hợp lệ (trên/dưới/trái/phải) quanh một ô.
 * Dùng cho chiến thuật Hunt-and-Target ở độ khó Normal.
 *
 * @param {number}    row
 * @param {number}    col
 * @param {Cell[][]}  board
 * @returns {{ row: number, col: number }[]}
 */
export function getAdjacentTargets(row, col, board) {
    const directions = [
        {row: row - 1, col},
        {row: row + 1, col},
        {row, col: col - 1},
        {row, col: col + 1},
    ].filter(({row: r, col: c}) => validateCoordinate(r, c, board));

    // Fisher-Yates Shuffle
    for (let i = directions.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [directions[i], directions[j]] = [directions[j], directions[i]];
    }

    return directions;
}

/**
 * Chọn ô tấn công ngẫu nhiên trong các ô hợp lệ còn lại.
 * Dùng cho Easy và làm fallback cho Normal khi targetQueue rỗng.
 *
 * @param {Cell[][]} board
 * @returns {{ row: number, col: number } | null}
 */
export function selectRandomAttackCell(board) {
    const available = [];
    board.forEach((rowArr) =>
        rowArr.forEach((cell) => {
            if (validateCoordinate(cell.row, cell.col, board)) {
                available.push({row: cell.row, col: cell.col});
            }
        })
    );
    if (available.length === 0) return null;
    return available[Math.floor(Math.random() * available.length)];
}

/**
 * Chọn ô tấn công theo chiến thuật Hunt-and-Target cho độ khó Normal.
 * - Nếu targetQueue có ô hợp lệ → ưu tiên bắn ô đầu queue.
 * - Nếu queue rỗng hoặc toàn bộ không hợp lệ → fallback chọn ngẫu nhiên.
 *
 * @param {Cell[][]}                  board
 * @param {{ row: number, col: number }[]} targetQueue  - hàng đợi ô liền kề cần ưu tiên
 * @returns {{ row: number, col: number } | null}
 */
export function selectNormalAttackCell(board, targetQueue = []) {
    // Lọc ra các ô trong queue còn hợp lệ (chưa bị tấn công, trong bảng)
    const validQueue = targetQueue.filter(({row, col}) => validateCoordinate(row, col, board));

    if (validQueue.length > 0) {
        // Ưu tiên bắn ô đầu tiên trong queue hợp lệ
        return validQueue[0];
    }

    // Fallback: chọn ngẫu nhiên khi queue rỗng
    return selectRandomAttackCell(board);
}

/**
 * Hàm chính — chọn ô tấn công theo độ khó.
 *
 * @param {Cell[][]}  playerBoard
 * @param {object}    options
 * @param {'easy'|'normal'} options.difficulty       - độ khó hiện tại
 * @param {{ row: number, col: number }[]} [options.targetQueue]  - hàng đợi ô ưu tiên (Normal)
 * @returns {{ row: number, col: number }}
 * @throws {Error} khi không tìm thấy ô hợp lệ (game chưa kết thúc nhưng board đầy)
 */
export function selectAttackCell(playerBoard, {difficulty = 'easy', targetQueue = []} = {}) {
    try {
        let selected = null;

        if (difficulty === 'normal') {
            selected = selectNormalAttackCell(playerBoard, targetQueue);
        } else {
            // easy (mặc định): chọn ngẫu nhiên
            selected = selectRandomAttackCell(playerBoard);
        }

        if (!selected) {
            // Không tìm thấy ô hợp lệ — lỗi nghiêm trọng
            throw new Error('NO_VALID_CELL: Không còn ô hợp lệ để tấn công.');
        }

        // [4.1.2b] Trả về ô được chọn
        return selected;

    } catch (error) {
        // [4.3.1] Phát hiện lỗi khi chọn ô tấn công
        throw error;
    }
}