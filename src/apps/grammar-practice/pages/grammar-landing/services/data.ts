import React from 'react';
import { BookOutlined, FormOutlined } from '@ant-design/icons';
import { IPracticePart } from '../components/PartCard';

export const grammarParts: IPracticePart[] = [
  {
    id: 'g1',
    title: 'Phần 1',
    subTitle: 'Ngữ pháp (Grammar)',
    difficulty: 'medium',
    description: 'Trả lời 25 câu hỏi trắc nghiệm. Đọc kỹ từng câu hoàn chỉnh trước khi chọn phương án phù hợp nhất. Bạn có thể đánh dấu các câu khó để xem lại sau.',
    progress: 0,
    icon: React.createElement(BookOutlined),
    theme: { bgColor: '#e6f4ff', textColor: '#1677ff', borderColor: '#e5e7eb' }
  },
  {
    id: 'g2',
    title: 'Phần 2',
    subTitle: 'Từ vựng (Vocabulary)',
    difficulty: 'medium',
    description: 'Hoàn thành 25 câu hỏi bao gồm định nghĩa, từ đồng nghĩa, cách dùng từ trong ngữ cảnh và các cụm từ thường đi cùng nhau. Dựa vào ngữ cảnh để chọn đáp án tự nhiên nhất.',
    progress: 0,
    icon: React.createElement(FormOutlined),
    theme: { bgColor: '#f6ffed', textColor: '#52c41a', borderColor: '#e5e7eb' }
  }
];

export const mockTestsData = [
  { id: 'm1', title: 'Đề Ngữ pháp & Từ vựng số 1', questions: 50, duration: 25, difficulty: 'medium' as const },
  { id: 'm2', title: 'Đề Ngữ pháp & Từ vựng số 2', questions: 50, duration: 25, difficulty: 'hard' as const },
  { id: 'm3', title: 'Đề Ngữ pháp & Từ vựng số 3', questions: 50, duration: 25, difficulty: 'easy' as const }
];
