export interface IPart1Question {
  id: number;
  questionText: string;
  options: string[];
  transcript: string;
  explanation: string;
}

export interface IPart4QuestionGroup {
  id: number;
  title: string;
  instruction: string;
  subQuestions: {
    id: string;
    num: number;
    title: string;
    options: string[];
    explanation: string;
  }[];
  transcript: string;
}

export const correctP1: Record<number, string> = {
  1: '15 minutes', 2: 'To the dentist', 3: '15:30', 4: 'To invite someone to lunch',
  5: '75 dollars', 6: 'Second floor', 7: 'Sunny', 8: 'Waiter', 9: 'By bus',
  10: 'Mondays', 11: 'Running', 12: 'The air conditioner is broken', 13: 'Carousel 5'
};

export const correctP2: Record<number, string> = {
  14: 'option1', 15: 'option5', 16: 'option3', 17: 'option4'
};

export const correctP3: Record<number, string> = {
  18: 'both', 19: 'woman', 20: 'man', 21: 'woman'
};

export const correctP4: Record<number, string> = {
  22: 'It doesn\'t provide enough alternatives to driving.',
  23: 'It is likely to meet resistance from local communities.',
  24: 'Close to the riverfront area',
  25: 'To fund the construction of a new community center nearby'
};

export const correctAnswersBank: Record<number, string> = {
  ...correctP1, ...correctP2, ...correctP3, ...correctP4
};

