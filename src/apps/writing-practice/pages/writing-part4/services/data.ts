export interface IPart4Scenario {
  title: string;
  situation: string;
  informalPrompt: string;
  formalPrompt: string;
  sampleAnswers: Array<{
    label: string;
    informal: string;
    formal: string;
  }>;
}

export const mockPart4Scenario: IPart4Scenario = {
  title: "Public Art Club Talk",
  situation: "Dear all members,\n\nThe Art Club is organizing a talk to the public to attract more attention. We are going to invite an artist to give a talk to members. As a member of our club, could you give us an artist to join our talk and what topic should they share to gain more attention. We would like to have more both young and elderly members.",
  informalPrompt: "Write a short email to your friend (about 50 words). Tell your friend your feelings about this and what you plan to do.",
  formalPrompt: "Write an email to the president of the club (about 120-150 words). Tell them your thoughts about this and what you would like to do.",
  sampleAnswers: [
    {
      label: "Gợi ý đáp án mẫu 1",
      informal: "Hi Sarah,\n\nI'm so excited about the upcoming public talk organized by our Art Club! I think it's a great opportunity to attract new members. I'm planning to suggest inviting local painter Leo Wood to share some basic watercolor techniques. What do you think? Let me know!\n\nBest,\nAlex",
      formal: "Dear Mr. President,\n\nI am writing to share my suggestions regarding the public talk being organized by our Art Club. I believe this event is an excellent initiative to attract both young and elderly members to our community.\n\nTo broaden our audience, I would like to propose inviting Mrs. Clara Oswald, a renowned local artist known for her intergenerational art projects. She could give a talk on 'Connecting Generations Through Art,' which is a highly relevant topic. Furthermore, she could host a hands-on workshop where members of different ages collaborate on a single painting.\n\nI would be delighted to assist in contacting Mrs. Oswald and helping to organize the venue for the event. Please let me know if you would like me to draft an official invitation.\n\nThank you for your time and leadership.\n\nSincerely,\nAlex Miller"
    },
    {
      label: "Gợi ý đáp án mẫu 2",
      informal: "Hey Jack,\n\nDid you hear about the Art Club's public talk? I think it is a brilliant idea to bring more people in. I plan to recommend a famous street artist to talk about modern graffiti. I'm going to email the president about this today. Join me?\n\nCheers,\nTom",
      formal: "Dear President of the Art Club,\n\nI am writing to express my enthusiasm for the upcoming public talk and to offer my suggestions for guest speakers and topics.\n\nTo attract younger participants while engaging our elderly members, I recommend inviting Mr. David Vance, a digital illustrator who also specializes in traditional oil painting. His talk could focus on 'The Evolution of Art Techniques: From Canvas to Screen.' This topic bridges the gap between classic methods and modern digital media, making it appealing to all age groups.\n\nI would like to volunteer to design the promotional posters and manage our social media campaign to ensure we reach a wider audience. I am confident that with proper advertising, we can make this event a great success.\n\nThank you for your consideration.\n\nWarm regards,\nThomas Wright"
    }
  ]
};
