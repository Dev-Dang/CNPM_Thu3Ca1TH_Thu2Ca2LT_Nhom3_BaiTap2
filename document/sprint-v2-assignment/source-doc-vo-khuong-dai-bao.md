# Source Doc - Võ Khương Đại Bảo

## 1. Tóm tắt nhiệm vụ

**Phân công v2:** kết thúc ván, High Score, theme sáng/tối.

**Phạm vi chính:**

- Hoàn thiện luồng kết thúc ván chơi theo `UC-05 - Kết thúc ván chơi và ghi nhận kết quả`.
- Hiển thị kết quả thắng/thua và lý do kết thúc rõ ràng.
- Ghi nhận, hiển thị và cập nhật một `High Score` cục bộ duy nhất.
- Bổ sung `UC-06 - Chuyển đổi giao diện sáng/tối`.
- Lưu lựa chọn theme và áp dụng nhất quán toàn bộ UI.

**Liên quan tài liệu:**

- Use case: `UC-05`, `UC-06`.
- User story: `US-09`, `US-10`, `US-16`, `US-17`.
- Business requirement: `BR-08`, `BR-09`, `BR-18`, `BR-19`.
- Rule: `RUL-03`, `RUL-11`, `RUL-14`.

**Code liên quan:** `ResultScreen.jsx`, `StatusBar.jsx`, `App.jsx`, `gameSlice.js`, `styles/*`, local storage.

## 2. Yêu cầu trích từ BRD

Nguồn: `business-requirements.md` bản `1.2.1`, ngày `05-06-2026`.

### 2.1. Phạm vi và mục tiêu v2

- Phiên bản 2 mở rộng trên nền tảng v1 với các tính năng: đặt tàu tự động, kéo thả tàu, lựa chọn độ khó `Easy 10×10 / Normal 12×12`, quy tắc bắn tiếp khi trúng, hệ thống điểm số & High Score và tuỳ chọn giao diện sáng/tối.
- `BG-05`: đảm bảo tính nhất quán dữ liệu High Score và tính điểm qua các ván chơi. High Score được lưu, hiển thị đúng và không bị mất khi reload.
- Tiêu chí nghiệm thu v2 có mục `High Score`: High Score cục bộ duy nhất được lưu và hiển thị đúng; khi kết thúc ván, kiểm tra điểm được ghi nhận nếu cao hơn High Score hiện tại.
- Tiêu chí nghiệm thu v2 có mục `Tuỳ chọn theme`: người chơi có thể chuyển đổi giữa giao diện sáng và tối; bật/tắt theme thì toàn bộ UI cập nhật đúng theo theme được chọn.

### 2.2. Business Requirements

| ID | Nội dung | Mức ưu tiên | Tiêu chí chấp nhận |
|---|---|---|---|
| `BR-08` | Ván chơi kết thúc khi toàn bộ đội tàu của một bên bị nhấn chìm. | MUST | Ván chơi kết thúc khi Fleet của một bên đã bị nhấn chìm toàn bộ. |
| `BR-09` | Kết quả thắng hoặc thua cần được thông báo khi ván chơi kết thúc. | SHOULD | Khi kết thúc, kết quả thắng/thua được hiển thị tương ứng. |
| `BR-18` | Trò chơi cần lưu một High Score cục bộ duy nhất, hiển thị High Score hiện tại trong ván chơi và làm nổi bật khi Người chơi vượt High Score đang lưu. | MUST | High Score hiện tại hiển thị trong ván chơi; khi điểm hiện tại vượt High Score đang lưu, hệ thống làm nổi bật trạng thái High Score mới; khi ván chơi kết thúc, nếu điểm hiện tại cao hơn High Score đang lưu, hệ thống cập nhật High Score bằng điểm hiện tại. |
| `BR-19` | Người chơi cần có thể chuyển đổi giữa Light Theme và Dark Theme. | SHOULD | Bật/tắt theme; toàn bộ UI cập nhật màu sắc đúng theo theme đã chọn. |

### 2.3. Business Rules

