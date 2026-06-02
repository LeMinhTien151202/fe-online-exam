import React from 'react';
import { AlignLeftOutlined, UnorderedListOutlined, FileTextOutlined, CopyOutlined } from '@ant-design/icons';
import { IPracticePart } from '../components/PartCard';

export const readingParts: Omit<IPracticePart, 'progress'>[] = [
  {
    id: 'r1',
    title: 'Phần 1',
    subTitle: 'Đọc hiểu câu (Sentence Comprehension)',
    difficulty: 'easy',
    description: 'Chọn từ thích hợp để điền vào chỗ trống trong các câu ngắn, tập trung vào từ vựng cơ bản và cấu trúc ngữ pháp quen thuộc.',
    icon: React.createElement(AlignLeftOutlined),
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 'r2',
    title: 'Phần 2',
    subTitle: 'Sắp xếp đoạn văn (Text Cohesion)',
    difficulty: 'medium',
    description: 'Sắp xếp lại các câu bị xáo trộn để tạo thành một đoạn văn có nghĩa, kiểm tra khả năng hiểu mạch lạc và tính liên kết.',
    icon: React.createElement(UnorderedListOutlined),
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 'r3',
    title: 'Phần 3',
    subTitle: 'Đọc hiểu đoạn văn ngắn (Short Text Comprehension)',
    difficulty: 'hard',
    description: 'Đọc các đoạn văn ngắn và chọn đáp án đúng để hoàn thành câu, yêu cầu hiểu ý chính và chi tiết cụ thể trong văn bản.',
    icon: React.createElement(FileTextOutlined),
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 'r4',
    title: 'Phần 4',
    subTitle: 'Đọc hiểu đoạn văn dài (Long Text Comprehension)',
    difficulty: 'hard',
    description: 'Ghép các tiêu đề phù hợp với các đoạn văn trong một văn bản dài. Đòi hỏi kỹ năng đọc lướt, hiểu cấu trúc và tổng hợp ý chính toàn bài.',
    icon: React.createElement(CopyOutlined),
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const mockTestsData = [
  { id: 'm1', title: 'Đề Đọc hiểu số 1', questions: 24, duration: 35, difficulty: 'medium' as const },
  { id: 'm2', title: 'Đề Đọc hiểu số 2', questions: 24, duration: 35, difficulty: 'hard' as const },
  { id: 'm3', title: 'Đề Đọc hiểu số 3', questions: 24, duration: 35, difficulty: 'easy' as const }
];
