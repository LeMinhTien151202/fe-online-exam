export interface ISubQuestion {
  id: string;
  title: string;
  options: string[];
}

export interface IQuestionGroup {
  id: number;
  title: string;
  instruction: string;
  subQuestions: ISubQuestion[];
  transcript: string;
}

export const mockGroups: IQuestionGroup[] = [
  {
    id: 16,
    title: 'A Regional Development Plan',
    instruction: 'Listen to a city planner talk at a press conference about Regional Development Planning and answer the questions below.',
    subQuestions: [
      {
        id: '16.1',
        title: '16.1: What is one of the main criticisms of the Regional Development Plan?',
        options: [
          'It places too much emphasis on public transportation.',
          'It doesn\'t provide enough alternatives to driving.',
          'It is too expensive to implement the plan.'
        ]
      },
      {
        id: '16.2',
        title: '16.2: What challenge is the Regional Development Plan likely to face?',
        options: [
          'It could face difficulties in gaining government approval.',
          'It is likely to meet resistance from local communities.',
          'It might fail due to lack of private investment.'
        ]
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
        title: '17.1: Where does the speaker recommend locating the new public park?',
        options: [
          'Near the central library',
          'Adjacent to the train station',
          'Close to the riverfront area'
        ]
      },
      {
        id: '17.2',
        title: '17.2: Why is the budget for the new park being reduced by 10%?',
        options: [
          'To cover additional maintenance costs',
          'To fund the construction of a new community center nearby',
          'Due to an unexpected drop in municipal tax revenue'
        ]
      }
    ],
    transcript: 'Official (Q17): Moving on to the second agenda, the new public park. After reviewing the feedback, we recommend locating it close to the riverfront area, which offers the best green space. Unfortunately, because we need to fund the construction of a new community center nearby, we have had to trim the park budget by 10%.'
  }
];
