export interface IMaterial {
  key: string;
  name: string;
  skill: string;
  format: 'pdf' | 'word' | string;
  size: string;
  description: string;
}
