export interface IPart3Message {
  id: number;
  sender: string;
  avatar: string;
  messageText: string;
  sampleAnswers: string[];
}

export const mockPart3Messages: IPart3Message[] = [
  {
    id: 1,
    sender: "Sam",
    avatar: "S",
    messageText: "I kept a painting for a long time. Tell me a thing that you have had for a long time.",
    sampleAnswers: [
      "I have had a classic acoustic guitar for over ten years. It was a birthday gift from my father. Even though I do not play it as often now, it still holds many beautiful childhood memories for me.",
      "I have kept a small silver watch given by my grandfather for five years. It is very special to me because it reminds me of him. I wear it only on important family occasions."
    ]
  },
  {
    id: 2,
    sender: "Jenny",
    avatar: "J",
    messageText: "I would like to learn painting, but I have not found an effective way. Should I take a course at my local college? Please, give me some advice.",
    sampleAnswers: [
      "Taking a course at your local college is a great idea. You will receive structured lessons and real-time feedback from professional tutors. Additionally, practicing with classmates can be very motivating and fun.",
      "Yes, you should definitely enroll in a college course. It offers a solid foundation in techniques and keeps you disciplined. However, you can also watch online tutorials for extra practice in your free time."
    ]
  },
  {
    id: 3,
    sender: "Alex",
    avatar: "A",
    messageText: "Street art – where people paint on the building – is becoming popular. However, some people criticize that it is bad. What is your opinion?",
    sampleAnswers: [
      "In my opinion, street art is a beautiful form of public expression that makes cities more vibrant. However, it should only be done on designated walls to prevent vandalism and respect public property.",
      "I believe street art is highly creative and brings life to dull concrete buildings. As long as artists have permission from property owners, it should be encouraged rather than criticized as vandalism."
    ]
  }
];
