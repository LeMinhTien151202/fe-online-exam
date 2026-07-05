import { useQuery } from '@tanstack/react-query';
import { faqApi } from './faqApi';

export const FAQ_LIST_KEY = ['faqs', 'public'];

export const useFaqsQuery = () => {
  return useQuery({
    queryKey: FAQ_LIST_KEY,
    queryFn: () => faqApi.list(),
  });
};
