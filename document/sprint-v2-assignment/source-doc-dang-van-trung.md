# Source-doc cá nhân: Đặng Văn Trung

**Dự án:** Battleship React + Redux Toolkit + Vite  
**Nguồn:** BRD v1.2.1, URD v2.1, Use Case Diagram v2.1, UC-02, codebase `battle-ship/`  
**Phân công:** Fleet theo độ khó, Auto-Place, đặt/điều chỉnh tàu trong setup

---

## 1. Tóm tắt nhiệm vụ

Đặng Văn Trung phụ trách phần thiết lập bảng và đặt tàu của người chơi, thuộc `UC-02 - Thiết lập bảng và đặt tàu`.

Phạm vi v2 cần đảm bảo:

- Hỗ trợ Fleet theo độ khó: `Easy` dùng bảng `10×10` với `5 tàu`; `Normal` dùng bảng `12×12` với `8 tàu`.
- Người chơi đặt toàn bộ đội tàu hợp lệ trước khi bắt đầu tấn công.
- Người chơi có thể dùng `Auto-Place` để hệ thống tự tạo bố cục tàu hợp lệ ngẫu nhiên.
- Người chơi có thể chọn tàu, di chuyển vị trí và đổi hướng tàu trong giai đoạn thiết lập.
- Mọi thao tác đặt/điều chỉnh tàu phải tuân thủ luật: chỉ ngang/dọc, không ra ngoài bảng, không chồng ô; đặt liền kề được phép.
- Sau khi đặt đủ Fleet hợp lệ, hệ thống mới cho phép chuyển sang giai đoạn tấn công.

Liên quan trực tiếp:

- Use case: `UC-02`
- User stories: `US-03`, `US-04`, `US-05`, `US-11`, `US-12`
- Business requirements: `BR-03`, `BR-04`, `BR-05`, `BR-11`, `BR-12`
- Business rules: `RUL-01`, `RUL-02`, `RUL-04`, `RUL-05`, `RUL-12`
- Code: `SetupBoard.jsx`, `ShipList.jsx`, `Grid.jsx`, `boardUtils.js`, `fleetConfig.js`, `gameSlice.js`

---

## 2. Yêu cầu trích từ BRD

### 2.1. Business Requirements

| ID | Nội dung cần đáp ứng | Ưu tiên | Tiêu chí kiểm tra |
|---|---|---|---|
| `BR-03` | Ván chơi sử dụng bảng kích thước theo độ khó đã chọn: `10×10` hoặc `12×12`. | MUST | Bảng chơi khởi tạo đúng kích thước theo độ khó đã chọn. |
| `BR-04` | Ván chơi sử dụng cấu hình đội tàu/Fleet phù hợp với kích thước bảng. | MUST | Cấu hình Fleet khớp với `RUL-02` và `RUL-12`. |
| `BR-05` | Người chơi cần có thể đặt toàn bộ đội tàu lên bảng trước khi bắt đầu lượt tấn công. | MUST | Người chơi có thể đặt toàn bộ Fleet hợp lệ trước khi tấn công. |
| `BR-11` | Người chơi cần có thể chọn đặt tàu tự động để hệ thống tạo bố cục hợp lệ ngẫu nhiên. | MUST | Nhấn nút `Auto-Place` tạo bố cục tàu hợp lệ, không chồng ô và không ra ngoài bảng. |
| `BR-12` | Người chơi cần có thể thao tác trực tiếp với tàu trong giai đoạn thiết lập, bao gồm chọn tàu, di chuyển vị trí và đổi hướng đặt tàu. | MUST | Người chơi có thể chọn, di chuyển và đổi hướng tàu; hệ thống chỉ chấp nhận bố cục hợp lệ theo quy tắc đặt tàu. |

### 2.2. Business Rules

| ID | Quy tắc |
|---|---|
| `RUL-01` | Kích thước bảng chơi là `10×10` ở độ khó `Easy` và `12×12` ở độ khó `Normal`. |
| `RUL-02` | Fleet ở `Easy (10×10)` dùng cấu hình Battleship tiêu chuẩn: `Carrier(1×5)`, `Battleship(1×4)`, `Cruiser(1×3)`, `Submarine(1×3)`, `Destroyer(1×2)`; tổng `5 tàu`, chiếm `17 ô`. |
| `RUL-04` | Tàu phải được đặt theo chiều ngang hoặc dọc, không chéo. |
| `RUL-05` | Các tàu không được chồng ô lên nhau; đặt liền kề được cho phép. |
| `RUL-12` | Fleet ở `Normal (12×12)` dùng cấu hình mở rộng: `Carrier(1×5)`, `Battleship(2×4)`, `Cruiser(2×3)`, `Submarine(1×3)`, `Destroyer(2×2)`; tổng `8 tàu`, chiếm `25 ô` khoảng `17%` trên `144 ô`. |

