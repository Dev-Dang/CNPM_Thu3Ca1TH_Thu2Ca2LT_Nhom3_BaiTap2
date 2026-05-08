# Đặc tả Use Case: Bắt Đầu Ván Chơi

## Lịch sử chỉnh sửa

| Phiên bản | Ngày | Tác giả | Mô tả |
|-----------|------|---------|-------|
| 1.0 | 27/04/2026 | Võ Khương Đại Bảo | Phiên bản đầu tiên — sinh từ URD v2.0 (US-01, US-02) |

## 1. Giới thiệu

| Trường | Nội dung |
|--------|----------|
| Use Case ID | UC-01 |
| Tên Use Case | Bắt Đầu Ván Chơi |
| Độ ưu tiên | MUST - Phải có, vì đây là điểm vào bắt buộc để khởi tạo ván chơi mới và dẫn sang toàn bộ các use case gameplay tiếp theo. |
| Actor chính | Player |
| Actor phụ | Không có |

## 2. Mô tả Use Case

`Player` khởi tạo một ván Battleship mới trên giao diện web. Hệ thống tạo phiên chơi sạch (không có dữ liệu từ ván trước), hiển thị rõ chế độ đơn người chơi và chuyển `Player` vào giai đoạn thiết lập hạm đội. Use case này là điểm vào bắt buộc trước mọi hoạt động gameplay.

## 3. Điều kiện tiên quyết (Pre-conditions)

1. `Player` đang ở trang chủ hoặc đang trong một ván chơi có hiển thị tùy chọn bắt đầu ván mới, trên trình duyệt Chrome, Firefox hoặc Edge phiên bản hiện hành.
2. Trang chủ đã tải thành công.

## 4. Sự kiện kích hoạt (Trigger)

`Player` chọn nút "Bắt đầu ván mới" trên giao diện chính của trò chơi.

## 5. Hậu điều kiện (Post-conditions)

1. Một ván chơi mới được khởi tạo trong bộ nhớ client; không có dữ liệu nào từ ván chơi trước được giữ lại hoặc hiển thị.
2. Giao diện hiển thị label chỉ rõ chế độ đơn người chơi (ví dụ: "vs Computer").
3. Hệ thống ở trạng thái sẵn sàng cho giai đoạn thiết lập — đặt tàu (UC-02).

## 6. Luồng chính (Normal Flow) — Bắt đầu ván mới

> Luồng chính khi `Player` bắt đầu một ván Battleship mới từ giao diện chính.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **1.1** | `Player` | Truy cập trang chủ trò chơi Battleship trên trình duyệt. |
| **1.2** | Hệ thống | Hiển thị giao diện chính với nút "Bắt đầu ván mới" ở vị trí trung tâm màn hình. |
| **1.3** | `Player` | Chọn nút "Bắt đầu ván mới". |
| **1.4** | Hệ thống | Khởi tạo ván chơi mới, đặt lại toàn bộ trạng thái trong bộ nhớ về giá trị mặc định. |
| **1.5** | Hệ thống | Hiển thị giao diện ván chơi với label chế độ đơn người chơi (ví dụ: tiêu đề hoặc text label "vs Computer") ở vị trí cố định, hiển thị xuyên suốt ván chơi. |
| **1.6** | Hệ thống | Chuyển sang giai đoạn thiết lập — đặt tàu, kích hoạt UC-02. |
| **1.7** | Hệ thống | Kết thúc. |

## 7. Luồng thay thế (Alternate Flows)

### 7.1. Luồng thay thế 1.A1 — Bắt đầu ván mới khi đang ở giữa một ván chơi

> Rẽ nhánh từ bước **1.3** — Áp dụng khi `Player` chọn “Bắt đầu ván mới” trong khi một ván chơi khác vẫn đang diễn ra.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **1.A1.1** | `Player` | Chọn nút "Bắt đầu ván mới" trong khi một ván chơi đang diễn ra. |
| **1.A1.2** | Hệ thống | Hiển thị hộp xác nhận với nội dung "Ván chơi hiện tại sẽ bị hủy. Bạn có chắc muốn bắt đầu ván mới không?" và hai nút: "Xác nhận" và "Hủy". |
| **1.A1.3** | `Player` | Chọn nút "Xác nhận". |
| **1.A1.4** | Hệ thống | Hủy ván chơi đang diễn ra, đặt lại trạng thái trong bộ nhớ về mặc định. |
| **→** | Hệ thống | Quay lại bước 1.4 của Luồng chính. |

