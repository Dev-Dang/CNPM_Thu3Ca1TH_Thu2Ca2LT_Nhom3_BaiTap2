# Đặc tả Use Case: Thực Hiện Lượt Tấn Công (Máy Tính)

## Lịch sử chỉnh sửa

| Phiên bản | Ngày       | Tác giả          | Mô tả |
|-----------|------------|------------------|-------|
| 1.0       | 27/04/2026 | Đặng Văn Trung   | Phiên bản đầu tiên — sinh từ URD v2.0 (US-08) |
| 1.2       | 09/05/2026 | Đặng Văn Trung   | Bước 4.7 (chờ 500ms trước chuyển lượt) vào Normal Flow; thêm bước 4.A3.2 (chờ 500ms trước UC-05); cập nhật Post-condition 3. |
| 1.3       | 16/05/2026 | Đặng Văn Trung   | Thêm bước 4.1.0 xác định điểm bắt đầu UC-04; tách thành 2 step; đánh số lại toàn bộ các bước theo cú pháp 4.[Index].[Step]; gộp xác định kết quả Miss/Hit/Sunk vào một bước inline (4.1.3); đảo thứ tự kiểm tra end-game (4.1.4) trước hiển thị UI (4.1.5); xóa luồng thay thế Hit và Sunk riêng lẻ. |
| 2.0       | 07/06/2026 | Bùi Hữu Trí      | Thêm chế độ khó (difficulty): Easy là luồng chính, Normal (Hunt-and-Target) là luồng thay thế 4.2. Thêm quy tắc RUL-07: Normal bắn trúng → giữ lượt CPU_TURN (bắn tiếp). Cập nhật computerTargetQueue sau hit/sunk. Đánh số lại luồng: 4.2 (Normal difficulty), 4.3 (end-game), 4.4 (lỗi). |
| 2.1       | 07/06/2026 | Bùi Hữu Trí      | Tách 4.2.4 và 4.2.5 thành luồng thay thế riêng 4.5 (cập nhật computerTargetQueue sau bước 4.1.4); bỏ bước 4.3.2 (đã được xử lý ngầm trong processAttack ở 4.1.3); cập nhật luồng thay thế 4.2 chỉ còn 4.2.1 → 4.2.3. |

---

## 1. Giới thiệu

| Trường           | Nội dung |
|------------------|----------|
| **Use Case ID**  | UC-04 |
| **Tên Use Case** | Thực Hiện Lượt Tấn Công (Máy Tính) |
| **Độ ưu tiên**   | MUST — Phải có, vì Máy tính phải thực hiện lượt tấn công để duy trì vòng lặp luân phiên sau lượt của Player. |
| **Actor chính**  | Máy tính |
| **Actor phụ**    | Không có |

---

## 2. Mô tả Use Case

Máy tính tự động thực hiện lượt tấn công lên bảng của `Player` theo logic phù hợp với độ khó đã chọn. Ở chế độ **Easy**, Máy tính chọn ô ngẫu nhiên trong số các ô chưa bị tấn công. Ở chế độ **Normal**, Máy tính áp dụng chiến thuật Hunt-and-Target: ưu tiên các ô liền kề quanh ô đã bắn trúng trước đó.

Sau khi bắn, hệ thống cập nhật board và fleet, sau đó kiểm tra kết quả (Hit, Miss, hoặc Sunk) và áp dụng quy tắc chung cho **cả hai chế độ**: nếu bắn trúng (Hit hoặc Sunk) và ván chưa kết thúc, Máy tính tiếp tục bắn ngay; nếu bắn trượt (Miss), trả lượt cho Player.

---

## 3. Điều kiện tiên quyết (Pre-conditions)

1. `Player` vừa hoàn thành lượt tấn công hợp lệ tại UC-03 mà không dẫn đến kết thúc ván chơi.
2. Bảng của `Player` đang hiển thị với ít nhất một ô chưa bị Máy tính tấn công.
3. Độ khó (`difficulty`) đã được xác lập trước khi ván đấu bắt đầu (`'easy'` hoặc `'normal'`); mặc định là `'normal'` nếu không được đặt.

---

## 4. Sự kiện kích hoạt (Trigger)

`Player` hoàn thành lượt tấn công hợp lệ tại UC-03; hệ thống tự động chuyển lượt sang Máy tính và kích hoạt UC-04 ngay sau đó mà không cần thao tác từ `Player`.

---

## 5. Hậu điều kiện (Post-conditions)