### 2.3. Bảng Fleet theo độ khó

| Loại tàu | Ký hiệu | Kích thước | Easy (10×10) | Normal (12×12) |
|---|---|---:|---:|---:|
| Tàu sân bay (Carrier) | `CA` | 5 ô | ×1 | ×1 |
| Thiết giáp hạm (Battleship) | `BB` | 4 ô | ×1 | ×2 |
| Tàu tuần dương (Cruiser) | `CR` | 3 ô | ×1 | ×2 |
| Tàu ngầm (Submarine) | `SS` | 3 ô | ×1 | ×1 |
| Tàu khu trục (Destroyer) | `DD` | 2 ô | ×1 | ×2 |
| Tổng | — | — | 5 tàu / 17 ô | 8 tàu / 25 ô |

---

## 3. Yêu cầu trích từ URD

### 3.1. Use Case Diagram v2.1

Use Case Diagram v2.1 xác định:

- `UC-02 - Thiết lập bảng và đặt tàu`
- Actor: `ACT-01 - Người chơi`
- User stories liên quan: `US-03`, `US-04`, `US-05`, `US-11`, `US-12`
- Quan hệ: `UC-01 «include» UC-02`, nghĩa là mỗi lần bắt đầu ván chơi mới luôn yêu cầu bước thiết lập đặt tàu trước khi chuyển sang tấn công.

### 3.2. US-03 - Quan sát bảng chơi 10×10

| Trường | Nội dung |
|---|---|
| Epic | `EP-02 - Thiết Lập Bảng Và Đặt Tàu` |
| Nguồn BRD | `BR-03` |
| Ghi chú | Kích thước bảng cố định theo `RUL-01`. |

Tiêu chí chấp nhận:

- Khi ván chơi đã được khởi tạo, người chơi quan sát bảng chơi thì bảng hiển thị đúng `10 hàng` và `10 cột`.
- Khi ván chơi đang diễn ra ở bất kỳ giai đoạn nào, bảng giữ cùng kiểu bố cục và phân biệt ô bằng border/viền xuyên suốt ván chơi.

Ghi chú cho v2: `US-03` vẫn ghi rõ 10×10 theo yêu cầu nền v1, nhưng BRD v1.2.1 đã mở rộng `BR-03/RUL-01` thành bảng theo độ khó: `Easy 10×10`, `Normal 12×12`.

### 3.3. US-04 - Đặt tàu trước khi tấn công

| Trường | Nội dung |
|---|---|
| Epic | `EP-02 - Thiết Lập Bảng Và Đặt Tàu` |
| Nguồn BRD | `BR-05` |
| Ghi chú | Quy tắc đặt tàu tuân theo `RUL-04` và `RUL-05`. |

Tiêu chí chấp nhận:

- Ở giai đoạn thiết lập, nếu người chơi đặt tàu đúng quy tắc, hệ thống chấp nhận vị trí và hiển thị tàu trên bảng.
- Nếu người chơi chưa đặt xong toàn bộ hạm đội và cố bắt đầu giai đoạn tấn công, hệ thống không cho phép chuyển giai đoạn.
- Nếu thao tác đặt tàu không hợp lệ như chồng ô, ngoài bảng hoặc sai hướng, hệ thống thông báo lỗi và cho phép người chơi điều chỉnh.

### 3.4. US-05 - Hạm đội Battleship tiêu chuẩn

| Trường | Nội dung |
|---|---|
| Epic | `EP-02 - Thiết Lập Bảng Và Đặt Tàu` |
| Nguồn BRD | `BR-04` |
| Ghi chú | Cấu hình hạm đội theo `RUL-02`; người chơi không tự cấu hình số lượng hoặc loại tàu. |

Tiêu chí chấp nhận:

- Khi vào giai đoạn đặt tàu, hệ thống cung cấp đúng Fleet tiêu chuẩn: `Carrier (5)`, `Battleship (4)`, `Cruiser (3)`, `Submarine (3)`, `Destroyer (2)`.
- Danh sách tàu cần đặt giống nhau mỗi ván theo cấu hình chuẩn, không thay đổi giữa các ván chơi.
- Nếu số lượng hoặc kích thước tàu không khớp cấu hình chuẩn `5-4-3-3-2`, hệ thống không cho phép bắt đầu giai đoạn đặt tàu và ghi log lỗi cấu hình hạm đội.

