import {createSlice} from '@reduxjs/toolkit';
import {PHASES, WINNER, CELL_STATE} from '../constants/gameConstants.js';
import {createBoard} from '../utils/boardUtils.js';
import {createFleet, validateFleetConfig} from '../utils/fleetConfig.js';
import {
    isValidPlacement,
    placeShipOnBoard,
    removeShipFromBoard,
    placeFleetRandomly,
} from '../utils/boardUtils.js';
import {
    validateCoordinate,
    processAttack,
    getCellAttackInfo,
    checkEndGame,
    markCell,
    markAllShipCells,
    SHIP_POINTS,
    calculateComboMultiplier,
} from '../utils/attackUtils.js';
import {getAdjacentTargets} from '../utils/computerLogic.js';

// 1.4a Trạng thái game ban đầu
const initialState = {
    phase: null,
    playerBoard: createBoard(),
    computerBoard: createBoard(),
    playerFleet: [],
    computerFleet: [],
    selectedShipId: null,
    winner: null,
    lastAttackResult: null,
    errorMessage: null,

    //Các state quản lý điểm và combo
    score: 0,
    comboStreak: 0,
    comboMultiplier: 1,
    lastScoreDelta: 0,

    // [UC-04 v2] Độ khó và trạng thái Hunt-and-Target của Máy tính
    difficulty: 'normal',                 // 'easy' | 'normal'
    computerTargetQueue: [],            // hàng đợi ô liền kề cần ưu tiên (Normal)
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        /**
         * UC-01: Khởi tạo ván chơi mới.
         */
        startGame(state) {
            try {
                // 1.4b gán PHASE = SETUP
                state.phase = PHASES.SETUP;
                state.error = null; // Reset lỗi nếu thành công

                // [2.E2.1] kiểm tra sizes = {5,4,3,3,2}
                validateFleetConfig();
            } catch (error) {
                // 1.E1.1 ERR Javascript runtime / Out of memory -> stateUpdated(error)
                state.error = "Không thể bắt đầu ván chơi. Vui lòng tải lại trang.";
                state.phase = null; // Reset state

                // [2.E2.1] error="FLEET_CONFIG_MISMATCH"
                // [2.E2.2] phase='ERROR', block + ghi log
                console.error('FLEET_CONFIG_MISMATCH', error.message);

                // [2.E2.2] phase='ERROR', block
                state.phase = PHASES.ERROR;

                // [2.E2.3] kết thúc không thành công
            }

            // 1.6 Kích hoạt UC-02 (phase = SETUP)
            // [2.1] createFleet(FLEET_CONFIG) → fleet[5]
            const playerFleet = createFleet();

            // [2.1] placeFleetRandomly(emptyBoard, fleet) → {computerBoard, computerFleet}
            const {board: computerBoard, fleet: computerFleet} = placeFleetRandomly(
                createBoard(),
                createFleet()
            );

            // [2.1] phase='SETUP', playerFleet, computerBoard
            state.phase = PHASES.SETUP;
            state.playerBoard = createBoard();
            state.computerBoard = computerBoard; // computerBoard — hidden from Player
            state.playerFleet = playerFleet;
            state.computerFleet = computerFleet;
            state.selectedShipId = null;
            state.winner = null;

            //Reset điểm số và combo
            state.score = 0;
            state.comboStreak = 0;
            state.comboMultiplier = 1;
            state.lastScoreDelta = 0;

            // [UC-04 v2] Reset trạng thái Máy tính — giữ nguyên difficulty đã chọn
            state.computerTargetQueue = [];

            // [2.2] store updated → useSelector re-render board 10×10 + fleet list
        },

        /**
         * [UC-04 v2] Đặt độ khó trước khi bắt đầu ván đấu.
         * Gọi trước startBattle (hoặc sau startGame).
         */
        setDifficulty(state, action) {
            // payload: 'easy' | 'normal'
            state.difficulty = action.payload;
        },

        /**
         * UC-02 — Bước 2.3 / 2.A1.1: Player chọn tàu.
         * - 2.3: chọn tàu chưa đặt
         * - 2.A1.1: chọn tàu đã đặt → reposition
         */
        selectShip(state, action) {
            // [2.4.1] dispatch(selectShip(shipId)) → bindSelectedShip, fleetPlaced+1
            state.selectedShipId = action.payload.shipId;
            // store updated → useSelector re-render (highlight tàu được chọn)
        },

        /**
         * UC-02 — Bước 2.4 → 2.7: Đặt tàu lên bảng.
         * Bao gồm cả luồng thay thế 2.A1 (reposition).
         */
        placeShip(state, action) {
            const { shipId, row, col, orientation } = action.payload;
            // [2.4] dispatch(placeShip(shipId, row, col, dir))

            const shipIndex = state.playerFleet.findIndex((s) => s.id === shipId);
            if (shipIndex === -1) return;

            const ship = state.playerFleet[shipIndex];

            // [2.A1.2] Nếu tàu đã đặt → removeShipFromBoard trước khi validate
            // (tái đặt — reposition: gỡ tàu khỏi vị trí cũ, ô trở về trống)
            let boardForValidation = state.playerBoard;
            if (ship.placed && ship.positions.length > 0) {
                boardForValidation = removeShipFromBoard(state.playerBoard, ship.positions);
            }

            // [2.5] isValidPlacement(board, row, col, size, dir) → boolean
            const valid = isValidPlacement(boardForValidation, row, col, ship.size, orientation);

            if (!valid) {
                // [2.E1.1] valid = false
                // [2.E1.2] phase='INVALID_PLACEMENT' → SetupBoard hiển thị error msg
                state.phase = PHASES.INVALID_PLACEMENT;
                // [2.E1.3] Player nhận msg → back to 2.4
                return;
            }

            // alt [valid = true]
            // [2.6] placeShipOnBoard(board, row, col, size, dir) → newBoard
            let newBoard = boardForValidation; // board đã remove ship cũ nếu reposition
            const { board: updatedBoard, positions } = placeShipOnBoard(
                newBoard,
                row,
                col,
                ship.size,
                orientation,
                shipId
            );

            // [2.6] show position → cập nhật board + ship.positions
            state.playerBoard = updatedBoard;
            state.playerFleet[shipIndex] = {
                ...ship,
                orientation,
                positions,
                placed: true,
            };

            // [2.7] selectedShipId = null
            state.selectedShipId = null;

            // Reset phase về SETUP (xoá INVALID_PLACEMENT nếu có)
            state.phase = PHASES.SETUP;
            // store updated → useSelector re-render
        },

        /**
         * UC-02 — Bước 2.9 / 2.10: Bắt đầu tấn công.
         */
        startBattle(state) {
            // [2.8] Guard: allPlaced = false → không làm gì
            const allPlaced = state.playerFleet.every((s) => s.placed);
            if (!allPlaced) return;

            // [2.10] phase='BATTLE' → ref UC-03
            state.phase = PHASES.PLAYER_TURN;
        },

        /**
         * UC-03: Player tấn công một ô trên bảng máy tính.
         */
        playerAttack(state, action) {
            const {row, col} = action.payload;
            // [3.1.3] / [3.6.2] Hệ thống kiểm tra ô đã chọn — xác nhận nằm trong bảng và chưa bị tấn công.
            if (!validateCoordinate(row, col, state.computerBoard)) {
                // [3.5.2] / [3.6.2] Luồng ngoại lệ: Ô đã bị tấn công hoặc ngoài giới hạn.
                // Không xử lý lượt bắn, hiển thị thông báo lỗi trực quan trên UI và giữ nguyên trạng thái ván chơi.
                state.errorMessage = 'Ô này đã bị tấn công. Vui lòng chọn ô khác.';
                return;
            }

            // Xóa thông báo lỗi cũ nếu tọa độ được chọn hoàn toàn hợp lệ
            state.errorMessage = null;
            // [3.1.4] / [3.2.1] / [3.3.1] Hệ thống xác định kết quả tấn công (Trượt, Trúng, hoặc Nhấn chìm)
            const {hasShip, ship, remainingCells} = getCellAttackInfo(
                row, col, state.computerBoard, state.computerFleet
            );

            let newBoard;
            if (!hasShip) {
                // [3.1.4] Ô không chứa tàu đối thủ → kết quả "Trượt" (Miss).
                state.lastAttackResult = 'miss';
                // [3.1.5] Đánh dấu ô vừa tấn công bằng ký hiệu Miss.
                newBoard = markCell(row, col, CELL_STATE.MISS, state.computerBoard);

                // Quy tắc combo: reset combo và hệ số nhân về mặc định khi bắn trượt
                state.comboStreak = 0;
                state.comboMultiplier = 1;
                state.lastScoreDelta = 0;

                state.computerBoard = newBoard;

                // Chuyển lượt sang máy (BR-16 / US-14)
                state.phase = PHASES.CPU_TURN;
            } else {
                // [3.2.1] Ô chứa tàu đối thủ. Đánh dấu Hit tạm thời.
                newBoard = markCell(row, col, CELL_STATE.HIT, state.computerBoard);
                // Cập nhật số lần trúng đạn (hitCount) vào thông tin hạm đội của Máy tính
                const shipIndex = state.computerFleet.findIndex((s) => s.id === ship.id);
                if (shipIndex !== -1) state.computerFleet[shipIndex].hitCount += 1;

                //Tăng combo bắn trúng và tính hệ số nhân combo
                state.comboStreak +=1;
                state.comboMultiplier = calculateComboMultiplier(state.comboStreak);

                //Tính điểm nền của loại tàu vừa bắn trúng nhân hệ số combo
                const basePoints = SHIP_POINTS[ship.id] || 0;
                let currentTurnScore = basePoints * state.comboMultiplier;

                // KIỂM TRA TRƯỜNG HỢP A: LUỒNG THAY THẾ 3.3 — NHẤN CHÌM TÀU (SUNK)
                if (remainingCells === 0) {
                    // [3.3.1] Đây là ô cuối cùng chưa bị tấn công của tàu đó → kết quả "Nhấn chìm" (Sunk).
                    state.lastAttackResult = 'sunk';
                    // [3.3.2] Đánh dấu toàn bộ ô của tàu bị nhấn chìm đồng loạt bằng ký hiệu Sunk.
                    newBoard = markAllShipCells(ship, newBoard);
                    // Cộng thêm +50 điểm thưởng vì đã hạ thành công một con tàu đối thủ
                    currentTurnScore += 50;
                }
                // KIỂM TRA TRƯỜNG HỢP B: LUỒNG THAY THẾ 3.2 — TẤN CÔNG TRÚNG, TÀU CHƯA CHÌM (HIT)
                else {
                    // [3.2.1] Tàu còn ít nhất một ô khác chưa bị tấn công → kết quả "Trúng" (Hit).
                    state.lastAttackResult = 'hit';
                    // [3.2.2] Đánh dấu ô vừa tấn công bằng ký hiệu Hit.
                }

                // Cập nhật điểm số tổng và lưu lượng điểm thay đổi (delta) của lượt này vào state hệ thống
                state.score = (state.score || 0) + currentTurnScore;
                state.lastScoreDelta = currentTurnScore;
                state.computerBoard = newBoard;
            }
            // [3.1.6] / [3.4.1] Kiểm tra điều kiện kết thúc ván.
            state.computerBoard = newBoard;
            // [3.1.6] Hệ thống thực hiện gọi hàm kiểm tra điều kiện kết thúc ván chơi.
            if (checkEndGame(state.computerFleet, newBoard)) {
                // [3.4.1] Xác định toàn bộ tàu đối thủ đã bị nhấn chìm.
                // [3.4.2] Kích hoạt UC-05 với kết quả Player thắng.
                state.phase = PHASES.GAME_OVER;
                state.winner = WINNER.PLAYER;

                // Cộng thêm +100 điểm thưởng chiến thắng ván đấu cho người chơi
                state.score += 100;
                state.lastScoreDelta += 100;
            } else if (
                state.difficulty === 'normal' &&
                (state.lastAttackResult === 'hit' || state.lastAttackResult === 'sunk')
            ) {
                // [UC-04 v2 / RUL-07] Normal + bắn trúng → giữ lượt Player, bắn tiếp
                state.phase = PHASES.PLAYER_TURN;
            } else {
                // [3.1.6] Còn ít nhất một tàu đối thủ chưa bị nhấn chìm → chưa kết thúc.
                // [3.1.7] Vô hiệu hóa bảng đối thủ. Chuyển sang lượt Máy tính, kích hoạt UC-04.
                state.phase = PHASES.CPU_TURN;
            }
        },

        // ── Xóa thông báo lỗi ────────────────────────────────────────────────────
        clearError(state) {
            state.errorMessage = null;
        },

        /**
         * UC-04 v2: Máy tính tấn công một ô trên bảng Player.
         *
         * Thay đổi so với v1:
         * - Normal + hit/sunk → giữ phase = CPU_TURN (bắn tiếp, RUL-07 / BR-16)
         * - Easy hoặc Normal miss → chuyển phase = PLAYER_TURN
         * - Normal: cập nhật computerTargetQueue sau khi hit (thêm ô liền kề)
         * - Normal: loại ô vừa bắn ra khỏi queue dù kết quả nào
         */
        computerAttack(state, action) {
            const {row, col} = action.payload;

            // [4.1.3b] Xử lý logic lượt tấn công
            const attack = processAttack(state.playerBoard, state.playerFleet, row, col);

            // [4.1.3d] Cập nhật trạng thái
            state.playerBoard = attack.board;
            state.playerFleet = attack.fleet;

            // [UC-04 v2] Loại ô vừa bắn ra khỏi queue (dù trúng hay trượt)
            state.computerTargetQueue = state.computerTargetQueue.filter(
                (cell) => !(cell.row === row && cell.col === col)
            );

            // [UC-04 v2] Cập nhật computerTargetQueue cho Normal (Hunt-and-Target)
            if (state.difficulty === 'normal') {
                if (attack.result === 'hit' || attack.result === 'sunk') {
                    // Thêm các ô liền kề hợp lệ quanh ô vừa bắn trúng vào queue
                    const adjacents = getAdjacentTargets(row, col, attack.board);
                    adjacents.forEach((adj) => {
                        const alreadyQueued = state.computerTargetQueue.some(
                            (cell) => cell.row === adj.row && cell.col === adj.col
                        );
                        if (!alreadyQueued) {
                            state.computerTargetQueue.push(adj);
                        }
                    });
                }
                // miss: không thêm target mới, queue giữ nguyên (có thể vẫn còn từ hit trước)
            }

            // [4.1.4a] Kiểm tra điều kiện kết thúc ván
            if (attack.isGameOver) {
                // [4.2.1] Xác định toàn bộ tàu `Player` đã bị nhấn chìm
                // → Cập nhật trạng thái mới
                state.phase = PHASES.GAME_OVER;
                state.winner = WINNER.COMPUTER;

                // [4.2.3] Kích hoạt UC-05 với kết quả `Player` thua
            } else if (
                state.difficulty === 'normal' &&
                (attack.result === 'hit' || attack.result === 'sunk')
            ) {
                // [UC-04 v2 / RUL-07] Normal + bắn trúng → tiếp tục lượt, giữ CPU_TURN
                state.phase = PHASES.CPU_TURN;
            } else {
                // [4.1.4b] Cập nhật trạng thái mới (Easy bất kể kết quả; Normal miss)
                state.phase = PHASES.PLAYER_TURN;

                // [4.1.6] Kích hoạt UC-03
            }
        },

        /**
         * UC-05: Chơi lại — reset toàn bộ về trạng thái ban đầu.
         */
        restartGame() {
            // TODO: UC-05 — Implement
        },
    },
});

export const {
    startGame,
    setDifficulty,
    setGameError,
    selectShip,
    placeShip,
    startBattle,
    playerAttack,
    computerAttack,
    restartGame,
    addError,
    clearError,
} = gameSlice.actions;

export default gameSlice.reducer;
