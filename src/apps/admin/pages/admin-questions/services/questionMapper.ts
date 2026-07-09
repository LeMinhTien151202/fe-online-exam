import {
  AgreementChoice,
  ICreateQuestionPayload,
  IQuestion,
  McOption,
  SkillRoute,
  SKILL_ID,
  WordBankVariant,
} from './types';

// ============================================================
// Mapper: giá trị Form (antd) -> payload API theo QUESTION_SAMPLES.md
// Mỗi form dùng mô hình "gộp" (VD Grammar 25 câu) -> trả về MẢNG payload.
// ============================================================

const ABC_TO_INDEX: Record<string, number> = { A: 0, B: 1, C: 2 };

const buildMcOptions = (optA: string, optB: string, optC: string, answer: string): McOption[] => [
  { content: optA, is_correct: answer === 'A' },
  { content: optB, is_correct: answer === 'B' },
  { content: optC, is_correct: answer === 'C' },
];

const VOCAB_VARIANT: Record<string, WordBankVariant> = {
  vocab_task1: 'DEFINITION',
  vocab_task2: 'COLLOCATION',
  vocab_task3: 'SENTENCE',
  vocab_task4: 'SYNONYM',
  vocab_task5: 'ANTONYM',
};

// Câu lệnh chuẩn APTIS cho từng task (dùng khi admin không nhập content riêng)
const VOCAB_INSTRUCTION: Record<WordBankVariant, string> = {
  DEFINITION: 'Complete each definition using a word from the list. Use each word once only. You will not need five of the words.',
  COLLOCATION: 'Select a word from the list that is most often used with the word on the left. Use each word once only. You will not need five of the words.',
  SENTENCE: 'Finish each sentence using a word from the list. Use each word once only. You will not need five of the words.',
  SYNONYM: 'Select a word from the list that has the most similar meaning to the word on the left.',
  ANTONYM: 'Select a word from the list that has the opposite meaning to the word on the left.',
};

const AGREEMENT: Record<string, AgreementChoice> = {
  man: 'MAN',
  woman: 'WOMAN',
  both: 'BOTH',
};

type FormValues = Record<string, unknown>;

const arr = <T>(v: unknown): T[] => (Array.isArray(v) ? (v as T[]) : []);
const str = (v: unknown): string => (typeof v === 'string' ? v : '');

// ---------- GRAMMAR (skillId 1) ----------
const buildGrammar = (v: FormValues): ICreateQuestionPayload[] => {
  const part = str(v.part) || 'grammar';

  if (part.startsWith('vocab_')) {
    const pool = arr<string>(v.vocabPool);
    const questions = arr<{ question: string; answerIndex: number }>(v.vocabQuestions);
    const variant = VOCAB_VARIANT[part];
    return [
      {
        skillId: SKILL_ID.grammar,
        partNumber: 2,
        // content = câu lệnh đề bài; mặc định theo chuẩn APTIS của từng task
        content: str(v.content) || VOCAB_INSTRUCTION[variant],
        extraConfig: {
          task_variant: variant,
          options_pool: pool,
          slots: questions.map((q, i) => ({
            slot_id: `s${i + 1}`,
            prompt: q.question,
            correct_answer: pool[q.answerIndex] ?? '',
          })),
        },
      },
    ];
  }

  // Grammar P1: 25 câu MC -> 25 bản ghi
  const grams = arr<{ content: string; optA: string; optB: string; optC: string; answer: string }>(
    v.gramQuestions
  );
  return grams
    .filter((q) => q && q.content)
    .map((q) => ({
      skillId: SKILL_ID.grammar,
      partNumber: 1,
      content: q.content,
      extraConfig: { options: buildMcOptions(q.optA, q.optB, q.optC, q.answer) },
    }));
};

