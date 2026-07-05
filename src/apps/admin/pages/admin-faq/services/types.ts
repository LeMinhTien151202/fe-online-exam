export interface IFaq {
  id: number;
  question: string;
  answer: string;
  category: string;
  sortOrder: number;
  isActive: boolean;
  createdBy: number;
  createdAt: string;
  deletedAt: string | null;
}

export interface ICreateFaqPayload {
  question: string;
  answer: string;
  category: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface IUpdateFaqPayload {
  question?: string;
  answer?: string;
  category?: string;
  sortOrder?: number;
  isActive?: boolean;
}

export interface IFaqFilter {
  page?: number;
  limit?: number;
  category?: string;
  search?: string;
  includeInactive?: boolean;
}
