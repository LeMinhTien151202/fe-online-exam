export interface ISpeakingQuestion {
  id: number;
  questionText: string;
  sampleAnswers: string[];
  tips: string[];
}

export const part1Questions: ISpeakingQuestion[] = [
  {
    id: 1,
    questionText: "Please tell me about your family.",
    sampleAnswers: [
      "My family is quite small, with just three people: my parents and myself. My father is an engineer, and my mother is a high school teacher. We are very close and love spending our weekends cooking meals and watching movies together.",
      "I come from a large family with five members. I have an older sister and a younger brother. We live in Hanoi. Even though we are all busy with work and study, we try to gather for dinner every evening to share our day."
    ],
    tips: [
      "Hãy nêu quy mô gia đình trực tiếp (nhỏ hay lớn, số lượng thành viên).",
      "Kể sơ lược nghề nghiệp của bố mẹ hoặc nơi sinh sống.",
      "Bổ sung một sở thích chung để câu trả lời thêm sinh động."
    ]
  },
  {
    id: 2,
    questionText: "What do you like to do in your free time?",
    sampleAnswers: [
      "In my spare time, I am a big fan of reading books and listening to music. Reading helps me broaden my knowledge and relax, while music helps to ease my mind. Occasionally, I go jogging in the park near my house to stay fit.",
      "Honestly, my favorite leisure activity is cooking. I enjoy researching and experimenting with different food recipes on the weekend. Cooking is a creative process for me, and I feel very happy when my family enjoys my dishes."
    ],
    tips: [
      "Đưa ra hoạt động yêu thích chính ngay câu đầu tiên.",
      "Giải thích lý do tại sao bạn thích hoạt động đó.",
      "Đề cập đến tần suất hoặc hoạt động phụ nếu còn thời gian."
    ]
  },
  {
    id: 3,
    questionText: "What is the weather like in your country today?",
    sampleAnswers: [
      "Today the weather is very pleasant and warm. The sky is bright blue and sunny with a light breeze. It is perfect for outdoor activities. Personally, I prefer this type of warm weather over cold, rainy days.",
      "It is currently quite cloudy and cool today. It has been drizzling slightly since morning, which makes the air a bit damp. Most people are staying indoors. I hope the clouds will clear up by this evening."
    ],
    tips: [
      "Mô tả thời tiết hiện tại (nhiệt độ, nắng/mưa, mây).",
      "Nói xem kiểu thời tiết này ảnh hưởng gì đến mọi người (ra ngoài hay ở nhà).",
      "Bày tỏ sở thích thời tiết cá nhân."
    ]
  }
];

export const part2Questions: ISpeakingQuestion[] = [
  {
    id: 4,
    questionText: "Describe this picture. Tell me what you can see in the photo.",
    sampleAnswers: [
      "In this picture, I can see a family of three cooking together in a bright, modern kitchen. The parents are smiling warmly at their young son, who is standing between them and helping chop some yellow bell peppers. On the kitchen counter, there are fresh vegetables like tomatoes and lettuce. They all look very happy and are enjoying their family bonding time.",
      "This photo shows a lovely family moment in a cozy kitchen. A couple is preparing a healthy meal with their little son. The mother is holding a bowl, the father is looking at his son with a proud smile, and the boy is busy slicing vegetables. It looks like a clean, well-lit environment, highlighting family teamwork in cooking."
    ],
    tips: [
      "Bắt đầu bằng cái nhìn tổng quan: ai đang làm gì, ở đâu.",
      "Tả chi tiết: hành động (smile, chop, hold), đồ vật (vegetables, counter).",
      "Nhận xét cảm xúc hoặc không khí chung (cozy, happy)."
    ]
  },
  {
    id: 5,
    questionText: "Why do you think it is important for families to cook or eat meals together?",
    sampleAnswers: [
      "I believe cooking and eating together is crucial because it helps strengthen family bonds. In today's busy world, mealtime is one of the few opportunities where family members can sit down, share their daily experiences, and communicate. Moreover, home-cooked meals are generally healthier.",
      "From my perspective, dining together creates a sense of belonging and security for children. It allows parents to listen to their kids' problems and offer guidance. Also, sharing cooking responsibilities teaches teamwork and life skills to younger members."
    ],
    tips: [
      "Đưa ra ý kiến trực tiếp (quan trọng vì giúp gắn kết, chia sẻ).",
      "Mở rộng ý bằng lý do: cuộc sống bận rộn cần thời gian trò chuyện.",
      "Bổ sung khía cạnh sức khỏe (dinh dưỡng tốt hơn)."
    ]
  },
  {
    id: 6,
    questionText: "Tell me about a memorable meal you had with your family.",
    sampleAnswers: [
      "A memorable meal I had was last New Year's Eve at my grandparents' house. My entire family gathered to prepare a traditional feast. We talked, laughed, and recalled happy memories from the past year. It was special because it was the first time in years that all of my cousins and relatives were present.",
      "I remember a dinner we had during our summer vacation in Nha Trang two years ago. We sat at an outdoor restaurant by the beach and ate fresh grilled seafood while listening to the sound of waves. My father told funny jokes from his youth, which made it unforgettable."
    ],
    tips: [
      "Sử dụng thì Quá khứ đơn (quá khứ rõ ràng).",
      "Nêu rõ bối cảnh: ở đâu, khi nào, ăn gì.",
      "Giải thích tại sao bữa ăn đó đáng nhớ (sum họp, vui vẻ)."
    ]
  }
];

