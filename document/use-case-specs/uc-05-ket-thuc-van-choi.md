# Đặc tả Use Case: Kết Thúc Ván Chơi

## Lịch sử chỉnh sửa

| Phiên bản | Ngày | Tác giả | Mô tả |
|-----------|------|---------|-------|
| 1.0 | 27/04/2026 | Cao Văn Vượng | Phiên bản đầu tiên — sinh từ URD v2.0 (US-09, US-10) |
| 1.1 | 13/05/2026 | Cao Văn Vượng | Cập nhật đánh số các bước; Thêm bước 0 vào luồng chính và luồng thay thế để xác định tiền điều kiện và trigger |
| 1.2 | 05/06/2026 | Võ Khương Đại Bảo | Hoàn thiện lần 2: (1) Sửa đánh số Sub-flow thành SF.1/SF.2; (2) Bổ sung bước kết thúc rõ ràng tại 5.1.8 và 5.2.8; (3) Loại bỏ chi tiết implementation khỏi Sub-flow; (4) Thêm Mục 7 — Bảng trạng thái hiển thị khi reveal hạm đội; (5) Thêm Mục 12 — Thống kê tóm tắt cuối ván; (6) Thêm Mục 13 — Thứ tự hiển thị sau khi ván kết thúc; (7) Bổ sung ghi chú loại trừ trạng thái hòa |

---

## 1. Giới thiệu

| Trường | Nội dung |
|--------|----------|
| Use Case ID | UC-05 |
| Tên Use Case | Kết Thúc Ván Chơi |
| Độ ưu tiên | MUST — Phải có, vì hệ thống phải xác định ván chơi kết thúc và hiển thị kết quả thắng/thua rõ ràng cho Player. |
| Actor chính | Player |
| Actor phụ | Không có |

---

## 2. Mô tả Use Case

Hệ thống phát hiện điều kiện kết thúc ván chơi — toàn bộ tàu của một bên bị nhấn chìm — và hiển thị kết quả (THẮNG hoặc THUA) cùng lý do rõ ràng cho `Player`. Sau khi ván kết thúc, mọi tương tác tấn công bị vô hiệu hóa và `Player` được cung cấp tùy chọn bắt đầu ván mới.

---

## 3. Điều kiện tiên quyết (Pre-conditions)

1. Ván chơi đang ở giai đoạn tấn công (UC-03 hoặc UC-04 vừa xử lý xong một lượt tấn công).
2. Toàn bộ tàu của ít nhất một bên (`Player` hoặc Máy tính) đã bị nhấn chìm.

---

## 4. Sự kiện kích hoạt (Trigger)

Hệ thống tự động phát hiện điều kiện kết thúc sau khi xử lý kết quả lượt tấn công dẫn đến trạng thái Sunk tàu cuối cùng của một bên.

---

## 5. Hậu điều kiện (Post-conditions)

1. Giao diện hiển thị thông báo kết thúc rõ ràng với kết quả (THẮNG hoặc THUA) và lý do, trong cùng một màn hình.
2. Toàn bộ tương tác tấn công (click lên bảng đối thủ) bị vô hiệu hóa.
3. Bảng của Máy tính — bao gồm vị trí toàn bộ tàu đã được ẩn trong suốt ván chơi — được tiết lộ theo đúng bảng trạng thái hiển thị (xem Mục 7).
4. Thống kê tóm tắt ván đấu được hiển thị tạm thời trên màn hình kết thúc (xem Mục 12).
5. `Player` có thể bắt đầu ván chơi mới thông qua nút "Chơi lại" (quay lại UC-01) hoặc quay về menu chính.

---

## 6. Luồng chính (Normal Flow) — Player thắng

