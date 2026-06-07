import { describe, test, expect } from 'vitest';
import {
    validateCoordinate,
    getCellAttackInfo,
    markCell,
    markAllShipCells,
    checkEndGame,
    processAttack,
    calculateComboMultiplier,
} from '../utils/attackUtils.js';

import {CELL_STATE} from '../constants/gameConstants.js';

function createTestBoard() {
    return Array.from({length: 10}, (_, row) =>
        Array.from({length: 10}, (_, col) => ({
            row,
            col,
            state: CELL_STATE.EMPTY,
            shipId: null,
        }))
    );
}

function createTestFleet() {
    return [
        {
            id: 'destroyer',
            name: 'Destroyer',
            size: 2,
            hitCount: 0,
            placed: true,
            positions: [
                {row: 0, col: 0},
                {row: 0, col: 1},
            ],
        },
        {
            id: 'submarine',
            name: 'Submarine',
            size: 3,
            hitCount: 0,
            placed: true,
            positions: [
                {row: 2, col: 0},
                {row: 2, col: 1},
                {row: 2, col: 2},
            ],
        },
    ];
}

function placeFleetOnBoard(board, fleet) {
    const newBoard = board.map((r) => r.map((c) => ({...c})));

    fleet.forEach((ship) => {
        ship.positions.forEach(({row, col}) => {
            newBoard[row][col] = {
                ...newBoard[row][col],
                shipId: ship.id,
            };
        });
    });

    return newBoard;
}

