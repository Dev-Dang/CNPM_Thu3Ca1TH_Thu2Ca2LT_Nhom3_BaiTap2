# Source Doc - Hồ Hoàn Ngọc Sơn

## 1. Tóm tắt nhiệm vụ

Phần việc của Sơn là triển khai lựa chọn độ khó Easy/Normal trước khi bắt đầu ván và khởi tạo ván chơi theo độ khó đã chọn cho dự án Battleship React + Redux Toolkit + Vite.

Phạm vi chính:

- Người chơi chọn độ khó trước khi vào giai đoạn thiết lập.
- Easy dùng bảng 10x10, đội tàu 5 tàu / 17 ô, Máy tính chọn ô tấn công ngẫu nhiên.
- Normal dùng bảng 12x12, đội tàu 8 tàu / 25 ô, Máy tính ưu tiên các ô liền kề quanh ô vừa bắn trúng trước khi quay lại ngẫu nhiên.
- Lựa chọn độ khó phải ảnh hưởng nhất quán đến board, fleet của Người chơi, fleet của Máy tính, logic đặt tàu ngẫu nhiên và logic tấn công của Máy tính.

Use case/user story liên quan trực tiếp: UC-01, US-01, US-02, US-13. Có liên quan khi triển khai AI/luật chơi: UC-04, US-14 nếu cần xử lý hành vi Máy tính sau khi bắn trúng.

## 2. Yêu cầu trích từ BRD

Nguồn: `document/business-requirements.md` BRD v1.2.1.

### Phạm vi nghiệp vụ

- SC-09 - Lựa chọn độ khó (Easy / Normal): Người chơi chọn độ khó trước ván đấu; Easy dùng bảng 10x10 và Máy tính chọn ô tấn công ngẫu nhiên; Normal dùng bảng 12x12 và Máy tính ưu tiên chọn ô tấn công xung quanh điểm vừa bắn trúng.
- Tiêu chí nghiệm thu "Bảng và đội tàu theo độ khó": Trò chơi sử dụng bảng 10x10 hoặc 12x12 và đội tàu Fleet phù hợp theo RUL-02 và RUL-12.

### Business Requirements

- BR-03 - Ván chơi sử dụng bảng kích thước theo độ khó đã chọn (10x10 hoặc 12x12). Tiêu chí kiểm tra: bảng chơi khởi tạo đúng kích thước theo độ khó đã chọn.
- BR-04 - Ván chơi sử dụng cấu hình đội tàu phù hợp với kích thước bảng. Tiêu chí kiểm tra: Fleet khớp với RUL-02 và RUL-12.
- BR-13 - Người chơi cần có thể chọn độ khó trước khi bắt đầu ván đấu. Tiêu chí kiểm tra: màn hình chọn độ khó hiển thị trước ván đấu; người chơi chọn được Easy hoặc Normal.
- BR-14 - Ở độ khó Easy, Máy tính chọn ô tấn công ngẫu nhiên trên bảng 10x10. Tiêu chí kiểm tra: các lượt bắn của Máy tính ở Easy là ngẫu nhiên, không có mẫu ưu tiên.
- BR-15 - Ở độ khó Normal (12x12), Máy tính ưu tiên tấn công các ô xung quanh ô vừa trúng. Tiêu chí kiểm tra: sau khi trúng, Máy tính ưu tiên bắn các ô liền kề trước khi quay về ngẫu nhiên.

### Quy tắc nghiệp vụ

- RUL-01 - Kích thước bảng chơi là 10x10 ở độ khó Easy và 12x12 ở độ khó Normal.
- RUL-02 - Đội tàu Easy (10x10): Carrier(1x5), Battleship(1x4), Cruiser(1x3), Submarine(1x3), Destroyer(1x2), tổng 5 tàu, chiếm 17 ô.
- RUL-12 - Đội tàu Normal (12x12): Carrier(1x5), Battleship(2x4), Cruiser(2x3), Submarine(1x3), Destroyer(2x2), tổng 8 tàu, chiếm 25 ô.
- RUL-13 - Máy tính ở Normal ưu tiên các ô liền kề trên, dưới, trái, phải với ô vừa trúng trước khi quay lại chọn ngẫu nhiên; đây là chiến thuật Hunt-and-Target.

