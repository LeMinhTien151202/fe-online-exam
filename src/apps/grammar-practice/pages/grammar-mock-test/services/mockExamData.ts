import { IGrammarQuestion, IVocabularySet } from '../../../types';

export const mockGrammarQuestions: IGrammarQuestion[] = [
  {
    id: 'g1',
    questionNumber: 1,
    sentence: "If I _______ younger, I would have studied abroad.",
    options: ["have been", "am", "were"],
    correctAnswer: "were"
  },
  {
    id: 'g2',
    questionNumber: 2,
    sentence: "She has been working here _______ two years now.",
    options: ["for", "since", "during"],
    correctAnswer: "for"
  },
  {
    id: 'g3',
    questionNumber: 3,
    sentence: "The meeting _______ by the time we arrived at the office.",
    options: ["had started", "has started", "starts"],
    correctAnswer: "had started"
  },
  {
    id: 'g4',
    questionNumber: 4,
    sentence: "You _______ bring your passport; it's a domestic flight.",
    options: ["mustn't", "don't have to", "shouldn't"],
    correctAnswer: "don't have to"
  },
  {
    id: 'g5',
    questionNumber: 5,
    sentence: "Hardly _______ entered the room when the phone rang.",
    options: ["had I", "I had", "did I"],
    correctAnswer: "had I"
  },
  {
    id: 'g6',
    questionNumber: 6,
    sentence: "I look forward to _______ you at the conference next week.",
    options: ["meet", "meeting", "have met"],
    correctAnswer: "meeting"
  },
  {
    id: 'g7',
    questionNumber: 7,
    sentence: "He spoke so quickly that I couldn't make _______ what he was saying.",
    options: ["out", "up", "over"],
    correctAnswer: "out"
  },
  {
    id: 'g8',
    questionNumber: 8,
    sentence: "If they _______ harder, they might have passed the exam.",
    options: ["studied", "had studied", "would study"],
    correctAnswer: "had studied"
  },
  {
    id: 'g9',
    questionNumber: 9,
    sentence: "The book _______ by a famous author last month was a bestseller.",
    options: ["publishing", "published", "which published"],
    correctAnswer: "published"
  },
  {
    id: 'g10',
    questionNumber: 10,
    sentence: "By this time tomorrow, they _______ their final exams.",
    options: ["will finish", "will have finished", "finish"],
    correctAnswer: "will have finished"
  },
  {
    id: 'g11',
    questionNumber: 11,
    sentence: "I wish I _______ more attention during the physics lecture.",
    options: ["paid", "had paid", "would pay"],
    correctAnswer: "had paid"
  },
  {
    id: 'g12',
    questionNumber: 12,
    sentence: "It's high time you _______ looking for a job.",
    options: ["start", "started", "should start"],
    correctAnswer: "started"
  },
  {
    id: 'g13',
    questionNumber: 13,
    sentence: "Not only _______ the match, but they also broke the record.",
    options: ["they won", "did they win", "had they won"],
    correctAnswer: "did they win"
  },
  {
    id: 'g14',
    questionNumber: 14,
    sentence: "The doctor recommended that he _______ a few days off work.",
    options: ["take", "takes", "took"],
    correctAnswer: "take"
  },
  {
    id: 'g15',
    questionNumber: 15,
    sentence: "We had _______ bad weather that we stayed indoors all day.",
    options: ["such", "so", "very"],
    correctAnswer: "such"
  },
  {
    id: 'g16',
    questionNumber: 16,
    sentence: "She is used _______ early in the morning.",
    options: ["to waking up", "wake up", "to wake up"],
    correctAnswer: "to waking up"
  },
  {
    id: 'g17',
    questionNumber: 17,
    sentence: "No sooner had he left the house _______ it started to rain.",
    options: ["than", "when", "then"],
    correctAnswer: "than"
  },
  {
    id: 'g18',
    questionNumber: 18,
    sentence: "The information you requested _______ sent to you yesterday.",
    options: ["were", "was", "has been"],
    correctAnswer: "was"
  },
  {
    id: 'g19',
    questionNumber: 19,
    sentence: "I'd rather _______ to the cinema tonight if you don't mind.",
    options: ["not go", "don't go", "not to go"],
    correctAnswer: "not go"
  },
  {
    id: 'g20',
    questionNumber: 20,
    sentence: "He succeeded _______ passing the driving test on his first try.",
    options: ["in", "on", "at"],
    correctAnswer: "in"
  },
  {
    id: 'g21',
    questionNumber: 21,
    sentence: "The new bridge, _______ construction took three years, is now open.",
    options: ["which", "whose", "of which"],
    correctAnswer: "whose"
  },
  {
    id: 'g22',
    questionNumber: 22,
    sentence: "Unless you _______ now, you will miss the train.",
    options: ["leave", "don't leave", "will leave"],
    correctAnswer: "leave"
  },
  {
    id: 'g23',
    questionNumber: 23,
    sentence: "I can't help _______ why he made such a sudden decision.",
    options: ["to wonder", "wondering", "wonder"],
    correctAnswer: "wondering"
  },
  {
    id: 'g24',
    questionNumber: 24,
    sentence: "It was _______ a boring movie that I fell asleep halfway through.",
    options: ["so", "such", "very"],
    correctAnswer: "such"
  },
  {
    id: 'g25',
    questionNumber: 25,
    sentence: "Should you _______ any assistance, please do not hesitate to contact us.",
    options: ["require", "requires", "required"],
    correctAnswer: "require"
  }
];