| ID | Quy tắc |
|---|---|
| `RUL-03` | Người chơi thắng khi toàn bộ tàu của đối thủ bị nhấn chìm. |
| `RUL-11` | High Score là điểm cao nhất cục bộ của Người chơi; chỉ cập nhật khi ván chơi kết thúc và điểm cuối cao hơn High Score hiện tại. |
| `RUL-14` | Lựa chọn theme sáng/tối được lưu và áp dụng nhất quán trong toàn bộ phiên chơi. |

### 2.4. Ràng buộc phạm vi và lưu trữ

- `EX-04`: v2 chỉ lưu một High Score cục bộ duy nhất; bảng xếp hạng trực tuyến nằm ngoài phạm vi.
- `EX-05`: v2 không lưu lịch sử toàn bộ trận đấu.
- High Score được lưu bằng local storage; không yêu cầu backend hoặc cơ sở dữ liệu.
- `RSK-06`: có rủi ro dữ liệu High Score bị mất hoặc sai lệch do lỗi local storage; cần validate dữ liệu trước khi lưu và xử lý lỗi khi đọc/ghi local storage.
- Thuật ngữ BRD: `High Score` là điểm cao nhất cục bộ duy nhất của Người chơi, lưu trong local storage và chỉ cập nhật sau khi ván chơi kết thúc nếu điểm cuối cao hơn điểm đang lưu.
- Thuật ngữ BRD: `Light Theme / Dark Theme` là tuỳ chọn giao diện sáng hoặc tối áp dụng toàn bộ UI của trò chơi.

## 3. Yêu cầu trích từ URD

Nguồn: `user-requirements.md` bản `2.1`, ngày `05-06-2026`.

### 3.1. Tổng quan tính năng

- Người chơi cần có thể khởi tạo ván chơi mới, chọn độ khó, đặt Fleet, thực hiện tấn công theo lượt với đối thủ máy tính, nhận phản hồi `Hit`, `Miss`, `Sunk`, xem kết quả thắng/thua, điểm số và High Score sau ván chơi.
- v2 bổ sung hệ thống tính điểm và combo, High Score lưu cục bộ, và tuỳ chọn giao diện sáng/tối.
- `SC-12`: ghi nhận High Score, lưu một điểm cao nhất cục bộ, hiển thị High Score hiện tại trong ván chơi và làm nổi bật khi Người chơi vượt High Score đang lưu.
- `SC-13`: người chơi có thể chuyển đổi giữa Light Theme và Dark Theme.
- `CON-06`: v2 sử dụng local storage để lưu High Score và lựa chọn giao diện; không yêu cầu backend. High Score và theme chỉ tồn tại trên trình duyệt đang dùng.

### 3.2. Feature Mapping

| Feature | Nội dung | Liên kết BRD |
|---|---|---|
| `F-08` | Ván chơi kết thúc khi toàn bộ tàu của một bên bị nhấn chìm. | `BR-08` |
| `F-09` | Người chơi thấy kết quả thắng hoặc thua khi ván chơi kết thúc. | `BR-09` |
| `F-15` | Ghi nhận và hiển thị điểm cao nhất, High Score. | `BR-18` |
| `F-16` | Chuyển đổi giao diện sáng/tối, Light/Dark Theme. | `BR-19` |

### 3.3. Epic và Use Case

- `EP-04 - Kết thúc ván chơi`: hệ thống xác định kết thúc và hiển thị kết quả thắng/thua. Liên quan `BR-08`, `BR-09`.
- `EP-06 - Điểm số và thành tích`: người chơi theo dõi điểm số, combo và High Score trong ván chơi. Liên quan `BR-17`, `BR-18`.
- `EP-07 - Tuỳ chọn giao diện`: người chơi chuyển đổi giữa giao diện sáng và giao diện tối. Liên quan `BR-19`.
- `UC-05 - Kết thúc ván chơi và ghi nhận kết quả`: actor `ACT-01`, liên quan `US-09`, `US-10`, `US-16`, mức ưu tiên MUST.
- `UC-06 - Chuyển đổi giao diện sáng/tối`: actor `ACT-01`, liên quan `US-17`, mức ưu tiên SHOULD.

