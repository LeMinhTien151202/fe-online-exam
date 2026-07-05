import { useMemo, useState } from 'react';
import { useFaqsQuery } from '../services/faqQuery';

const ALL = 'Tất cả';

export const useFaqList = () => {
  const { data, isLoading } = useFaqsQuery();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState(ALL);
  const [openId, setOpenId] = useState<number | null>(null);

  const faqs = useMemo(() => data ?? [], [data]);

  const categories = useMemo(() => {
    const cats = new Set(faqs.map((f) => f.category).filter(Boolean));
    return [ALL, ...Array.from(cats)];
  }, [faqs]);

  const filteredFaqs = useMemo(() => {
    const keyword = searchQuery.trim().toLowerCase();
    return faqs.filter((faq) => {
      const matchesSearch =
        !keyword ||
        faq.question.toLowerCase().includes(keyword) ||
        faq.answer.toLowerCase().includes(keyword);
      const matchesCategory = activeCategory === ALL || faq.category === activeCategory;
      return matchesSearch && matchesCategory;
    });
  }, [faqs, searchQuery, activeCategory]);

  const toggleOpen = (id: number) => setOpenId((prev) => (prev === id ? null : id));

  return {
    isLoading,
    categories,
    filteredFaqs,
    searchQuery,
    setSearchQuery,
    activeCategory,
    setActiveCategory,
    openId,
    toggleOpen,
  };
};
