# Đặc tả Use Case: Bắt Đầu Ván Chơi

## Lịch sử chỉnh sửa

| Phiên bản | Ngày | Tác giả | Mô tả |
|-----------|------|---------|-------|
| 1.0 | 27/04/2026 | Võ Khương Đại Bảo | Phiên bản đầu tiên — sinh từ URD v2.0 (US-01, US-02) |
| 1.1 | 13/05/2026 | Võ Khương Đại Bảo | Thêm bước 1.1.0 (tiền điều kiện + trigger) vào luồng chính; đổi tiêu đề luồng thay thế 7.2 từ "1.2" thành "1.3"; sửa tham chiếu nội bộ tại bước → (1.4 → 1.1.4) và mục 9 (bước 1.6 → 1.1.6). |
| 2.0 | 05/06/2026 | Hồ Ngọc Hoàn Sơn | **Nâng cấp tính năng chọn độ khó (Easy/Normal) và cấu hình bảng/hạm đội động:**<br>- Chỉnh sửa mô tả usecase<br>- **Luồng chính (Mục 6):**   Cập nhật bước 1.1.2 (Hiển thị UI chọn độ khó và vô hiệu hóa nút Bắt đầu). Bổ sung bước 1.1.3 (Player chọn độ khó) và 1.1.4 (Hệ thống kích hoạt nút Bắt đầu). Cập nhật hành động nhấn nút thành bước 1.1.5. Đẩy các bước khởi tạo xuống thành từ 1.1.6 đến 1.1.9.<br>- **Luồng thay thế 1.2 (Mục 7.1):**   Cập nhật đích đến của luồng khi xác nhận tạo ván mới là quay lại bước 1.1.2 (StartScreen).<br>- **Luồng ngoại lệ 1.4 (Mục 8.1):**  đổi điểm rẽ nhánh thành 1.1.6 và bổ sung kịch bản bắt lỗi cấu hình (`FLEET_CONFIG_MISMATCH`).<br>- **Mục 5 & 10:** Bổ sung hậu điều kiện lưu `difficulty`/`boardSize` và thêm các quy tắc RUL-01, RUL-02, RUL-12, RUL-13. |

## 1. Giới thiệu

| Trường | Nội dung |
|--------|----------|
| Use Case ID | UC-01 |
| Tên Use Case | Bắt Đầu Ván Chơi |
| Độ ưu tiên | MUST - Phải có, vì đây là điểm vào bắt buộc để khởi tạo ván chơi mới và dẫn sang toàn bộ các use case gameplay tiếp theo. |
| Actor chính | `Player` |
| Actor phụ | Không có |

## 2. Mô tả Use Case

`Player` khởi tạo một ván Battleship mới trên giao diện và thực hiện lựa chọn cấp độ thử thách (Easy hoặc Normal). Hệ thống thiết lập một phiên chơi sạch hoàn toàn (loại bỏ dữ liệu cũ), ghi nhận độ khó để áp dụng nhất quán cấu hình kích thước bảng (10×10 hoặc 12×12), số lượng tàu trong hạm đội (5 hoặc 8 tàu) cùng chiến thuật tấn công của Máy tính, sau đó tự động chuyển `Player` vào giai đoạn thiết lập hạm đội.

## 3. Điều kiện tiên quyết (Pre-conditions)

1. `Player` đang ở trang chủ hoặc đang trong một ván chơi có hiển thị tùy chọn bắt đầu ván mới, trên trình duyệt Chrome, Firefox hoặc Edge phiên bản hiện hành.
2. Trang chủ đã tải thành công.

## 4. Sự kiện kích hoạt (Trigger)

`Player` chọn nút "Bắt đầu ván mới" trên màn hình chào mừng hoặc chọn nút "Ván Mới" trên thanh trạng thái (StatusBar) khi trận đấu cũ đang diễn ra.

## 5. Hậu điều kiện (Post-conditions)

1. Một ván chơi mới được khởi tạo trong bộ nhớ client; không có dữ liệu nào từ ván chơi trước được giữ lại hoặc hiển thị.
2. Giao diện hiển thị label chỉ rõ chế độ đơn người chơi (ví dụ: "vs Computer").
3.  Trạng thái độ khó (difficulty) và kích thước bảng (boardSize) được lưu trữ đồng nhất trong Redux store theo lựa chọn:

    Easy: Bảng 10×10, hạm đội 5 tàu (17 ô), Máy tính bắn ngẫu nhiên.

    Normal: Bảng 12×12, hạm đội 8 tàu (25 ô), Máy tính áp dụng hàng đợi bắn Hunt-and-Target.
