import axiosInstance from '@/configs/axios';
import { IFaq, IFaqFilter } from './types';

export const faqApi = {
  // Học viên chỉ thấy FAQ đang bật (không gửi includeInactive)
  list: (filter: IFaqFilter = {}) => axiosInstance.get<IFaq[], IFaq[]>('/faqs', { params: filter }),
};