export const mockVocabularySets: IVocabularySet[] = [
  {
    id: 'set1',
    type: 'synonym',
    title: 'Set 1: Word Matching (Synonyms)',
    instruction: 'Select a word from the list that has the most similar meaning to the word on the left.',
    subQuestions: [
      { id: 'v26', questionNumber: 26, leftLabel: 'demonstrate', correctAnswer: 'reveal' },
      { id: 'v27', questionNumber: 27, leftLabel: 'comprehend', correctAnswer: 'understand' },
      { id: 'v28', questionNumber: 28, leftLabel: 'encourage', correctAnswer: 'support' },
      { id: 'v29', questionNumber: 29, leftLabel: 'direct', correctAnswer: 'guide' },
      { id: 'v30', questionNumber: 30, leftLabel: 'create', correctAnswer: 'produce' }
    ],
    optionsList: ['reveal', 'understand', 'support', 'guide', 'produce', 'destroy', 'ignore', 'demand', 'forget', 'conceal']
  },
  {
    id: 'set2',
    type: 'definition',
    title: 'Set 2: Word Definitions',
    instruction: 'Complete each definition using a word from the list. Use each word once only. You will not need five of the words.',
    subQuestions: [
      { id: 'v31', questionNumber: 31, leftLabel: 'To gain knowledge is to...', correctAnswer: 'learn' },
      { id: 'v32', questionNumber: 32, leftLabel: "To assess a student's performance is to...", correctAnswer: 'evaluate' },
      { id: 'v33', questionNumber: 33, leftLabel: 'To look over something carefully is to...', correctAnswer: 'examine' },
      { id: 'v34', questionNumber: 34, leftLabel: 'To put things in their correct place is to...', correctAnswer: 'arrange' },
      { id: 'v35', questionNumber: 35, leftLabel: 'To exchange information by speaking is to...', correctAnswer: 'converse' }
    ],
    optionsList: ['learn', 'evaluate', 'examine', 'arrange', 'converse', 'listen', 'refuse', 'forget', 'explain', 'design']
  },
  {
    id: 'set3',
    type: 'context',
    title: 'Set 3: Word Usage in Context',
    instruction: 'Finish each sentence using a word from the list. Use each word once only. You will not need five of the words.',
    subQuestions: [
      { id: 'v36', questionNumber: 36, leftLabel: 'In the fall, we are implementing a new English-language _______ at our school.', correctAnswer: 'curriculum' },
      { id: 'v37', questionNumber: 37, leftLabel: 'Every Friday, the students take a short _______ to see if they understood the week’s concepts.', correctAnswer: 'quiz' },
      { id: 'v38', questionNumber: 38, leftLabel: 'It is important for kids to play in team sports so that they learn _______.', correctAnswer: 'cooperation' },
      { id: 'v39', questionNumber: 39, leftLabel: 'The new technology course does not have a _______; all material is online.', correctAnswer: 'textbook' },
      { id: 'v40', questionNumber: 40, leftLabel: 'We have a lot of _______ on the shelves for indoor activities when it rains.', correctAnswer: 'boardgames' }
    ],
    optionsList: ['curriculum', 'quiz', 'cooperation', 'textbook', 'boardgames', 'homework', 'vacation', 'punishment', 'classroom', 'diploma']
  },
  {
    id: 'set4',
    type: 'collocation',
    title: 'Set 4: Word Pairs (Collocations)',
    instruction: 'Match the words that frequently go together (e.g. choose the word that commonly follows the word on the left).',
    subQuestions: [
      { id: 'v41', questionNumber: 41, leftLabel: 'make a...', correctAnswer: 'mistake' },
      { id: 'v42', questionNumber: 42, leftLabel: 'pay...', correctAnswer: 'attention' },
      { id: 'v43', questionNumber: 43, leftLabel: 'take a...', correctAnswer: 'photo' },
      { id: 'v44', questionNumber: 44, leftLabel: 'do...', correctAnswer: 'research' },
      { id: 'v45', questionNumber: 45, leftLabel: 'catch a...', correctAnswer: 'cold' }
    ],
    optionsList: ['mistake', 'attention', 'photo', 'research', 'cold', 'trouble', 'question', 'sleep', 'accident', 'job']
  },
  {
    id: 'set5',
    type: 'definition',
    title: 'Set 5: Word Definitions (Advanced)',
    instruction: 'Complete each definition using a word from the list. Use each word once only. You will not need five of the words.',
    subQuestions: [
      { id: 'v46', questionNumber: 46, leftLabel: 'To delay doing something until a later time is to...', correctAnswer: 'procrastinate' },
      { id: 'v47', questionNumber: 47, leftLabel: 'To make something look or feel better is to...', correctAnswer: 'enhance' },
      { id: 'v48', questionNumber: 48, leftLabel: 'To study something in great detail is to...', correctAnswer: 'analyze' },
      { id: 'v49', questionNumber: 49, leftLabel: 'To mimic or copy the behavior of something is to...', correctAnswer: 'simulate' },
      { id: 'v50', questionNumber: 50, leftLabel: 'To completely destroy or wipe out is to...', correctAnswer: 'eradicate' }
    ],
    optionsList: ['procrastinate', 'enhance', 'analyze', 'simulate', 'eradicate', 'validate', 'abandon', 'prevent', 'overtake', 'complicate']
  }
];
