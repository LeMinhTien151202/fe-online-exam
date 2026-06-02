export interface ISentence {
  id: string;
  text: string;
}

export const initialSentences: ISentence[] = [
  { id: 's1', text: 'It was full of people, and the staff were busy on their opening day.' },
  { id: 's2', text: 'I had to choose one, so I chose the most expensive sandwich.' },
  { id: 's3', text: 'Despite the crowd, they got me a nice table and gave me the menu.' },
  { id: 's4', text: 'It tasted really good with cheese topping, and I will definitely return here.' },
  { id: 's5', text: 'When I first looked at it, I was disappointed because I hoped for a variety of dishes.' }
];

export const fixedSentence = 'Last night I went to the cafe opening, The Corner Cafe near my house.';
export const correctOrder = ['s1', 's3', 's5', 's2', 's4'];
