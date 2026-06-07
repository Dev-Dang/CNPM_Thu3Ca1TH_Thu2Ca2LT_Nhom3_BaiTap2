import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useAppSelector } from '../store/index.js';
import '../styles/attack-toast.css';

const TOAST_CONFIG = {
  miss:  { typeLabel: '— trượt mục tiêu —',    sub: 'Không có tàu tại tọa độ này', icon: '💨', mod: 'attack-toast--miss' },
  hit:   { typeLabel: '▲ xác nhận bắn trúng',  sub: null, icon: '🔥', mod: 'attack-toast--hit'  },
  sunk:  { typeLabel: '▼▼ tàu địch bị tiêu diệt', sub: null, icon: '💥', mod: 'attack-toast--sunk' },
};

const DURATION_MS = 2000;

export default function AttackToast({ result }) {
    const [visible, setVisible] = useState(false);
    const [current, setCurrent] = useState(null);
    const timerRef = useRef(null);

    // Lấy thông tin bản đồ, chuỗi combo và điểm số vừa nhận từ Redux store
    const { playerBoard, computerBoard, comboStreak, comboMultiplier, lastScoreDelta } = 
        useAppSelector((state) => state.game);

    useEffect(() => {
        if (!result || !TOAST_CONFIG[result]) return;

        clearTimeout(timerRef.current);
        setVisible(false);

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                // Tạo một bản sao cấu hình thông báo để chỉnh sửa nội dung động
                let toastData = { ...TOAST_CONFIG[result] };

                // Nếu bắn trúng hoặc nhấn chìm tàu, đính kèm thông tin chuỗi combo liên tiếp
                if (result === 'hit') {
                    toastData.label = `Trúng! Chuỗi liên tiếp: ${comboStreak} phát (x${comboMultiplier}) +${lastScoreDelta}đ`;
                } else if (result === 'sunk') {
                    toastData.label = `Hạ gục tàu! Chuỗi liên tiếp: ${comboStreak} phát +${lastScoreDelta}đ`;
                }

                setCurrent(toastData);
                setVisible(true);

                timerRef.current = setTimeout(() => {
                    setVisible(false);
                }, DURATION_MS);
            });
        });

        return () => clearTimeout(timerRef.current);
        
    }, [result, playerBoard, computerBoard]);

    if (!current) return null;

    return createPortal(
        <div
            className={`attack-toast ${current.mod} ${visible ? 'is-visible' : 'is-hidden'}`}
            role="status"
            aria-live="polite"
        >
            <div className="attack-toast__stripe" />
            <div className="attack-toast__icon-wrap">
            <span className="attack-toast__icon">{current.icon}</span>
            </div>
            <div className="attack-toast__body">
            <span className="attack-toast__type">{current.typeLabel}</span>
            {current.sub && <span className="attack-toast__sub">{current.sub}</span>}
            </div>
            <div className="attack-toast__ping" />
        </div>,
        document.body
    );
}