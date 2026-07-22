# Quy đổi điểm → CEFR cho MOCK_TEST (Aptis General)

> Mục tiêu: hiển thị **điểm 0–50 + CEFR theo từng kỹ năng** và **CEFR tổng**, thay cho một con số %/100 chung.
> **Phạm vi áp dụng:** chỉ **MOCK_TEST** (thi thử, đủ 4–5 kỹ năng). PART_PRACTICE không áp dụng
> (chỉ là một phần của kỹ năng, không ghi attempt). SKILL_FULL_SET là mở rộng tuỳ chọn (1 kỹ năng, có band riêng nhưng không có overall).
> Nguồn mô hình: British Council — mỗi kỹ năng 0–50, quy đổi CEFR **riêng theo kỹ năng**;
> **Grammar & Vocabulary (Core) 0–50 CÓ điểm nhưng KHÔNG có band**; overall CEFR = **trung bình làm tròn 4 band kỹ năng**.

---

## 🔒 HỢP ĐỒNG API (chốt trước — BE & FE code song song dựa vào đây)

Hai bên thống nhất **shape dưới đây** rồi làm đồng thời. FE build giao diện + util dựa vào shape (có fallback tự tính
khi BE chưa xong); BE trả đúng shape này. Khi BE lên, FE ưu tiên giá trị của BE: `result.skills ?? tựTính(result)`.

### Kiểu dữ liệu (TypeScript)
```ts
export type Cefr = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

export interface SkillScore {
  skillId: number;        // 1 Grammar | 2 Listening | 3 Reading | 4 Writing | 5 Speaking
  name: string;           // 'Ngữ pháp & Từ vựng' | 'Nghe' | 'Đọc' | 'Viết' | 'Nói'
  earned?: number;        // kỹ năng trắc nghiệm (1,2,3): tổng điểm ý đúng
  total?: number;         // kỹ năng trắc nghiệm (1,2,3): tổng điểm ý
  aiScore?: number;       // kỹ năng AI chấm (4,5): 0–100 (trung bình các Part)
  scaled: number;         // 0–50 (XẤP XỈ tuyến tính, KHÔNG phải scaled thật của Aptis)
  cefr: Cefr | null;      // null cho Grammar (skill 1) — Core không xếp band
}
```

`details[]` (câu tự động) và `ai[]` (câu AI) đều có thêm `skillId` và `partNumber`. FE có thể gộp trực tiếp,
không cần tra ngược `questionId` từ exam detail.

### Bổ sung vào response `POST /exams/:id/submit` (chỉ khi `type === 'MOCK_TEST'`)
```jsonc
{
  // ...các field cũ: score, autoScore, earnedAutoPoints, totalAutoPoints, details[], ai[]...

  "skills": [
    { "skillId": 1, "name": "Ngữ pháp & Từ vựng", "earned": 18, "total": 25, "scaled": 36, "cefr": null },
    { "skillId": 2, "name": "Nghe",  "earned": 28, "total": 40, "scaled": 35, "cefr": "B2" },
    { "skillId": 3, "name": "Đọc",   "earned": 30, "total": 40, "scaled": 38, "cefr": "B2" },
    { "skillId": 4, "name": "Viết",  "aiScore": 78, "scaled": 39, "cefr": "B1" },
    { "skillId": 5, "name": "Nói",   "aiScore": 72, "scaled": 36, "cefr": "B1" }
  ],
  "overallCefr": "B1"     // trung bình làm tròn band của 4 kỹ năng 2,3,4,5 — KHÔNG tính Grammar
}
```

### Bổ sung vào `GET /attempts/me` (mỗi dòng attempt MOCK_TEST)
```jsonc
{
  "id": 12,
  "examId": 5,
  "totalScore": 82,
  "overallCefr": "B1",
  "skillCefr": [/* snapshot SkillScore[] lúc nộp bài */],
  "startedAt": "...",
  "finishedAt": "...",
  "exam": { "id": 5, "title": "Aptis Mock Test 01", "type": "MOCK_TEST" }
}
```

