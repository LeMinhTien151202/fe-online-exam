import { useState } from "react";
import {
  activityData,
  skillDistribution,
  recentStudents,
  recentTests,
  timelineEvents,
  questionStats,
  examCounts,
} from "../services/data";

export const useDashboard = () => {
  const [stats] = useState({
    totalStudents: 14820,
    dailyActivity: 1245,
    completedTests: 328,
    pendingGrading: 42,
    pendingMaterials: 8,
    totalQuestions: questionStats.total,
    totalExams: examCounts.total,
  });

  return {
    stats,
    activityData,
    skillDistribution,
    recentStudents,
    recentTests,
    timelineEvents,
    questionStats,
    examCounts,
  };
};
