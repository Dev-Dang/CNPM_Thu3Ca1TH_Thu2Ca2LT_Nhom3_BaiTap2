# Tài Liệu Yêu Cầu Nghiệp Vụ (Business Requirements)

**Dự án:** Trò chơi Battleship  
**Phiên bản:** 1.2.1  
**Ngày tạo:** 21-04-2026  
**Ngày cập nhật:** 05-06-2026  
**Tác giả:** Nhóm dự án (5 thành viên)  

---

## Lịch Sử Thay Đổi

| Phiên bản | Ngày | Người thực hiện | Mô tả thay đổi                                                                                                                                                                                                                                                                                                                                                     |
|---|---|---|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 1.0 | 21-04-2026 | Nhóm dự án | Phiên bản BRD đầu tiên.                                                                                                                                                                                                                                                                                                                                            |
| 1.1 | 27-04-2026 | Nhóm dự án | Trình bày lại và sắp xếp lại cấu trúc nội dung.<br>- Bổ sung lịch sử phiên bản.<br>- Bổ sung sản phẩm bàn giao (DEL-XX) và lộ trình tổng quan.<br>- Bổ sung metadata cho yêu cầu nghiệp vụ (Mức độ ưu tiên, Bên yêu cầu).<br>- Bổ sung cấu hình đội tàu tiêu chuẩn.<br>- Rút gọn và cập nhật bảng thuật ngữ.<br>- Làm rõ dự án không bao gồm AI module/integration. |
| 1.2 | 04-06-2026 | Nhóm dự án | Mở rộng phạm vi sang phiên bản 2 (v2).<br>- Cập nhật phần 3 (Phạm Vi), bổ sung BG-04, BG-05, tiêu chí nghiệm thu v2, BR-11 đến BR-19, RUL-07 đến RUL-14.<br>- Xác định cụ thể cấu hình đội tàu Normal (12×12).<br>- Cập nhật rủi ro RSK-03 đến RSK-07.                                                                       |
| 1.2.1 | 05-06-2026 | Nhóm dự án | Làm rõ một số yêu cầu v2 sau khi rà soát URD.<br>- Cập nhật SC-08 và BR-12: làm rõ thao tác trực tiếp với tàu trong giai đoạn thiết lập, bao gồm chọn tàu, di chuyển vị trí và đổi hướng đặt tàu.<br>- Cập nhật SC-10 và RUL-07: làm rõ quy tắc bắn tiếp khi trúng là bắn liên tiếp cho đến khi trượt.<br>- Cập nhật RUL-09, RUL-10 và bổ sung bảng cơ chế tính điểm v2: tính điểm theo loại tàu và combo.<br>- Cập nhật SC-12, BR-18 và RUL-11: làm rõ High Score là điểm cao nhất cục bộ duy nhất, được hiển thị trong ván chơi và chỉ cập nhật khi ván chơi kết thúc.<br>- Cập nhật EX-04 và EX-05: làm rõ ngoài phạm vi không có xếp hạng trực tuyến và không lưu lịch sử toàn bộ trận đấu. |

## 1. Tóm Tắt Dự Án

### 1.1. Bối Cảnh Và Vấn Đề

Bài tập học phần Công nghệ Phần mềm yêu cầu nhóm 5 thành viên xây dựng và bàn giao một sản phẩm phần mềm hoàn chỉnh, có tài liệu đầy đủ, có thể demo và được đánh giá trong khoảng 3 tuần.

Sau khi hoàn thành phiên bản 1 (v1.0), nhóm tiếp tục phát triển phiên bản 2 (v2) nhằm nâng cao trải nghiệm gameplay, bổ sung cơ chế tính điểm và xếp hạng, cải thiện khả năng tùy biến giao diện và tăng mức độ thách thức cho người chơi.
### 1.2. Giải Pháp Đề Xuất

Xây dựng trò chơi Battleship dạng ứng dụng web đơn trang (SPA) sử dụng React, hỗ trợ chế độ đơn người chơi đối đấu với đối thủ máy tính điều khiển bằng logic đơn giản (không dùng AI/ML). 

Phiên bản 2 mở rộng trên nền tảng v1 với các tính năng: đặt tàu tự động, kéo thả tàu, lựa chọn độ khó (Easy 10×10 / Normal 12×12), quy tắc bắn tiếp khi trúng, hệ thống điểm số & High Score và tuỳ chọn giao diện sáng/tối.
### 1.3. Kết Quả Kỳ Vọng

- Trò chơi Battleship web hoàn chỉnh, có thể chơi được với quy tắc rõ ràng và gameplay ổn định.
- Phiên bản 1 được bàn giao đúng hạn (trước 10-05-2026) và không vượt phạm vi đã xác định.
- Toàn bộ sản phẩm bàn giao (xem mục 3.3) hoàn thành, không có lỗi nghiêm trọng (critical issue) nào chưa được giải quyết.
- Phiên bản 2 bổ sung đầy đủ các tính năng nâng cao gameplay, tính điểm, độ khó và giao diện theo danh sách yêu cầu tại mục 4, bàn giao trước 07-06-2026.

