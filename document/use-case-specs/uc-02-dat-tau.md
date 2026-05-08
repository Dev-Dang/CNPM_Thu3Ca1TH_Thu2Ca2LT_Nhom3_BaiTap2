# Đặc tả Use Case: Đặt Tàu

## Lịch sử chỉnh sửa

| Phiên bản | Ngày | Tác giả | Mô tả |
|-----------|------|---------|-------|
| 1.0 | 27/04/2026 | Bùi Hữu Trí | Phiên bản đầu tiên — sinh từ URD v2.0 (US-03, US-04, US-05) |

## 1. Giới thiệu

| Trường | Nội dung |
|--------|----------|
| Use Case ID | UC-02 |
| Tên Use Case | Đặt Tàu |
| Độ ưu tiên | MUST - Phải có, vì người chơi bắt buộc phải đặt đủ hạm đội hợp lệ trước khi bước vào giai đoạn tấn công. |
| Actor chính | Player |
| Actor phụ | Không có |

## 2. Mô tả Use Case

`Player` thiết lập hạm đội bằng cách đặt 5 tàu tiêu chuẩn lên bảng chơi 10×10 của mình trước khi bắt đầu giai đoạn tấn công. Hệ thống kiểm tra tính hợp lệ của từng vị trí đặt tàu và chỉ cho phép chuyển sang giai đoạn tấn công khi toàn bộ hạm đội đã được đặt đúng quy tắc.

## 3. Điều kiện tiên quyết (Pre-conditions)

1. UC-01 đã hoàn tất thành công — hệ thống đang ở trạng thái sẵn sàng thiết lập.
2. `Player` đang ở giao diện thiết lập hạm đội (đặt tàu).

## 4. Sự kiện kích hoạt (Trigger)

Hệ thống chuyển tự động sang giai đoạn thiết lập sau khi UC-01 hoàn tất; giao diện đặt tàu được hiển thị mà không cần thao tác thêm từ `Player`.

## 5. Hậu điều kiện (Post-conditions)

1. Toàn bộ 5 tàu của `Player` đã được đặt hợp lệ trên bảng 10×10.
2. Hạm đội của Máy tính đã được đặt ngẫu nhiên (ẩn khỏi `Player`).
3. Hệ thống ở trạng thái sẵn sàng cho giai đoạn tấn công (UC-03).

## 6. Luồng chính (Normal Flow) — Đặt toàn bộ hạm đội

> Luồng chính khi `Player` đặt toàn bộ hạm đội hợp lệ và bắt đầu giai đoạn tấn công.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **2.1** | Hệ thống | Khởi tạo hạm đội Máy tính với cấu hình tiêu chuẩn — Carrier (5 ô), Battleship (4 ô), Cruiser (3 ô), Submarine (3 ô), Destroyer (2 ô) — và đặt ngẫu nhiên lên bảng của Máy tính (ẩn khỏi `Player`). |
| **2.2** | Hệ thống | Hiển thị bảng 10×10 của `Player` cùng danh sách 5 tàu cần đặt. |
| **2.3** | `Player` | Chọn một tàu chưa đặt từ danh sách. |
| **2.4** | `Player` | Chọn hướng đặt tàu (ngang hoặc dọc) và chọn ô bắt đầu trên bảng 10×10. |
| **2.5** | Hệ thống | Kiểm tra vị trí hợp lệ — tàu nằm hoàn toàn trong bảng, không chồng ô với tàu đã đặt, không đặt chéo. Nếu không hợp lệ → **2.E1**. |
| **2.6** | Hệ thống | Chấp nhận vị trí, hiển thị tàu trên bảng và cập nhật danh sách tàu còn lại. |
| **2.7** | Hệ thống | Kiểm tra số lượng tàu đã đặt — chưa đủ 5 tàu → vô hiệu hóa nút "Bắt đầu tấn công", quay lại bước 2.3; đủ 5 tàu → kích hoạt nút "Bắt đầu tấn công". |
| **2.8** | `Player` | Nhấn nút "Bắt đầu tấn công". |
| **2.9** | Hệ thống | Chuyển sang giai đoạn tấn công, kích hoạt UC-03. |
| **2.10** | Hệ thống | Kết thúc. |

## 7. Luồng thay thế (Alternate Flows)

### 7.1. Luồng thay thế 2.A1 — Tái đặt tàu đã đặt trước đó (Reposition)

> **Rẽ nhánh tại bước 2.3** — Áp dụng khi `Player` chọn một tàu đã đặt trên bảng để tái đặt vị trí thay vì chọn một tàu chưa đặt (trước khi nhấn “Bắt đầu tấn công”).

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **2.A1.1** | `Player` | Chọn một tàu đã đặt trên bảng để điều chỉnh vị trí. |
| **2.A1.2** | Hệ thống | Gỡ tàu khỏi vị trí hiện tại; các ô tương ứng trên bảng trở về trạng thái trống. Tàu được đưa lại vào trạng thái chờ đặt. |
| **2.A1.3** | `Player` | Chọn hướng và vị trí mới cho tàu. |
| **→** | Hệ thống | Quay lại bước 2.5 của Luồng chính để kiểm tra vị trí mới. |

