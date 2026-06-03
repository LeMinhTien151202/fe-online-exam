export interface IAbstractSet {
  id: number;
  title: string;
  imageUrl: string;
  questions: string[];
  sampleAnswers: string[];
  tips: string[];
}

export const mockAbstractSets: IAbstractSet[] = [
  {
    id: 1,
    title: "Set 1: Generosity & Giving",
    imageUrl: "https://images.unsplash.com/photo-1544027993-37dbfe43562a?w=800&auto=format&fit=crop&q=60",
    questions: [
      "Tell me about the last time you gave someone a possession.",
      "How did you feel about it?",
      "Why should people encourage others to share or do charity?"
    ],
    sampleAnswers: [
      `Here is my response to the three questions:
      
Firstly, regarding the last time I gave someone a possession, it was about three months ago. I decided to give my old laptop to my younger cousin who just started university. His family was facing financial difficulties and couldn't afford a new computer for his studies.
      
Secondly, speaking of how I felt, I felt incredibly happy and fulfilled. Knowing that my old device, which was just sitting in my drawer, could make such a significant difference in his education brought me a deep sense of joy. It made me realize that sharing is far more rewarding than keeping things we no longer need.
      
Lastly, as to why people should encourage others to share or do charity, I believe it builds a stronger and more compassionate society. When we encourage sharing, we help bridge the gap between the rich and the poor, and we foster empathy among citizens. It creates a network of support that ensures nobody is left behind during difficult times.`,
      `Here is an alternative approach to this topic:
 
First of all, to talk about the last time I gave away a possession, it was just last week. I gifted a set of rare English reference books to a coworker who is preparing for an IELTS exam. Since I had already passed my exam, I thought they would be of much greater use to her.
 
Secondly, in terms of my feelings, I felt extremely satisfied and proud. Helping a colleague achieve their career goals is very rewarding, and it strengthened our workplace friendship. It also made me feel less cluttered at home, which was a pleasant side effect.
 
Finally, regarding why sharing and charity should be encouraged, I think it spreads kindness and creates a positive chain reaction. When someone receives help, they are much more likely to help others in the future. Moreover, it reduces social inequality and ensures that resources are distributed to those who actually need them the most.`
    ],
    tips: [
      "Đối với Part 4, bạn có 60 giây để chuẩn bị cho CẢ 3 CÂU HỎI. Hãy dùng nháp để gạch nhanh các ý chính cho từng câu.",
      "Khi nói, bạn phải nói liên tục trong 120 giây. Hãy dùng các từ nối chỉ trình tự như 'Firstly, regarding...', 'Secondly, speaking of...', 'Lastly, as to...' để phân chia bài nói rõ ràng.",
      "Cố gắng phân bổ thời gian đều: khoảng 35-40 giây cho mỗi câu hỏi con để tránh việc nói quá dài ở câu 1 và thiếu thời gian cho câu 3."
    ]
  }
];