### Cấu hình Fleet theo độ khó

| Loại tàu | Ký hiệu | Kích thước | Easy (10x10) | Normal (12x12) |
|---|---|---:|---:|---:|
| Tàu sân bay (Carrier) | CA | 5 | 1 | 1 |
| Thiết giáp hạm (Battleship) | BB | 4 | 1 | 2 |
| Tàu tuần dương (Cruiser) | CR | 3 | 1 | 2 |
| Tàu ngầm (Submarine) | SS | 3 | 1 | 1 |
| Tàu khu trục (Destroyer) | DD | 2 | 1 | 2 |
| Tổng | - | - | 5 tàu / 17 ô | 8 tàu / 25 ô |

Lưu ý phạm vi: BRD loại trừ thư viện/framework AI/ML; hành vi Máy tính chỉ là logic đơn giản. Không thêm mức độ khó khác ngoài Easy/Normal trong v2.

## 3. Yêu cầu trích từ URD

Nguồn: `document/user-requirements.md` URD v2.1 và `document/use-case-specs/use-case-diagram.md`.

### UC liên quan

- UC-01 - Bắt đầu ván chơi và chọn độ khó. Actor chính: ACT-01 Người chơi. User Story liên quan: US-01, US-02, US-13. Ưu tiên: MUST.
- UC-04 - Thực hiện lượt tấn công (Máy tính). Actor chính/phụ: ACT-02 Máy tính. User Story liên quan có US-13 vì hành vi Máy tính phụ thuộc độ khó.
- Use Case Diagram ghi rõ ACT-01 liên kết UC-01: Người chơi khởi tạo ván chơi mới và chọn độ khó. ACT-02 liên kết UC-04: Máy tính tự động thực hiện lượt tấn công đối lại người chơi.

### User Story và Acceptance Criteria

#### US-01 - Bắt đầu ván chơi mới

- User Story: Là UG-01 - Người chơi, tôi muốn bắt đầu một ván Battleship mới, để tham gia vào một trận đấu với máy tính.
- Ưu tiên: MUST.
- Nguồn BRD: BR-01.
- Ghi chú: Ván chơi mới không yêu cầu dữ liệu từ trận trước.
- AC chính:
  - Khi người chơi chọn bắt đầu ván chơi mới, hệ thống khởi tạo ván chơi mới và đưa người chơi vào trạng thái sẵn sàng thiết lập trước trận.
  - Khi ván chơi mới được khởi tạo, không có dữ liệu nào từ ván trước được hiển thị hoặc ảnh hưởng đến ván mới.

#### US-02 - Nhận biết chế độ đơn người chơi

- User Story: Là UG-01 - Người chơi, tôi muốn được thông báo rõ ràng rằng tôi đang chơi với máy tính, để hiểu đúng bối cảnh của ván chơi.
- Ưu tiên: SHOULD.
- Nguồn BRD: BR-02.
- AC chính:
  - Sau khi bắt đầu ván chơi mới, giao diện hiển thị text label hoặc tiêu đề chỉ rõ chế độ đơn người chơi, ví dụ "vs Computer".
  - Trong bất kỳ giai đoạn nào của ván chơi, không có yếu tố giao diện nào gợi ý hệ thống hỗ trợ nhiều người chơi.

#### US-13 - Chọn độ khó trước ván đấu

