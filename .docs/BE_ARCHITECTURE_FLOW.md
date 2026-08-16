# Kiến trúc & Luồng đi của Backend (BE_ARCHITECTURE_FLOW)

> Repo backend: `D:\be-exam-online\java-exam-online` (TÁCH khỏi frontend `D:\react-exam-online`).
> Mọi đường dẫn trong tài liệu này tính từ gốc repo backend.
> Tài liệu này mô tả **luồng chạy của code**. Danh sách endpoint chi tiết xem `.docs/API_PLAN.md` (repo FE).

---

## 1. Stack & thông số nền

| Hạng mục | Giá trị | Nguồn |
|---|---|---|
| Ngôn ngữ / Runtime | Java 21 | `pom.xml` |
| Framework | Spring Boot 4.1.0 (Spring MVC, servlet) | `pom.xml` |
| Bảo mật | Spring Security + OAuth2 Resource Server (JWT HS256) + OAuth2 Client (Google) | `config/SecurityConfiguration.java` |
| Dữ liệu | PostgreSQL + Spring Data JPA (Hibernate) | `application.yml` |
| Migration | Flyway (`classpath:db/migration`, `ddl-auto: validate`) | `application.yml` |
| Cache/Store phụ | Redis (tùy chọn: rate limit, OTP) | `application.yml` |
| Lưu file | Local disk hoặc S3 (đổi bằng `STORAGE_DRIVER`) | `storage/infrastructure/*` |
| AI | Gemini HTTP API + chuỗi ASR (Whisper local/Groq) | `grading/infrastructure/*` |
| Quan trắc | Actuator + Micrometer/Prometheus + Correlation ID | `common/observability/*` |
| Tài liệu API | springdoc-openapi → `/swagger-ui.html` | `config/OpenApiConfiguration.java` |
| Cổng & prefix | `:6969`, context path `/api/v1` | `application.yml` (`server.port`, `spring.mvc.servlet.path`) |

---

## 2. Kiểu kiến trúc: Modular Monolith + Package-by-Feature

Không chia theo kỹ thuật (`controllers/`, `services/`, `repositories/`) mà chia theo **nghiệp vụ**. Mỗi module là một "lát cắt dọc" độc lập dưới `src/main/java/com/examonline/`:

```
com.examonline
├── auth/          # Đăng nhập, refresh, OTP quên mật khẩu, Google OAuth
├── user/          # CRUD người dùng (Admin)
├── profile/       # Hồ sơ cá nhân của chính mình
├── question/      # Ngân hàng câu hỏi
├── exam/          # Bộ đề, section, part, luồng học viên làm & NỘP BÀI
├── attempt/       # Lịch sử làm bài
├── grading/       # Chấm tự động + chấm AI (Gemini) + ASR
├── progress/      # Tiến độ, chuỗi ngày học (streak)
├── study/         # Tài liệu học
├── faq/           # Góc giải đáp
├── notification/  # Thông báo
├── dashboard/     # Thống kê cho Admin
├── setting/       # Cấu hình hệ thống
├── skill/         # Danh mục 5 kỹ năng
├── storage/       # Upload/xoá file (ảnh, audio)
├── common/        # Envelope, exception handler, rate limit, correlation id, security helper
└── config/        # Toàn bộ @Configuration + @ConfigurationProperties
```

### 2.1. Bốn tầng bên trong mỗi module

Đây là **quy ước quan trọng nhất** của backend — mọi module đều lặp lại đúng 4 thư mục này:

```
<module>/
├── api/              # TẦNG VÀO — Controller + DTO
│   ├── XxxController.java
│   ├── request/      # DTO nhận vào (record + @Valid)
│   └── response/     # DTO trả ra (record + factory .from(entity))
├── application/      # TẦNG ĐIỀU PHỐI — Use case, @Service, @Transactional
├── domain/           # TẦNG NGHIỆP VỤ — @Entity, enum, Policy (luật thuần, không phụ thuộc Spring)
└── infrastructure/   # TẦNG RA — Repository JPA, adapter gọi hệ thống ngoài
```

**Chiều phụ thuộc bắt buộc:** `api` → `application` → `domain` ← `infrastructure`.
`domain` KHÔNG được biết gì về `api`/`infrastructure`. Đây là biến thể nhẹ của **Hexagonal (Ports & Adapters)**: khi cần hệ thống ngoài, `application` khai báo một **interface (port)**, còn `infrastructure` viết **adapter** hiện thực nó.

