# Tài Liệu Yêu Cầu Người Dùng (URD)

**Dự án:** Trò chơi Battleship  
**Phiên bản:** 1.1  
**Ngày:** 2026-04-21

---

## 1. Giới thiệu và phạm vi

Tài liệu này mô tả các yêu cầu người dùng cho phiên bản đầu tiên của trò chơi Battleship trên nền tảng web. Mục tiêu của tài liệu là làm rõ người dùng cần làm được gì với hệ thống, hệ thống cần phản hồi như thế nào từ góc nhìn sử dụng, và các giới hạn chức năng áp dụng cho phiên bản 1.

Phiên bản này tập trung vào trải nghiệm chơi đơn, trong đó người chơi đối đấu với máy tính trong một ván Battleship hoàn chỉnh, từ lúc bắt đầu ván chơi, đặt tàu, thực hiện tấn công theo lượt cho đến khi kết thúc trận.

### 1.1 Trong phạm vi

- Bắt đầu một ván Battleship mới trên giao diện web.
- Chơi ở chế độ single player với đối thủ là máy tính.
- Quan sát bảng chơi 10×10.
- Đặt tàu trước khi bắt đầu ván chơi.
- Chơi theo hạm đội Battleship tiêu chuẩn.
- Thực hiện tấn công theo lượt.
- Nhận phản hồi rõ ràng cho từng lượt tấn công: hit, miss, sunk.
- Nhận kết quả cuối ván: thắng hoặc thua.

### 1.2 Ngoài phạm vi

- Online multiplayer.
- Chế độ hai người chơi cùng thiết bị.
- AI nâng cao vượt ngoài hành vi cơ bản.
- Hệ thống điểm số, leaderboard hoặc xếp hạng.
- Lưu lịch sử trận đấu.
- Tùy chỉnh luật chơi hoặc cấu hình trận đấu.
- Đồ họa, hoạt ảnh hoặc giao diện cao cấp ngoài mức cần thiết để chơi rõ ràng.

---

## 2. Danh sách actor

| Actor | Loại | Mô tả |
|---|---|---|
| Người chơi | Primary Actor | Người trực tiếp khởi tạo và tham gia ván chơi, đặt tàu, thực hiện tấn công và theo dõi kết quả. |
| Máy tính (AI) | Secondary Actor | Đối thủ do hệ thống điều khiển, thực hiện lượt tấn công đối lại người chơi theo luật của ván chơi. |

---

## 3. Tổng quan use case

| Mã Use Case | Tên Use Case | Actor chính | Mục tiêu |
|---|---|---|---|
| UC-01 | Bắt đầu ván chơi | Người chơi | Khởi tạo một ván Battleship mới để bắt đầu chơi với máy tính. |
| UC-02 | Đặt tàu | Người chơi | Chuẩn bị hạm đội của người chơi trên bảng trước khi gameplay bắt đầu. |
| UC-03 | Thực hiện lượt tấn công | Người chơi | Chọn ô trên bảng đối thủ để tấn công trong lượt của mình. |
| UC-04 | Máy tính thực hiện lượt tấn công | Máy tính (AI) | Thực hiện lượt tấn công hợp lệ lên bảng của người chơi. |
| UC-05 | Kết thúc ván chơi | Hệ thống | Xác định khi ván chơi kết thúc và hiển thị kết quả cuối cùng. |

**Tài liệu tham chiếu:**
- Đặc tả use case chi tiết: `use-case-reference.md`
- Sơ đồ use case tổng: `use-case-diagram.md`

---

## 4. Phân loại yêu cầu

### 4.1 Functional requirements

| Mã | Yêu cầu chức năng |
|---|---|
| FR-01 | Hệ thống phải cho phép người chơi bắt đầu một ván Battleship mới. |
| FR-02 | Hệ thống phải hỗ trợ chế độ single player, trong đó người chơi đối đấu với máy tính. |
| FR-03 | Hệ thống phải hiển thị bảng chơi kích thước 10×10. |
| FR-04 | Hệ thống phải sử dụng hạm đội Battleship tiêu chuẩn. |
| FR-05 | Hệ thống phải cho phép người chơi đặt tàu trước khi bắt đầu gameplay. |
| FR-06 | Hệ thống phải hỗ trợ tấn công theo lượt giữa người chơi và máy tính. |
| FR-07 | Hệ thống phải hiển thị rõ kết quả hit, miss và sunk trong suốt ván chơi. |
| FR-08 | Hệ thống phải xác định kết thúc ván chơi khi toàn bộ tàu của một bên bị nhấn chìm. |
| FR-09 | Hệ thống phải hiển thị kết quả cuối ván là thắng hoặc thua. |

