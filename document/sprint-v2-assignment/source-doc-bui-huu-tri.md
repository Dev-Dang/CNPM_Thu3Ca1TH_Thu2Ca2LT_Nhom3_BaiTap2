# Source-doc Sprint v2 - Bùi Hữu Trí

## 1. Tóm Tắt Nhiệm Vụ

**Thành viên:** Bùi Hữu Trí  
**Ownership cũ:** `UC-04 - Thực hiện lượt tấn công (Máy tính)`  
**Phân công v2:** Logic Máy tính theo độ khó và bắn tiếp khi trúng.  
**Liên quan:** `UC-04`; `US-08`, `US-13`, `US-14`; `BR-14`, `BR-15`, `BR-16`; `RUL-07`, `RUL-13`.

**Output cần đạt:**

- Easy: Máy tính chọn ô tấn công ngẫu nhiên trên bảng 10x10.
- Normal: Máy tính dùng chiến thuật Hunt-and-Target, ưu tiên ô liền kề trên/dưới/trái/phải quanh ô vừa bắn trúng trên bảng 12x12.
- Khi Máy tính bắn trúng hoặc đánh chìm tàu, Máy tính được bắn tiếp ngay trong cùng lượt.
- Khi Máy tính bắn trượt, hệ thống mới chuyển lượt sang Người chơi.
- Không dùng thư viện AI/ML; chỉ dùng thuật toán cơ bản theo phạm vi v2.

---

## 2. Yêu Cầu Trích Từ BRD

Nguồn: `document/business-requirements.md`, BRD v1.2.1.

### Business Requirements

| ID | Nội dung | Mức độ | Tiêu chí kiểm tra |
|---|---|---|---|
| `BR-14` | Ở độ khó Easy, Máy tính chọn ô tấn công ngẫu nhiên trên bảng 10x10. | MUST | Các lượt bắn của Máy tính ở Easy là ngẫu nhiên, không có mẫu ưu tiên. |
| `BR-15` | Ở độ khó Normal (12x12), Máy tính ưu tiên tấn công các ô xung quanh ô vừa trúng. | MUST | Sau khi trúng, Máy tính ưu tiên bắn các ô liền kề trước khi quay về ngẫu nhiên. |
| `BR-16` | Bên bắn trúng được thực hiện thêm một lượt bắn ngay lập tức. | MUST | Sau khi trúng, bên bắn trúng tiếp tục lượt bắn thay vì chuyển lượt. |

### Business Rules

| ID | Quy tắc |
|---|---|
| `RUL-07` | Bên bắn trúng được tiếp tục thực hiện lượt bắn liên tiếp cho đến khi bắn trượt; khi bắn trượt thì chuyển lượt. |
| `RUL-13` | Máy tính ở độ khó Normal ưu tiên các ô liền kề (trên, dưới, trái, phải) với ô vừa trúng trước khi quay lại chọn ngẫu nhiên (chiến thuật Hunt-and-Target). |

### Điểm Cần Lưu Ý Từ BRD

- BRD v1.2.1 làm rõ quy tắc bắn tiếp khi trúng: không chỉ thêm một phát, mà là bắn liên tiếp cho đến khi trượt.
- Độ khó Easy và Normal không chỉ ảnh hưởng kích thước bảng, mà còn ảnh hưởng hành vi tấn công của Máy tính.
- Logic Máy tính nằm trong phạm vi thuật toán cơ bản; thư viện AI/ML nằm ngoài phạm vi.

---

## 3. Yêu Cầu Trích Từ URD

Nguồn: `document/user-requirements.md`, URD v2.1.

### Phạm Vi Và Tính Năng Liên Quan

- `SC-09`: Người chơi chọn độ khó trước ván đấu; Easy dùng bảng 10x10 và Máy tính chọn ô tấn công ngẫu nhiên; Normal dùng bảng 12x12 và Máy tính ưu tiên chọn ô tấn công xung quanh điểm vừa bắn trúng.
- `SC-10`: Bên bắn trúng được tiếp tục bắn liên tiếp cho đến khi bắn trượt; khi bắn trượt thì chuyển lượt.
- `CON-04`: Hành vi Máy tính không sử dụng thư viện AI/ML; Easy dùng logic ngẫu nhiên, Normal dùng Hunt-and-Target đơn giản.
- `F-12`: Lựa chọn độ khó Easy/Normal làm thay đổi kích thước bảng, số lượng tàu và chiến thuật tấn công của Máy tính.
- `F-13`: Tiếp tục lượt bắn khi bắn trúng mục tiêu cho đến khi bắn trượt.

### User Story Liên Quan

#### `US-08 - Theo dõi lượt tấn công của Máy tính`

Người chơi cần thấy lượt tấn công của Máy tính lên bảng của mình để theo dõi thiệt hại và diễn biến trận đấu.

