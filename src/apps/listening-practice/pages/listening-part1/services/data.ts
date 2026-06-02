export interface IQuestion {
  id: number;
  questionText: string;
  options: string[];
  transcript: string;
}

export const mockQuestions: IQuestion[] = [
  {
    id: 1,
    questionText: 'Listen to David talking about the conference. How long did he talk in the speech?',
    options: ['10 minutes', '15 minutes', '20 minutes'],
    transcript: 'David: Well, the conference went really well. I was worried about my speech, but it turned out fine. I thought I would talk for 20 minutes, but they asked me to shorten it. In the end, I spoke for 15 minutes, which left about 10 minutes for questions.'
  },
  {
    id: 2,
    questionText: 'Listen to the woman. Where is she going this afternoon?',
    options: ['To the supermarket', 'To the dentist', 'To the library'],
    transcript: 'Woman: I have a busy day ahead. In the morning, I need to return some books to the library, and after lunch, I have an appointment with my dentist. I\'ll do the grocery shopping tomorrow instead.'
  },
  {
    id: 3,
    questionText: 'Listen to the announcement. What time will the flight depart?',
    options: ['14:30', '15:00', '15:30'],
    transcript: 'Announcement: Attention passengers of flight VN123 to Hanoi. Due to late arrival of the incoming aircraft, the departure time has been changed from 14:30 to 15:30. Boarding will start at 15:00.'
  },
  {
    id: 4,
    questionText: 'Listen to the message. Why is Tom calling?',
    options: ['To cancel a meeting', 'To ask for help', 'To invite someone to lunch'],
    transcript: 'Tom: Hey Sarah, it\'s Tom. I was wondering if you\'re free this Friday afternoon. A few of us are planning to grab lunch together around 12:30. Let me know if you can make it!'
  },
  {
    id: 5,
    questionText: 'Listen to the conversation. How much did the man pay for his jacket?',
    options: ['50 dollars', '75 dollars', '100 dollars'],
    transcript: 'Man: Look at this new winter jacket I got. It was originally 100 dollars, but they had a 25% discount this week. So it was a pretty good deal at 75 dollars!'
  },
  {
    id: 6,
    questionText: 'Listen to the guide. Which floor is the Egyptian art exhibition on?',
    options: ['First floor', 'Second floor', 'Third floor'],
    transcript: 'Guide: Welcome to the museum. Today, our medieval collection is on the first floor, and the modern paintings are on the third. If you want to see the famous Egyptian art exhibition, please take the stairs to the second floor.'
  },
  {
    id: 7,
    questionText: 'Listen to the message. What is the weather like today?',
    options: ['Rainy', 'Cloudy', 'Sunny'],
    transcript: 'Weather Forecast: Good morning. We started the week with heavy rain, but today the clouds have cleared up, giving us a beautiful, warm sunny day. Enjoy it while it lasts, as clouds are expected tomorrow.'
  },
  {
    id: 8,
    questionText: 'Listen to the speaker. What job did he do first?',
    options: ['Teacher', 'Waiter', 'Salesperson'],
    transcript: 'Speaker: Before I got my degree and started working as a high school teacher, I did several part-time jobs. My very first job was a waiter at a local Italian restaurant, and later I worked as a salesperson at a clothing shop.'
  },
  {
    id: 9,
    questionText: 'Listen to the conversation. How are they going to travel?',
    options: ['By train', 'By bus', 'By car'],
    transcript: 'Woman: Shall we drive to the city? It takes about an hour.\nMan: The traffic is usually terrible. Why don\'t we take the train? It\'s faster.\nWoman: True, but the bus station is closer to our house. Let\'s do that instead.'
  },
  {
    id: 10,
    questionText: 'Listen to the message. When is the museum closed?',
    options: ['Mondays', 'Wednesdays', 'Sundays'],
    transcript: 'Voice message: Hello, the city history museum is open Tuesday through Sunday from 9 AM to 6 PM. We are closed on Mondays for weekly maintenance.'
  },
  {
    id: 11,
    questionText: 'Listen to the speaker. Which sport does she practice regularly now?',
    options: ['Swimming', 'Tennis', 'Running'],
    transcript: 'Speaker: I used to swim twice a week when I was at university, and I occasionally play tennis with friends on weekends. But these days, running is my primary daily exercise.'
  },
  {
    id: 12,
    questionText: 'Listen to the phone call. What is the problem with the hotel room?',
    options: ['No internet connection', 'The room is too noisy', 'The air conditioner is broken'],
    transcript: 'Guest: Hello, reception? This is room 305. The Wi-Fi is working fine and the room is quiet, but the air conditioner in my room doesn\'t seem to be working. It is getting very warm in here.'
  },
  {
    id: 13,
    questionText: 'Listen to the announcement. Where should passengers go to get their baggage?',
    options: ['Carousel 3', 'Carousel 5', 'Carousel 7'],
    transcript: 'Announcement: Passengers arriving from flight BA456 from London can now collect their baggage at Carousel 5. Please note that Carousel 3 is for VN789, and Carousel 7 is currently out of order.'
  }
];
