export interface IGrammarQuestion {
  id: string; // e.g., "g1", "g2"
  questionNumber: number; // 1 -> 25
  sentence: string; // e.g., "If I _______ younger, I would have studied abroad."
  options: string[]; // exactly 3 options for Aptis Grammar
  correctAnswer: string;
}

export type IVocabularyType = 'synonym' | 'definition' | 'context' | 'collocation';

export interface IVocabularySubQuestion {
  id: string; // e.g., "v1_1", "v1_2"
  questionNumber: number; // 26 -> 50
  leftLabel: string; // word to match, definition, gap sentence, or collocation starter
  correctAnswer: string; // word that fits from the options list
}

export interface IVocabularySet {
  id: string; // e.g., "set1", "set2"
  type: IVocabularyType;
  title: string; // e.g., "Word Matching (Synonyms)", "Word Definitions"
  instruction: string;
  subQuestions: IVocabularySubQuestion[]; // 5 sub-questions per set
  optionsList: string[]; // shared pool of 10 options
}