1. Ô được Máy tính chọn trên bảng `Player` hiển thị kết quả: ký hiệu Miss, Hit, hoặc Sunk (phân biệt bằng màu sắc/icon).
2. Nếu kết quả là Sunk: toàn bộ ô của tàu bị nhấn chìm được đánh dấu bằng ký hiệu Sunk.
3. Kết quả lượt tấn công của Máy tính được hiển thị tối thiểu 500ms trước khi hệ thống tự động chuyển lượt hoặc kết thúc ván chơi.
4. Nếu kết quả là Hit hoặc Sunk và ván chưa kết thúc: Máy tính tiếp tục bắn ngay — áp dụng cho **cả Easy lẫn Normal**. Ở chế độ Normal, `computerTargetQueue` được cập nhật thêm các ô liền kề hợp lệ.
5. Hệ thống chuyển sang lượt `Player` (UC-03) khi kết quả là Miss, hoặc kích hoạt UC-05 nếu toàn bộ tàu `Player` đã bị nhấn chìm.

---

## 6. Luồng chính (Normal Flow)

> **Luồng chính áp dụng cho cả Easy và Normal**. Hai chế độ chỉ khác nhau ở bước 4.1.2 (cách chọn ô tấn công). Toàn bộ các bước còn lại dùng chung.

| Bước      | Actor    | Hành động / Phản hồi |
|-----------|----------|----------------------|
| **4.1.0** | Hệ thống | UC-03 hoàn tất mà không kết thúc ván chơi → hệ thống chuyển lượt sang Máy tính và kích hoạt UC-04. |
| **4.1.1** | Máy tính | Nhận lượt từ hệ thống; bắt đầu xử lý lượt tấn công. |
| **4.1.2** | Máy tính | Chọn một ô chưa bị tấn công trên bảng `Player` theo độ khó đang áp dụng: <br>- **Easy**: chọn ngẫu nhiên trong danh sách ô hợp lệ còn lại. <br>- **Normal**: ưu tiên ô trong `computerTargetQueue`; nếu queue rỗng thì chọn ngẫu nhiên. *[Xem Luồng thay thế 4.2 về chi tiết Normal]* |
| **4.1.3** | Hệ thống | Xử lý lượt tấn công, xác định kết quả và cập nhật trạng thái board: <br>- Ô không chứa tàu → **"Trượt" (Miss)** — đánh dấu ô bằng ký hiệu Miss. <br>- Ô chứa tàu, tàu còn ô khác chưa bị tấn công → **"Trúng" (Hit)** — đánh dấu ô bằng ký hiệu Hit. <br>- Ô chứa tàu, là ô cuối cùng của tàu đó → **"Nhấn chìm" (Sunk)** — đánh dấu toàn bộ ô của tàu bằng ký hiệu Sunk. <br>Kết quả gồm: board đã cập nhật, fleet đã cập nhật, kết quả lượt (Miss/Hit/Sunk), và cờ kết thúc ván. |
| **4.1.4** | Hệ thống | Cập nhật trạng thái ván chơi: gán board và fleet của `Player` theo kết quả vừa xử lý ở bước 4.1.3. *[Nếu difficulty = 'normal' → Luồng thay thế 4.5]* |
| **4.1.5** | Hệ thống | Kiểm tra điều kiện kết thúc ván. Nếu toàn bộ tàu của `Player` đã bị nhấn chìm → kích hoạt UC-05 *(Luồng thay thế 4.3)*. |
| **4.1.6** | Hệ thống | Xác định lượt tiếp theo (áp dụng cho **cả Easy lẫn Normal** — RUL-07): <br>- Kết quả **Hit hoặc Sunk** → giữ lượt Máy tính; quay lại **4.1.1** bắn tiếp. <br>- Kết quả **Miss** → chuyển sang lượt `Player`, kích hoạt UC-03. |
| **4.1.7** | Hệ thống | Kết thúc. |

---

## 7. Luồng thay thế (Alternate Flows)

### 7.1. Luồng thay thế 4.2 — Chế độ Normal: Chi tiết chọn ô Hunt-and-Target

> Rẽ nhánh từ bước **4.1.2** *(khi difficulty = 'normal')* — Mô tả chi tiết cách `selectNormalAttackCell` chọn ô. Sau bước này, luồng **nhập lại bước 4.1.3** của luồng chính.

