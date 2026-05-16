import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../store/index.js';
import { startGame } from '../store/gameSlice.js';
import { WINNER, CELL_STATE } from '../constants/gameConstants.js';
import '../styles/game-over.css';

/**
 * COMPONENT PHỤ: EnemyBoardReveal
 * Đáp ứng Hậu điều kiện số 3 (Mục 5) & Bước 5.1.5 / 5.2.5: 
 * Tiết lộ toàn bộ vị trí hạm đội Máy tính để Player xem lại.
 */
function EnemyBoardReveal({ board, fleet }) {
    // 1. Thu thập tất cả tọa độ có tàu của máy tính từ danh sách hạm đội (fleet)
    const shipCells = new Set();
    if (Array.isArray(fleet)) {
        fleet.forEach((ship) => {
            ship.positions?.forEach(({ row, col }) => {
                shipCells.add(`${row}-${col}`);
            });
        });
    }

    return (
        <div className="rs-board-grid">
            {board.map((rowArr, r) =>
                rowArr.map((cell, c) => {
                    const key = `${r}-${c}`;
                    // Lấy trạng thái của ô cờ (hỗ trợ cả trường hợp cell là Object hoặc String)
                    const state = cell?.state ?? cell;

                    let cellClass = 'rs-cell';

                    // 2. Phân loại hiển thị theo đúng logic trạng thái ô cờ
                    if (state === CELL_STATE.SUNK) {
                        cellClass += ' rs-cell--sunk';
                    } else if (state === CELL_STATE.HIT) {
                        cellClass += ' rs-cell--hit'; 
                    } else if (state === CELL_STATE.MISS) {
                        cellClass += ' rs-cell--miss';
                    } 
                    // Nếu ô cờ có trạng thái SHIP gốc hoặc nằm trong danh sách hạm đội của máy tính
                    else if (state === CELL_STATE.SHIP || shipCells.has(key)) {
                        cellClass += ' rs-cell--ship-reveal'; 
                    }

                    return <div key={key} className={cellClass} />;
                })
            )}
        </div>
    );
}
/**
 * COMPONENT CHÍNH: ResultScreen
 * Thực hiện giao diện kết thúc ván chơi (UC-05).
 */
export default function ResultScreen() {
    const dispatch = useAppDispatch();
    const [showEnemyBoard, setShowEnemyBoard] = useState(false);

    // Bước 5.1.0 & 5.2.0: Kích hoạt tự động lấy dữ liệu trạng thái từ Redux Store
    const { winner, computerBoard, computerFleet } = useAppSelector((state) => state.game);
    
    // Bước 5.1.1, 5.1.2 & 5.2.1, 5.2.2: Kiểm tra điều kiện phân tách Luồng chính / Luồng thay thế
    const isPlayerWinner = winner === WINNER.PLAYER;

    // Luồng phụ 8.1 (Bước 1): Hàm xử lý khi Player click nút "Chơi lại"
    const handleRestart = () => dispatch(startGame());
    
    // Luồng phụ 8.2 (Bước 1): Hàm xử lý khi Player click nút "Quay về menu chính"
    const handleBackToMenu = () => window.location.reload();

    return (
        /* Hậu điều kiện 2 (Mục 5) & Bước 5.1.4 / 5.2.4: 
           Lớp phủ '.rs-overlay' chặn tương tác, vô hiệu hóa toàn bộ click lên bảng đối thủ phía dưới.
           Mục 11 (Yêu cầu phi chức năng): Hiển thị overlay trên cùng màn hình, không cần cuộn trang.
        */
        <div className="rs-overlay">
            <div className="rs-modal" role="dialog" aria-modal="true">

                {/* KHỐI HIỂN THỊ KẾT QUẢ RẼ NHÁNH THEO TỪNG LUỒNG ĐẶC TẢ */}
                <div className="rs-header-dark">
                    <div className="rs-icon-circle">
                        {isPlayerWinner ? '🏆' : '💀'}
                    </div>
                    
                    {isPlayerWinner ? (
                        /* --- LUỒNG CHÍNH: PLAYER THẮNG --- */
                        <>
                            {/* Bước 5.1.3: Render text label kết quả Thắng rõ ràng, dễ đọc (RUL-03) */}
                            <h1 className="rs-title">BẠN ĐÃ THẮNG!</h1>
                            <p className="rs-reason">Toàn bộ tàu đối thủ đã bị nhấn chìm.</p>
                        </>
                    ) : (
                        /* --- LUỒNG THAY THẾ 5.2: PLAYER THUA --- */
                        <>
                            {/* Bước 5.2.3: Render text label kết quả Thua rõ ràng, dễ đọc */}
                            <h1 className="rs-title">BẠN ĐÃ THUA!</h1>
                            <p className="rs-reason">Toàn bộ tàu của bạn đã bị nhấn chìm.</p>
                        </>
                    )}
                </div>

                <div className="rs-modal-body">
                    <hr className="rs-divider" />

                    {/* Hậu điều kiện 3 (Mục 5) & Bước 5.1.5 / 5.2.5: 
                        Tiết lộ hạm đội của Máy tính để Player xem lại vị trí. 
                    */}
                    <div className="rs-reveal-section">
                        {!showEnemyBoard ? (
                            <button
                                className="rs-btn-outline"
                                onClick={() => setShowEnemyBoard(true)}
                            >
                                👁️ Xem vị trí tàu đối thủ
                            </button>
                        ) : (
                            <div className="rs-enemy-reveal-box">
                                <p className="rs-stats-label">Hạm đội của Máy tính</p>

                                <EnemyBoardReveal
                                    board={computerBoard}
                                    fleet={computerFleet}
                                />

                                {/* Legend giải thích các ký hiệu trên bảng khi kết thúc */}
                                <div className="rs-legend">
                                    <span className="rs-legend-item">
                                        <span className="rs-legend-dot rs-legend-dot--miss" />
                                        Bắn trượt
                                    </span>
                                    <span className="rs-legend-item">
                                        <span className="rs-legend-dot rs-legend-dot--sunk" />
                                        Nhấn chìm
                                    </span>
                                </div>

                                <button
                                    className="rs-link-action"
                                    onClick={() => setShowEnemyBoard(false)}
                                >
                                    Đóng lại
                                </button>
                            </div>
                        )}
                    </div>

                    {/* Bước 5.1.6 / 5.2.6 & Mục 11 (NFR): 
                        Hiển thị nhóm nút chức năng điều hướng tập trung tại chân màn hình kết quả.
                    */}
                    <div className="rs-actions">
                        {/* Bước 5.1.7 -> Kích hoạt Luồng phụ 8.1: 
                            Gửi tín hiệu reset dữ liệu (dispatch(startGame())) đưa hệ thống về UC-01 
                        */}
                        <button className="rs-btn rs-btn-primary" onClick={handleRestart}>
                            🔄 CHƠI LẠI VÁN MỚI
                        </button>

                        {/* Bước 5.2.7 -> Kích hoạt Luồng phụ 8.2: 
                            Gọi lệnh reload trình duyệt, giải phóng bộ nhớ tạm đưa người chơi về Menu chính 
                        */}
                        <button className="rs-btn rs-btn-secondary" onClick={handleBackToMenu}>
                            🏠 QUAY VỀ MENU CHÍNH
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}