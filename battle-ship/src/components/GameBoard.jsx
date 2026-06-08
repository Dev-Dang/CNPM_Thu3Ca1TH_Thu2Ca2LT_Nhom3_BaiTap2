/* eslint-disable no-unused-vars */
import {useAppDispatch, useAppSelector} from '../store/index.js';
import {playerAttack, clearError, computerAttack} from '../store/gameSlice';
import {DELAY_MS, PHASES} from '../constants/gameConstants';
import Grid from './Grid.jsx';
import {useEffect, useState} from "react";
import {selectAttackCell} from "../utils/computerLogic.js";
import ShipList from "./ShipList.jsx";
import AttackToast from "./AttackToast.jsx"
import '../styles/game-board.css';
import '../styles/error.css';

export default function GameBoard() {
    const [errorMsg, setErrorMsg] = useState(null);
    const dispatch = useAppDispatch();

    // [4.1.1] Nhận trạng thái từ hệ thống để xác định lượt hiện tại và dữ liệu bảng
    // difficulty và computerTargetQueue dùng cho bước 4.1.2 (chọn ô theo độ khó)
    const {phase, playerBoard, playerFleet, computerBoard, computerFleet, lastAttackResult,
        difficulty, computerTargetQueue} =
        useAppSelector((state) => state.game);

    // [4.1.1] Nhận lượt từ hệ thống; bắt đầu xử lý lượt tấn công khi phase = CPU_TURN
    useEffect(() => {
        if (phase !== PHASES.CPU_TURN) return;

        const timer = setTimeout(() => {
            let cell = null;
            try {
                // [4.1.2] Chọn ô tấn công theo độ khó đang áp dụng
                // Normal truyền thêm computerTargetQueue để thực hiện Hunt-and-Target (Luồng thay thế 4.2)
                cell = selectAttackCell(playerBoard, {
                    difficulty,
                    targetQueue: computerTargetQueue,
                });
            } catch (error) {
                // [4.4.1 → 4.4.2] Phát hiện lỗi khi chọn ô → hiển thị thông báo lỗi
                setErrorMsg("Kết quả lượt chơi gặp lỗi. Vui lòng tải lại trang.");
            }

            if (cell)
                // [4.1.3] Gửi ô đã chọn để hệ thống xử lý lượt tấn công
                dispatch(computerAttack({row: cell.row, col: cell.col}));

        }, DELAY_MS);

        return () => clearTimeout(timer);
        // dependency: phase (kích hoạt 4.1.1), playerBoard + difficulty + computerTargetQueue (dữ liệu cho 4.1.2)
    }, [phase, playerBoard, difficulty, computerTargetQueue, dispatch]);

// [3.1.1] / [3.1.7] isClickable = true ở lượt Player (bảng kích hoạt), false ở lượt CPU (vô hiệu hóa)
    const isClickable = phase === PHASES.PLAYER_TURN;

    function handleCellClick(row, col) {
        if (!isClickable) return;
        // [3.1.2] / [3.5.1] Player click vào một ô trên bảng đối thủ.
        dispatch(clearError());
        dispatch(playerAttack({row, col}));
    }

    return (
        <div className="board-wrapper">

            {/* 2. THÊM ATTACK TOAST VÀO GIAO DIỆN VÀ TRUYỀN RESULT */}
            <AttackToast result={lastAttackResult} />

            {/* [4.4.2] Hiển thị thông báo lỗi khi không thể chọn ô tấn công (Ngoại lệ 4.4) */}
            {errorMsg &&
                <div className="error-screen">
                    <div className="error-message">
                        <p>{errorMsg}</p>
                        <button className="error-reload-btn"
                                onClick={() => window.location.reload()}>
                            Tải lại trang
                        </button>
                    </div>
                </div>
            }

            <div className="game-board">
                {/* ── Your grid ── */}
                <div className="game-section">
                    <ShipList fleet={playerFleet} />
                    <div className="game-board-area">
                        {/* [UC-04 / Post-condition 1, 2] Hiển thị kết quả lượt Máy tính trên bảng Player
                            Ô được chọn mang ký hiệu Miss / Hit / Sunk sau bước 4.1.3 */}
                        <Grid board={playerBoard} disabled />
                        <p className="game-board-label">Bảng Của Bạn</p>
                    </div>
                </div>

                {/* ── Opponent's grid ── */}
                <div className="game-section">
                    <div className="game-board-area">
                        <Grid
                            board={computerBoard}
                            onCellClick={handleCellClick}
                            disabled={!isClickable}
                            hideShips
                        />
                        <p className="game-board-label">
                            Bảng Đối Thủ
                            <span className="game-board-label-sub"> (Máy Tính)</span>
                        </p>
                    </div>
                    <ShipList fleet={computerFleet} align="right" />
                </div>
            </div>
        </div>
    );
}
