_Mỗi khi hoàn thành task, phải dùng lệnh /save để cập nhật vắn tắt vào đây_

# Sổ tay tiến độ dự án (FEATURES_DONE)

## Phiên bản: 1.0.0 (Khởi tạo)

### 🚀 Giai đoạn 0: Khởi tạo hệ thống (Setup Base)

- [x] Phân tích toàn bộ Source Code hiện tại.
- [x] Thiết lập cấu trúc thư mục chuẩn Domain-Driven Design (DDD).
- [x] Tạo bộ khung hướng dẫn AI (.agent/ & .docs/).
- [x] Cấu hình Axios Interceptors & React Query Base.
- [x] Thiết lập Ant Design ConfigProvider & Theme.

### 📦 Các thành phần tái sử dụng (Reusable Assets)

#### Components

- `TableWithPagination`: Bảng dữ liệu tích hợp phân trang chuẩn Antd.
- `PageContainer`: Layout bọc trang tích hợp Breadcrumb.
- `ConfirmDialog`: Modal xác nhận hành động nguy hiểm.
- `RequiredLabel`: Nhãn đánh dấu trường bắt buộc trong Form.

#### Hooks

- `useFilter`: Quản lý state bộ lọc và phân trang.
- `useI18n`: Hook hỗ trợ đa ngôn ngữ nhanh.
- `usePageTitle`: Tự động cập nhật tiêu đề trang.

---

- _2026-07-03_: Nối API Auth + Profile + Question Bank (React Query, không dùng fetch):
  - **Auth**: `apps/auth/services` (authApi/authQuery/types) cho login/register/refresh/logout/change-password/Google; axios interceptor tự refresh token, guest-mode (401 âm thầm trừ login/register), Redux `authSlice` + `useLogout` xóa cache khi đổi phiên; trang `/oauth` callback Google.
  - **Profile**: `GET/PATCH /profile/me` khớp `user_profiles` (full_name, target_date, aptis_goal, school_name).
  - **Question Bank** (`apps/admin/pages/admin-questions/services`): types 19 dạng extraConfig + questionApi (CRUD `/questions` + `/files/upload`) + questionQuery + **questionMapper** so khớp form 5 kỹ năng → payload theo QUESTION_SAMPLES (mở rộng form "gộp" thành mảng POST: Grammar 25 câu, Listening P3/P4 nhiều bản, Writing P4 2 task cùng question_group_id...). Bảng câu hỏi fetch thật theo skill+part, có xóa.
  - _Còn tồn_: Reading P5 heading-match cần form thu thập "câu 0" mẫu (đang sinh example tối thiểu); upload ảnh/audio Speaking/Listening cần wire `useUploadFileMutation` vào antd Upload để lấy URL thật.

