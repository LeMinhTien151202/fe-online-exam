# AptisTest - Kiến trúc Cơ sở dữ liệu Toàn diện (Full Schema)

Tài liệu này đặc tả chi tiết 100% các trường dữ liệu cho mọi bảng trong hệ thống. Đảm bảo tính nhất quán, hỗ trợ 3 chế độ luyện tập độc lập và **Chấm điểm bằng AI**.

---

## 📂 1. PHÂN HỆ NGƯỜI DÙNG & PHÂN QUYỀN (AUTH & RBAC)

### 1.1. Bảng `users` (Tài khoản)

| Column        | Type             | Nullable | Description                    |
| :------------ | :--------------- | :------- | :----------------------------- |
| id            | UUID (PK)        | No       | Khóa chính.                    |
| email         | **VARCHAR(255)** | No       | Tài khoản đăng nhập (Unique).  |
| password_hash | VARCHAR(255)     | No       | Mật khẩu mã hóa.               |
| role          | VARCHAR(20)      | No       | 'ADMIN', 'TEACHER', 'STUDENT'. |
| status        | VARCHAR(20)      | No       | 'ACTIVE', 'LOCKED'.            |
| created_at    | TIMESTAMP        | No       | Thời gian tạo tài khoản.       |

### 1.2. Bảng `user_profiles` (Thông tin cá nhân)

| Column      | Type         | Nullable | Description             |
| :---------- | :----------- | :------- | :---------------------- |
| user_id     | UUID (FK)    | No       | Liên kết `users(id)`.   |
| full_name   | VARCHAR(100) | No       | Họ và tên.              |
| avatar_url  | TEXT         | Yes      | Đường dẫn ảnh đại diện. |
| target_date | DATE         | Yes      | Ngày thi dự kiến.       |
| aptis_goal  | VARCHAR(10)  | Yes      | 'B1', 'B2', 'C'.        |
| school_name | VARCHAR(255) | Yes      | Nơi học tập/công tác.   |

### 1.3. Bảng `system_menus` (Quản lý Sidebar)

| Column     | Type         | Nullable | Description                    |
| :--------- | :----------- | :------- | :----------------------------- |
| id         | SERIAL (PK)  | No       | Định danh menu.                |
| label      | VARCHAR(100) | No       | Tên hiển thị (vd: Luyện tập).  |
| path       | VARCHAR(255) | No       | Route (vd: /practice).         |
| icon       | VARCHAR(50)  | Yes      | Tên icon (Material Symbols).   |
| parent_id  | INT          | Yes      | ID menu cha (nếu là menu con). |
| sort_order | INT          | No       | Thứ tự sắp xếp.                |

### 1.4. Bảng `role_menu_access` (Phân quyền Menu)

| Column  | Type        | Nullable | Description                              |
| :------ | :---------- | :------- | :--------------------------------------- |
| role    | VARCHAR(20) | No       | Vai trò ('ADMIN', 'TEACHER', 'STUDENT'). |
| menu_id | INT (FK)    | No       | Liên kết `system_menus(id)`.             |

---

## 📂 2. PHÂN HỆ NGÂN HÀNG ĐỀ THI (EXAM BANK)

### 2.1. Bảng `skills` (Tham chiếu 5 kỹ năng)

| Column      | Type        | Nullable | Description                                               |
| :---------- | :---------- | :------- | :-------------------------------------------------------- |
| id          | INT (PK)    | No       | 1-Grammar, 2-Listening, 3-Reading, 4-Writing, 5-Speaking. |
| name        | VARCHAR(50) | No       | Tên kỹ năng.                                              |
| total_parts | INT         | No       | Số phần nhỏ (vd: Listening có 4 parts).                   |

### 2.2. Bảng `exam_sets` (Bộ đề chính)