### 7.2. Luồng thay thế 1.A2 — Hủy yêu cầu bắt đầu ván mới

> Rẽ nhánh từ bước **1.A1.3** — Áp dụng khi `Player` chọn nút “Hủy” và muốn tiếp tục ván chơi hiện tại.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **1.A2.1** | `Player` | Chọn nút "Hủy" trên hộp xác nhận. |
| **1.A2.2** | Hệ thống | Đóng hộp xác nhận, duy trì nguyên trạng ván chơi đang diễn ra. |
| **1.A2.3** | Hệ thống | Kết thúc. |

## 8. Luồng ngoại lệ (Exception Flows)

### 8.1. Ngoại lệ 1.E1 — Khởi tạo ván chơi thất bại

> Rẽ nhánh từ bước **1.4** — Áp dụng khi hệ thống không thể khởi tạo trạng thái ván chơi mới.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **1.E1.1** | Hệ thống | Phát hiện lỗi trong quá trình khởi tạo trạng thái ván chơi mới tại bước 1.4 (ví dụ: lỗi JavaScript runtime, bộ nhớ không đủ). |
| **1.E1.2** | Hệ thống | Hiển thị thông báo lỗi "Không thể bắt đầu ván chơi. Vui lòng tải lại trang." tại vị trí trung tâm màn hình. |
| **1.E1.3** | Hệ thống | Kết thúc không thành công. |

## 9. Quan hệ Use Case (Includes / Extends)

**«include»:**
- **UC-02** — Đặt tàu: UC-01 bắt buộc gọi UC-02 tại bước 1.6; ván chơi không thể chuyển sang giai đoạn tấn công nếu UC-02 chưa hoàn tất.

**«extend» — được mở rộng bởi:**
Không có.

## 10. Quy tắc nghiệp vụ áp dụng

| ID | Quy tắc | Nguồn |
|----|---------|-------|
| RUL-07 | Người chơi thực hiện lượt đầu tiên; sau đó luân phiên với đối thủ máy tính. | BRD §4.2 |
| RUL-08 | Không áp dụng quy tắc đặc biệt trong phiên bản 1. | BRD §4.2 |
| RUL-09 | Phiên bản 1 không bao gồm tính năng điểm số hoặc xếp hạng. | BRD §4.2 |
| RUL-10 | Phiên bản 1 không lưu lịch sử trận đấu. | BRD §4.2 |
| RUL-11 | Phiên bản 1 không hỗ trợ chế độ chơi trực tuyến. | BRD §4.2 |

## 11. Yêu cầu phi chức năng (Non-Functional Requirements)

- Thời gian hiển thị nội dung đầu tiên (First Contentful Paint — FCP) ≤ 3 giây trên mạng Wi-Fi có băng thông tối thiểu 10 Mbps và độ trễ dưới 100 ms. *(DoD — Tiêu chí hiệu năng)*
- Giao diện hiển thị đúng trên Chrome, Firefox và Edge phiên bản hiện hành, màn hình tối thiểu 1366×768. *(DoD — Tiêu chí giao diện)*
- Label chế độ đơn người chơi (ví dụ: "vs Computer") phải hiển thị rõ ràng, không có yếu tố giao diện nào gợi ý hỗ trợ chế độ nhiều người chơi. *(US-02 — AC)*

## 12. Ghi chú

**Giả định và quyết định thiết kế:**
- Trò chơi chạy hoàn toàn phía client (SPA), không cần kết nối server trong quá trình gameplay — chỉ cần tải trang ban đầu. *(ASM-04, URD §3.1)*
- Phiên bản 1 không có tính năng lưu trữ lịch sử ván chơi; mỗi ván là độc lập. *(CON-05)*

**Nguồn & Tham chiếu:**
- **Nguồn URD:** US-01 (EP-01), US-02 (EP-01) — `document/user-requirements.md`
- **Use case liên quan:** UC-02 (Đặt tàu) là use case tiếp theo sau khi UC-01 hoàn tất.
- **Sơ đồ use case:** `document/use-case-diagram.md`
- Ván chơi mới không yêu cầu dữ liệu từ trận trước — mỗi lần bắt đầu là phiên sạch hoàn toàn. *(US-01 — Ghi chú)*