4. Hệ thống ở trạng thái sẵn sàng cho giai đoạn thiết lập — đặt tàu (UC-02).

## 6. Luồng chính (Normal Flow) — Bắt đầu ván mới

> Luồng chính khi `Player` bắt đầu một ván Battleship mới từ giao diện chính.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **1.1.0** | Tiền điều kiện + trigger | 
- Player đang ở trang chủ trò chơi.
- Trang đã tải thành công.
- Trigger: Player chọn nút "Bắt đầu ván mới". |
| **1.1.1** | `Player` | Truy cập trang chủ trò chơi Battleship trên trình duyệt. |
| **1.1.2** | Hệ thống | Hiển thị giao diện chào mừng (`StartScreen`) bao gồm: tiêu đề trò chơi, label "Chọn độ khó", hai nút chọn ("Easy" và "Normal"), và nút "Bắt đầu ván mới" ở trạng thái bị vô hiệu hóa (không thể nhấn). |
| **1.1.3** | `Player` | Nhấn chọn một trong hai nút độ khó ("Easy" hoặc "Normal"). |
| **1.1.4** | Hệ thống | Ghi nhận lựa chọn, hiển thị trạng thái nổi bật cho nút độ khó vừa chọn, đồng thời kích hoạt (làm sáng) nút "Bắt đầu ván mới". |
| **1.1.5** | `Player` | Chọn nút "Bắt đầu ván mới". |
| **1.1.6** | Hệ thống | Gọi action startGame({ difficulty }). Khởi tạo ván chơi mới: đặt lại toàn bộ trạng thái cũ Nếu lỗi → Chuyển sang 1.4. |
| **1.1.7** | Hệ thống | Hiển thị giao diện ván chơi với label chế độ ("vs Computer") và nhãn độ khó ở vị trí cố định trên StatusBar, hiển thị xuyên suốt ván chơi. |
| **1.1.8** | Hệ thống | Chuyển sang giai đoạn thiết lập — đặt tàu, kích hoạt UC-02. |
| **1.1.9** | Hệ thống | Kết thúc. |

## 7. Luồng thay thế (Alternate Flows)

### 7.1. Luồng thay thế 1.2 — Bắt đầu ván mới khi đang ở giữa một ván chơi

> Rẽ nhánh từ bước **1.1.7** — Áp dụng khi `Player` chọn “Bắt đầu ván mới” trong khi một ván chơi khác vẫn đang diễn ra.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **1.2.1** | `Player` | Chọn nút "Bắt đầu ván mới" trong khi một ván chơi đang diễn ra. |
| **1.2.2** | Hệ thống | Hiển thị hộp xác nhận với nội dung "Ván chơi hiện tại sẽ bị hủy. Bạn có chắc muốn bắt đầu ván mới không?"Cho phép chọn lại độ khó của ván mới và hai nút: "Xác nhận" và "Hủy". |
| **1.2.3** | `Player` | Chọn nút "easy hoặc normal". |
| **1.2.4** | `Player` | Chọn nút "Xác nhận". |
| **1.2.5** | Hệ thống | Hủy ván chơi đang diễn ra, đặt lại trạng thái trong bộ nhớ về mặc định. |
| **→** | Hệ thống | Quay lại bước 1.1.2 của Luồng chính. |

### 7.2. Luồng thay thế 1.3 — Hủy yêu cầu bắt đầu ván mới

> Rẽ nhánh từ bước **1.2.2** — Áp dụng khi `Player` chọn nút “Hủy” và muốn tiếp tục ván chơi hiện tại.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **1.3.1** | `Player` | Chọn nút "Hủy" trên hộp xác nhận. |
| **1.3.2** | Hệ thống | Đóng hộp xác nhận, duy trì nguyên trạng ván chơi đang diễn ra. |
| **1.3.3** | Hệ thống | Kết thúc. |

## 8. Luồng ngoại lệ (Exception Flows)

### 8.1. Ngoại lệ 1.4 — Khởi tạo ván chơi thất bại