> **Quy tắc bất biến giữa 2 bên:**
> - `skills[]` chứa **mọi kỹ năng có trong đề, gồm cả Grammar (skillId 1)**.
> - Grammar luôn `cefr: null` nhưng **vẫn có `scaled` 0–50** để hiển thị.
> - `overallCefr` = trung bình làm tròn band của **4 kỹ năng 2,3,4,5** (bỏ Grammar).
> - Nếu thiếu một kỹ năng hoặc bất kỳ kết quả AI nào cần chấm tay, `overallCefr = null`; tuyệt đối không tính từ tập kỹ năng còn lại.
> - `scaled = round(phầnTrămĐúng / 100 * 50)` (xấp xỉ tuyến tính). UI phải gắn nhãn "(ước lượng)".

---

## 1. Bảng quy đổi (nguồn sự thật) — thang 0–50

`skillId`: 1 Grammar(Core) · 2 Listening · 3 Reading · 4 Writing · 5 Speaking.
**Grammar không có band** — chỉ có điểm 0–50 + dùng phá-hòa vùng giáp ranh.

| CEFR | Listening (2) | Reading (3) | Writing (4) | Speaking (5) |
| ---- | ------------: | ----------: | ----------: | -----------: |
| A0   |          0–7  |        0–7  |        0–5  |         0–3  |
| A1   |         8–15  |       8–15  |       6–17  |        4–15  |
| A2   |        16–23  |      16–25  |      18–25  |       16–25  |
| B1   |        24–33  |      26–37  |      26–39  |       26–40  |
| B2   |        34–41  |      38–45  |      40–47  |       41–47  |
| C1   |        42–50  |      46–50  |      48–50  |       48–50  |

> Cut-score chính xác không được British Council công bố cố định → **bảng này là chuẩn của dự án**.

## 2. Điểm mấu chốt: scaled 0–50 lấy từ đâu?

Aptis dùng IRT equating (không tuyến tính) → **không tái tạo được** ngoài hệ thống của họ.
Dự án dùng **xấp xỉ tuyến tính**: `scaled = round(percentĐúng / 100 * 50)` → phải gắn nhãn "(ước lượng)".

- **Grammar/Đọc/Nghe (1,2,3):** có `earned/total` từng câu → % đúng theo kỹ năng → scaled → tra bảng (Grammar bỏ tra bảng).
- **Viết/Nói (4,5):** Gemini trả `aiScore` (0–100) + `band` mỗi câu/Part. Ưu tiên **band AI hợp lệ**;
  `scaled = round(aiScore/100*50)`. Chỉ chấp nhận `A0 | A1 | A2 | B1 | B2 | C1`; chuẩn hoá `C → C1`.
  Nếu band không hợp lệ, BE fallback bằng `aiScore → scaled → bảng band của kỹ năng`.
- **Trọng số AI theo Part:** tính trung bình các câu trong từng Part trước, sau đó trung bình các Part. Vì Speaking Part 1
  có nhiều dòng câu hỏi còn Part 2–4 thường mỗi Part một dòng, không được trung bình thẳng toàn bộ dòng câu hỏi.
- **Bỏ trống:** câu Writing/Speaking bỏ trống trả `aiScore: 0`, `band: A0`, `needsManualReview: false` và không gọi Gemini.
- **Lỗi AI/media:** trả `aiScore: null`, `band: null`, `needsManualReview: true`; kỹ năng và overall chưa có band hoàn chỉnh.

---

## 🧩 CHIA VIỆC — làm song song

