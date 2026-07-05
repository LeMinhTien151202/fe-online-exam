import { useMemo } from 'react';
import { Modal, message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { useDeleteExamMutation, useExamSetsQuery, useToggleExamActiveMutation } from '../services/examQuery';
import { ExamType, ID_TO_FE_SKILL, IExamSetListItem } from '../services/types';
import { useState } from 'react';
import { usePagination } from '@/shared/hooks/usePagination';

const TYPE_BY_TAB: Record<string, ExamType> = {
  partial: 'PART_PRACTICE',
  set: 'SKILL_FULL_SET',
  full: 'MOCK_TEST',
};

const skillName = (e: IExamSetListItem) => e.skill?.name || (e.skillId ? ID_TO_FE_SKILL[e.skillId] : '') || '';

const mapPart = (e: IExamSetListItem) => ({
  key: String(e.id),
  id: e.id,
  name: e.title,
  skill: skillName(e),
  part: e.partNumber ? `Part ${e.partNumber}` : '',
  questionCount: undefined,
  duration: undefined,
  difficulty: 'medium',
  tryCount: e._count?.attempts ?? 0,
  avgScore: '-',
  status: e.isActive ? 'active' : 'draft',
});

const mapSet = (e: IExamSetListItem) => ({
  key: String(e.id),
  id: e.id,
  name: e.title,
  skill: skillName(e),
  partCount: e.skill?.totalParts ?? e._count?.sections ?? 0,
  questionCount: undefined,
  duration: undefined,
  difficulty: 'medium',
  tryCount: e._count?.attempts ?? 0,
  avgScore: '-',
  status: e.isActive ? 'active' : 'draft',
});

const mapFull = (e: IExamSetListItem) => ({
  key: String(e.id),
  id: e.id,
  name: e.title,
  skills: ['Grammar', 'Reading', 'Listening', 'Speaking', 'Writing'],
  duration: undefined,
  tryCount: e._count?.attempts ?? 0,
  status: e.isActive ? 'active' : 'draft',
});

export const useExams = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('partial');
  const { page, pageSize, onChange, reset } = usePagination(10);

  // Query theo tab đang mở (mỗi tab = 1 loại đề), có phân trang
  const { data, isLoading } = useExamSetsQuery({ type: TYPE_BY_TAB[activeTab], page, limit: pageSize });
  const deleteMutation = useDeleteExamMutation();
  const toggleMutation = useToggleExamActiveMutation();

  const rows = useMemo(() => data?.data ?? [], [data]);
  const total = data?.metaData?.total ?? 0;

  // Chỉ tab đang mở được render -> map theo tab hiện tại
  const partExams = useMemo(() => (activeTab === 'partial' ? rows.map(mapPart) : []), [activeTab, rows]);
  const setExams = useMemo(() => (activeTab === 'set' ? rows.map(mapSet) : []), [activeTab, rows]);
  const fullExams = useMemo(() => (activeTab === 'full' ? rows.map(mapFull) : []), [activeTab, rows]);

  const changeTab = (tab: string) => {
    setActiveTab(tab);
    reset();
  };

  const handleCreateNew = () => {
    navigate({ to: '/admin/exams/create' });
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xoá đề thi này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () =>
        deleteMutation.mutate(Number(key), {
          onSuccess: () => message.success('Đã xoá đề thi.'),
        }),
    });
  };

  const handleToggle = (key: string) => {
    toggleMutation.mutate(Number(key), {
      onSuccess: (res) => message.success(res.isActive ? 'Đã công khai đề thi.' : 'Đã ẩn đề thi.'),
    });
  };

  const handleView = (key: string) => {
    navigate({ to: `/admin/exams/${key}` as string });
  };

  return {
    activeTab,
    setActiveTab: changeTab,
    partExams,
    setExams,
    fullExams,
    total,
    page,
    pageSize,
    onPageChange: onChange,
    isLoading,
    handleCreateNew,
    handleDelete,
    handleToggle,
    handleView,
  };
};
