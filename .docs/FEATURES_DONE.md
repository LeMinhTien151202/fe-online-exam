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

- _2026-07-05_: Đồng bộ UI + dữ liệu thật cho admin:
  - **Luyện Nghe theo phần (học viên)** ([apps/listening-practice]): nối API thật `GET /questions?skillId=2&partNumber=`. Service [listeningApi.ts]/[listeningQuery.ts]/[mappers.ts]: P1 MC (mỗi bản ghi 1 câu + audio riêng), P2 SPEAKER_MATCH (options_pool + 4 người), P3 SPEAKER_AGREEMENT (statements Man/Woman/Both), P4 Monologue (mỗi bài nghe 1 bản ghi, questions[] MC). Cuộn **trong cùng part** qua nút **Câu/Bài tiếp theo** + tag "Bài X/Y" (P1 cuộn câu; P2/P3/P4 cuộn theo bản ghi/bài nghe), **không nhảy part**; nộp bài chỉ ghi nhận. [AudioPlayer.tsx] thêm prop `src` phát audio thật (`mediaUrl`); loading `Spin` + empty `Empty`; bỏ transcript (API không có); xóa 4 `data.ts` mock.
  - **Speaking — đổi cách lưu**: P1 giữ tách lẻ (mỗi câu 1 bản ghi); P2/P3/P4 gói toàn bộ câu hỏi vào `extraConfig.questions[]` (`{question, sample_answer?}`) — 1 bản ghi/part. `buildSpeaking` ([questionMapper.ts]) cập nhật; `RecordConfig.questions[]` + bỏ `question_group_id` (types đã có sẵn). Listening P3 (`statements[]`)/P4 (`questions[]`) đã đổi từ trước.
  - **Luyện Nói theo phần (học viên)** ([apps/speaking-practice]): nối API thật `GET /questions?skillId=5&partNumber=`. Service [speakingApi.ts]/[speakingQuery.ts]/[mappers.ts]: P1 → danh sách câu độc lập; P2/P3/P4 → danh sách "bộ" (ảnh + `questions[]`). Cuộn **trong cùng part** (P1: câu↔câu; P2/P3: sub-question rồi sang bộ khác; P4: bộ↔bộ) qua nút **Câu/Bộ tiếp theo** + tag "Bộ X/Y", **không nhảy sang part khác**; nộp bài chỉ ghi nhận. Loading `Spin` + empty `Empty`; đáp án mẫu (nếu có `sample_answer`) hiện trong "Xem đáp án mẫu", ẩn khi rỗng.
  - **Fix upload ảnh Speaking (2 lỗi 400)**:
    1) [questionApi.ts] `upload` trước ép `Content-Type: 'multipart/form-data'` thủ công → thiếu `boundary` → 400. Sửa: `'Content-Type': null` cho axios tự sinh header kèm boundary (áp dụng cả audio Listening).
    2) [SpeakingForm.tsx] `Form.Item name="p*ImageUrl"` **bọc trực tiếp `Upload.Dragger`** → antd ghi đè giá trị field bằng object `{file,fileList}` (không phải URL) → `image_urls` rỗng → 400 "phải có ít nhất 1 phần tử". Sửa: tách Upload khỏi Form.Item có name; dùng **field ẩn `<Input hidden>`** giữ URL (cập nhật qua `setFieldValue`). Dọn `any`/biến thừa trong form.
  - **Writing — đổi cách lưu (mỗi part = 1 bản ghi)**: theo QUESTION_SAMPLES.md cập nhật. `EssayConfig` thêm `prompts[]` (P1/P3) + `tasks[]` (P4) + `context`; [questionMapper.ts] `buildWriting` gộp P1 (5 câu→`prompts`), P3 (3 Member→`prompts` kèm `speaker_name`), P4 (Notice `context` + `tasks[2]` Informal/Formal) thành 1 POST/part; [QuestionDetailModal.tsx] render prompts/tasks.
  - **Luyện Viết theo phần (học viên)** ([apps/writing-practice]): nối API thật `GET /questions?skillId=4&partNumber=` (trước mock cứng). Service [writingApi.ts]/[writingQuery.ts]/[mappers.ts] map `extraConfig` → shape từng trang (P1 prompts→5 câu, P2 content→đề, P3 prompts→3 chat, P4 context+tasks→Notice+2 email). Giới hạn từ lấy động từ API (validation + badge); loading `Spin` + empty `Empty`. Writing giữ đủ 4 phần.
    - **Đáp án mẫu (`sample_answer`)**: thêm trường ở form admin ([WritingForm.tsx]: ô đáp án mẫu cho từng câu P1/P3, đề P2, từng task P4) → lưu vào `extraConfig` (prompt/task `sample_answer`, P2 top-level); [questionMapper.ts]/[types.ts]/[QuestionDetailModal.tsx] cập nhật. Trang học viên có nút **"Xem đáp án mẫu"** (chỉ hiện khi có dữ liệu) mở `SampleAnswerModal`.
    - **Luyện nhiều câu/phần (như Reading)**: mỗi hook giữ danh sách câu của phần + chỉ số; nút **Câu trước/Câu tiếp theo** + tag "Câu X/Y"; nộp bài chỉ chấm câu hiện tại (không còn tự nhảy sang part khác), nút "Danh sách" về `/writing`.
  - **Luyện Đọc theo phần (học viên)** ([apps/reading-practice]): nối API thật cho 4 phần luyện tập (trước là mock cứng trong từng `services/data.ts`). Lớp service dùng chung [readingApi.ts]/[readingQuery.ts]/[mappers.ts]: fetch `GET /questions?skillId=3&partNumber=` (role đã tắt ở BE dev), mapping FE→API **1→1, 2→2, 3→4, 4→5** (bỏ API part 3 vì trùng dạng ORDERING với part 2 → còn 4 phần riêng biệt). Mapper chuyển `extraConfig` về đúng shape từng trang: P1 gap-fill (render đoạn văn động tách theo `___(n)`), P2 ORDERING (kéo-thả, tách câu cố định + xáo pool), P3 SPEAKER_MATCH người/ý kiến (radio động theo số người), P4 HEADING_MATCH (gán tiêu đề). Mỗi trang thêm loading `Spin` + empty `Empty`, chấm điểm client-side như cũ; xóa 4 file `data.ts` mock. **Luyện nhiều câu/phần**: mỗi hook giữ danh sách câu hỏi của phần + chỉ số hiện tại, có nút **Câu tiếp theo/Câu trước** + tag "Câu X/Y" (chuyển câu reset đáp án/timer). Part 1: placeholder ô chọn "Chọn đáp án", giữ nguyên xuống dòng gốc của đoạn văn (`white-space: pre-line`); render Select **ngay tại chỗ trống** — hỗ trợ cả `___(n)` (theo số) lẫn `___` gạch chân thường (thay lần lượt theo thứ tự câu), fallback liệt kê khi đoạn không có chỗ trống. Part 4: sửa ô chọn tiêu đề bị co nhỏ do class Tailwind không chạy → dùng styled `SlotInner` + `style width:100%`, giãn cách hợp lý. Bỏ Alert kết quả kiểu "mọc ra đẩy nội dung" ở cả 4 part, thay bằng **tag kết quả cố định trên header** (không xô lệch layout).
  - **Tài liệu học tập (trang học viên)** ([apps/materials]): nối API thật `GET /study-materials` (trước chỉ có ở admin, học viên còn `mockMaterials`). Service riêng read-only (materialApi/materialQuery), hook [useMaterials.ts] fetch (limit 100) + map về card (skillId→nhãn tiếng Việt khớp tab, VIDEO hiện thời lượng mm:ss), lọc search/định dạng/kỹ năng client-side. **Đa định dạng**: util [fileFormat.ts] `getFileMeta` suy nhóm file thật từ đuôi `fileUrl` (pdf/word/excel/ppt/video/image/audio/archive/text/…), fallback `fileType` thô của API → icon + màu + nhãn riêng; bộ lọc định dạng dựng **động** theo các nhóm thực có trong dữ liệu. Nút tải mở `fileUrl` (`window.open`), thêm loading `Spin`. Xóa `mockData.ts`.
  - **Ngân hàng câu hỏi — chỉnh sửa thật** ([QuestionEditModal.tsx]): trước đây nút Sửa chỉ mở lại form thêm mới rỗng. Nay modal sửa riêng đổ dữ liệu từ `raw.extraConfig` theo từng dạng (MC chọn đáp án đúng, gap-fill 5 chỗ, ORDERING nhập theo thứ tự đúng, WORD_BANK pool+slots, SPEAKER_MATCH Listening/Reading, HEADING_MATCH, Man/Woman/Both, ESSAY giới hạn từ + context, RECORD thời gian) + content/mediaUrl; lưu qua `PATCH /questions/{id}` (`useUpdateQuestionMutation` đã có sẵn, nay mới dùng). Form `key={id}` + `preserve=false` tránh dính dữ liệu giữa các câu. Modal thêm mới giữ nguyên cho flow "gộp".
  - **Quản lý người dùng**: chi tiết người dùng chuyển từ `Drawer` trượt phải sang **Modal popup** ([UserDetailModal.tsx]) đồng bộ phong cách với `QuestionDetailModal` (icon tiêu đề, `Descriptions`, footer "Đóng", `centered`). Đổi tên state `drawer*` → `detail*` trong [useUsers.ts]; xóa styled `DrawerHeader` thừa.
  - **Tạo bộ đề — bước "Xem trước & Xuất bản"**: bỏ mockup A/B/C/D giả, render **dữ liệu thật** từ câu hỏi đã chọn. `IBankQuestion` mang thêm `raw: IQuestion` ([examBank.ts]); component mới [ExamPreview.tsx] render nội dung + đáp án đúng theo từng dạng (MC, gap-fill, WORD_BANK, ORDERING, SPEAKER_MATCH, HEADING_MATCH, ESSAY, RECORD kèm audio/ảnh). Audio chỉ hiện cho Listening (skillId 2), ảnh chỉ cho Speaking (skillId 5). Tiêu đề/kỹ năng/phần/thời gian lấy từ cấu hình bước 1 (tự suy title cho loại "Luyện theo phần" khi không có tên).
  - **Chi tiết/chỉnh sửa đề** ([ExamDetail.tsx]/[ExamPartEditor.tsx]/[ExamSectionCard.tsx]): làm thoáng layout (Space vertical size large, nút "Lưu thông tin" canh phải, "Lưu phần" đưa lên header phải của part, thêm khoảng cách giữa các khối/section, nhãn "Danh sách câu hỏi"). List thao tác đề ([useExamColumns.tsx]): thêm icon **Chỉnh sửa** (`EditOutlined`) cạnh Xem/Xoá, gom `renderActions` + `Tooltip` + giãn nút; bỏ hết `any` (dùng `ExamRow`).
  - **Xem vs Chỉnh sửa (chế độ chỉ đọc)**: nút Xem điều hướng `?mode=view` → [useExamDetail.ts] đọc `useSearch` trả `readOnly`. Ở chế độ xem: khoá input tiêu đề/mô tả/hướng dẫn (`readOnly`), ẩn toàn bộ nút thao tác (Lưu thông tin, Lưu thời gian, Lưu phần, upload audio, di chuyển/xoá câu hỏi, đổi trạng thái), thời gian hiện dạng text; tiêu đề trang đổi "Xem/Chỉnh sửa đề thi". Nút Chỉnh sửa mở chế độ sửa như cũ. Layout `ExamPartEditor` chuyển sang styled-components ([ExamPartEditor.styled.ts]) fix nút "Lưu phần" bị dính sát.