### 3.4. User Stories

#### US-09 - Thông báo kết thúc ván chơi

- Actor: `UG-01 - Người chơi`.
- User story: người chơi muốn được thông báo khi ván chơi kết thúc để biết trận đấu đã hoàn thành.
- Acceptance criteria chính:
  - Khi hệ thống kiểm tra điều kiện kết thúc, hệ thống xác định ván chơi kết thúc và hiển thị thông báo kết thúc dạng text label.
  - Khi ván chơi đã kết thúc, người chơi cần thấy trạng thái kết thúc rõ ràng trên màn hình.

#### US-10 - Hiển thị kết quả thắng/thua

- Actor: `UG-01 - Người chơi`.
- User story: người chơi muốn thấy kết quả cuối ván là thắng hoặc thua cùng lý do kết thúc để có cảm giác kết thúc rõ ràng và dễ hiểu.
- Acceptance criteria chính:
  - Nếu ván chơi kết thúc do toàn bộ tàu của máy tính bị nhấn chìm, hệ thống hiển thị kết quả thắng.
  - Nếu ván chơi kết thúc do toàn bộ tàu của người chơi bị nhấn chìm, hệ thống hiển thị kết quả thua.
  - Khi người chơi đọc thông tin kết thúc, hệ thống phải cho biết lý do kết thúc.

#### US-16 - Theo dõi và lưu High Score

- Actor: `UG-01 - Người chơi`.
- User story: người chơi muốn theo dõi High Score hiện tại trong ván chơi để biết khi nào mình lập thành tích tốt nhất mới.
- Ghi chú: High Score là điểm cao nhất cục bộ duy nhất; chỉ cập nhật khi ván chơi kết thúc và điểm cuối cao hơn High Score hiện tại.
- Acceptance criteria chính:
  - Hệ thống hiển thị High Score hiện tại rõ ràng trên màn hình.
  - Khi điểm hiện tại của Người chơi vượt High Score hiện tại, hệ thống làm nổi bật trạng thái High Score mới cho Người chơi.
  - Khi ván chơi kết thúc và điểm cuối cao hơn High Score hiện tại, hệ thống cập nhật High Score bằng điểm cuối của ván chơi.
  - Khi ván chơi kết thúc và điểm cuối không cao hơn High Score hiện tại, hệ thống giữ nguyên High Score hiện tại.
  - Sau khi reload, High Score đã lưu vẫn được hiển thị trên cùng trình duyệt.

#### US-17 - Chuyển đổi giao diện sáng/tối

- Actor: `UG-01 - Người chơi`.
- User story: người chơi muốn chuyển đổi giữa giao diện sáng và giao diện tối để chọn giao diện phù hợp với sở thích hoặc điều kiện ánh sáng.
- Acceptance criteria chính:
  - Khi Người chơi chuyển đổi giữa giao diện sáng và giao diện tối, hệ thống áp dụng theme được chọn cho giao diện.
  - Theme phải được lưu cục bộ để dùng lại trong cùng trình duyệt.

### 3.5. Definition of Done và ràng buộc kiểm thử

- High Score được kiểm thử tối thiểu 3 trường hợp: hiển thị trong ván chơi, không cập nhật khi điểm thấp hơn, cập nhật khi điểm cao hơn sau khi kết thúc ván.
- Các thành phần v2 như chọn độ khó, Auto-Place, kéo thả/điều chỉnh tàu, điểm số, combo, High Score và chuyển Light/Dark Theme phải hiển thị rõ ràng trong đúng trạng thái ván chơi.
- Light Theme và Dark Theme phải áp dụng nhất quán cho toàn bộ UI, không làm mất khả năng đọc trạng thái `Hit/Miss/Sunk`, lượt hiện tại, điểm số, combo hoặc High Score.
- High Score chỉ dùng local storage; không có backend, cơ sở dữ liệu hoặc bảng xếp hạng trực tuyến.
- Thao tác chuyển theme phản hồi trong `≤ 500ms` trên trình duyệt hiện hành.
- Dữ liệu High Score và lựa chọn theme chỉ được lưu cục bộ trên trình duyệt; dữ liệu đọc từ local storage phải được xử lý an toàn khi thiếu, sai định dạng hoặc không khả dụng.

