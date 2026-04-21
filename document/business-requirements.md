# Tài Liệu Yêu Cầu Nghiệp Vụ (BRD)[^1]

**Dự án:** Trò chơi Battleship  
**Phiên bản:** 1.0  
**Ngày:** 2026-04-21  
**Chủ tài liệu:** Chuyên viên Phân tích Nghiệp vụ[^2]

---

## 1. Tóm Tắt Điều Hành[^3]

Tài liệu này xác định các yêu cầu nghiệp vụ cho dự án trò chơi Battleship dạng web. Phiên bản đầu tiên tập trung vào việc cung cấp một trò chơi có thể chơi được với bộ quy tắc rõ ràng, phạm vi giới hạn, và chất lượng tài liệu đạt chuẩn để có thể bàn giao và đánh giá.

---

## 2. Bối Cảnh Nghiệp Vụ[^4]

Hệ thống cung cấp một trải nghiệm chơi trò chơi Battleship trên nền tảng trình duyệt web. Người dùng đơn (single player)[^5] sẽ đối đấu với máy tính, trong một luồng gameplay[^6] hoàn chỉnh từ thiết lập đến kết thúc trận đấu. Sản phẩm hướng đến sự đơn giản, dễ hiểu và ổn định về mặt vận hành.

---

## 3. Mục Tiêu Nghiệp Vụ[^7]

| ID | Mục tiêu | Thước đo thành công | Độ ưu tiên |
|---|---|---|---|
| BG-01 | Cung cấp một trò chơi Battleship có thể chơi được với quy tắc rõ ràng và gameplay ổn định. | Người dùng có thể bắt đầu trận đấu, đặt tàu, thực hiện lượt tấn công và hoàn thành ván chơi theo đúng quy tắc. | Cao |
| BG-02 | Đảm bảo phạm vi phiên bản 1 được kiểm soát và bàn giao đúng hạn. | Phiên bản 1 hoàn thành trong vòng 2 tuần, không mở rộng ngoài phạm vi đã xác định. | Cao |
| BG-03 | Cung cấp một sản phẩm có thể demo[^8] và đánh giá được. | Hệ thống và tài liệu đi kèm nhất quán, dễ hiểu và phù hợp để trình bày. | Trung bình |

---

## 4. Các Bên Liên Quan[^9]

| Bên liên quan | Mô tả | Kỳ vọng chính |
|---|---|---|
| Chủ dự án | Người khởi tạo và sở hữu sản phẩm. | Dự án hoàn thành đúng phạm vi, đúng hạn, tài liệu rõ ràng. |
| Người chơi | Người dùng cuối trực tiếp tương tác với trò chơi. | Gameplay đơn giản, dễ hiểu và vận hành trơn tru. |
| Người đánh giá | Bên tiếp nhận và kiểm tra sản phẩm bàn giao. | Sản phẩm nhất quán, đầy đủ tính năng trong phạm vi đã cam kết. |

---

## 5. Phạm Vi Dự Án[^10]

### 5.1 Trong Phạm Vi

- Trò chơi Battleship chạy trên nền tảng web.
- Chế độ đơn người chơi: Người chơi đối đấu với máy tính (AI)[^11].
- Luồng gameplay cốt lõi bao gồm: thiết lập bảng, đặt tàu, tấn công theo lượt, phản hồi trúng/trượt, và kết quả thắng/thua.
- Quy tắc theo chuẩn Battleship tiêu chuẩn.
- Giao diện người dùng[^12] tập trung vào sự rõ ràng.
- Triển khai[^13] bằng React trên frontend[^14].

### 5.2 Ngoài Phạm Vi

- Chế độ nhiều người chơi trực tuyến (online multiplayer)[^15].
- Chế độ hai người chơi cùng thiết bị trong phiên bản 1.
- AI nâng cao vượt ngoài hành vi cơ bản.
- Hệ thống xếp hạng hoặc bảng điểm cạnh tranh.
- Lưu trữ lịch sử trận đấu.
- Hoạt ảnh phức tạp, đồ họa chất lượng cao, hoặc giao diện cao cấp.
- Bộ chỉnh sửa quy tắc hoặc thiết lập tùy chỉnh.

---

## 6. Tổng Quan Sản Phẩm[^16]

Hệ thống cung cấp trải nghiệm chơi Battleship trên trình duyệt, trong đó một người chơi đối đấu với đối thủ do máy tính điều khiển. Sản phẩm được thiết kế để dễ hiểu, nhanh chóng demo, và giới hạn trong phạm vi tính năng tối thiểu cần thiết để đảm bảo bàn giao đúng hạn.

---

## 7. Yêu Cầu Nghiệp Vụ

### 7.1 Yêu Cầu Chức Năng Nghiệp Vụ[^17]

