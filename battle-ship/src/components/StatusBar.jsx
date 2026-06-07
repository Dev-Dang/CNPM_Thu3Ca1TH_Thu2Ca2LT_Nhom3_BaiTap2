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
    const [newDifficulty, setNewDifficulty] = useState(null);
    const phase = useAppSelector((state) => state.game.phase);
    
    const handleNewGameClick = () => {
       // [1.2.1] Player chọn "Ván mới" trong khi đang chơi
    // [1.2.2] Hệ thống hiển thị hộp xác nhận (Dialog)
        setShowConfirmDialog(true);
    };

    // [1.2.4] Player chọn "Xác nhận"
    // [1.2.5] Hệ thống hủy ván cũ, đặt lại trạng thái
    const handleConfirmNewGame = () => {
        setShowConfirmDialog(false);
        dispatch(startGame(newDifficulty));
        // [-> 1.1.2] Quay lại luồng chính để bắt đầu ván mới
    };

  
    const handleCancelNewGame = () => {
        // [1.3.1] Player chọn nút "Hủy" trên hộp xác nhận
        // [1.3.2] Hệ thống đóng hộp xác nhận, duy trì nguyên trạng
        setShowConfirmDialog(false);
        // [1.3.3] Kết thúc luồng
    };

    return (
        <>
            <header className="status-bar">
                <span className="status-logo">BATTLESHIP</span>
                <span className="status-mode">vs Máy Tính</span>

                {/* [1.1.7] Hiển thị nhãn chế độ và phase xuyên suốt ván */}
                {phase && <span className="status-phase">{PHASE_LABELS[phase]}</span>}

                {phase && (
                    
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
                        {/* --- PHẦN CHỌN ĐỘ KHÓ --- */}
                        <div className="dialog-difficulty">
                            <p className="dialog-difficulty-title">Chọn độ khó cho ván mới:</p>
                            <div className="dialog-difficulty-buttons">
                                {/* [1.2.3] Player chọn nút độ khó "easy" hoặc "normal" */}
                                <button 
                                    className={`dialog-diff-btn easy ${newDifficulty === 'easy' ? 'active' : ''}`}
                                    onClick={() => setNewDifficulty('easy')}
                                >
                                    Easy
                                </button>
                                <button 
                                    className={`dialog-diff-btn normal ${newDifficulty === 'normal' ? 'active' : ''}`}
                                    onClick={() => setNewDifficulty('normal')}
                                >
                                    Normal
                                </button>
                            </div>
                        </div>
                        <div className="dialog-actions">
                            
                            <button className="dialog-btn confirm" onClick={handleConfirmNewGame}>
                                Xác nhận
                            </button>

                            
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
