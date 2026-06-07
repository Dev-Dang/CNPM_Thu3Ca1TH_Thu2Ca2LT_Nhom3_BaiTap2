import {validateCoordinate} from './attackUtils.js';

//luong phu 4.5.2 dung de xac dinh cac o lan can
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

//4.1.2 random chon o bang funcition selectRandomAttackcell
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

export function selectNormalAttackCell(board, targetQueue = []) {
    // [4.2.1] Lọc các ô trong queue còn hợp lệ (chưa bị tấn công, nằm trong bảng)
    const validQueue = targetQueue.filter(({row, col}) => validateCoordinate(row, col, board));

    if (validQueue.length > 0) {
        // [4.2.2] Có ô hợp lệ → chọn ô đầu tiên (ô liền kề ưu tiên từ lần bắn trúng trước)
        return validQueue[0];
    }

    // [4.2.2] Queue rỗng → chọn ngẫu nhiên trong toàn bộ ô hợp lệ còn lại trên bảng
    return selectRandomAttackCell(board);
}

//4.1.2 chon o tan cong
export function selectAttackCell(playerBoard, {difficulty = 'easy', targetQueue = []} = {}) {
    try {
        let selected = null;

        if (difficulty === 'normal') {
            // [4.1.2 / Luồng thay thế 4.2] Normal: ưu tiên queue, fallback ngẫu nhiên
            selected = selectNormalAttackCell(playerBoard, targetQueue);
        } else {
            // [4.1.2 — Easy] Chọn ngẫu nhiên trong danh sách ô hợp lệ còn lại
            selected = selectRandomAttackCell(playerBoard);
        }

        if (!selected) {
            // [4.4.1] Không còn ô hợp lệ — lỗi trạng thái dữ liệu không nhất quán
            throw new Error('NO_VALID_CELL: Không còn ô hợp lệ để tấn công.');
        }

        // [4.2.3] Trả về ô được chọn → nhập lại bước 4.1.3 của luồng chính
        return selected;

    } catch (error) {
        // [4.4.1] Phát hiện lỗi khi chọn ô tấn công → ném lên cho GameBoard xử lý (4.4.2)
        throw error;
    }
}