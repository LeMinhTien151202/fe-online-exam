import React from 'react';
import { AudioOutlined, TeamOutlined, MessageOutlined, BookOutlined } from '@ant-design/icons';
import { IPracticePart } from '../components/PartCard';

export const listeningPartsData: Omit<IPracticePart, 'progress'>[] = [
  {
    id: 'l1',
    title: 'Phần 1',
    subTitle: 'Nhận diện thông tin (Information Recognition)',
    difficulty: 'easy',
    description: 'Nhận diện các thông tin cụ thể như số điện thoại, thời gian hoặc địa điểm từ các tin nhắn ngắn hoặc đoạn hội thoại ngắn (câu 1 - 13).',
    icon: React.createElement(AudioOutlined),
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 'l2',
    title: 'Phần 2',
    subTitle: 'Ghép thông tin (Information Matching)',
    difficulty: 'medium',
    description: 'Nghe bốn đoạn độc thoại ngắn cùng một chủ đề và ghép mỗi người nói với thông tin phù hợp (câu 14).',
    icon: React.createElement(TeamOutlined),
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 'l3',
    title: 'Phần 3',
    subTitle: 'Ghép ý kiến (Opinion Matching)',
    difficulty: 'medium',
    description: 'Nghe một nam và một nữ thảo luận về một chủ đề, sau đó xác định mỗi người nói thể hiện quan điểm nào (câu 15).',
    icon: React.createElement(MessageOutlined),
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 'l4',
    title: 'Phần 4',
    subTitle: 'Nghe hiểu bài nói dài (Monologue Comprehension)',
    difficulty: 'hard',
    description: 'Nghe hai đoạn độc thoại dài về các chủ đề khác nhau và xác định quan điểm của mỗi người nói về từng khía cạnh cụ thể (câu 16 - 17).',
    icon: React.createElement(BookOutlined),
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const mockTestsData = [
  { id: 'm1', title: 'Đề Nghe hiểu số 1', questions: 25, duration: 40, difficulty: 'medium' as const },
  { id: 'm2', title: 'Đề Nghe hiểu số 2', questions: 25, duration: 40, difficulty: 'hard' as const },
  { id: 'm3', title: 'Đề Nghe hiểu số 3', questions: 25, duration: 40, difficulty: 'easy' as const }
];