## 2. Mục Tiêu Dự Án

### 2.1. Mục Tiêu Kinh Doanh

Dự án được thực hiện trong bối cảnh học thuật nhằm vận dụng kỹ năng phân tích nghiệp vụ, thiết kế hệ thống và phát triển phần mềm. Mục tiêu chiến lược là hoàn thành một sản phẩm phần mềm hoàn chỉnh, có thể demo và đánh giá được, đúng phạm vi và đúng thời hạn.

Phiên bản 2 hướng đến nâng cao trải nghiệm người chơi và độ hoàn thiện của sản phẩm thông qua các tính năng mở rộng: lựa chọn độ khó, cơ chế chọn mục tiêu tấn công của máy tính được cải tiến, tính điểm và ghi nhận thành tích.
### 2.2. Mục Tiêu Cụ Thể

| ID | Mục tiêu | Cách đánh giá | Giá trị mục tiêu | Thời hạn |
|---|---|---|---|---|
| BG-01 | Cung cấp một trò chơi Battleship có thể chơi được với quy tắc rõ ràng và gameplay ổn định. | Tỷ lệ test cases PASS cho 5 luồng gameplay cốt lõi | 100% | 08-05-2026 |
| BG-02 | Cung cấp một sản phẩm có thể demo và đánh giá được. | Số sản phẩm bàn giao hoàn thành, không có lỗi nghiêm trọng (critical issue) chưa được giải quyết | 11/11 sản phẩm bàn giao (xem mục 3.3) | 09-05-2026 |
| BG-03 | Đảm bảo phạm vi phiên bản 1 được kiểm soát và bàn giao đúng hạn. | Số hạng mục ngoài phạm vi đã chốt trong BRD v1.1 và thời hạn bàn giao | 0 - Không có hạng mục ngoài phạm vi được triển khai; bàn giao trước 10-05-2026 | 10-05-2026 |
| BG-04 | Nâng cao trải nghiệm người chơi trong v2 qua các tính năng gameplay mở rộng (độ khó, cơ chế chọn mục tiêu tấn công của Máy tính được cải tiến, tính điểm, giao diện). | Tỷ lệ yêu cầu MUST của v2 được triển khai và PASS test                  | 100% các BR MUST của v2                    | 07-06-2026 |
| BG-05 | Đảm bảo tính nhất quán dữ liệu High Score và tính điểm qua các ván chơi.                                                                                              | High Score được lưu, hiển thị đúng và không bị mất khi reload           | Không có lỗi dữ liệu High Score            | 07-06-2026 |

### 2.3. Tiêu Chí Nghiệm Thu

| Tiêu chí | Mô tả | Cách kiểm chứng |
|---|---|---|
| Trò chơi vận hành trên web | Trò chơi chạy được trên môi trường web. | Khởi chạy và chơi thử trực tiếp trên trình duyệt. |
| Luồng gameplay hoàn chỉnh | Người chơi có thể tham gia ván đấu với máy tính từ giai đoạn thiết lập đến kết thúc trận. | Thực hiện ít nhất một ván chơi hoàn chỉnh từ đầu đến cuối. |
| Bảng và đội tàu theo độ khó | Trò chơi sử dụng bảng 10×10 (Easy) hoặc 12×12 (Normal) và đội tàu Fleet phù hợp theo RUL-02 và RUL-12. | Kiểm tra cấu hình bảng và đội tàu trong ván chơi theo từng độ khó. |
| Điều kiện thắng/thua | Trò chơi xác định đúng điều kiện thắng/thua. | Chơi đến khi có bên thắng và kiểm tra kết quả hiển thị. |
| Đặt tàu tự động | Người chơi có thể chọn đặt tàu tự động thay vì đặt thủ công. | Nhấn nút đặt tàu tự động; kiểm tra bố cục tàu hợp lệ được tạo. |
| Kéo thả tàu | Người chơi có thể kéo thả tàu để đặt lên bảng. | Kéo một tàu từ danh sách và thả vào ô hợp lệ trên bảng. |
| Quy tắc bắn tiếp khi trúng | Bên trúng được bắn tiếp ngay lượt đó. | Kiểm tra bên trúng tiếp tục bắn mà không chuyển lượt. |
| Tính điểm đơn và combo | Điểm được tính đúng cho từng phát trúng và chuỗi combo. | Kiểm tra điểm tăng đúng sau từng lượt trúng; kiểm tra hệ số combo. |
| High Score | High Score cục bộ duy nhất được lưu và hiển thị đúng. | Kết thúc ván, kiểm tra điểm được ghi nhận nếu cao hơn High Score hiện tại. |
| Tuỳ chọn theme | Người chơi có thể chuyển đổi giữa giao diện sáng và tối. | Bật/tắt theme; kiểm tra toàn bộ UI cập nhật đúng theo theme được chọn. |
| Giới hạn phạm vi v1 | Phiên bản 1 không bao gồm chế độ trực tuyến. | Xác nhận không có tính năng ngoài phạm vi trong sản phẩm v1. |
| Sẵn sàng bàn giao v1 | Sản phẩm và tài liệu bàn giao đạt trạng thái có thể đánh giá trước ngày 10-05-2026. | Kiểm tra danh sách 11 sản phẩm bàn giao tại mục 3.3. |
| Sẵn sàng bàn giao v2 | Tất cả tính năng MUST của v2 PASS test; không có critical issue chưa giải quyết tính đến 07-06-2026. | Kiểm tra BR-11 đến BR-18 PASS test; kiểm tra danh sách lỗi. |

