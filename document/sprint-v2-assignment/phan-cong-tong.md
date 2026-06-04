# Phân Công Sprint Nâng Cấp Battleship v2

**Dự án:** Trò chơi Battleship  
**Ngày lập:** 05-06-2026  
**Nguồn:** BRD v1.2.1, URD v2.1, Use Case Diagram v2.1

---

## Hồ Hoàn Ngọc Sơn

- Ownership mới: `UC-01 - Bắt đầu ván chơi`
- Phân công v2: Chọn độ khó `Easy/Normal` và khởi tạo ván theo độ khó
- Liên quan: `UC-01`, `US-01`, `US-02`, `US-13`
- Output: Người chơi chọn được `Easy/Normal` trước ván; ván mới khởi tạo đúng cấu hình độ khó

## Đặng Văn Trung

- Ownership mới: `UC-02 - Đặt tàu`
- Phân công v2: Fleet theo độ khó, Auto-Place, đặt/điều chỉnh tàu trong setup
- Liên quan: `UC-02`, `US-03`, `US-04`, `US-05`, `US-11`, `US-12`
- Output: `Easy 10x10 / 5 tàu`; `Normal 12x12 / 8 tàu`; Auto-Place và đặt tàu hợp lệ

## Cao Văn Vượng

- Ownership mới: `UC-03 - Người chơi tấn công`
- Phân công v2: Lượt tấn công của Người chơi, bắn tiếp khi trúng, điểm số và combo
- Liên quan: `UC-03`, `US-06`, `US-07`, `US-14`, `US-15`
- Output: Người chơi bắn trúng được bắn tiếp; miss chuyển lượt; điểm/combo cập nhật đúng

## Bùi Hữu Trí

- Ownership mới: `UC-04 - Máy tính tấn công`
- Phân công v2: Logic Máy tính theo độ khó và bắn tiếp khi trúng
- Liên quan: `UC-04`, `US-08`, `US-13`, `US-14`
- Output: Easy bắn ngẫu nhiên; Normal Hunt-and-Target; Máy tính bắn tiếp khi trúng

## Võ Khương Đại Bảo

- Ownership mới: `UC-05 - Kết thúc ván chơi`
- Phân công v2: Kết thúc ván, High Score, theme sáng/tối
- Liên quan: `UC-05`, `UC-06`, `US-09`, `US-10`, `US-16`, `US-17`
- Output: Hiển thị kết quả cuối ván; lưu High Score cục bộ; chuyển Light/Dark Theme

---

## Ghi Chú Tích Hợp

- State/config chung `difficulty`, `boardSize`, `fleet`, `score`, `combo`, `highScore`, `theme`: cả nhóm cần thống nhất.
- Refactor hard-code bảng `10x10` sang cấu hình theo độ khó: Sơn + Trung.
- Luật bắn tiếp khi trúng cho cả Người chơi và Máy tính: Vượng + Trí.
- UI thống nhất cho difficulty, score, combo, High Score, theme: Sơn + Vượng + Bảo.
