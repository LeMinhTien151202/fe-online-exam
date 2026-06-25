-- ============================================================
-- APTISTEST — FULL DATABASE SCHEMA (Final Version)
-- Thay đổi so với draft cũ:
--   1. Thêm extra_config JSONB vào bảng questions
--   2. Mở rộng question_type ENUM (thêm 4 loại mới)
--   3. Thêm comment minh họa extra_config cho từng loại câu hỏi
-- ============================================================


-- ============================================================
-- PHÂN HỆ 1: NGƯỜI DÙNG & PHÂN QUYỀN (AUTH & RBAC)
-- ============================================================

CREATE TABLE users (
    id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email         VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    role          VARCHAR(20)  NOT NULL CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT')),
    status        VARCHAR(20)  NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'LOCKED')),
    created_at    TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE user_profiles (
    user_id     UUID         PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    full_name   VARCHAR(100) NOT NULL,
    avatar_url  TEXT,
    target_date DATE,
    aptis_goal  VARCHAR(10)  CHECK (aptis_goal IN ('B1', 'B2', 'C')),
    school_name VARCHAR(255)
);

CREATE TABLE system_menus (
    id         SERIAL       PRIMARY KEY,
    label      VARCHAR(100) NOT NULL,
    path       VARCHAR(255) NOT NULL,
    icon       VARCHAR(50),
    parent_id  INT          REFERENCES system_menus(id),
    sort_order INT          NOT NULL DEFAULT 0
);

CREATE TABLE role_menu_access (
    role    VARCHAR(20) NOT NULL CHECK (role IN ('ADMIN', 'TEACHER', 'STUDENT')),
    menu_id INT         NOT NULL REFERENCES system_menus(id) ON DELETE CASCADE,
    PRIMARY KEY (role, menu_id)
);


-- ============================================================
-- PHÂN HỆ 2: NGÂN HÀNG ĐỀ THI (EXAM BANK)
-- ============================================================

CREATE TABLE skills (
    id           INT          PRIMARY KEY,  -- 1-Grammar, 2-Listening, 3-Reading, 4-Writing, 5-Speaking
    name         VARCHAR(50)  NOT NULL,
    total_parts  INT          NOT NULL
);

INSERT INTO skills VALUES
    (1, 'Grammar & Vocabulary', 2),  -- 2 section: Grammatical + Vocabulary
    (2, 'Listening',            4),
    (3, 'Reading',              4),
    (4, 'Writing',              4),
    (5, 'Speaking',             4);

CREATE TABLE exam_sets (
    id          UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title       VARCHAR(255) NOT NULL,
    description TEXT,
    type        VARCHAR(30)  NOT NULL CHECK (type IN ('PART_PRACTICE', 'SKILL_FULL_SET', 'MOCK_TEST')),
    skill_id    INT          REFERENCES skills(id),   -- NULL nếu MOCK_TEST
    part_number INT,                                   -- NULL nếu không luyện part lẻ
    is_active   BOOLEAN      NOT NULL DEFAULT TRUE,
    deleted_at  TIMESTAMP                              -- Soft delete
);

CREATE TABLE exam_sections (
    id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    exam_id           UUID NOT NULL REFERENCES exam_sets(id) ON DELETE CASCADE,
    skill_id          INT  NOT NULL REFERENCES skills(id),
    duration_minutes  INT  NOT NULL,
    order_index       INT  NOT NULL   -- 1-Grammar, 2-Listening, 3-Reading, 4-Writing, 5-Speaking
);

CREATE TABLE exam_parts (
    id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    section_id  UUID NOT NULL REFERENCES exam_sections(id) ON DELETE CASCADE,
    part_number INT  NOT NULL,   -- 1, 2, 3, 4
    instruction TEXT,
    audio_url   TEXT             -- Audio dùng chung cho toàn Part (Listening Part 3 & 4)
);

