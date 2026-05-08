# Đặc tả Use Case: Thực Hiện Lượt Tấn Công (Người Chơi)

## Lịch sử chỉnh sửa

| Phiên bản | Ngày | Tác giả | Mô tả |
|-----------|------|---------|-------|
| 1.0 | 27/04/2026 | Hồ Ngọc Hoàn Sơn | Phiên bản đầu tiên — sinh từ URD v2.0 (US-06, US-07) |

## 1. Giới thiệu

| Trường | Nội dung |
|--------|----------|
| Use Case ID | UC-03 |
| Tên Use Case | Thực Hiện Lượt Tấn Công (Người Chơi) |
| Độ ưu tiên | MUST - Phải có, vì đây là use case cốt lõi của vòng lặp gameplay: Player tấn công, nhận phản hồi Hit/Miss/Sunk và chuyển lượt. |
| Actor chính | Player |
| Actor phụ | Không có |

## 2. Mô tả Use Case

`Player` thực hiện lượt tấn công bằng cách chọn một ô trên bảng đối thủ và nhận phản hồi kết quả: Trúng (Hit), Trượt (Miss), hoặc Nhấn chìm (Sunk). Sau mỗi lượt hợp lệ, hệ thống chuyển sang lượt của Máy tính (UC-04). Use case này lặp lại luân phiên với UC-04 cho đến khi điều kiện kết thúc ván được kích hoạt.

## 3. Điều kiện tiên quyết (Pre-conditions)

1. UC-01 đã hoàn tất — ván chơi đã được khởi tạo thành công.
2. UC-02 đã hoàn tất — toàn bộ hạm đội của `Player` và Máy tính đã được thiết lập trên bảng 10×10.
3. Ván chơi đang ở lượt của `Player` trong giai đoạn tấn công (lần đầu sau UC-02; các lần sau khi UC-04 hoàn tất).
4. Bảng đối thủ 10×10 đang hiển thị với ít nhất một ô chưa bị tấn công.

## 4. Sự kiện kích hoạt (Trigger)

Hệ thống kích hoạt lượt `Player`: lần đầu tiên ngay sau khi UC-02 hoàn tất; các lần tiếp theo ngay sau khi UC-04 hoàn tất. Giao diện bảng đối thủ kích hoạt tương tác click cho `Player`.

## 5. Hậu điều kiện (Post-conditions)

1. Ô được `Player` chọn trên bảng đối thủ hiển thị kết quả tương ứng: ký hiệu Miss, Hit, hoặc Sunk (phân biệt bằng màu sắc/icon).
2. Nếu kết quả là Sunk: toàn bộ ô của tàu bị nhấn chìm được đánh dấu đồng loạt bằng ký hiệu Sunk — phân biệt rõ với ký hiệu Hit thông thường.
3. Trạng thái bảng và tàu được cập nhật chính xác, nhất quán giữa giao diện và dữ liệu nội bộ.
4. Hệ thống chuyển sang lượt Máy tính (UC-04) — bảng đối thủ bị vô hiệu hóa, bảng của `Player` ở trạng thái chỉ xem trong lúc Máy tính xử lý lượt. Hoặc kích hoạt UC-05 nếu toàn bộ tàu đối thủ đã bị nhấn chìm.

## 6. Luồng chính (Normal Flow) — Tấn công trượt (Miss)

