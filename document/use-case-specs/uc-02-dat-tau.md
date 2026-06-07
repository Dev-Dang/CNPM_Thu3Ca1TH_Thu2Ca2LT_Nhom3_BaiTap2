# Đặc tả Use Case: Thiết lập bảng và Đặt tàu (UC-02)

## Lịch sử chỉnh sửa

| Phiên bản | Ngày | Tác giả | Mô tả |
|-----------|------|---------|-------|
| 1.0 | 27/04/2026 | Bùi Hữu Trí | Phiên bản đầu tiên — sinh từ URD v2.0 (US-03, US-04, US-05) |
| 2.0 | 09/05/2026 | Bùi Hữu Trí | Chỉnh sửa luồng, tách các responsibility ra 2.6 và 2.7 |
| 3.0 | 18/05/2026 | Bùi Hữu Trí | Cấu trúc lại numbering — 1 luồng chính, 1 luồng ngoại lệ |
| 4.0 | 18/05/2026 | Bùi Hữu Trí | Tách 2.1.0 kích hoạt, 2.1.1 khởi tạo hạm đội; chỉnh luồng ngoại lệ khớp code |
| 5.0 | 05/06/2026 | Đặng Văn Trung | - Mở rộng UC-02 theo BRD v1.2.1 / URD v2.1: hỗ trợ độ khó `Easy / Normal`, cấu hình bảng và hạm đội tương ứng.<br>- Bổ sung đặt tàu tự động, kéo thả, điều chỉnh vị trí/hướng tàu đã đặt trong giai đoạn thiết lập.<br>- Cập nhật phần giới thiệu, điều kiện, trigger, hậu điều kiện và Normal Flow, loại bỏ hard-code `10×10 / 5 tàu` ở luồng xử lý.<br>- Tách luồng thay thế cho điều chỉnh tàu và đặt tàu tự động; cập nhật luồng ngoại lệ cho vị trí không hợp lệ và lỗi hệ thống.<br>- Cập nhật quan hệ use case, quy tắc nghiệp vụ, yêu cầu phi chức năng, ghi chú và nguồn tham chiếu. |
| 5.1 | 06/06/2026 | Đặng Văn Trung | - Tách bước cập nhật bố cục hạm đội và cập nhật giao diện.<br>- Bổ sung Sub-flow đặt một tàu thủ công hợp lệ để làm rõ vòng lặp đặt toàn bộ hạm đội.<br>- Đồng bộ numbering và điểm quay lại của các luồng thay thế/ngoại lệ. |
| 5.2 | 07/06/2026 | Đặng Văn Trung | - Bổ sung yêu cầu phi chức năng cho trải nghiệm kéo thả tàu: ghost/preview đúng kích thước và hướng, phân biệt vị trí hợp lệ/không hợp lệ, đổi hướng bằng phím `Space` khi đang kéo.<br>- Làm rõ điểm neo khi kéo tàu từ danh sách và khi kéo tàu đã đặt trực tiếp trên bảng.<br>- Bổ sung yêu cầu giữ trạng thái chọn tàu khi điều chỉnh bằng phím để `Player` có thể thao tác liên tục. |

## 1. Giới thiệu

| Trường | Nội dung |
|--------|----------|
| Use Case ID | UC-02 |
| Tên Use Case | Thiết Lập Bảng Và Đặt Tàu |
| Độ ưu tiên | MUST - Phải có, vì `Player` cần thiết lập bảng đúng kích thước theo độ khó đã chọn, sử dụng hạm đội phù hợp với kích thước bảng, đặt toàn bộ hạm đội hợp lệ trước lượt tấn công, có thể chọn đặt tàu tự động để rút ngắn thời gian thiết lập, và có thể chọn, di chuyển vị trí, đổi hướng tàu trong giai đoạn thiết lập. (BR-03, BR-04, BR-05, BR-11, BR-12) |
| Actor chính | `Player` (ACT-01) |
| Actor phụ | Không có |

## 2. Mô tả Use Case

- `Player` thiết lập bảng và bố cục hạm đội theo độ khó đã chọn trước khi bắt đầu giai đoạn tấn công.
- Hệ thống chỉ chấp nhận bố cục hạm đội hợp lệ và chỉ cho phép bắt đầu tấn công khi toàn bộ hạm đội của độ khó hiện tại đã được đặt.
- `Player` có thể đặt tàu thủ công, kéo thả hoặc điều chỉnh vị trí/hướng đặt tàu, hoặc dùng đặt tàu tự động để hệ thống tạo bố cục hợp lệ ngẫu nhiên.