| Column         | Type         | Nullable | Description                                     |
| :------------- | :----------- | :------- | :---------------------------------------------- |
| id             | UUID (PK)    | No       | Định danh.                                      |
| title          | VARCHAR(255) | No       | Tên bộ đề.                                      |
| description    | TEXT         | Yes      | Mô tả đề thi.                                   |
| type           | VARCHAR(30)  | No       | 'PART_PRACTICE', 'SKILL_FULL_SET', 'MOCK_TEST'. |
| skill_id       | INT (FK)     | Yes      | Liên kết kỹ năng (Null nếu Mock Test).          |
| part_number    | INT          | Yes      | Số Part (Nếu luyện Part lẻ).                    |
| is_active      | BOOLEAN      | No       | DEFAULT TRUE.                                   |
| **deleted_at** | TIMESTAMP    | Yes      | Dùng cho Soft Delete.                           |

### 2.3. Bảng `exam_sections` (Kỹ năng bên trong bộ đề)

| Column           | Type      | Nullable | Description                                 |
| :--------------- | :-------- | :------- | :------------------------------------------ |
| id               | UUID (PK) | No       | Định danh.                                  |
| exam_id          | UUID (FK) | No       | Thuộc bộ đề nào.                            |
| skill_id         | INT (FK)  | No       | Kỹ năng liên quan.                          |
| duration_minutes | INT       | No       | Thời gian làm bài cho kỹ năng này.          |
| order_index      | INT       | No       | Thứ tự thi (vd: 1-Grammar, 2-Listening...). |

### 2.4. Bảng `exam_parts` (Chi tiết từng Part)

| Column        | Type      | Nullable | Description                                             |
| :------------ | :-------- | :------- | :------------------------------------------------------ |
| id            | UUID (PK) | No       | Định danh.                                              |
| section_id    | UUID (FK) | No       | Thuộc kỹ năng nào trong đề.                             |
| part_number   | INT       | No       | Số thứ tự Part (1, 2, 3...).                            |
| instruction   | TEXT      | Yes      | Hướng dẫn làm bài.                                      |
| **audio_url** | TEXT      | Yes      | Link audio dùng chung cho toàn bộ Part (vd: Listening). |

### 2.5. Bảng `questions` (Câu hỏi)

| Column         | Type        | Nullable | Description                                         |
| :------------- | :---------- | :------- | :-------------------------------------------------- |
| id             | UUID (PK)   | No       | Định danh câu hỏi.                                  |
| part_id        | UUID (FK)   | No       | Thuộc Part nào.                                     |
| content        | TEXT        | Yes      | Nội dung chữ/câu hỏi.                               |
| media_url      | TEXT        | Yes      | Link audio hoặc ảnh minh họa.                       |
| question_type  | VARCHAR(30) | No       | 'MC' (Trắc nghiệm), 'RECORD' (Nói), 'ESSAY' (Viết). |
| **deleted_at** | TIMESTAMP   | Yes      | Dùng cho Soft Delete.                               |

### 2.6. Bảng `question_options` (Đáp án trắc nghiệm)

| Column      | Type      | Nullable | Description                |
| :---------- | :-------- | :------- | :------------------------- |
| id          | UUID (PK) | No       | Định danh.                 |
| question_id | UUID (FK) | No       | Thuộc câu hỏi nào.         |
| content     | TEXT      | No       | Nội dung đáp án.           |
| is_correct  | BOOLEAN   | No       | Có phải đáp án đúng không. |

---

## 📂 3. PHÂN HỆ KẾT QUẢ & CHẤM ĐIỂM AI (GRADES & ATTEMPTS)

### 3.1. Bảng `exam_attempts` (Phiên làm bài)

| Column          | Type         | Nullable | Description                                      |
| :-------------- | :----------- | :------- | :----------------------------------------------- |
| id              | UUID (PK)    | No       | ID bài làm.                                      |
| student_id      | UUID (FK)    | No       | Người thực hiện.                                 |
| exam_id         | UUID (FK)    | No       | Thực hiện đề nào.                                |
| mode            | VARCHAR(20)  | No       | Chế độ làm: 'PART', 'SKILL', 'FULL'.             |
| status          | VARCHAR(20)  | No       | 'IN_PROGRESS', 'SUBMITTED', 'EXPIRED'.           |
| total_score     | NUMERIC(5,2) | Yes      | Tổng điểm.                                       |
| started_at      | TIMESTAMP    | No       | Ngày giờ bắt đầu.                                |
| **finished_at** | TIMESTAMP    | Yes      | Tiêu chuẩn để tính thời gian và quản lý timeout. |