> Luồng chính khi toàn bộ tàu của Máy tính bị nhấn chìm và `Player` thắng.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **5.1.0** | Hệ thống | Ván chơi đang trong lượt tấn công và hệ thống ghi nhận tàu cuối cùng của Máy tính bị nhấn chìm từ UC-03. |
| **5.1.1** | Hệ thống | Phát hiện toàn bộ tàu của Máy tính đã bị nhấn chìm sau lượt tấn công của `Player` (từ UC-03). |
| **5.1.2** | Hệ thống | Xác định kết quả — `Player` thắng. |
| **5.1.3** | Hệ thống | Hiển thị thông báo kết thúc với text label "THẮNG" và lý do "Toàn bộ tàu đối thủ đã bị nhấn chìm." trên màn hình hiện tại, không cần thao tác thêm từ `Player`. |
| **5.1.4** | Hệ thống | Vô hiệu hóa toàn bộ tương tác tấn công — `Player` không thể click thêm ô trên bảng đối thủ. |
| **5.1.5** | Hệ thống | Hiển thị thống kê tóm tắt ván đấu (tổng lượt bắn, tỉ lệ trúng, số tàu còn lại) ngay bên dưới thông báo kết quả. |
| **5.1.6** | Hệ thống | Tiết lộ toàn bộ vị trí hạm đội Máy tính trên bảng theo bảng trạng thái hiển thị (Mục 7) để `Player` xem lại. |
| **5.1.7** | Hệ thống | Hiển thị nhóm nút chức năng điều hướng bao gồm **"Chơi lại"** và **"Quay về menu chính"** tập trung tại chân màn hình kết quả. |
| **5.1.8** | `Player` | Chọn thực hiện một trong hai hành động điều hướng (Chuyển tiếp đến **Luồng phụ SF.1** hoặc **SF.2**). Kết thúc use case. |

---

## 7. Bảng trạng thái hiển thị khi reveal hạm đội *(Mới — v1.2)*

> Áp dụng cho bước 5.1.6 và 5.2.6 khi hệ thống tiết lộ toàn bộ vị trí hạm đội Máy tính sau khi ván kết thúc.

| Trạng thái ô | Màu hiển thị | Ký hiệu | Mô tả |
|---|---|---|---|
| Tàu (chưa bị tấn công) | Xám nhạt (`#AAAAAA`) | ■ | Tiết lộ sau khi ván kết thúc |
| Bắn trúng (HIT) | Đỏ (`#FF4444`) | ✕ | Hiển thị trong suốt ván chơi |
| Tàu bị nhấn chìm (SUNK) | Đỏ đậm (`#AA0000`) | ✕ | Toàn bộ ô của tàu đó |
| Bắn trượt (MISS) | Xanh dương nhạt (`#AADDFF`) | ● | Hiển thị trong suốt ván chơi |
| Ô trống (chưa bắn) | Trắng / nền mặc định | — | Không thay đổi sau reveal |

> **Lưu ý:** Thứ tự hiển thị sau khi ván kết thúc được quy định chi tiết tại Mục 13.

---

## 8. Luồng thay thế (Alternate Flows)

### 8.1. Luồng thay thế 5.2 — Player thua

> Rẽ nhánh từ bước **5.1** — Áp dụng khi điều kiện kích hoạt là toàn bộ tàu của `Player` bị nhấn chìm (từ UC-04), thay vì toàn bộ tàu Máy tính bị nhấn chìm.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **5.2.0** | Hệ thống | Ván chơi đang trong lượt tấn công của Máy tính và hệ thống ghi nhận tàu cuối cùng của `Player` bị nhấn chìm từ UC-04. |
| **5.2.1** | Hệ thống | Phát hiện toàn bộ tàu của `Player` đã bị nhấn chìm sau lượt tấn công của Máy tính (từ UC-04). |
| **5.2.2** | Hệ thống | Xác định kết quả — `Player` thua. |
| **5.2.3** | Hệ thống | Hiển thị thông báo kết thúc với text label "THUA" và lý do "Toàn bộ tàu của bạn đã bị nhấn chìm." trên màn hình hiện tại. |
| **5.2.4** | Hệ thống | Vô hiệu hóa toàn bộ tương tác tấn công. |
| **5.2.5** | Hệ thống | Hiển thị thống kê tóm tắt ván đấu (tổng lượt bắn, tỉ lệ trúng, số tàu còn lại) ngay bên dưới thông báo kết quả. |
| **5.2.6** | Hệ thống | Tiết lộ toàn bộ vị trí hạm đội Máy tính trên bảng theo bảng trạng thái hiển thị (Mục 7) để `Player` xem lại. |
| **5.2.7** | Hệ thống | Hiển thị nhóm nút chức năng điều hướng bao gồm **"Chơi lại"** và **"Quay về menu chính"** tập trung tại chân màn hình kết quả. |
| **5.2.8** | `Player` | Chọn thực hiện một trong hai hành động điều hướng (Chuyển tiếp đến **Luồng phụ SF.1** hoặc **SF.2**). Kết thúc use case. |