- User Story: Là UG-01 - Người chơi, tôi muốn chọn độ khó Easy hoặc Normal trước ván đấu, để chơi với mức thử thách phù hợp.
- Ưu tiên: MUST.
- Nguồn BRD: BR-13, BR-14, BR-15.
- Ghi chú: Easy dùng bảng 10x10, đội tàu 5 tàu / 17 ô và Máy tính chọn ô tấn công ngẫu nhiên. Normal dùng bảng 12x12, đội tàu 8 tàu / 25 ô và Máy tính ưu tiên chọn ô tấn công xung quanh điểm vừa bắn trúng.
- AC chính:
  - Khi hệ thống hiển thị bước chọn độ khó, Người chơi có thể chọn Easy hoặc Normal trước khi vào giai đoạn thiết lập.
  - Nếu chọn Easy, ván chơi được khởi tạo với bảng 10x10, Fleet Easy 5 tàu / 17 ô và Máy tính tấn công ngẫu nhiên.
  - Nếu chọn Normal, ván chơi được khởi tạo với bảng 12x12, Fleet Normal 8 tàu / 25 ô và Máy tính ưu tiên ô xung quanh điểm vừa bắn trúng.
  - Nếu Người chơi chưa chọn độ khó, hệ thống không cho phép chuyển sang giai đoạn thiết lập.

### Definition of Done liên quan

- Lựa chọn độ khó được kiểm thử tối thiểu 2 trường hợp: Easy 10x10 / 5 tàu / 17 ô; Normal 12x12 / 8 tàu / 25 ô.
- Hành vi Máy tính được kiểm thử tối thiểu 2 trường hợp: Easy chọn ngẫu nhiên; Normal ưu tiên ô liền kề sau khi bắn trúng.
- Các thành phần v2 như chọn độ khó phải hiển thị rõ ràng trong đúng trạng thái ván chơi.
- Thao tác chọn độ khó phản hồi trong <= 500ms trên trình duyệt hiện hành.

## 4. Codebase hiện tại liên quan

Codebase: `battle-ship/`.

### `src/components/StartScreen.jsx`

- Đang hiển thị màn hình bắt đầu với tiêu đề `BATTLESHIP`, subtitle `Chế Độ Một Người — Đấu Máy Tính`, nút `Bắt Đầu Ván Mới`.
- Khi click nút, component gọi `dispatch(startGame())`.
- Chưa có UI chọn độ khó Easy/Normal.
- Chưa truyền payload độ khó vào `startGame`.
- Đã có hiển thị lỗi từ `state.game.errorMessage`, nhưng trong `gameSlice.js` hiện catch lại ghi `state.error`, không đồng nhất với `errorMessage`.

### `src/components/StatusBar.jsx`

- Đang hiển thị logo, label `vs Máy Tính`, phase label và nút `Ván Mới`.
- Khi xác nhận ván mới, component gọi `dispatch(startGame())`.
- Chưa hiển thị độ khó hiện tại.
- Chưa có logic giữ/đổi độ khó khi bắt đầu ván mới từ status bar. Cần quyết định UI: dùng độ khó đã chọn gần nhất hoặc đưa người chơi về StartScreen/chọn lại độ khó.

### `src/store/gameSlice.js`

- `initialState` chưa có trường `difficulty`, `boardSize`, `computerTargetQueue`, `lastComputerHit` hoặc cấu trúc tương đương để phục vụ Normal Hunt-and-Target.
- `startGame(state)` không nhận payload, luôn tạo `createBoard()`, `createFleet()` và `placeFleetRandomly(createBoard(), createFleet())`.
- `startGame` luôn đưa `phase` về `PHASES.SETUP`, reset board/fleet/winner/selectedShipId, nhưng chưa reset theo độ khó.
- `playerAttack` hiện sau mọi phát bắn chưa kết thúc đều chuyển sang `PHASES.CPU_TURN`; chưa áp dụng quy tắc bắn tiếp khi trúng. Đây là phần của US-14 nhưng sẽ ảnh hưởng khi test Normal nếu Máy tính cần giữ lượt sau khi bắn trúng.
- `computerAttack` nhận `{ row, col }` từ action payload và chỉ xử lý attack; logic chọn ô tấn công nằm ở nơi dispatch action này hoặc cần bổ sung helper/thunk. Hiện reducer không tự chọn ô theo Easy/Normal.
- Có lỗi đặt tên state: `initialState` dùng `errorMessage`, `startGame` catch lại set `state.error`; nếu cần hiển thị lỗi khởi tạo nên dùng thống nhất `errorMessage`.

