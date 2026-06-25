export const initialPartExams = [
  {
    key: "1",
    name: "Đề luyện tập Đọc hiểu Phần 1 - Sentence Completion #1",
    skill: "Reading",
    part: "Phần 1",
    questionCount: 5,
    duration: 10,
    difficulty: "easy",
    tryCount: 412,
    avgScore: "84%",
    status: "active",
  },
  {
    key: "2",
    name: "Đề ôn tập Ngữ pháp tổng hợp Part 1 #3",
    skill: "Grammar",
    part: "Part 1",
    questionCount: 25,
    duration: 25,
    difficulty: "medium",
    tryCount: 850,
    avgScore: "68%",
    status: "active",
  },
  {
    key: "3",
    name: "Đề ôn tập Viết Thư Part 4 #2",
    skill: "Writing",
    part: "Phần 4",
    questionCount: 2,
    duration: 30,
    difficulty: "hard",
    tryCount: 154,
    avgScore: "55%",
    status: "draft",
  },
];

export const initialSetExams = [
  {
    key: "1",
    name: "Bộ đề Aptis Reading 2026 - Đề số 1",
    skill: "Reading",
    partCount: 4,
    questionCount: 25,
    duration: 35,
    difficulty: "medium",
    tryCount: 310,
    avgScore: "72%",
    status: "active",
  },
  {
    key: "2",
    name: "Bộ đề Aptis Listening 2026 - Đề số 1",
    skill: "Listening",
    partCount: 4,
    questionCount: 25,
    duration: 40,
    difficulty: "medium",
    tryCount: 285,
    avgScore: "65%",
    status: "active",
  },
  {
    key: "3",
    name: "Bộ đề Aptis Writing 2026 - Đề số 2",
    skill: "Writing",
    partCount: 4,
    questionCount: 4,
    duration: 50,
    difficulty: "hard",
    tryCount: 198,
    avgScore: "58%",
    status: "draft",
  },
];

export const initialFullExams = [
  {
    key: "1",
    name: "Đề thi thử Aptis Full Test #1 (Chuẩn B1/B2)",
    skills: ["Grammar", "Reading", "Listening", "Speaking", "Writing"],
    duration: 175,
    difficulty: "medium",
    tryCount: 1200,
    status: "active",
  },
  {
    key: "2",
    name: "Đề thi thử Aptis Full Test #2 (Nâng cao C1)",
    skills: ["Grammar", "Reading", "Listening", "Speaking", "Writing"],
    duration: 180,
    difficulty: "hard",
    tryCount: 450,
    status: "active",
  },
];