| Bước      | Actor    | Hành động / Phản hồi |
|-----------|----------|----------------------|
| **4.2.1** | Máy tính | Duyệt qua từng ô trong `computerTargetQueue`, lọc ra các ô còn hợp lệ (chưa bị tấn công, nằm trong bảng) → ra danh sách ô ưu tiên hợp lệ. |
| **4.2.2** | Máy tính | Kiểm tra danh sách ô ưu tiên hợp lệ: <br>- **Có ô** → chọn ô đầu tiên trong danh sách (ô liền kề được ưu tiên từ lần bắn trúng trước). <br>- **Rỗng** → chọn ngẫu nhiên trong toàn bộ ô hợp lệ còn lại trên bảng. |
| **4.2.3** | Máy tính | Xác định được ô sẽ tấn công → nhập lại **bước 4.1.3** của luồng chính. |

---

### 7.2. Luồng thay thế 4.3 — Toàn bộ tàu Player bị nhấn chìm (Player thua)

> Rẽ nhánh từ bước **4.1.5** *(khi isGameOver = true)* — Áp dụng khi lượt tấn công của Máy tính làm toàn bộ tàu của `Player` bị nhấn chìm.

| Bước      | Actor    | Hành động / Phản hồi |
|-----------|----------|----------------------|
| **4.3.1** | Hệ thống | Xác định toàn bộ tàu `Player` đã bị nhấn chìm. Board đã được đánh dấu đầy đủ ký hiệu Sunk từ bước 4.1.3. |
| **4.3.2** | Hệ thống | Kích hoạt UC-05 với kết quả `Player` thua . |
| **4.3.3** | Hệ thống | Kết thúc. |

---

### 7.3. Luồng thay thế 4.5 — Cập nhật computerTargetQueue (Normal only)

> Rẽ nhánh từ bước **4.1.4** *(khi difficulty = 'normal')* — Cập nhật `computerTargetQueue` sau khi board và fleet đã được gán vào state. Sau bước này, luồng **nhập lại bước 4.1.5** của luồng chính.

| Bước      | Actor    | Hành động / Phản hồi |
|-----------|----------|----------------------|
| **4.5.1** | Hệ thống | Loại ô vừa bắn ra khỏi `computerTargetQueue` (dù kết quả là Miss, Hit hay Sunk). |
| **4.5.2** | Hệ thống | Nếu kết quả là Hit hoặc Sunk: xác định các ô liền kề hợp lệ chưa có trong queue (dựa trên board đã cập nhật ở bước 4.1.4), bổ sung vào `computerTargetQueue`. Nếu Miss: giữ nguyên queue. |

---

## 8. Luồng ngoại lệ (Exception Flows)

### 8.1. Ngoại lệ 4.4 — Lỗi logic chọn ô tấn công của Máy tính

> Rẽ nhánh từ bước **4.1.2** — Áp dụng khi hệ thống gặp lỗi trong quá trình kiểm tra tính hợp lệ của ô được Máy tính chọn.

| Bước      | Actor    | Hành động / Phản hồi |
|-----------|----------|----------------------|
| **4.4.1** | Hệ thống | Phát hiện lỗi khi kiểm tra tính hợp lệ của ô tại bước **4.1.2** do lỗi runtime hoặc trạng thái dữ liệu không nhất quán (ví dụ: không còn ô hợp lệ nhưng ván chưa kết thúc đúng). |
| **4.4.2** | Hệ thống | Hiển thị thông báo lỗi: *"Kết quả lượt chơi gặp lỗi. Vui lòng tải lại trang."* |
| **4.4.3** | Hệ thống | Kết thúc không thành công. |

---

## 9. Quan hệ Use Case (Includes / Extends)

**«include»:** Không có.

**«extend» — được mở rộng bởi:**
- **UC-05** — Kết thúc ván chơi: UC-05 mở rộng UC-04 tại extension point *"điều kiện kết thúc ván chơi được thỏa mãn"* ở bước **4.1.5**, khi toàn bộ tàu `Player` bị nhấn chìm.

---

## 10. Quy tắc nghiệp vụ áp dụng

| ID       | Quy tắc | Nguồn |
|----------|---------|-------|
| RUL-06   | Mỗi ô trên bảng chỉ có thể bị tấn công một lần trong ván chơi. | BRD §4.2 |
| **RUL-07** | **Ở cả hai chế độ Easy và Normal, nếu Máy tính bắn trúng (Hit hoặc Sunk) và ván chưa kết thúc, Máy tính tiếp tục bắn ngay thay vì trả lượt cho `Player`.** | **BR-16 / US-08** |

---

## 11. Yêu cầu phi chức năng (Non-Functional Requirements)

