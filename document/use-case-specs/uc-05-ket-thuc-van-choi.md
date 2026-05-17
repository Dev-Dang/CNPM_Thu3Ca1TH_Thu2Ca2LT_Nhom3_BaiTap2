# Đặc tả Use Case: Kết Thúc Ván Chơi

## Lịch sử chỉnh sửa

| Phiên bản | Ngày | Tác giả | Mô tả |
|-----------|------|---------|-------|
| 1.0 | 27/04/2026 | Cao Văn Vượng | Phiên bản đầu tiên — sinh từ URD v2.0 (US-09, US-10) |
| 1.1 | 13/05/2026 | Cao Văn Vượng | Cập nhật đánh số các bước; Thêm bước 0 vào luồng chính và luồng thay thế để xác định tiền điều kiện và trigger |

## 1. Giới thiệu

| Trường | Nội dung |
|--------|----------|
| Use Case ID | UC-05 |
| Tên Use Case | Kết Thúc Ván Chơi |
| Độ ưu tiên | MUST - Phải có, vì hệ thống phải xác định ván chơi kết thúc và hiển thị kết quả thắng/thua rõ ràng cho Player. |
| Actor chính | Player |
| Actor phụ | Không có |

## 2. Mô tả Use Case

Hệ thống phát hiện điều kiện kết thúc ván chơi — toàn bộ tàu của một bên bị nhấn chìm — và hiển thị kết quả (THẮNG hoặc THUA) cùng lý do rõ ràng cho `Player`. Sau khi ván kết thúc, mọi tương tác tấn công bị vô hiệu hóa và `Player` được cung cấp tùy chọn bắt đầu ván mới.

## 3. Điều kiện tiên quyết (Pre-conditions)

1. Ván chơi đang ở giai đoạn tấn công (UC-03 hoặc UC-04 vừa xử lý xong một lượt tấn công).
2. Toàn bộ tàu của ít nhất một bên (`Player` hoặc Máy tính) đã bị nhấn chìm.

## 4. Sự kiện kích hoạt (Trigger)

Hệ thống tự động phát hiện điều kiện kết thúc sau khi xử lý kết quả lượt tấn công dẫn đến trạng thái Sunk tàu cuối cùng của một bên.

## 5. Hậu điều kiện (Post-conditions)

1. Giao diện hiển thị thông báo kết thúc rõ ràng với kết quả (THẮNG hoặc THUA) và lý do, trong cùng một màn hình.
2. Toàn bộ tương tác tấn công (click lên bảng đối thủ) bị vô hiệu hóa.
3. Bảng của Máy tính — bao gồm vị trí toàn bộ tàu đã được ẩn trong suốt ván chơi — được tiết lộ để `Player` xem lại vị trí hạm đội đối thủ.
4. `Player` có thể bắt đầu ván chơi mới thông qua nút "Chơi lại" (quay lại UC-01).

## 6. Luồng chính (Normal Flow) — Player thắng

> Luồng chính khi toàn bộ tàu của Máy tính bị nhấn chìm và `Player` thắng.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **5.1.0** | Hệ thống | Ván chơi đang trong lượt tấn công và hệ thống ghi nhận tàu cuối cùng của máy tính bị nhấn chìm từ UC-03. |
| **5.1.1** | Hệ thống | Phát hiện toàn bộ tàu của Máy tính đã bị nhấn chìm sau lượt tấn công của `Player` (từ UC-03). |
| **5.1.2** | Hệ thống | Xác định kết quả — `Player` thắng. |
| **5.1.3** | Hệ thống | Hiển thị thông báo kết thúc với text label "THẮNG" và lý do "Toàn bộ tàu đối thủ đã bị nhấn chìm." trên màn hình hiện tại, không cần thao tác thêm từ `Player`. |
| **5.1.4** | Hệ thống | Vô hiệu hóa toàn bộ tương tác tấn công — `Player` không thể click thêm ô trên bảng đối thủ. |
| **5.1.5** | Hệ thống | Tiết lộ toàn bộ vị trí hạm đội Máy tính trên bảng để `Player` xem lại. |
| **5.1.6** | Hệ thống | Hiển thị nhóm nút chức năng điều hướng bao gồm **"Chơi lại"** và **"Quay về menu chính"** tập trung tại chân màn hình kết quả. |
| **5.1.7** | `Player` | Chọn thực hiện một trong hai hành động điều hướng (Chuyển tiếp đến **Luồng phụ 5.1.8** hoặc **Luồng phụ 5.2.8**). |

## 7. Luồng thay thế (Alternate Flows)

### 7.1. Luồng thay thế 5.2 — Player thua

> Rẽ nhánh từ bước **5.1** — Áp dụng khi điều kiện kích hoạt là toàn bộ tàu của `Player` bị nhấn chìm (từ UC-04), thay vì toàn bộ tàu Máy tính bị nhấn chìm.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **5.2.0** | Hệ thống | Ván chơi đang trong lượt tấn công của Máy tính và hệ thống ghi nhận tàu cuối cùng của Player bị nhấn chìm từ UC-04. |
| **5.2.1** | Hệ thống | Phát hiện toàn bộ tàu của `Player` đã bị nhấn chìm sau lượt tấn công của Máy tính (từ UC-04). |
| **5.2.2** | Hệ thống | Xác định kết quả — `Player` thua. |
| **5.2.3** | Hệ thống | Hiển thị thông báo kết thúc với text label "THUA" và lý do "Toàn bộ tàu của bạn đã bị nhấn chìm." trên màn hình hiện tại. |
| **5.2.4** | Hệ thống | Vô hiệu hóa toàn bộ tương tác tấn công. |
| **5.2.5** | Hệ thống | Tiết lộ toàn bộ vị trí hạm đội Máy tính trên bảng để `Player` xem lại. |
| **5.2.6** | Hệ thống | Hiển thị nhóm nút chức năng điều hướng bao gồm **"Chơi lại"** và **"Quay về menu chính"** tập trung tại chân màn hình kết quả. |
| **5.2.7** | `Player` | Chọn thực hiện một trong hai hành động điều hướng (Chuyển tiếp đến **Luồng phụ 5.1.8** hoặc **Luồng phụ 5.2.8**). |