### 4.2 Non-functional requirements

| Mã | Yêu cầu phi chức năng |
|---|---|
| NFR-01 | Giao diện cần đơn giản, rõ ràng và dễ hiểu đối với người chơi. |
| NFR-02 | Trải nghiệm sử dụng cần đủ ổn định để có thể demo và đánh giá. |
| NFR-03 | Phiên bản 1 phải được kiểm soát phạm vi, không mở rộng ngoài bộ tính năng tối thiểu đã xác định. |
| NFR-04 | Hành vi của máy tính ở mức cơ bản là chấp nhận được cho phiên bản đầu tiên. |
| NFR-05 | Trò chơi phải phục vụ trải nghiệm chơi trên nền tảng web. |

---

## 5. User stories

### 5.1 Nhóm 1 – Khởi động ván chơi

#### US-01
**Với tư cách là** người chơi,  
**tôi muốn** bắt đầu một ván Battleship mới,  
**để** tham gia vào một trận đấu với máy tính.

**Tiêu chí chấp nhận:**
- [ ] Người chơi có thể khởi tạo một ván chơi mới từ giao diện chính của trò chơi.
- [ ] Khi ván chơi mới bắt đầu, hệ thống đưa người chơi vào trạng thái sẵn sàng thiết lập trước trận.
- [ ] Ván chơi mới không yêu cầu người chơi tiếp tục dữ liệu từ trận trước.

#### US-02
**Với tư cách là** người chơi,  
**tôi muốn** được thông báo rõ ràng rằng tôi đang chơi với máy tính,  
**để** hiểu đúng bối cảnh của ván chơi.

**Tiêu chí chấp nhận:**
- [ ] Khi bắt đầu ván chơi, hệ thống thể hiện rõ đây là chế độ single player.
- [ ] Người chơi có thể nhận biết đối thủ là máy tính thay vì một người chơi khác.
- [ ] Không có yếu tố giao diện nào khiến người dùng hiểu nhầm rằng phiên bản 1 hỗ trợ multiplayer.

### 5.2 Nhóm 2 – Thiết lập bảng và đặt tàu

#### US-03
**Với tư cách là** người chơi,  
**tôi muốn** thấy bảng chơi kích thước 10×10,  
**để** hiểu không gian chơi và vị trí thao tác của mình.

**Tiêu chí chấp nhận:**
- [ ] Bảng chơi của người chơi được hiển thị với 10 hàng và 10 cột.
- [ ] Cấu trúc bảng nhất quán trong toàn bộ ván chơi.
- [ ] Người chơi có thể phân biệt rõ từng ô trên bảng để phục vụ đặt tàu và theo dõi tấn công.

#### US-04
**Với tư cách là** người chơi,  
**tôi muốn** đặt toàn bộ tàu của mình lên bảng trước khi bắt đầu gameplay,  
**để** chuẩn bị chiến thuật cho ván chơi.

**Tiêu chí chấp nhận:**
- [ ] Người chơi có thể đặt các tàu lên bảng trước khi bước vào giai đoạn tấn công theo lượt.
- [ ] Hệ thống chỉ cho phép bắt đầu gameplay khi việc đặt tàu đã hoàn tất theo yêu cầu của ván chơi.
- [ ] Khi thao tác đặt tàu không hợp lệ, hệ thống thông báo để người chơi điều chỉnh.

#### US-05
**Với tư cách là** người chơi,  
**tôi muốn** trò chơi sử dụng hạm đội Battleship tiêu chuẩn,  
**để** có thể chơi theo luật quen thuộc và nhất quán.

**Tiêu chí chấp nhận:**
- [ ] Ván chơi sử dụng đúng cấu hình hạm đội chuẩn của Battleship.
- [ ] Người chơi không phải tự cấu hình số lượng hoặc loại tàu trong phiên bản 1.
- [ ] Cấu hình hạm đội được áp dụng nhất quán cho mỗi ván chơi mới.

### 5.3 Nhóm 3 – Tấn công theo lượt

#### US-06
**Với tư cách là** người chơi,  
**tôi muốn** chọn một ô trên bảng của đối thủ để tấn công,  
**để** thực hiện lượt chơi của mình.

**Tiêu chí chấp nhận:**
- [ ] Trong lượt của mình, người chơi có thể chọn một ô hợp lệ trên bảng đối thủ để tấn công.
- [ ] Sau khi người chơi thực hiện một lượt hợp lệ, hệ thống chuyển sang xử lý lượt tiếp theo theo đúng trình tự ván chơi.
- [ ] Người chơi không thể thực hiện một lượt tấn công không hợp lệ làm sai lệch luật chơi.