Ví dụ rõ nhất — chấm AI:

| Vai trò | File |
|---|---|
| Port (interface) | `grading/application/AiGradingPort.java` |
| Adapter thật | `grading/infrastructure/GeminiAiGradingAdapter.java` |
| Adapter dự phòng | `grading/infrastructure/ManualReviewAiGradingAdapter.java` |
| Port ASR | `grading/application/SpeechToTextPort.java` |
| Adapter ASR | `FallbackSpeechToText` → `WhisperSidecarProvider` / `GroqTranscriptionProvider` |

Nhờ vậy `ExamSubmissionService` chỉ phụ thuộc `AiGradingPort` — tắt Gemini (`GEMINI_ENABLED=false`) thì Spring nạp adapter "chuyển chấm tay", code nghiệp vụ **không đổi một dòng**.

Tương tự với file: `storage/domain/StoragePort.java` ← `LocalStorageAdapter` hoặc `S3StorageAdapter`.

---

## 3. Vòng đời một HTTP request

```
Client (React)
   │  POST /api/v1/exams/12/submit   +  Authorization: Bearer <access_token>
   ▼
[1] CorsFilter                      ← cấu hình ở corsConfigurationSource(), chỉ cho origin trong CORS_ALLOWED_ORIGINS
[2] CookieCsrfProtectionFilter      ← chặn request dùng cookie refresh đến từ Origin lạ
[3] CorrelationIdFilter             ← sinh/nhận X-Correlation-ID, nhét vào MDC để log truy vết
[4] BearerTokenAuthenticationFilter ← giải mã & xác thực JWT (JwtDecoder), dựng Authentication
[5] HttpRateLimitFilter             ← đếm request theo nhóm (auth/upload/submit/gemini), vượt -> 429
[6] FilterSecurityInterceptor       ← .authorizeHttpRequests(): public hay phải authenticated
   ▼
[7] DispatcherServlet → @RestController
[8] @PreAuthorize                   ← RBAC theo vai trò (MethodSecurityConfiguration)
[9] @Valid                          ← Bean Validation trên DTO request
   ▼
[10] ApplicationService (@Transactional)  ← use case: điều phối, mở transaction
[11] Domain (Entity + Policy)             ← luật nghiệp vụ thuần
[12] Repository (Spring Data JPA)         ← sinh SQL, nói chuyện PostgreSQL
   ▼
[13] Response DTO .from(entity)
[14] ApiResponse.success(...)             ← BỌC envelope thống nhất
   ▼
Client  ← 201 { code, success, message, messages, data, metaData }
```

Nếu bất kỳ bước nào ném exception → `GlobalExceptionHandler` (`@RestControllerAdvice`) bắt và đổi thành `ApiErrorResponse` với đúng HTTP status.

### 3.1. Đọc kỹ từng tầng qua ví dụ `GET /api/v1/users?page=1&limit=10`

**Tầng api** — `user/api/UserController.java`:

```java
@RestController
@RequestMapping("/users")
@PreAuthorize("hasRole('ADMIN')")     // RBAC đặt ở CẤP CLASS -> mọi method đều chỉ ADMIN
public class UserController {

    @GetMapping
    public ApiResponse<List<AdminUserResponse>> findAll(
            @RequestParam(defaultValue = "1") @Min(1) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(500) int limit, ...) {
        var result = userService.findAll(page, limit, role, status, search);
        return ApiResponse.success(HttpStatus.OK, "Lấy danh sách người dùng thành công",
                                   result.users(), result.metadata());
    }
}
```

Controller **chỉ làm 3 việc**: nhận & validate tham số, gọi 1 service, bọc kết quả vào envelope. Không có `if` nghiệp vụ, không đụng repository.

**Tầng application** — `user/application/UserApplicationService.java`: `@Service`, `@Transactional`, dựng `Specification` + `PageRequest`, gọi repository, map entity → DTO, tính `PageMetadata.of(page, limit, total)`. Lỗi nghiệp vụ ném `ApiException(HttpStatus.X, "thông điệp tiếng Việt")`.