## 4. Codebase hiện tại liên quan

Codebase: `battle-ship/`.

### 4.1. `src/store/gameSlice.js`

Hiện trạng:

- `initialState` đang có: `phase`, `playerBoard`, `computerBoard`, `playerFleet`, `computerFleet`, `selectedShipId`, `winner`, `lastAttackResult`, `errorMessage`.
- Chưa có state chính thức cho `score`, `combo`, `highScore`, `theme`.
- `playerAttack` kiểm tra end game bằng `checkEndGame(state.computerFleet, newBoard)`. Nếu toàn bộ tàu máy tính bị chìm thì set `phase = PHASES.GAME_OVER` và `winner = WINNER.PLAYER`.
- `computerAttack` dùng `processAttack`; nếu `attack.isGameOver` thì set `phase = PHASES.GAME_OVER` và `winner = WINNER.COMPUTER`.
- `startGame` reset board, fleet, selected ship và winner; cần lưu ý không được reset mất High Score vì High Score là dữ liệu cục bộ dài hạn.
- Có reducer `restartGame()` nhưng đang TODO.

Việc Bảo cần phối hợp:

- High Score cần dựa trên `score` cuối ván do phần điểm/combo cung cấp.
- Cập nhật High Score chỉ khi chuyển sang `GAME_OVER` và điểm cuối cao hơn High Score hiện tại.
- Cần cơ chế đọc/ghi local storage an toàn cho `highScore` và `theme`.

### 4.2. `src/components/ResultScreen.jsx`

Hiện trạng:

- Component chính cho `UC-05`.
- Lấy `winner`, `computerBoard`, `computerFleet` từ Redux.
- Xác định `isPlayerWinner = winner === WINNER.PLAYER`.
- Hiển thị:
  - `BẠN ĐÃ THẮNG!` và lý do `Toàn bộ tàu đối thủ đã bị nhấn chìm.`
  - `BẠN ĐÃ THUA!` và lý do `Toàn bộ tàu của bạn đã bị nhấn chìm.`
- Có overlay chặn tương tác dưới màn hình kết quả.
- Có nút xem vị trí tàu đối thủ, `EnemyBoardReveal` tiết lộ hạm đội máy tính sau khi ván kết thúc.
- Có nút `CHƠI LẠI VÁN MỚI` gọi `dispatch(startGame())`.
- Có nút `QUAY VỀ MENU CHÍNH` gọi `window.location.reload()`.
- Chưa hiển thị điểm cuối ván, High Score hiện tại, trạng thái High Score mới.

Việc Bảo cần bổ sung:

- Hiển thị điểm cuối ván và High Score trên màn hình kết quả.
- Làm nổi bật nếu điểm cuối ván tạo High Score mới.
- Không tạo bảng xếp hạng hoặc lịch sử trận đấu.

### 4.3. `src/components/StatusBar.jsx`

Hiện trạng:

- Hiển thị logo `BATTLESHIP`, mode `vs Máy Tính`, phase label và nút `Ván Mới`.
- `PHASE_LABELS` có `GAME_OVER: Ván chơi kết thúc`.
- Chưa hiển thị High Score hiện tại.
- Chưa có nút chuyển Light/Dark Theme.

Việc Bảo có thể làm:

- Thêm hiển thị High Score hiện tại để đáp ứng `BR-18` và `US-16`.
- Thêm control chuyển theme, ví dụ nút/toggle Light/Dark.
- Đảm bảo nút theme vẫn dùng được ở các phase phù hợp và không ảnh hưởng nút `Ván Mới`.

### 4.4. `src/App.jsx`

Hiện trạng:

- Lấy `phase` từ Redux.
- Render `StartScreen` khi `phase === null`.
- Render `StatusBar` khi `phase !== null`.
- Render `SetupBoard`, `GameBoard`, `ResultScreen` theo phase.
- Import `./styles/app.css`.
- Chưa có logic áp dụng theme class hoặc data attribute ở root.

