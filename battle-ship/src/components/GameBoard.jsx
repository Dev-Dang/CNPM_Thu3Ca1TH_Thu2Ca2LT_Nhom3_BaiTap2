
import { useDispatch, useSelector } from 'react-redux';
import { playerAttack, clearError } from '../store/gameSlice';
import { PHASES } from '../constants/gameConstants';
import Grid from './Grid.jsx'; 
/**
//  * GameBoard — UC-03 / UC-04
//  * Props:
//  *   board   : Cell[][]
//  *   isEnemy : boolean — true = bảng máy tính (Player click vào)
//  *   label   : string
//  */
export default function GameBoard({ board, isEnemy = false, label }) {
  const dispatch = useDispatch();
  const { phase, lastAttackResult, errorMessage } = useSelector((s) => s.game);

  const isClickable = isEnemy && phase === PHASES.PLAYER_TURN;

  function handleCellClick(row, col) {
    if (!isClickable) return;
    dispatch(clearError());
    dispatch(playerAttack({ row, col }));
  }

  return (
    <div className="board-wrapper">
      {label && <h3 className="board-label">{label}</h3>}

      {isEnemy && (errorMessage || lastAttackResult) && (
        <p className={`board-msg ${errorMessage ? 'board-msg--error' : `board-msg--${lastAttackResult}`}`}>
          {errorMessage || (
            <>
              {lastAttackResult === 'miss' && 'Trượt!'}
              {lastAttackResult === 'hit'  && 'Trúng!'}
              {lastAttackResult === 'sunk' && 'Đã nhấn chìm một tàu!'}
            </>
          )}
        </p>
      )}

      <Grid 
        board={board} 
        onCellClick={handleCellClick}
        disabled={!isClickable}
        hideShips={isEnemy} 
      />
    </div>
  );
}