## 3. Điều kiện tiên quyết (Pre-conditions)

1. UC-01 đã hoàn tất thành công — hệ thống đang ở trạng thái sẵn sàng thiết lập.
2. `Player` đã chọn độ khó hợp lệ là `Easy` hoặc `Normal`.
3. Hệ thống đã xác định cấu hình bảng và hạm đội tương ứng với độ khó đã chọn.
4. `Player` đang ở giao diện thiết lập hạm đội (đặt tàu).

## 4. Sự kiện kích hoạt (Trigger)

1. Hệ thống chuyển tự động sang giai đoạn thiết lập sau khi UC-01 hoàn tất; giao diện đặt tàu được hiển thị mà không cần thao tác thêm từ `Player`.

## 5. Hậu điều kiện (Post-conditions)

1. Toàn bộ hạm đội của `Player` đã được đặt hợp lệ trên bảng theo độ khó đã chọn: `Easy` sử dụng bảng `10×10` với `5 tàu`; `Normal` sử dụng bảng `12×12` với `8 tàu`.
2. Hạm đội của Máy tính đã được đặt ngẫu nhiên theo cấu hình hạm đội của độ khó đã chọn và được ẩn khỏi `Player`.
3. Hệ thống ở trạng thái sẵn sàng cho giai đoạn tấn công (UC-03).

## 6. Luồng chính (Normal Flow)

**`Player` đặt toàn bộ hạm đội (thủ công) hợp lệ và bắt đầu giai đoạn tấn công.**

| Bước | Actor | Hành động / Phản hồi                                                                                                                                                                                         |
|------|-------|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| **2.1.0** | Hệ thống | Kích hoạt giai đoạn thiết lập bảng và đặt tàu sau khi UC-01 hoàn tất.                                                                                                                                        |
| **2.1.1** | Hệ thống | Khởi tạo hạm đội Máy tính, Player theo cấu hình của độ khó đã chọn và thiết lập bố cục ngẫu nhiên cho hạm đội Máy tính.                                                                                      |
| **2.1.2** | Hệ thống | Hiển thị bảng của `Player` theo độ khó đã chọn cùng danh sách tàu cần đặt và hướng đặt tàu mặc định.                                                                                                         |
| **2.1.3** | `Player` | Thực hiện Sub-flow **2.2 — Đặt một tàu thủ công hợp lệ**.                                                                                                                                                    |
| **2.1.4** | Hệ thống | Kiểm tra toàn bộ hạm đội của `Player` đã được đặt hợp lệ hay chưa.<br>- Nếu còn tàu chưa đặt, quay lại bước **2.1.3** của Normal Flow.<br>- Nếu toàn bộ hạm đội đã được đặt hợp lệ, tiếp tục bước **2.1.5**. |
| **2.1.5** | Hệ thống | Cập nhật ván chơi sang giai đoạn sẵn sàng tấn công.                                                                                                                                                          |
| **2.1.6** | Hệ thống | Kích hoạt nút "Bắt đầu tấn công" trên giao diện.                                                                                                                                                             |
| **2.1.7** | `Player` | Nhấn nút "Bắt đầu tấn công".                                                                                                                                                                                 |
| **2.1.8** | Hệ thống | Chuyển sang giai đoạn tấn công, kích hoạt UC-03.                                                                                                                                                             |

### 6.1. Sub-flow 2.2 — Đặt một tàu thủ công hợp lệ

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **2.2.1** | `Player` | Chọn hướng đặt tàu mong muốn (ngang hoặc dọc). |
| **2.2.2** | `Player` | Chọn một tàu chưa đặt từ danh sách tàu cần đặt và chọn ô bắt đầu đặt tàu trên bảng, hoặc kéo thả tàu đó đến vị trí mong muốn. |
| **2.2.3** | Hệ thống | Kiểm tra vị trí hợp lệ — tàu nằm hoàn toàn trong bảng, không chồng ô với tàu đã đặt, không đặt chéo. |
| **2.2.4** | Hệ thống | Ghi nhận vị trí hợp lệ vào bố cục hạm đội của `Player`. |
| **2.2.5** | Hệ thống | Cập nhật trạng thái tàu vừa được đặt thành đã đặt. |
| **2.2.6** | Hệ thống | Hiển thị tàu trên bảng `Player` và làm mới danh sách tàu cần đặt trên giao diện. |

## 7. Luồng thay thế (Alternative Flow)

### 7.1. AF1 — Điều chỉnh tàu đã đặt