> Rẽ nhánh từ bước **1.1.6** — Áp dụng khi hệ thống không thể khởi tạo trạng thái ván chơi mới hoặc sai cấu hình.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **1.4.1** | Hệ thống | Phát hiện lỗi trong quá trình khởi tạo trạng thái ván chơi mới tại bước 1.4 (ví dụ: lỗi JavaScript runtime, bộ nhớ không đủ). |
| **1.4.2** | Hệ thống | Hiển thị thông báo lỗi "Không thể bắt đầu ván chơi. Vui lòng tải lại trang." tại vị trí trung tâm màn hình. |
| **1.4.3** | Hệ thống | Kết thúc không thành công (không gọi UC-02). |

## 9. Quan hệ Use Case (Includes / Extends)

**«include»:**
- **UC-02** — Đặt tàu: UC-01 bắt buộc gọi UC-02 tại bước 1.1.8; ván chơi không thể chuyển sang giai đoạn tấn công nếu UC-02 chưa hoàn tất.

**«extend» — được mở rộng bởi:**
Không có.

## 10. Quy tắc nghiệp vụ áp dụng

| ID | Quy tắc | Nguồn |
|----|---------|-------|
| RUL-01 | Kích thước lưới ma trận bảng chơi cố định dựa theo độ khó: Cấp độ Easy sử dụng lưới 10×10; cấp độ Normal sử dụng lưới 12×12. | BRD §4.2 / BR-03 |
| RUL-02 |Cấu hình hạm đội Easy (10×10): Gồm 5 tàu tiêu chuẩn: Carrier(5), Battleship(4), Cruiser(3), Submarine(3), Destroyer(2). Chiếm 17 ô. | BRD §4.2 / BR-04 |
| RUL-07 | Người chơi thực hiện lượt đầu tiên; sau đó luân phiên với đối thủ máy tính. | BRD §4.2 |
| RUL-08 | Không áp dụng quy tắc đặc biệt trong phiên bản 1. | BRD §4.2 |
| RUL-09 | Phiên bản 1 không bao gồm tính năng điểm số hoặc xếp hạng. | BRD §4.2 |
| RUL-10 | Phiên bản 1 không lưu lịch sử trận đấu. | BRD §4.2 |
| RUL-11 | Phiên bản 1 không hỗ trợ chế độ chơi trực tuyến. | BRD §4.2 |

## 11. Yêu cầu phi chức năng (Non-Functional Requirements)

Thời gian hiển thị nội dung đầu tiên (First Contentful Paint — FCP) ≤ 3 giây trên mạng Wi-Fi có băng thông tối thiểu 10 Mbps và độ trễ dưới 100 ms. (DoD — Tiêu chí hiệu năng)

Thao tác nhấn chọn độ khó và xử lý khởi tạo ma trận (10×10 hoặc 12×12) phải phản hồi trong thời gian ≤ 500 ms. (DoD)

Giao diện hiển thị đúng trên Chrome, Firefox và Edge phiên bản hiện hành, màn hình tối thiểu 1366×768. Các component bảng chơi phải tự động thay đổi cấu trúc lưới (CSS Grid/Flex) theo boardSize thực tế, không fix cứng 10 cột. (DoD — Tiêu chí giao diện)

Label chế độ ("vs Computer") và độ khó phải hiển thị rõ ràng, không có yếu tố gợi ý chế độ nhiều người chơi. (US-02 — AC)

## 12. Ghi chú

**Giả định và quyết định thiết kế:**
- Trò chơi chạy hoàn toàn phía client (SPA), không cần kết nối server trong quá trình gameplay — chỉ cần tải trang ban đầu. *(ASM-04, URD §3.1)*
- Phiên bản 1 không có tính năng lưu trữ lịch sử ván chơi; mỗi ván là độc lập. *(CON-05)*

**Nguồn & Tham chiếu:**
- **Nguồn URD:** US-01 (EP-01), US-02 (EP-01) — `document/user-requirements.md`
- **Use case liên quan:** UC-02 (Đặt tàu) là use case tiếp theo sau khi UC-01 hoàn tất.
- **Sơ đồ use case:** `document/use-case-diagram.md`
- Ván chơi mới không yêu cầu dữ liệu từ trận trước — mỗi lần bắt đầu là phiên sạch hoàn toàn. *(US-01 — Ghi chú)*
