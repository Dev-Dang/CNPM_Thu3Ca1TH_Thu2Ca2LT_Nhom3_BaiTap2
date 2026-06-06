# Đặc tả Use Case: Thực Hiện Lượt Tấn Công (Máy Tính)

## Lịch sử chỉnh sửa

| Phiên bản | Ngày       | Tác giả | Mô tả |
|-----------|------------|---------|-------|
| 1.0       | 27/04/2026 | Đặng Văn Trung | Phiên bản đầu tiên — sinh từ URD v2.0 (US-08) |
| 1.2       | 09/05/2026 | Đặng Văn Trung | Bước 4.7 (chờ 500ms trước chuyển lượt) vào Normal Flow; thêm bước 4.A3.2 (chờ 500ms trước UC-05); cập nhật Post-condition 3. |
| 1.3       | 16/05/2026 | Đặng Văn Trung | <ul><li>Thêm bước 4.1.0 xác định điểm bắt đầu UC-04; tách thành 2 step (4.1.0 — cập nhật state, 4.1.1 — Máy tính nhận lượt)</li><li>Đánh số lại toàn bộ các bước theo cú pháp 4.[Index of Flow].[Step]; thay thế ký hiệu cũ 4.A1/4.A2/4.A3/4.E1 bằng 4.2/4.3/4.4/4.5</li><li>Gộp xác định kết quả Miss/Hit/Sunk vào một bước inline (4.1.3); xóa luồng thay thế Hit và Sunk riêng lẻ</li><li>Đảo thứ tự: kiểm tra end-game (4.1.4) trước hiển thị UI (4.1.5); gộp hiển thị UI về một điểm duy nhất</li><li>Xóa bước chờ 500ms khỏi Normal Flow — chuyển sang NFR; đánh số lại luồng thay thế: 4.2 (end-game), ngoại lệ: 4.3</li><li>Sửa extension point UC-05: chỉ rõ bước 4.1.4 thay vì "bước 4.2"</li><li>Làm rõ ngoại lệ 4.3.1: thay ví dụ JavaScript runtime bằng mô tả trạng thái dữ liệu không nhất quán</li></ul> |

## 1. Giới thiệu

| Trường | Nội dung                                                                                                     |
|--------|--------------------------------------------------------------------------------------------------------------|
| Use Case ID | UC-04                                                                                                        |
| Tên Use Case | Thực Hiện Lượt Tấn Công (Máy Tính)                                                                           |
| Độ ưu tiên | MUST - Phải có, vì máy tính phải thực hiện lượt tấn công để duy trì vòng lặp luân phiên sau lượt của Player. |
| Actor chính | Máy tính                                                                                                     |
| Actor phụ | Không có                                                                                                     |

## 2. Mô tả Use Case

Máy tính tự động thực hiện lượt tấn công lên bảng của `Player` theo logic cơ bản. Hệ thống hiển thị ô bị tấn công và kết quả tương ứng (Hit, Miss, hoặc Sunk) để `Player` theo dõi, sau đó chuyển lại lượt cho `Player`. Use case này lặp lại luân phiên với UC-03 cho đến khi điều kiện kết thúc được kích hoạt.

## 3. Điều kiện tiên quyết (Pre-conditions)

1. `Player` vừa hoàn thành lượt tấn công hợp lệ tại UC-03 mà không dẫn đến kết thúc ván chơi.
2. Bảng của `Player` đang hiển thị với ít nhất một ô chưa bị Máy tính tấn công.

## 4. Sự kiện kích hoạt (Trigger)

`Player` hoàn thành lượt tấn công hợp lệ tại UC-03; hệ thống tự động chuyển sang lượt Máy tính ngay sau đó mà không cần thao tác từ `Player`.

## 5. Hậu điều kiện (Post-conditions)

1. Ô được Máy tính chọn trên bảng `Player` hiển thị kết quả: ký hiệu Miss, Hit, hoặc Sunk (phân biệt bằng màu sắc/icon).
2. Nếu kết quả là Sunk: toàn bộ ô của tàu bị nhấn chìm được đánh dấu bằng ký hiệu Sunk.
3. Kết quả lượt tấn công của Máy tính được hiển thị tối thiểu 500ms trước khi hệ thống tự động chuyển lượt (sang UC-03) hoặc kết thúc ván chơi (kích hoạt UC-05), để `Player` có thời gian quan sát.
4. Hệ thống chuyển sang lượt `Player` (UC-03), hoặc kích hoạt UC-05 nếu toàn bộ tàu `Player` đã bị nhấn chìm.

## 6. Luồng chính (Normal Flow)

> Luồng chính khi Máy tính chọn ô hợp lệ trên bảng `Player` và ván chơi chưa kết thúc.

