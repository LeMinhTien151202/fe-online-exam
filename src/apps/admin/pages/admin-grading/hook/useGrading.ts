import { useMemo, useState } from 'react';
import { usePagination } from '@/shared/hooks/usePagination';
import { ExamType } from '../../admin-exams/services/types';
import { useAttemptsQuery } from '../services/attemptQuery';

// Mỗi tab = 1 loại đề. PART_PRACTICE không ghi attempt nên không có tab riêng.
const TYPE_BY_TAB: Record<string, ExamType | undefined> = {
  all: undefined,
  mock: 'MOCK_TEST',
  set: 'SKILL_FULL_SET',
};

export const useGrading = () => {
  const [activeTab, setActiveTab] = useState('all');
  const { page, pageSize, onChange, reset } = usePagination(10);

  const { data, isLoading } = useAttemptsQuery({
    type: TYPE_BY_TAB[activeTab],
    page,
    limit: pageSize,
  });

  const rows = useMemo(() => data?.data ?? [], [data]);
  const total = data?.metaData?.total ?? 0;

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    reset();
  };

  return {
    activeTab,
    setActiveTab: changeTab,
    rows,
    total,
    page,
    pageSize,
    onPageChange: onChange,
    isLoading,
  };
};