#### **3.2. Bảng `attempt_section_progress` (Theo dõi Resume bài thi)**

`PHỤC VỤ`: Tính năng resume bài khi sự cố mạng, quản lý bài thi dài 5 kỹ năng.
| Column | Type | Nullable | Description |
| :--- | :--- | :--- | :--- |
| id | UUID (PK) | No | Định danh. |
| attempt_id | UUID (FK) | No | Liên kết `exam_attempts`. |
| section_id | UUID (FK) | No | Liên kết kỹ năng `exam_sections`. |
| status | VARCHAR(20) | No | 'NOT_STARTED', 'IN_PROGRESS', 'COMPLETED'. |
| started_at | TIMESTAMP | Yes | Thời gian bắt đầu section. |
| completed_at | TIMESTAMP | Yes | Thời gian xong section. |

### 3.3. Bảng `attempt_details` (Câu trả lời chi tiết)

| Column                | Type         | Nullable | Description                                                           |
| :-------------------- | :----------- | :------- | :-------------------------------------------------------------------- |
| id                    | UUID (PK)    | No       | ID câu trả lời.                                                       |
| attempt_id            | UUID (FK)    | No       | Thuộc phiên làm bài nào.                                              |
| question_id           | UUID (FK)    | No       | Trả lời câu hỏi nào.                                                  |
| **question_snapshot** | JSONB        | No       | **Snapshot câu hỏi lúc làm bài** (Bảo toàn dữ liệu khi Admin sửa đề). |
| answer_text           | TEXT         | Yes      | Đáp án viết.                                                          |
| audio_url             | TEXT         | Yes      | Link bản ghi âm nói.                                                  |
| is_correct            | BOOLEAN      | Yes      | Cho trắc nghiệm.                                                      |
| score_earned          | NUMERIC(5,2) | Yes      | Điểm câu này.                                                         |

### 3.4. Bảng `ai_grading_results` (Kết quả AI chấm Writing/Speaking)

| Column                | Type         | Nullable | Description                                        |
| :-------------------- | :----------- | :------- | :------------------------------------------------- |
| id                    | UUID (PK)    | No       | Định danh.                                         |
| attempt_detail_id     | UUID (FK)    | No       | Liên kết câu trả lời Writing/Speaking.             |
| **grading_status**    | VARCHAR(20)  | No       | **PENDING, COMPLETED, FAILED** (Quản lý Queue AI). |
| fluency_score         | NUMERIC(4,2) | Yes      | Điểm trôi chảy.                                    |
| grammar_score         | NUMERIC(4,2) | Yes      | Điểm ngữ pháp.                                     |
| vocabulary_score      | NUMERIC(4,2) | Yes      | Điểm từ vựng.                                      |
| coherence_score       | NUMERIC(4,2) | Yes      | Điểm mạch lạc.                                     |
| ai_feedback           | TEXT         | Yes      | Nhận xét chi tiết từ AI.                           |
| suggested_improvement | TEXT         | Yes      | Gợi ý sửa bài.                                     |

---

## 📂 4. PHÂN HỆ TIẾN ĐỘ & PHỤ TRỢ

### 4.1. Bảng `student_part_progress` (Tiến độ theo Part)

| Column                 | Type      | Nullable | Description                            |
| :--------------------- | :-------- | :------- | :------------------------------------- |
| student_id             | UUID (FK) | No       | ID học viên.                           |
| skill_id               | INT (FK)  | No       | ID kỹ năng (1-5).                      |
| part_number            | INT       | No       | Part 1, 2, 3...                        |
| **questions_answered** | INT       | No       | Số câu hỏi độc lập đã hoàn thành.      |
| **sessions_count**     | INT       | No       | Số lần học viên đã luyện tập Part này. |
| last_practiced_at      | TIMESTAMP | No       | Lần luyện tập gần nhất.                |

### 4.2. Bảng `student_skill_progress` (Tiến độ Bộ đề & Thi thử)

