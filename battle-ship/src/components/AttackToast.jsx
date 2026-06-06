import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector } from '../store/index.js';
import '../styles/attack-toast.css';

const TOAST_CONFIG = {
    miss:  { label: 'Trượt!', icon: '💨', mod: 'attack-toast--miss' },
    hit:   { label: 'Trúng!', icon: '🔥', mod: 'attack-toast--hit'  },
    sunk:  { label: 'Đã nhấn chìm tàu!', icon: '💥', mod: 'attack-toast--sunk' },
};
//thời gian hiển thị toast
const DURATION_MS = 2000;

//logic của AttackToast: sẽ lấy thông tin bản đồ khi có sự thay đổi trên bản đồ sẽ hiển thị ra thông báo

export default function AttackToast({ result }) {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(null);
    const timerRef = useRef(null);

    // 1. Lấy thông tin 2 bản đồ đấu từ Redux store
    const playerBoard = useAppSelector((state) => state.game.playerBoard);
    const computerBoard = useAppSelector((state) => state.game.computerBoard);

    useEffect(() => {
        if (!result || !TOAST_CONFIG[result]) return;

        // Tắt ngay bộ đếm thời gian cũ và ẩn toast hiện tại để chuẩn bị cho hiệu ứng mới
        clearTimeout(timerRef.current);
        setVisible(false);

        // Ép trình duyệt render lại frame giao diện mới (Reset hoàn toàn Animation)
        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                setCurrent(TOAST_CONFIG[result]);
                setVisible(true);

                timerRef.current = setTimeout(() => {
                    setVisible(false);
                }, DURATION_MS);
            });
        });

        return () => clearTimeout(timerRef.current);
        
    // 2. THẦN CHÚ Ở ĐÂY: Đưa playerBoard và computerBoard vào mảng phụ thuộc (dependencies)
    // Mỗi khi bắn, 1 trong 2 bảng thay đổi reference -> useEffect chắc chắn sẽ chạy lại từ đầu!
    }, [result, playerBoard, computerBoard]);

    if (!current) return null;

    return createPortal(
        <div
            className={`attack-toast ${current.mod} ${visible ? 'is-visible' : 'is-hidden'}`}
            role="status"
            aria-live="polite"
        >
            <span className="attack-toast__icon">{current.icon}</span>
            <span className="attack-toast__label">{current.label}</span>
        </div>,
        document.body
    );
}