import Cell from './Cell.jsx';
import '../styles/grid.css';

/**
 * UC-02 — Bước 2.1.2: Tạo ra bảng theo độ khó để Player nhìn thấy và đặt tàu.
 * Grid render header cột, header hàng, và các Cell bên trong.
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
export default function Grid({
    board,
    onCellClick,
    onCellDragOver,
    onCellDrop,
    onBoardShipDragStart,
    selectedShipId,
    dragPreview,
    disabled = false,
    hideShips = false,
}) {
    // [2.1.2e] Sinh header cột theo kích thước board của độ khó hiện tại.
    const colCount = board?.[0]?.length ?? 10;
    const colLabels = Array.from({length: colCount}, (_, index) =>
        String.fromCharCode(65 + index)
    );
    const previewPositionKeys = new Set(
        dragPreview?.positions
            ?.filter((pos) =>
                pos.row >= 0 &&
                pos.row < (board?.length ?? 0) &&
                pos.col >= 0 &&
                pos.col < colCount
            )
            .map((pos) => `${pos.row}-${pos.col}`) ?? []
    );

    return (
        // [2.1.2e] Render toàn bộ bảng grid theo kích thước board hiện tại.
        <div className="grid" style={{'--board-cols': colCount}}>
            {/* [2.1.2e] Ô góc trống để căn header cột và hàng */}
            <div className="grid-corner" />

            {/* [2.1.2e] Render header cột động phía trên bảng */}
            {colLabels.map((label) => (
                <div key={label} className="grid-col-header">{label}</div>
            ))}

            {/* [2.1.2e] Với mỗi hàng, render header hàng rồi render các Cell theo độ khó */}
            {board?.flatMap((rowArr, rowIndex) => [
                <div key={`rh-${rowIndex}`} className="grid-row-header">{rowIndex + 1}</div>,
                ...rowArr.map((cell) => (
                    <Cell
                        key={`${cell.row}-${cell.col}`}
                        {...cell}
                        // hideShips=true: ẩn vị trí tàu đối thủ, hiện 'empty' thay vì 'ship'
                        state={hideShips && cell.state === 'ship' ? 'empty' : cell.state}

                        // [2.3.2] Làm nổi bật các ô thuộc tàu đang được chọn để điều chỉnh.
                        selected={!!selectedShipId && cell.shipId === selectedShipId}
                        previewState={
                            previewPositionKeys.has(`${cell.row}-${cell.col}`)
                                ? (dragPreview.valid ? 'valid' : 'invalid')
                                : null
                        }

                        // [2.2.2c] Truyền handler xuống Cell để chọn ô bắt đầu đặt tàu.
                        onClick={() => onCellClick?.(cell.row, cell.col, cell)}

                        // [2.3.1] Truyền handler mouse down để chọn/kéo tàu đã đặt trên board.
                        onMouseDown={(event) =>
                            onBoardShipDragStart?.(cell.shipId, cell.row, cell.col, event)
                        }

                        // [2.2.2e] Truyền handler hover cell để cập nhật preview kéo thả.
                        onDragOver={(event) => onCellDragOver?.(cell.row, cell.col, event)}

                        // [2.2.2g] Truyền handler drop cell để đặt tàu theo anchor preview.
                        onDrop={() => onCellDrop?.(cell.row, cell.col)}
                        draggable={false}

                        // "Cell 100 disabled" trong sequence: khóa toàn bộ board khi chưa chọn tàu
                        disabled={disabled}
                    />
                )),
            ])}
        </div>
    );
}