## 3. Phạm Vi Dự Án

### 3.1. Trong Phạm Vi

| # | Hạng mục | Mô tả ngắn |
|---|---|---|
| SC-01 | Trò chơi Battleship trên web | Trò chơi Battleship chạy trên nền tảng trình duyệt web.                                                                                               | v1 |
| SC-02 | Chế độ đơn người chơi | Người chơi đối đấu với đối thủ máy tính điều khiển bằng logic đơn giản (không dùng AI/ML).                                                            | v1 |
| SC-03 | Luồng gameplay cốt lõi | Thiết lập bảng, đặt tàu, tấn công theo lượt, phản hồi trúng/trượt, kết quả thắng/thua.                                                                | v1 |
| SC-04 | Quy tắc Battleship tiêu chuẩn | Áp dụng quy tắc Battleship tiêu chuẩn (bảng 10×10 mặc định, đội tàu chuẩn).                                                                           | v1 |
| SC-05 | Giao diện người dùng | Giao diện tập trung vào sự rõ ràng và dễ sử dụng.                                                                                                     | v1 |
| SC-06 | Triển khai React frontend | Hệ thống được triển khai bằng React trên frontend.                                                                                                    | v1 |
| SC-07 | Đặt tàu tự động | Người chơi có thể chọn để hệ thống tự động đặt toàn bộ đội tàu hợp lệ lên bảng.                                                                       | v2 |
| SC-08 | Kéo thả khi đặt tàu | Người chơi có thể thao tác trực tiếp với tàu trong giai đoạn thiết lập, bao gồm chọn tàu, di chuyển vị trí và đổi hướng đặt tàu.                       | v2 |
| SC-09 | Lựa chọn độ khó (Easy / Normal) | Người chơi chọn độ khó trước ván đấu; Easy dùng bảng 10×10 và Máy tính chọn ô tấn công ngẫu nhiên, Normal dùng bảng 12×12 và Máy tính ưu tiên chọn ô tấn công xung quanh điểm vừa bắn trúng. | v2 |
| SC-10 | Quy tắc bắn tiếp khi trúng | Bên bắn trúng được tiếp tục bắn liên tiếp cho đến khi bắn trượt; khi bắn trượt thì chuyển lượt.                                                       | v2 |
| SC-11 | Hệ thống tính điểm đơn và combo | Tính điểm cho từng phát trúng; bắn liên tiếp trúng nhân hệ số combo.                                                                                  | v2 |
| SC-12 | Ghi nhận High Score | Lưu một điểm cao nhất cục bộ, hiển thị High Score hiện tại trong ván chơi và làm nổi bật khi Người chơi vượt High Score đang lưu.                    | v2 |
| SC-13 | Tuỳ chọn giao diện sáng / tối | Người chơi có thể chuyển đổi giữa Light Theme và Dark Theme.                                                                                          | v2 |

### 3.2. Ngoài Phạm Vi

| # | Hạng mục | Lý do loại trừ |
|---|---|---|
| EX-01 | Chế độ nhiều người chơi trực tuyến | Yêu cầu kết nối thời gian thực và hạ tầng backend phức tạp, vượt khả năng của nhóm trong thời gian này. |
| EX-02 | Chế độ hai người chơi cùng thiết bị | Cần giao diện chia màn hình hoặc luân phiên thiết bị; không phải mục tiêu thiết kế của phiên bản này. |
| EX-03 | Thư viện hoặc framework AI/ML | Đối thủ máy tính dùng logic đơn giản (không phải AI); tích hợp thư viện AI/ML tăng độ phức tạp không cần thiết. |
| EX-04 | Hệ thống xếp hạng cạnh tranh trực tuyến | v2 chỉ lưu một High Score cục bộ duy nhất; bảng xếp hạng trực tuyến phù hợp hơn cho phiên bản sau. |
| EX-05 | Lưu trữ lịch sử toàn bộ trận đấu | Nằm ngoài phạm vi v2 vì hệ thống không ghi lại danh sách các ván đã chơi, diễn biến từng lượt bắn hoặc kết quả chi tiết của từng trận. |
| EX-06 | Hoạt ảnh phức tạp, đồ họa chất lượng cao | Tốn thời gian phát triển frontend đáng kể mà không cải thiện tính năng gameplay. |
| EX-07 | Bộ chỉnh sửa quy tắc hoặc thiết lập tùy chỉnh nâng cao | v2 chỉ hỗ trợ 2 mức độ khó đã định nghĩa; tuỳ chỉnh sâu hơn phù hợp cho phiên bản sau. |

### 3.3. Sản Phẩm Bàn Giao