// ---------- LISTENING (skillId 2) ----------
const buildListening = (v: FormValues): ICreateQuestionPayload[] => {
  const part = str(v.part) || 'part1';
  const mediaUrl = str(v.audioUrl) || undefined;

  // P1: mỗi câu = 1 bản ghi MC (audio riêng từng câu)
  if (part === 'part1') {
    const questions = arr<{ title: string; optA: string; optB: string; optC: string; correctAnswer: string }>(
      v.questions
    );
    return questions
      .filter((q) => q && q.title)
      .map((q) => ({
        skillId: SKILL_ID.listening,
        partNumber: 1,
        content: q.title,
        mediaUrl,
        extraConfig: { options: buildMcOptions(q.optA, q.optB, q.optC, q.correctAnswer) },
      }));
  }

  // P4: 1 bài nghe (1 audio dùng chung) = 1 bản ghi, gói các câu MC trong extraConfig.questions
  if (part === 'part4') {
    const questions = arr<{ title: string; optA: string; optB: string; optC: string; correctAnswer: string }>(
      v.questions
    ).filter((q) => q && q.title);
    return [
      {
        skillId: SKILL_ID.listening,
        partNumber: 4,
        content: str(v.content) || str(v.transcript) || 'Listen to the recording and answer the questions.',
        mediaUrl,
        extraConfig: {
          questions: questions.map((q) => ({
            question: q.title,
            options: buildMcOptions(q.optA, q.optB, q.optC, q.correctAnswer),
          })),
        },
      },
    ];
  }

  if (part === 'part2') {
    const pool = arr<{ text: string }>(v.opinionPool).map((o) => o.text);
    const answers = arr<number>(v.speakerAnswers);
    return [
      {
        skillId: SKILL_ID.listening,
        partNumber: 2,
        content: str(v.content) || 'Complete the sentences. Use each answer only once.',
        mediaUrl,
        extraConfig: {
          options_pool: pool,
          speakers: answers.map((idx, i) => ({
            speaker_index: i + 1,
            correct_answer: pool[idx] ?? '',
          })),
        },
      },
    ];
  }

  // part3: 1 hội thoại (audio chung) = 1 bản ghi, gom các nhận định vào extraConfig.statements
  const opinions = arr<{ text: string; answer: string }>(v.opinions).filter((o) => o && o.text);
  return [
    {
      skillId: SKILL_ID.listening,
      partNumber: 3,
      content: str(v.content) || 'Listen to the conversation. Who expresses each opinion?',
      mediaUrl,
      extraConfig: {
        choice_kind: 'SPEAKER_AGREEMENT' as const,
        statements: opinions.map((o) => ({ statement: o.text, correct: AGREEMENT[o.answer] })),
      },
    },
  ];
};

// ---------- READING (skillId 3) ----------
const buildReading = (v: FormValues): ICreateQuestionPayload[] => {
  const part = str(v.part) || 'part1';
  const title = str(v.title);

  // FE part1: 1 đoạn văn (passage) chứa ___(1)..(5) + 5 bộ đáp án -> 1 bản ghi gap-fill (partNumber 1)
  if (part === 'part1') {
    const gaps = arr<{ optA: string; optB: string; optC: string; answer: string }>(v.gaps);
    return [
      {
        skillId: SKILL_ID.reading,
        partNumber: 1,
        content: str(v.passage),
        extraConfig: {
          gaps: gaps.map((g, i) => ({
            gap_id: i + 1,
            options: [g.optA, g.optB, g.optC],
            correct_index: ABC_TO_INDEX[g.answer] ?? 0,
          })),
        },
      },
    ];
  }

  // FE part2: 2 bài sắp xếp -> set 0 vào partNumber 2, set 1 vào partNumber 3 (2 part ORDERING của API)
  if (part === 'part2') {
    const sets = arr<{ sentences: { text: string }[] }>(v.sets);
    return sets.map((set, idx) => {
      const pool = arr<{ text: string }>(set.sentences).map((s) => s.text);
      return {
        skillId: SKILL_ID.reading,
        partNumber: idx === 0 ? 2 : 3,
        content: title || 'Sắp xếp các câu thành đoạn văn hoàn chỉnh.',
        extraConfig: {
          fixed_first: true,
          options_pool: pool,
          correct_order: pool.map((_, i) => i),
        },
      };
    });
  }

  // FE part3: 4 người + 7 câu hỏi -> Reading P4 SPEAKER_MATCH (partNumber 4)
  if (part === 'part3') {
    const people = arr<{ name: string; content: string }>(v.people);
    const questions = arr<{ text: string; answerIndex: number }>(v.questions);
    const keyOf = (i: number) => String.fromCharCode(65 + i); // A, B, C, D
    return [
      {
        skillId: SKILL_ID.reading,
        partNumber: 4,
        content: title || 'Read the opinions, then answer the questions.',
        extraConfig: {
          people: people.map((p, i) => ({ key: keyOf(i), passage: p.content })),
          questions: questions.map((q) => ({
            statement: q.text,
            correct_person: keyOf(q.answerIndex),
          })),
        },
      },
    ];
  }

  // FE part4: 7 đoạn + 8 heading -> Reading P5 HEADING_MATCH (partNumber 5)
  const paragraphs = arr<{ content: string; headingIndex: number }>(v.paragraphs);
  const headings = arr<{ text: string }>(v.headings).map((h) => h.text);
  return [
    {
      skillId: SKILL_ID.reading,
      partNumber: 5,
      content: title || 'Match the headings to the paragraphs.',
      extraConfig: {
        // Form chưa thu thập "câu 0" mẫu -> sinh example tối thiểu, heading ví dụ KHÔNG nằm trong pool
        example: {
          paragraph_label: '0',
          paragraph_text: title || 'Example paragraph.',
          correct_heading: 'Example heading',
        },
        paragraphs: paragraphs.map((p, i) => ({ label: String(i + 1), text: p.content })),
        headings_pool: headings,
        answers: paragraphs.map((p, i) => ({
          paragraph_label: String(i + 1),
          correct_heading: headings[p.headingIndex] ?? '',
        })),
      },
    },
  ];
};