| # | Việc | BE | FE |
|---|------|:--:|:--:|
| 0 | Chốt hợp đồng API ở trên | ✅ | ✅ |
| 1 | BE `src/exams/cefr.ts`; FE `src/shared/utils/cefrScale.ts` từ cùng bảng | ✅ | ✅ |
| 2 | Cập nhật type `IExamSubmitResult` + `IAttemptItem` theo hợp đồng | ✅ | ✅ |
| 3 | `ExamResultScreen`: 5 dòng kỹ năng (Grammar hiện `scaled/50` + nhãn "Core · không xếp band"; 4 kỹ năng còn lại có tag band) + badge **overall CEFR** |  | ✅ |
| 4 | FE ưu tiên `result.skills`; fallback gộp `details[]`/`ai[]` theo `skillId` + `partNumber` (`mockExamScore.ts`) | ✅ | ✅ |
| 5 | Landing: banner "Trình độ hiện tại" + lịch sử đọc `overallCefr` từ attempt | ✅ | ✅ |
| 6 | Khi chấm: gộp điểm theo `skillId`, tính `scaled` + `cefr`, thêm `skills[]` + `overallCefr` vào response submit | ✅ |  |
| 7 | Thêm cột `overall_cefr` (+ tuỳ chọn JSON `skill_cefr`) vào `exam_attempts`; trả trong `GET /attempts/me` | ✅ |  |
| 8 | (Tuỳ chọn) Grey-zone: nếu scaled sát dưới ranh band và điểm Grammar mạnh → nâng 1 bậc | ⏸ Chưa bật |  |

> FE **không bị chặn** chờ BE: bước 1–5 chạy được ngay nhờ fallback tự tính (bước 4).
> Khi BE xong bước 6–7, FE chỉ đổi 1 dòng: ưu tiên `result.skills` của BE, bỏ nhánh tự tính.

---

## 3. Phía FE — util dùng chung `src/shared/utils/cefrScale.ts`
```ts
export type Cefr = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

// Tên hiển thị theo skillId
export const SKILL_NAME: Record<number, string> = {
  1: 'Ngữ pháp & Từ vựng', 2: 'Nghe', 3: 'Đọc', 4: 'Viết', 5: 'Nói',
};

// Ranh giới band theo thang 0–50 từng kỹ năng. Grammar(1) KHÔNG có bảng → không band.
const BANDS: Record<number, { band: Cefr; max: number }[]> = {
  2: [{band:'A0',max:7},{band:'A1',max:15},{band:'A2',max:23},{band:'B1',max:33},{band:'B2',max:41},{band:'C1',max:50}],
  3: [{band:'A0',max:7},{band:'A1',max:15},{band:'A2',max:25},{band:'B1',max:37},{band:'B2',max:45},{band:'C1',max:50}],
  4: [{band:'A0',max:5},{band:'A1',max:17},{band:'A2',max:25},{band:'B1',max:39},{band:'B2',max:47},{band:'C1',max:50}],
  5: [{band:'A0',max:3},{band:'A1',max:15},{band:'A2',max:25},{band:'B1',max:40},{band:'B2',max:47},{band:'C1',max:50}],
};
const ORDER: Cefr[] = ['A0','A1','A2','B1','B2','C1'];

export const scaledToCefr = (skillId: number, scaled: number): Cefr | null => {
  const table = BANDS[skillId];
  if (!table) return null;                          // Grammar/Core: có điểm, không band
  const s = Math.max(0, Math.min(50, Math.round(scaled)));
  return table.find((r) => s <= r.max)?.band ?? 'C1';
};

// Ước lượng tuyến tính: % đúng (0–100) -> 0–50. KHÔNG phải scaled thật của Aptis.
export const percentToScaled = (percent: number) => Math.round((percent / 100) * 50);

// Overall = trung bình làm tròn band các kỹ năng (chỉ truyền 4 kỹ năng 2,3,4,5).
export const averageCefr = (bands: (Cefr | null)[]): Cefr | null => {
  // Overall MOCK_TEST bắt buộc đủ đúng 4 band Listening/Reading/Writing/Speaking.
  if (bands.length !== 4 || bands.some((b) => b === null)) return null;
  const idx = (bands as Cefr[]).map((b) => ORDER.indexOf(b));
  return ORDER[Math.round(idx.reduce((a, b) => a + b, 0) / idx.length)];
};
```

