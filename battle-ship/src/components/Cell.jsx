import '../styles/cell.css';

const STATE_CLASS = {
    empty: 'cell-empty',
    ship:  'cell-ship',
    hit:   'cell-hit',
    miss:  'cell-miss',
    sunk:  'cell-sunk',
};

/**
 * UC-02 — Một ô đơn trong bảng Player theo độ khó.
 * Bước 2.1.2: Grid tạo các Cell để Player nhìn thấy bảng đặt tàu.
 * Renders visual markers based on state:
 *   empty / ship → no content
 *   miss         → gray dot
 *   hit / sunk   → red ✕
 *
 * @param {{ row, col, state, selected, previewState, onClick, onMouseDown, onDragOver, onDrop, draggable, disabled }} props
 */
export default function Cell({
    row,
    col,
    state,
    selected = false,
    previewState = null,
    onClick,
    onMouseDown,
    onDragOver,
    onDrop,
    draggable = false,
    disabled = false,
}) {
    // [2.1.2e] Mỗi ô render nội dung tương ứng trạng thái hiện tại.
    let content = null;
    if (state === 'miss') content = <span className="cell-dot" />;
    if (state === 'hit' || state === 'sunk') content = <span className="cell-cross">✕</span>;

    // [2.1.2e] Tạo nhãn tọa độ cột động để định danh ô, ví dụ A1, B3.
    const colLabel = String.fromCharCode(65 + col);

    return (
        // [2.2.2c] Player click ô để chuyển tọa độ đặt tàu lên SetupBoard.
        // [2.1.2e] disabled=true khi board không cho tương tác.
        <button
            className={`cell ${STATE_CLASS[state] ?? ''} ${selected ? 'cell-selected-ship' : ''} ${previewState === 'valid' ? 'cell-preview-valid' : ''} ${previewState === 'invalid' ? 'cell-preview-invalid' : ''}`}
            data-board-cell="true"
            data-row={row}
            data-col={col}
            onClick={() => !disabled && onClick?.(row, col)}
            draggable={draggable}
            onMouseDown={onMouseDown}
            onDragOver={onDragOver}
            onDrop={(event) => {
                // [2.2.2g] Nhận thao tác drop vào ô bắt đầu/anchor preview.
                event.preventDefault();
                onDrop?.();
            }}
            disabled={disabled}
            aria-label={`${colLabel}${row + 1} — ${state}`}
        >
            {content}
        </button>
    );
}