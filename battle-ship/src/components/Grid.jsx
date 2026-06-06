import Cell from './Cell.jsx';
import '../styles/grid.css';

const COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

/**
 * 10×10 board grid with column (A–J) and row (1–10) headers.
 * Shared by SetupBoard (UC-02) and GameBoard (UC-03, UC-04).
 *
 * @param {{
 *   board: Cell[][],
 *   onCellClick?: (row: number, col: number) => void,
 *   disabled?: boolean,
 *   hideShips?: boolean
 * }} props
 *
 * hideShips — pass true on the opponent's board to conceal ship positions from the Player.
 */
export default function Grid({ board, onCellClick, disabled = false, hideShips = false }) {
    return (
        <div className="grid">
            {/* Corner cell */}
            <div className="grid-corner" />

            {/* Column headers: A – J */}
            {COL_LABELS.map((label) => (
                <div key={label} className="grid-col-header">{label}</div>
            ))}

            {/* Row header + 10 cells per row */}
            {board?.flatMap((rowArr, rowIndex) => [
                <div key={`rh-${rowIndex}`} className="grid-row-header">{rowIndex + 1}</div>,
                ...rowArr.map((cell) => (
                    <Cell
                        key={`${cell.row}-${cell.col}`}
                        {...cell}
                        state={hideShips && cell.state === 'ship' ? 'empty' : cell.state}
                        onClick={onCellClick}
                        disabled={disabled}
                    />
                )),
            ])}
        </div>
    );
}
