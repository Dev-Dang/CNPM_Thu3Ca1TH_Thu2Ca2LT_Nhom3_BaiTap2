# Source-doc cá nhân: Cao Văn Vượng

## 1. Tóm tắt nhiệm vụ

Cao Văn Vượng phụ trách phần gameplay liên quan đến lượt tấn công của Người chơi trong dự án Battleship React + Redux Toolkit + Vite, trọng tâm là:

- UC-03: Thực hiện lượt tấn công (Người chơi).
- Người chơi chọn ô trên bảng đối thủ, hệ thống xử lý Hit/Miss/Sunk và cập nhật giao diện.
- Áp dụng luật v2: bên bắn trúng được bắn tiếp liên tiếp cho đến khi bắn trượt; bắn trượt thì chuyển lượt.
- Tính điểm cho các phát bắn trúng của Người chơi theo loại tàu bị bắn trúng.
- Tính và hiển thị combo: trúng liên tiếp tăng hệ số, trượt thì reset.
- Không xử lý phần High Score chính nếu không được phân công, nhưng điểm hiện tại cần đủ dữ liệu để nhóm khác cập nhật High Score cuối ván.

Nguồn cần bám sát: BRD v1.2.1, URD v2.1, use-case diagram v2.1 và code trong `battle-ship/`.

## 2. Yêu cầu trích từ BRD

### Yêu cầu nghiệp vụ liên quan

| ID | Nội dung cần áp dụng | Ưu tiên | Tiêu chí kiểm tra |
| --- | --- | --- | --- |
| BR-06 | Ván chơi diễn ra theo lượt, luân phiên giữa người chơi và máy tính, trừ khi áp dụng quy tắc bắn tiếp. | MUST | Lượt tấn công luân phiên đúng trạng thái ván chơi và quy tắc bắn tiếp. |
| BR-07 | Kết quả mỗi lượt tấn công (Hit, Miss, Sunk) cần được phản hồi rõ ràng. | MUST | Trạng thái Hit/Miss/Sunk hiển thị đúng sau mỗi lượt. |
| BR-16 | Bên bắn trúng được thực hiện thêm một lượt bắn ngay lập tức. | MUST | Sau khi trúng, bên bắn trúng tiếp tục lượt bắn thay vì chuyển lượt. |
| BR-17 | Trò chơi cần tính điểm cho mỗi phát bắn trúng và nhân hệ số combo khi bắn trúng liên tiếp. | MUST | Điểm tăng đúng sau mỗi lần trúng; combo tăng khi liên tiếp trúng, reset khi trượt. |

### Quy tắc nghiệp vụ liên quan

| ID | Quy tắc |
| --- | --- |
| RUL-06 | Mỗi ô trên bảng chỉ có thể bị tấn công một lần trong ván chơi. |
| RUL-07 | Bên bắn trúng được tiếp tục thực hiện lượt bắn liên tiếp cho đến khi bắn trượt; khi bắn trượt thì chuyển lượt. |
| RUL-09 | Mỗi phát bắn trúng cộng điểm theo loại tàu bị bắn trúng; bắn trúng liên tiếp nhân hệ số combo tăng dần. |
| RUL-10 | Hệ số combo reset về 1 khi bên đang bắn trượt và lượt chuyển sang bên còn lại. |

### Bảng điểm v2 theo loại tàu

| Loại tàu bị bắn trúng | Điểm mỗi ô trúng |
| --- | ---: |
| Tàu khu trục (Destroyer) | 20 |
| Tàu ngầm (Submarine) | 30 |
| Tàu tuần dương (Cruiser) | 30 |
| Thiết giáp hạm (Battleship) | 40 |
| Tàu sân bay (Carrier) | 50 |

Điểm thưởng:

| Sự kiện | Điểm thưởng |
| --- | ---: |
| Nhấn chìm tàu | +50 |
| Thắng ván | +100 |

Công thức:

```text
Điểm lượt bắn = điểm loại tàu bị bắn trúng × hệ số combo
```