| Bước      | Actor | Hành động / Phản hồi                                                                                                                                                                             |
|-----------|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **4.1.0** | Hệ thống | UC-03 hoàn tất mà không kết thúc ván chơi → hệ thống cập nhật trạng thái lượt sang Máy tính.                                                                                                     |
| **4.1.1** | Máy tính | Nhận lượt từ hệ thống; bắt đầu xử lý lượt tấn công.                                                                                                                                              |
| **4.1.2** | Máy tính | Chọn một ô chưa bị tấn công trên bảng `Player` theo logic cơ bản.                                                                                                                                |
| **4.1.3** | Hệ thống | Xác định kết quả tấn công:<br>- Ô không chứa tàu → "Trượt" (Miss)<br>- Ô chứa tàu, tàu còn ô khác chưa bị tấn công → "Trúng" (Hit)<br>- Ô chứa tàu, là ô cuối cùng của tàu đó → "Nhấn chìm" (Sunk) |
| **4.1.4** | Hệ thống | Kiểm tra điều kiện kết thúc ván — còn ít nhất một tàu `Player` chưa bị nhấn chìm → chưa kết thúc. *[EP: end-game] Nếu toàn bộ tàu `Player` bị nhấn chìm → kích hoạt UC-05 (Luồng thay thế 4.2).* |
| **4.1.5** | Hệ thống | Đánh dấu ô vừa bị tấn công bằng ký hiệu tương ứng (Miss/Hit/Sunk) trên bảng `Player`; nếu Sunk, đánh dấu toàn bộ ô của tàu bị nhấn chìm.                                                        |
| **4.1.6** | Hệ thống | Chuyển sang lượt `Player`, kích hoạt UC-03.                                                                                                                                                      |
| **4.1.7** | Hệ thống | Kết thúc.                                                                                                                                                                                        |

## 7. Luồng thay thế (Alternate Flows)

### 7.1. Luồng thay thế 4.2 — Toàn bộ tàu Player bị nhấn chìm (Player thua)

> Rẽ nhánh từ bước **4.1.4** *(EP: end-game)* — Áp dụng khi lượt tấn công của Máy tính làm toàn bộ tàu của `Player` bị nhấn chìm.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **4.2.1** | Hệ thống | Xác định toàn bộ tàu `Player` đã bị nhấn chìm. |
| **4.2.2** | Hệ thống | Đánh dấu ô vừa bị tấn công và toàn bộ ô của tàu bị nhấn chìm bằng ký hiệu Sunk trên bảng `Player`. |
| **4.2.3** | Hệ thống | Kích hoạt UC-05 với kết quả `Player` thua. |
| **4.2.4** | Hệ thống | Kết thúc. |

## 8. Luồng ngoại lệ (Exception Flows)

### 8.1. Ngoại lệ 4.3 — Lỗi logic chọn ô tấn công của Máy tính

> Rẽ nhánh từ bước **4.1.2** — Áp dụng khi hệ thống gặp lỗi trong quá trình kiểm tra tính hợp lệ của ô được Máy tính chọn (ví dụ: lỗi runtime hoặc không tìm được ô hợp lệ do lỗi trạng thái).

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **4.3.1** | Hệ thống | Phát hiện lỗi khi kiểm tra tính hợp lệ của ô tại bước **4.1.2** do lỗi runtime hoặc trạng thái dữ liệu không nhất quán, ví dụ không còn ô hợp lệ để chọn nhưng ván chơi chưa được kết thúc đúng. |
| **4.3.2** | Hệ thống | Hiển thị thông báo lỗi "Kết quả lượt chơi gặp lỗi. Vui lòng tải lại trang." |
| **4.3.3** | Hệ thống | Kết thúc không thành công. |

## 9. Quan hệ Use Case (Includes / Extends)

**«include»:**
Không có.

**«extend» — được mở rộng bởi:**
- **UC-05** — Kết thúc ván chơi: UC-05 mở rộng UC-04 tại extension point “điều kiện kết thúc ván chơi được thỏa mãn” ở bước 4.1.4, khi toàn bộ tàu `Player` bị nhấn chìm.

## 10. Quy tắc nghiệp vụ áp dụng

| ID | Quy tắc | Nguồn |
|----|---------|-------|
| RUL-06 | Mỗi ô trên bảng chỉ có thể bị tấn công một lần trong ván chơi. | BRD §4.2 |

## 11. Yêu cầu phi chức năng (Non-Functional Requirements)

- Logic Máy tính không sử dụng thư viện trí tuệ nhân tạo (Artificial Intelligence — AI) hoặc học máy (Machine Learning — ML); hoạt động ở mức thuật toán cơ bản. *(CON-04, ASM-03)*
- Phản hồi lượt tấn công Máy tính (từ khi bắt đầu xử lý đến khi hiển thị kết quả) ≤ 500 ms. *(DoD — Tiêu chí hiệu năng)*
- Kết quả lượt tấn công của Máy tính (Hit/Miss/Sunk) phải được hiển thị tối thiểu 500ms trước khi hệ thống tự động chuyển lượt (sang UC-03) hoặc kết thúc ván chơi (kích hoạt UC-05). *(US-08 — AC; DoD — Tiêu chí ổn định)*
- Ô bị Máy tính tấn công trên bảng `Player` phải hiển thị kết quả rõ ràng, phân biệt được với ô chưa bị tấn công. *(US-08 — AC)*

## 12. Ghi chú

**Giả định và quyết định thiết kế:**
- Máy tính chọn ô tấn công theo thuật toán cơ bản (ví dụ: ngẫu nhiên trên các ô chưa bị tấn công). *(ASM-03)*
- Máy tính không có khả năng học hoặc thích nghi theo chiến thuật của `Player` trong phiên bản 1.
- Mỗi ô trên bảng chỉ có thể bị tấn công một lần trong toàn bộ ván chơi (RUL-06).

**Nguồn & Tham chiếu:**
- **Nguồn URD:** US-08 (EP-03) — `document/user-requirements.md`
- **Use case liên quan:** UC-03 kích hoạt UC-04; UC-04 kích hoạt lại UC-03 hoặc UC-05 tùy kết quả.
- **Sơ đồ use case:** `document/use-case-diagram.md`