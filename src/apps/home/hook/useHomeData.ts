import { useState, useEffect } from 'react';
import { IHomeStats, ILearningModule, IUserInfo } from '../services/types';

export const useHomeData = () => {
  const [stats, setStats] = useState<IHomeStats>({
    overallProgress: 26,
    completedModules: 4,
    totalModules: 15,
    targetLevel: 'B2',
  });

  const [modules, setModules] = useState<ILearningModule[]>([
    {
      id: 'focus',
      title: 'Trọng tâm',
      description: 'Bài tập mục tiêu cho các kỹ năng yếu nhất dựa trên kết quả chẩn đoán.',
      icon: 'center_focus_strong',
      duration: 'Cá nhân hóa',
      color: 'red',
      path: '/practice/focus'
    },
    {
      id: 'grammar',
      title: 'Ngữ pháp & Từ vựng',
      description: 'Nắm vững kiến thức cốt lõi, cấu trúc câu và danh sách từ vựng.',
      icon: 'spellcheck',
      duration: '25 Phút',
      color: 'orange',
      path: '/practice/grammar'
    },
    {
      id: 'reading',
      title: 'Đọc',
      description: 'Cải thiện khả năng đọc hiểu qua các bài đọc đa dạng và bài báo phức tạp.',
      icon: 'auto_stories',
      duration: '35 Phút',
      color: 'blue',
      path: '/practice/reading'
    },
    {
      id: 'listening',
      title: 'Nghe',
      description: 'Luyện tập hiểu tiếng Anh nói trong nhiều ngữ cảnh và giọng điệu khác nhau.',
      icon: 'headphones',
      duration: '40 Phút',
      color: 'purple',
      path: '/practice/listening'
    },
    {
      id: 'speaking',
      title: 'Nói',
      description: 'Mô phỏng thi nói. Trả lời câu hỏi gợi ý và miêu tả tranh.',
      icon: 'mic',
      duration: '12 Phút',
      color: 'teal',
      path: '/practice/speaking'
    },
    {
      id: 'writing',
      title: 'Viết',
      description: 'Phát triển kỹ năng từ viết tin nhắn thông thường đến bài luận trang trọng.',
      icon: 'edit_document',
      duration: '50 Phút',
      color: 'green',
      path: '/practice/writing'
    }
  ]);

  const [userInfo, setUserInfo] = useState<IUserInfo>({
    name: 'Thí sinh',
    plan: 'Miễn phí',
    avatarLetter: 'T',
    onlineStudents: 1245
  });

  return {
    stats,
    modules,
    userInfo,
    isLoading: false
  };
};
