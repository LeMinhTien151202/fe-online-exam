export const initialPartExams = [
  {
    key: '1',
    name: 'Đề luyện tập Đọc hiểu Phần 1 - Sentence Completion #1',
    skill: 'Reading',
    part: 'Phần 1',
    questionCount: 5,
    duration: 10,
    difficulty: 'easy',
    tryCount: 412,
    avgScore: '84%',
    status: 'active',
  },
  {
    key: '2',
    name: 'Đề ôn tập Ngữ pháp tổng hợp Part 1 #3',
    skill: 'Grammar',
    part: 'Part 1',
    questionCount: 25,
    duration: 25,
    difficulty: 'medium',
    tryCount: 850,
    avgScore: '68%',
    status: 'active',
  },
  {
    key: '3',
    name: 'Đề ôn tập Viết Thư Part 4 #2',
    skill: 'Writing',
    part: 'Phần 4',
    questionCount: 2,
    duration: 30,
    difficulty: 'hard',
    tryCount: 154,
    avgScore: '55%',
    status: 'draft',
  },
];

export const initialFullExams = [
  {
    key: '1',
    name: 'Đề thi thử Aptis Full Test #1 (Chuẩn B1/B2)',
    skills: ['Grammar', 'Reading', 'Listening', 'Speaking', 'Writing'],
    duration: 175,
    difficulty: 'medium',
    tryCount: 1200,
    status: 'active',
  },
  {
    key: '2',
    name: 'Đề thi thử Aptis Full Test #2 (Nâng cao C1)',
    skills: ['Grammar', 'Reading', 'Listening', 'Speaking', 'Writing'],
    duration: 180,
    difficulty: 'hard',
    tryCount: 450,
    status: 'active',
  },
];

export const mockBankQuestions = [
  { key: '1', content: 'Grammar Q1: Although she was tired, she completed the report.', difficulty: 'easy', type: 'Grammar' },
  { key: '2', content: 'Grammar Q2: Had I known the answer, I would have told you.', difficulty: 'hard', type: 'Grammar' },
  { key: '3', content: 'Vocab Q1: Synonyms for "Innovate" - Create, design, pioneer.', difficulty: 'medium', type: 'Vocabulary' },
  { key: '4', content: 'Vocab Q2: Fill in the blank: The team made a _______ breakthrough.', difficulty: 'medium', type: 'Vocabulary' },
  { key: '5', content: 'Reading Q1: Match correct matching title for paragraph A.', difficulty: 'easy', type: 'Reading' },
  { key: '6', content: 'Reading Q2: Short passage comprehension about environmental issues.', difficulty: 'hard', type: 'Reading' },
];