- _2026-07-04_: Phân trang đồng bộ toàn bộ trang list admin + fix đổi số dòng/trang:
  - Hook dùng chung [usePagination.ts] (quản lý `page` + `pageSize`, `onChange(page,size)` khớp `AppPagination`; đổi pageSize tự về trang 1). **Fix lỗi "10/20 mỗi trang chưa ăn"** — trước đây chỉ truyền `setPage` nên bỏ qua tham số pageSize.
  - Nối phân trang thật (page/limit + `metaData.total`) cho: `admin-questions` (theo skill+part, thêm `questionApi.listPaged` giữ `list` mảng cho ngân hàng dựng đề), `admin-exams` (query theo tab loại đề), `admin-users`, cùng materials/faq/notifications đã làm trước.

- _2026-07-04_: Bổ sung phân trang + endpoint mới (Phase 7 & 8 cập nhật):
  - **axios**: thêm cờ `_rawEnvelope` + export `IApiEnvelope`/`IPageMeta` — list phân trang lấy nguyên envelope `{ data, metaData }` (mặc định vẫn trả `data` như cũ, không phá code hiện có).
  - **Notifications admin**: chuyển sang endpoint mới `GET /notifications` (kèm `receiver`), phân trang thật + lọc `audience` (broadcast/personal) + `notificationType`; cột "Phạm vi" hiện email người nhận. Bỏ badge "chưa đọc" ở trang quản lý (không hợp ngữ nghĩa toàn hệ thống).
  - **Study Materials**, **FAQ admin**: phân trang thật (`page/limit` + `metaData.total` cho `AppPagination`) thay cho đếm `.length`.