-- ─────────────────────────────────────────────────────────────
-- Bảng questions — trung tâm của toàn bộ nội dung bài thi
-- ─────────────────────────────────────────────────────────────
CREATE TABLE questions (
    id            UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    part_id       UUID         NOT NULL REFERENCES exam_parts(id) ON DELETE CASCADE,
    content       TEXT,                   -- Nội dung câu hỏi / đề bài
    media_url     TEXT,                   -- Ảnh hoặc audio riêng của câu hỏi
    question_type VARCHAR(30)  NOT NULL CHECK (question_type IN (
        'MC',             -- Trắc nghiệm A/B/C (Grammar, Listening P1/P3/P4, Reading P1)
        'ORDERING',       -- Kéo thả sắp xếp câu (Reading P2)
        'WORD_BANK',      -- Điền từ từ pool có đáp án nhiễu (Reading P3, Vocab Task 1-3-5)
        'HEADING_MATCH',  -- Ghép tiêu đề đoạn văn (Reading P4)
        'SPEAKER_MATCH',  -- Ghép speaker với ý kiến (Listening P2)
        'ESSAY',          -- Viết tự do (Writing P1-2-3-4)
        'RECORD'          -- Ghi âm nói (Speaking P1-2-3-4)
    )),

    -- ─────────────────────────────────────────────────────────
    -- extra_config: metadata đặc thù theo từng question_type
    -- Xem chi tiết từng schema bên dưới
    -- ─────────────────────────────────────────────────────────
    extra_config  JSONB,

    deleted_at    TIMESTAMP                -- Soft delete
);