- _2026-05-17_: Xây dựng 4 màn hình luyện tập Đọc hiểu tương tác đỉnh cao (Reading Practice Sub-Pages):
  - Phân rã cấu trúc và tổ chức 4 trang luyện tập thành các thư mục riêng biệt (`part1/`, `part2/`, `part3/`, `part4/`) dưới thư mục `src/apps/reading-practice/pages/parts/`:
    * Mỗi thư mục tự quản lý file giao diện chính (`Index.tsx`) và file định nghĩa kiểu dáng CSS-in-JS (`styled.ts`) giúp tối ưu hóa khả năng bảo trì và nâng cấp.
    * **Part 1 (Sentence Comprehension)**: Bố cục 2 cột trực quan. Cột trái mô phỏng Email thực tế, cột phải gồm 5 câu hỏi tách biệt dạng thẻ Card đi kèm ô chọn `<Select>` inline tối ưu 16px.
    * **Part 2 & 3 (Text Cohesion)**: Hệ thống kéo thả sắp xếp cốt truyện bằng **HTML5 Drag and Drop API** bản địa (0 dependencies) có hỗ trợ click chuyển vị trí tự động cho thiết bị di động cực tiện lợi.
    * **Part 3 (Opinion Matching)**: Bố cục 2 cột tinh tế với 4 khối ý kiến của 4 người bên trái và 7 câu phát biểu nối ý bên phải sử dụng Radio.Group (A, B, C, D) 1-click thay thế dropdown cũ.
    * **Part 4 (Long Text Comprehension)**: Phân tách độc lập cuộn trang 2 cột (dual-scroll). Cột trái cuộn đoạn văn dài được đánh số, cột phải ghim cố định Heading Bank xanh ngọc và danh sách gán tiêu đề 100% chiều rộng.
  - Tách biệt 100% mã nguồn styled-components từ các file TSX của 4 phần sang các file `.styled.ts` chuyên biệt trong cùng thư mục (`Part1Page.styled.ts` đến `Part4Page.styled.ts`) giữ cho cấu trúc code gọn gàng, trong sáng và dễ bảo trì.
  - Khắc phục triệt để lỗi TypeScript liên quan đến thuộc tính `size="small"` không chuẩn trên thẻ `<Text>` của Ant Design tại Part 1.
  - Cấu hình và đồng bộ hóa 15-phút đếm ngược thời gian thực trên mỗi màn để tăng cường tính chân thực của bài thi.
  - Định nghĩa và xuất 4 sub-routes mới (`/reading/part/1-4`) qua TanStack Router tại [routes.tsx](file:///d:/react-exam-online/src/apps/reading-practice/routes.tsx) và đăng ký chính thức tại [App.tsx](file:///d:/react-exam-online/src/App.tsx).
  - Tích hợp tính năng tự động chuyển đổi từ Bảng điều khiển Đọc hiểu thẳng đến các màn luyện tập tương ứng.
- _2026-05-17_: Xây dựng học phần Luyện Viết (Writing Practice):
  - Tạo mới module `writing-practice` độc lập, bao gồm các file components (`PartCard`), custom styles và trang Index quản lý tiến trình.
  - Phân tách cấu trúc thành 4 phần thi chuẩn APTIS Writing với nội dung chi tiết:
    * Part 1: Word-level Writing (Viết cấp độ từ).
    * Part 2: Short Text Writing (Viết đoạn văn ngắn).
    * Part 3: Three Written Parts of a Text (Viết tương tác mạng xã hội).
    * Part 4: Formal and Informal Writing (Viết email trang trọng & thân mật).
  - Quản lý trạng thái tiến độ độc lập bằng React State cục bộ theo yêu cầu (không dùng Redux) đảm bảo sự mượt mà và tương tác tức thì trên giao diện.
  - Tích hợp điều hướng `/writing` qua hệ thống TanStack Router, đăng ký route tại [App.tsx](file:///d:/react-exam-online/src/App.tsx) và tích hợp hoàn chỉnh vào Sidebar và Bảng điều khiển.
- _2026-05-17_: Tái cấu trúc quản lý trạng thái bằng Redux Toolkit chuyên nghiệp:
  - Thiết kế logic tự động tính toán lại Chỉ số thống kê (`overallProgress`, `completedModules`) bất cứ khi nào tiến trình của một phần thay đổi.
  - Đồng bộ hóa toàn bộ 5 trang luyện tập giúp tiến độ bài học phản hồi tức thì và cập nhật trực tiếp lên Bảng điều khiển/Sidebar theo thời gian thực.
- _2026-05-17_: Tái cấu trúc chuẩn hóa hệ thống định tuyến (Loại bỏ window.navigateTo):
  - Xóa bỏ hoàn toàn hàm `window.navigateTo` toàn cục không chuẩn khỏi [App.tsx](file:///d:/react-exam-online/src/App.tsx).
  - Cập nhật [Sidebar.tsx](file:///d:/react-exam-online/src/apps/home/components/Sidebar.tsx) và [ModuleGrid.tsx](file:///d:/react-exam-online/src/apps/home/components/ModuleGrid.tsx) sử dụng hook type-safe `useNavigate()` của TanStack Router.
  - Thay thế toàn bộ các sự kiện chuyển trang thủ công ở Header Logo bằng thẻ `<Link to="/">` tối ưu chuẩn SEO tại tất cả 5 trang chính.
- _2026-05-17_: Xây dựng học phần Ngữ pháp & Từ vựng (Grammar & Vocabulary):
  - Tạo mới module `grammar-practice` độc lập, đầy đủ components (`PartCard`), custom styles và routes trỏ đến `/grammar`.
  - Thiết kế chính xác theo cấu trúc ảnh mẫu: gồm Part 1: Grammar (25 câu trắc nghiệm) và Part 2: Vocabulary (25 câu trắc nghiệm) với mô tả và màu sắc tương ứng.
  - Đăng ký route `/grammar` tại [App.tsx](file:///d:/react-exam-online/src/App.tsx) và tích hợp điều hướng hoàn chỉnh vào `Sidebar` và `ModuleGrid`.
- _2026-05-17_: Tách biệt các học phần luyện tập (Reading, Listening, Speaking):
  - Tách học phần gộp trước đây thành 3 module độc lập hoàn toàn: `reading-practice`, `listening-practice`, và `speaking-practice`.
  - Mỗi module tự quản lý types, components (`PartCard`), custom styles và routes riêng biệt để đạt độ cô lập 100%.
  - Đăng ký 3 route độc lập (`/reading`, `/listening`, `/speaking`) tại [App.tsx](file:///d:/react-exam-online/src/App.tsx) thay vì route động trước đây.
- _2026-05-17_: Chuẩn hóa hệ thống routing dự án (Tái cấu trúc TanStack Router):
  - Trích xuất `rootRoute` dùng chung tại [root.ts](file:///d:/react-exam-online/src/shared/router/root.ts) để tránh circular dependency.
  - Chuyển giao khai báo các route con về đúng từng thư mục module: [home/routes.tsx](file:///d:/react-exam-online/src/apps/home/routes.tsx) và [reading-practice/routes.tsx](file:///d:/react-exam-online/src/apps/reading-practice/routes.tsx).
  - Tích hợp hook `useRouterState` vào `Sidebar` để theo dõi và cập nhật trạng thái `active` động của menu và tự động mở submenu tương ứng.
  - Sửa lỗi định tuyến cho các học phần ở `ModuleGrid` chuyển sang định vị theo `module.id` thay vì so khớp tiêu đề thô, đảm bảo an toàn tuyệt đối.
  - Đổi tên học phần "Nói" thành "Nói 1" tại `useHomeData` mà không gây ảnh hưởng định tuyến.
- _2026-05-13_: Hoàn thành thiết lập bộ khung quản lý dự án cho AI Agent.