- _2026-07-04_: Nối API Users (Phase 1) cho `admin-users` + dọn dashboard admin:
  - Service (userApi/query/types `IAdminUser`/`IUserRow`) + `GET/POST/PATCH /users` + `PATCH /users/{id}/lock`. Danh sách fetch thật, tạo người dùng (email/password/full_name/role), khoá/mở khoá. Model đồng bộ với các trang khác (role/status/profile.aptisGoal), chỉ **`streak` (chuỗi ngày) tạm fake** theo id vì chưa có API.
  - Cột bỏ "Gói"/"Tiến độ" (không có dữ liệu), thêm "Vai trò"; drawer chi tiết thay tab progress/history/files giả bằng `Descriptions` model thật; UserModal bỏ Gói/SĐT/ngày sinh, dùng `role`. Xóa `initialStudents` mock.
  - Dashboard admin (nhóm C): bỏ cột "Gói" (thay "Ngày đăng ký"), dọn timeline khỏi sự kiện tính năng không tồn tại (duyệt tài liệu, nâng gói, giáo viên chấm).

- _2026-07-04_: Nối API Phase 8 — FAQ (admin + học viên):
  - **Admin** (`admin-faq`): service (faqApi/query/types) + `GET/POST/PATCH/DELETE /faqs`. List dùng `includeInactive=true` (admin thấy cả FAQ ẩn), hook [useFaq.ts] tạo/sửa/xóa mềm. Form + cột chuyển từ mock `status` sang field thật `isActive` (boolean) + `sortOrder`; cột/param type theo `IFaq` (bỏ `any`).
  - **Học viên** (`apps/faq`): service riêng (chỉ list FAQ đang bật, không gửi `includeInactive`), hook [useFaqList.ts] fetch thật + lọc category/search client-side + trạng thái mở accordion. Thay `mockFaqs`, thêm loading spinner.
  - **Thông báo học viên** (Sidebar): service [home/services/notification.ts] + hook [home/hook/useNotifications.ts] nối `GET /notifications/me` (chỉ khi đã đăng nhập), `PATCH /{id}/read` (click từng cái, broadcast không đánh dấu riêng), `read-all` (nút "Đánh dấu đã đọc"). Popover chuông bỏ mảng hardcode, group theo ngày (Hôm nay/Hôm qua/Tuần này/Trước đó) + thời gian tương đối; badge số = số chưa đọc (ẩn khi 0), có empty state.

