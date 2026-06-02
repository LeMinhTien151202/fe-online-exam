export interface ISentence {
  id: string;
  text: string;
}

export interface IP1Question {
  id: number;
  sentence: string;
  options: string[];
}

export interface IP3Opinion {
  id: string;
  name: string;
  color: string;
  text: string;
}

export interface IP3Question {
  id: number;
  text: string;
}

export interface IP4Heading {
  value: string;
  label: string;
}

export interface IP4Paragraph {
  num: number;
  text: string;
}

export const initialP2Sentences: ISentence[] = [
  { id: 's1', text: 'It was full of people, and the staff were busy on their opening day.' },
  { id: 's2', text: 'I had to choose one, so I chose the most expensive sandwich.' },
  { id: 's3', text: 'Despite the crowd, they got me a nice table and gave me the menu.' },
  { id: 's4', text: 'It tasted really good with cheese topping, and I will definitely return here.' },
  { id: 's5', text: 'When I first looked at it, I was disappointed because I hoped for a variety of dishes.' }
];

export const p2FixedSentence = 'Last night I went to the cafe opening, The Corner Cafe near my house.';

export const correctP1: Record<number, string> = {
  1: 'effective',
  2: 'maximum',
  3: 'extended',
  4: 'fine',
  5: 'renew'
};

export const correctP2 = ['s1', 's3', 's5', 's2', 's4'];

export const correctP3: Record<number, string> = {
  1: 'B',
  2: 'A',
  3: 'C',
  4: 'D',
  5: 'B',
  6: 'C',
  7: 'A'
};

export const correctP4: Record<number, string> = {
  1: 'h1',
  2: 'h3',
  3: 'h2',
  4: 'h7',
  5: 'h4',
  6: 'h6',
  7: 'h5'
};

export const p1QuestionsData: IP1Question[] = [
  { id: 1, sentence: 'The new policies will be _______ starting next semester.', options: ['effective', 'affected', 'efficient'] },
  { id: 2, sentence: 'Students can now borrow a _______ of ten books at a time.', options: ['maximum', 'total', 'limit'] },
  { id: 3, sentence: 'The lending period has been _______ to three weeks.', options: ['extended', 'increased', 'reduced'] },
  { id: 4, sentence: 'There will be a slight increase in the _______ for returning books late.', options: ['fine', 'fee', 'charge'] },
  { id: 5, sentence: 'Students are encouraged to _______ their items online.', options: ['renew', 'return', 'reserve'] }
];

export const p3Opinions: IP3Opinion[] = [
  { id: 'A', name: 'A - Boyd', color: '#3b82f6', text: 'I think online shopping is the future. It is incredibly convenient, saves hours of driving, and lets you compare prices instantly from multiple stores. However, the lack of tactile feel means sometimes products do not match the photos online.' },
  { id: 'B', name: 'B - Emilia', color: '#10b981', text: 'I still prefer traditional retail stores. Shopping should be a social activity with friends. You get to touch the fabrics, try on clothes, and speak to helpful staff directly. Online shopping feels lonely and creates too much plastic packaging waste.' },
  { id: 'C', name: 'C - Liam', color: '#f59e0b', text: 'I am concerned about online security and data privacy. Every time you purchase something online, your personal information is stored on servers. Hackers can steal your credit card details. Plus, wait times for delivery can be highly frustrating.' },
  { id: 'D', name: 'D - Sofia', color: '#8b5cf6', text: 'Hybrid shopping is the best way. I browse products in physical retail showrooms to test their size and comfort, then buy them online at a lower price. This gives me the best of both worlds, although returning products can still be tedious.' }
];

export const p3Questions: IP3Question[] = [
  { id: 1, text: 'Which person values shopping as a social event with friends?' },
  { id: 2, text: 'Which person mentions the convenience and instant price comparison of e-commerce?' },
  { id: 3, text: 'Which person expresses concern about servers storing private customer information?' },
  { id: 4, text: 'Which person recommends looking at products in stores first before ordering online?' },
  { id: 5, text: 'Which person worries about the environmental impact of shipping packages?' },
  { id: 6, text: 'Which person dislikes waiting for packages to arrive at their house?' },
  { id: 7, text: 'Which person notices that products sometimes differ from their online descriptions?' }
];

export const p4Headings: IP4Heading[] = [
  { value: 'h1', label: 'I. The rise of industrial automation and its impact' },
  { value: 'h2', label: 'II. Economic benefits and cost efficiency' },
  { value: 'h3', label: 'III. Historical roots of manufacturing processes' },
  { value: 'h4', label: 'IV. Challenges in worker displacement and job retraining' },
  { value: 'h5', label: 'V. Predictions for the next technological revolution' },
  { value: 'h6', label: 'VI. Software algorithms and computer vision evolution' },
  { value: 'h7', label: 'VII. Safety improvements in hazardous work settings' },
  { value: 'h8', label: 'VIII. Public reactions and consumer attitudes' }
];

export const p4Paragraphs: IP4Paragraph[] = [
  { num: 1, text: 'Industrial automation has experienced exponential growth over the past few decades. Modern factories now rely heavily on sophisticated robotic arms and automated conveyor belts to assemble complex products. This technological shift has altered the fundamental structure of manufacturing worldwide.' },
  { num: 2, text: 'Historically, the concept of automation dates back to simple mechanical systems designed during the Industrial Revolution. However, today\'s automation is powered by digital microprocessors and advanced electrical systems, allowing machines to perform intricate processes with microscopic precision.' },
  { num: 3, text: 'One of the primary drivers behind this trend is sheer economic efficiency. Automated assembly lines can operate 24 hours a day, 7 days a week, without breaks or fatigue. Companies that implement automated machinery report massive increases in production volumes alongside significant reductions in operating overhead.' },
  { num: 4, text: 'Furthermore, automation has vastly improved factory safety. Heavy lifting, handling of hazardous chemicals, and working in extreme temperatures are now frequently delegated to resilient machinery. As a result, industrial workplace injuries have dropped dramatically in highly automated sectors.' },
  { num: 5, text: 'Despite these benefits, the rapid transition has triggered severe challenges for the labor force. Thousands of assembly-line workers have faced displacement as their manual skills become redundant. Experts emphasize the urgent need for robust government-sponsored job retraining programs to transition these workers into technical roles.' },
  { num: 6, text: 'At the heart of modern automation lies software sophistication. Machine learning algorithms, coupled with advanced high-speed computer vision systems, allow robots to detect defects in real-time, sort items dynamically, and make logical decisions on the factory floor without human intervention.' },
  { num: 7, text: 'Looking ahead, futurists predict that the next generation of automation will incorporate artificial general intelligence. Cobots—collaborative robots designed to work safely alongside humans—will become commonplace, permanently shifting the nature of human labor and industrial design.' }
];