**Tầng domain** — `user/domain/UserEntity.java`, `Role`, `UserStatus`. Các luật phức tạp tách thành class `*Policy` thuần (không Spring): `ExamStructurePolicy`, `ExamQuestionAssignmentPolicy`, `SubmissionAnswerPolicy`, `OverallCefrPolicy`, `MediaUploadPolicy`…

**Tầng infrastructure** — `user/infrastructure/UserRepository.java`: `extends JpaRepository<UserEntity, Integer>, JpaSpecificationExecutor<...>`.

---

## 4. Chuẩn giao tiếp: envelope & lỗi

### 4.1. Thành công — `common/api/ApiResponse.java`

Mọi response thành công đều là record 6 trường:

```json
{
  "code": 200,
  "success": true,
  "message": "Lấy danh sách người dùng thành công",
  "messages": [],
  "data": [ ... ],
  "metaData": { "page": 1, "pageSize": 10, "total": 87, "totalPage": 9 }
}
```

`metaData` chỉ khác `null` ở API phân trang (`PageMetadata.of()` tự tính `totalPage`).
→ FE khai thác chỗ này bằng cờ `_rawEnvelope`, xem `.docs/FE_ARCHITECTURE_FLOW.md` mục 4.2.

### 4.2. Lỗi — `common/error/GlobalExceptionHandler.java`

| Exception | HTTP | Thông điệp |
|---|---|---|
| `ApiException` | tự khai báo | message do service đặt |
| `MethodArgumentNotValidException` | 400 | gộp danh sách lỗi field |
| `ConstraintViolationException` | 400 | danh sách vi phạm |
| `HttpMessageNotReadableException` | 400 | "Nội dung request không đúng định dạng" |
| `MaxUploadSizeExceededException` | 400 | "File tải lên vượt quá dung lượng cho phép" |
| `AuthenticationException` | 401 | "Chưa xác thực hoặc phiên đăng nhập không hợp lệ" |
| `AccessDeniedException` | 403 | "Bạn không có quyền thực hiện thao tác này" |
| `OptimisticLockingFailureException` / `DataAccessException` | 409 / 500 | xung đột / lỗi hệ thống |

Handler còn đẩy metric qua `MeterRegistry` để đếm lỗi theo loại. `server.error.include-stacktrace: never` → không rò rỉ stacktrace ra client.

> **Quy ước then chốt:** message trả về là **tiếng Việt, hướng người dùng cuối** — vì FE hiển thị thẳng `error.response.data.message` lên notification (xem `resolveErrorMessage` trong `src/configs/axios.ts`).

---

## 5. Bảo mật & phân quyền

### 5.1. Hai loại token

| | Access token | Refresh token |
|---|---|---|
| Dạng | JWT HS256, claim `token_type=access`, `sub`=userId, `role` | Chuỗi ngẫu nhiên lưu DB (`RefreshSessionEntity`) |
| TTL | `JWT_ACCESS_TTL` mặc định **50m** | `JWT_REFRESH_TTL` mặc định **7d** |
| Nơi chứa | FE giữ trong `localStorage` | **Cookie httpOnly**, path `/api/v1/auth` |
| Xác thực | `JwtDecoder` kiểm issuer + `token_type` (`config/JwtConfiguration.java`) | Tra bảng phiên, xoay vòng khi refresh |

Cookie httpOnly nghĩa là JS **không đọc được** refresh token → chống XSS đánh cắp phiên. Đổi lại phải chống CSRF bằng `CookieCsrfProtectionFilter` (chỉ chấp nhận Origin nằm trong `CORS_ALLOWED_ORIGINS`).

### 5.2. Từ JWT tới `@PreAuthorize`

```
users.role (DB)  →  claim "role" trong JWT
                 →  JwtGrantedAuthoritiesConverter: authoritiesClaimName="role", prefix="ROLE_"
                 →  ROLE_ADMIN / ROLE_TEACHER / ROLE_STUDENT
                 →  @PreAuthorize("hasRole('ADMIN')") trên controller
```

Ba nhóm quyền thực tế:

| Nhóm | Controller |
|---|---|
| `hasRole('ADMIN')` | `UserController`, `SettingController` |
| `hasAnyRole('ADMIN','TEACHER')` | `QuestionController`, `ExamSetController`, `ExamPartController`, `ExamSectionController`, `FileController`, `AiGradingController`, `AdminDashboardController` |
| `hasRole('STUDENT')` | `StudentExamController`, `AttemptController`, `ProgressController` |
| Không annotation (chỉ cần đăng nhập) | `ProfileController`, `NotificationController`, `SkillController` |
| Public (khai báo trong `SecurityConfiguration`) | `/auth/**` (login, register, refresh, otp, google), `/files/public/**`, `/actuator/health`, swagger |

