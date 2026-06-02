export interface IHeading {
  value: string;
  label: string;
}

export interface IParagraph {
  num: number;
  text: string;
}

export const correctAnswers: Record<number, string> = {
  1: 'h1',
  2: 'h3',
  3: 'h2',
  4: 'h7',
  5: 'h4',
  6: 'h6',
  7: 'h5'
};

export const headings: IHeading[] = [
  { value: 'h1', label: 'I. The rise of industrial automation and its impact' },
  { value: 'h2', label: 'II. Economic benefits and cost efficiency' },
  { value: 'h3', label: 'III. Historical roots of manufacturing processes' },
  { value: 'h4', label: 'IV. Challenges in worker displacement and job retraining' },
  { value: 'h5', label: 'V. Predictions for the next technological revolution' },
  { value: 'h6', label: 'VI. Software algorithms and computer vision evolution' },
  { value: 'h7', label: 'VII. Safety improvements in hazardous work settings' },
  { value: 'h8', label: 'VIII. Public reactions and consumer attitudes' }
];

export const paragraphs: IParagraph[] = [
  {
    num: 1,
    text: 'Industrial automation has experienced exponential growth over the past few decades. Modern factories now rely heavily on sophisticated robotic arms and automated conveyor belts to assemble complex products. This technological shift has altered the fundamental structure of manufacturing worldwide.'
  },
  {
    num: 2,
    text: 'Historically, the concept of automation dates back to simple mechanical systems designed during the Industrial Revolution. However, today\'s automation is powered by digital microprocessors and advanced electrical systems, allowing machines to perform intricate processes with microscopic precision.'
  },
  {
    num: 3,
    text: 'One of the primary drivers behind this trend is sheer economic efficiency. Automated assembly lines can operate 24 hours a day, 7 days a week, without breaks or fatigue. Companies that implement automated machinery report massive increases in production volumes alongside significant reductions in operating overhead.'
  },
  {
    num: 4,
    text: 'Furthermore, automation has vastly improved factory safety. Heavy lifting, handling of hazardous chemicals, and working in extreme temperatures are now frequently delegated to resilient machinery. As a result, industrial workplace injuries have dropped dramatically in highly automated sectors.'
  },
  {
    num: 5,
    text: 'Despite these benefits, the rapid transition has triggered severe challenges for the labor force. Thousands of assembly-line workers have faced displacement as their manual skills become redundant. Experts emphasize the urgent need for robust government-sponsored job retraining programs to transition these workers into technical roles.'
  },
  {
    num: 6,
    text: 'At the heart of modern automation lies software sophistication. Machine learning algorithms, coupled with advanced high-speed computer vision systems, allow robots to detect defects in real-time, sort items dynamically, and make logical decisions on the factory floor without human intervention.'
  },
  {
    num: 7,
    text: 'Looking ahead, futurists predict that the next generation of automation will incorporate artificial general intelligence. Cobots—collaborative robots designed to work safely alongside humans—will become commonplace, permanently shifting the nature of human labor and industrial design.'
  }
];
