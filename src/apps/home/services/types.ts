export interface IHomeStats {
  overallProgress: number;
  completedModules: number;
  totalModules: number;
  targetLevel: string;
  learningStreak: number;
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