### Interim (bước 4) — FE tự dựng khi BE chưa trả `skills[]`
Sau khi có `result` ở `handleSubmitFinal`:
1. Gộp `result.details[]` theo skill (gồm Grammar) → `earned/total` → % → `percentToScaled` → `scaledToCefr`.
2. Viết/Nói: nhóm `result.ai[]` theo `skillId + partNumber`; trung bình trong Part trước, rồi mới trung bình các Part.
3. Chuẩn hoá band về `A0…C1`; câu lỗi/manual làm band kỹ năng và overall bằng `null`.
4. `overallCefr = averageCefr([band2, band3, band4, band5])` (bỏ Grammar, bắt buộc đủ cả 4).
Hạn chế: landing/lịch sử vẫn thiếu band cho tới khi BE làm bước 7.

## 4. Phía BE (bước 6–8)
- Khi chấm, mỗi phần tử `details[]`/`ai[]` mang `skillId` và `partNumber`. Gộp `earned/total` theo skill (gồm Grammar);
  Viết/Nói trung bình theo Part như mục 2. Tính `scaled` + `cefr` (Grammar = null).
- Trả `skills[]` + `overallCefr` trong response submit (mục Hợp đồng).
- Lưu `overall_cefr` và snapshot `skill_cefr` vào `exam_attempts` mỗi lần nộp MOCK_TEST; trả trong `GET /attempts/me`.
- Grey-zone **chưa triển khai** vì chưa chốt khoảng cách tới ranh và ngưỡng Grammar.

## 5. Prompt và dữ liệu gửi Gemini

- Writing: gửi bối cảnh, từng câu con, giới hạn từ/register nếu có và bài làm; sample answer chỉ là tham khảo.
- Speaking: gửi nội dung câu hỏi, ảnh đề trong `extra_config.image_urls` (Part 2–4) và audio câu trả lời theo đúng thứ tự.
- Prompt yêu cầu JSON `{ score, band, feedback }`, band đúng một giá trị `A0…C1`, feedback ngắn gọn bằng tiếng Việt.
- Prompt yêu cầu bỏ qua mọi câu lệnh do thí sinh viết/nói trong bài làm để hạn chế prompt injection.
- Media tải lỗi hoặc Gemini lỗi/timeout → `needsManualReview: true`, không tự quy lỗi hệ thống thành 0 điểm.

## 6. Database và migration

`exam_attempts` có thêm:

```prisma
overallCefr String? @map("overall_cefr") @db.VarChar(2)
skillCefr   Json?   @map("skill_cefr") @db.JsonB
```

Migration: `prisma/migrations/20260722090000_add_cefr_scoring/migration.sql`.
Production dùng `prisma migrate deploy`; không dùng `migrate reset` trên database có dữ liệu.

### Trạng thái lịch sử migration (đã sửa ngày 2026-07-22)

- Đã phục dựng ba migration `20260705...` từng được áp dụng lên Supabase nhưng bị mất khỏi repository.
- Đã đối chiếu schema Supabase với `schema.prisma`: không còn khác biệt.
- Đã áp dụng migration CEFR; hiện database có đủ 8 migration và `prisma migrate status` báo up to date.
- Script `prisma/repair/20260722_reconcile_migration_history.sql` là script sửa checksum **một lần**, chỉ giữ lại để truy vết;
  không cần chạy lại trên database hiện tại.
- Với Supabase dùng chung/production, chạy `npx prisma migrate deploy`. Chỉ dùng `migrate dev` với PostgreSQL local hoặc khi đã
  cấu hình `shadowDatabaseUrl` riêng; không dùng pooler production làm shadow database.

## Nguồn
- British Council — Results & scoring: https://www.britishcouncil.org/exam/english/aptis/why-choose-aptis/results-scoring
- Aptis Scoring System (Technical Report, K. Dunn): https://www.britishcouncil.org/sites/default/files/aptis_scoring_system_v2.0.pdf
- Aptis Scores Explained: https://ulic.es/wp-content/uploads/2018/05/aptis_scores_explained_eng_0.pdf