---

## 9. Luồng phụ điều hướng (Sub-flows) *(Cập nhật — v1.2)*

> SF.1 và SF.2 là luồng dùng chung (shared sub-flows) — áp dụng đồng nhất cho cả kết quả THẮNG (bước 5.1.8) và THUA (bước 5.2.8).

### 9.1. Luồng phụ SF.1: Khởi tạo ván chơi mới

> Kích hoạt khi `Player` lựa chọn nút hành động **"Chơi lại"**.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| 1 | `Player` | Click chọn nút **"Chơi lại"**. |
| 2 | Hệ thống | Phát tín hiệu reset lên kho lưu trữ trạng thái toàn cục để xóa dữ liệu ván đấu cũ. |
| 3 | Hệ thống | Xóa sạch toàn bộ dữ liệu runtime của ván đấu cũ (lưới ô cờ, danh sách tàu chìm/nổi, thống kê) về trạng thái trống ban đầu. |
| 4 | Hệ thống | Tự động chuyển hướng màn hình và kích hoạt lại Use Case thiết lập ván chơi mới (**UC-01**). Kết thúc use case. |

### 9.2. Luồng phụ SF.2: Quay về menu chính

> Kích hoạt khi `Player` lựa chọn nút hành động **"Quay về menu chính"**.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| 1 | `Player` | Click chọn nút **"Quay về menu chính"**. |
| 2 | Hệ thống | Đặt lại toàn bộ trạng thái ứng dụng về giá trị khởi tạo mặc định, giải phóng toàn bộ dữ liệu ván đấu đang lưu trong bộ nhớ tạm. |
| 3 | Hệ thống | Tải lại ứng dụng và chuyển hướng người chơi ra màn hình Menu khởi động mặc định. Kết thúc use case. |

---

## 10. Luồng ngoại lệ (Exception Flows)

Không có exception flow chính thức cho UC-05. Nếu nút "Chơi lại" gặp lỗi khi kích hoạt UC-01, hệ thống xử lý theo exception flow UC-01 §8.1 (Ngoại lệ 1.E1).

---

## 11. Quan hệ Use Case (Includes / Extends)

**«include»:** Không có.

**«extend» — mở rộng:**
- **UC-03** — Thực hiện lượt tấn công (Người chơi): UC-05 mở rộng UC-03 khi `Player` nhấn chìm tàu cuối cùng của Máy tính → kết quả `Player` thắng.
- **UC-04** — Thực hiện lượt tấn công (Máy tính): UC-05 mở rộng UC-04 khi Máy tính nhấn chìm tàu cuối cùng của `Player` → kết quả `Player` thua.

---

## 12. Thống kê tóm tắt cuối ván *(Mới — v1.2)*

> Các chỉ số dưới đây được tính toán và hiển thị tạm thời trên màn hình kết thúc. Dữ liệu **không được lưu trữ** sau khi rời màn hình (tuân thủ RUL-09, RUL-10).

| Chỉ số | Mô tả |
|--------|-------|
| Tổng số lượt bắn | Tổng lượt tấn công `Player` đã thực hiện trong ván |
| Tỉ lệ bắn trúng (%) | Số lần HIT / Tổng lượt bắn × 100 |
| Số tàu đối thủ còn lại | Số tàu Máy tính chưa bị nhấn chìm (= 0 nếu `Player` thắng) |
| Số tàu Player còn lại | Số tàu `Player` chưa bị nhấn chìm (= 0 nếu `Player` thua) |