// ---------- WRITING (skillId 4) — mỗi part = 1 bản ghi, câu con gói trong extraConfig ----------
const buildWriting = (v: FormValues): ICreateQuestionPayload[] => {
  const part = str(v.part) || 'part1';
  const title = str(v.title);

  // P1: 5 câu -> prompts[{ question, sample_answer? }]
  if (part === 'part1') {
    const prompts = arr<{ question: string; sample: string }>(v.p1Questions)
      .filter((q) => q && q.question)
      .map((q) => ({ question: q.question, ...(q.sample ? { sample_answer: q.sample } : {}) }));
    return [
      {
        skillId: SKILL_ID.writing,
        partNumber: 1,
        content: title || 'Word-level Writing',
        extraConfig: { word_limit_min: 1, word_limit_max: 5, prompts },
      },
    ];
  }

  // P2: 1 đề duy nhất (+ sample_answer top-level)
  if (part === 'part2') {
    const sample = str(v.p2Sample);
    return [
      {
        skillId: SKILL_ID.writing,
        partNumber: 2,
        content: str(v.p2Prompt),
        extraConfig: { word_limit_min: 20, word_limit_max: 30, ...(sample ? { sample_answer: sample } : {}) },
      },
    ];
  }

  // P3: 3 câu Member A/B/C -> prompts[{ speaker_name, question, sample_answer? }]
  if (part === 'part3') {
    const prompts = arr<{ member: string; question: string; sample: string }>(v.p3MemberQuestions)
      .filter((m) => m && m.question)
      .map((m) => ({ speaker_name: m.member, question: m.question, ...(m.sample ? { sample_answer: m.sample } : {}) }));
    return [
      {
        skillId: SKILL_ID.writing,
        partNumber: 3,
        content: title || 'Social Media Chat',
        extraConfig: { word_limit_min: 30, word_limit_max: 40, prompts },
      },
    ];
  }

  // P4: 1 bản ghi, context (Notice) chung + tasks[2] (Informal + Formal, kèm sample_answer?)
  const infSample = str(v.p4InformalSample);
  const formSample = str(v.p4FormalSample);
  return [
    {
      skillId: SKILL_ID.writing,
      partNumber: 4,
      content: title || 'Formal & Informal Writing',
      extraConfig: {
        context: str(v.p4Notice),
        tasks: [
          {
            task_label: 'Task 1',
            instruction: str(v.p4InformalPrompt),
            register_type: 'INFORMAL',
            word_limit_min: 50,
            word_limit_max: 75,
            ...(infSample ? { sample_answer: infSample } : {}),
          },
          {
            task_label: 'Task 2',
            instruction: str(v.p4FormalPrompt),
            register_type: 'FORMAL',
            word_limit_min: 120,
            word_limit_max: 150,
            ...(formSample ? { sample_answer: formSample } : {}),
          },
        ],
      },
    },
  ];
};