Ghi chú cho v2: với `Normal`, cấu hình cần mở rộng theo `RUL-12` thay vì chỉ kiểm tra cấu hình chuẩn Easy.

### 3.5. US-11 - Đặt tàu tự động

| Trường | Nội dung |
|---|---|
| Epic | `EP-02 - Thiết Lập Bảng Và Đặt Tàu` |
| Nguồn BRD | `BR-11` |
| Ghi chú | Bố cục tàu tự động phải hợp lệ theo quy tắc đặt tàu hiện hành và cấu hình đội tàu của độ khó đã chọn. |

Tiêu chí chấp nhận:

- Ở giai đoạn thiết lập, khi người chơi chọn đặt tàu tự động, hệ thống tự động đặt toàn bộ đội tàu lên bảng với bố cục hợp lệ.
- Sau khi tự động đặt tàu, toàn bộ tàu nằm trong phạm vi bảng, không chồng ô và đúng kích thước theo cấu hình đội tàu của độ khó đã chọn.
- Nếu người chơi đã có bố cục tàu trên bảng và ván chơi chưa bắt đầu tấn công, khi chọn đặt tàu tự động lại, hệ thống xoá bố cục hiện tại và tạo bố cục hợp lệ mới cho toàn bộ đội tàu.

### 3.6. US-12 - Kéo thả và điều chỉnh tàu

| Trường | Nội dung |
|---|---|
| Epic | `EP-02 - Thiết Lập Bảng Và Đặt Tàu` |
| Nguồn BRD | `BR-12` |
| Ghi chú | Chỉ áp dụng trong giai đoạn thiết lập; cách thao tác cụ thể được xác định ở thiết kế giao diện hoặc use case chi tiết. |

Tiêu chí chấp nhận:

- Ở giai đoạn thiết lập, khi người chơi chọn một tàu, hệ thống thể hiện tàu đó đang được chọn.
- Khi tàu đã được chọn và người chơi di chuyển tàu sang vị trí hợp lệ khác, hệ thống cập nhật vị trí tàu.
- Khi tàu đã được chọn và người chơi đổi hướng tàu sang ngang hoặc dọc, hệ thống cập nhật hướng tàu nếu bố cục sau thay đổi vẫn hợp lệ.
- Nếu thao tác di chuyển hoặc đổi hướng tạo bố cục không hợp lệ, hệ thống từ chối thay đổi và giữ trạng thái hợp lệ gần nhất.
- Sau khi ván chơi đã bắt đầu giai đoạn tấn công, hệ thống không cho phép người chơi di chuyển hoặc đổi hướng tàu.

### 3.7. UC-02 hiện có

Đặc tả `UC-02 - Đặt Tàu` mô tả luồng chính:

- Hệ thống khởi tạo hạm đội máy tính với cấu hình tiêu chuẩn và đặt ngẫu nhiên, ẩn khỏi người chơi.
- Hệ thống hiển thị bảng `10×10` của người chơi cùng danh sách `5 tàu` cần đặt.
- Người chơi chọn một tàu chưa đặt, chọn hướng ngang/dọc và chọn ô bắt đầu.
- Hệ thống kiểm tra vị trí hợp lệ: tàu nằm trong bảng, không chồng ô với tàu đã đặt, không đặt chéo.
- Nếu hợp lệ, hệ thống hiển thị tàu trên bảng và cập nhật danh sách tàu còn lại.
- Khi chưa đủ `5 tàu`, nút bắt đầu tấn công bị vô hiệu hóa; khi đủ `5 tàu`, nút được kích hoạt.
- Người chơi nhấn nút bắt đầu tấn công, hệ thống chuyển sang UC-03.

Luồng ngoại lệ:

- Người chơi có thể chọn một tàu đã đặt trên bảng để tái đặt vị trí; hệ thống gỡ tàu khỏi vị trí hiện tại rồi kiểm tra vị trí mới.
- Nếu vị trí mới không hợp lệ do vượt biên hoặc chồng ô, hệ thống hiển thị thông báo: `Vị trí không hợp lệ. Vui lòng chọn vị trí khác.`