export const p1Questions: IPart1Question[] = [
  {
    id: 1,
    questionText: 'Listen to David talking about the conference. How long did he talk in the speech?',
    options: ['10 minutes', '15 minutes', '20 minutes'],
    transcript: 'David: Well, the conference went really well. I was worried about my speech, but it turned out fine. I thought I would talk for 20 minutes, but they asked me to shorten it. In the end, I spoke for 15 minutes, which left about 10 minutes for questions.',
    explanation: "Người nói cho biết ban đầu định nói 20 phút nhưng ban tổ chức yêu cầu rút ngắn, cuối cùng David đã thuyết trình trong 15 phút (In the end, I spoke for 15 minutes)."
  },
  {
    id: 2,
    questionText: 'Listen to the woman. Where is she going this afternoon?',
    options: ['To the supermarket', 'To the dentist', 'To the library'],
    transcript: 'Woman: I have a busy day ahead. In the morning, I need to return some books to the library, and after lunch, I have an appointment with my dentist. I\'ll do the grocery shopping tomorrow instead.',
    explanation: "Người phụ nữ đi đến thư viện vào buổi sáng và đi gặp nha sĩ sau giờ ăn trưa (tức buổi chiều). Đi siêu thị dời sang ngày mai."
  },
  {
    id: 3,
    questionText: 'Listen to the announcement. What time will the flight depart?',
    options: ['14:30', '15:00', '15:30'],
    transcript: 'Announcement: Attention passengers of flight VN123 to Hanoi. Due to late arrival of the incoming aircraft, the departure time has been changed from 14:30 to 15:30. Boarding will start at 15:00.',
    explanation: "Giọng thông báo cho biết giờ khởi hành (departure time) đã bị thay đổi từ 14:30 sang 15:30."
  },
  {
    id: 4,
    questionText: 'Listen to the message. Why is Tom calling?',
    options: ['To cancel a meeting', 'To ask for help', 'To invite someone to lunch'],
    transcript: 'Tom: Hey Sarah, it\'s Tom. I was wondering if you\'re free this Friday afternoon. A few of us are planning to grab lunch together around 12:30. Let me know if you can make it!',
    explanation: "Tom gọi điện rủ Sarah đi ăn trưa cùng mọi người lúc 12:30 ngày thứ Sáu (grab lunch together)."
  },
  {
    id: 5,
    questionText: 'Listen to the conversation. How much did the man pay for his jacket?',
    options: ['50 dollars', '75 dollars', '100 dollars'],
    transcript: 'Man: Look at this new winter jacket I got. It was originally 100 dollars, but they had a 25% discount this week. So it was a pretty good deal at 75 dollars!',
    explanation: "Giá gốc chiếc áo là 100 đô, được giảm 25% nên người đàn ông chỉ phải trả 75 đô."
  },
  {
    id: 6,
    questionText: 'Listen to the guide. Which floor is the Egyptian art exhibition on?',
    options: ['First floor', 'Second floor', 'Third floor'],
    transcript: 'Guide: Welcome to the museum. Today, our medieval collection is on the first floor, and the modern paintings are on the third. If you want to see the famous Egyptian art exhibition, please take the stairs to the second floor.',
    explanation: "Triển lãm nghệ thuật Ai Cập nằm ở tầng hai (please take the stairs to the second floor)."
  },
  {
    id: 7,
    questionText: 'Listen to the message. What is the weather like today?',
    options: ['Rainy', 'Cloudy', 'Sunny'],
    transcript: 'Weather Forecast: Good morning. We started the week with heavy rain, but today the clouds have cleared up, giving us a beautiful, warm sunny day. Enjoy it while it lasts, as clouds are expected tomorrow.',
    explanation: "Thời tiết hôm nay được dự báo là nắng đẹp (beautiful, warm sunny day)."
  },
  {
    id: 8,
    questionText: 'Listen to the speaker. What job did he do first?',
    options: ['Teacher', 'Waiter', 'Salesperson'],
    transcript: 'Speaker: Before I got my degree and started working as a high school teacher, I did several part-time jobs. My very first job was a waiter at a local Italian restaurant, and later I worked as a salesperson at a clothing shop.',
    explanation: "Công việc đầu tiên của người nói là làm bồi bàn ở nhà hàng Ý (My very first job was a waiter)."
  },
  {
    id: 9,
    questionText: 'Listen to the conversation. How are they going to travel?',
    options: ['By train', 'By bus', 'By car'],
    transcript: 'Woman: Shall we drive to the city? It takes about an hour.\nMan: The traffic is usually terrible. Why don\'t we take the train? It\'s faster.\nWoman: True, but the bus station is closer to our house. Let\'s do that instead.',
    explanation: "Cả hai đồng ý chọn đi bằng xe buýt (bus) vì trạm gần nhà hơn, dù xe lửa nhanh hơn và lái xe thì sợ kẹt xe."
  },
  {
    id: 10,
    questionText: 'Listen to the message. When is the museum closed?',
    options: ['Mondays', 'Wednesdays', 'Sundays'],
    transcript: 'Voice message: Hello, the city history museum is open Tuesday through Sunday from 9 AM to 6 PM. We are closed on Mondays for weekly maintenance.',
    explanation: "Bảo tàng đóng cửa bảo trì định kỳ vào thứ Hai (closed on Mondays)."
  },
  {
    id: 11,
    questionText: 'Listen to the speaker. Which sport does she practice regularly now?',
    options: ['Swimming', 'Tennis', 'Running'],
    transcript: 'Speaker: I used to swim twice a week when I was at university, and I occasionally play tennis with friends on weekends. But these days, running is my primary daily exercise.',
    explanation: "Hiện nay, môn thể thao được tập luyện thường xuyên hàng ngày là chạy bộ (running is my primary daily exercise)."
  },
  {
    id: 12,
    questionText: 'Listen to the phone call. What is the problem with the hotel room?',
    options: ['No internet connection', 'The room is too noisy', 'The air conditioner is broken'],
    transcript: 'Guest: Hello, reception? This is room 305. The Wi-Fi is working fine and the room is quiet, but the air conditioner in my room doesn\'t seem to be working. It is getting very warm in here.',
    explanation: "Khách phàn nàn điều hòa trong phòng khách sạn không hoạt động (air conditioner doesn't seem to be working)."
  },
  {
    id: 13,
    questionText: 'Listen to the announcement. Where should passengers go to get their baggage?',
    options: ['Carousel 3', 'Carousel 5', 'Carousel 7'],
    transcript: 'Announcement: Passengers arriving from flight BA456 from London can now collect their baggage at Carousel 5. Please note that Carousel 3 is for flight VN789, and Carousel 7 is currently out of order.',
    explanation: "Hành khách của chuyến bay từ London đến nhận hành lý tại băng chuyền số 5 (collect their baggage at Carousel 5)."
  }
];

