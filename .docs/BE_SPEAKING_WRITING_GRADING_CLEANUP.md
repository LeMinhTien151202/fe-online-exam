# BE Spec — Chấm AI & Dọn audio cho Speaking/Writing

> Tài liệu mô tả cho **Backend** xử lý. FE đã nộp đúng shape và hiển thị điểm ngay sau khi chấm; các mục dưới đây **không thuộc FE** mà cần BE làm.
> Liên quan: [EXAM_SUBMIT_SAMPLES.md](EXAM_SUBMIT_SAMPLES.md), [FE_MEDIA_UPLOAD_FLOW.md](FE_MEDIA_UPLOAD_FLOW.md), [API_PLAN.md](API_PLAN.md) mục 2.8/2.9/2.14.

## 1. Bối cảnh

- Speaking (skillId 5) và Writing (skillId 4) **chấm hoàn toàn bằng AI (Gemini)** — **không có chấm tay**.
- Câu tự luận nộp lên dưới dạng **URL file đã upload** (audio cho RECORD, không phải bytes):
  - `RECORD` → `response: string | string[]` (URL audio công khai trên storage).
  - `ESSAY` → `response: string[]` (text theo thứ tự prompt).
- Sau khi chấm xong, FE **hiện điểm ngay** từ `IExamSubmitResult.ai[]`. Học viên đã biết điểm ⇒ file audio trở thành **rác**, cần dọn.
- Nghe lại bài trong phiên dùng blob cục bộ ở trình duyệt, **không phụ thuộc file trên storage** ⇒ xoá file trên storage không ảnh hưởng trải nghiệm nghe lại tức thời.

## 2. Yêu cầu: Dọn audio sau khi chấm

**Vị trí xử lý:** ngay trong handler `POST /exams/:examId/submit`, **sau khi AI chấm xong**, trước khi trả response (hoặc trong hàng đợi/hook chạy sau chấm).

**Điều kiện xoá (BẮT BUỘC — guard):** chỉ xoá file của câu mà AI **đã chấm ra điểm**:

```
xoá audio của 1 answer  ⟺  aiScore != null  &&  needsManualReview == false
```

- Nếu AI **lỗi / hết quota / chưa cấu hình** ⇒ `aiScore = null`, `needsManualReview = true` ⇒ **GIỮ file** để có thể **chấm lại bằng AI** sau. Tuyệt đối **không** xoá khi AI chưa ra điểm, tránh mất trắng bài làm.
- Xoá theo từng file: mỗi phần tử URL trong `response` (RECORD) là 1 file trên storage.

**API xoá:** `DELETE /files?key=<key>` (ưu tiên) hoặc `DELETE /files?url=<url>` — quyền **ADMIN/TEACHER** (API_PLAN 2.14). Vì học viên **không có quyền** gọi endpoint này, việc xoá **phải chạy phía server** (nội bộ, không qua token học viên).

**Chống trùng:** Part 4 (và các part gộp) có thể gửi **cùng một URL lặp nhiều lần** (xem mục 4). Khi xoá phải **gom URL/key là duy nhất (dedupe)** rồi mới xoá, tránh gọi xoá 2 lần cùng 1 key.

**Chịu lỗi:** xoá file thất bại **không được** làm hỏng kết quả chấm/nộp bài. Nuốt lỗi + ghi log; có thể để **retention job** quét dọn lại các file mồ côi sau.

## 3. Yêu cầu: Lưu điểm theo loại đề

| Loại đề | Lưu điểm? | Ghi chú |
|---|---|---|
| `PART_PRACTICE` (theo phần) | **Không** | Không ghi attempt (`attemptId: null`), chỉ tăng `student_progress`. Chỉ cần biết học viên **đã làm**. |
| `SKILL_FULL_SET` (theo bộ đề) | **Tuỳ chọn** | Hiện đánh dấu đã làm (`totalScore: null`). **Nếu muốn lưu điểm**: điền `totalScore` cho attempt loại này. |
| `MOCK_TEST` (đề thi thử) | **Có** | Lưu đủ điểm + CEFR theo kỹ năng + CEFR tổng như hiện tại. |

