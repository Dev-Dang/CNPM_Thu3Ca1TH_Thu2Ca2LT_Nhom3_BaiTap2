import {useAppDispatch, useAppSelector} from '../store/index.js';
import {startGame} from '../store/gameSlice.js';
import '../styles/start-screen.css';
import { useState } from 'react';
export default function StartScreen() {
    const dispatch = useAppDispatch();
    const errorMsg = useAppSelector((state) => state.game.errorMessage);
    const [difficulty, setDifficulty] = useState(null);
    return (
        <>
            {/* 1.E1.2 toast: "Không thể bắt đầu ván chơi" */}
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

            {/* 1.2 render StartScreen với nút "Bắt đầu ván mới" */}
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
                        <button 
                            className={`diff-btn easy ${difficulty === 'easy' ? 'active' : ''}`}
                            onClick={() => setDifficulty('easy')}
                        >
                            Easy
                        </button>
                        <button 
                            className={`diff-btn normal ${difficulty === 'normal' ? 'active' : ''}`}
                            onClick={() => setDifficulty('normal')}
                        >
                            Normal
                        </button>
                    </div>
                </div>


                {/* 1.3 click "Bắt đầu ván mới"  +  1.4 dispatch(startGame()) */}
                <button 
                    className="start-btn" 
                    onClick={() => dispatch(startGame(difficulty))}
                    disabled={!difficulty}
                >
                    Bắt Đầu Ván Mới
                </button>

            </div>
        </>
    );
}