Cờ `ROLE_CHECKS_ENABLED=false` (`app.security.role-checks-enabled`) bỏ qua toàn bộ `@PreAuthorize` khi dev — **vẫn phải có Bearer token**.

### 5.3. Rate limit — `common/ratelimit/`

`HttpRateLimitFilter` chạy **sau** khi xác thực xong (để đếm theo user, không chỉ theo IP). Thuật toán fixed-window, 4 nhóm cấu hình sẵn:

| Nhóm | Mặc định |
|---|---|
| auth | 10 req/phút |
| upload | 30 req/phút |
| submit | 10 req/phút |
| gemini | 60 req/phút |

Backend đếm: `memory` (1 instance) hoặc `redis` (`RedisFixedWindowRateLimitStore`, nhiều instance). Vượt hạn → 429 kèm header `X-RateLimit-Limit`, `X-RateLimit-Remaining`, `Retry-After`.

---

## 6. Luồng phức tạp nhất: `POST /exams/{id}/submit`

Đây là nơi hội tụ gần như mọi cơ chế của hệ thống. Điểm vào: `exam/api/StudentExamController.java:95` → `exam/application/ExamSubmissionService.java`.

```
POST /exams/12/submit
Header: Idempotency-Key: <chuỗi 8-100 ký tự>   (tuỳ chọn nhưng nên có)
Body:   { "answers": [ { "questionId": 210, "response": <JSON bất kỳ> }, ... ] }
   │
   ▼
① validateNoDuplicateAnswers()        — cùng 1 questionId gửi 2 lần -> 400
   ▼
② ExamSubmitIdempotencyService.begin()
      • Chuẩn hoá key + băm nội dung request (canonical JSON)
      • Đã có biên nhận & ĐÃ có response -> TRẢ LẠI NGUYÊN response cũ, DỪNG
        (chống double-submit do mạng chập chờn / user bấm 2 lần)
      • Chưa có -> tạo biên nhận "đang xử lý" rồi đi tiếp
   ▼
③ ExamContentLoader.load(examId, true)  — nạp đề + section + part + câu hỏi KÈM đáp án
   ▼
④ Duyệt từng câu, chia 2 nhánh:
      ├─ Trắc nghiệm  -> DeterministicQuestionGrader.grade()  (chấm ngay tại chỗ, thuần Java)
      └─ ESSAY/RECORD -> gom vào List<SubjectiveSubmission>   (chờ AI)
      Song song: đếm answered/total theo (skillId, partNumber) để cập nhật tiến độ
   ▼
⑤ aiGradingPort.grade(subjective)     — GỌI AI ĐỒNG BỘ (xem mục 7). Đây là bước CHẬM NHẤT.
   ▼
⑥ Tính điểm:
      • overallScore = trung bình % của TẤT CẢ câu (trắc nghiệm + điểm AI)
      • autoScore    = % riêng phần trắc nghiệm
      • Nếu đề là MOCK_TEST -> MockTestScoringPolicy.score() ra điểm & CEFR từng kỹ năng + CEFR tổng
   ▼
⑦ SubmissionPersistenceService.persist()  (@Transactional)
      • Ghi exam_attempts, điểm từng kỹ năng
      • Cộng dồn student_progress theo (skill, part)
      • Cập nhật learning_streak
      • Đóng biên nhận idempotency + LƯU LUÔN response JSON để lần gọi lại trả y hệt
   ▼
⑧ SuccessfulSubmissionMediaCleanup.cleanup()  — xoá file audio tạm của bài luyện tập
   ▼
201 { data: SubmitExamResponse }   ← FE hiển thị review NÓNG ngay, không cần gọi thêm API
```

**Ba điểm cần nhớ:**