**Xoá audio theo loại đề:**
- `PART_PRACTICE`, `SKILL_FULL_SET`: **xoá ngay** sau chấm (không lưu điểm / không tra soát) — miễn thoả guard ở mục 2.
- `MOCK_TEST`: **cân nhắc giữ lại** (đây là bài có lưu điểm, có thể cần bằng chứng khi khiếu nại). Gợi ý: giữ rồi để **retention job** xoá sau N ngày (vd 30–90 ngày) thay vì xoá tức thì. Quyết định cuối theo chính sách sản phẩm.

## 4. Cần chốt: cách xử lý Part gộp (đặc biệt Part 4)

Speaking Part 2/3/4 lưu là **1 câu hỏi gộp** (1 `questionId`, `extraConfig` chứa N câu con). FE gửi:

- Part 2/3: `response` = mảng URL, **mỗi câu con một file khác nhau**.
- **Part 4**: FE ghi âm **một lần** cho cả part rồi phát URL đó cho tất cả slot ⇒ `response` = **cùng một URL lặp lại N lần**, ví dụ `[url, url, url]`.

**Yêu cầu BE làm rõ & xử lý:**
1. Khi chấm Part 4: **không chấm lặp** cùng 1 audio N lần. Dedupe URL trước khi đưa cho Gemini; chấm 1 lần cho cả part.
2. Khi xoá: dedupe key (mục 2) để không xoá trùng.
3. Nếu BE mong Part 4 chỉ nhận **1 URL** (string) thay vì mảng lặp, báo lại để **FE đổi** cách gửi cho Part 4.

## 5. Hợp đồng dữ liệu (tham chiếu)

`POST /exams/:examId/submit` — body:
```json
{ "answers": [ { "questionId": 161, "response": "<url>" },
               { "questionId": 164, "response": ["<url1>","<url2>","<url3>"] } ] }
```

Response `IExamSubmitResult` (rút gọn):
```json
{
  "examId": 32, "type": "SKILL_FULL_SET", "attemptId": 7,
  "score": 0, "needsManualReviewCount": 6,
  "ai": [
    { "questionId": 161, "skillId": 5, "partNumber": 1, "questionType": "RECORD",
      "aiScore": null, "band": null, "needsManualReview": true,
      "feedback": "Không thể chấm AI lúc này; cần chấm thủ công" }
  ]
}
```

## 6. Kịch bản test đã chạy (dùng để nghiệm thu)

- Đề: **Speaking Test 10**, `examId = 32`, `type = SKILL_FULL_SET`.
- questionId theo part: P1 = 161/162/163 (3 câu, mỗi câu 1 URL); P2 = 164 (mảng 3 URL); P3 = 165 (mảng 3 URL); P4 = 166 (mảng 3 URL — cùng 1 file lặp).
- Upload 10 file `.mp3` → `POST /files/upload?folder_type=audio&prefix=speaking/set/pN` (201, trả URL Supabase).
- `POST /exams/32/submit` → 201, `attemptId = 7`, nhưng **AI trả `aiScore: null` cho cả 6 câu** ("Không thể chấm AI lúc này; cần chấm thủ công").

**Kết luận từ test:** luồng upload + nộp + tạo attempt OK; **AI (Gemini) đang lỗi ở BE** ⇒ mọi câu rơi vào chờ chấm tay. Đây chính là lý do guard ở mục 2 là **bắt buộc** — nếu xoá mù sau nộp, gặp đúng lúc AI lỗi sẽ mất bài.

**Cần nghiệm thu:**
- [ ] AI Gemini chấm ra điểm cho RECORD/ESSAY (khắc phục cấu hình/key/quota; kiểm tra BE tải được audio từ URL storage).
- [ ] Sau chấm thành công: audio của `PART_PRACTICE`/`SKILL_FULL_SET` **bị xoá** khỏi storage; câu `aiScore = null` **không** bị xoá.
- [ ] `MOCK_TEST`: điểm được lưu; audio giữ (hoặc theo retention).
- [ ] Part 4 chấm 1 lần, không chấm/xoá trùng.