Ghi chú: đặc tả UC-02 hiện mô tả nền v1 với `10×10` và `5 tàu`; khi làm v2 cần mở rộng theo BRD/URD v2.1 cho `Normal 12×12`, `8 tàu`, `Auto-Place` và điều chỉnh tàu.

---

## 4. Codebase hiện tại liên quan

### 4.1. `src/constants/gameConstants.js`

Hiện trạng:

- `BOARD_SIZE = 10` đang hard-code toàn hệ thống.
- `SHIP_TYPES` chỉ có 5 loại tàu đơn: `carrier`, `battleship`, `cruiser`, `submarine`, `destroyer`.
- `ORIENTATION` đã có `HORIZONTAL: 'H'` và `VERTICAL: 'V'`, phù hợp `RUL-04`.
- Chưa có config độ khó `Easy/Normal`, `boardSize` theo độ khó hoặc fleet mở rộng theo độ khó.

Tác động:

- Cần phối hợp với phần chọn độ khó để thay `BOARD_SIZE` cố định bằng cấu hình theo game state hoặc tham số.

### 4.2. `src/utils/fleetConfig.js`

Hiện trạng:

- `FLEET_CONFIG` đang là Fleet Easy/v1: `5-4-3-3-2`.
- `validateFleetConfig()` chỉ validate đúng mảng size `[5, 4, 3, 3, 2]`.
- `createFleet()` tạo mỗi loại tàu một lần, id lấy trực tiếp từ `SHIP_TYPES`.

Khoảng trống v2:

- Chưa có Fleet `Normal`: `Carrier ×1`, `Battleship ×2`, `Cruiser ×2`, `Submarine ×1`, `Destroyer ×2`.
- Nếu tạo nhiều tàu cùng loại, cần id duy nhất cho từng instance, ví dụ `battleship-1`, `battleship-2`, để `shipId` trên board không bị trùng.
- `validateFleetConfig()` cần validate theo độ khó, không chỉ validate Easy.

### 4.3. `src/utils/boardUtils.js`

Hiện trạng:

- `createBoard()` tạo bảng dựa trên `BOARD_SIZE`, hiện là `10`.
- `getShipPositions(row, col, size, orientation)` đã tính vị trí ngang/dọc.
- `isValidPlacement()` kiểm tra vượt biên và chồng ô, đáp ứng `RUL-04/RUL-05` ở mức logic.
- `placeShipOnBoard()` đặt tàu immutable và ghi `state: ship`, `shipId`.
- `removeShipFromBoard()` hỗ trợ tái đặt/di chuyển tàu.
- `placeFleetRandomly()` đang đặt ngẫu nhiên toàn bộ Fleet, hiện dùng cho hạm đội máy tính.

Khoảng trống v2:

- Các hàm đang phụ thuộc `BOARD_SIZE` cố định, cần nhận `boardSize` hoặc suy ra từ `board.length`.
- Có thể tái sử dụng `placeFleetRandomly()` cho `Auto-Place` của người chơi, nhưng cần action riêng để reset `playerBoard/playerFleet`.
- Cần đảm bảo random placement không loop vô hạn nếu config lỗi hoặc board quá nhỏ; nên có giới hạn số lần thử và lỗi rõ ràng.

### 4.4. `src/store/gameSlice.js`

Hiện trạng:

- `initialState` có `playerBoard`, `computerBoard`, `playerFleet`, `computerFleet`, `selectedShipId`, `phase`.
- `startGame()` tạo board 10×10, tạo playerFleet 5 tàu, đặt ngẫu nhiên computerFleet.
- `selectShip()` lưu `selectedShipId`.
- `placeShip()` hỗ trợ đặt mới và tái đặt tàu đã đặt: gỡ tàu cũ, validate vị trí mới, nếu hợp lệ thì cập nhật board/fleet.
- `startBattle()` chỉ cho chuyển sang `PLAYER_TURN` khi mọi tàu trong `playerFleet` đều `placed`.
- Chưa có reducer/action `autoPlacePlayerFleet`.
- Chưa lưu `difficulty`, `boardSize` hoặc cấu hình Fleet theo độ khó trong state.

Khoảng trống v2:

- `startGame()` cần nhận/đọc độ khó đã chọn để tạo đúng board và Fleet.
- Điều kiện `allPlaced` nên dựa trên `playerFleet.every(...)`, không hard-code số lượng tàu.
- Cần chặn `selectShip/placeShip/autoPlace` nếu phase không còn là setup.
- Cần giữ trạng thái hợp lệ gần nhất khi đổi hướng/di chuyển không hợp lệ, đúng `US-12`.

