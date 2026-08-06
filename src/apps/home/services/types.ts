// Giá trị hiển thị đã chuẩn hoá cho 4 thẻ thống kê ở dashboard.
// Dạng chuỗi để bao trọn mọi trạng thái: số liệu thật, đang tải ("…"), hoặc chưa có/khách ("—").
export interface IHomeStatsView {
  overallProgress: string;
  learningStreak: string;
  targetLevel: string;
  predictedScore: string;
}

export interface ILearningModule {
  id: string;
  title: string;
  description: string;
  icon: string;
  duration: string;
  tag?: string;
  color: "red" | "orange" | "blue" | "purple" | "teal" | "green";
  path: string;
}

export interface IUserInfo {
  name: string;
  plan: string;
  avatarLetter: string;
  onlineStudents: number;
}