---

## 7. Phương án sửa cụ thể cho BE (khớp đúng FE)

### 7.1. Chuẩn hoá `response` trước khi chấm

FE gửi (xác định từ `collectAnswers` — [useMockTest.ts:116](../src/apps/speaking-practice/pages/speaking-mock-test/hook/useMockTest.ts:116)):

| Part | Shape FE gửi | Ghi chú |
|---|---|---|
| P1 (mỗi câu 1 questionId) | `response: "<url>"` (string) | Chỉ gửi câu có ghi âm. |
| P2, P3 (1 questionId/bộ) | `response: ["<url1>","<url2>","<url3>"]` | **Mỗi câu con 1 file khác nhau.** Slot chưa ghi = `""`. |
| P4 (1 questionId/bộ) | `response: ["<url>","<url>","<url>"]` | **Cùng 1 file lặp lại** (ghi âm 1 lần cho cả part). |

⇒ **Hai điều BE bắt buộc làm khi nhận `response` là mảng:**
1. **Bỏ phần tử rỗng**: loại các `""` (slot học viên chưa ghi).
2. **Dedupe URL** (khử trùng, giữ thứ tự): xử lý Part 4 và mọi trường hợp trùng.

```ts
function normalizeRecordUrls(response: string | string[]): string[] {
  const arr = Array.isArray(response) ? response : [response];
  return [...new Set(arr.filter((u) => typeof u === 'string' && u.trim() !== ''))];
}
```

- Sau chuẩn hoá: **mỗi `questionId` (mỗi part) → 1 tập audio duy nhất → chấm ra 1 `aiScore`** cho part đó.
- P4 sau dedupe còn **1 URL** → chấm đúng 1 lần. Không cần FE đổi gì.

### 7.2. Pseudo-code handler `POST /exams/:examId/submit`

```ts
async function submitExam(examId, userId, payload) {
  const exam = await getExam(examId);            // biết type + questions
  const autoDetails = [];                         // trắc nghiệm (1,2,3)
  const aiDetails = [];                           // RECORD/ESSAY (4,5)

  for (const ans of payload.answers) {
    const q = exam.questionById(ans.questionId);

    if (isAutoGraded(q)) {                         // MC/gap-fill/word-bank...
      autoDetails.push(gradeAuto(q, ans.response));
      continue;
    }

    // RECORD (Speaking) / ESSAY (Writing) -> AI
    const urls = q.type === 'RECORD' ? normalizeRecordUrls(ans.response) : null;
    const ai = await gradeWithGemini(q, q.type === 'RECORD' ? urls : ans.response);
    // ai = { aiScore: number|null, band: string|null, feedback, needsManualReview }
    aiDetails.push({ questionId: q.id, skillId: q.skillId, partNumber: q.partNumber,
                     questionType: q.type, ...ai, _urls: urls });
  }

  // --- Lưu điểm theo loại đề (mục 3) ---
  const attempt = await persistAttempt(exam, userId, autoDetails, aiDetails);
  // PART_PRACTICE : không tạo attempt (chỉ tăng student_progress) -> attemptId = null
  // SKILL_FULL_SET: tạo attempt, totalScore = <điểm nếu muốn lưu, else null>
  // MOCK_TEST     : tạo attempt, totalScore + skills[] + overallCefr

  // --- Dọn audio (mục 2) : CHỈ khi AI đã ra điểm ---
  if (exam.type !== 'MOCK_TEST') {                 // mock giữ lại (hoặc retention job)
    const keysToDelete = new Set();
    for (const d of aiDetails) {
      const graded = d.aiScore != null && d.needsManualReview === false;
      if (graded && d._urls) d._urls.forEach((u) => keysToDelete.add(urlToKey(u)));
      // aiScore == null  -> GIỮ file để chấm lại, KHÔNG thêm vào keysToDelete
    }
    // chạy nội bộ, quyền server (không dùng token học viên); nuốt lỗi + log
    await safeDeleteFiles([...keysToDelete]);      // gọi storage.remove theo key
  }

  return buildSubmitResult(exam, attempt, autoDetails, aiDetails); // bỏ field _urls
}
```