Tại bước **2.2.2** của Sub-flow 2.2, `Player` chọn một tàu đã đặt để điều chỉnh vị trí hoặc hướng đặt tàu.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **2.3.1** | `Player` | Chọn một tàu đã đặt trên bảng. |
| **2.3.2** | Hệ thống | Làm nổi bật tàu được chọn trên bảng. |
| **2.3.3** | `Player` | Điều chỉnh tàu đã chọn bằng cách kéo thả đến vị trí mới, dùng phím mũi tên để di chuyển từng ô, hoặc nhấn phím `Space` để đổi hướng đặt tàu. |
| **2.3.4** | Hệ thống | Quay lại bước **2.2.3** của Sub-flow 2.2. |

### 7.2. AF2 — Đặt tàu tự động

Tại bước **2.1.2** của Normal Flow, `Player` chọn đặt tàu tự động.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **2.4.1** | `Player` | Chọn chức năng đặt tàu tự động. |
| **2.4.2** | Hệ thống | Xoá bố cục hạm đội hiện tại của `Player` nếu đã có tàu được đặt trên bảng. |
| **2.4.3** | Hệ thống | Tạo ngẫu nhiên vị trí và hướng đặt tàu hợp lệ cho toàn bộ hạm đội của `Player` theo độ khó đã chọn. |
| **2.4.4** | Hệ thống | Cập nhật bố cục hạm đội của `Player` theo bố cục được tạo tự động và đánh dấu toàn bộ tàu là đã đặt. |
| **2.4.5** | Hệ thống | Hiển thị bố cục hạm đội mới trên bảng `Player` và làm mới danh sách tàu cần đặt trên giao diện. |
| **2.4.6** | Hệ thống | Quay lại bước **2.1.4** của Normal Flow. |

## 8. Luồng ngoại lệ (Exception Flow)

### 8.1. EF1 — Vị trí đặt hoặc điều chỉnh tàu không hợp lệ

Tại bước **2.2.3** của Sub-flow 2.2, hệ thống phát hiện vị trí đặt tàu không hợp lệ.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **2.5.1** | Hệ thống | Không áp dụng thao tác vừa thực hiện; giữ nguyên bố cục hạm đội hợp lệ gần nhất và danh sách tàu cần đặt. |
| **2.5.2** | Hệ thống | Hiển thị thông báo lỗi "Vị trí không hợp lệ. Vui lòng chọn vị trí khác." |
| **2.5.3** | Hệ thống | Quay lại bước **2.2.1** của Sub-flow 2.2 nếu đang đặt tàu mới; quay lại bước **2.3.3** của AF1 nếu đang điều chỉnh tàu đã đặt. |

### 8.2. EF2 — Lỗi hệ thống

Tại bước **2.1.1** của Normal Flow, hệ thống gặp lỗi khi tải hoặc áp dụng cấu hình bảng và hạm đội theo độ khó đã chọn.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **2.6.1** | Hệ thống | Hiển thị thông báo lỗi "Lỗi thiết lập hạm đội. Vui lòng tải lại trang." |
| **2.6.2** | Hệ thống | Kết thúc thất bại. |

## 9. Quan hệ Use Case (Includes / Extends)

**«include»:**
Không có.

**«extend» — được mở rộng bởi:**
Không có.

**Được include bởi:**
UC-01 — Bắt đầu ván chơi và chọn độ khó.

> UC-02 hoàn tất thành công thì hệ thống chuyển sang giai đoạn tấn công (UC-03); đây là chuyển trạng thái gameplay, không phải quan hệ «include» hoặc «extend».

## 10. Quy tắc nghiệp vụ áp dụng

| ID | Quy tắc | Nguồn |
|----|---------|-------|
| RUL-01 | Kích thước bảng chơi là `10×10` ở độ khó `Easy` và `12×12` ở độ khó `Normal`. | BRD v1.2.1 §4.2 |
| RUL-02 | Đội tàu (Fleet) ở độ khó `Easy (10×10)` tuân theo cấu hình Battleship tiêu chuẩn: Carrier (1×5), Battleship (1×4), Cruiser (1×3), Submarine (1×3), Destroyer (1×2) — tổng `5 tàu`, chiếm `17 ô`. | BRD v1.2.1 §4.2 |
| RUL-04 | Tàu phải được đặt theo chiều ngang hoặc dọc, không chéo. | BRD v1.2.1 §4.2 |
| RUL-05 | Các tàu không được chồng ô lên nhau; đặt liền kề được cho phép. | BRD v1.2.1 §4.2 |
| RUL-12 | Đội tàu (Fleet) ở độ khó `Normal (12×12)` sử dụng cấu hình mở rộng: Carrier (1×5), Battleship (2×4), Cruiser (2×3), Submarine (1×3), Destroyer (2×2) — tổng `8 tàu`, chiếm `25 ô` (~17% trên `144 ô`). | BRD v1.2.1 §4.2 |