---

## 13. Thứ tự hiển thị sau khi ván kết thúc *(Mới — v1.2)*

Sau khi hệ thống phát hiện điều kiện kết thúc, các thành phần UI được hiển thị theo thứ tự sau — tất cả trong cùng một màn hình, không yêu cầu cuộn trang:

| Thứ tự | Thành phần hiển thị |
|--------|---------------------|
| 1 | Thông báo kết quả: text label **THẮNG** hoặc **THUA** + lý do kết thúc. |
| 2 | Bảng thống kê tóm tắt: số lượt bắn, tỉ lệ trúng, số tàu còn lại (xem Mục 12). |
| 3 | Reveal bảng hạm đội Máy tính theo trạng thái hiển thị (xem Mục 7). |
| 4 | Nhóm nút điều hướng: **"Chơi lại"** và **"Quay về menu chính"**. |

---

## 14. Quy tắc nghiệp vụ áp dụng

| ID | Quy tắc | Nguồn |
|----|---------|-------|
| RUL-03 | Người chơi thắng khi toàn bộ tàu của đối thủ bị nhấn chìm. | BRD §4.2 |
| RUL-08 | Không áp dụng quy tắc đặc biệt trong phiên bản 1 (ví dụ: không có điều kiện hòa). | BRD §4.2 |
| RUL-09 | Phiên bản 1 không bao gồm tính năng điểm số hoặc xếp hạng. | BRD §4.2 |
| RUL-10 | Phiên bản 1 không lưu lịch sử trận đấu. | BRD §4.2 |

---

## 15. Yêu cầu phi chức năng (Non-Functional Requirements)

- Thông báo kết quả (THẮNG/THUA), thống kê và nút điều hướng phải hiển thị trên cùng một màn hình, không yêu cầu cuộn trang hoặc thao tác thêm. *(US-10 — AC)*
- Text label kết quả phải rõ ràng, dễ đọc, phân biệt được với các thành phần khác trên màn hình. *(US-09 — AC)*
- Nút "Chơi lại" phải hiển thị ngay sau thông báo kết thúc trên cùng màn hình. *(US-09 — AC)*
- Thống kê tóm tắt chỉ là hiển thị tạm thời — không được ghi vào bộ nhớ lâu dài. *(RUL-09, RUL-10)*

---

## 16. Ghi chú

**Giả định và quyết định thiết kế:**
- Phiên bản 1 không lưu trữ lịch sử ván chơi, điểm số, hoặc thống kê sau khi ván kết thúc; kết quả và thống kê chỉ hiển thị tại màn hình kết thúc. *(CON-05)*
- Ván chơi chỉ kết thúc theo điều kiện nhấn chìm toàn bộ tàu (RUL-03); không có điều kiện hòa hoặc giới hạn thời gian trong phiên bản 1 (RUL-08). Cơ chế lượt đơn (mỗi lượt chỉ một bên tấn công) đảm bảo trạng thái cả hai bên cùng bị nhấn chìm trong một lượt là không thể xảy ra.
- UC-05 được kích hoạt bởi hệ thống (system-triggered) sau khi UC-03 hoặc UC-04 phát hiện điều kiện kết thúc; `Player` là người hưởng lợi, không phải người khởi động use case này.
- Sub-flow SF.1 và SF.2 là luồng dùng chung (shared sub-flows) — áp dụng đồng nhất cho cả kết quả THẮNG và THUA; không phân biệt theo luồng chính hay luồng thay thế.

**Nguồn & Tham chiếu:**
- **Nguồn URD:** US-09 (EP-04), US-10 (EP-04) — `document/user-requirements.md`
- **Use case liên quan:** UC-03 hoặc UC-04 kích hoạt UC-05; UC-05 hoàn tất có thể quay lại UC-01 qua nút "Chơi lại".
- **Sơ đồ use case:** `document/use-case-diagram.md`