### 7.3. `urlToKey` — suy `key` từ `url` để xoá

URL public có dạng `.../storage/v1/object/public/<bucket>/<key>`. Cắt lấy phần sau `public/<bucket>/`:

```ts
function urlToKey(url: string): string {
  const m = url.match(/\/public\/[^/]+\/(.+)$/); // bucket = exam-online
  return m ? m[1] : url;                          // vd: audio/speaking/set/p1/uuid.mp3
}
```

> Nếu BE lưu sẵn `key` lúc upload thì dùng thẳng `key`, khỏi parse URL. Endpoint xoá hỗ trợ cả `?key=` và `?url=` (API_PLAN 2.14) — **ưu tiên `key`**.

### 7.4. Lưu điểm theo loại đề — cụ thể

- `PART_PRACTICE`: **không** ghi attempt; chỉ `UPSERT student_progress(userId, skillId, partNumber, answered++)`. Trả `attemptId: null`.
- `SKILL_FULL_SET`: ghi attempt `status = 'SUBMITTED'`. **Khuyến nghị lưu điểm**: set `totalScore = tổng aiScore quy đổi` (vì AI đã ra điểm) — nếu chỉ muốn đánh dấu đã làm thì để `null` như hiện tại.
- `MOCK_TEST`: giữ nguyên — `totalScore` + `skills[]` (điểm + CEFR từng kỹ năng) + `overallCefr`.

### 7.5. Chốt Part 4 (chọn 1)

- **Phương án A (khuyến nghị — FE giữ nguyên):** BE áp dụng `normalizeRecordUrls` (7.1) → P4 tự về 1 URL. **Không đổi FE.** An toàn cho cả P2/P3 khi có URL trùng.
- **Phương án B:** BE muốn P4 nhận `response` là **string** (1 URL). Khi đó báo lại, FE sẽ sửa `collectAnswers` để Part 4 gửi `answers[keyOf(4,setIndex,1)]` dạng string thay vì mảng lặp.

➡️ Nếu không có nhu cầu đặc biệt, **chọn A** để khỏi đụng FE; BE chỉ cần thêm bước chuẩn hoá + dedupe.

## 8. Trạng thái triển khai Spring Boot

Đã triển khai phương án A:

- `RECORD` chấp nhận nguyên contract cũ: P1 là string; P2/P3/P4 là mảng URL.
- Trước khi gửi Gemini, backend bỏ URL rỗng, trim và dedupe nhưng vẫn giữ nguyên thứ tự.
- Sau khi AI chấm và persistence hoàn tất, `PART_PRACTICE`/`SKILL_FULL_SET` chỉ xóa audio của kết quả có `aiScore != null && needsManualReview == false`.
- `MOCK_TEST` giữ audio để phục vụ tra soát; retention job chưa thuộc thay đổi này.
- Xóa chạy nội bộ qua `StorageApplicationService`, dedupe trên toàn submission; lỗi từng file chỉ được log và không làm submit thất bại.
- Writing `ESSAY` không có audio nên không tham gia cleanup.

**Ảnh hưởng FE:** không thay đổi endpoint, request hoặc response. FE tiếp tục gửi Part 4 dưới dạng mảng URL lặp; backend tự dedupe.

**Giới hạn hiện tại:** nếu AI lỗi, backend giữ audio nhưng chưa có job tự động chấm lại attempt cũ vì hệ thống chưa lưu answer/audio theo attempt. FE vẫn có thể nộp lại bằng các URL còn giữ; muốn retry hoàn toàn phía server cần bổ sung bảng lưu submission answers và trạng thái grading job.