## 8. Luồng ngoại lệ (Exception Flows)

### 8.1. Ngoại lệ 2.E1 — Vị trí đặt tàu không hợp lệ

> Rẽ nhánh từ bước **2.5** — Áp dụng khi vị trí đặt tàu vi phạm quy tắc nằm trong bảng, không chồng ô, hoặc không đặt chéo.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **2.E1.1** | Hệ thống | Phát hiện vị trí đặt tàu không hợp lệ tại bước 2.5 — tàu vượt ra ngoài bảng, chồng ô với tàu đã đặt, hoặc đặt theo hướng chéo. |
| **2.E1.2** | Hệ thống | Hiển thị thông báo lỗi tại vị trí tương tác, ví dụ: "Vị trí không hợp lệ. Vui lòng chọn vị trí khác." |
| **2.E1.3** | `Player` | Điều chỉnh vị trí hoặc hướng đặt tàu và thử lại từ bước 2.4. |

### 8.2. Ngoại lệ 2.E2 — Cấu hình hạm đội hệ thống không hợp lệ

> Rẽ nhánh từ bước **2.1** — Áp dụng khi hệ thống khởi tạo hạm đội Máy tính không đúng cấu hình tiêu chuẩn.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **2.E2.1** | Hệ thống | Phát hiện cấu hình hạm đội khởi tạo tại bước 2.1 không khớp chuẩn (sai số lượng hoặc kích thước tàu). |
| **2.E2.2** | Hệ thống | Không cho phép bắt đầu giai đoạn đặt tàu; ghi log lỗi cấu hình hạm đội. |
| **2.E2.3** | Hệ thống | Kết thúc không thành công. |

## 9. Quan hệ Use Case (Includes / Extends)

**«include»:**
Không có.

**«extend» — được mở rộng bởi:**
Không có.

> UC-02 được gọi bởi UC-01 thông qua quan hệ «include» (xem UC-01 §9).

## 10. Quy tắc nghiệp vụ áp dụng

| ID | Quy tắc | Nguồn |
|----|---------|-------|
| RUL-01 | Kích thước bảng chơi cố định là 10×10. | BRD §4.2 |
| RUL-02 | Đội tàu (Fleet) tuân theo cấu hình tiêu chuẩn: Carrier (5), Battleship (4), Cruiser (3), Submarine (3), Destroyer (2). | BRD §4.2 |
| RUL-04 | Tàu phải được đặt theo chiều ngang hoặc dọc, không chéo. | BRD §4.2 |
| RUL-05 | Các tàu không được chồng ô lên nhau; đặt liền kề được cho phép. | BRD §4.2 |

## 11. Yêu cầu phi chức năng (Non-Functional Requirements)

- Phản hồi kiểm tra vị trí đặt tàu ≤ 500 ms sau thao tác của `Player`. *(DoD — Tiêu chí hiệu năng)*
- Bảng chơi 10×10 phân biệt ô bằng border/viền rõ ràng, duy trì nhất quán xuyên suốt ván chơi. *(US-03 — AC)*
- Tàu đặt trên bảng phải hiển thị theo hướng ngang hoặc dọc; không có hướng chéo. *(RUL-04)*
- Cấu hình hạm đội cố định: Carrier (5 ô), Battleship (4 ô), Cruiser (3 ô), Submarine (3 ô), Destroyer (2 ô) — `Player` không thể thay đổi cấu hình này. *(RUL-02, US-05 — AC)*

## 12. Ghi chú

**Giả định và quyết định thiết kế:**
- Cấu hình hạm đội tiêu chuẩn là cố định trong phiên bản 1; không có giao diện tùy chỉnh số lượng hoặc loại tàu. *(ASM-02)*
- Quy tắc đặt tàu chỉ cho phép hướng ngang và dọc, không chồng ô, không đặt chéo. *(RUL-04, RUL-05)*
- `Player` có thể tái đặt tàu đã đặt trước đó (xem luồng thay thế 7.1) nhưng không có tính năng "đặt ngẫu nhiên" trong phiên bản 1.

**Nguồn & Tham chiếu:**
- **Nguồn URD:** US-03 (EP-02), US-04 (EP-02), US-05 (EP-02) — `document/user-requirements.md`
- **Use case liên quan:** UC-01 kích hoạt UC-02; UC-02 hoàn tất kích hoạt UC-03.
- **Sơ đồ use case:** `document/use-case-diagram.md`