Các sản phẩm bàn giao sau là tài liệu hoặc đầu ra thuộc phạm vi dự án, không phải yêu cầu chức năng trực tiếp của trò chơi Battleship.

| Mã | Sản phẩm bàn giao | Mô tả | Deadline |
|---|---|---|---|
| DEL-01 | Business Requirements Document | Mô tả yêu cầu nghiệp vụ và phạm vi dự án. | 29-04-2026 |
| DEL-02 | Use Case Diagram | Thể hiện actor và use case chính. | 29-04-2026 |
| DEL-03 | System Architecture Diagram | Mô tả kiến trúc tổng quan của hệ thống. | 01-05-2026 |
| DEL-04 | Use Case Specification | Mô tả chi tiết từng use case. | 29-04-2026 |
| DEL-05 | Sequence Diagram | Mô tả luồng tương tác chính theo thời gian. | 01-05-2026 |
| DEL-06 | Activity Diagram hoặc Class Diagram | Bổ sung góc nhìn thiết kế khác cho hệ thống. | 01-05-2026 |
| DEL-07 | Test Case Document | Mô tả test cases dùng để kiểm tra hệ thống. | 03-05-2026 |
| DEL-08 | Setup Development Environment Document | Hướng dẫn thiết lập môi trường phát triển. | 03-05-2026 |
| DEL-09 | Deploy Document | Hướng dẫn quy trình triển khai. | 08-05-2026 |
| DEL-10 | Slide PPTX | Tài liệu trình bày/demo dự án. | 09-05-2026 |
| DEL-11 | Video Demo | Video minh họa sản phẩm hoạt động. | 09-05-2026 |

### 3.4. Lộ Trình Tổng Quan

| Giai đoạn | Thời gian | Nội dung chính | Kết quả đầu ra |
|---|---|---|---|
| 1 | 26-04-2026 → 29-04-2026 | Chuẩn hóa BRD, URD, Use Case Diagram và Use Case Specification. | Bộ tài liệu yêu cầu và use case đã thống nhất. |
| 2 | 30-04-2026 → 01-05-2026 | Hoàn thiện System Architecture Diagram, Sequence Diagram và Activity/Class Diagram. | Bộ design diagrams. |
| 3 | 02-05-2026 → 03-05-2026 | Viết Test Case Document và Setup Development Environment Document. | Test Case Document, Setup Document. |
| 4 | 04-05-2026 → 06-05-2026 | Implement chức năng theo từng use case. | Phiên bản chức năng có thể chạy. |
| 5 | 07-05-2026 → 08-05-2026 | Execute test cases, fix lỗi và hoàn thiện Deploy Document. | Test execution result, Deploy Document. |
| 6 | 09-05-2026 | Chuẩn bị Slide PPTX, Video Demo và review tổng thể. | Slide, video demo, bộ tài liệu hoàn chỉnh. |
| Release v1 | Trước 10-05-2026 | Bàn giao phiên bản đầu tiên. | Sản phẩm và tài liệu sẵn sàng đánh giá. |
| v2 – Phát triển | Trước 06-06-2026 | Implement tính năng v2: đặt tàu tự động, kéo thả, độ khó, bắn tiếp, điểm số, High Score, theme. | Phiên bản v2 có thể chạy đầy đủ tính năng. |
| v2 – Bàn giao | 07-06-2026 | Kiểm thử toàn bộ tính năng v2, sửa lỗi, cập nhật tài liệu. | Sản phẩm v2 hoàn chỉnh, không có critical issue. |

## 4. Yêu Cầu Nghiệp Vụ

