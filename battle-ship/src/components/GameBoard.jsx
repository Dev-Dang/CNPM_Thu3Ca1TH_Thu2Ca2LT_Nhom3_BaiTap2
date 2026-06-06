/* eslint-disable no-unused-vars */
import {useAppDispatch, useAppSelector} from '../store/index.js';
import {playerAttack, clearError, computerAttack, addError} from '../store/gameSlice';
import {DELAY_MS, PHASES} from '../constants/gameConstants';
import Grid from './Grid.jsx';
import {useEffect, useState} from "react";
import {selectAttackCell} from "../utils/computerLogic.js";
import ShipList from "./ShipList.jsx";
import '../styles/game-board.css';
import '../styles/error.css';

export default function GameBoard() {
    const [errorMsg, setErrorMsg] = useState(null);
    const dispatch = useAppDispatch();

    // [4.2.2a] / [4.1.5a] Nhận trạng thái mới
    const {phase, playerBoard, playerFleet, computerBoard, computerFleet, lastAttackResult} =
        useAppSelector((state) => state.game);

    // [4.1.1] Nhận lượt từ hệ thống; bắt đầu xử lý. → (phase = CPU_TURN)
    useEffect(() => {
        if (phase !== PHASES.CPU_TURN) return;

        const timer = setTimeout(() => {
            let cell = null;
            try {
                // [4.1.2a] Yêu cầu máy tính chọn ô tấn công
                cell = selectAttackCell(playerBoard);
            } catch (error) {
                // [4.3.1a] Set giá trị Thông báo lỗi
                setErrorMsg("Kết quả lượt chơi gặp lỗi. Vui lòng tải lại trang.");
            }

            if (cell)
                // [4.1.3a] Gửi yêu cầu xử lý
                dispatch(computerAttack({row: cell.row, col: cell.col}));

        }, DELAY_MS);

        return () => clearTimeout(timer);
    }, [phase, playerBoard, dispatch]);

    const isClickable = phase === PHASES.PLAYER_TURN;

    function handleCellClick(row, col) {
        if (!isClickable) return;
        dispatch(clearError());
        dispatch(playerAttack({row, col}));
    }

    return (
        <div className="board-wrapper">

            {/* [4.3.1b] Hiển thị hộp thoại thông báo lỗi */}
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
                        {/* [4.2.2] / [4.1.5b] Đánh dấu ô vừa bị tấn công
                        bằng ký hiệu tương ứng
                        (Miss/Hit/Sunk) trên bảng Player.`.*/}
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