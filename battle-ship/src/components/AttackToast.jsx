import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector } from '../store/index.js';
import '../styles/attack-toast.css';

// Cấu hình UI mặc định cho các loại thông báo (icon, text, class đổi màu)
const TOAST_CONFIG = {
  miss:  { label: '— trượt mục tiêu —',    sub: 'Không có tàu tại tọa độ này', icon: '💨', mod: 'attack-toast--miss' },
  hit:   { label: '▲ xác nhận bắn trúng',  sub: null, icon: '🔥', mod: 'attack-toast--hit'  },
  sunk:  { label: '▼▼ tàu địch bị tiêu diệt', sub: null, icon: '💥', mod: 'attack-toast--sunk' },
};

// Thời gian hiển thị của thông báo (2000 mili-giây = 2 giây)
const DURATION_MS = 2000;

export default function AttackToast({ result }) {
    // visible: Quản lý class CSS (is-visible/is-hidden) để tạo hiệu ứng mượt mà
    const [visible, setVisible] = useState(false);
    // current: Lưu trữ nội dung của thông báo đang được hiển thị lên màn hình
    const [current, setCurrent] = useState(null);
    // timerRef: Lưu trữ bộ đếm thời gian để có thể chủ động ngắt (clearTimeout) khi cần
    const timerRef = useRef(null);

    // Lấy thông tin bản đồ, chuỗi combo và điểm số vừa nhận từ Redux store
    const { playerBoard, computerBoard, comboStreak, comboMultiplier, lastScoreDelta } = 
        useAppSelector((state) => state.game);

    // useEffect chạy mỗi khi nhận được kết quả bắn mới (result)
    useEffect(() => {
        // Nếu không có kết quả bắn hợp lệ thì bỏ qua, không làm gì
        if (!result || !TOAST_CONFIG[result]) return;

        // Xóa bộ đếm thời gian cũ nếu người chơi bắn liên tiếp quá nhanh
        clearTimeout(timerRef.current);
        // Tạm ẩn thông báo hiện tại đi
        setVisible(false);

        // requestAnimationFrame: Đợi trình duyệt xử lý xong việc ẩn ở trên, 
        // rồi mới kích hoạt lại để CSS Animation (hiệu ứng trượt) chạy lại từ đầu
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Tạo một bản sao cấu hình thông báo để chỉnh sửa nội dung động
                let toastData = { ...TOAST_CONFIG[result] };

                // Tính toán chuỗi động: Nếu bắn trúng hoặc nhấn chìm tàu, 
                // đính kèm thông tin chuỗi combo liên tiếp và điểm số vào trường "label"
                if (result === 'hit') {
                    toastData.label = `Trúng! Chuỗi liên tiếp: ${comboStreak} phát (x${comboMultiplier}) +${lastScoreDelta}đ`;
                } else if (result === 'sunk') {
                    toastData.label = `Hạ gục tàu! Chuỗi liên tiếp: ${comboStreak} phát +${lastScoreDelta}đ`;
                }

                // Cập nhật dữ liệu mới và ra lệnh hiển thị Toast
                setCurrent(toastData);
                setVisible(true);

                // Cài đặt đồng hồ: Tự động ẩn thông báo sau 2 giây (DURATION_MS)
                timerRef.current = setTimeout(() => {
                    setVisible(false);
                }, DURATION_MS);
            });
        });

        // Hàm dọn dẹp (cleanup): Tránh rò rỉ bộ nhớ khi component bị xóa khỏi màn hình
        return () => clearTimeout(timerRef.current);
        
    }, [result, playerBoard, computerBoard, comboStreak, comboMultiplier, lastScoreDelta]); 
    // Đã bổ sung thêm các biến từ Redux vào mảng dependency để React theo dõi chính xác dữ liệu mới nhất

    // Nếu dữ liệu thông báo chưa có, Component sẽ trả về null (không render gì ra HTML)
    if (!current) return null;

    // Sử dụng createPortal để bơm thẳng HTML của thông báo ra thẻ <body> ngoài cùng,
    // giúp Toast luôn nổi bọt lên lớp trên cùng của trang web mà không bị che khuất.
    return createPortal(
        <div
            className={`attack-toast ${current.mod} ${visible ? 'is-visible' : 'is-hidden'}`}
            role="status"        // Thuộc tính hỗ trợ người khiếm thị đọc thông báo
            aria-live="polite"   // Báo cho trình duyệt biết đây là vùng thay đổi nội dung động
        >
            <div className="attack-toast__stripe" />
            <div className="attack-toast__icon-wrap">
                <span className="attack-toast__icon">{current.icon}</span>
            </div>
            <div className="attack-toast__body">
                <span className="attack-toast__type">{current.label}</span>
                
                {current.sub && <span className="attack-toast__sub">{current.sub}</span>}
            </div>
            <div className="attack-toast__ping" />
        </div>,
        document.body
    );
}