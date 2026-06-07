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

    //thêm độ khó vào
    difficulty: null,//thêm trạng thái mới
    computerTargetQueue: [],
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        /**
         * UC-01: Khởi tạo ván chơi mới.
         */
        startGame(state,action) {
            try {
                // [1.1.6] Hệ thống gọi startGame, khởi tạo ván chơi mới
                state.phase = PHASES.SETUP;// [1.1.8] Chuyển giai đoạn thiết lập (UC-02)
                state.errorMessage = null; // Reset lỗi nếu thành công
                state.selectedShipId = null; // Reset tàu được chọn
                state.winner = null; // Reset người thắng
                state.lastAttackResult = null; // Reset kết quả tấn công cuối cùng

                const difficulty = getDifficultyById(action.payload);
                state.difficulty = difficulty.id; //lấy độ khó từ giao diện


                // [2.1.1d] Khởi tạo hạm đội Máy tính, Player theo cấu hình của độ khó đã chọn
                // và thiết lập bố cục ngẫu nhiên cho hạm đội Máy tính.
                const boardSize = difficulty.boardSize;
                state.boardSize = boardSize;

                const {board: computerBoard, fleet: computerFleet} = placeFleetRandomly(
                    createBoard(boardSize),
                    createFleet(difficulty)
                );
                state.computerBoard = computerBoard;
                state.computerFleet = computerFleet;

                state.playerBoard = createBoard(boardSize);
                state.playerFleet = createFleet(difficulty);

                // Reset điểm số và combo
                state.score = 0;
                state.comboStreak = 0;
                state.comboMultiplier = 1;
                state.lastScoreDelta = 0;
            } catch (error) {
                // [1.4.1] Phát hiện lỗi khởi tạo
                // [2.6.1a] Hiển thị lỗi setup và dừng khởi tạo ván chơi.
                state.errorMessage = "Không thể bắt đầu ván chơi. Vui lòng tải lại trang.";
                // [1.4.2] Hiển thị thông báo lỗi (thông qua UI đọc state.phase)
                state.phase = PHASES.ERROR;
                state.difficulty = null; // Reset độ khó khi có lỗi
                console.error('FLEET_CONFIG_MISMATCH', error.message);
                // [1.4.3] Kết thúc không thành công (không gọi UC-02)
                // [2.6.2] Kết thúc thất bại.
                return;
            }
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
         * UC-02 — Bước 2.2.2 / 2.3.1: Player chọn tàu.
         * - 2.2.2: chọn tàu chưa đặt
         * - 2.3.1: chọn tàu đã đặt để điều chỉnh
         */
        selectShip(state, action) {
            // [2.3.2] Lưu tàu đang được chọn để giao diện highlight và cho phép điều chỉnh.
            state.selectedShipId = action.payload.shipId;
            // store updated → useSelector re-render (highlight tàu được chọn)
        },

        /**
         * UC-02 — Bước 2.2.3 → 2.2.6: Đặt tàu lên bảng.
         * Bao gồm cả AF1 2.3 khi điều chỉnh tàu đã đặt.
         */
        placeShip(state, action) {
            // [2.2.2d] Nhận yêu cầu đặt hoặc điều chỉnh tàu từ SetupBoard.
            const { shipId, row, col, orientation } = action.payload;

            // [2.2.3a] Chỉ cho phép đặt hoặc điều chỉnh tàu trong giai đoạn setup.
            if (state.phase !== PHASES.SETUP && state.phase !== PHASES.INVALID_PLACEMENT) return;

            const shipIndex = state.playerFleet.findIndex((s) => s.id === shipId);
            if (shipIndex === -1) return;

            const ship = state.playerFleet[shipIndex];

            // [2.2.3b] Nếu tàu đã đặt, gỡ vị trí cũ khỏi board tạm trước khi validate.
            let boardForValidation = state.playerBoard;
            if (ship.placed && ship.positions.length > 0) {
                boardForValidation = removeShipFromBoard(state.playerBoard, ship.positions);
            }

            // [2.2.3c] Kiểm tra vị trí hợp lệ
            // — tàu nằm hoàn toàn trong bảng, không chồng ô với tàu đã đặt, không đặt chéo.
            const valid = isValidPlacement(boardForValidation, row, col, ship.size, orientation);

            if (!valid) {
                // [2.5.1] Giữ nguyên bố cục hợp lệ gần nhất khi vị trí không hợp lệ.
                state.errorMessage = 'Vị trí không hợp lệ. Vui lòng chọn vị trí khác.';
                // [2.5.2] Chuyển phase để giao diện hiển thị thông báo lỗi.
                state.phase = PHASES.INVALID_PLACEMENT;
                return;
            }

            // [2.2.4] Ghi nhận vị trí hợp lệ vào bố cục hạm đội Player.
            let newBoard = boardForValidation; // board đã remove ship cũ nếu reposition
            const { board: updatedBoard, positions } = placeShipOnBoard(
                newBoard,
                row,
                col,
                ship.size,
                orientation,
                shipId
            );

            // [2.2.5] Cập nhật trạng thái tàu vừa đặt thành đã đặt.
            state.playerBoard = updatedBoard;
            state.playerFleet[shipIndex] = {
                ...ship,
                orientation,
                positions,
                placed: true,
            };

            // Reset phase về SETUP (xoá errorMessage, INVALID_PLACEMENT nếu có)
            state.phase = PHASES.SETUP;
            state.selectedShipId = shipId;
            state.errorMessage = null;
            // store updated → useSelector re-render
        },

        /**
         * UC-02 — AF2: Đặt tàu tự động.
         */
        autoPlacePlayerFleet(state) {
            if (state.phase !== PHASES.SETUP && state.phase !== PHASES.INVALID_PLACEMENT) return;

            try {
                // [2.4.2] Xóa bố cục hạm đội Player hiện tại.
                const emptyBoard = createBoard(state.boardSize);

                // [2.4.3] Tạo ngẫu nhiên vị trí và hướng đặt tàu hợp lệ
                // cho toàn bộ hạm đội của Player theo độ khó đã chọn.
                const {board: autoBoard, fleet: autoFleet} = placeFleetRandomly(
                    emptyBoard,
                    resetFleet(state.playerFleet)
                );

                // [2.4.4] Cập nhật bố cục hạm đội Player theo kết quả đặt tự động.
                state.playerBoard = autoBoard;
                state.playerFleet = autoFleet;

                // Reset trạng thái liên quan đến chọn tàu và lỗi setup
                state.selectedShipId = null;
                state.errorMessage = null;
                state.phase = PHASES.SETUP;
            } catch (error) {
                // [2.6.1a] Hiển thị lỗi setup nếu hệ thống không thể tạo bố cục hợp lệ.
                state.errorMessage = 'Lỗi thiết lập hạm đội. Vui lòng tải lại trang.';
                state.phase = PHASES.ERROR;
                console.error('FLEET_RANDOM_PLACEMENT_FAILED', error.message);
            }
        },

        /**
         * UC-02 — Bước 2.1.7 / 2.1.8: Bắt đầu tấn công.
         */
        startBattle(state) {
            // [2.1.4] Guard: chưa đặt đủ hạm đội thì không chuyển phase.
            const allPlaced = state.playerFleet.every((s) => s.placed);
            if (!allPlaced) return;

            // [2.1.8c] Chuyển sang giai đoạn tấn công, kích hoạt UC-03.
            state.phase = PHASES.PLAYER_TURN;
            state.errorMessage = null;
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
                const basePoints = SHIP_POINTS[ship.type] || SHIP_POINTS[ship.id] || 0;
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

        setGameError(state, action) {
            state.errorMessage = action.payload;
            state.phase = PHASES.ERROR;
        },

        /**
         * [UC-04] Máy tính tấn công một ô trên bảng Player.
         *
         * Luồng chính  : 4.1.3 → 4.1.4 → [4.5] → 4.1.5 → 4.1.6
         * Luồng thay thế 4.5 (Normal): cập nhật computerTargetQueue sau bước 4.1.4.
         * Luồng thay thế 4.3 (end-game): kích hoạt UC-05 khi isGameOver = true.
         * RUL-07: Hit hoặc Sunk → giữ lượt Máy tính (cả Easy lẫn Normal).
         *         Miss           → chuyển lượt sang Player.
         */
        computerAttack(state, action) {
            const {row, col} = action.payload;

            // [4.1.3] Xử lý lượt tấn công, xác định kết quả và cập nhật trạng thái board
            const attack = processAttack(state.playerBoard, state.playerFleet, row, col);

            // [4.1.4] Cập nhật board và fleet của Player theo kết quả vừa xử lý
            state.playerBoard = attack.board;
            state.playerFleet = attack.fleet;

            // [4.5.1] Loại ô vừa bắn ra khỏi computerTargetQueue (dù kết quả là Miss, Hit hay Sunk)
            state.computerTargetQueue = state.computerTargetQueue.filter(
                (cell) => !(cell.row === row && cell.col === col)
            );

            // [4.5 — Normal only] Cập nhật computerTargetQueue sau bước 4.1.4
            if (state.difficulty === 'normal') {
                if (attack.result === 'hit' || attack.result === 'sunk') {
                    // [4.5.2] Hit hoặc Sunk: bổ sung các ô liền kề hợp lệ vào queue
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
                // [4.5.2] Miss: không thêm ô mới, giữ nguyên queue
            }

            // [4.1.5] Kiểm tra điều kiện kết thúc ván
            if (attack.isGameOver) {
                // [4.3.1] Toàn bộ tàu Player đã bị nhấn chìm
                // [4.3.2] Kích hoạt UC-05 với kết quả Player thua
                state.phase = PHASES.GAME_OVER;
                state.winner = WINNER.COMPUTER;

            } else if (
                attack.result === 'hit' ||
                attack.result === 'sunk'
            ) {
                // [4.1.6 / RUL-07] Hit hoặc Sunk và ván chưa kết thúc → giữ lượt Máy tính, bắn tiếp
                state.phase = PHASES.CPU_TURN;
            } else {
                // [4.1.6] Miss → chuyển sang lượt Player, kích hoạt UC-03
                state.phase = PHASES.PLAYER_TURN;
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
    autoPlacePlayerFleet,
    startBattle,
    playerAttack,
    computerAttack,
    restartGame,
    clearError,
} = gameSlice.actions;

export default gameSlice.reducer;