export const mockBankQuestions = [
  // Grammar (MCQ 3 choices)
  {
    key: "g1",
    content: "Grammar Q1: (A1) She ___ a student. (is/am/are)",
    difficulty: "A1",
    type: "Grammar",
    part: "Part 1",
  },
  {
    key: "g2",
    content: "Grammar Q2: (B1) If I ___ you, I would take that offer.",
    difficulty: "B1",
    type: "Grammar",
    part: "Part 1",
  },
  {
    key: "g3",
    content:
      "Grammar Q3: (C1) Scarcely ___ I left the house when it started raining.",
    difficulty: "C",
    type: "Grammar",
    part: "Part 1",
  },
  {
    key: "g4",
    content: "Grammar Q4: (B2) By this time next year, they ___ the project.",
    difficulty: "B2",
    type: "Grammar",
    part: "Part 1",
  },

  // Vocab Task 1 (Definition)
  {
    key: "v1t1",
    content: "Vocab T1: (Matching) A person who studies the stars and planets.",
    difficulty: "B1",
    type: "Vocabulary",
    part: "Part 2",
    task: "Task 1",
  },
  {
    key: "v2t1",
    content:
      "Vocab T1: (Matching) A scientific instrument for measuring temperature.",
    difficulty: "B1",
    type: "Vocabulary",
    part: "Part 2",
    task: "Task 1",
  },

  // Vocab Task 2 (Collocation)
  {
    key: "v1t2",
    content: "Vocab T2: (Matching) make a ____ (decision/choice/mistake)",
    difficulty: "A2",
    type: "Vocabulary",
    part: "Part 2",
    task: "Task 2",
  },
  {
    key: "v2t2",
    content: "Vocab T2: (Matching) keep an eye ____ (on/at/to)",
    difficulty: "B1",
    type: "Vocabulary",
    part: "Part 2",
    task: "Task 2",
  },

  // Vocab Task 3 (Sentence Completion)
  {
    key: "v1t3",
    content:
      "Vocab T3: (Gap fill) The economic ____ has led to higher unemployment.",
    difficulty: "B2",
    type: "Vocabulary",
    part: "Part 2",
    task: "Task 3",
  },

  // Vocab Task 4 (Synonyms)
  {
    key: "v1t4",
    content: "Vocab T4: (Matching) Huge - ? (Enormous)",
    difficulty: "B2",
    type: "Vocabulary",
    part: "Part 2",
    task: "Task 4",
  },

  // Vocab Task 5 (Antonyms)
  {
    key: "v1t5",
    content: "Vocab T5: (Matching) Artificial - ? (Natural)",
    difficulty: "B2",
    type: "Vocabulary",
    part: "Part 2",
    task: "Task 5",
  },

  // Reading Part 1 (Sentence Comprehension)
  {
    key: "rp1_1",
    content: "Reading P1: Social Email - Meet at the park (5 questions)",
    difficulty: "A1",
    type: "Reading",
    part: "Part 1",
  },

  // Reading Part 2 (Cohesion Task 1)
  {
    key: "rp2_1",
    content: "Reading P2: Task 1 - Story of a famous explorer (6 sentences)",
    difficulty: "A2",
    type: "Reading",
    part: "Part 2",
  },

  // Reading Part 3 (Cohesion Task 2)
  {
    key: "rp3_1",
    content: "Reading P3: Task 2 - History of Coffee (6 sentences)",
    difficulty: "B1",
    type: "Reading",
    part: "Part 3",
  },

  // Reading Part 4 (Short Text)
  {
    key: "rp4_1",
    content: "Reading P4: Biography of Marie Curie (7 gaps, 10 options)",
    difficulty: "B2",
    type: "Reading",
    part: "Part 4",
  },

  // Reading Part 5 (Long Text)
  {
    key: "rp5_1",
    content:
      "Reading P5: Future of Artificial Intelligence (7 paras, 8 headings)",
    difficulty: "C",
    type: "Reading",
    part: "Part 5",
  },

  // --- Listening Questions ---
  {
    key: "l-p1-1",
    type: "Listening",
    part: "Part 1",
    content: "[Audio 1] What time is the train leaving?",
    difficulty: "A1",
  },
  {
    key: "l-p1-2",
    type: "Listening",
    part: "Part 1",
    content: "[Audio 2] How much is the ticket?",
    difficulty: "A2",
  },
  {
    key: "l-p2-1",
    type: "Listening",
    part: "Part 2",
    content: "[Speaker 1-4] Information Matching Task - Vacation Opinions",
    difficulty: "B1",
  },
  {
    key: "l-p3-1",
    type: "Listening",
    part: "Part 3",
    content: "[Dialogue] Opinion Matching - Choosing a School",
    difficulty: "B2",
  },
  {
    key: "l-p4-1",
    type: "Listening",
    part: "Part 4",
    content: "[Monologue] Professional Presentation - Product Launch",
    difficulty: "C",
  },
  // --- Speaking Questions ---
  {
    key: "s-p1-1",
    type: "Speaking",
    part: "Part 1",
    content: "[Task P1] Personal Info: Hobbies, Family, Daily Routine",
    difficulty: "A2",
  },
  {
    key: "s-p2-1",
    type: "Speaking",
    part: "Part 2",
    content: "[Task P2] Single Photo (Cleaning beach) + 3 Questions",
    difficulty: "B1",
  },
  {
    key: "s-p3-1",
    type: "Speaking",
    part: "Part 3",
    content: "[Task P3] Two Photos (Online vs Offline Learning) + 3 Questions",
    difficulty: "B2",
  },
  {
    key: "s-p4-1",
    type: "Speaking",
    part: "Part 4",
    content: "[Task P4] Abstract Topic: Importance of teamwork",
    difficulty: "C",
  },
  // --- Writing Questions ---
  {
    key: "w-p1-1",
    type: "Writing",
    part: "Part 1",
    content: "[Task P1] Travel Club: 5 Personal Info Questions",
    difficulty: "A1",
  },
  {
    key: "w-p2-1",
    type: "Writing",
    part: "Part 2",
    content:
      "[Task P2] Travel Club: Write about your travel interests (20-30 words)",
    difficulty: "A2",
  },
  {
    key: "w-p3-1",
    type: "Writing",
    part: "Part 3",
    content: "[Task P3] Travel Club: 3 Chat responses to Member A, B, C",
    difficulty: "B2",
  },
  {
    key: "w-p4-1",
    type: "Writing",
    part: "Part 4",
    content:
      "[Task P4] Travel Club: Informal & Formal Emails regarding trip cancellation",
    difficulty: "C",
  },
];