| ID | Yêu cầu |
|---|---|
| BR-01 | Hệ thống phải cho phép người chơi bắt đầu một ván Battleship mới qua giao diện web. |
| BR-02 | Hệ thống phải hỗ trợ chế độ đơn người chơi đối đấu với đối thủ do máy tính điều khiển. |
| BR-03 | Hệ thống phải cung cấp bảng chơi kích thước 10×10. |
| BR-04 | Hệ thống phải sử dụng cấu hình hạm đội[^18] Battleship tiêu chuẩn. |
| BR-05 | Hệ thống phải cho phép người chơi đặt tàu trước khi bắt đầu gameplay. |
| BR-06 | Hệ thống phải hỗ trợ tấn công theo lượt giữa người chơi và máy tính. |
| BR-07 | Hệ thống phải hiển thị rõ ràng kết quả trúng (hit)[^19], trượt (miss)[^20], và đã nhấn chìm (sunk)[^21] trong suốt ván chơi. |
| BR-08 | Hệ thống phải xác định kết thúc ván chơi khi toàn bộ tàu của một bên bị nhấn chìm. |
| BR-09 | Hệ thống phải hiển thị kết quả cuối ván là thắng hoặc thua. |
| BR-10 | Phiên bản 1 không được bao gồm tính năng theo dõi điểm số và lưu lịch sử trận đấu. |

### 7.2 Quy Tắc Nghiệp Vụ[^22]

| ID | Quy tắc | Nguồn |
|---|---|---|
| RULE-01 | Kích thước bảng chơi cố định là 10×10. | Yêu cầu nghiệp vụ BR-03 |
| RULE-02 | Hạm đội tuân theo bộ tàu Battleship tiêu chuẩn. | Yêu cầu nghiệp vụ BR-04 |
| RULE-03 | Không áp dụng quy tắc đặc biệt trong phiên bản 1. | Phạm vi dự án §5.2 |
| RULE-04 | Người chơi thắng khi toàn bộ tàu của đối thủ bị nhấn chìm. | Yêu cầu nghiệp vụ BR-08 |
| RULE-05 | Phiên bản 1 không bao gồm tính năng điểm số hoặc xếp hạng. | Yêu cầu nghiệp vụ BR-10 |
| RULE-06 | Phiên bản 1 không lưu lịch sử trận đấu. | Yêu cầu nghiệp vụ BR-10 |
| RULE-07 | Phiên bản 1 không hỗ trợ chế độ chơi trực tuyến. | Phạm vi dự án §5.2 |

---

## 8. Giả Định[^23]

- Mức độ khả dụng cơ bản là đủ, miễn là các quy tắc và tương tác trong trò chơi được truyền đạt rõ ràng.
- Hạm đội Battleship tiêu chuẩn có thể được triển khai mà không cần tùy chỉnh trong phiên bản đầu tiên.
- Hành vi AI ở mức cơ bản là chấp nhận được cho phiên bản 1.

---

## 9. Ràng Buộc[^24]

| Loại | Ràng buộc |
|---|---|
| Thời gian | Thời gian hoàn thành mục tiêu là 2 tuần. |
| Kỹ thuật | Hệ thống phải được triển khai dưới dạng ứng dụng web sử dụng React. |
| UX/UI[^25] | Giao diện phải đơn giản và rõ ràng, không yêu cầu trau chuốt cao. |
| Phạm vi | Phiên bản 1 phải giới hạn trong bộ tính năng tối thiểu đã thống nhất. |

---

## 10. Rủi Ro và Biện Pháp Giảm Thiểu[^26]

| Rủi ro | Khả năng xảy ra | Mức ảnh hưởng | Biện pháp giảm thiểu |
|---|---|---|---|
| Mở rộng phạm vi trong quá trình phát triển | Cao | Cao | Đóng băng phạm vi phiên bản 1 quanh gameplay cốt lõi. |
| Phát triển giao diện web mất nhiều thời gian hơn dự kiến | Trung bình | Trung bình | Ưu tiên bố cục đơn giản, tránh thêm độ phức tạp thị giác không cần thiết. |
| Logic AI trở nên phức tạp hơn kế hoạch | Trung bình | Trung bình | Giữ hành vi máy tính ở mức cơ bản trong phiên bản 1. |
| Yêu cầu bị lệch trong quá trình triển khai | Trung bình | Cao | Sử dụng BRD này làm baseline[^27] cho các tài liệu yêu cầu tiếp theo và kiểm tra xác nhận. |

---

## 11. Tiêu Chí Chấp Nhận[^28]

Dự án được coi là hoàn thành thành công cho phiên bản đầu tiên khi tất cả các điều kiện sau đều đúng:

- Trò chơi chạy được trên môi trường web.
- Người chơi có thể tham gia ván đấu với máy tính từ giai đoạn thiết lập đến kết thúc trận.
- Trò chơi sử dụng bảng 10×10 và hạm đội Battleship tiêu chuẩn.
- Trò chơi xác định đúng điều kiện thắng/thua.
- Phiên bản 1 không bao gồm chế độ trực tuyến, theo dõi điểm số hoặc lưu lịch sử trận đấu.
- Sản phẩm hoàn chỉnh và có thể đánh giá trong khung thời gian 2 tuần.

