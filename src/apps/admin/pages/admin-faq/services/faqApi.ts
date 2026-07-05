import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { ICreateFaqPayload, IFaq, IFaqFilter, IUpdateFaqPayload } from './types';

export const faqApi = {
  list: (filter: IFaqFilter = {}) =>
    axiosInstance.get<IApiEnvelope<IFaq[]>, IApiEnvelope<IFaq[]>>('/faqs', {
      params: filter,
      _rawEnvelope: true,
    }),

  detail: (id: number) => axiosInstance.get<IFaq, IFaq>(`/faqs/${id}`),

  create: (payload: ICreateFaqPayload) => axiosInstance.post<IFaq, IFaq>('/faqs', payload),

  update: (id: number, payload: IUpdateFaqPayload) =>
    axiosInstance.patch<IFaq, IFaq>(`/faqs/${id}`, payload),

  remove: (id: number) =>
    axiosInstance.delete<{ message: string }, { message: string }>(`/faqs/${id}`),
};