## 8. Luồng phụ điều hướng (Sub-flows)

### 8.1. Luồng phụ 5.1.8: Khởi tạo ván chơi mới
> Kích hoạt khi Player lựa chọn nút hành động "Chơi lại" tại bước 1 của 5.1.8.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| 1 | `Player` | Click chọn nút **"Chơi lại"**. |
| 2 | Hệ thống | Phát ra tín hiệu reset dữ liệu (`dispatch(startGame())`) lên kho lưu trữ trạng thái (Redux Store). |
| 3 | Hệ thống | Xóa sạch toàn bộ dữ liệu runtime của ván đấu cũ (lưới ô cờ, danh sách tàu chìm/nổi) về trạng thái trống ban đầu. |
| 4 | Hệ thống | Tự động chuyển hướng màn hình và kích hoạt lại Use Case thiết lập ván chơi mới (**UC-01**). Kết thúc use case. |

### 8.2. Luồng phụ 5.2.8: Quay về menu chính
> Kích hoạt khi Player lựa chọn nút hành động "Quay về menu chính" tại bước 1 của 5.2.8.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| 1 | `Player` | Click chọn nút **"Quay về menu chính"**. |
| 2 | Hệ thống | Gọi lệnh thực thi của môi trường trình duyệt (`window.location.reload()`) để làm mới toàn bộ ứng dụng. |
| 3 | Hệ thống | Giải phóng triệt để bộ nhớ tạm (In-memory state) đang chứa thông tin trận đấu cũ để bảo vệ toàn vẹn dữ liệu. |
| 4 | Hệ thống | Tải lại ứng dụng và chuyển hướng người chơi ra màn hình Menu khởi động mặc định. Kết thúc use case. |

## 9. Luồng ngoại lệ (Exception Flows)

Không có exception flow chính thức cho UC-05. Nếu nút "Chơi lại" gặp lỗi khi kích hoạt UC-01, hệ thống xử lý theo exception flow UC-01 §8.1 (Ngoại lệ 1.E1).

## 10. Quan hệ Use Case (Includes / Extends)

**«include»:**
Không có.

**«extend» — mở rộng:**
- **UC-03** — Thực hiện lượt tấn công (Người chơi): UC-05 mở rộng UC-03 khi `Player` nhấn chìm tàu cuối cùng của Máy tính → kết quả `Player` thắng.
- **UC-04** — Thực hiện lượt tấn công (Máy tính): UC-05 mở rộng UC-04 khi Máy tính nhấn chìm tàu cuối cùng của `Player` → kết quả `Player` thua.

## 11. Quy tắc nghiệp vụ áp dụng

| ID | Quy tắc | Nguồn |
|----|---------|-------|
| RUL-03 | Người chơi thắng khi toàn bộ tàu của đối thủ bị nhấn chìm. | BRD §4.2 |
| RUL-08 | Không áp dụng quy tắc đặc biệt trong phiên bản 1 (ví dụ: không có điều kiện hòa). | BRD §4.2 |
| RUL-09 | Phiên bản 1 không bao gồm tính năng điểm số hoặc xếp hạng. | BRD §4.2 |
| RUL-10 | Phiên bản 1 không lưu lịch sử trận đấu. | BRD §4.2 |

## 12. Yêu cầu phi chức năng (Non-Functional Requirements)

- Thông báo kết quả (THẮNG/THUA) và lý do phải hiển thị trên cùng một màn hình, không yêu cầu cuộn trang hoặc thao tác thêm. *(US-10 — AC)*
- Text label kết quả phải rõ ràng, dễ đọc, phân biệt được với các thành phần khác trên màn hình. *(US-09 — AC)*
- Nút "Chơi lại" phải hiển thị ngay sau thông báo kết thúc trên cùng màn hình. *(US-09 — AC)*

## 13. Ghi chú

**Giả định và quyết định thiết kế:**
- Phiên bản 1 không lưu trữ lịch sử ván chơi, điểm số, hoặc thống kê sau khi ván kết thúc; kết quả chỉ hiển thị tại màn hình kết thúc. *(CON-05)*
- Ván chơi chỉ kết thúc theo điều kiện nhấn chìm toàn bộ tàu (RUL-03); không có điều kiện hòa hoặc giới hạn thời gian trong phiên bản 1 (RUL-08).
- UC-05 được kích hoạt bởi hệ thống (system-triggered) sau khi UC-03 hoặc UC-04 phát hiện điều kiện kết thúc; `Player` là người hưởng lợi, không phải người khởi động use case này.

**Nguồn & Tham chiếu:**
- **Nguồn URD:** US-09 (EP-04), US-10 (EP-04) — `document/user-requirements.md`
- **Use case liên quan:** UC-03 hoặc UC-04 kích hoạt UC-05; UC-05 hoàn tất có thể quay lại UC-01 qua nút "Chơi lại".
- **Sơ đồ use case:** `document/use-case-diagram.md`
