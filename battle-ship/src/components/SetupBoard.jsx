import { useCallback, useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.js';
import {
    autoPlacePlayerFleet,
    placeShip,
    selectShip,
    startBattle,
} from '../store/gameSlice.js';
import { ORIENTATION } from '../constants/gameConstants.js';
import {
    getShipAnchorFromPivot,
    getShipPositions,
    isValidPlacement,
    removeShipFromBoard,
} from '../utils/boardUtils.js';
import Grid from './Grid.jsx';
import ShipList from './ShipList.jsx';
import '../styles/setup-board.css';

export default function SetupBoard() {
    const dispatch = useAppDispatch();

    // [2.1.2b] Lấy board, fleet và setup state để render giao diện đặt tàu.
    const { playerBoard, playerFleet, selectedShipId, errorMessage }
        = useAppSelector((state) => state.game);

    // [2.2.1] Lưu hướng đặt tàu mặc định cho thao tác đặt thủ công.
    const [orientation, setOrientation] = useState(ORIENTATION.HORIZONTAL);

    // [2.2.2c] Lưu trạng thái kéo tàu để đồng bộ ghost, preview và drop.
    const [dragState, setDragState] = useState(null);

    // [2.1.2c] Hiển thị modal hướng dẫn lần đầu vào giao diện thiết lập.
    const [showGuide, setShowGuide] = useState(() =>
        localStorage.getItem('setup-guide-seen') !== 'true'
    );

    // [2.1.4] Kiểm tra toàn bộ hạm đội Player đã được đặt hợp lệ hay chưa.
    const allPlaced = playerFleet.length > 0 && playerFleet.every((s) => s.placed);

    const selectedShip = playerFleet.find((s) => s.id === selectedShipId);

    const getPreview = useCallback((state = dragState) => {
        if (!state || state.hoverRow === null || state.hoverCol === null) return null;

        const ship = playerFleet.find((s) => s.id === state.shipId);
        if (!ship) return null;

        const anchor = getShipAnchorFromPivot(
            state.hoverRow,
            state.hoverCol,
            state.pivotIndex,
            state.orientation
        );
        const positions = getShipPositions(anchor.row, anchor.col, ship.size, state.orientation);
        const boardForValidation = ship.placed && ship.positions.length > 0
            ? removeShipFromBoard(playerBoard, ship.positions)
            : playerBoard;
        const valid = isValidPlacement(
            boardForValidation,
            anchor.row,
            anchor.col,
            ship.size,
            state.orientation
        );

        return {shipId: ship.id, anchor, positions, valid};
    }, [dragState, playerBoard, playerFleet]);

    const dragPreview = getPreview();

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (dragState && (event.key === ' ' || event.key === 'Spacebar')) {
                event.preventDefault();
                // [2.2.1] Space đổi hướng ghost/preview của tàu đang được kéo.
                setDragState((current) => current
                    ? {
                        ...current,
                        orientation: current.orientation === ORIENTATION.HORIZONTAL
                            ? ORIENTATION.VERTICAL
                            : ORIENTATION.HORIZONTAL,
                    }
                    : current
                );
                return;
            }

            if (!selectedShipId) return;

            const ship = playerFleet.find((s) => s.id === selectedShipId);
            if (!ship) return;

            if (!ship.placed || ship.positions.length === 0) {
                if (event.key === ' ' || event.key === 'Spacebar') {
                    event.preventDefault();
                    // [2.2.1] Space đổi hướng mặc định khi tàu chưa được đặt.
                    setOrientation((current) =>
                        current === ORIENTATION.HORIZONTAL ? ORIENTATION.VERTICAL : ORIENTATION.HORIZONTAL
                    );
                }
                return;
            }

            const anchor = ship.positions[0];
            const deltas = {
                ArrowUp: {deltaRow: -1, deltaCol: 0},
                ArrowDown: {deltaRow: 1, deltaCol: 0},
                ArrowLeft: {deltaRow: 0, deltaCol: -1},
                ArrowRight: {deltaRow: 0, deltaCol: 1},
            };

            if (deltas[event.key]) {
                event.preventDefault();
                const {deltaRow, deltaCol} = deltas[event.key];

                // [2.3.3a] Di chuyển tàu đã chọn từng ô bằng phím mũi tên.
                dispatch(placeShip({
                    shipId: ship.id,
                    row: anchor.row + deltaRow,
                    col: anchor.col + deltaCol,
                    orientation: ship.orientation,
                }));
            }

            if (event.key === ' ' || event.key === 'Spacebar') {
                event.preventDefault();
                const nextOrientation = ship.orientation === ORIENTATION.HORIZONTAL
                    ? ORIENTATION.VERTICAL
                    : ORIENTATION.HORIZONTAL;

                // [2.3.3a] Đổi hướng tàu đã chọn bằng phím Space.
                dispatch(placeShip({
                    shipId: ship.id,
                    row: anchor.row,
                    col: anchor.col,
                    orientation: nextOrientation,
                }));
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [dispatch, dragState, playerFleet, selectedShipId]);

    const handleCellDrop = useCallback((row, col) => {
        if (!dragState) return;

        const droppedState = {...dragState, hoverRow: row, hoverCol: col};
        const preview = getPreview(droppedState);
        const draggedShip = playerFleet.find((ship) => ship.id === droppedState.shipId);
        if (!draggedShip) return;

        setDragState(null);

        // [2.2.2h] Drop tàu vào anchor preview, reducer sẽ validate tại bước 2.2.3.
        dispatch(placeShip({
            shipId: droppedState.shipId,
            row: preview?.anchor.row ?? row,
            col: preview?.anchor.col ?? col,
            orientation: droppedState.orientation,
        }));
    }, [dispatch, dragState, getPreview, playerFleet]);

    useEffect(() => {
        if (!dragState) return undefined;

        const getCellFromPoint = (clientX, clientY) => {
            const element = document.elementFromPoint(clientX, clientY);
            const cellElement = element?.closest?.('[data-board-cell="true"]');
            if (!cellElement) return null;

            return {
                row: Number(cellElement.dataset.row),
                col: Number(cellElement.dataset.col),
            };
        };

        const handlePointerMove = (event) => {
            const cell = getCellFromPoint(event.clientX, event.clientY);

            setDragState((current) => current
                ? {
                    ...current,
                    hoverRow: cell?.row ?? current.hoverRow,
                    hoverCol: cell?.col ?? current.hoverCol,
                    clientX: event.clientX,
                    clientY: event.clientY,
                }
                : current
            );
        };

        const handlePointerUp = (event) => {
            const cell = getCellFromPoint(event.clientX, event.clientY);
            if (cell) {
                handleCellDrop(cell.row, cell.col);
            } else {
                setDragState(null);
            }
        };

        window.addEventListener('mousemove', handlePointerMove);
        window.addEventListener('mouseup', handlePointerUp);
        return () => {
            window.removeEventListener('mousemove', handlePointerMove);
            window.removeEventListener('mouseup', handlePointerUp);
        };
    }, [dragState, handleCellDrop, playerBoard, playerFleet]);

    // [2.2.2c] Player chọn ô bắt đầu đặt tàu trên bảng.
    const handleCellClick = (row, col, cell) => {
        if (cell?.shipId) {
            // [2.3.1] Click vào tàu đã đặt thì chọn tàu đó để điều chỉnh.
            dispatch(selectShip({shipId: cell.shipId}));
            return;
        }

        if (!selectedShip) return;
        const placementOrientation = selectedShip.placed ? selectedShip.orientation : orientation;
        // [2.2.2d] Gửi vị trí sang reducer để kiểm tra hợp lệ trước khi ghi nhận.
        dispatch(placeShip({ shipId: selectedShip.id, row, col, orientation: placementOrientation }));
    };

    // [2.2.2b] Player chọn tàu chưa đặt từ danh sách.
    const handleSelectShip = (id) => {
        dispatch(selectShip({ shipId: id }));
    };

    useEffect(() => {
        if (!selectedShipId || dragState) return undefined;

        const handleDocumentMouseDown = (event) => {
            if (event.target.closest('.setup-sidebar, .setup-board-area, .setup-guide-modal')) {
                return;
            }

            dispatch(selectShip({shipId: null}));
        };

        document.addEventListener('mousedown', handleDocumentMouseDown);
        return () => document.removeEventListener('mousedown', handleDocumentMouseDown);
    }, [dispatch, dragState, selectedShipId]);

    // [2.2.1] Player chọn hướng đặt tàu ngang hoặc dọc.
    const toggleOrientation = () =>
        setOrientation((o) =>
            o === ORIENTATION.HORIZONTAL ? ORIENTATION.VERTICAL : ORIENTATION.HORIZONTAL
        );

    const handleShipListDragStart = (shipId, event) => {
        const ship = playerFleet.find((s) => s.id === shipId);
        if (!ship || ship.placed) return;

        event?.preventDefault();
        // [2.2.2c] Kéo tàu chưa đặt từ danh sách, ô hover/drop là ô đầu tàu.
        setDragState({
            shipId,
            source: 'list',
            pivotIndex: 0,
            orientation,
            hoverRow: null,
            hoverCol: null,
            clientX: event?.clientX ?? null,
            clientY: event?.clientY ?? null,
        });
        dispatch(selectShip({ shipId }));
    };

    const handleBoardShipDragStart = (shipId, row, col, event) => {
        const ship = playerFleet.find((s) => s.id === shipId);
        if (!ship || !ship.placed) return;

        const pivotIndex = ship.positions.findIndex((pos) => pos.row === row && pos.col === col);
        if (pivotIndex === -1) return;

        event?.preventDefault();
        // [2.3.3b] Kéo tàu đã đặt trực tiếp trên board, segment đang cầm là điểm neo.
        setDragState({
            shipId,
            source: 'board',
            pivotIndex,
            orientation: ship.orientation,
            hoverRow: row,
            hoverCol: col,
            clientX: event?.clientX ?? null,
            clientY: event?.clientY ?? null,
        });
        dispatch(selectShip({ shipId }));
    };

    const handleCellDragOver = (row, col, event) => {
        if (!dragState) return;

        event.preventDefault();
        // [2.2.2e] Cập nhật preview theo ô đang hover khi kéo thả tàu.
        setDragState((current) => current
            ? (
                current.hoverRow === row &&
                current.hoverCol === col &&
                current.clientX === event.clientX &&
                current.clientY === event.clientY
                    ? current
                    : {...current, hoverRow: row, hoverCol: col, clientX: event.clientX, clientY: event.clientY}
            )
            : current
        );
    };

    const handleAutoPlace = () => {
        // [2.4.1] Player chọn chức năng đặt tàu tự động.
        dispatch(autoPlacePlayerFleet());
    };

    const handleCloseGuide = () => {
        // [2.1.2c] Đóng modal hướng dẫn thao tác đặt và điều chỉnh tàu.
        setShowGuide(false);
    };

    const handleGuideSeenChange = (event) => {
        if (event.target.checked) {
            // [2.1.2c] Lưu tùy chọn không hiển thị lại hướng dẫn thiết lập.
            localStorage.setItem('setup-guide-seen', 'true');
        } else {
            localStorage.removeItem('setup-guide-seen');
        }
    };

    // [2.1.7] Player nhấn nút bắt đầu tấn công sau khi đặt đủ hạm đội.
    const handleStartBattle = () => {
        if (!allPlaced) return; // [2.1.4] Guard khi vẫn còn tàu chưa đặt.
        dispatch(startBattle()); // [2.1.8a] Chuyển sang giai đoạn tấn công.
    };

    const draggedShip = dragState
        ? playerFleet.find((ship) => ship.id === dragState.shipId)
        : null;

    return (
        <div className="setup-board">
            {dragState && draggedShip && dragState.clientX !== null && (
                // [2.2.2f] Ghost kéo thả đồng bộ kích thước, hướng và điểm neo của tàu.
                <div
                    className={`setup-drag-ghost ${dragState.orientation === ORIENTATION.VERTICAL ? 'setup-drag-ghost-vertical' : ''}`}
                    style={{
                        left: dragState.clientX,
                        top: dragState.clientY,
                        transform: dragState.orientation === ORIENTATION.HORIZONTAL
                            ? `translate(${-dragState.pivotIndex * 35}px, -17px)`
                            : `translate(-17px, ${-dragState.pivotIndex * 35}px)`,
                    }}
                >
                    {Array.from({length: draggedShip.size}).map((_, index) => (
                        <span key={index} className="setup-drag-ghost-cell" />
                    ))}
                </div>
            )}

            {/* ── Fleet panel ── */}
            <div className="setup-sidebar">

                {/* [2.1.2d] Danh sách tàu cần đặt theo độ khó đã chọn */}
                <ShipList
                    fleet={playerFleet}
                    selectedId={selectedShipId}
                    onSelect={handleSelectShip}
                    onDragStart={handleShipListDragStart}
                    onDragEnd={() => setDragState(null)}
                    grouped
                    disablePlaced
                />

                <div className="setup-controls">

                    {/* [2.2.1] Chọn hướng đặt tàu ngang hoặc dọc */}
                    <button className="setup-orient-btn" onClick={toggleOrientation}>
                        {orientation === ORIENTATION.HORIZONTAL ? '↔ Nằm Ngang' : '↕ Thẳng Đứng'}
                    </button>

                    {/* [2.4.1] Chức năng đặt tàu tự động cho toàn bộ hạm đội */}
                    <button className="setup-auto-btn" onClick={handleAutoPlace}>
                        Đặt Tự Động
                    </button>

                    {/* [2.1.6] Kích hoạt nút bắt đầu tấn công khi toàn bộ hạm đội đã đặt */}
                    <button
                        className="setup-start-btn"
                        disabled={!allPlaced}
                        onClick={handleStartBattle}
                    >
                        Bắt Đầu Chiến
                    </button>

                </div>
            </div>

            {/* ── Board ── */}
            <div className="setup-board-area">

                {/* [2.1.2e] Bảng Player theo kích thước của độ khó đã chọn */}
                <Grid
                    board={playerBoard}
                    onCellClick={handleCellClick}
                    onCellDragOver={handleCellDragOver}
                    onCellDrop={handleCellDrop}
                    onBoardShipDragStart={handleBoardShipDragStart}
                    selectedShipId={selectedShipId}
                    dragPreview={dragPreview}
                    disabled={false}
                />

                <p className="setup-board-label">Bảng Của Bạn</p>

                {/* [2.5.2] Hiển thị lỗi khi vị trí đặt hoặc điều chỉnh không hợp lệ */}
                {errorMessage && (
                    <p className="setup-error-msg">{errorMessage}</p>
                )}

            </div>

            {showGuide && (
                <div className="setup-guide-backdrop" role="dialog" aria-modal="true">
                    <div className="setup-guide-modal">
                        {/* [2.1.2c] Hướng dẫn thao tác đặt tàu thủ công, kéo thả và điều chỉnh */}
                        <h2>Hướng Dẫn Đặt Tàu</h2>
                        <p>Kéo tàu chưa đặt từ danh sách vào bảng hoặc chọn tàu rồi click ô bắt đầu.</p>
                        <p>Kéo trực tiếp tàu đã đặt trên bảng hoặc dùng phím mũi tên để di chuyển từng ô.</p>
                        <p>Nhấn Space để đổi hướng tàu đang kéo hoặc đang chọn.</p>
                        <p>Preview đỏ nghĩa là vị trí không hợp lệ và sẽ không được áp dụng.</p>
                        <label className="setup-guide-check">
                            <input type="checkbox" onChange={handleGuideSeenChange} />
                            Không hiển thị lại
                        </label>
                        <button className="setup-guide-close" onClick={handleCloseGuide}>
                            Đóng
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
