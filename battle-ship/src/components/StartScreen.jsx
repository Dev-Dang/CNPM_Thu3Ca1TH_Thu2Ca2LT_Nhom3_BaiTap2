import {useAppDispatch, useAppSelector} from '../store/index.js';
import {startGame} from '../store/gameSlice.js';
import '../styles/start-screen.css';

export default function StartScreen() {
    const dispatch = useAppDispatch();
    const error = useAppSelector((state) => state.game.error);

    return (
        <>
            {/* 1.E1.2 toast: "Không thể bắt đầu ván chơi" */}
            {error &&
                <div className="error-screen">
                    <div className="error-message">
                        <p>Không thể bắt đầu ván chơi</p>
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

                {/* 1.3 click "Bắt đầu ván mới"  +  1.4 dispatch(startGame()) */}
                <button className="start-btn" onClick={() => dispatch(startGame())}>
                    Bắt Đầu Ván Mới
                </button>
            </div>
        </>
    );
}