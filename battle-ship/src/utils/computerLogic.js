import {validateCoordinate} from './attackUtils.js';

/**
 * Chọn một ô ngẫu nhiên trên Player Board
 *
 * @param {Cell[][]} playerBoard
 * @returns {{ row: number, col: number }}
 */
export function selectAttackCell(playerBoard) {
    try {
        // Tạo mảng chứa danh sách cell hợp lệ
        const available = [];

        playerBoard.forEach((rowArr) =>
            rowArr.forEach((cell) => {
                // Kiểm tra tính hợp lệ của cell
                if (validateCoordinate(cell.row, cell.col, playerBoard)) {
                    // Thêm cell vào danh sách chờ
                    available.push({row: cell.row, col: cell.col});
                }
            })
        );

        // Lựa chọn ngẫu nhiên 1 cell từ danh sách hợp lệ
        const index = Math.floor(Math.random() * available.length);
        const selectedCell = available[index];

        // [4.1.2b] Trả về ô được chọn theo logic cơ bản
        return selectedCell;

    } catch (error) {
        // [4.3.1] Phát hiện lỗi khi chọn ô tấn công
        throw error;
    }
}