Acceptance Criteria cần giữ:

- Khi đến lượt Máy tính, Máy tính thực hiện lượt tấn công.
- Hệ thống hiển thị ô bị tấn công trên bảng của Người chơi cùng kết quả trúng hoặc trượt.
- Nếu tàu của Người chơi bị nhấn chìm bởi lượt tấn công của Máy tính, hệ thống hiển thị tàu đó ở trạng thái nhấn chìm.
- Kết quả lượt tấn công của Máy tính phải hiển thị rõ ràng, phân biệt với ô chưa bị tấn công.
- Kết quả lượt tấn công của Máy tính cần được hiển thị tối thiểu 500ms trước khi hệ thống tự động chuyển lượt hoặc kết thúc ván chơi.

#### `US-13 - Chọn độ khó trước ván đấu`

Acceptance Criteria liên quan trực tiếp:

- Khi Người chơi chọn Easy, hệ thống sử dụng bảng 10x10, đội tàu Easy 5 tàu / 17 ô và Máy tính chọn ô tấn công ngẫu nhiên.
- Khi Người chơi chọn Normal, hệ thống sử dụng bảng 12x12, đội tàu Normal 8 tàu / 25 ô và Máy tính ưu tiên chọn ô tấn công xung quanh điểm vừa bắn trúng.
- Nếu Người chơi chưa chọn độ khó, hệ thống không cho phép tiếp tục cho đến khi độ khó được chọn.

#### `US-14 - Bắn tiếp khi trúng`

Acceptance Criteria liên quan trực tiếp:

- Khi Máy tính bắn trúng tàu của Người chơi, Máy tính được tiếp tục bắn trong cùng lượt.
- Khi Máy tính bắn trượt, hệ thống chuyển lượt sang Người chơi.
- Quy tắc này phải đồng bộ với lượt tấn công của Người chơi: bên nào trúng thì tiếp tục, bên nào trượt thì mất lượt.

### DoD Và Thuật Ngữ Liên Quan

- Hành vi Máy tính cần được kiểm thử tối thiểu 2 trường hợp: Easy chọn ngẫu nhiên; Normal ưu tiên ô liền kề sau khi bắn trúng.
- Quy tắc bắn tiếp khi trúng cần được kiểm thử tối thiểu 4 trường hợp: Người chơi trúng, Người chơi trượt, Máy tính trúng, Máy tính trượt.
- `Easy`: độ khó dùng bảng 10x10, Fleet 5 tàu / 17 ô và Máy tính chọn ô tấn công ngẫu nhiên.
- `Normal`: độ khó dùng bảng 12x12, Fleet 8 tàu / 25 ô và Máy tính ưu tiên ô liền kề sau khi bắn trúng.
- `Hunt-and-Target`: chiến thuật Máy tính ở Normal: chọn ngẫu nhiên khi chưa có mục tiêu, sau khi bắn trúng thì ưu tiên các ô liền kề trên/dưới/trái/phải.

---

## 4. Codebase Hiện Tại Liên Quan

Codebase: `battle-ship/`.

### `src/utils/computerLogic.js`

Hiện tại có hàm `selectAttackCell(playerBoard)`:

- Duyệt toàn bộ `playerBoard`.
- Lấy các ô hợp lệ bằng `validateCoordinate`.
- Chọn ngẫu nhiên một ô trong danh sách hợp lệ.

Nhận xét:

- Phù hợp một phần với Easy vì đang chọn ngẫu nhiên.
- Chưa nhận tham số `difficulty`.
- Chưa có logic Normal Hunt-and-Target.
- Chưa lưu hoặc nhận thông tin ô vừa bắn trúng để ưu tiên ô liền kề.
- Chưa xử lý fallback rõ ràng khi không có ô hợp lệ.

### `src/utils/attackUtils.js`

Các hàm liên quan:

- `validateCoordinate(row, col, board)`: kiểm tra tọa độ nằm trong bảng và ô chưa bị tấn công.
- `getCellAttackInfo(row, col, board, fleet)`: xác định ô có tàu hay không, tàu nào, còn bao nhiêu ô chưa bị tấn công.
- `markCell(row, col, newState, board)`: đánh dấu `MISS` hoặc `HIT`.
- `markAllShipCells(ship, board)`: đánh dấu toàn bộ tàu là `SUNK`.
- `checkEndGame(fleet, board)`: kiểm tra toàn bộ tàu đối thủ đã bị nhấn chìm.
- `processAttack(board, fleet, row, col)`: xử lý một phát bắn và trả về `{ board, fleet, result, isGameOver }`.

Nhận xét:

- `processAttack` đã trả `result: 'miss' | 'hit' | 'sunk'`, có thể dùng để quyết định Máy tính có được bắn tiếp hay không.
- `validateCoordinate` đang dùng `BOARD_SIZE` cố định từ constants, hiện là 10; cần cẩn thận khi tích hợp Normal 12x12.
- Logic xử lý hit/sunk/miss có thể tái sử dụng cho cả Easy và Normal.