export const part3Questions: ISpeakingQuestion[] = [
  {
    id: 7,
    questionText: "Compare these two pictures. What are the differences between them?",
    sampleAnswers: [
      "The two pictures show different dining settings. The picture on the left depicts people dining out at a busy restaurant with modern decorations and professional service. In contrast, the picture on the right shows a group preparing food at home in a cozy, intimate kitchen. Eating out looks more formal, while home dining seems warmer and more relaxed.",
      "Both photos relate to eating, but in very different environments. In the first image, a couple is enjoying their dinner at a high-end restaurant, being served by staff. In the second image, a family is actively cooking their own meal in their kitchen. The main difference lies in service and convenience versus personal involvement and home atmosphere."
    ],
    tips: [
      "Bắt đầu bằng điểm chung (đều về ăn uống).",
      "Chỉ ra sự khác biệt lớn: ăn ngoài hàng (phục vụ, trang trọng) vs ăn tại nhà (tự chuẩn bị, ấm cúng).",
      "Sử dụng các từ nối so sánh: 'In contrast', 'On the other hand', 'While'."
    ]
  },
  {
    id: 8,
    questionText: "What are the advantages of eating out at restaurants?",
    sampleAnswers: [
      "One major advantage of eating out is convenience. You don't have to spend time buying ingredients, cooking, or washing dishes, which is ideal for busy people. Additionally, restaurants offer a wide variety of cuisines and dishes that you might not know how to cook at home, and they provide a great social atmosphere.",
      "Dining at restaurants is a fantastic way to socialize and celebrate special events. It offers a change of scenery and lets you try international foods like sushi or pasta. Furthermore, professional service makes the dining experience stress-free and highly enjoyable."
    ],
    tips: [
      "Nêu các ưu điểm chính: tiết kiệm công sức dọn dẹp, đa dạng món ăn.",
      "Nói về khía cạnh xã hội (gặp bạn bè, không gian đẹp).",
      "Dùng trạng từ liên kết: 'Additionally', 'Furthermore'."
    ]
  },
  {
    id: 9,
    questionText: "Why is eating home-cooked food often considered healthier?",
    sampleAnswers: [
      "Eating home-cooked food is healthier because you have complete control over the ingredients. You can choose fresh vegetables, use less oil, salt, and sugar, and avoid artificial preservatives. In contrast, restaurant foods often contain hidden fats and high sodium to enhance flavor, which can be bad for long-term health.",
      "I believe home-cooked meals are much safer and more hygienic. You prepare the food yourself, ensuring clean utensils and proper handling. Also, cooking at home allows you to adjust portion sizes and maintain a balanced diet easily, which is crucial for physical well-being."
    ],
    tips: [
      "Giải thích lý do: kiểm soát được gia vị (dầu mỡ, muối, đường) và nguyên liệu.",
      "So sánh với đồ nhà hàng (nhiều chất béo, bột ngọt).",
      "Đề cập đến vệ sinh an toàn thực phẩm."
    ]
  }
];

export const part4Questions: ISpeakingQuestion[] = [
  {
    id: 10,
    questionText: "Tell me about a time you had to make an important decision. What was the decision and why was it important? What was the outcome of your decision?",
    sampleAnswers: [
      "An important decision I had to make was choosing my university major four years ago. I was torn between studying business management, which my parents preferred, and computer science, which was my true passion. It was a crucial decision because it would shape my future career path and lifestyle. In the end, I decided to follow my passion and chose computer science. The outcome has been fantastic; I graduated with honors, recently secured a software engineering job, and I truly enjoy my work every day. This experience taught me that trusting your instincts and pursuing what you love is key to long-term satisfaction."
    ],
    tips: [
      "Luyện tập nháp trong 1 phút chuẩn bị bằng cách viết từ khóa chính.",
      "Cấu trúc bài nói 2 phút: Phần mở đầu giới thiệu quyết định ➔ Phần thân bài kể chi tiết diễn biến & nguyên nhân quan trọng ➔ Phần kết quả (outcome) và bài học rút ra.",
      "Nói liên tục, trôi chảy, sử dụng các từ nối thời gian: 'At first', 'After that', 'Eventually', 'Looking back'."
    ]
  }
];
