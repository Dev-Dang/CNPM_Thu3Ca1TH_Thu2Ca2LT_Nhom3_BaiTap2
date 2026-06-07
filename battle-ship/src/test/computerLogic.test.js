import { describe, test, expect } from 'vitest';

import {
    getAdjacentTargets,
    selectRandomAttackCell,
    selectNormalAttackCell,
    selectAttackCell,
} from '../utils/computerLogic.js';

import { CELL_STATE } from '../constants/gameConstants.js';

function createTestBoard() {
    return Array.from({ length: 10 }, (_, row) =>
        Array.from({ length: 10 }, (_, col) => ({
            row,
            col,
            state: CELL_STATE.EMPTY,
            shipId: null,
        }))
    );
}

describe('computerLogic.js - Unit Testing', () => {
    describe('getAdjacentTargets()', () => {
        test('trả về các ô liền kề hợp lệ ở giữa bảng', () => {
            const board = createTestBoard();

            const result = getAdjacentTargets(5, 5, board);

            expect(result).toHaveLength(4);
            expect(result).toEqual(
                expect.arrayContaining([
                    { row: 4, col: 5 },
                    { row: 6, col: 5 },
                    { row: 5, col: 4 },
                    { row: 5, col: 6 },
                ])
            );
        });

        test('trả về 2 ô hợp lệ nếu ô nằm ở góc trên trái', () => {
            const board = createTestBoard();

            const result = getAdjacentTargets(0, 0, board);

            expect(result).toHaveLength(2);
            expect(result).toEqual(
                expect.arrayContaining([
                    { row: 1, col: 0 },
                    { row: 0, col: 1 },
                ])
            );
        });

        test('không trả về ô đã bị HIT, MISS hoặc SUNK', () => {
            const board = createTestBoard();

            board[4][5].state = CELL_STATE.HIT;
            board[6][5].state = CELL_STATE.MISS;
            board[5][4].state = CELL_STATE.SUNK;

            const result = getAdjacentTargets(5, 5, board);

            expect(result).toHaveLength(1);
            expect(result).toEqual([{ row: 5, col: 6 }]);
        });
    });

    describe('selectRandomAttackCell()', () => {
        test('trả về một ô hợp lệ khi board còn ô chưa bị tấn công', () => {
            const board = createTestBoard();

            const result = selectRandomAttackCell(board);

            expect(result).not.toBeNull();
            expect(result.row).toBeGreaterThanOrEqual(0);
            expect(result.row).toBeLessThan(10);
            expect(result.col).toBeGreaterThanOrEqual(0);
            expect(result.col).toBeLessThan(10);
        });

        test('không chọn ô đã bị HIT, MISS hoặc SUNK', () => {
            const board = createTestBoard();

            board.forEach((rowArr) =>
                rowArr.forEach((cell) => {
                    cell.state = CELL_STATE.HIT;
                })
            );

            board[3][4].state = CELL_STATE.EMPTY;

            const result = selectRandomAttackCell(board);

            expect(result).toEqual({ row: 3, col: 4 });
        });

        test('trả về null nếu không còn ô hợp lệ', () => {
            const board = createTestBoard();

            board.forEach((rowArr) =>
                rowArr.forEach((cell) => {
                    cell.state = CELL_STATE.MISS;
                })
            );

            const result = selectRandomAttackCell(board);

            expect(result).toBeNull();
        });
    });

    describe('selectNormalAttackCell()', () => {
        test('ưu tiên chọn ô đầu tiên hợp lệ trong targetQueue', () => {
            const board = createTestBoard();

            const targetQueue = [
                { row: 2, col: 2 },
                { row: 3, col: 3 },
            ];

            const result = selectNormalAttackCell(board, targetQueue);

            expect(result).toEqual({ row: 2, col: 2 });
        });

        test('bỏ qua ô không hợp lệ trong targetQueue và chọn ô hợp lệ tiếp theo', () => {
            const board = createTestBoard();

            board[2][2].state = CELL_STATE.HIT;

            const targetQueue = [
                { row: 2, col: 2 },
                { row: 3, col: 3 },
            ];

            const result = selectNormalAttackCell(board, targetQueue);

            expect(result).toEqual({ row: 3, col: 3 });
        });

        test('fallback random nếu targetQueue rỗng', () => {
            const board = createTestBoard();

            const result = selectNormalAttackCell(board, []);

            expect(result).not.toBeNull();
            expect(result.row).toBeGreaterThanOrEqual(0);
            expect(result.row).toBeLessThan(10);
            expect(result.col).toBeGreaterThanOrEqual(0);
            expect(result.col).toBeLessThan(10);
        });

        test('fallback random nếu toàn bộ targetQueue không hợp lệ', () => {
            const board = createTestBoard();

            board[1][1].state = CELL_STATE.HIT;
            board[2][2].state = CELL_STATE.MISS;

            const targetQueue = [
                { row: 1, col: 1 },
                { row: 2, col: 2 },
            ];

            board.forEach((rowArr) =>
                rowArr.forEach((cell) => {
                    cell.state = CELL_STATE.HIT;
                })
            );

            board[9][9].state = CELL_STATE.EMPTY;

            const result = selectNormalAttackCell(board, targetQueue);

            expect(result).toEqual({ row: 9, col: 9 });
        });
    });

    describe('selectAttackCell()', () => {
        test('difficulty easy thì chọn random attack cell', () => {
            const board = createTestBoard();

            const result = selectAttackCell(board, { difficulty: 'easy' });

            expect(result).not.toBeNull();
            expect(result.row).toBeGreaterThanOrEqual(0);
            expect(result.row).toBeLessThan(10);
            expect(result.col).toBeGreaterThanOrEqual(0);
            expect(result.col).toBeLessThan(10);
        });

        test('difficulty normal thì ưu tiên targetQueue hợp lệ', () => {
            const board = createTestBoard();

            const result = selectAttackCell(board, {
                difficulty: 'normal',
                targetQueue: [{ row: 4, col: 4 }],
            });

            expect(result).toEqual({ row: 4, col: 4 });
        });

        test('không truyền options thì mặc định là easy', () => {
            const board = createTestBoard();

            const result = selectAttackCell(board);

            expect(result).not.toBeNull();
            expect(result.row).toBeGreaterThanOrEqual(0);
            expect(result.row).toBeLessThan(10);
            expect(result.col).toBeGreaterThanOrEqual(0);
            expect(result.col).toBeLessThan(10);
        });

        test('ném lỗi nếu không còn ô hợp lệ', () => {
            const board = createTestBoard();

            board.forEach((rowArr) =>
                rowArr.forEach((cell) => {
                    cell.state = CELL_STATE.SUNK;
                })
            );

            expect(() => selectAttackCell(board)).toThrow(
                'NO_VALID_CELL: Không còn ô hợp lệ để tấn công.'
            );
        });
    });
});