import { toast } from '../../configs/toast';
import {
  useState } from 'react';
import {
  IAiGradeDetail,
  ISubmitAnswer,
  SubmitResponseValue,
  useSubmitExamMutation,
} from '@/shared/services/student-exam';

interface GradeOneParams {
  key: string; // khoá cục bộ để lưu kết quả theo câu/bộ đang hiển thị
  examId: number | null | undefined;
  questionId: number | null | undefined;
  response: SubmitResponseValue; // URL (P1) hoặc mảng URL (P2/P3/P4)
}

// Chấm NGAY 1 câu/bộ trong luyện theo phần: nộp riêng câu đó lên BE (AI chấm & trả về liền),
// giữ kết quả theo `key` để hiển thị điểm/band/nhận xét ngay dưới câu vừa làm.
export const usePerQuestionGrading = () => {
  const submitMutation = useSubmitExamMutation();
  const [grades, setGrades] = useState<Record<string, IAiGradeDetail>>({});
  const [gradingKey, setGradingKey] = useState<string | null>(null);

  const gradeOne = async ({ key, examId, questionId, response }: GradeOneParams) => {
    if (!examId || questionId == null) {
      toast.warning('Chưa sẵn sàng để chấm câu này.');
      return;
    }
    setGradingKey(key);
    try {
      const answer: ISubmitAnswer = { questionId, response };
      const result = await submitMutation.mutateAsync({ examId, payload: { answers: [answer] } });
      const aiResults = Array.isArray(result.ai) ? result.ai : [];
      const ai = aiResults.find((a) => a.questionId === questionId) ?? aiResults[0] ?? null;
      if (!ai) {
        toast.info('Chưa có kết quả chấm cho câu này.');
        return;
      }
      setGrades((prev) => ({ ...prev, [key]: ai }));
      toast.success(`Đã chấm xong: ${ai.aiScore}/100`);
    } catch {
      // Interceptor axios đã hiện notification lỗi.
    } finally {
      setGradingKey(null);
    }
  };

  // Bỏ kết quả của 1 câu để người học làm lại câu đó.
  const resetGrade = (key: string) => {
    setGrades((prev) => {
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  return { grades, gradingKey, gradeOne, resetGrade };
};
