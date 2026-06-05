import Cell from './Cell.jsx';
import '../styles/grid.css';

// Bước 2.1.2: Nhãn cột A→J dùng để render header bảng 10×10
const COL_LABELS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

/**
 * UC-02 — Bước 2.1.2: Tạo ra bảng 10×10 để Player nhìn thấy và đặt tàu.
 * Grid render header cột (A–J), header hàng (1–10), và 100 Cell bên trong.
 * Dùng chung cho SetupBoard (UC-02) và GameBoard (UC-03, UC-04).
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
        // Bước 2.1.2: Render toàn bộ bảng grid (corner + headers + 100 ô)
        <div className="grid">
            {/* Bước 2.1.2: Ô góc trống ở vị trí (0,0) để căn header cột và hàng */}
            <div className="grid-corner" />

            {/* Bước 2.1.2: Render header cột A–J phía trên bảng */}
            {COL_LABELS.map((label) => (
                <div key={label} className="grid-col-header">{label}</div>
            ))}

            {/* Bước 2.1.2: Với mỗi hàng, render header hàng (1–10) rồi render 10 Cell
                → tổng cộng 100 Cell được tạo ra để Player chọn vị trí đặt tàu (bước 2.4) */}
            {board?.flatMap((rowArr, rowIndex) => [
                <div key={`rh-${rowIndex}`} className="grid-row-header">{rowIndex + 1}</div>,
                ...rowArr.map((cell) => (
                    <Cell
                        key={`${cell.row}-${cell.col}`}
                        {...cell}
                        // hideShips=true: ẩn vị trí tàu đối thủ, hiện 'empty' thay vì 'ship'
                        state={hideShips && cell.state === 'ship' ? 'empty' : cell.state}
                        // Bước 2.4: truyền handler xuống Cell → khi click sẽ gọi handleCellClick(row, col)
                        onClick={onCellClick}
                        // "Cell 100 disabled" trong sequence: khóa toàn bộ board khi chưa chọn tàu
                        disabled={disabled}
                    />
                )),
            ])}
        </div>
    );
}