### `src/constants/gameConstants.js`

- `BOARD_SIZE = 10` đang cố định toàn bộ game ở 10x10.
- `SHIP_TYPES` có 5 loại tàu cơ bản với size đúng cho Battleship.
- Chưa có constants cho `DIFFICULTY`, `BOARD_SIZES`, `FLEET_CONFIG_BY_DIFFICULTY` hoặc cấu hình hành vi Máy tính theo độ khó.
- `PHASES` chưa có phase riêng cho chọn độ khó; hiện `phase: null` đại diện trạng thái chưa bắt đầu.

### `src/utils/boardUtils.js`

- `createBoard()` dùng `BOARD_SIZE` cố định từ constants, nên chưa tạo được board 12x12.
- `isValidPlacement()` và `placeFleetRandomly()` cũng dùng `BOARD_SIZE` cố định khi kiểm tra biên và sinh tọa độ ngẫu nhiên.
- Cần chuyển các hàm này sang nhận `boardSize` hoặc suy ra từ `board.length` để hỗ trợ cả 10x10 và 12x12.

### `src/utils/fleetConfig.js`

- `FLEET_CONFIG` hiện chỉ là cấu hình Easy/tiêu chuẩn 5 tàu: 5-4-3-3-2.
- `validateFleetConfig()` hard-code expected sizes `[5, 4, 3, 3, 2]`, chưa kiểm tra cấu hình Normal.
- `createFleet()` luôn tạo 5 tàu theo `FLEET_CONFIG`, chưa nhận difficulty/config.
- Với Normal cần tạo 8 tàu, trong đó có nhiều tàu cùng loại. Cần đảm bảo `id` là duy nhất cho từng instance, ví dụ `battleship-1`, `battleship-2`, để board cell `shipId` không bị trùng.

## 5. Việc cần làm đề xuất

1. Bổ sung constants độ khó:
   - `DIFFICULTY.EASY`, `DIFFICULTY.NORMAL`.
   - Cấu hình board size: Easy = 10, Normal = 12.
   - Cấu hình fleet theo BRD RUL-02/RUL-12.
   - Có thể thêm cấu hình AI: Easy = random, Normal = hunt-and-target.

2. Cập nhật board/fleet utilities:
   - Cho `createBoard(boardSize)` tạo board theo size truyền vào.
   - Cho `isValidPlacement()` dùng `board.length` thay vì `BOARD_SIZE` cố định.
   - Cho `placeFleetRandomly(board, fleet)` sinh tọa độ theo `board.length`.
   - Cho `createFleet(difficulty)` hoặc `createFleet(fleetConfig)` tạo đúng số tàu và id duy nhất.
   - Cho `validateFleetConfig(difficulty)` kiểm tra Easy 5 tàu / 17 ô và Normal 8 tàu / 25 ô.

3. Cập nhật Redux state và `startGame`:
   - Thêm `difficulty` và `boardSize` vào state.
   - Đổi `startGame` để nhận payload `{ difficulty }`.
   - Nếu chưa có difficulty hợp lệ thì không cho vào `SETUP`, đặt lỗi phù hợp.
   - Khi start game, tạo player board, computer board, player fleet, computer fleet đúng theo difficulty.
   - Reset đầy đủ state cũ: selected ship, winner, last attack result, error, các dữ liệu target của Máy tính nếu có.

4. Cập nhật UI chọn độ khó:
   - `StartScreen.jsx` hiển thị lựa chọn Easy/Normal trước nút bắt đầu hoặc biến từng lựa chọn thành nút bắt đầu.
   - Nút bắt đầu chỉ dispatch `startGame({ difficulty })` khi đã chọn độ khó.
   - Hiển thị mô tả ngắn:
     - Easy: 10x10, 5 tàu, Máy tính bắn ngẫu nhiên.
     - Normal: 12x12, 8 tàu, Máy tính ưu tiên ô liền kề sau khi bắn trúng.
   - `StatusBar.jsx` hiển thị độ khó hiện tại để người chơi biết đang chơi mode nào.