/*
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
CẤU TRÚC extra_config THEO TỪNG question_type
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

1. question_type = 'MC'  (Grammar/Listening/Reading P1)
   Dùng bảng question_options, extra_config = NULL

   Ví dụ: Grammar câu 5 — "She ___ in Paris for 3 years."
   extra_config: null

──────────────────────────────────────────────────────────────

2. question_type = 'ORDERING'  (Reading Part 2)
   options_pool : mảng các câu văn bị xáo trộn (6 câu)
   correct_order: thứ tự index đúng của các câu trên
   fixed_first  : true nếu câu đầu tiên đã cố định sẵn (đặc trưng Reading P2)

   Ví dụ: Reading P2 — sắp xếp tiểu sử Marie Curie
   extra_config:
   {
     "fixed_first": true,
     "options_pool": [
       "She was born in Warsaw in 1867.",
       "At the age of 24, she moved to Paris to study science.",
       "In 1903, she became the first woman to win a Nobel Prize.",
       "Her discoveries in radioactivity changed modern physics forever.",
       "She passed away in 1934, leaving a lasting scientific legacy."
     ],
     "correct_order": [0, 1, 2, 3, 4]
   }

──────────────────────────────────────────────────────────────

3. question_type = 'WORD_BANK'  (Reading P3, Vocab Task 1/2/3/5)
   options_pool   : toàn bộ từ cho sẵn (10 từ cho 7 chỗ, 3 từ nhiễu)
   slots          : mảng các chỗ trống, mỗi slot có id và đáp án đúng
   task_variant   : phân biệt các dạng task Vocabulary
                    'DEFINITION' | 'COLLOCATION' | 'SENTENCE' | 'SYNONYM' | 'ANTONYM'

   Ví dụ: Reading P3 — điền 7/10 từ vào đoạn văn về văn hóa
   extra_config:
   {
     "task_variant": "SENTENCE",
     "options_pool": [
       "ancient", "diverse", "exported", "reflected",
       "traditional", "globally", "abandoned", "preserved",
       "influenced", "modern"
     ],
     "slots": [
       { "slot_id": "s1", "correct_answer": "ancient" },
       { "slot_id": "s2", "correct_answer": "diverse" },
       { "slot_id": "s3", "correct_answer": "exported" },
       { "slot_id": "s4", "correct_answer": "traditional" },
       { "slot_id": "s5", "correct_answer": "globally" },
       { "slot_id": "s6", "correct_answer": "preserved" },
       { "slot_id": "s7", "correct_answer": "influenced" }
     ]
   }

──────────────────────────────────────────────────────────────

4. question_type = 'HEADING_MATCH'  (Reading Part 4)
   Mỗi câu hỏi đại diện cho 1 đoạn văn (A–G).
   headings_pool : 8 tiêu đề cho sẵn (1 tiêu đề thừa/nhiễu)
   correct_heading: tiêu đề đúng cho đoạn văn này

   Ví dụ: Đoạn văn C về tác động kinh tế của du lịch
   extra_config:
   {
     "paragraph_label": "C",
     "correct_heading": "The economic benefits of cultural tourism",
     "headings_pool": [
       "The economic benefits of cultural tourism",
       "How tourism damages local communities",
       "A brief history of international travel",
       "The role of technology in modern tourism",
       "Environmental threats caused by visitors",
       "How governments regulate tourism industries",
       "The rise of eco-friendly travel options",
       "Famous tourist destinations around the world"
     ]
   }

   Lưu ý: headings_pool giống nhau cho tất cả 7 câu trong cùng 1 Part.
   FE chỉ cần load 1 lần, gộp từ bất kỳ câu nào trong Part đó.

──────────────────────────────────────────────────────────────

5. question_type = 'SPEAKER_MATCH'  (Listening Part 2)
   Mỗi câu hỏi đại diện cho 1 speaker (Speaker 1–4).
   opinions_pool : 6 ý kiến (A–F), chọn 4 đúng
   correct_opinion: option key đúng cho speaker này

   Ví dụ: Speaker 2 nói về kỳ nghỉ
   extra_config:
   {
     "speaker_index": 2,
     "correct_opinion": "B",
     "opinions_pool": [
       { "key": "A", "text": "They prefer travelling alone to group tours." },
       { "key": "B", "text": "They enjoyed the food more than the scenery." },
       { "key": "C", "text": "They found the trip more expensive than expected." },
       { "key": "D", "text": "They plan to visit the same place again next year." },
       { "key": "E", "text": "They were disappointed by the accommodation." },
       { "key": "F", "text": "They prefer coastal destinations to mountain areas." }
     ]
   }

   Lưu ý: opinions_pool giống nhau cho cả 4 speaker trong cùng 1 Part.
   FE load 1 lần từ bất kỳ câu nào trong Part đó.

──────────────────────────────────────────────────────────────

6. question_type = 'ESSAY'  (Writing Part 1-2-3-4)
   word_limit_min : số từ tối thiểu bắt buộc (validate FE + AI grading)
   word_limit_max : số từ tối đa
   register_type  : 'FORMAL' | 'INFORMAL' | null
                    (Writing P4: Task 1 = INFORMAL, Task 2 = FORMAL)
   speaker_name   : tên nhân vật hiển thị trong chat UI
                    (Writing P3: 'Member A' | 'Member B' | 'Member C')
   task_label     : nhãn task hiển thị cho user ('Task 1' | 'Task 2' | null)

   Ví dụ Writing P1 — điền từ ngắn:
   extra_config:
   { "word_limit_min": 1, "word_limit_max": 5 }

   Ví dụ Writing P3 — chat room:
   extra_config:
   {
     "speaker_name": "Member B",
     "word_limit_min": 30,
     "word_limit_max": 40
   }

   Ví dụ Writing P4 Task 2 — email trang trọng:
   extra_config:
   {
     "task_label": "Task 2",
     "register_type": "FORMAL",
     "word_limit_min": 120,
     "word_limit_max": 150
   }

──────────────────────────────────────────────────────────────

7. question_type = 'RECORD'  (Speaking Part 1-2-3-4)
   response_time_seconds: thời gian thu âm (30s / 45s / 120s)
   prep_time_seconds    : thời gian chuẩn bị trước khi nói
                          (chỉ Part 4 mới có = 60s, các Part khác = 0)
   image_count          : số ảnh kèm theo (Part 2 = 1, Part 3 = 2, Part 1/4 = 0)
   question_group_id    : UUID dùng để nhóm 3 câu của Speaking Part 4
                          lại thành 1 prompt (3 câu hiển thị đồng thời,
                          1 audio duy nhất cho cả nhóm)

   Ví dụ Speaking P1 — câu hỏi cá nhân:
   extra_config:
   { "response_time_seconds": 30, "prep_time_seconds": 0, "image_count": 0 }

   Ví dụ Speaking P3 — so sánh 2 ảnh:
   extra_config:
   { "response_time_seconds": 45, "prep_time_seconds": 0, "image_count": 2 }

   Ví dụ Speaking P4 — câu 1 trong nhóm 3 câu:
   extra_config:
   {
     "response_time_seconds": 120,
     "prep_time_seconds": 60,
     "image_count": 0,
     "question_group_id": "550e8400-e29b-41d4-a716-446655440000"
   }

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
*/

