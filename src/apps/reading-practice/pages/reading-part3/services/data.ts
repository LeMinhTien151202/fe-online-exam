export interface IOpinion {
  id: string;
  name: string;
  color: string;
  text: string;
}

export interface IQuestion {
  id: number;
  text: string;
}

export const correctAnswers: Record<number, string> = {
  1: 'B',
  2: 'A',
  3: 'C',
  4: 'D',
  5: 'B',
  6: 'C',
  7: 'A'
};

export const opinions: IOpinion[] = [
  {
    id: 'A',
    name: 'A - Boyd',
    color: '#3b82f6',
    text: 'I think online shopping is the future. It is incredibly convenient, saves hours of driving, and lets you compare prices instantly from multiple stores. However, the lack of tactile feel means sometimes products do not match the photos online.'
  },
  {
    id: 'B',
    name: 'B - Emilia',
    color: '#10b981',
    text: 'I still prefer traditional retail stores. Shopping should be a social activity with friends. You get to touch the fabrics, try on clothes, and speak to helpful staff directly. Online shopping feels lonely and creates too much plastic packaging waste.'
  },
  {
    id: 'C',
    name: 'C - Liam',
    color: '#f59e0b',
    text: 'I am concerned about online security and data privacy. Every time you purchase something online, your personal information is stored on servers. Hackers can steal your credit card details. Plus, wait times for delivery can be highly frustrating.'
  },
  {
    id: 'D',
    name: 'D - Sofia',
    color: '#8b5cf6',
    text: 'Hybrid shopping is the best way. I browse products in physical retail showrooms to test their size and comfort, then buy them online at a lower price. This gives me the best of both worlds, although returning products can still be tedious.'
  }
];

export const questions: IQuestion[] = [
  { id: 1, text: 'Which person values shopping as a social event with friends?' },
  { id: 2, text: 'Which person mentions the convenience and instant price comparison of e-commerce?' },
  { id: 3, text: 'Which person expresses concern about servers storing private customer information?' },
  { id: 4, text: 'Which person recommends looking at products in stores first before ordering online?' },
  { id: 5, text: 'Which person worries about the environmental impact of shipping packages?' },
  { id: 6, text: 'Which person dislikes waiting for packages to arrive at their house?' },
  { id: 7, text: 'Which person notices that products sometimes differ from their online descriptions?' }
];
