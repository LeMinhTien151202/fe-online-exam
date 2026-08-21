import { useMemo, useState } from "react";
import { IHomeStatsView, ILearningModule, IUserInfo } from "../services/types";
import {
  useMyAttemptsQuery,
  useMyStreakQuery,
  useOverallPartPracticeProgress,
} from '@/shared/services/student-exam';
import { DEFAULT_TARGET_CEFR } from '@/shared/utils/cefrScale';
import { useAppSelector } from '@/shared/store/hooks';

// Mục tiêu trình độ mặc định của nền tảng (chưa có API mục tiêu riêng theo học viên).
const DEFAULT_TARGET_LEVEL = DEFAULT_TARGET_CEFR;
const DASH = '—';

export const useHomeData = () => {
  const isAuthenticated = useAppSelector((s) => s.auth.isAuthenticated);

  // Chỉ gọi API khi đã đăng nhập — khách vãng lai không có dữ liệu cá nhân.
  const streakQuery = useMyStreakQuery(isAuthenticated);
  const attemptsQuery = useMyAttemptsQuery({ type: 'MOCK_TEST', page: 1, limit: 1 }, isAuthenticated);

  // Tiến độ tổng quan = TRUNG BÌNH % của toàn bộ 18 phần LUYỆN THEO PHẦN (mock test không tính).
  // Không cộng dồn /progress/me nữa: bảng đó chỉ có dòng cho phần đã từng nộp nên mẫu số thiếu
  // các phần chưa đụng tới, lại gộp cả những đề mà trang luyện không mở -> số hiển thị bị thổi lên
  // và không bao giờ khớp với % trên thẻ từng phần.
  const { percent: overallProgress, isPending: isProgressPending } =
    useOverallPartPracticeProgress(isAuthenticated);

  // Điểm dự đoán = trung bình tổng điểm các bài thi thử (MOCK_TEST) trên thang Aptis 0–200
  // (tổng scaled 4 kỹ năng từ snapshot skillCefr), nhất quán với Mock Exam Center.
  const predictedScore = attemptsQuery.data?.averageMockScore ?? null;

  // Giá trị hiển thị đã chuẩn hoá: khách vãng lai -> "—"; đang tải -> "…"; có dữ liệu -> giá trị thật.
  const stats = useMemo<IHomeStatsView>(() => {
    if (!isAuthenticated) {
      return {
        overallProgress: DASH,
        learningStreak: DASH,
        targetLevel: DASH,
        predictedScore: DASH,
      };
    }
    return {
      overallProgress: isProgressPending ? '…' : `${overallProgress}%`,
      learningStreak:
        streakQuery.isPending || streakQuery.isError ? DASH : `${streakQuery.data?.currentStreak ?? 0} ngày`,
      targetLevel: DEFAULT_TARGET_LEVEL,
      predictedScore: attemptsQuery.isPending
        ? '…'
        : predictedScore != null
          ? `${Math.round(predictedScore)}/200`
          : DASH,
    };
  }, [
    isAuthenticated,
    overallProgress,
    isProgressPending,
    streakQuery.isPending,
    streakQuery.isError,
    streakQuery.data?.currentStreak,
    attemptsQuery.isPending,
    predictedScore,
  ]);

  const [modules] = useState<ILearningModule[]>([
    {
      id: "focus",
      title: "Trọng tâm",
      description:
        "Bài tập mục tiêu cho các kỹ năng yếu nhất dựa trên kết quả chẩn đoán.",
      icon: "center_focus_strong",
      duration: "Cá nhân hóa",
      color: "red",
      path: "/practice/focus",
    },
    {
      id: "grammar",
      title: "Ngữ pháp & Từ vựng",
      description:
        "Nắm vững kiến thức cốt lõi, cấu trúc câu và danh sách từ vựng.",
      icon: "spellcheck",
      duration: "25 Phút",
      color: "orange",
      path: "/practice/grammar",
    },
    {
      id: "reading",
      title: "Đọc",
      description:
        "Cải thiện khả năng đọc hiểu qua các bài đọc đa dạng và bài báo phức tạp.",
      icon: "auto_stories",
      duration: "35 Phút",
      color: "blue",
      path: "/practice/reading",
    },
    {
      id: "listening",
      title: "Nghe",
      description:
        "Luyện tập hiểu tiếng Anh nói trong nhiều ngữ cảnh và giọng điệu khác nhau.",
      icon: "headphones",
      duration: "40 Phút",
      color: "purple",
      path: "/practice/listening",
    },
    {
      id: "speaking",
      title: "Nói",
      description: "Mô phỏng thi nói. Trả lời câu hỏi gợi ý và miêu tả tranh.",
      icon: "mic",
      duration: "12 Phút",
      color: "teal",
      path: "/practice/speaking",
    },
    {
      id: "writing",
      title: "Viết",
      description:
        "Phát triển kỹ năng từ viết tin nhắn thông thường đến bài luận trang trọng.",
      icon: "edit_document",
      duration: "50 Phút",
      color: "green",
      path: "/practice/writing",
    },
  ]);

  const [userInfo] = useState<IUserInfo>({
    name: "Thí sinh",
    plan: "Miễn phí",
    avatarLetter: "T",
    onlineStudents: 1245,
  });

  return {
    stats,
    modules,
    userInfo,
    isLoading: false,
  };
};
