/* eslint-disable */
import { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../store/index.js';
import { placeShip, selectShip, startBattle } from '../store/gameSlice.js';
import { ORIENTATION, PHASES } from '../constants/gameConstants.js';
import Grid from './Grid.jsx';
import ShipList from './ShipList.jsx';
import '../styles/setup-board.css';

export default function SetupBoard() {
    const dispatch = useAppDispatch();

    // [2.1.2] useAppSelector → re-render board 10x10 + fleet list
    const { playerBoard, playerFleet, selectedShipId, phase }
        = useAppSelector((state) => state.game);

    // [2.1.4] set direction — orientation state nội bộ của SetupBoard
    const [orientation, setOrientation] = useState(ORIENTATION.HORIZONTAL);

    // [2.3.2] error msg — hiển thị khi phase = INVALID_PLACEMENT
    const [errorMsg, setErrorMsg] = useState('');

    // [2.3.1] Sync errorMsg với phase từ Redux
    // phase=INVALID_PLACEMENT → hiện lỗi; phase reset → xoá lỗi
    useEffect(() => {
        if (phase === PHASES.INVALID_PLACEMENT) {
            // [2.3.2] Hiển thị thông báo lỗi
            setErrorMsg('Vị trí không hợp lệ. Vui lòng chọn vị trí khác.');
        } else {
            // [2.3.2] Phase đã reset → xoá msg
            setErrorMsg('');
        }
    }, [phase]);

    // [2.1.8] fleetPlaced — đếm số tàu đã đặt
    const fleetPlaced = playerFleet.filter((s) => s.placed).length;
    const allPlaced = fleetPlaced === 5; // [fleetPlaced = 5] → button enabled

    // [2.1.3] Lấy thông tin tàu đang được chọn từ fleet
    const selectedShip = playerFleet.find((s) => s.id === selectedShipId);

    // [2.1.4] handleCellClick(row, col) — Player click ô trên bảng
    // → tương ứng "handleCellClick(row, col)" trong sequence
    const handleCellClick = (row, col) => {
        if (!selectedShip) return; // guard: chưa chọn tàu thì không làm gì
        // [2.1.4] dispatch(placeShip(shipId, row, col, dir))
        dispatch(placeShip({ shipId: selectedShip.id, row, col, orientation }));
    };

    // [2.1.3] / [2.2.1] Player click tàu → dispatch(selectShip(shipId))
    // Cả tàu chưa đặt (2.1.3) và tàu đã đặt (2.2.1 reposition) đều dùng chung handler này
    const handleSelectShip = (id) => {
        dispatch(selectShip({ shipId: id }));
    };

    // [2.1.4] toggle ngang/dọc — "set direction = onCellClick(row, col)" trong sequence
    const toggleOrientation = () =>
        setOrientation((o) =>
            o === ORIENTATION.HORIZONTAL ? ORIENTATION.VERTICAL : ORIENTATION.HORIZONTAL
        );

    // [2.1.9] Player nhấn "Bắt đầu tấn công" → onClick "Bắt đầu tấn công"
    const handleStartBattle = () => {
        if (!allPlaced) return; // [2.1.8] guard fleetPlaced < 5
        dispatch(startBattle()); // [2.1.10] dispatch(startBattle) → phase='PLAYER_TURN' → UC-03
    };

    return (
        <div className="setup-board">

            {/* ── Fleet panel ── */}
            <div className="setup-sidebar">

                {/* [2.1.2] Danh sách 5 tàu — [2.1.3] Player chọn tàu từ đây
                    [2.1.7] re-render khi store update (placed=true → tàu bị gạch) */}
                <ShipList
                    fleet={playerFleet}
                    selectedId={selectedShipId}
                    onSelect={handleSelectShip}
                />

                <div className="setup-controls">

                    {/* [2.1.4] Chọn hướng đặt tàu (ngang/dọc) trước khi click ô */}
                    <button className="setup-orient-btn" onClick={toggleOrientation}>
                        {orientation === ORIENTATION.HORIZONTAL ? '↔ Nằm Ngang' : '↕ Thẳng Đứng'}
                    </button>

                    {/* [2.1.8] fleetPlaced < 5 → disabled | [fleetPlaced = 5] → enabled
                        [2.1.9] onClick → handleStartBattle */}
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

                {/* [2.1.2] Bảng 10×10 — [2.1.6] re-render khi store update sau mỗi lần đặt tàu
                    disabled=true khi chưa chọn tàu → "Cell 100 disabled" trong sequence */}
                <Grid
                    board={playerBoard}
                    onCellClick={handleCellClick}
                    disabled={!selectedShip}
                />

                <p className="setup-board-label">Bảng Của Bạn</p>

                {/* [2.3.2] Hiển thị lỗi khi vị trí không hợp lệ
                    "hiển thị thông báo lỗi: Vị trí không hợp lệ..." trong sequence */}
                {errorMsg && (
                    <p className="setup-error-msg">{errorMsg}</p>
                )}

            </div>
        </div>
    );
}