export interface ISubQuestion {
  id: number;
  questionText: string;
  sampleAnswers: string[];
}

export interface ICompareQuestion {
  id: number;
  title: string;
  image1Url: string;
  image2Url: string;
  questions: ISubQuestion[];
  tips: string[];
}

export const mockCompareSets: ICompareQuestion[] = [
  {
    id: 1,
    title: "Set 1: Studying Environments",
    image1Url: "https://images.unsplash.com/photo-1521587760476-6c12a4b040da?w=600&auto=format&fit=crop&q=60",
    image2Url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=600&auto=format&fit=crop&q=60",
    questions: [
      {
        id: 1,
        questionText: "Compare these two pictures. What are the main differences between them?",
        sampleAnswers: [
          "Both pictures show people studying, but they are in completely different environments. In the first picture, several students are reading quietly in a spacious library surrounded by bookshelves. It looks very organized and peaceful. In contrast, the second picture shows a young woman studying in a cozy cafe, surrounded by plants and coffee cups. It seems much more casual and relaxed, but potentially more noisy.",
          "The two images depict different study locations. The first image displays an academic setting where students are focused on books in a silent library. The second image highlights a self-study scene in a bustling coffee shop where a person enjoys a beverage while studying on a laptop. The main difference lies in the level of privacy, noise, and formality."
        ]
      },
      {
        id: 2,
        questionText: "Why do you think some people prefer studying in libraries rather than coffee shops?",
        sampleAnswers: [
          "I think some people prefer libraries because they provide a quiet and structured environment, which is perfect for deep focus and studying complex subjects. There are fewer distractions compared to cafes. Additionally, libraries have useful resources like reference books, high-speed Wi-Fi, and printing services that support academic work.",
          "For many individuals, the academic atmosphere of a library, filled with other focused students, creates peer pressure that keeps them motivated and productive. In contrast, coffee shops have constant movement, music, and conversations, which can easily break one's concentration, especially during exam preparation."
        ]
      },
      {
        id: 3,
        questionText: "Which of these two places do you prefer for working or studying? Why?",
        sampleAnswers: [
          "Personally, I prefer studying in coffee shops. I find the background noise and the pleasant smell of coffee very motivating rather than distracting. Studying in a library sometimes makes me feel too stressed because it is extremely quiet. Having a drink and a snack while studying in a cafe helps me stay energized and creative.",
          "I would choose the library for serious study or writing. I need complete silence and zero distractions to organize my thoughts. However, if I am just doing light reading or brainstorm planning, I might go to a coffee shop for a change of environment and a cup of cappuccino."
        ]
      }
    ],
    tips: [
      "Sử dụng các từ nối so sánh và đối lập như: 'Both show...', 'In contrast', 'On the other hand', 'While the first one is...'.",
      "Tập trung nêu bật sự khác biệt về không gian (yên tĩnh vs ồn ào, chuyên nghiệp vs thư giãn).",
      "Ở câu 3, hãy chọn một bên và giải thích lý do cá nhân rõ ràng."
    ]
  }
];