- Logic Máy tính không sử dụng thư viện trí tuệ nhân tạo (AI) hoặc học máy (ML); hoạt động ở mức thuật toán cơ bản. *(CON-04, ASM-03)*
- Phản hồi lượt tấn công Máy tính (từ khi bắt đầu xử lý đến khi hiển thị kết quả) ≤ 500ms. *(DoD — Tiêu chí hiệu năng)*
- Kết quả lượt tấn công của Máy tính (Hit/Miss/Sunk) phải được hiển thị tối thiểu 500ms trước khi hệ thống tự động chuyển lượt hoặc kết thúc ván chơi. *(US-08 — AC; DoD — Tiêu chí ổn định)*
- Ô bị Máy tính tấn công trên bảng `Player` phải hiển thị kết quả rõ ràng, phân biệt được với ô chưa bị tấn công. *(US-08 — AC)*
- Các lượt bắn liên tiếp (khi Máy tính giữ lượt sau Hit/Sunk) mỗi lượt vẫn phải tuân thủ giới hạn phản hồi ≤ 500ms và hiển thị tối thiểu 500ms. *(DoD)*

---

## 12. Ghi chú

**Giả định và quyết định thiết kế:**
- **Chế độ Easy**: Máy tính chọn ô tấn công hoàn toàn ngẫu nhiên (`selectRandomAttackCell`). Bắn trúng vẫn giữ lượt và bắn tiếp (RUL-07). Không dùng `computerTargetQueue`, luồng thay thế 4.5 không được kích hoạt.
- **Chế độ Normal**: Máy tính áp dụng chiến thuật Hunt-and-Target (`selectNormalAttackCell`) — sau mỗi lần bắn trúng, thêm các ô liền kề hợp lệ vào `computerTargetQueue` và ưu tiên chúng ở lượt tiếp theo. Khi queue rỗng, fallback về random. Bắn trúng cũng giữ lượt và bắn tiếp (RUL-07).
- Hai chế độ **chỉ khác nhau ở cách chọn ô** (bước 4.1.2) và **cập nhật queue** (luồng thay thế 4.5). Toàn bộ xử lý kết quả, cập nhật board, kiểm tra end-game và quy tắc giữ lượt là **dùng chung**.
- **Bước 4.1.3 (`processAttack`) đã xử lý ngầm việc đánh dấu board**: kết quả trả về `attack.board` đã bao gồm toàn bộ ô được đánh dấu đúng (Miss/Hit/Sunk), kể cả trường hợp Sunk toàn bộ tàu. Bước 4.1.4 chỉ gán board này vào state.
- **Thứ tự xử lý trong `computerAttack`**: board và fleet được cập nhật trước (bước 4.1.4), sau đó mới cập nhật queue (4.5) rồi kiểm tra `isGameOver` (bước 4.1.5). `isGameOver` được tính sẵn bên trong `processAttack` nên thứ tự này không ảnh hưởng đến tính đúng đắn.
- **`lastAttackResult`**: không được cập nhật trong `computerAttack` — `AttackToast` dùng giá trị này chỉ để hiển thị kết quả lượt Player, không dùng cho lượt Máy tính.
- **`getAdjacentTargets` dùng `attack.board`** (board đã cập nhật sau bước 4.1.4): ô vừa bắn đã mang trạng thái HIT/SUNK nên `validateCoordinate` tự động loại nó khỏi danh sách adjacents trả về.
- Máy tính không có khả năng học hoặc thích nghi theo chiến thuật của `Player` trong phiên bản 1. *(ASM-03)*
- Mỗi ô trên bảng chỉ có thể bị tấn công một lần trong toàn bộ ván chơi (RUL-06).
- Độ khó được giữ nguyên trong suốt một ván — `setDifficulty` chỉ có thể gọi trước khi `startBattle`.

**Nguồn & Tham chiếu:**
- **Nguồn URD:** US-08 (EP-03) — `document/user-requirements.md`
- **Use case liên quan:** UC-03 kích hoạt UC-04; UC-04 kích hoạt lại UC-03 (khi Miss) hoặc UC-05 (end-game). UC-04 có thể tự kích hoạt lại (bắn tiếp khi Hit/Sunk) ở cả hai chế độ trước khi chuyển sang UC-03.
- **Sơ đồ use case:** `document/use-case-diagram.md`
- **Quy tắc bổ sung:** RUL-07 (BR-16) — cả Easy và Normal bắn trúng đều giữ lượt CPU.