Việc Bảo có thể làm:

- Áp dụng theme ở root, ví dụ class/data attribute theo `theme`.
- Đảm bảo theme tác động toàn bộ màn hình: menu, setup, battle, result, status bar, dialog.

### 4.5. `src/styles/*`

Hiện trạng:

- CSS đang dùng nhiều màu hard-code trong `app.css`, `status-bar.css`, `game-over.css`, `cell.css`, `grid.css`, `game-board.css`, `setup-board.css`, `start-screen.css`, `dialog.css`.
- `game-over.css` đang hard-code modal sáng, header xanh, text vàng.
- `status-bar.css` đang hard-code nền trắng, viền sáng, text xanh/xám.
- Chưa thấy hệ thống CSS variable cho Light/Dark Theme.

Việc Bảo cần lưu ý:

- Nên thống nhất biến màu ở cấp global/root để theme áp dụng nhất quán.
- Không làm mất khả năng đọc các trạng thái gameplay: `Hit`, `Miss`, `Sunk`, lượt hiện tại, score, combo, High Score.
- Bảng kết quả và bảng reveal cần vẫn rõ trong cả Light Theme và Dark Theme.

### 4.6. Local storage

Hiện trạng:

- Chưa thấy usage `localStorage` trong `src`.

Yêu cầu cần có:

- Lưu một High Score cục bộ duy nhất.
- Lưu lựa chọn theme.
- Đọc dữ liệu an toàn khi key thiếu, sai định dạng hoặc local storage không khả dụng.
- Không dùng backend, database, bảng xếp hạng online hoặc lịch sử trận đấu.

## 5. Việc cần làm đề xuất

### 5.1. End game

- Giữ điều kiện kết thúc hiện tại: toàn bộ Fleet của một bên bị nhấn chìm thì chuyển `phase = GAME_OVER`.
- Đảm bảo `winner` luôn được set rõ: `WINNER.PLAYER` khi người chơi thắng, `WINNER.COMPUTER` khi người chơi thua.
- Sau `GAME_OVER`, không cho tấn công thêm. Overlay `ResultScreen` hiện đã hỗ trợ chặn tương tác, nhưng reducer/action cũng không nên xử lý attack khi phase không hợp lệ.
- Giữ thông báo kết quả và lý do đúng với UC-05:
  - Thắng: toàn bộ tàu đối thủ đã bị nhấn chìm.
  - Thua: toàn bộ tàu của người chơi đã bị nhấn chìm.

### 5.2. High Score

- Thống nhất với phần điểm/combo của nhóm về state `score`; Bảo không nên tự tạo công thức điểm nếu phần đó thuộc người khác.
- Thêm state hoặc selector cho `highScore`, đọc từ local storage khi app khởi tạo.
- Trong ván chơi, hiển thị High Score hiện tại rõ ràng, ưu tiên tại `StatusBar` hoặc khu vực score.
- Khi `score > highScore` trong lúc chơi, hiển thị trạng thái nổi bật như `High Score mới`.
- Chỉ ghi local storage khi ván chơi kết thúc và điểm cuối cao hơn High Score hiện tại.
- Nếu điểm cuối không cao hơn High Score hiện tại, giữ nguyên giá trị cũ.
- Khi reload app trên cùng trình duyệt, High Score đã lưu phải vẫn hiển thị.
- Validate dữ liệu đọc từ local storage:
  - Key không tồn tại: dùng `0`.
  - Giá trị không phải số hợp lệ hoặc âm: dùng `0`.
  - localStorage lỗi hoặc bị chặn: app vẫn chạy, chỉ không persist được.

### 5.3. Theme sáng/tối

- Thêm state `theme`, ví dụ `light` hoặc `dark`.
- Đọc theme từ local storage khi khởi tạo; nếu thiếu thì dùng mặc định thống nhất với nhóm.
- Thêm action/toggle đổi theme.
- Lưu theme vào local storage sau khi đổi.
- Áp dụng theme ở root app, ví dụ class hoặc `data-theme`.
- Refactor CSS hard-code sang CSS variables cho các màu nền, text, panel, border, button.
- Kiểm tra toàn bộ UI: Start, StatusBar, SetupBoard, GameBoard, ResultScreen, Dialog.
- Đảm bảo thao tác đổi theme phản hồi trong `≤ 500ms`.

