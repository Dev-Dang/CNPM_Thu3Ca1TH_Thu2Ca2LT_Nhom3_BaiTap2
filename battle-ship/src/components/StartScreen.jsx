import {useState} from 'react';
import {useAppDispatch} from '../store/index.js';
import {startGame} from '../store/gameSlice.js';
import {DIFFICULTY, DEFAULT_DIFFICULTY} from '../constants/gameConstants.js';
import '../styles/start-screen.css';

export default function StartScreen() {
    const dispatch = useAppDispatch();
    const [difficultyId, setDifficultyId] = useState(DEFAULT_DIFFICULTY.id);
    return (
        <>
            {/* // [1.1.2] Render StartScreen (tiêu đề, nút chọn độ khó, nút bắt đầu) */}
            <div className="start-screen">
                <div className="start-icon">⚓</div>
                <h1 className="start-title">BATTLESHIP</h1>
                <p className="start-subtitle">Chế Độ Một Người — Đấu Máy Tính</p>
                 {/* --- PHẦN CHỌN ĐỘ KHÓ --- */}
                <div className="difficulty-section">
                    <label className="difficulty-label">
                        Chọn độ khó:
                    </label>
                    <div className="difficulty-buttons">
                        {/* [1.1.3] Player nhấn chọn một trong hai nút độ khó */}
                        {/* [1.1.4] Hệ thống ghi nhận lựa chọn, nổi bật nút, kích hoạt nút Bắt đầu */}
                        <button
                            className={`diff-btn easy ${difficultyId === DIFFICULTY.EASY.id ? 'active' : ''}`}
                            onClick={() => setDifficultyId(DIFFICULTY.EASY.id)}
                        >
                            Easy
                        </button>
                        <button
                            className={`diff-btn normal ${difficultyId === DIFFICULTY.NORMAL.id ? 'active' : ''}`}
                            onClick={() => setDifficultyId(DIFFICULTY.NORMAL.id)}
                        >
                            Normal
                        </button>
                    </div>
                </div>


                {/* [1.1.5] Player chọn nút "Bắt đầu ván mới" */}
                {/* [1.1.6] Hệ thống gọi action startGame */}
                {/* [2.1.0] Gửi độ khó đã chọn để kích hoạt UC-02 theo đúng cấu hình. */}
                <button
                    className="start-btn"
                    onClick={() => dispatch(startGame(difficultyId))}
                    disabled={!difficultyId}
                >
                    Bắt Đầu Ván Mới
                </button>

            </div>
        </>
    );
}