### 4.5. `src/components/SetupBoard.jsx`

Hiện trạng:

- Hiển thị `ShipList`, nút đổi hướng, nút `Bắt Đầu Chiến`, `Grid`.
- `orientation` là local state, toggle giữa ngang/dọc.
- `handleCellClick()` dispatch `placeShip`.
- `handleSelectShip()` dispatch `selectShip`.
- `allPlaced` đang tính bằng `fleetPlaced === 5`.
- Khi phase là `INVALID_PLACEMENT`, hiển thị lỗi `Vị trí không hợp lệ. Vui lòng chọn vị trí khác.`
- Chưa có nút `Auto-Place`.

Khoảng trống v2:

- `allPlaced` phải theo số tàu thực tế của Fleet hiện tại, vì Normal có `8 tàu`.
- Cần thêm nút `Auto-Place` trong setup; khi bấm lại phải xoá bố cục cũ và tạo bố cục mới.
- Cần hiển thị thông tin độ khó/kích thước bảng hoặc Fleet để người chơi biết đang setup `Easy` hay `Normal`.
- Nếu yêu cầu kéo thả được triển khai, component này là nơi xử lý drag/drop hoặc fallback click-to-place.

### 4.6. `src/components/ShipList.jsx`

Hiện trạng:

- Render danh sách tàu từ `fleet`.
- Cho phép click chọn tàu nếu có `onSelect` và tàu chưa chìm.
- Có highlight tàu được chọn qua `selectedId`.
- Visual map đang key theo id loại tàu như `carrier`, `battleship`.

Khoảng trống v2:

- Nếu Fleet Normal có nhiều tàu cùng loại với id instance như `battleship-1`, visual map cần dựa trên `type` hoặc fallback hợp lý, không chỉ dựa vào `ship.id`.
- Cần phân biệt rõ tàu đã đặt/chưa đặt và tàu đang được chọn để đáp ứng `US-12`.

### 4.7. `src/components/Grid.jsx`

Hiện trạng:

- Render board bằng `board.flatMap`.
- Header cột đang hard-code `A` đến `J`, phù hợp 10 cột.
- CSS class `.grid` có thể đang giả định 10×10 tùy stylesheet.

Khoảng trống v2:

- Với Normal `12×12`, header cột cần tạo động theo `board[0].length`, ví dụ `A-L`.
- CSS grid cần dùng số cột động hoặc class/variable theo board size.
- Grid phải tiếp tục dùng được cho setup và battle board.

---

## 5. Việc cần làm đề xuất

1. Thống nhất model cấu hình độ khó với nhóm:
   - `Easy`: `boardSize = 10`, Fleet `5 tàu / 17 ô`.
   - `Normal`: `boardSize = 12`, Fleet `8 tàu / 25 ô`.
   - State chung nên có `difficulty` và `boardSize`, hoặc ít nhất các hàm setup nhận được cấu hình đã chọn.

2. Refactor board size:
   - Đổi `createBoard()` để nhận `boardSize`.
   - Đổi `isValidPlacement()` và `placeFleetRandomly()` để dùng `board.length` hoặc tham số `boardSize`, không phụ thuộc `BOARD_SIZE = 10`.
   - Cập nhật `Grid.jsx` để render header theo kích thước board thực tế.

3. Refactor Fleet config:
   - Tạo config theo độ khó, ví dụ `FLEET_BY_DIFFICULTY.easy` và `FLEET_BY_DIFFICULTY.normal`.
   - `createFleet(difficulty)` tạo instance tàu có `id` duy nhất và có thêm `type` để UI/logic nhận diện loại tàu.
   - `validateFleetConfig(difficulty)` kiểm tra đúng cấu hình Easy hoặc Normal theo `RUL-02/RUL-12`.

4. Bổ sung Auto-Place cho người chơi:
   - Tạo reducer/action như `autoPlacePlayerFleet`.
   - Action chỉ hoạt động trong giai đoạn setup.
   - Khi chạy, reset `playerBoard` về board rỗng theo `boardSize`, tạo/clone Fleet hiện tại rồi đặt ngẫu nhiên toàn bộ bằng logic hợp lệ.
   - Nếu người chơi bấm Auto-Place lại trước khi tấn công, xoá bố cục cũ và tạo bố cục hợp lệ mới.