- _2026-07-04_: Chi tiết câu hỏi + Phase 7 (Materials/Notifications/Settings):
  - **Chi tiết câu hỏi** ([QuestionDetailModal.tsx]): viết lại render theo đúng loại câu hỏi từ `raw.extraConfig` — MC, gap-fill, WORD_BANK, ORDERING, SPEAKER_MATCH (Listening & Reading), Man/Woman/Both, HEADING_MATCH, ESSAY, RECORD (kèm audio player / ảnh). Không còn A/B/C/D giả.
  - **Study Materials** ([admin-materials]): service (materialApi/query/types) + `GET/POST/DELETE /study-materials`; form dùng field thật (title, fileUrl, fileType PDF/VIDEO, skillId, durationSeconds); card mở fileUrl.
  - **Notifications** ([admin-notifications]): service thật; list `GET /notifications/me` + badge chưa đọc, gửi `POST /notifications` (broadcast/gửi riêng receiverId, type SYSTEM/EXAM_REMINDER/GRADE_RESULT), `PATCH /{id}/read` + `read-all`. Bỏ edit/delete (không có API), xóa `notificationService.ts` mock.
  - **Settings** ([admin-settings]): tab "Thời gian thi thử" nối `GET /settings` + `PATCH /settings/{key}` cho 5 key `MOCK_TEST_DURATION_*`. Các tab general/packages/logs vẫn là mock (ngoài phạm vi API).

