import '../styles/cell.css';

const STATE_CLASS = {
    empty: 'cell-empty',
    ship:  'cell-ship',
    hit:   'cell-hit',
    miss:  'cell-miss',
    sunk:  'cell-sunk',
};

/**
 * A single board cell (UC-02, UC-03, UC-04).
 * Renders visual markers based on state:
 *   empty / ship → no content
 *   miss         → gray dot
 *   hit / sunk   → red ✕
 *
 * @param {{ row, col, state, onClick, disabled }} props
 */
export default function Cell({ row, col, state, onClick, disabled = false }) {
    let content = null;
    if (state === 'miss') content = <span className="cell-dot" />;
    if (state === 'hit' || state === 'sunk') content = <span className="cell-cross">✕</span>;

    const colLabel = String.fromCharCode(65 + col);

    return (
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
