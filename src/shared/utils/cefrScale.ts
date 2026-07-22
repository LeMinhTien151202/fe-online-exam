// ============================================================
// Quy đổi điểm → CEFR (Aptis General) — xem .docs/SCORING_CEFR_PLAN.md
// Mỗi kỹ năng 0–50, quy đổi band RIÊNG theo kỹ năng. Grammar(1)=Core: có điểm, KHÔNG band.
// scaled dùng xấp xỉ tuyến tính (% × 0.5) — KHÔNG phải scaled thật của Aptis → UI gắn nhãn "(ước lượng)".
// ============================================================

export type Cefr = 'A0' | 'A1' | 'A2' | 'B1' | 'B2' | 'C1';

// Tên hiển thị theo skillId
export const SKILL_NAME: Record<number, string> = {
  1: 'Ngữ pháp & Từ vựng',
  2: 'Nghe',
  3: 'Đọc',
  4: 'Viết',
  5: 'Nói',
};

// Ranh giới band theo thang 0–50 từng kỹ năng. Grammar(1) KHÔNG có bảng → không band.
const BANDS: Record<number, { band: Cefr; max: number }[]> = {
  2: [{ band: 'A0', max: 7 }, { band: 'A1', max: 15 }, { band: 'A2', max: 23 }, { band: 'B1', max: 33 }, { band: 'B2', max: 41 }, { band: 'C1', max: 50 }],
  3: [{ band: 'A0', max: 7 }, { band: 'A1', max: 15 }, { band: 'A2', max: 25 }, { band: 'B1', max: 37 }, { band: 'B2', max: 45 }, { band: 'C1', max: 50 }],
  4: [{ band: 'A0', max: 5 }, { band: 'A1', max: 17 }, { band: 'A2', max: 25 }, { band: 'B1', max: 39 }, { band: 'B2', max: 47 }, { band: 'C1', max: 50 }],
  5: [{ band: 'A0', max: 3 }, { band: 'A1', max: 15 }, { band: 'A2', max: 25 }, { band: 'B1', max: 40 }, { band: 'B2', max: 47 }, { band: 'C1', max: 50 }],
};

export const ORDER: Cefr[] = ['A0', 'A1', 'A2', 'B1', 'B2', 'C1'];

// Tra band CEFR từ điểm scaled 0–50. Grammar(1) trả null (Core không xếp band).
export const scaledToCefr = (skillId: number, scaled: number): Cefr | null => {
  const table = BANDS[skillId];
  if (!table) return null;
  const s = Math.max(0, Math.min(50, Math.round(scaled)));
  return table.find((r) => s <= r.max)?.band ?? 'C1';
};

// Ước lượng tuyến tính: % đúng (0–100) -> 0–50.
export const percentToScaled = (percent: number) => Math.round((Math.max(0, Math.min(100, percent)) / 100) * 50);

// Chuẩn hoá band thô từ AI về A0…C1: 'C'/'C2' -> 'C1'; không hợp lệ -> null.
export const normalizeBand = (raw?: string | null): Cefr | null => {
  if (!raw) return null;
  const up = raw.trim().toUpperCase();
  if (up === 'C' || up === 'C2') return 'C1';
  return (ORDER as string[]).includes(up) ? (up as Cefr) : null;
};

// Overall = trung bình làm tròn band 4 kỹ năng (Listening/Reading/Writing/Speaking).
// Bắt buộc đủ đúng 4 band; thiếu hoặc null bất kỳ -> null (không tính từ tập còn lại).
export const averageCefr = (bands: (Cefr | null)[]): Cefr | null => {
  if (bands.length !== 4 || bands.some((b) => b === null)) return null;
  const idx = (bands as Cefr[]).map((b) => ORDER.indexOf(b));
  return ORDER[Math.round(idx.reduce((a, b) => a + b, 0) / idx.length)];
};

// Màu tag theo band (dùng cho antd Tag)
export const cefrTagColor = (band: Cefr | null): string => {
  switch (band) {
    case 'C1': return 'magenta';
    case 'B2': return 'green';
    case 'B1': return 'cyan';
    case 'A2': return 'blue';
    case 'A1': return 'orange';
    case 'A0': return 'red';
    default: return 'default';
  }
};