5. Hoàn thiện đặt/điều chỉnh tàu:
   - Giữ flow click-to-place hiện có cho chọn tàu, chọn hướng, click ô bắt đầu.
   - Cho phép chọn tàu đã đặt để di chuyển sang vị trí khác; code hiện đã có nền tảng `removeShipFromBoard()`.
   - Đổi hướng tàu phải validate bố cục mới; nếu không hợp lệ thì từ chối và giữ trạng thái hợp lệ gần nhất.
   - Chặn mọi thao tác chọn/di chuyển/đổi hướng/auto-place sau khi phase đã chuyển sang tấn công.

6. Cập nhật UI setup:
   - Thêm nút `Auto-Place`.
   - Sửa điều kiện bật nút bắt đầu tấn công thành `playerFleet.length > 0 && playerFleet.every(ship => ship.placed)`.
   - Hiển thị lỗi rõ ràng khi vị trí không hợp lệ.
   - Đảm bảo bảng `10×10` và `12×12` vẫn có border/viền rõ, dễ thao tác.

7. Kiểm thử logic:
   - Unit test hoặc test thủ công cho placement: ngoài bảng, chồng ô, ngang/dọc, tái đặt.
   - Test Auto-Place nhiều lần cho cả Easy và Normal để đảm bảo không chồng ô/không vượt biên/đủ tàu.
   - Test bắt đầu tấn công chỉ khi toàn bộ Fleet đã đặt.

---

## 6. Checklist nghiệm thu cá nhân

- [ ] `Easy` khởi tạo bảng `10×10`.
- [ ] `Normal` khởi tạo bảng `12×12`.
- [ ] `Easy` tạo đúng Fleet `5 tàu / 17 ô`: `Carrier ×1`, `Battleship ×1`, `Cruiser ×1`, `Submarine ×1`, `Destroyer ×1`.
- [ ] `Normal` tạo đúng Fleet `8 tàu / 25 ô`: `Carrier ×1`, `Battleship ×2`, `Cruiser ×2`, `Submarine ×1`, `Destroyer ×2`.
- [ ] Mọi tàu trong Fleet có định danh duy nhất, kể cả khi nhiều tàu cùng loại.
- [ ] Người chơi chọn được tàu trong danh sách và UI thể hiện tàu đang được chọn.
- [ ] Người chơi đặt được tàu theo chiều ngang.
- [ ] Người chơi đặt được tàu theo chiều dọc.
- [ ] Hệ thống từ chối đặt tàu chéo hoặc hướng không hợp lệ.
- [ ] Hệ thống từ chối đặt tàu vượt biên bảng.
- [ ] Hệ thống từ chối đặt tàu chồng lên tàu khác.
- [ ] Hệ thống cho phép các tàu đặt liền kề nhau.
- [ ] Người chơi có thể chọn tàu đã đặt và di chuyển sang vị trí hợp lệ khác trong setup.
- [ ] Khi di chuyển tàu sang vị trí không hợp lệ, hệ thống giữ trạng thái hợp lệ gần nhất.
- [ ] Người chơi có thể đổi hướng tàu trong setup nếu bố cục sau đổi hướng hợp lệ.
- [ ] Khi đổi hướng tạo bố cục không hợp lệ, hệ thống từ chối thay đổi và giữ trạng thái hợp lệ gần nhất.
- [ ] Nút `Bắt Đầu Chiến` bị vô hiệu hóa khi chưa đặt đủ Fleet.
- [ ] Nút `Bắt Đầu Chiến` chỉ bật khi toàn bộ Fleet của độ khó hiện tại đã đặt hợp lệ.
- [ ] Nút `Auto-Place` tự động đặt toàn bộ Fleet hợp lệ trong setup.
- [ ] Bấm `Auto-Place` lại trước khi tấn công sẽ xoá bố cục cũ và tạo bố cục hợp lệ mới.
- [ ] Sau Auto-Place, mọi tàu nằm trong bảng, không chồng ô và đúng kích thước.
- [ ] Sau khi đã vào giai đoạn tấn công, người chơi không thể đặt, di chuyển, đổi hướng hoặc auto-place tàu.
- [ ] `Grid` hiển thị đúng header và số ô cho cả `10×10` và `12×12`.
- [ ] Thông báo lỗi đặt tàu không hợp lệ hiển thị rõ và cho phép người chơi điều chỉnh.
- [ ] Code không còn hard-code số lượng tàu là `5` ở logic setup dùng chung cho cả Easy/Normal.
- [ ] Code không còn phụ thuộc `BOARD_SIZE = 10` trong các hàm cần hỗ trợ Normal `12×12`.