#### US-07
**Với tư cách là** người chơi,  
**tôi muốn** biết ngay kết quả tấn công là hit, miss hay sunk,  
**để** điều chỉnh chiến thuật cho các lượt tiếp theo.

**Tiêu chí chấp nhận:**
- [ ] Sau mỗi lượt tấn công của người chơi, hệ thống hiển thị kết quả rõ ràng là hit, miss hoặc sunk.
- [ ] Phản hồi kết quả được thể hiện trên bảng theo cách người chơi có thể nhận biết được.
- [ ] Kết quả phản hồi nhất quán với trạng thái thực tế của ô hoặc tàu bị tấn công.

#### US-08
**Với tư cách là** người chơi,  
**tôi muốn** thấy lượt tấn công của máy tính lên bảng của mình,  
**để** theo dõi thiệt hại và diễn biến trận đấu.

**Tiêu chí chấp nhận:**
- [ ] Sau lượt của người chơi, máy tính thực hiện lượt tấn công hợp lệ lên bảng của người chơi.
- [ ] Người chơi có thể nhận biết ô nào trên bảng của mình đã bị máy tính tấn công.
- [ ] Kết quả lượt tấn công của máy tính được thể hiện rõ ràng để người chơi theo dõi tiến trình ván chơi.

### 5.4 Nhóm 4 – Kết thúc ván chơi

#### US-09
**Với tư cách là** người chơi,  
**tôi muốn** được thông báo khi ván chơi kết thúc,  
**để** biết trận đấu đã hoàn thành.

**Tiêu chí chấp nhận:**
- [ ] Hệ thống xác định ván chơi kết thúc khi toàn bộ tàu của một bên đã bị nhấn chìm.
- [ ] Khi ván chơi kết thúc, người chơi nhận được thông báo kết thúc rõ ràng.
- [ ] Sau khi kết thúc, ván chơi không tiếp tục nhận thêm lượt tấn công mới.

#### US-10
**Với tư cách là** người chơi,  
**tôi muốn** thấy kết quả cuối ván là thắng hoặc thua cùng lý do kết thúc,  
**để** có cảm giác kết thúc rõ ràng và dễ hiểu.

**Tiêu chí chấp nhận:**
- [ ] Khi ván chơi kết thúc, hệ thống hiển thị rõ người chơi thắng hay thua.
- [ ] Hệ thống cho biết kết thúc xảy ra do toàn bộ tàu của bên nào đã bị nhấn chìm.
- [ ] Thông tin kết thúc được trình bày theo cách người chơi có thể hiểu ngay mà không cần suy đoán thêm.

---

## 6. Ràng buộc và tính năng ngoài phạm vi

### 6.1 Ràng buộc

- Phiên bản 1 phải giữ phạm vi gọn, tập trung vào gameplay cốt lõi.
- Trải nghiệm người dùng cần đơn giản, rõ ràng và dễ demo.
- Không thêm tính năng làm tăng độ phức tạp ngoài bộ yêu cầu đã xác định.
- Hành vi của máy tính ở mức cơ bản là chấp nhận được cho phiên bản đầu tiên.

### 6.2 Các giới hạn chức năng của phiên bản 1

Phiên bản 1 không bao gồm:

- Theo dõi điểm số.
- Lưu lịch sử trận đấu.
- Leaderboard hoặc xếp hạng.
- Online multiplayer.
- Tùy chỉnh luật hoặc cấu hình mở rộng.

---

## Phụ lục A. Ma trận truy xuất yêu cầu (RTM)

| BR ID | Nội dung tóm tắt | Use Case | User Story |
|---|---|---|---|
| BR-01 | Bắt đầu ván chơi mới | UC-01 | US-01 |
| BR-02 | Single player đấu với máy tính | UC-01 | US-02 |
| BR-03 | Bảng chơi 10×10 | UC-02 | US-03 |
| BR-04 | Hạm đội Battleship tiêu chuẩn | UC-02 | US-05 |
| BR-05 | Đặt tàu trước khi gameplay bắt đầu | UC-02 | US-04 |
| BR-06 | Tấn công theo lượt | UC-03, UC-04 | US-06, US-08 |
| BR-07 | Hiển thị hit, miss, sunk | UC-03, UC-04 | US-07, US-08 |
| BR-08 | Xác định kết thúc ván chơi | UC-05 | US-09 |
| BR-09 | Hiển thị thắng hoặc thua | UC-05 | US-10 |
| BR-10 | Không có điểm số và lịch sử trận đấu | N/A | Ràng buộc phạm vi phiên bản 1 |
