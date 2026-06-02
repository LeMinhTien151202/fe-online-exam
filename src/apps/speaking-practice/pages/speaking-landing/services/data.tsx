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
    subTitle: 'Sentence Comprehension',
    difficulty: 'easy',
    description: 'Answer three personal questions about yourself and your interests. Aim for ~30 seconds each, keeping it clear and natural.',
    icon: <AudioOutlined />,
    theme: { bgColor: '#e0f2fe', textColor: '#0284c7', borderColor: '#e5e7eb' }
  },
  {
    id: 's2',
    title: 'Phần 2',
    subTitle: 'Describe, Express Opinion & Explain',
    difficulty: 'medium',
    description: 'Describe a photo and answer two follow-up questions. Share your experience and broaden the topic for about 45 seconds each.',
    icon: <UnorderedListOutlined />,
    theme: { bgColor: '#e0e7ff', textColor: '#4f46e5', borderColor: '#e5e7eb' }
  },
  {
    id: 's3',
    title: 'Phần 3',
    subTitle: 'Compare & Provide Reasons',
    difficulty: 'medium',
    description: 'Compare two related photos and respond to two questions asking for opinions or speculation. Target a structured 45-second answer.',
    icon: <MessageOutlined />,
    theme: { bgColor: '#ffedd5', textColor: '#ea580c', borderColor: '#e5e7eb' }
  },
  {
    id: 's4',
    title: 'Phần 4',
    subTitle: 'Discuss Experience & Opinion',
    difficulty: 'hard',
    description: 'Prepare for one minute, then speak for two minutes on three questions about an abstract topic. Use prep time to outline and note key ideas.',
    icon: <TeamOutlined />,
    theme: { bgColor: '#f3e8ff', textColor: '#9333ea', borderColor: '#e5e7eb' }
  }
];

export const mockTestsData = [
  { id: 'm1', title: 'Đề Nói số 1', questions: 12, duration: 20, difficulty: 'medium' as const },
  { id: 'm2', title: 'Đề Nói số 2', questions: 12, duration: 20, difficulty: 'hard' as const },
  { id: 'm3', title: 'Đề Nói số 3', questions: 12, duration: 20, difficulty: 'easy' as const }
];