Quy tắc combo:

| Điều kiện | Hệ số combo |
| --- | ---: |
| Phát bắn trúng đầu tiên trong lượt | ×1 |
| Phát bắn trúng liên tiếp thứ 2 | ×2 |
| Phát bắn trúng liên tiếp từ thứ 3 trở đi | ×3 |

## 3. Yêu cầu trích từ URD

### UC-03 trong use-case diagram v2.1

Theo `use-case-diagram.md` v2.1:

- UC-03: Thực hiện lượt tấn công (Người chơi).
- Actor chính: ACT-01 Người chơi.
- User Story liên quan: US-06, US-07, US-14, US-15.
- UC-05 mở rộng UC-03 khi điều kiện kết thúc ván chơi được thỏa mãn, tức toàn bộ hạm đội đối thủ đã bị nhấn chìm.

### US-06 - Chọn ô tấn công

User Story: Là UG-01 - Người chơi, tôi muốn chọn một ô trên bảng của đối thủ để tấn công, để thực hiện lượt chơi của mình.

Tiêu chí chấp nhận:

```text
GIVEN đang là lượt của người chơi trong giai đoạn tấn công
WHEN  người chơi chọn một ô hợp lệ (chưa bị tấn công) trên bảng đối thủ
THEN  hệ thống xử lý lượt tấn công và hiển thị kết quả

GIVEN đang là lượt của người chơi
WHEN  người chơi chọn một ô đã bị tấn công trước đó
THEN  hệ thống không chấp nhận lượt tấn công và thông báo cho người chơi chọn ô khác

GIVEN người chơi vừa thực hiện lượt tấn công hợp lệ
WHEN  hệ thống xử lý xong lượt
THEN  hệ thống chuyển sang lượt của máy tính theo đúng trình tự ván chơi
```

Ghi chú cho v2: tiêu chí cuối phải hiểu cùng US-14, tức chỉ chuyển sang Máy tính khi Người chơi bắn trượt hoặc ván chơi đã kết thúc; nếu bắn trúng thì Người chơi được bắn tiếp.

### US-07 - Phản hồi kết quả tấn công

User Story: Là UG-01 - Người chơi, tôi muốn biết ngay kết quả tấn công là trúng, trượt hay nhấn chìm, để điều chỉnh chiến thuật cho các lượt tiếp theo.

Tiêu chí chấp nhận:

```text
GIVEN người chơi vừa thực hiện lượt tấn công vào ô có tàu đối thủ
WHEN  hệ thống xử lý kết quả
THEN  hệ thống hiển thị kết quả "Trúng" (Hit) trên bảng đối thủ

GIVEN người chơi vừa thực hiện lượt tấn công vào ô không có tàu đối thủ
WHEN  hệ thống xử lý kết quả
THEN  hệ thống hiển thị kết quả "Trượt" (Miss) trên bảng đối thủ

GIVEN lượt tấn công trúng vào ô cuối cùng còn lại của một tàu đối thủ
WHEN  hệ thống xử lý kết quả
THEN  hệ thống hiển thị kết quả "Nhấn chìm" (Sunk) và đánh dấu toàn bộ ô của tàu đó bằng trạng thái hiển thị khác biệt so với Hit thông thường
```

### US-14 - Bắn tiếp khi trúng

User Story: Là UG-01 - Người chơi, tôi muốn lượt bắn được tiếp tục khi một bên bắn trúng, để ván chơi có thêm yếu tố thưởng lượt và tạo nhịp chơi hấp dẫn hơn.

Ghi chú: áp dụng cho cả Người chơi và Máy tính; bên bắn trượt thì chuyển lượt.

Tiêu chí chấp nhận:

```text
GIVEN Người chơi bắn trúng tàu của Máy tính
WHEN  hệ thống xử lý kết quả lượt bắn
THEN  Người chơi được tiếp tục chọn ô tấn công khác trong cùng lượt

GIVEN Người chơi bắn trượt
WHEN  hệ thống xử lý kết quả lượt bắn
THEN  hệ thống chuyển lượt sang Máy tính

GIVEN Máy tính bắn trúng tàu của Người chơi
WHEN  hệ thống xử lý kết quả lượt bắn
THEN  Máy tính được tiếp tục bắn trong cùng lượt

GIVEN Máy tính bắn trượt
WHEN  hệ thống xử lý kết quả lượt bắn
THEN  hệ thống chuyển lượt sang Người chơi
```

### US-15 - Theo dõi điểm số và combo

User Story: Là UG-01 - Người chơi, tôi muốn thấy điểm số và combo hiện tại, để biết hiệu quả các lượt bắn trúng liên tiếp của mình.

Ghi chú: Combo là chuỗi bắn trúng liên tiếp dùng để nhân điểm; combo tăng khi Người chơi bắn trúng liên tiếp và reset khi Người chơi bắn trượt.

Tiêu chí chấp nhận:

```text
GIVEN Người chơi bắn trúng tàu của Máy tính
WHEN  hệ thống xử lý điểm
THEN  điểm số của Người chơi tăng theo loại tàu bị bắn trúng và hệ số combo hiện tại

GIVEN Người chơi bắn trúng liên tiếp trong cùng lượt
WHEN  hệ thống xử lý combo
THEN  hệ số combo tăng theo quy tắc tính điểm của v2

GIVEN Người chơi bắn trượt
WHEN  hệ thống xử lý kết quả lượt bắn
THEN  combo reset về hệ số mặc định

GIVEN điểm số hoặc combo thay đổi
WHEN  Người chơi quan sát giao diện ván chơi
THEN  điểm số và combo hiện tại được hiển thị rõ ràng
```

### Lưu ý từ đặc tả UC-03 hiện có

File `document/use-case-specs/uc-03-tan-cong-nguoi-choi.md` hiện mô tả luồng v1: Player chọn ô, nhận Miss/Hit/Sunk, sau lượt hợp lệ thì chuyển sang UC-04; mỗi ô chỉ tấn công một lần; ô ngoài bảng hoặc đã tấn công không làm đổi trạng thái. Khi làm v2, phải giữ các ràng buộc hợp lệ này nhưng cập nhật phần chuyển lượt theo BRD v1.2.1 và URD v2.1: Hit/Sunk thì bắn tiếp, Miss thì chuyển lượt.

## 4. Codebase hiện tại liên quan

### `src/components/GameBoard.jsx`

- Lấy `phase`, `playerBoard`, `playerFleet`, `computerBoard`, `computerFleet`, `lastAttackResult` từ Redux.
- Khi `phase === PHASES.CPU_TURN`, `useEffect` chờ `DELAY_MS`, gọi `selectAttackCell(playerBoard)` rồi dispatch `computerAttack`.
- `isClickable = phase === PHASES.PLAYER_TURN`; bảng đối thủ chỉ click được ở lượt Người chơi.
- `handleCellClick(row, col)` clear lỗi và dispatch `playerAttack({ row, col })`.
- Chưa có logic hiển thị điểm hoặc combo trong component này.

### `src/components/Cell.jsx`

- Render trạng thái ô theo `state`: `empty`, `ship`, `hit`, `miss`, `sunk`.
- `miss` hiển thị chấm; `hit` và `sunk` cùng hiển thị dấu `x`, khác biệt chủ yếu qua CSS class.
- `disabled` chặn click; `aria-label` dùng tọa độ cột chữ + hàng số và state hiện tại.

### `src/utils/attackUtils.js`

- `validateCoordinate(row, col, board)` kiểm tra tọa độ trong `BOARD_SIZE` và ô chưa ở trạng thái `HIT`, `MISS`, `SUNK`.
- `getCellAttackInfo(row, col, board, fleet)` xác định ô có tàu không, tàu nào, còn bao nhiêu ô chưa bị đánh.
- `markCell(...)` cập nhật một ô thành `MISS` hoặc `HIT`.
- `markAllShipCells(...)` đổi toàn bộ ô của tàu sang `SUNK`.
- `checkEndGame(...)` kiểm tra toàn bộ tàu đã sunk.
- `processAttack(...)` trả về `result: 'miss' | 'hit' | 'sunk'` và `isGameOver`, đang dùng cho Máy tính trong `computerAttack`.
- Chưa có hàm tính điểm theo loại tàu, hệ số combo hoặc điểm thưởng sunk/win.

