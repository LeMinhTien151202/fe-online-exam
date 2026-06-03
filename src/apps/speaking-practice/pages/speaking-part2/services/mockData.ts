export interface ISubQuestion {
  id: number;
  questionText: string;
  sampleAnswers: string[];
}

export interface ISetQuestion {
  id: number;
  title: string;
  imageUrl: string;
  questions: ISubQuestion[];
  tips: string[];
}

export const mockSets: ISetQuestion[] = [
  {
    id: 1,
    title: "Set 1: Family Cooking",
    imageUrl: "https://images.unsplash.com/photo-1556910103-1c02745aae4d?w=800&auto=format&fit=crop&q=60",
    questions: [
      {
        id: 1,
        questionText: "Describe this picture. Tell me what you can see in the photo.",
        sampleAnswers: [
          "In the picture, I can see a family of three cooking together in a bright, modern kitchen. The father and mother are smiling warmly at their young son, who is standing between them and helping chop some yellow bell peppers. There are fresh vegetables like tomatoes and lettuce on the kitchen counter. They all look very happy and are enjoying their family time together.",
          "This photo shows a lovely family moment in a well-lit kitchen. A couple is preparing a healthy meal with their little son. The mother is holding a bowl, the father is looking at his son with a proud smile, and the boy is busy slicing vegetables. It looks like a clean, cozy home environment, highlighting family bonding through cooking."
        ]
      },
      {
        id: 2,
        questionText: "Why do you think it is important for families to cook or eat meals together?",
        sampleAnswers: [
          "I believe cooking and eating together is crucial because it helps strengthen family bonds. In today's busy world, mealtime is one of the few opportunities where family members can sit down, share their daily experiences, and communicate. Moreover, home-cooked meals are generally healthier and encourage kids to build good eating habits.",
          "From my perspective, dining together creates a sense of belonging and security for children. It allows parents to listen to their kids' problems and offer guidance. Also, sharing cooking responsibilities teaches teamwork and life skills to younger members, making them more independent."
        ]
      },
      {
        id: 3,
        questionText: "Tell me about a memorable meal you had with your family.",
        sampleAnswers: [
          "A memorable meal I had was last New Year's Eve. My family gathered at my grandparents' house. We prepared a traditional feast, including banh chung and roasted chicken. We talked, laughed, and recalled happy memories from the past year. It was special because it was the first time in years that all of my cousins and relatives were present.",
          "I remember a dinner we had during our summer vacation in Nha Trang two years ago. We sat at an outdoor restaurant by the beach and ate fresh grilled seafood while listening to the sound of waves. My father told funny jokes from his youth, and we laughed so hard. The combination of delicious food and the beautiful scenery made it unforgettable."
        ]
      }
    ],
    tips: [
      "Khi miêu tả tranh, hãy đi từ tổng quan (who, where) đến chi tiết (actions, objects) rồi cảm xúc (feelings).",
      "Sử dụng thì Hiện tại tiếp diễn để tả hành động đang xảy ra trong tranh (cooking, smiling, chopping).",
      "Đưa ra ý kiến cá nhân rõ ràng bằng các cụm như 'In my opinion', 'From my perspective' cho các câu hỏi nghị luận."
    ]
  }
];