describe('attackUtils.js - Unit Testing', () => {
    describe('validateCoordinate()', () => {
        test('trả về true nếu tọa độ hợp lệ và ô chưa bị tấn công', () => {
            const board = createTestBoard();

            expect(validateCoordinate(0, 0, board)).toBe(true);
            expect(validateCoordinate(5, 5, board)).toBe(true);
            expect(validateCoordinate(9, 9, board)).toBe(true);
        });

        test('trả về false nếu tọa độ nằm ngoài bảng', () => {
            const board = createTestBoard();

            expect(validateCoordinate(-1, 0, board)).toBe(false);
            expect(validateCoordinate(0, -1, board)).toBe(false);
            expect(validateCoordinate(10, 0, board)).toBe(false);
            expect(validateCoordinate(0, 10, board)).toBe(false);
        });

        test('trả về false nếu ô đã là HIT', () => {
            const board = createTestBoard();
            board[0][0].state = CELL_STATE.HIT;

            expect(validateCoordinate(0, 0, board)).toBe(false);
        });

        test('trả về false nếu ô đã là MISS', () => {
            const board = createTestBoard();
            board[0][0].state = CELL_STATE.MISS;

            expect(validateCoordinate(0, 0, board)).toBe(false);
        });

        test('trả về false nếu ô đã là SUNK', () => {
            const board = createTestBoard();
            board[0][0].state = CELL_STATE.SUNK;

            expect(validateCoordinate(0, 0, board)).toBe(false);
        });
    });

    describe('getCellAttackInfo()', () => {
        test('trả về hasShip false nếu ô không có tàu', () => {
            const board = createTestBoard();
            const fleet = createTestFleet();

            const result = getCellAttackInfo(5, 5, board, fleet);

            expect(result).toEqual({
                hasShip: false,
                ship: null,
                remainingCells: 0,
            });
        });

        test('trả về thông tin tàu nếu ô có tàu', () => {
            const fleet = createTestFleet();
            const board = placeFleetOnBoard(createTestBoard(), fleet);

            const result = getCellAttackInfo(0, 0, board, fleet);

            expect(result.hasShip).toBe(true);
            expect(result.ship.id).toBe('destroyer');
            expect(result.remainingCells).toBe(1);
        });

        test('remainingCells = 0 nếu bắn vào ô cuối cùng chưa bị bắn của tàu', () => {
            const fleet = createTestFleet();
            let board = placeFleetOnBoard(createTestBoard(), fleet);

            board[0][0].state = CELL_STATE.HIT;

            const result = getCellAttackInfo(0, 1, board, fleet);

            expect(result.hasShip).toBe(true);
            expect(result.ship.id).toBe('destroyer');
            expect(result.remainingCells).toBe(0);
        });
    });

    describe('markCell()', () => {
        test('đánh dấu ô thành MISS', () => {
            const board = createTestBoard();

            const newBoard = markCell(1, 1, CELL_STATE.MISS, board);

            expect(newBoard[1][1].state).toBe(CELL_STATE.MISS);
        });

        test('đánh dấu ô thành HIT', () => {
            const board = createTestBoard();

            const newBoard = markCell(2, 2, CELL_STATE.HIT, board);

            expect(newBoard[2][2].state).toBe(CELL_STATE.HIT);
        });

        test('không làm thay đổi board gốc', () => {
            const board = createTestBoard();

            const newBoard = markCell(3, 3, CELL_STATE.HIT, board);

            expect(board[3][3].state).toBe(CELL_STATE.EMPTY);
            expect(newBoard[3][3].state).toBe(CELL_STATE.HIT);
        });
    });

    describe('markAllShipCells()', () => {
        test('đánh dấu toàn bộ vị trí tàu thành SUNK', () => {
            const fleet = createTestFleet();
            const board = placeFleetOnBoard(createTestBoard(), fleet);
            const ship = fleet[0];

            const newBoard = markAllShipCells(ship, board);

            expect(newBoard[0][0].state).toBe(CELL_STATE.SUNK);
            expect(newBoard[0][1].state).toBe(CELL_STATE.SUNK);
        });

        test('không làm thay đổi các ô không thuộc tàu', () => {
            const fleet = createTestFleet();
            const board = placeFleetOnBoard(createTestBoard(), fleet);
            const ship = fleet[0];

            const newBoard = markAllShipCells(ship, board);

            expect(newBoard[5][5].state).toBe(CELL_STATE.EMPTY);
        });
    });

    describe('checkEndGame()', () => {
        test('trả về false nếu vẫn còn tàu chưa chìm', () => {
            const fleet = createTestFleet();
            const board = placeFleetOnBoard(createTestBoard(), fleet);

            expect(checkEndGame(fleet, board)).toBe(false);
        });

        test('trả về true nếu tất cả tàu đều SUNK', () => {
            const fleet = createTestFleet();
            let board = placeFleetOnBoard(createTestBoard(), fleet);

            fleet.forEach((ship) => {
                ship.positions.forEach(({row, col}) => {
                    board[row][col].state = CELL_STATE.SUNK;
                });
            });

            expect(checkEndGame(fleet, board)).toBe(true);
        });
    });

    describe('processAttack()', () => {
        test('trả về miss nếu bắn vào ô không có tàu', () => {
            const fleet = createTestFleet();
            const board = placeFleetOnBoard(createTestBoard(), fleet);

            const result = processAttack(board, fleet, 5, 5);

            expect(result.result).toBe('miss');
            expect(result.board[5][5].state).toBe(CELL_STATE.MISS);
            expect(result.isGameOver).toBe(false);
        });

        test('trả về hit nếu bắn trúng tàu nhưng chưa chìm', () => {
            const fleet = createTestFleet();
            const board = placeFleetOnBoard(createTestBoard(), fleet);

            const result = processAttack(board, fleet, 0, 0);

            expect(result.result).toBe('hit');
            expect(result.board[0][0].state).toBe(CELL_STATE.HIT);
            expect(result.fleet[0].hitCount).toBe(1);
            expect(result.isGameOver).toBe(false);
        });

        test('trả về sunk nếu bắn vào ô cuối cùng của tàu', () => {
            const fleet = createTestFleet();
            let board = placeFleetOnBoard(createTestBoard(), fleet);

            board[0][0].state = CELL_STATE.HIT;
            fleet[0].hitCount = 1;

            const result = processAttack(board, fleet, 0, 1);

            expect(result.result).toBe('sunk');
            expect(result.board[0][0].state).toBe(CELL_STATE.SUNK);
            expect(result.board[0][1].state).toBe(CELL_STATE.SUNK);
            expect(result.fleet[0].hitCount).toBe(2);
        });

        test('isGameOver = true nếu bắn chìm tàu cuối cùng', () => {
            const fleet = [
                {
                    id: 'destroyer',
                    name: 'Destroyer',
                    size: 2,
                    hitCount: 1,
                    placed: true,
                    positions: [
                        {row: 0, col: 0},
                        {row: 0, col: 1},
                    ],
                },
            ];

            let board = placeFleetOnBoard(createTestBoard(), fleet);
            board[0][0].state = CELL_STATE.HIT;

            const result = processAttack(board, fleet, 0, 1);

            expect(result.result).toBe('sunk');
            expect(result.isGameOver).toBe(true);
        });
    });

    describe('calculateComboMultiplier()', () => {
        test('streak <= 1 thì hệ số là 1', () => {
            expect(calculateComboMultiplier(0)).toBe(1);
            expect(calculateComboMultiplier(1)).toBe(1);
        });

        test('streak = 2 thì hệ số là 2', () => {
            expect(calculateComboMultiplier(2)).toBe(2);
        });

        test('streak >= 3 thì hệ số là 3', () => {
            expect(calculateComboMultiplier(3)).toBe(3);
            expect(calculateComboMultiplier(4)).toBe(3);
            expect(calculateComboMultiplier(10)).toBe(3);
        });
    });
});