### `src/store/gameSlice.js`

- `initialState` hiện có: `phase`, `playerBoard`, `computerBoard`, `playerFleet`, `computerFleet`, `selectedShipId`, `winner`, `lastAttackResult`, `errorMessage`.
- Chưa có state cho `score`, `combo`, `comboStreak`, `lastScoreDelta` hoặc dữ liệu tương tự.
- `playerAttack` hiện xử lý hợp lệ ô, xác định `miss/hit/sunk`, cập nhật board/fleet và `lastAttackResult`.
- Vấn đề chính: sau mọi lượt Player hợp lệ mà chưa game over, reducer đang đặt `state.phase = PHASES.CPU_TURN`, kể cả khi `hit` hoặc `sunk`. Điều này chưa đáp ứng BR-16, RUL-07 và US-14.
- `computerAttack` dùng `processAttack`, nếu chưa game over thì luôn chuyển `PHASES.PLAYER_TURN`; phần bắn tiếp của Máy tính cũng chưa có, nhưng Vượng cần phối hợp vì US-14 áp dụng cho cả hai bên.
- `restartGame()` đang TODO, nếu nhóm khác xử lý thì không tự sửa ngoài phạm vi.

### `src/components/StatusBar.jsx`

- Hiển thị logo, chế độ `vs Máy Tính`, nhãn phase và nút `Ván Mới`.
- Nhãn phase hiện có: setup, lượt Người chơi, Máy tính đang suy nghĩ, game over.
- Chưa hiển thị điểm số, combo hoặc trạng thái điểm vừa cộng.

### Các file hỗ trợ cần biết

- `src/constants/gameConstants.js` hiện có `BOARD_SIZE = 10` và `SHIP_TYPES` gồm `id`, `name`, `size` cho `carrier`, `battleship`, `cruiser`, `submarine`, `destroyer`.
- `src/utils/fleetConfig.js` tạo Fleet từ `SHIP_TYPES`; mỗi ship có thể dùng `id` để map sang bảng điểm.

## 5. Việc cần làm đề xuất

1. Cập nhật state trong `gameSlice.js` cho điểm và combo của Người chơi.
   - Đề xuất thêm `score: 0`, `comboStreak: 0`, `comboMultiplier: 1`, `lastScoreDelta: 0`.
   - Reset các giá trị này khi `startGame`.
   - Nếu cần phục vụ nhóm High Score, đảm bảo điểm cuối ván đọc được từ Redux.

2. Thêm bảng điểm và hàm tính điểm.
   - Có thể đặt trong `attackUtils.js` hoặc constants riêng nếu nhóm thống nhất.
   - Map theo `ship.id`: `destroyer = 20`, `submarine = 30`, `cruiser = 30`, `battleship = 40`, `carrier = 50`.
   - Hệ số combo: streak 1 -> x1, streak 2 -> x2, streak >= 3 -> x3.
   - Khi sunk, cộng thêm `+50`; khi Người chơi thắng, cộng thêm `+100`.

3. Sửa `playerAttack` để bắn tiếp khi trúng.
   - Nếu chọn ô không hợp lệ: giữ nguyên state, hiển thị lỗi, không đổi phase, không đổi combo/score.
   - Nếu `miss`: đánh dấu miss, `lastAttackResult = 'miss'`, reset combo về mặc định, `phase = PHASES.CPU_TURN`.
   - Nếu `hit`: đánh dấu hit, tăng combo, cộng điểm theo loại tàu x hệ số, giữ `phase = PHASES.PLAYER_TURN`.
   - Nếu `sunk`: đánh dấu toàn bộ tàu sunk, tăng combo, cộng điểm theo loại tàu x hệ số + 50, nếu chưa game over thì giữ `phase = PHASES.PLAYER_TURN`.
   - Nếu game over do Người chơi đánh chìm tàu cuối: set `PHASES.GAME_OVER`, `winner = WINNER.PLAYER`, cộng thưởng thắng ván `+100`.