---

[^1]: **BRD** – *Business Requirements Document*: Tài liệu Yêu cầu Nghiệp vụ. Mô tả các yêu cầu ở cấp độ nghiệp vụ, độc lập với giải pháp kỹ thuật.
[^2]: **Business Analyst (BA)**: Chuyên viên Phân tích Nghiệp vụ. Người chịu trách nhiệm thu thập, phân tích và tài liệu hóa yêu cầu.
[^3]: **Executive Summary**: Tóm tắt điều hành. Phần tóm gọn dành cho lãnh đạo hoặc bên liên quan cấp cao, không cần đọc toàn bộ tài liệu.
[^4]: **Business Context**: Bối cảnh nghiệp vụ. Mô tả lý do tồn tại và môi trường hoạt động của hệ thống.
[^5]: **Single Player**: Chế độ đơn người chơi – người chơi không cần có người khác tham gia cùng.
[^6]: **Gameplay**: Luồng/cơ chế chơi. Chuỗi tương tác giữa người dùng và hệ thống trong một phiên chơi.
[^7]: **Business Objectives**: Mục tiêu nghiệp vụ. Các kết quả cụ thể mà dự án cần đạt được ở cấp độ tổ chức hoặc sản phẩm.
[^8]: **Demo**: Bản trình diễn sản phẩm. Thường dùng để giới thiệu tính năng cho bên liên quan hoặc khách hàng.
[^9]: **Stakeholders**: Các bên liên quan. Những cá nhân hoặc nhóm có lợi ích liên quan đến dự án.
[^10]: **Project Scope**: Phạm vi dự án. Xác định rõ những gì được bao gồm và không được bao gồm trong phiên bản này.
[^11]: **AI** – *Artificial Intelligence*: Trí tuệ nhân tạo. Trong ngữ cảnh này, chỉ hành vi tự động của máy tính khi điều khiển đối thủ.
[^12]: **UI** – *User Interface*: Giao diện người dùng. Phần mà người dùng nhìn thấy và tương tác trực tiếp.
[^13]: **Triển khai** – *Implementation/Deployment*: Trong ngữ cảnh này chỉ việc xây dựng và đưa hệ thống vào hoạt động.
[^14]: **Frontend**: Phần giao diện phía người dùng của ứng dụng web, chạy trực tiếp trên trình duyệt.
[^15]: **Online Multiplayer**: Chế độ nhiều người chơi trực tuyến – nhiều người chơi kết nối qua mạng cùng tham gia.
[^16]: **Product Overview**: Tổng quan sản phẩm. Mô tả tổng thể về hệ thống sẽ được xây dựng.
[^17]: **Functional Business Requirements**: Yêu cầu chức năng nghiệp vụ. Mô tả các hành vi và chức năng hệ thống phải cung cấp để đáp ứng mục tiêu nghiệp vụ.
[^18]: **Fleet Configuration / Hạm đội**: Tập hợp các con tàu (loại, số lượng, kích thước) theo quy tắc Battleship chuẩn.
[^19]: **Hit**: Trúng – tấn công vào ô có tàu của đối thủ.
[^20]: **Miss**: Trượt – tấn công vào ô không có tàu.
[^21]: **Sunk**: Đã nhấn chìm – toàn bộ các ô của một con tàu đã bị tấn công trúng.
[^22]: **Business Rules**: Quy tắc nghiệp vụ. Các ràng buộc và điều kiện chi phối cách hệ thống hoạt động, xuất phát từ yêu cầu nghiệp vụ.
[^23]: **Assumptions**: Giả định. Các điều kiện được coi là đúng mà không cần xác nhận chính thức, có thể ảnh hưởng đến yêu cầu nếu thay đổi.
[^24]: **Constraints**: Ràng buộc. Các giới hạn cứng về thời gian, kỹ thuật, ngân sách hoặc quy định không thể thay đổi.
[^25]: **UX/UI** – *User Experience / User Interface*: Trải nghiệm người dùng / Giao diện người dùng. UX tập trung vào cảm nhận tổng thể, UI tập trung vào giao diện trực quan.
[^26]: **Risk Mitigation**: Biện pháp giảm thiểu rủi ro. Các hành động chủ động nhằm giảm khả năng xảy ra hoặc mức ảnh hưởng của rủi ro.
[^27]: **Baseline**: Đường cơ sở. Phiên bản tài liệu được chốt làm tham chiếu chính thức cho các so sánh và kiểm soát thay đổi.
[^28]: **Acceptance Criteria**: Tiêu chí chấp nhận. Điều kiện tối thiểu mà hệ thống phải đáp ứng để được coi là hoàn thành và bàn giao thành công.
