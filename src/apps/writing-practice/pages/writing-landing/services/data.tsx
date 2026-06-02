import React from 'react';
import { 
  AlignLeftOutlined, 
  UnorderedListOutlined, 
  MessageOutlined, 
  MailOutlined 
} from '@ant-design/icons';
import { IPracticePart } from '../components/PartCard';

export const writingPartsData: Omit<IPracticePart, 'progress'>[] = [
  {
    id: 'w1',
    title: 'Part 1: Word-level Writing',
    subTitle: 'Viết cấp độ từ',
    difficulty: 'easy',
    description: 'Bạn sẽ tham gia một câu lạc bộ/nhóm và cần trả lời 5 câu hỏi ngắn bằng các từ hoặc cụm từ (1-5 từ/câu).',
    icon: <AlignLeftOutlined />,
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 'w2',
    title: 'Part 2: Short Text Writing',
    subTitle: 'Viết đoạn văn ngắn',
    difficulty: 'medium',
    description: 'Điền vào một biểu mẫu (form) của câu lạc bộ, yêu cầu viết các câu hoàn chỉnh (thường từ 20-30 từ).',
    icon: <UnorderedListOutlined />,
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 'w3',
    title: 'Part 3: Social Network Interaction',
    subTitle: 'Tương tác mạng xã hội',
    difficulty: 'medium',
    description: 'Bạn sẽ tương tác trong một nhóm chat/diễn đàn. Sẽ có 3 câu hỏi từ các thành viên khác và bạn cần trả lời mỗi câu (khoảng 30-40 từ/câu).',
    icon: <MessageOutlined />,
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 'w4',
    title: 'Part 4: Formal and Informal Emails',
    subTitle: 'Viết email trang trọng & thân mật',
    difficulty: 'hard',
    description: 'Bạn nhận được một thông báo về một vấn đề nào đó. Bạn phải viết 1 email ngắn gọn, thân mật cho một người bạn (khoảng 50 từ) và 1 email trang trọng gửi cho ban quản lý/công ty (khoảng 120-150 từ).',
    icon: <MailOutlined />,
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const mockTestsData = [
  { id: 'm1', title: 'Đề Viết số 1', questions: 11, duration: 50, difficulty: 'medium' as const },
  { id: 'm2', title: 'Đề Viết số 2', questions: 11, duration: 50, difficulty: 'hard' as const },
  { id: 'm3', title: 'Đề Viết số 3', questions: 11, duration: 50, difficulty: 'easy' as const }
];