> Luồng chính khi `Player` chọn ô hợp lệ và kết quả là trượt.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **3.1** | Hệ thống | Hiển thị bảng đối thủ 10×10; các ô chưa bị tấn công có thể click; các ô đã tấn công hiển thị trạng thái tương ứng. Giao diện bảng đối thủ được kích hoạt. |
| **3.2** | `Player` | Quan sát bảng đối thủ và click vào một ô hợp lệ (chưa bị tấn công). |
| **3.3** | Hệ thống | Kiểm tra ô đã chọn — xác nhận nằm trong bảng 10×10 và chưa bị tấn công trước đó. |
| **3.4** | Hệ thống | Xác định kết quả tấn công — ô không chứa tàu đối thủ → kết quả "Trượt" (Miss). |
| **3.5** | Hệ thống | Đánh dấu ô vừa tấn công bằng ký hiệu Miss (ví dụ: chấm trắng hoặc xám) trên bảng đối thủ. Hiển thị thông báo: "Trượt!" |
| **3.6** | Hệ thống | Kiểm tra điều kiện kết thúc ván — còn ít nhất một tàu đối thủ chưa bị nhấn chìm → chưa kết thúc. *\[EP: end-game\] Nếu toàn bộ tàu đối thủ bị nhấn chìm → kích hoạt UC-05 (3.A3).* |
| **3.7** | Hệ thống | Vô hiệu hóa bảng đối thủ, không cho `Player` click tiếp. Chuyển sang lượt Máy tính, kích hoạt UC-04. |
| **3.8** | Hệ thống | Kết thúc. |

## 7. Luồng thay thế (Alternate Flows)

### 7.1. Luồng thay thế 3.A1 — Tấn công trúng, tàu chưa bị nhấn chìm (Hit)

> Rẽ nhánh từ bước **3.4** — Áp dụng khi ô được chọn có tàu của Máy tính nhưng tàu chưa bị nhấn chìm hoàn toàn.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **3.A1.1** | Hệ thống | Xác định kết quả — ô chứa tàu đối thủ, tàu còn ít nhất một ô khác chưa bị tấn công → kết quả "Trúng" (Hit). |
| **3.A1.2** | Hệ thống | Đánh dấu ô vừa tấn công bằng ký hiệu Hit (ví dụ: màu đỏ hoặc icon lửa) trên bảng đối thủ. Hiển thị thông báo: "Trúng!" |
| **→** | Hệ thống | Quay lại bước 3.6 của Luồng chính. |

### 7.2. Luồng thay thế 3.A2 — Tấn công nhấn chìm tàu (Sunk)

> Rẽ nhánh từ bước **3.4** — Áp dụng khi lần tấn công này hoàn thành việc nhấn chìm một tàu của Máy tính.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **3.A2.1** | Hệ thống | Xác định kết quả — ô chứa tàu đối thủ và đây là ô cuối cùng chưa bị tấn công của tàu đó → kết quả "Nhấn chìm" (Sunk). |
| **3.A2.2** | Hệ thống | Đánh dấu toàn bộ ô của tàu bị nhấn chìm đồng loạt bằng ký hiệu Sunk (phân biệt rõ với ký hiệu Hit thông thường). Hiển thị thông báo: "Đã nhấn chìm một tàu!" |
| **→** | Hệ thống | Quay lại bước 3.6 của Luồng chính. |

### 7.3. Luồng thay thế 3.A3 — Toàn bộ tàu đối thủ bị nhấn chìm (Player thắng)

> Rẽ nhánh từ bước **3.6** *(EP: end-game)* — Áp dụng khi lần tấn công này nhấn chìm con tàu cuối cùng của Máy tính.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **3.A3.1** | Hệ thống | Xác định toàn bộ tàu đối thủ đã bị nhấn chìm — điều kiện kết thúc được thỏa mãn. |
| **3.A3.2** | Hệ thống | Kích hoạt UC-05 với kết quả `Player` thắng. |
| **3.A3.3** | Hệ thống | Kết thúc. |

## 8. Luồng ngoại lệ (Exception Flows)

### 8.1. Ngoại lệ 3.E1 — Player chọn ô đã bị tấn công

> Rẽ nhánh từ bước **3.3** — Áp dụng khi `Player` click vào một ô đã có kết quả Hit, Miss hoặc Sunk trên bảng đối thủ.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **3.E1.1** | `Player` | Click vào một ô đã bị tấn công trước đó trên bảng đối thủ. |
| **3.E1.2** | Hệ thống | Không xử lý lượt tấn công; hiển thị thông báo "Ô này đã bị tấn công. Vui lòng chọn ô khác." Trạng thái ván chơi không thay đổi. |
| **3.E1.3** | `Player` | Chọn lại ô hợp lệ từ bước 3.2. |