## 11. Yêu cầu phi chức năng (Non-Functional Requirements)

1. Phản hồi kiểm tra vị trí đặt hoặc điều chỉnh tàu ≤ 500 ms sau thao tác của `Player`. *(DoD — Tiêu chí hiệu năng)*
2. Bảng chơi phải hiển thị đúng kích thước theo độ khó đã chọn và phân biệt ô bằng border/viền rõ ràng, duy trì nhất quán xuyên suốt ván chơi. *(US-03 — AC; BR-03)*
3. Tàu đặt trên bảng phải hiển thị theo hướng ngang hoặc dọc; không có hướng chéo. *(RUL-04)*
4. `Player` không thể tự thay đổi số lượng, loại tàu hoặc kích thước tàu ngoài cấu hình hạm đội của độ khó đã chọn. *(RUL-02, RUL-12, US-05 — AC)*
5. Lần đầu `Player` vào giao diện thiết lập hạm đội, hệ thống hiển thị hộp thoại hướng dẫn thao tác đặt và điều chỉnh tàu. Hộp thoại bao gồm minh họa kéo thả, hướng dẫn dùng phím mũi tên để di chuyển tàu đã đặt, phím `Space` để đổi hướng tàu, nút đóng và tùy chọn không hiển thị lại trong các lần thiết lập sau.
6. Trong thao tác kéo thả tàu, hệ thống phải hiển thị ghost/preview đúng kích thước tàu và đúng hướng đặt hiện tại để `Player` nhận biết bố cục dự kiến trước khi thả tàu.
7. Khi kéo tàu chưa đặt từ danh sách, ô đang hover/drop trên bảng được hiểu là ô đầu tàu. Khi kéo tàu đã đặt trực tiếp từ bảng, ô/segment mà `Player` bấm giữ được dùng làm điểm neo; preview phải giữ segment đó dưới con trỏ khi di chuyển hoặc đổi hướng.
8. Trong thao tác kéo thả, hệ thống phải phân biệt trực quan vị trí dự kiến hợp lệ và không hợp lệ. Nếu vị trí dự kiến không hợp lệ, preview phải hiển thị trạng thái cảnh báo và thao tác thả tàu không được áp dụng.
9. Trong giai đoạn thiết lập, phím `Space` phải cho phép đổi hướng tàu đang được kéo hoặc đang được chọn; preview/ghost phải cập nhật ngay theo hướng mới.
10. Khi điều chỉnh tàu đã đặt bằng phím mũi tên hoặc phím `Space`, hệ thống chỉ áp dụng thao tác nếu vị trí mới hợp lệ; nếu không hợp lệ, bố cục hợp lệ gần nhất được giữ nguyên và tàu vẫn ở trạng thái được chọn để `Player` tiếp tục điều chỉnh.

## 12. Ghi chú

**Giả định và quyết định thiết kế:**

- Cấu hình hạm đội được xác định theo độ khó đã chọn; `Player` không tự cấu hình số lượng, loại tàu hoặc kích thước tàu.
- Quy tắc đặt tàu chỉ cho phép hướng ngang và dọc, không chồng ô, không đặt chéo; đặt liền kề được cho phép.
- `Player` có thể đặt tàu thủ công, điều chỉnh tàu đã đặt hoặc dùng đặt tàu tự động trong giai đoạn thiết lập.
- Khi điều chỉnh tàu đã đặt, hệ thống chỉ cập nhật bố cục hạm đội sau khi vị trí mới hợp lệ; nếu không hợp lệ, hệ thống giữ nguyên bố cục hợp lệ gần nhất.
- Các chi tiết ghost, preview, điểm neo khi kéo thả và trạng thái màu hợp lệ/không hợp lệ là quyết định thiết kế giao diện nhằm giúp thao tác đặt tàu trực quan hơn; chúng không thay đổi các quy tắc nghiệp vụ đặt tàu.

**Nguồn & Tham chiếu:**
- **Nguồn BRD:** BR-03, BR-04, BR-05, BR-11, BR-12; RUL-01, RUL-02, RUL-04, RUL-05, RUL-12 — `document/business-requirements.md`
- **Nguồn URD:** US-03, US-04, US-05, US-11, US-12 — `document/user-requirements.md`
- **Use case liên quan:** UC-01 kích hoạt UC-02; UC-02 hoàn tất kích hoạt UC-03.
- **Sơ đồ use case:** `document/use-case-diagram.md`