1. **Chấm AI là đồng bộ.** Một bài Speaking nhiều file audio có thể mất hàng chục giây → FE phải đặt timeout riêng (đang là `120_000ms` trong `studentExamApi.submit`), không dùng timeout mặc định 10s.
2. **Idempotency là bắt buộc về mặt thiết kế.** Không có key → mỗi lần bấm nộp là một attempt mới và một lần tốn tiền Gemini. Biên nhận "treo" quá `EXAM_SUBMIT_IDEMPOTENCY_STALE_AFTER` (10 phút) sẽ được coi là hỏng và cho nộp lại; lỗi giữa chừng thì `release()` mở khoá ngay.
3. **Toàn bộ điểm số quy về thang %** rồi mới đổi sang thang hiển thị. Thang mỗi kỹ năng là **50** (theo quyết định nghiệp vụ), quy đổi CEFR nằm ở `grading/domain/CefrScale.java` + `OverallCefrPolicy.java`.

---

## 7. Chấm AI & chuỗi ASR

```
AiGradingPort.grade(submissions)
   └─ GeminiAiGradingAdapter
        ├─ ESSAY (Writing)  ─────────────────────────────► HttpGeminiClient → Gemini API
        │                                                   (prompt + bài viết)
        └─ RECORD (Speaking)
             ├─ SpeechToTextPort.transcribe(audio)  = FallbackSpeechToText
             │     ├─ 1. local  — Whisper sidecar (faster-whisper) qua tunnel   [STT_LOCAL_*]
             │     ├─ 2. groq   — Groq whisper-large-v3-turbo                    [STT_GROQ_*]
             │     └─ (vps đã BỎ khỏi chuỗi active — muốn dùng phải thêm vào STT_ORDER)
             │     Mỗi tầng có circuit breaker, hỏng thì nghỉ STT_BREAKER_COOLDOWN (60s) rồi thử lại
             │
             ├─ Có transcript -> gửi TEXT cho Gemini chấm (rẻ hơn nhiều)
             └─ Hết chuỗi ASR -> gửi THẲNG AUDIO cho Gemini (mức cuối, luôn có điểm)
```

- Thứ tự ưu tiên đặt bằng ENV `STT_ORDER` (mặc định `local,groq`). **Gemini luôn là mắt xích cuối**, nên tầng nào xếp sau Gemini sẽ không bao giờ chạy.
- Chấm điểm (LLM) **luôn** là Gemini qua API key — không chạy LLM local.
- Tiêu chí chấm Speaking: 3 tiêu chí (Hoàn thành & liên quan, Ngữ pháp & từ vựng, Mạch lạc).
- Media được nạp qua `GradingMediaLoader` → `TrustedStorageMediaLoader`: **chỉ chấp nhận URL thuộc storage của hệ thống** (chống SSRF: người dùng không thể bắt server tải file từ domain lạ).
- Bảo vệ chi phí/ổn định: `GEMINI_MAX_CONCURRENCY=3`, `GEMINI_MAX_ATTEMPTS=3` + backoff, `GEMINI_REQUEST_TIMEOUT=45s`, `GEMINI_MAX_INLINE_MEDIA_SIZE=18MB`.
- Sức khoẻ cấu hình AI xem `/ai-grading/status` (`AiGradingDiagnosticsService`) và `GeminiConfigurationHealthIndicator`.

---

## 8. Upload & lưu trữ file

```
POST /files/upload?folder_type=audio&prefix=speaking/mock   (multipart, field "file")
   │  ADMIN/TEACHER  (@PreAuthorize ở FileController)
   ▼
StorageApplicationService
   ├─ MediaMagicDetector  — đọc MAGIC BYTES của file, KHÔNG tin phần mở rộng hay Content-Type
   ├─ MediaUploadPolicy   — chặn sai loại / quá dung lượng (ảnh 5MB, audio 20MB)
   ├─ ObjectKeyPolicy     — sinh key an toàn, chống path traversal
   └─ StoragePort.put()   → LocalStorageAdapter (./var/uploads) HOẶC S3StorageAdapter
   ▼
{ url, key, size, mimeType }     url dạng {STORAGE_PUBLIC_URL}/{key}
```

- Đọc file public qua `/files/public/**` (route này được `permitAll`).
- `DELETE /files` xoá theo key, nhưng `MediaReferenceChecker` chặn nếu file vẫn đang được câu hỏi/tài liệu tham chiếu.
- Học viên **không** gọi endpoint này trực tiếp cho bài nộp; luồng audio bài nộp xem `.docs/FE_MEDIA_UPLOAD_FLOW.md`.