### 4.1. Yêu Cầu Nghiệp Vụ Chính
| ID | Yêu cầu                                                                                               | Mức độ ưu tiên | Lý do | Tiêu chí kiểm tra | Bên yêu cầu |
|---|-------------------------------------------------------------------------------------------------------|---|---|---|---|
| BR-01 | Người chơi cần có thể bắt đầu ván chơi Battleship mới từ trình duyệt web.                             | MUST | Điểm khởi đầu bắt buộc của gameplay. | Người chơi có thể khởi tạo ván chơi mới từ giao diện web. | Người chơi | v1 |
| BR-02 | Trò chơi cần hỗ trợ chế độ đơn người chơi đối đấu với đối thủ máy tính.                               | MUST | Phù hợp với phạm vi đơn người chơi của v1. | Ván chơi có thể diễn ra giữa người chơi và đối thủ máy tính. | Người chơi | v1 |
| BR-03 | Ván chơi sử dụng bảng kích thước theo độ khó đã chọn (10×10 hoặc 12×12).                              | MUST | Kích thước bảng phù hợp với từng mức độ khó. | Bảng chơi khởi tạo đúng kích thước theo độ khó đã chọn. | Người chơi | v1/v2 |
| BR-04 | Ván chơi sử dụng cấu hình đội tàu (Fleet) phù hợp với kích thước bảng.                                | MUST | Fleet tiêu chuẩn giúp gameplay nhất quán với luật Battleship. | Cấu hình Fleet khớp với quy định tại RUL-02 và RUL-12. | Người chơi | v1/v2 |
| BR-05 | Người chơi cần có thể đặt toàn bộ đội tàu lên bảng trước khi bắt đầu lượt tấn công.                   | MUST | Đặt tàu là bước thiết lập cần thiết trước khi tấn công. | Người chơi có thể đặt toàn bộ Fleet hợp lệ trước khi tấn công. | Người chơi | v1 |
| BR-06 | Ván chơi diễn ra theo lượt, luân phiên giữa người chơi và máy tính, trừ khi áp dụng quy tắc bắn tiếp. | MUST | Tấn công theo lượt là cơ chế gameplay chính. | Lượt tấn công luân phiên đúng trạng thái ván chơi và quy tắc bắn tiếp. | Người chơi | v1/v2 |
| BR-07 | Kết quả mỗi lượt tấn công (Hit, Miss, Sunk) cần được phản hồi rõ ràng.                                | MUST | Phản hồi giúp người chơi theo dõi trạng thái ván chơi. | Trạng thái Hit/Miss/Sunk hiển thị đúng sau mỗi lượt. | Người chơi | v1 |
| BR-08 | Ván chơi kết thúc khi toàn bộ đội tàu của một bên bị nhấn chìm.                                       | MUST | Điều kiện kết thúc bắt buộc để hoàn thành gameplay. | Ván chơi kết thúc khi Fleet của một bên đã bị nhấn chìm toàn bộ. | Người chơi | v1 |
| BR-09 | Kết quả thắng hoặc thua cần được thông báo khi ván chơi kết thúc.                                     | SHOULD | Kết quả cuối ván hoàn thiện trải nghiệm chơi. | Khi kết thúc, kết quả thắng/thua được hiển thị tương ứng. | Người chơi | v1 |
| BR-10 | Phiên bản 1 không bao gồm điểm số, bảng xếp hạng hoặc lưu lịch sử trận đấu.                           | SHOULD | Giới hạn phạm vi giúp v1 tập trung vào gameplay cốt lõi. | v1 không có tính năng điểm số, bảng xếp hạng hoặc lưu lịch sử. | Nhóm phát triển | v1 |
| BR-11 | Người chơi cần có thể chọn đặt tàu tự động để hệ thống tạo bố cục hợp lệ ngẫu nhiên.                  | MUST | Tăng tốc độ thiết lập và hỗ trợ người chơi muốn bắt đầu nhanh. | Nhấn nút Auto-Place tạo bố cục tàu hợp lệ (không chồng ô, không ra ngoài bảng). | Người chơi | v2 |
| BR-12 | Người chơi cần có thể thao tác trực tiếp với tàu trong giai đoạn thiết lập, bao gồm chọn tàu, di chuyển vị trí và đổi hướng đặt tàu. | MUST | Cách thao tác trực quan giúp người chơi dễ sắp xếp đội tàu theo chiến thuật mong muốn. | Người chơi có thể chọn, di chuyển và đổi hướng tàu; hệ thống chỉ chấp nhận bố cục hợp lệ theo quy tắc đặt tàu. | Người chơi | v2 |
| BR-13 | Người chơi cần có thể chọn độ khó trước khi bắt đầu ván đấu.                                          | MUST | Độ khó ảnh hưởng trực tiếp đến kích thước bảng và hành vi máy tính. | Màn hình chọn độ khó hiển thị trước ván đấu; người chơi chọn được Easy hoặc Normal. | Người chơi | v2 |
| BR-14 | Ở độ khó Easy, Máy tính chọn ô tấn công ngẫu nhiên trên bảng 10×10.                                   | MUST | Logic đơn giản phù hợp với mức độ thách thức thấp cho người mới. | Các lượt bắn của máy tính ở Easy là ngẫu nhiên, không có mẫu ưu tiên. | Người chơi | v2 |
| BR-15 | Ở độ khó Normal (12×12), Máy tính ưu tiên tấn công các ô xung quanh ô vừa trúng.                      | MUST | Logic cải tiến tăng mức thách thức, phù hợp người chơi có kinh nghiệm. | Sau khi trúng, máy tính ưu tiên bắn các ô liền kề trước khi quay về ngẫu nhiên. | Người chơi | v2 |
| BR-16 | Bên bắn trúng được thực hiện thêm một lượt bắn ngay lập tức.                                          | MUST | Cơ chế thưởng lượt bắn tăng tính thú vị và chiến lược. | Sau khi trúng, bên bắn trúng tiếp tục lượt bắn thay vì chuyển lượt. | Người chơi | v2 |
| BR-17 | Trò chơi cần tính điểm cho mỗi phát bắn trúng và nhân hệ số combo khi bắn trúng liên tiếp.            | MUST | Điểm số tạo động lực và tăng chiều sâu cạnh tranh. | Điểm tăng đúng sau mỗi lần trúng; combo tăng khi liên tiếp trúng, reset khi trượt. | Người chơi | v2 |
| BR-18 | Trò chơi cần lưu một High Score cục bộ duy nhất, hiển thị High Score hiện tại trong ván chơi và làm nổi bật khi Người chơi vượt High Score đang lưu. | MUST | High Score thúc đẩy Người chơi cải thiện thành tích mà không cần lưu lịch sử trận đấu. | High Score hiện tại hiển thị trong ván chơi; khi điểm hiện tại vượt High Score đang lưu, hệ thống làm nổi bật trạng thái High Score mới; khi ván chơi kết thúc, nếu điểm hiện tại cao hơn High Score đang lưu, hệ thống cập nhật High Score bằng điểm hiện tại. | Người chơi | v2 |
| BR-19 | Người chơi cần có thể chuyển đổi giữa Light Theme và Dark Theme.                                      | SHOULD | Tuỳ chọn theme tăng cá nhân hoá và giảm mỏi mắt. | Bật/tắt theme; toàn bộ UI cập nhật màu sắc đúng theo theme đã chọn. | Người chơi | v2 |

