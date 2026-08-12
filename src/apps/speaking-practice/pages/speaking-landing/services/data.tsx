import React from 'react';
import { 
  AudioOutlined, 
  UnorderedListOutlined, 
  MessageOutlined, 
  TeamOutlined 
} from '@ant-design/icons';
import { IPracticePart } from '../components/PartCard';

export const speakingPartsData: Omit<IPracticePart, 'progress'>[] = [
  {
    id: 's1',
    title: 'Phần 1',
    subTitle: 'Giới thiệu bản thân (Personal Information)',
    difficulty: 'easy',
    description: 'Trả lời 3 câu hỏi cá nhân về bản thân và sở thích của bạn. Nói khoảng 30 giây mỗi câu, rõ ràng và tự nhiên.',
    icon: <AudioOutlined />,
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 's2',
    title: 'Phần 2',
    subTitle: 'Mô tả & Nêu ý kiến (Describe & Opinion)',
    difficulty: 'medium',
    description: 'Mô tả một bức tranh và trả lời hai câu hỏi mở rộng. Chia sẻ trải nghiệm cá nhân và mở rộng chủ đề trong khoảng 45 giây mỗi câu.',
    icon: <UnorderedListOutlined />,
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 's3',
    title: 'Phần 3',
    subTitle: 'So sánh & Giải thích (Compare & Contrast)',
    difficulty: 'medium',
    description: 'So sánh hai bức tranh liên quan và trả lời hai câu hỏi yêu cầu nêu ý kiến hoặc suy đoán. Hãy trả lời có bố cục rõ ràng trong khoảng 45 giây.',
    icon: <MessageOutlined />,
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 's4',
    title: 'Phần 4',
    subTitle: 'Thảo luận chủ đề trừu tượng (Abstract Topic)',
    difficulty: 'hard',
    description: 'Chuẩn bị trong 1 phút, sau đó nói trong 2 phút cho ba câu hỏi về một chủ đề trừu tượng. Dùng thời gian chuẩn bị để phác ý và ghi lại các ý chính.',
    icon: <TeamOutlined />,
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const mockTestsData = [
  { id: 'm1', title: 'Đề Nói số 1', questions: 12, duration: 20, difficulty: 'medium' as const },
  { id: 'm2', title: 'Đề Nói số 2', questions: 12, duration: 20, difficulty: 'hard' as const },
  { id: 'm3', title: 'Đề Nói số 3', questions: 12, duration: 20, difficulty: 'easy' as const }
];