---

## 9. Xuyên suốt (cross-cutting)

| Cơ chế | File | Ghi chú |
|---|---|---|
| Correlation ID | `common/observability/CorrelationIdFilter.java` | Header `X-Correlation-ID`, đẩy vào MDC; pattern log `[corr=%X{correlationId}]` → tra 1 request xuyên toàn bộ log |
| Metrics | Micrometer + `/actuator/prometheus` | Chỉ ADMIN đọc được |
| Health | `/actuator/health` public; `GeminiConfigurationHealthIndicator` | |
| Cấu hình | `config/*Properties.java` (`@ConfigurationProperties`) | Không rải `@Value` khắp nơi |
| Profile | `local` (mặc định), `staging`, `production`, `integration` | `application-<profile>.yml` |
| Thời gian | `Clock` là **bean** (`applicationClock()`), JPA lưu UTC | Test tiêm `Clock` cố định được; ngày học tính theo `Asia/Ho_Chi_Minh` |
| Transaction | `@Transactional` ở tầng `application`, `open-in-view: false` | Không lazy-load ngoài transaction → tránh N+1 ngầm |
| Schema | Flyway, `ddl-auto: validate` | **Không bao giờ để Hibernate tự sửa schema**; đổi bảng phải viết migration |

---

## 10. Bản đồ endpoint (theo controller)

| Controller | Base path | Quyền |
|---|---|---|
| `AuthController` | `/auth` | public (trừ `/account`, `/logout`, `/change-password`) |
| `GoogleOAuthController` | `/auth/google` | public |
| `UserController` | `/users` | ADMIN |
| `ProfileController` | `/profile` | đã đăng nhập |
| `QuestionController` | `/questions` | ADMIN, TEACHER |
| `ExamSetController` | `/exam-sets` | ADMIN, TEACHER |
| `ExamSectionController` | `/exam-sections` | ADMIN, TEACHER |
| `ExamPartController` | `/exam-parts` | ADMIN, TEACHER |
| `StudentExamController` | `/exams` | STUDENT |
| `AttemptController` | `/attempts` | STUDENT (riêng `GET /attempts` là TEACHER/ADMIN) |
| `ProgressController` | `/progress/me`, `/progress/exams/me`, `/streaks/me` | STUDENT |
| `AiGradingController` | `/ai-grading` | ADMIN, TEACHER |
| `FileController` | `/files` | ADMIN, TEACHER |
| `StudyMaterialController` | `/study-materials` | đọc: đã đăng nhập; ghi: ADMIN/TEACHER |
| `FaqController` | `/faqs` | đọc: public; ghi: ADMIN/TEACHER |
| `NotificationController` | `/notifications` | đọc của mình: đã đăng nhập; quản trị: ADMIN/TEACHER |
| `AdminDashboardController` | `/admin/dashboard` | ADMIN, TEACHER |
| `SettingController` | `/settings` | ADMIN |
| `SkillController` | `/skills` | đã đăng nhập |

---

## 11. Checklist khi thêm một endpoint mới

1. **DTO trước:** tạo `api/request/XxxRequest.java` (record + annotation validation) và `api/response/XxxResponse.java` (record + static `from(entity)`).
2. **Domain:** cần luật mới thì viết class `*Policy` thuần trong `domain/`, không nhét `if` nghiệp vụ vào service.
3. **Application:** thêm method vào `XxxApplicationService`, gắn `@Transactional` nếu có ghi. Lỗi nghiệp vụ ném `ApiException` với **message tiếng Việt cho người dùng cuối**.
4. **Infrastructure:** query mới đặt trong repository; gọi hệ thống ngoài thì khai báo **port** ở `application` + **adapter** ở `infrastructure`.
5. **Controller:** thêm method mỏng, gắn `@Operation` (Swagger), `@PreAuthorize` đúng nhóm quyền, luôn bọc `ApiResponse.success(...)`; danh sách phân trang phải truyền `PageMetadata`.
6. **Đổi schema:** viết file Flyway mới trong `db/migration` — không sửa migration cũ.
7. **Đối chiếu FE:** cập nhật `.docs/API_PLAN.md`, rồi thêm hàm vào tầng `services/*Api.ts` phía frontend (xem `.docs/FE_ARCHITECTURE_FLOW.md`).