### 4.2. Quy Tắc Nghiệp Vụ
| ID | Quy tắc                                                                                                                                                                                   | Nguồn / Cơ sở | Phiên bản |
| --- |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------| --- | --- |
| RUL-01 | Kích thước bảng chơi là 10×10 ở độ khó Easy và 12×12 ở độ khó Normal.                                                                                                                     | Thiết kế hệ thống v2 | v1/v2 |
| RUL-02 | Đội tàu (Fleet) ở độ khó Easy (10×10) tuân theo cấu hình Battleship tiêu chuẩn: Carrier(1×5), Battleship(1×4), Cruiser(1×3), Submarine(1×3), Destroyer(1×2) — tổng 5 tàu, chiếm 17 ô.     | Luật Battleship tiêu chuẩn | v1 |
| RUL-03 | Người chơi thắng khi toàn bộ tàu của đối thủ bị nhấn chìm.                                                                                                                                | Luật Battleship tiêu chuẩn | v1 |
| RUL-04 | Tàu phải được đặt theo chiều ngang hoặc dọc, không chéo.                                                                                                                                  | Luật Battleship tiêu chuẩn | v1 |
| RUL-05 | Các tàu không được chồng ô lên nhau; đặt liền kề được cho phép.                                                                                                                           | Luật Battleship tiêu chuẩn | v1 |
| RUL-06 | Mỗi ô trên bảng chỉ có thể bị tấn công một lần trong ván chơi.                                                                                                                            | Luật Battleship tiêu chuẩn | v1 |
| RUL-07 | Bên bắn trúng được tiếp tục thực hiện lượt bắn liên tiếp cho đến khi bắn trượt; khi bắn trượt thì chuyển lượt.                                                                              | Thiết kế hệ thống v2 | v2 |
| RUL-08 | Không áp dụng quy tắc đặc biệt khác ngoài danh sách này trong phiên bản 2.                                                                                                                | Quy định phạm vi v2 | v2 |
| RUL-09 | Mỗi phát bắn trúng cộng điểm theo loại tàu bị bắn trúng; bắn trúng liên tiếp nhân hệ số combo tăng dần.                                                                                   | Thiết kế hệ thống v2 | v2 |
| RUL-10 | Hệ số combo reset về 1 khi bên đang bắn trượt và lượt chuyển sang bên còn lại.                                                                                                            | Thiết kế hệ thống v2 | v2 |
| RUL-11 | High Score là điểm cao nhất cục bộ của Người chơi; chỉ cập nhật khi ván chơi kết thúc và điểm cuối cao hơn High Score hiện tại.                                                            | Thiết kế hệ thống v2 | v2 |
| RUL-12 | Đội tàu (Fleet) ở độ khó Normal (12×12) sử dụng cấu hình mở rộng: Carrier(1×5), Battleship(2×4), Cruiser(2×3), Submarine(1×3), Destroyer(2×2) — tổng 8 tàu, chiếm 25 ô (~17% trên 144 ô). | Thiết kế hệ thống v2 | v2 |
| RUL-13 | Máy tính ở độ khó Normal ưu tiên các ô liền kề (trên, dưới, trái, phải) với ô vừa trúng trước khi quay lại chọn ngẫu nhiên (chiến thuật Hunt-and-Target).                                 | Thiết kế hệ thống v2 | v2 |
| RUL-14 | Lựa chọn theme (sáng/tối) được lưu và áp dụng nhất quán trong toàn bộ phiên chơi.                                                                                                         | Thiết kế hệ thống v2 | v2 |

**Cấu hình đội tàu (Fleet) theo từng độ khó:**

| Loại tàu | Ký hiệu | Kích thước | Easy (10×10) | Normal (12×12) |
| --- | --- | --- | --- | --- |
| Tàu sân bay (Carrier) | CA | 5 ô | ×1 | ×1 |
| Thiết giáp hạm (Battleship) | BB | 4 ô | ×1 | ×2 |
| Tàu tuần dương (Cruiser) | CR | 3 ô | ×1 | ×2 |
| Tàu ngầm (Submarine) | SS | 3 ô | ×1 | ×1 |
| Tàu khu trục (Destroyer) | DD | 2 ô | ×1 | ×2 |
| Tổng | — | — | 5 tàu / 17 ô | 8 tàu / 25 ô |