5. Cập nhật logic Máy tính theo độ khó:
   - Easy: chọn ngẫu nhiên một ô hợp lệ chưa bị tấn công.
   - Normal: nếu có ô vừa bắn trúng chưa bị khai thác hết, ưu tiên các ô liền kề trên/dưới/trái/phải còn hợp lệ và chưa bị bắn; nếu không còn target hợp lệ thì quay lại random.
   - Không dùng AI/ML hoặc thư viện ngoài; chỉ dùng helper logic đơn giản.
   - Cần lưu trạng thái phục vụ Hunt-and-Target, ví dụ danh sách target queue hoặc last hit.

6. Cập nhật các nơi phụ thuộc board size:
   - Component render board phải lấy số dòng/cột từ board state thay vì giả định 10x10 nếu đang hard-code.
   - CSS/grid nếu có hard-code 10 cột cần đổi sang dynamic style hoặc class theo board size.
   - Các selector/test/helper liên quan tọa độ phải hoạt động với cả 10x10 và 12x12.

7. Kiểm tra tương thích với phần việc khác:
   - Auto-place và kéo thả tàu phải dùng cùng board/fleet theo difficulty.
   - Quy tắc bắn tiếp khi trúng (RUL-07/US-14) có thể làm thay đổi cách gọi computer attack liên tiếp; cần phối hợp với người làm phần lượt bắn.
   - Điểm số/combo nếu dùng loại tàu phải hoạt động với nhiều tàu cùng loại ở Normal.

## 6. Checklist nghiệm thu cá nhân

- [ ] StartScreen có bước chọn Easy/Normal trước khi vào setup.
- [ ] Không chọn độ khó thì không thể bắt đầu giai đoạn thiết lập.
- [ ] Chọn Easy rồi bắt đầu ván: `phase = SETUP`, board Người chơi 10x10, board Máy tính 10x10.
- [ ] Chọn Easy rồi bắt đầu ván: player fleet và computer fleet có đúng 5 tàu / 17 ô theo RUL-02.
- [ ] Chọn Normal rồi bắt đầu ván: `phase = SETUP`, board Người chơi 12x12, board Máy tính 12x12.
- [ ] Chọn Normal rồi bắt đầu ván: player fleet và computer fleet có đúng 8 tàu / 25 ô theo RUL-12.
- [ ] Fleet Normal có id duy nhất cho các tàu trùng loại, không gây lỗi khi đặt tàu hoặc đánh dấu hit/sunk.
- [ ] Máy tính ở Easy chỉ chọn ngẫu nhiên trong các ô hợp lệ chưa bị tấn công.
- [ ] Máy tính ở Normal sau khi bắn trúng ưu tiên ô liền kề trên/dưới/trái/phải hợp lệ và chưa bị tấn công.
- [ ] Máy tính ở Normal quay lại chọn ngẫu nhiên khi không có target liền kề hợp lệ.
- [ ] StatusBar hoặc UI trong ván hiển thị rõ đang chơi Easy hay Normal.
- [ ] Bắt đầu ván mới không giữ lại board/fleet/last attack/winner/error của ván trước.
- [ ] Nút `Ván Mới` trong StatusBar xử lý độ khó nhất quán: dùng lại độ khó hiện tại hoặc yêu cầu chọn lại, không tự khởi tạo sai mặc định.
- [ ] Không thêm độ khó ngoài Easy/Normal.
- [ ] Không thêm AI/ML, multiplayer, leaderboard online hoặc lưu lịch sử trận đấu.
- [ ] Test thủ công hoặc unit test pass tối thiểu 2 case độ khó: Easy 10x10 / 5 tàu / 17 ô và Normal 12x12 / 8 tàu / 25 ô.
- [ ] Test tối thiểu 2 case hành vi Máy tính: Easy random và Normal ưu tiên ô liền kề sau hit.
- [ ] Thao tác chọn độ khó phản hồi trong <= 500ms trên trình duyệt hiện hành.
