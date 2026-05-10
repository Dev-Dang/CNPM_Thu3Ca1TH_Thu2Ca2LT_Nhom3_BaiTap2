import { useAppDispatch } from '../store/index.js';
import { startGame } from '../store/gameSlice.js';
import '../styles/start-screen.css';

export default function StartScreen() {
  const dispatch = useAppDispatch();

  return (
    <div className="start-screen">
      <div className="start-icon">⚓</div>
      <h1 className="start-title">BATTLESHIP</h1>
      <p className="start-subtitle">Chế Độ Một Người — Đấu Máy Tính</p>
      <button className="start-btn" onClick={() => dispatch(startGame())}>
        Bắt Đầu Ván Mới
      </button>
    </div>
  );
}