### 8.2. Ngoại lệ 3.E2 — Player chọn ô ngoài giới hạn bảng

> Rẽ nhánh từ bước **3.3** — Trường hợp hiếm gặp, thường được ngăn trước ở tầng giao diện.

| Bước | Actor | Hành động / Phản hồi |
|------|-------|----------------------|
| **3.E2.1** | `Player` | Thao tác bất thường dẫn đến việc chọn tọa độ nằm ngoài giới hạn bảng 10×10. |
| **3.E2.2** | Hệ thống | Không xử lý lượt tấn công. Không thay đổi trạng thái ván chơi. Trạng thái lượt `Player` vẫn được giữ nguyên. |
| **3.E2.3** | `Player` | Chọn lại ô hợp lệ từ bước 3.2. |

## 9. Quan hệ Use Case (Includes / Extends)

**«include»:**
Không có.

**«extend» — được mở rộng bởi:**
- **UC-05** — Kết thúc ván chơi: UC-05 mở rộng UC-03 tại extension point “điều kiện kết thúc ván chơi được thỏa mãn” — khi toàn bộ tàu đối thủ bị nhấn chìm (bước 3.A3).

## 10. Quy tắc nghiệp vụ áp dụng

| ID | Quy tắc | Nguồn |
|----|---------|-------|
| RUL-06 | Mỗi ô trên bảng chỉ có thể bị tấn công một lần trong ván chơi. | BRD §4.2 |
| RUL-07 | Người chơi thực hiện lượt đầu tiên; sau đó luân phiên với đối thủ máy tính. | BRD §4.2 |

## 11. Yêu cầu phi chức năng (Non-Functional Requirements)

- Phản hồi click tấn công (từ lúc click đến khi hiển thị kết quả Hit/Miss/Sunk) ≤ 500 ms. *(DoD — Tiêu chí hiệu năng)*
- Ký hiệu hiển thị cho Hit, Miss và Sunk phải phân biệt rõ ràng bằng màu sắc hoặc icon khác nhau. *(US-07 — AC)*
- Toàn bộ ô của tàu bị Sunk phải được đánh dấu đồng loạt và có ký hiệu khác biệt so với Hit thông thường. *(US-07 — AC)*
- Giao diện bảng đối thủ phải bị vô hiệu hóa ngay sau khi `Player` hoàn tất lượt hợp lệ để tránh click nhầm trong khi hệ thống đang xử lý. *(US-06 — AC; DoD — Tiêu chí ổn định)*
- Thông báo lỗi khi chọn ô không hợp lệ phải ngắn gọn, xuất hiện tức thì và không làm thay đổi trạng thái ván chơi. *(US-06 — AC; DoD — Tiêu chí giao diện và trải nghiệm)*
- Trạng thái bảng sau mỗi lượt phải nhất quán giữa giao diện người dùng và dữ liệu nội bộ của hệ thống. *(US-06, US-07; DoD — Tiêu chí ổn định)*

## 12. Ghi chú

**Giả định và quyết định thiết kế:**
- `Player` thực hiện lượt tấn công đầu tiên trong ván chơi theo RUL-07.
- Mỗi ô trên bảng chỉ có thể bị tấn công một lần trong toàn bộ ván chơi (RUL-06).
- Không có cơ chế "hoàn tác" (undo) hoặc hủy lượt tấn công sau khi `Player` đã click.
- Giao diện ngăn việc chọn ô ngoài giới hạn bảng trước khi gửi lên hệ thống.
- Luồng chính chọn kết quả "Trượt" (Miss) vì đây là kết quả thống kê phổ biến nhất trong một lượt tấn công.

**Nguồn & Tham chiếu:**
- **Nguồn URD:** US-06 (EP-03), US-07 (EP-03), F-06, F-07, F-08 — `document/user-requirements.md`
- **Use case liên quan:** UC-02 kích hoạt UC-03 lần đầu; UC-03 và UC-04 luân phiên nhau; UC-05 được kích hoạt khi toàn bộ tàu đối thủ bị nhấn chìm.
- **Sơ đồ use case:** `document/use-case-diagram.md`
