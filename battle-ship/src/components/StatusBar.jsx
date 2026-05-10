import { useAppDispatch, useAppSelector } from '../store/index.js';
import { startGame } from '../store/gameSlice.js';
import { PHASES } from '../constants/gameConstants.js';
import '../styles/status-bar.css';

const PHASE_LABELS = {
  [PHASES.SETUP]: 'Đặt tàu lên bảng',
  [PHASES.PLAYER_TURN]: 'Lượt của bạn — chọn ô tấn công',
  [PHASES.CPU_TURN]: 'Máy tính đang suy nghĩ...',
  [PHASES.GAME_OVER]: 'Ván chơi kết thúc',
};

export default function StatusBar() {
  const dispatch = useAppDispatch();
  const phase = useAppSelector((state) => state.game.phase);

  return (
    <header className="status-bar">
      <span className="status-logo">BATTLESHIP</span>
      <span className="status-mode">vs Máy Tính</span>
      {phase && <span className="status-phase">{PHASE_LABELS[phase]}</span>}
      {phase && (
        <button className="status-new-game-btn" onClick={() => dispatch(startGame())}>
          Ván Mới
        </button>
      )}
    </header>
  );
}
