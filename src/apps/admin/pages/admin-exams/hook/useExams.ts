import { useMemo } from 'react';
import { Modal, message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { useDeleteExamMutation, useExamSetsQuery, useToggleExamActiveMutation } from '../services/examQuery';
import { ID_TO_FE_SKILL, IExamSetListItem } from '../services/types';
import { useState } from 'react';

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

  const { data, isLoading } = useExamSetsQuery();
  const deleteMutation = useDeleteExamMutation();
  const toggleMutation = useToggleExamActiveMutation();

  const all = useMemo(() => data ?? [], [data]);
  const partExams = useMemo(() => all.filter((e) => e.type === 'PART_PRACTICE').map(mapPart), [all]);
  const setExams = useMemo(() => all.filter((e) => e.type === 'SKILL_FULL_SET').map(mapSet), [all]);
  const fullExams = useMemo(() => all.filter((e) => e.type === 'MOCK_TEST').map(mapFull), [all]);

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
    setActiveTab,
    partExams,
    setExams,
    fullExams,
    isLoading,
    handleCreateNew,
    handleDelete,
    handleToggle,
    handleView,
  };
};
