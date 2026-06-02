import React from 'react';
import { AudioOutlined, TeamOutlined, MessageOutlined, BookOutlined } from '@ant-design/icons';
import { IPracticePart } from '../components/PartCard';

export const listeningPartsData: Omit<IPracticePart, 'progress'>[] = [
  {
    id: 'l1',
    title: 'Phần 1',
    subTitle: 'Questions 1 - 13',
    difficulty: 'easy',
    description: 'Identify specific information like phone numbers, times, or locations from short messages or brief dialogues.',
    icon: React.createElement(AudioOutlined),
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 'l2',
    title: 'Phần 2',
    subTitle: 'Question 14',
    difficulty: 'medium',
    description: 'Listen to four short monologues on a shared topic and match each speaker to the correct piece of information.',
    icon: React.createElement(TeamOutlined),
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 'l3',
    title: 'Phần 3',
    subTitle: 'Question 15',
    difficulty: 'medium',
    description: 'Hear a man and a woman discuss a topic, then determine which speaker expresses each opinion.',
    icon: React.createElement(MessageOutlined),
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 'l4',
    title: 'Phần 4',
    subTitle: 'Questions 16 - 17',
    difficulty: 'hard',
    description: 'Listen to two longer monologues on different topics and identify each speaker\'s viewpoint on specific aspects.',
    icon: React.createElement(BookOutlined),
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const mockTestsData = [
  { id: 'm1', title: 'Đề Nghe hiểu số 1', questions: 25, duration: 40, difficulty: 'medium' as const },
  { id: 'm2', title: 'Đề Nghe hiểu số 2', questions: 25, duration: 40, difficulty: 'hard' as const },
  { id: 'm3', title: 'Đề Nghe hiểu số 3', questions: 25, duration: 40, difficulty: 'easy' as const }
];