-- GV, Admin vẫn dùng question_options như cũ cho câu MC
CREATE TABLE question_options (
    id          UUID    PRIMARY KEY DEFAULT gen_random_uuid(),
    question_id UUID    NOT NULL REFERENCES questions(id) ON DELETE CASCADE,
    content     TEXT    NOT NULL,
    is_correct  BOOLEAN NOT NULL
);


-- ============================================================
-- PHÂN HỆ 3: KẾT QUẢ & CHẤM ĐIỂM AI (GRADES & ATTEMPTS)
-- ============================================================

CREATE TABLE exam_attempts (
    id           UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    student_id   UUID          NOT NULL REFERENCES users(id),
    exam_id      UUID          NOT NULL REFERENCES exam_sets(id),
    mode         VARCHAR(20)   NOT NULL CHECK (mode IN ('PART', 'SKILL', 'FULL')),
    status       VARCHAR(20)   NOT NULL DEFAULT 'IN_PROGRESS'
                               CHECK (status IN ('IN_PROGRESS', 'SUBMITTED', 'EXPIRED')),
    total_score  NUMERIC(5,2),
    started_at   TIMESTAMP     NOT NULL DEFAULT NOW(),
    finished_at  TIMESTAMP
);

CREATE TABLE attempt_section_progress (
    id           UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id   UUID        NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
    section_id   UUID        NOT NULL REFERENCES exam_sections(id),
    status       VARCHAR(20) NOT NULL DEFAULT 'NOT_STARTED'
                             CHECK (status IN ('NOT_STARTED', 'IN_PROGRESS', 'COMPLETED')),
    started_at   TIMESTAMP,
    completed_at TIMESTAMP
);

CREATE TABLE attempt_details (
    id                UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_id        UUID          NOT NULL REFERENCES exam_attempts(id) ON DELETE CASCADE,
    question_id       UUID          NOT NULL REFERENCES questions(id),
    question_snapshot JSONB         NOT NULL,   -- Snapshot câu hỏi lúc làm bài (bảo toàn khi Admin sửa đề)
    answer_text       TEXT,                     -- Đáp án text (ESSAY / WORD_BANK / ORDERING / HEADING_MATCH)
    answer_json       JSONB,                    -- Đáp án có cấu trúc (ORDERING: [2,0,3,1,4], SPEAKER_MATCH: "B")
    audio_url         TEXT,                     -- Link bản ghi âm (RECORD)
    is_correct        BOOLEAN,                  -- Cho các dạng có đáp án rõ ràng (MC, ORDERING, ...)
    score_earned      NUMERIC(5,2)
);

/*
  Lưu ý answer_json dùng cho các dạng bài cần cấu trúc:
  - ORDERING       : [2, 0, 3, 1, 4]               (thứ tự index do học viên chọn)
  - SPEAKER_MATCH  : "B"                            (option key được chọn)
  - HEADING_MATCH  : "The economic benefits of..."  (heading được chọn)
  - WORD_BANK      : { "s1": "ancient", "s2": "diverse", ... }
*/

CREATE TABLE ai_grading_results (
    id                   UUID          PRIMARY KEY DEFAULT gen_random_uuid(),
    attempt_detail_id    UUID          NOT NULL REFERENCES attempt_details(id) ON DELETE CASCADE,
    grading_status       VARCHAR(20)   NOT NULL DEFAULT 'PENDING'
                                       CHECK (grading_status IN ('PENDING', 'COMPLETED', 'FAILED')),
    fluency_score        NUMERIC(4,2),
    grammar_score        NUMERIC(4,2),
    vocabulary_score     NUMERIC(4,2),
    coherence_score      NUMERIC(4,2),
    register_score       NUMERIC(4,2),  -- Thêm mới: chấm văn phong cho Writing P4 FORMAL/INFORMAL
    ai_feedback          TEXT,
    suggested_improvement TEXT
);


