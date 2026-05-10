/* eslint-disable no-unused-vars */
import {useAppDispatch, useAppSelector} from '../store/index.js';
import {playerAttack, clearError, computerAttack, addError} from '../store/gameSlice';
import {DELAY_MS, PHASES} from '../constants/gameConstants';
import Grid from './Grid.jsx';
import {useEffect} from "react";
import {selectAttackCell} from "../utils/computerLogic.js";
import ShipList from "./ShipList.jsx";
import '../styles/game-board.css';

export default function GameBoard() {
    const dispatch = useAppDispatch();
    const {phase, playerBoard, playerFleet, computerBoard, computerFleet, lastAttackResult, errorMsg} =
        useAppSelector((state) => state.game);

    // 4.1 Nhận tín hiệu từ UC-03 -> phase = CPU_TURN
    // 4.3e / 4.A1.2 / 4.A2.2 / 4.A3.2a / 4.6a updated state (playerBoard[row][col] = MISS)
    useEffect(() => {
        if (phase !== PHASES.CPU_TURN) return;

        // 4.A3.2b / 4.6b setTimeout(500ms)
        const timer = setTimeout(() => {
            // 4.2 selectAttackCell(playerBoard)
            let cell = null;
            try {
                cell = selectAttackCell(playerBoard);
            } catch (error) {
                // 4.E1.2b dispatch(addError({message: "Kết quả lượt chơi gặp lỗi. Vui lòng tải lại trang"}))
                dispatch(addError({message: "Kết quả lượt chơi gặp lỗi. Vui lòng tải lại trang"}))
            }

            // 4.3a dispatch(computerAttack({row: cell.row, col: cell.col}))
            if (cell) dispatch(computerAttack({row: cell.row, col: cell.col}));
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

            {/* 4.E1.2c toast: "Kết quả lượt chơi gặp lỗi. Vui lòng tải lại trang." */}
            {errorMsg &&
                <div className="error-screen">
                    <div className="error-message">
                        <p>${errorMsg}</p>
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
                        {/* 4.4 / 4.A1.2 / 4.A2.2 re-render Player board */}
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