> ⚑ Tỷ lệ coverage: Easy = 17/100 = 17%; Normal = 25/144 ≈ 17.4% — đảm bảo độ thách thức gameplay tương đương giữa 2 chế độ.

**Cơ chế tính điểm phiên bản 2:**

| Loại tàu bị bắn trúng | Điểm mỗi ô trúng |
| --- | ---: |
| Tàu khu trục (Destroyer) | 20 |
| Tàu ngầm (Submarine) | 30 |
| Tàu tuần dương (Cruiser) | 30 |
| Thiết giáp hạm (Battleship) | 40 |
| Tàu sân bay (Carrier) | 50 |

| Sự kiện | Điểm thưởng |
| --- | ---: |
| Nhấn chìm tàu | +50 |
| Thắng ván | +100 |

Công thức tính điểm cho một phát bắn trúng:

```text
Điểm lượt bắn = điểm loại tàu bị bắn trúng × hệ số combo
```

Quy tắc combo:

| Điều kiện | Hệ số combo |
| --- | ---: |
| Phát bắn trúng đầu tiên trong lượt | ×1 |
| Phát bắn trúng liên tiếp thứ 2 | ×2 |
| Phát bắn trúng liên tiếp từ thứ 3 trở đi | ×3 |
| Bắn trượt và chuyển lượt | Reset về ×1 |

## 5. Các Bên Liên Quan

### 5.1. Danh Sách Stakeholder

| Bên liên quan | Mô tả | Kỳ vọng chính | Mức độ ảnh hưởng |
|---|---|---|---|
| Nhóm phát triển / Chủ dự án | Nhóm 5 thành viên cùng chịu trách nhiệm phân tích, phát triển, kiểm thử và bàn giao dự án. | Hoàn thành sản phẩm và tài liệu đúng phạm vi, đúng thời hạn. | Cao |
| Người chơi | Người dùng cuối trực tiếp tương tác với trò chơi. | Gameplay đơn giản, dễ hiểu và vận hành trơn tru; các tính năng v2 tăng trải nghiệm. | Trung bình |
| Người đánh giá / Đối tác | Bên tiếp nhận, kiểm tra sản phẩm và tài liệu bàn giao. | Tài liệu đầy đủ, sản phẩm nhất quán, đáp ứng phạm vi đã cam kết. | Cao |

---

## 6. Ràng Buộc Dự Án

### 6.1. Ràng Buộc Chính

| Loại ràng buộc | Mô tả                                                                                                           | Mức độ ảnh hưởng |
| --- |-----------------------------------------------------------------------------------------------------------------| --- |
| Thời gian | Phiên bản đầu tiên (v1) cần hoàn thành và sẵn sàng bàn giao trước 10-05-2026. v2 cần bàn giao trước 07-06-2026. | Cao |
| Kỹ thuật | Hệ thống phải được triển khai dưới dạng ứng dụng web sử dụng React.                                             | Trung bình |
| Môi trường triển khai | Môi trường deployment cụ thể xác định trong Deploy Document; BRD chỉ xác định hệ thống là web app React.        | Thấp |
| Ngân sách | Không có ngân sách thực tế — dự án học thuật.                                                                   | Thấp |
| Nhân lực | Nhóm 5 thành viên, không có nguồn lực bổ sung.                                                                  | Trung bình |
| UX/UI | Giao diện phải đơn giản và rõ ràng; v2 bổ sung tuỳ chọn theme sáng/tối.                                         | Thấp |
| Phạm vi | v1 giới hạn trong bộ tính năng tối thiểu đã thống nhất. v2 mở rộng theo danh sách đã chốt trong BRD v1.2.       | Cao |
| Lưu trữ dữ liệu | High Score được lưu bằng local storage; không yêu cầu backend hoặc cơ sở dữ liệu.                               | Thấp |

### 6.3. Rủi Ro Dự Án

| ID | Mô tả rủi ro | Xác suất | Mức độ tác động | Chiến lược xử lý |
|---|---|---|---|---|
| RSK-01 | Nhóm chủ động thêm tính năng ngoài phạm vi đã chốt (scope creep)                                 | Cao | Cao | Đóng băng phạm vi theo BRD v1.0; mọi thay đổi phạm vi cần qua quy trình xét duyệt nội bộ.                                               |
| RSK-02 | Phát triển giao diện web mất nhiều thời gian hơn dự kiến                                         | Trung bình | Trung bình | Ưu tiên bố cục đơn giản, tránh thêm độ phức tạp thị giác không cần thiết.                                                               |
| RSK-03 | Logic chọn ô tấn công của Máy tính ở độ khó Normal (ưu tiên ô xung quanh) phức tạp hơn ước lượng | Trung bình | Trung bình | Triển khai theo từng bước: hoàn thành logic Máy tính chọn ô tấn công ngẫu nhiên (Easy) trước, sau đó mở rộng Hunt-and-Target cho Normal. |
| RSK-04 | Yêu cầu bị lệch trong quá trình triển khai                                                       | Trung bình | Cao | Sử dụng BRD này làm tài liệu tham chiếu (baseline) cho các tài liệu yêu cầu tiếp theo và kiểm tra xác nhận.                             |
| RSK-05 | Tính năng kéo thả không hoạt động nhất quán trên các trình duyệt / thiết bị                      | Thấp | Trung bình | Kiểm thử trên ít nhất 2 trình duyệt phổ biến (Chrome, Firefox); cung cấp fallback click-to-place.                                       |
| RSK-06 | Dữ liệu High Score bị mất hoặc sai lệch do lỗi local storage                                     | Thấp | Trung bình | Validate dữ liệu trước khi lưu; xử lý lỗi khi đọc/ghi local storage.                                                                    |
| RSK-07 | Hệ thống tính điểm combo không nhất quán với quy tắc bắn tiếp                                    | Trung bình | Trung bình | Viết test case riêng cho từng tổ hợp: bắn trúng → combo, bắn trúng → bắn tiếp → combo, trượt → reset.                                   |

