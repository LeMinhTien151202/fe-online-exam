// Điểm + CEFR theo kỹ năng cho thi thử. Logic dùng chung đã chuyển sang shared/utils/skillScore.
// Giữ file này để không phải sửa import cũ trong module mock-exam.
export { deriveSkillScores, resolveSkillScores, singleSkillScore, percentToBand } from '@/shared/utils/skillScore';
