import '../styles/cell.css';

const STATE_CLASS = {
    empty: 'cell-empty',
    ship:  'cell-ship',
    hit:   'cell-hit',
    miss:  'cell-miss',
    sunk:  'cell-sunk',
};

/**
 * UC-02 — Một ô đơn trong bảng 10×10 của Player.
 * Bước 2.1.2: Grid tạo ra 100 Cell như thế này để Player nhìn thấy bảng đặt tàu.
 * Renders visual markers based on state:
 *   empty / ship → no content
 *   miss         → gray dot
 *   hit / sunk   → red ✕
 *
 * @param {{ row, col, state, onClick, disabled }} props
 */
export default function Cell({ row, col, state, onClick, disabled = false }) {
    // Bước 2.1.2: Mỗi ô render nội dung tương ứng trạng thái hiện tại
    let content = null;
    if (state === 'miss') content = <span className="cell-dot" />;
    if (state === 'hit' || state === 'sunk') content = <span className="cell-cross">✕</span>;

    // Bước 2.1.2: Tạo nhãn tọa độ cột (A→J) để định danh ô, ví dụ A1, B3...
    const colLabel = String.fromCharCode(65 + col);

    return (
        // Bước 2.4: Player click ô → handleCellClick(row, col) được kích hoạt
        //           → dispatch(placeShip) lên gameSlice để đặt tàu tại vị trí đó
        // "Cell 100 disabled" trong sequence: disabled=true khi chưa chọn tàu hoặc tàu đang được kéo
        <button
            className={`cell ${STATE_CLASS[state] ?? ''}`}
            onClick={() => !disabled && onClick?.(row, col)}
            disabled={disabled}
            aria-label={`${colLabel}${row + 1} — ${state}`}
        >
            {content}
        </button>
    );
}