- _2026-07-03_: Nối API Phase 4 — Exam Sets (dựng đề) cho `admin-exams`:
  - Service: `services/types.ts` (map ui type partial/set/full ↔ PART_PRACTICE/SKILL_FULL_SET/MOCK_TEST, skill label ↔ id), `examApi.ts` (exam-sets CRUD + toggle-active + assign/reorder/remove question + patch section/part), `examQuery.ts`, `examBank.ts` (map câu hỏi API → shape Selection, gồm Vocabulary task_variant → Task 1-5).
  - List ([useExams.ts]): fetch thật `/exam-sets`, tách 3 tab theo `type`, xóa + toggle-active thật (bấm tag trạng thái để bật/tắt hiển thị).
  - Create ([useCreateExam.ts]): publish flow thật = `POST /exam-sets` (BE tự sinh sections/parts) → gom câu đã chọn theo `(skillId-partNumber)` map tới `part.id` → `POST /exam-parts/{id}/questions` → `toggle-active`. Ngân hàng câu hỏi ở bước chọn lấy thật từ `/questions` (thay `mockBankQuestions`), truyền xuống 5 Selection component qua prop `bankQuestions`.
  - Chi tiết/sửa đề (route `/admin/exams/$examId`, [ExamDetail.tsx] + [useExamDetail.ts] + `ExamSectionCard`/`ExamPartEditor`): `GET /exam-sets/{id}` full tree; sửa title/description (`PATCH /exam-sets/{id}`); toggle-active; đổi `durationMinutes` từng section (`PATCH /exam-sections/{id}`); sửa `instruction` + upload/gán `audioUrl` chung part cho Listening P3/P4 (`PATCH /exam-parts/{id}`); gỡ câu hỏi (`DELETE`) + đổi thứ tự lên/xuống (`PATCH .../reorder`). Nút "xem" ở list mở trang này.
  - _Còn tồn_: gán thêm câu hỏi vào đề đã tạo từ màn chi tiết (mới có gỡ/sắp xếp); `mockData.ts` còn export thừa chưa dùng.

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
