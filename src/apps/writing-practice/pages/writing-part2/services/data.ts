export interface IPart2Question {
  clubName: string;
  instruction: string;
  prompt: string;
  sampleAnswers: string[];
}

export const mockPart2Question: IPart2Question = {
  clubName: "Art Club",
  instruction: "You are a new member of an Art club. Fill in the form. Write in sentences. Use 20-30 words.",
  prompt: "Please write about your interest in art and what you want to learn from the club.",
  sampleAnswers: [
    "I am interested in painting and watercolor techniques. I joined this club to learn how to paint better and meet other creative people.",
    "My major is design, and I love classic art. I want to improve my drawing skills and learn from experienced artists in the club."
  ]
};
