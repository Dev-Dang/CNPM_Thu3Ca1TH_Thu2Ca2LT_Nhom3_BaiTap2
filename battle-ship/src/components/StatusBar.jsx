import {useState} from 'react';
import {useAppDispatch, useAppSelector} from '../store/index.js';
import {startGame} from '../store/gameSlice.js';
import {PHASES} from '../constants/gameConstants.js';
import '../styles/status-bar.css';
import '../styles/dialog.css';

const PHASE_LABELS = {
    [PHASES.SETUP]: 'Đặt tàu lên bảng',
    [PHASES.PLAYER_TURN]: 'Lượt của bạn — chọn ô tấn công',
    [PHASES.CPU_TURN]: 'Máy tính đang suy nghĩ...',
    [PHASES.GAME_OVER]: 'Ván chơi kết thúc',
};

export default function StatusBar() {
    const dispatch = useAppDispatch();
    const [showConfirmDialog, setShowConfirmDialog] = useState(false);

    // Lấy PHASE từ state 1.4 trả vê
    const phase = useAppSelector((state) => state.game.phase);

    const handleNewGameClick = () => {
        // 1.A1.2 render confirm dialog
        setShowConfirmDialog(true);
    };

    // 1.A1.4 Khởi tạo lại ván mới -> dispatch(startGame())
    const handleConfirmNewGame = () => {
        setShowConfirmDialog(false);
        dispatch(startGame());
    };

    // 1.A2.2 close dialog, ván giữ nguyên
    const handleCancelNewGame = () => {
        setShowConfirmDialog(false);
    };

    return (
        <>
            <header className="status-bar">
                <span className="status-logo">BATTLESHIP</span>
                <span className="status-mode">vs Máy Tính</span>

                {/* 1.5 render label "Vs Máy tính" */}
                {phase && <span className="status-phase">{PHASE_LABELS[phase]}</span>}

                {phase && (
                    // 1.A1.1 click "Bắt đầu ván mới"
                    <button className="status-new-game-btn" onClick={handleNewGameClick}>
                        Ván Mới
                    </button>
                )}
            </header>

            {/* Dialog xác nhận */}
            {showConfirmDialog && (
                <div className="dialog-overlay">
                    <div className="dialog-content">
                        <p className="dialog-text">
                            Ván chơi hiện tại sẽ bị hủy. Bạn có chắc muốn bắt đầu ván mới không?
                        </p>

                        <div className="dialog-actions">
                            {/* [[A1.3] Xác nhận] */}
                            <button className="dialog-btn confirm" onClick={handleConfirmNewGame}>
                                Xác nhận
                            </button>

                            {/* [[A2] Hủy] */}
                            <button className="dialog-btn cancel" onClick={handleCancelNewGame}>
                                Hủy
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
