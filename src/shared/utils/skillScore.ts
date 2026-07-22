// Suy điểm + CEFR theo kỹ năng từ kết quả nộp bài của BE (IExamSubmitResult).
// Dùng chung cho thi thử 5 kỹ năng (mock-exam) và luyện theo bộ đề 1 kỹ năng (SKILL_FULL_SET).
import { IExamSubmitResult, ISkillScore } from '../services/student-exam';
import { Cefr, SKILL_NAME, averageCefr, normalizeBand, percentToScaled, scaledToCefr } from './cefrScale';

export const AI_SKILLS = [4, 5]; // Viết, Nói

// Trung bình aiScore theo Part trước, rồi trung bình các Part (tránh lệch do Part nhiều dòng câu hỏi).
const averageAiByPart = (
  rows: { partNumber?: number; aiScore: number | null; band: string | null; needsManualReview: boolean }[],
): { aiScore: number | null } => {
  if (rows.length === 0) return { aiScore: null };
  // Còn câu chờ chấm tay -> kỹ năng chưa có band hoàn chỉnh.
  if (rows.some((r) => r.needsManualReview || r.aiScore == null)) return { aiScore: null };

  const byPart = new Map<number, number[]>();
  rows.forEach((r) => {
    const p = r.partNumber ?? 0;
    if (!byPart.has(p)) byPart.set(p, []);
    byPart.get(p)!.push(r.aiScore as number);
  });

  const partAvgs = [...byPart.values()].map((arr) => arr.reduce((a, b) => a + b, 0) / arr.length);
  const aiScore = Math.round(partAvgs.reduce((a, b) => a + b, 0) / partAvgs.length);
  return { aiScore };
};

// Suy toàn bộ kỹ năng có trong review nóng (nếu BE chưa trả sẵn skills[]).
export const deriveSkillScores = (
  result: IExamSubmitResult,
): { skills: ISkillScore[]; overallCefr: Cefr | null } => {
  const skills: ISkillScore[] = [];

  // Trắc nghiệm (Grammar 1, Nghe 2, Đọc 3): gộp earned/total theo skillId.
  const autoBySkill = new Map<number, { earned: number; total: number }>();
  result.details.forEach((d) => {
    if (d.skillId == null) return;
    const cur = autoBySkill.get(d.skillId) ?? { earned: 0, total: 0 };
    cur.earned += d.earned;
    cur.total += d.total;
    autoBySkill.set(d.skillId, cur);
  });
  autoBySkill.forEach(({ earned, total }, skillId) => {
    const percent = total > 0 ? (earned / total) * 100 : 0;
    const scaled = percentToScaled(percent);
    skills.push({
      skillId,
      name: SKILL_NAME[skillId] ?? `Kỹ năng ${skillId}`,
      earned,
      total,
      scaled,
      cefr: scaledToCefr(skillId, scaled), // Grammar(1) -> null
    });
  });

  // AI (Viết 4, Nói 5): trung bình theo Part.
  AI_SKILLS.forEach((skillId) => {
    const rows = result.ai.filter((a) => a.skillId === skillId);
    if (rows.length === 0) return;
    const { aiScore } = averageAiByPart(rows);
    if (aiScore == null) {
      skills.push({ skillId, name: SKILL_NAME[skillId], aiScore: null, scaled: 0, cefr: null });
      return;
    }
    const scaled = percentToScaled(aiScore);
    const aiBands = rows.map((r) => normalizeBand(r.band));
    const uniform = aiBands.every((b) => b && b === aiBands[0]) ? aiBands[0] : null;
    skills.push({
      skillId,
      name: SKILL_NAME[skillId],
      aiScore,
      scaled,
      cefr: uniform ?? scaledToCefr(skillId, scaled),
    });
  });

  skills.sort((a, b) => a.skillId - b.skillId);

  const bandOf = (skillId: number) => skills.find((s) => s.skillId === skillId)?.cefr ?? null;
  const overallCefr = averageCefr([bandOf(2), bandOf(3), bandOf(4), bandOf(5)]);

  return { skills, overallCefr };
};

// Lấy skills + overallCefr: ưu tiên BE trả sẵn, fallback tự suy.
export const resolveSkillScores = (
  result: IExamSubmitResult,
): { skills: ISkillScore[]; overallCefr: Cefr | null } => {
  if (result.skills?.length) {
    return { skills: result.skills, overallCefr: result.overallCefr ?? null };
  }
  return deriveSkillScores(result);
};

// Điểm/CEFR của ĐÚNG 1 kỹ năng (dùng cho luyện theo bộ đề — SKILL_FULL_SET).
export const singleSkillScore = (result: IExamSubmitResult, skillId: number): ISkillScore | null => {
  const { skills } = resolveSkillScores(result);
  return skills.find((s) => s.skillId === skillId) ?? null;
};

// Khi chỉ có % làm đúng (kỹ năng trắc nghiệm chấm cục bộ) -> scaled + band theo bảng kỹ năng.
export const percentToBand = (skillId: number, percent: number): { scaled: number; cefr: Cefr | null } => {
  const scaled = percentToScaled(percent);
  return { scaled, cefr: scaledToCefr(skillId, scaled) };
};