### 6.4. Giả Định

- Mức độ khả dụng cơ bản là đủ, miễn là các quy tắc và tương tác trong trò chơi được truyền đạt rõ ràng.
- Đội tàu (Fleet) Battleship tiêu chuẩn có thể được triển khai mà không cần tùy chỉnh trong phiên bản đầu tiên.
- Logic điều khiển đối thủ máy tính ở mức cơ bản (ngẫu nhiên) là chấp nhận được cho độ khó Easy.
- Logic điều khiển đối thủ máy tính cải tiến cho độ khó Normal có thể triển khai bằng thuật toán Hunt-and-Target đơn giản, không cần thư viện AI/ML bên ngoài.
- Local storage đủ đáp ứng yêu cầu lưu một High Score cục bộ duy nhất trong phạm vi v2.
- Kéo thả tàu có thể sử dụng HTML5 Drag and Drop API hoặc thư viện React tương đương mà không cần backend.

## Phụ Lục

### Phụ Lục A: Thuật Ngữ Và Định Nghĩa

| Thuật ngữ | Định nghĩa                                                                                                                                                                                       |
|---|--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| BRD | Business Requirements Document; tài liệu mô tả yêu cầu ở cấp độ nghiệp vụ, độc lập với giải pháp kỹ thuật.                                                                                       |
| URD | User Requirements Document; tài liệu mô tả yêu cầu người dùng và các nhu cầu tương tác với hệ thống.                                                                                             |
| Fleet | Đội tàu trong Battleship, gồm loại tàu, số lượng và kích thước theo quy tắc chuẩn.                                                                                                               |
| Hit / Miss / Sunk | Trúng / Trượt / Nhấn chìm — ba kết quả có thể xảy ra sau mỗi lượt tấn công.                                                                                                                      |
| Combo | Chuỗi bắn trúng liên tiếp không bị gián đoạn bởi lượt trượt; kích hoạt hệ số nhân điểm.                                                                                                          |
| High Score | Điểm cao nhất cục bộ duy nhất của Người chơi, lưu trong local storage và chỉ cập nhật sau khi ván chơi kết thúc nếu điểm cuối cao hơn điểm đang lưu.                                             |
| Hunt-and-Target | Chiến thuật chọn ô tấn công của Máy tính đơn giản: tấn công ngẫu nhiên (Hunt) cho đến khi trúng, sau đó ưu tiên các ô liền kề (Target).                                                          |
| Easy / Normal | Hai mức độ khó: Easy sử dụng bảng 10×10 với chiến thuật chọn ô tấn công của Máy tính là ngẫu nhiên; Normal sử dụng bảng 12×12 với chiến thuật chọn ô tấn công của Máy tính theo Hunt-and-Target. |
| Auto-Place | Tính năng đặt tàu tự động — hệ thống tự tạo bố cục hợp lệ ngẫu nhiên thay cho người chơi.                                                                                                        |
| Drag and Drop | Cơ chế tương tác kéo thả — người dùng nhấn giữ một phần tử và di chuyển đến vị trí mong muốn.                                                                                                    |
| Light Theme / Dark Theme | Tuỳ chọn giao diện sáng hoặc tối áp dụng toàn bộ UI của trò chơi.                                                                                                                                |
| SPA | Single Page Application — Ứng dụng web đơn trang.                                                                                                                                                |
| React | Thư viện JavaScript mã nguồn mở dùng để xây dựng giao diện người dùng — framework chính của dự án.                                                                                               |
| Scope creep | Tình trạng phạm vi dự án mở rộng vượt ngoài kế hoạch ban đầu.                                                                                                                                    |
| Luật Battleship tiêu chuẩn | Bộ quy tắc chơi Battleship theo ấn bản chính thức của Hasbro Inc. (Milton Bradley, 1967).                                                                                                        |

### Phụ Lục B: Tài Liệu Tham Chiếu

| # | Tài liệu | Phiên bản / Ngày |
|---|---|---|
| [1] | Hasbro Inc., *Battleship — Game Rules* | Hiện hành. xem: hasbro.com/battleship |