### 5.4. Tích hợp với code của nhóm

- Không làm thay phần của Sơn/Trung/Vượng/Trí, nhưng cần phối hợp các state chung: `difficulty`, `boardSize`, `fleet`, `score`, `combo`, `highScore`, `theme`.
- Nếu `score` và `combo` chưa có, chuẩn bị UI/logic High Score theo selector/state dự kiến nhưng tránh phá reducer hiện tại.
- Nếu board size được đổi sang `10×10` hoặc `12×12`, `EnemyBoardReveal` không nên hard-code `repeat(10, 1fr)`; cần hiển thị theo kích thước board thực tế.
- Không dùng `window.location.reload()` nếu reload làm mất state cần giữ hoặc gây trải nghiệm không nhất quán; nếu giữ, phải đảm bảo High Score và theme vẫn được restore từ local storage.

## 6. Checklist nghiệm thu cá nhân

### 6.1. Kết thúc ván

- [ ] Khi toàn bộ tàu máy tính bị nhấn chìm, game chuyển sang màn hình kết quả và hiển thị người chơi thắng.
- [ ] Khi toàn bộ tàu người chơi bị nhấn chìm, game chuyển sang màn hình kết quả và hiển thị người chơi thua.
- [ ] Màn hình kết quả có text label rõ ràng và lý do kết thúc.
- [ ] Sau khi ván kết thúc, người chơi không thể tấn công thêm.
- [ ] Có thể xem lại vị trí hạm đội máy tính sau khi kết thúc.
- [ ] Nút `Chơi lại` khởi tạo ván mới đúng luồng.
- [ ] Nút quay về menu không làm mất High Score hoặc theme đã lưu.

### 6.2. High Score

- [ ] High Score hiện tại hiển thị rõ trong ván chơi.
- [ ] Khi điểm hiện tại vượt High Score, UI làm nổi bật trạng thái High Score mới.
- [ ] High Score chỉ cập nhật khi ván chơi kết thúc.
- [ ] Nếu điểm cuối cao hơn High Score hiện tại, local storage được cập nhật bằng điểm cuối.
- [ ] Nếu điểm cuối không cao hơn High Score hiện tại, High Score giữ nguyên.
- [ ] Reload trình duyệt vẫn hiển thị High Score đã lưu trên cùng trình duyệt.
- [ ] Dữ liệu local storage thiếu, sai định dạng, âm hoặc không đọc được không làm crash app.
- [ ] Không lưu lịch sử toàn bộ trận đấu.
- [ ] Không tạo bảng xếp hạng online, backend hoặc database.

### 6.3. Theme sáng/tối

- [ ] Người chơi chuyển được giữa Light Theme và Dark Theme.
- [ ] Theme được áp dụng nhất quán cho toàn bộ UI.
- [ ] Theme đã chọn được lưu cục bộ và khôi phục sau reload.
- [ ] Chuyển theme phản hồi trong `≤ 500ms`.
- [ ] Trạng thái `Hit`, `Miss`, `Sunk` vẫn dễ đọc trong cả hai theme.
- [ ] Lượt hiện tại, điểm số, combo và High Score vẫn dễ đọc trong cả hai theme.
- [ ] Dialog, status bar, màn hình setup, battle và result không bị lệch màu hoặc mất tương phản.

### 6.4. Tích hợp

- [ ] Không phá luồng `UC-03` và `UC-04` khi kiểm tra điều kiện kết thúc.
- [ ] Không reset High Score khi bắt đầu ván mới.
- [ ] Không reset theme khi bắt đầu ván mới.
- [ ] Tương thích với cấu hình board theo độ khó `Easy 10×10` và `Normal 12×12`.
- [ ] Không chỉnh ngoài phạm vi file/code thuộc nhiệm vụ nếu chưa thống nhất với nhóm.