// ---------- SPEAKING (skillId 5) — tất cả RECORD ----------
const buildSpeaking = (v: FormValues): ICreateQuestionPayload[] => {
  const part = str(v.part) || 'part1';

  if (part === 'part1') {
    return arr<string>(v.p1Questions)
      .filter((q) => q)
      .map((q) => ({
        skillId: SKILL_ID.speaking,
        partNumber: 1,
        content: q,
        extraConfig: { response_time_seconds: 30, prep_time_seconds: 0, image_count: 0 },
      }));
  }

  // P2: 1 ảnh, 45s — gói toàn bộ câu hỏi vào 1 bản ghi
  if (part === 'part2') {
    const imageUrls = str(v.p2ImageUrl) ? [str(v.p2ImageUrl)] : [];
    const questions = [str(v.p2Q1), str(v.p2Q2), str(v.p2Q3)].filter((q) => q);
    return [
      {
        skillId: SKILL_ID.speaking,
        partNumber: 2,
        content: str(v.content) || str(v.title) || 'Look at the picture and answer the questions.',
        extraConfig: {
          response_time_seconds: 45,
          prep_time_seconds: 0,
          image_count: 1,
          image_urls: imageUrls,
          questions: questions.map((q) => ({ question: q })),
        },
      },
    ];
  }

  // P3: 2 ảnh, 45s — gói toàn bộ câu hỏi vào 1 bản ghi
  if (part === 'part3') {
    const imageUrls = [str(v.p3ImageUrlA), str(v.p3ImageUrlB)].filter((u) => u);
    const questions = [str(v.p3Q1), str(v.p3Q2), str(v.p3Q3)].filter((q) => q);
    return [
      {
        skillId: SKILL_ID.speaking,
        partNumber: 3,
        content: str(v.content) || str(v.title) || 'Look at the two pictures and answer the questions.',
        extraConfig: {
          response_time_seconds: 45,
          prep_time_seconds: 0,
          image_count: 2,
          image_urls: imageUrls,
          questions: questions.map((q) => ({ question: q })),
        },
      },
    ];
  }

  // P4: 1 phút chuẩn bị + 2 phút nói — gói toàn bộ câu hỏi vào 1 bản ghi
  const imageUrls = str(v.p4ImageUrl) ? [str(v.p4ImageUrl)] : [];
  const questions = [str(v.p4Q1), str(v.p4Q2), str(v.p4Q3)].filter((q) => q);
  return [
    {
      skillId: SKILL_ID.speaking,
      partNumber: 4,
      content: str(v.content) || str(v.title) || 'Talk about the topic below.',
      extraConfig: {
        response_time_seconds: 120,
        prep_time_seconds: 60,
        image_count: imageUrls.length === 1 ? 1 : 0,
        image_urls: imageUrls,
        questions: questions.map((q) => ({ question: q })),
      },
    },
  ];
};

export const buildCreatePayloads = (skill: SkillRoute, values: FormValues): ICreateQuestionPayload[] => {
  switch (skill) {
    case 'grammar':
      return buildGrammar(values);
    case 'listening':
      return buildListening(values);
    case 'reading':
      return buildReading(values);
    case 'writing':
      return buildWriting(values);
    case 'speaking':
      return buildSpeaking(values);
    default:
      return [];
  }
};

// ---------- API question -> dòng cho Table ----------
const PART_LABEL: Record<number, string> = { 1: 'part1', 2: 'part2', 3: 'part3', 4: 'part4', 5: 'part5' };

export const mapQuestionToRow = (q: IQuestion) => ({
  key: String(q.id),
  id: q.id,
  content: q.content,
  type: q.questionType,
  part: PART_LABEL[q.partNumber] ?? `part${q.partNumber}`,
  difficulty: 'medium',
  tags: [] as string[],
  useCount: 0,
  successRate: 100,
  status: q.deletedAt ? 'draft' : 'active',
  updatedAt: q.createdAt ? new Date(q.createdAt).toLocaleDateString('vi-VN') : '',
  raw: q,
});