-- ============================================================
-- PHÂN HỆ 4: TIẾN ĐỘ & PHỤ TRỢ
-- ============================================================

CREATE TABLE student_part_progress (
    student_id         UUID      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id           INT       NOT NULL REFERENCES skills(id),
    part_number        INT       NOT NULL,
    questions_answered INT       NOT NULL DEFAULT 0,
    sessions_count     INT       NOT NULL DEFAULT 0,
    last_practiced_at  TIMESTAMP NOT NULL DEFAULT NOW(),
    PRIMARY KEY (student_id, skill_id, part_number)
);

CREATE TABLE student_skill_progress (
    student_id    UUID          NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    skill_id      INT           NOT NULL REFERENCES skills(id),
    sets_completed INT          NOT NULL DEFAULT 0,
    overall_avg   NUMERIC(5,2),
    last_updated  TIMESTAMP     NOT NULL DEFAULT NOW(),
    PRIMARY KEY (student_id, skill_id)
);

CREATE TABLE learning_streaks (
    student_id      UUID NOT NULL PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    current_streak  INT  NOT NULL DEFAULT 0,
    longest_streak  INT  NOT NULL DEFAULT 0,
    last_activity   DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE study_logs (
    id            BIGSERIAL    PRIMARY KEY,
    user_id       UUID         NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    mode          VARCHAR(20)  NOT NULL CHECK (mode IN ('PART', 'SKILL', 'FULL')),
    minutes_spent INT          NOT NULL,
    activity_at   TIMESTAMP    NOT NULL DEFAULT NOW()
);

CREATE TABLE study_materials (
    id               UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    title            VARCHAR(255) NOT NULL,
    file_url         TEXT         NOT NULL,
    file_type        VARCHAR(20)  NOT NULL CHECK (file_type IN ('PDF', 'VIDEO')),
    duration_seconds INT,
    skill_id         INT          REFERENCES skills(id),
    teacher_id       UUID         NOT NULL REFERENCES users(id),
    deleted_at       TIMESTAMP
);

CREATE TABLE notifications (
    id                UUID         PRIMARY KEY DEFAULT gen_random_uuid(),
    receiver_id       UUID         REFERENCES users(id) ON DELETE CASCADE,  -- NULL = toàn hệ thống
    notification_type VARCHAR(50)  NOT NULL CHECK (notification_type IN ('SYSTEM', 'EXAM_REMINDER', 'GRADE_RESULT')),
    title             VARCHAR(200) NOT NULL,
    message           TEXT         NOT NULL,
    is_read           BOOLEAN      NOT NULL DEFAULT FALSE
);

CREATE TABLE system_settings (
    setting_key   VARCHAR(100) PRIMARY KEY,
    setting_value TEXT         NOT NULL
);


-- ============================================================
-- INDEXES
-- ============================================================

-- Tiến độ học tập
CREATE INDEX idx_part_progress_student      ON student_part_progress  (student_id, skill_id);
CREATE INDEX idx_skill_progress_student     ON student_skill_progress  (student_id, skill_id);

-- Lịch sử bài làm
CREATE INDEX idx_attempts_student_status    ON exam_attempts           (student_id, status);

-- Nhật ký học tập
CREATE INDEX idx_study_logs_user_date       ON study_logs              (user_id, activity_at);

-- Thông báo chưa đọc
CREATE INDEX idx_notifications_receiver     ON notifications            (receiver_id, is_read);

-- Tìm câu hỏi theo part
CREATE INDEX idx_questions_part             ON questions                (part_id);

-- Tìm bài làm theo attempt (thường dùng nhất trong grading)
CREATE INDEX idx_attempt_details_attempt    ON attempt_details          (attempt_id);

-- AI grading queue (lọc PENDING để xử lý)
CREATE INDEX idx_ai_grading_status          ON ai_grading_results       (grading_status)
    WHERE grading_status = 'PENDING';

-- JSONB index cho extra_config (tăng tốc query theo question_type đặc thù)
CREATE INDEX idx_questions_extra_config     ON questions USING GIN (extra_config);