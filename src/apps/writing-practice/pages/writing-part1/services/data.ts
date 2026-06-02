export interface IPart1Question {
  id: number;
  questionText: string;
  exampleText: string;
  sampleAnswers: string[];
}

export const mockPart1Questions: IPart1Question[] = [
  {
    id: 1,
    questionText: "What is your hobby?",
    exampleText: "I like listening to music.",
    sampleAnswers: [
      "I love reading novels.",
      "Playing football with friends.",
      "I enjoy cooking dinner."
    ]
  },
  {
    id: 2,
    questionText: "What is the weather like today?",
    exampleText: "It is very sunny.",
    sampleAnswers: [
      "It is rainy today.",
      "Cold and very windy.",
      "It is warm outside."
    ]
  },
  {
    id: 3,
    questionText: "How do you travel to school/work?",
    exampleText: "I travel by motorbike.",
    sampleAnswers: [
      "I take the bus.",
      "I walk every day.",
      "By private car."
    ]
  },
  {
    id: 4,
    questionText: "What is your favorite food?",
    exampleText: "My favorite is Pho.",
    sampleAnswers: [
      "I like eating pizza.",
      "Fried rice and chicken.",
      "I love seafood noodles."
    ]
  },
  {
    id: 5,
    questionText: "Why do you want to learn English?",
    exampleText: "To find a job.",
    sampleAnswers: [
      "For my future career.",
      "To travel the world.",
      "To study abroad."
    ]
  }
];