export const p2Options = [
  { value: 'option1', label: 'listens to music while working' },
  { value: 'option2', label: 'prefers classical music' },
  { value: 'option3', label: 'attends live concerts frequently' },
  { value: 'option4', label: 'plays an instrument' },
  { value: 'option5', label: 'dislikes modern pop music' }
];

export const p3SpeakerOptions = [
  { value: 'man', label: 'Man' },
  { value: 'woman', label: 'Woman' },
  { value: 'both', label: 'Both' }
];

export const p3Statements = [
  { id: 18, index: 1, text: 'Exhibitions should be different and diverse' },
  { id: 19, index: 2, text: 'Traditional customs are gradually losing their significance' },
  { id: 20, index: 3, text: 'Local festivals will disappear in the near future' },
  { id: 21, index: 4, text: 'Schools are important in shaping future generations' }
];

export const p4Groups: IPart4QuestionGroup[] = [
  {
    id: 16,
    title: 'A Regional Development Plan',
    instruction: 'Listen to a city planner talk at a press conference about Regional Development Planning and answer the questions below.',
    subQuestions: [
      {
        id: '16.1',
        num: 22,
        title: 'Câu 22: What is one of the main criticisms of the Regional Development Plan?',
        options: [
          'It places too much emphasis on public transportation.',
          'It doesn\'t provide enough alternatives to driving.',
          'It is too expensive to implement the plan.'
        ],
        explanation: "Lời City Planner: 'A major critique we've heard is that it doesn't provide enough alternatives to driving for daily commuters.'"
      },
      {
        id: '16.2',
        num: 23,
        title: 'Câu 23: What challenge is the Regional Development Plan likely to face?',
        options: [
          'It could face difficulties in gaining government approval.',
          'It is likely to meet resistance from local communities.',
          'It might fail due to lack of private investment.'
        ],
        explanation: "Lời City Planner: 'Another hurdle is that it is likely to meet resistance from local communities who are concerned...'"
      }
    ],
    transcript: 'City Planner (Q16): Welcome everyone. Today we are presenting the Regional Development Plan. A major critique we\'ve heard is that it doesn\'t provide enough alternatives to driving for daily commuters. We acknowledge this and are working on adding more bike lanes. Another hurdle is that it is likely to meet resistance from local communities who are concerned about increased construction noise over the next few years.'
  },
  {
    id: 17,
    title: 'New Public Park Proposal',
    instruction: 'Listen to a local official discussing the new public park proposal and answer the questions below.',
    subQuestions: [
      {
        id: '17.1',
        num: 24,
        title: 'Câu 24: Where does the speaker recommend locating the new public park?',
        options: [
          'Near the central library',
          'Adjacent to the train station',
          'Close to the riverfront area'
        ],
        explanation: "Lời Official: 'After reviewing the feedback, we recommend locating it close to the riverfront area, which offers the best green space.'"
      },
      {
        id: '17.2',
        num: 25,
        title: 'Câu 25: Why is the budget for the new park being reduced by 10%?',
        options: [
          'To cover additional maintenance costs',
          'To fund the construction of a new community center nearby',
          'Due to an unexpected drop in municipal tax revenue'
        ],
        explanation: "Lời Official: 'Unfortunately, because we need to fund the construction of a new community center nearby, we have had to trim the park budget by 10%.'"
      }
    ],
    transcript: 'Official (Q17): Moving on to the second agenda, the new public park. After reviewing the feedback, we recommend locating it close to the riverfront area, which offers the best green space. Unfortunately, because we need to fund the construction of a new community center nearby, we have had to trim the park budget by 10%.'
  }
];
