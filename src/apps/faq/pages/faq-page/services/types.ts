export interface IFaq {
  id: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdAt: string;
}

export interface IFaqFilter {
  category?: string;
  search?: string;
}