| Column         | Type         | Nullable | Description                                                     |
| :------------- | :----------- | :------- | :-------------------------------------------------------------- |
| student_id     | UUID (FK)    | No       | ID học viên.                                                    |
| skill_id       | INT (FK)     | No       | ID kỹ năng.                                                     |
| sets_completed | INT          | No       | Số bộ đề full kỹ năng đã xong.                                  |
| overall_avg    | NUMERIC(5,2) | Yes      | Điểm trung bình (CHỈ tính cho các bài Thi thử hoặc Bộ đề Full). |
| last_updated   | TIMESTAMP    | No       | Ngày cập nhật tiến độ.                                          |

### 4.3. Bảng `learning_streaks` (Chuỗi học tập)

| Column             | Type          | Nullable | Description                       |
| :----------------- | :------------ | :------- | :-------------------------------- |
| student_id         | UUID (PK, FK) | No       | ID học viên.                      |
| current_streak     | INT           | No       | Chuỗi hiện tại (ngày).            |
| **longest_streak** | INT           | No       | Kỷ lục chuỗi ngày học nhiều nhất. |
| last_activity      | DATE          | No       | Ngày gần nhất học tập.            |

### 4.4. Bảng `study_logs` (Nhật ký học tập)

| Column        | Type           | Nullable | Description                                  |
| :------------ | :------------- | :------- | :------------------------------------------- |
| id            | BIGSERIAL (PK) | No       | ID nhật ký.                                  |
| user_id       | UUID (FK)      | No       | Học viên nào.                                |
| **mode**      | VARCHAR(20)    | No       | 'PART', 'SKILL', 'FULL' (Phân tích hành vi). |
| minutes_spent | INT            | No       | Thời gian luyện tập (phút).                  |
| activity_at   | TIMESTAMP      | No       | Thời điểm thực hiện.                         |

### 4.5. Bảng `study_materials` (Tài liệu học tập)

| Column               | Type         | Nullable | Description                |
| :------------------- | :----------- | :------- | :------------------------- |
| id                   | UUID (PK)    | No       | ID tài liệu.               |
| title                | VARCHAR(255) | No       | Tiêu đề.                   |
| file_url             | TEXT         | No       | Link tài liệu (PDF/Video). |
| **file_type**        | VARCHAR(20)  | No       | 'PDF', 'VIDEO'.            |
| **duration_seconds** | INT          | Yes      | Thời lượng nếu là Video.   |
| skill_id             | INT (FK)     | Yes      | Gắn với kỹ năng nào.       |
| teacher_id           | UUID (FK)    | No       | Người upload.              |
| **deleted_at**       | TIMESTAMP    | Yes      | Dùng cho Soft Delete.      |

### 4.6. Bảng `notifications` (Thông báo)

| Column                | Type         | Nullable | Description                                |
| :-------------------- | :----------- | :------- | :----------------------------------------- |
| id                    | UUID (PK)    | No       | ID thông báo.                              |
| receiver_id           | UUID (FK)    | Yes      | Người nhận (Null = Toàn hệ thống).         |
| **notification_type** | VARCHAR(50)  | No       | 'SYSTEM', 'EXAM_REMINDER', 'GRADE_RESULT'. |
| title                 | VARCHAR(200) | No       | Tiêu đề.                                   |
| message               | TEXT         | No       | Nội dung.                                  |
| is_read               | BOOLEAN      | No       | Đã đọc chưa.                               |

### 4.7. Bảng `system_settings` (Cấu hình)

| Column        | Type              | Nullable | Description                    |
| :------------ | :---------------- | :------- | :----------------------------- |
| setting_key   | VARCHAR(100) (PK) | No       | Khóa cấu hình (vd: MOCK_TIME). |
| setting_value | TEXT              | No       | Giá trị cấu hình.              |

---

## ⚡ OPTIMIZATION & INDEXES

Để hệ thống vận hành mượt mà với lượng dữ liệu lớn, cần đánh Index cho các truy vấn sau:

1.  **Tiến độ**: `(student_id, skill_id)` trên các bảng Progress.
2.  **Lịch sử bài làm**: `(student_id, status)` trên `exam_attempts`.
3.  **Học tập**: `(user_id, activity_at)` trên `study_logs`.
4.  **Thông báo**: `(receiver_id, is_read)` để load nhanh danh sách chưa đọc.