### `src/store/gameSlice.js`

State hiện tại có:

- `phase`
- `playerBoard`, `computerBoard`
- `playerFleet`, `computerFleet`
- `winner`
- `lastAttackResult`
- `errorMessage`

Reducer liên quan:

- `playerAttack`: sau mỗi phát bắn của Người chơi, nếu chưa game over thì luôn set `phase = PHASES.CPU_TURN`.
- `computerAttack`: sau mỗi phát bắn của Máy tính, nếu chưa game over thì luôn set `phase = PHASES.PLAYER_TURN`.

Nhận xét:

- Chưa có state `difficulty`.
- Chưa có state để lưu mục tiêu của Máy tính ở Normal, ví dụ `computerTargetQueue`, `lastComputerHit`, hoặc hàng đợi ô liền kề cần bắn.
- Chưa dùng `attack.result` trong `computerAttack` để giữ `CPU_TURN` khi hit/sunk.
- Phần `playerAttack` cũng cần được cập nhật bởi người phụ trách UC-03 để giữ `PLAYER_TURN` khi Người chơi hit/sunk.

### `src/components/GameBoard.jsx`

Hiện tại:

- Khi `phase === PHASES.CPU_TURN`, `useEffect` chạy sau `DELAY_MS`.
- Gọi `selectAttackCell(playerBoard)`.
- Dispatch `computerAttack({ row, col })`.
- Bảng đối thủ chỉ clickable khi `phase === PHASES.PLAYER_TURN`.

Nhận xét:

- Có sẵn delay 500ms, phù hợp yêu cầu hiển thị/tối thiểu quan sát của UC-04/US-08.
- Nếu `computerAttack` tiếp tục giữ `phase = CPU_TURN` sau hit/sunk, `useEffect` có thể tiếp tục kích hoạt phát bắn tiếp theo sau delay.
- Cần tránh loop sai: mỗi phát bắn tiếp phải dựa trên board/state mới, không bắn lại ô đã bị tấn công.
- Cần truyền thêm `difficulty` và/hoặc target state vào `selectAttackCell` khi làm Normal.

### `src/constants/gameConstants.js`

Hiện tại:

- `BOARD_SIZE = 10`
- `DELAY_MS = 500`
- Fleet mặc định là 5 tàu / 17 ô trong `fleetConfig.js`.

Nhận xét:

- Phần khởi tạo Easy/Normal, board 10x10/12x12 và fleet 5/8 tàu là điểm tích hợp với phần của Hồ Hoàn Ngọc Sơn và Đặng Văn Trung.
- Logic Máy tính nên nhận `board.length` hoặc cấu hình board hiện tại, tránh hard-code 10x10 trong logic mới.

---

## 5. Việc Cần Làm Đề Xuất

### A. Mở Rộng Logic Chọn Ô Tấn Công Của Máy Tính

- Giữ hàm chọn ngẫu nhiên cho Easy, vì code hiện tại gần đúng.
- Thêm logic Normal Hunt-and-Target:
  - Nếu không có mục tiêu đang theo đuổi, chọn ngẫu nhiên trong các ô hợp lệ.
  - Khi phát trước đó là `hit` hoặc `sunk`, lấy các ô liền kề trên/dưới/trái/phải quanh ô trúng.
  - Chỉ chọn ô liền kề nếu nằm trong bảng và chưa bị tấn công.
  - Nếu hết ô liền kề hợp lệ, fallback về chọn ngẫu nhiên.
- Không sử dụng AI/ML, không thêm dependency.

Gợi ý chữ ký hàm:

```js
selectAttackCell(playerBoard, {
  difficulty,
  targetQueue,
  lastHitCell,
})
```

Hoặc tách hàm:

```js
selectRandomAttackCell(playerBoard)
selectNormalAttackCell(playerBoard, targetQueue)
getAdjacentTargets(row, col, board)
```

### B. Lưu Trạng Thái Target Cho Normal

Đề xuất trong `gameSlice.js` thêm state phục vụ riêng Máy tính:

- `computerTargetQueue`: danh sách ô liền kề cần ưu tiên bắn.
- `lastComputerAttack`: tọa độ và kết quả phát bắn gần nhất của Máy tính, nếu cần debug/hiển thị.

Khi Máy tính bắn `hit`:

- Thêm các ô liền kề hợp lệ của ô vừa bắn trúng vào `computerTargetQueue`.
- Loại bỏ trùng lặp và loại bỏ ô đã bị tấn công.

Khi Máy tính bắn `sunk`:

- Vẫn được tính là bắn trúng theo `US-14`, nên Máy tính tiếp tục bắn nếu game chưa kết thúc.
- Có thể xóa target liên quan tàu đã chìm nếu không còn cần theo đuổi; tối thiểu phải đảm bảo queue chỉ còn ô hợp lệ.

Khi Máy tính bắn `miss`:

- Không thêm target mới.
- Chuyển lượt sang Người chơi.

### C. Áp Dụng Quy Tắc Bắn Tiếp Khi Trúng Cho Máy Tính

Trong `computerAttack`:

- Nếu `attack.isGameOver === true`: set `GAME_OVER`, winner là `COMPUTER`.
- Nếu `attack.result === 'hit'` hoặc `attack.result === 'sunk'`: giữ `phase = PHASES.CPU_TURN` để Máy tính bắn tiếp.
- Nếu `attack.result === 'miss'`: set `phase = PHASES.PLAYER_TURN`.

Cần lưu ý:

- `sunk` cũng là kết quả bắn trúng và phải được bắn tiếp nếu chưa kết thúc ván.
- Delay giữa các phát bắn tiếp của Máy tính nên vẫn dùng `DELAY_MS = 500` để Người chơi quan sát.

### D. Tích Hợp Difficulty

Cần thống nhất với phần của Hồ Hoàn Ngọc Sơn:

- State nên có `difficulty` nhận giá trị `easy` hoặc `normal`.
- `GameBoard.jsx` lấy `difficulty` từ Redux và truyền vào logic chọn ô.
- Easy: chọn ngẫu nhiên.
- Normal: ưu tiên target queue/liền kề, fallback ngẫu nhiên.

Cần thống nhất với phần của Đặng Văn Trung:

- Board size phải lấy theo board thực tế hoặc config theo độ khó.
- Không hard-code 10x10 trong logic Normal, vì Normal là 12x12.

Cần thống nhất với phần của Cao Văn Vượng:

- Quy tắc bắn tiếp khi trúng phải đồng nhất cho cả `playerAttack` và `computerAttack`.
- Nếu Vượng cập nhật lượt Người chơi, Trí cần đảm bảo logic Máy tính không xung đột với phase flow chung.

### E. Xử Lý Lỗi Và Edge Cases

Cần bảo đảm:

- Không bao giờ chọn ô đã `HIT`, `MISS`, `SUNK`.
- Nếu target queue rỗng hoặc tất cả target không hợp lệ, fallback ngẫu nhiên.
- Nếu không tìm thấy ô hợp lệ trong khi game chưa kết thúc, hiển thị thông báo lỗi theo UC-04: "Kết quả lượt chơi gặp lỗi. Vui lòng tải lại trang."
- Không tạo vòng lặp vô hạn khi `phase` tiếp tục là `CPU_TURN`.
- Nếu Máy tính bắn phát kết thúc ván, kích hoạt `UC-05` và không bắn tiếp nữa.

---

## 6. Checklist Nghiệm Thu Cá Nhân

- [ ] Easy: Máy tính chọn ngẫu nhiên trên các ô chưa bị tấn công.
- [ ] Easy: Máy tính không ưu tiên ô liền kề sau khi bắn trúng.
- [ ] Normal: Khi chưa có target, Máy tính chọn ngẫu nhiên một ô hợp lệ.
- [ ] Normal: Sau khi bắn trúng, Máy tính ưu tiên các ô liền kề trên/dưới/trái/phải của ô vừa trúng.
- [ ] Normal: Ô liền kề nằm ngoài bảng hoặc đã bị tấn công bị bỏ qua.
- [ ] Normal: Khi không còn ô liền kề hợp lệ, Máy tính quay lại chọn ngẫu nhiên.
- [ ] Máy tính bắn `hit` thì tiếp tục giữ lượt và bắn tiếp sau delay.
- [ ] Máy tính bắn `sunk` thì tiếp tục giữ lượt nếu ván chưa kết thúc.
- [ ] Máy tính bắn `miss` thì chuyển lượt sang Người chơi.
- [ ] Máy tính đánh chìm toàn bộ fleet của Người chơi thì set game over và winner là Computer.
- [ ] Mỗi ô trên bảng Người chơi chỉ bị Máy tính tấn công một lần.
- [ ] Kết quả Hit/Miss/Sunk của Máy tính hiển thị rõ trên bảng Người chơi.
- [ ] Mỗi phát bắn của Máy tính có delay quan sát tối thiểu 500ms trước khi chuyển bước tiếp theo.
- [ ] Logic chạy đúng với board 10x10 và 12x12, không phụ thuộc hard-code vào `BOARD_SIZE = 10` trong phần chọn ô mới.
- [ ] Không thêm thư viện AI/ML hoặc dependency ngoài phạm vi.
- [ ] Test tối thiểu: Easy random, Normal ưu tiên liền kề, Máy tính hit được bắn tiếp, Máy tính miss chuyển lượt.