4. Đồng bộ với `computerAttack` ở mức cần thiết.
   - US-14 yêu cầu Máy tính cũng bắn tiếp khi trúng; nếu phần này thuộc người khác, cần thống nhất interface để tránh xung đột.
   - Nếu Vượng phải sửa phần chung, `computerAttack` nên giữ `CPU_TURN` sau `hit/sunk`, chỉ chuyển `PLAYER_TURN` khi `miss`.
   - Combo/score của Người chơi theo US-15 chỉ cần reset khi Người chơi miss; không cộng điểm khi Máy tính bắn trúng.

5. Cập nhật UI hiển thị điểm và combo.
   - `StatusBar.jsx` là nơi phù hợp để hiển thị `Điểm`, `Combo xN` và có thể `+delta`.
   - Khi điểm hoặc combo thay đổi, người chơi phải thấy rõ theo US-15.
   - Không làm mất khả năng đọc phase hiện tại.

6. Kiểm tra lại `Cell.jsx` và CSS nếu Sunk chưa đủ khác Hit.
   - US-07 yêu cầu Sunk khác biệt với Hit thông thường.
   - Nếu CSS hiện tại đã khác màu thì giữ; nếu chưa rõ, cần bổ sung style, nhưng chỉ khi được phân công sửa UI trạng thái ô.

7. Viết hoặc chạy test thủ công tối thiểu.
   - Người chơi bắn trúng: vẫn là lượt Người chơi, điểm tăng đúng, combo tăng.
   - Người chơi bắn trúng liên tiếp: hệ số x1, x2, x3.
   - Người chơi bắn trượt: chuyển sang Máy tính, combo reset.
   - Người chơi bắn sunk: cộng điểm phát trúng + thưởng sunk.
   - Người chơi thắng: game over, winner là Player, cộng thưởng thắng nếu chưa được cộng.
   - Click ô đã bắn: báo lỗi, không đổi lượt, không đổi điểm/combo.

## 6. Checklist nghiệm thu cá nhân

- [ ] UC-03 vẫn cho Người chơi chọn ô hợp lệ trên bảng đối thủ chỉ khi `PHASES.PLAYER_TURN`.
- [ ] Ô đã bắn hoặc ngoài phạm vi không được xử lý lại, không đổi trạng thái ván chơi, không đổi điểm/combo.
- [ ] Hit hiển thị đúng trên bảng đối thủ và Người chơi được bắn tiếp.
- [ ] Sunk đánh dấu toàn bộ ô của tàu, khác biệt với Hit thông thường, và Người chơi được bắn tiếp nếu chưa kết thúc ván.
- [ ] Miss hiển thị đúng, combo reset về hệ số mặc định và lượt chuyển sang Máy tính.
- [ ] Điểm cộng đúng theo loại tàu: Destroyer 20, Submarine 30, Cruiser 30, Battleship 40, Carrier 50.
- [ ] Combo đúng: phát trúng đầu x1, phát trúng liên tiếp thứ 2 x2, từ thứ 3 trở đi x3.
- [ ] Nhấn chìm tàu cộng thêm 50 điểm.
- [ ] Người chơi thắng cộng thêm 100 điểm và chuyển sang `GAME_OVER`.
- [ ] `StatusBar.jsx` hoặc UI tương đương hiển thị rõ điểm hiện tại và combo hiện tại.
- [ ] Không phá vỡ luồng UC-04/UC-05: Máy tính vẫn có lượt sau khi Người chơi miss; kết thúc ván vẫn xác định đúng.
- [ ] Đã tự test tối thiểu các trường hợp URD DoD: cộng điểm theo loại tàu, tăng combo, reset combo.
