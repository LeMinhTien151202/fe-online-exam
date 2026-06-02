import React from 'react';
import { BookOutlined, FormOutlined } from '@ant-design/icons';
import { IPracticePart } from '../components/PartCard';

export const grammarParts: IPracticePart[] = [
  {
    id: 'g1',
    title: 'Part 1: Grammar',
    subTitle: '25 Multiple-choice questions',
    difficulty: 'medium',
    description: 'Answer 25 multiple-choice questions. Read each complete sentence carefully before selecting the option that best completes it. Feel free to flag difficult items and revisit them later.',
    progress: 0,
    icon: React.createElement(BookOutlined),
    theme: { bgColor: '#e6f4ff', textColor: '#1677ff', borderColor: '#e5e7eb' }
  },
  {
    id: 'g2',
    title: 'Part 2: Vocabulary',
    subTitle: '25 Multiple-choice questions',
    difficulty: 'medium',
    description: 'Complete 25 questions covering definitions, synonyms, usage in context, and common word combinations. Use context clues to determine the most natural choice.',
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
