import { useState } from 'react';
import { message } from 'antd';
import { useNavigate, useParams, useSearch } from '@tanstack/react-router';
import {
  useAssignQuestionsMutation,
  useExamDetailQuery,
  useRemoveQuestionMutation,
  useReorderQuestionsMutation,
  useToggleExamActiveMutation,
  useUpdateExamMutation,
  useUpdatePartMutation,
  useUpdateSectionMutation,
} from '../services/examQuery';
import { IExamPart } from '../services/types';

export const useExamDetail = () => {
  const navigate = useNavigate();
  const { examId } = useParams({ strict: false }) as { examId?: string };
  const search = useSearch({ strict: false }) as { mode?: string };
  const readOnly = search?.mode === 'view';
  const id = examId ? Number(examId) : null;

  const { data: exam, isLoading } = useExamDetailQuery(id);

  const updateExam = useUpdateExamMutation();
  const toggleActive = useToggleExamActiveMutation();
  const updateSection = useUpdateSectionMutation();
  const updatePart = useUpdatePartMutation();
  const reorderQuestions = useReorderQuestionsMutation();
  const removeQuestion = useRemoveQuestionMutation();
  const assignQuestions = useAssignQuestionsMutation();

  // Form sửa tiêu đề/mô tả (nạp từ dữ liệu vừa fetch, điều chỉnh state lúc render)
  const [loadedId, setLoadedId] = useState<number | null>(null);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  if (exam && exam.id !== loadedId) {
    setLoadedId(exam.id);
    setTitle(exam.title);
    setDescription(exam.description ?? '');
  }

  const handleSaveInfo = () => {
    if (!id) return;
    updateExam.mutate(
      { id, payload: { title, description } },
      { onSuccess: () => message.success('Đã lưu thông tin đề.') }
    );
  };

  const handleToggleActive = () => {
    if (!id) return;
    toggleActive.mutate(id, {
      onSuccess: (res) => message.success(res.isActive ? 'Đã công khai đề.' : 'Đã ẩn đề.'),
    });
  };

  const handleSaveDuration = (sectionId: number, durationMinutes: number) => {
    updateSection.mutate(
      { sectionId, durationMinutes },
      { onSuccess: () => message.success('Đã cập nhật thời gian.') }
    );
  };

  const handleSavePart = (partId: number, payload: { instruction?: string; audioUrl?: string }) => {
    updatePart.mutate(
      { partId, payload },
      { onSuccess: () => message.success('Đã cập nhật phần thi.') }
    );
  };

  // Thêm câu hỏi mới vào part: orderIndex nối tiếp sau các câu đã có
  const handleAddQuestions = (part: IExamPart, questionIds: number[]) => {
    if (questionIds.length === 0) return;
    const startIndex = part.questions.length;
    const questions = questionIds.map((questionId, i) => ({ questionId, orderIndex: startIndex + i }));
    assignQuestions.mutate(
      { partId: part.id, questions },
      { onSuccess: () => message.success(`Đã thêm ${questionIds.length} câu hỏi vào Part ${part.partNumber}.`) }
    );
  };

  const handleRemoveQuestion = (partId: number, questionId: number) => {
    removeQuestion.mutate(
      { partId, questionId },
      { onSuccess: () => message.success('Đã gỡ câu hỏi khỏi phần.') }
    );
  };

  // Đổi vị trí 1 câu trong part rồi gửi TOÀN BỘ thứ tự mới
  const handleMoveQuestion = (part: IExamPart, index: number, direction: -1 | 1) => {
    const ordered = [...part.questions].sort((a, b) => a.orderIndex - b.orderIndex);
    const target = index + direction;
    if (target < 0 || target >= ordered.length) return;
    [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
    const questions = ordered.map((q, i) => ({ questionId: q.questionId, orderIndex: i }));
    reorderQuestions.mutate({ partId: part.id, questions });
  };

  return {
    exam,
    isLoading,
    readOnly,
    title,
    setTitle,
    description,
    setDescription,
    isSavingInfo: updateExam.isPending,
    isTogglingActive: toggleActive.isPending,
    goBack: () => navigate({ to: '/admin/exams' }),
    handleSaveInfo,
    handleToggleActive,
    handleSaveDuration,
    handleSavePart,
    handleAddQuestions,
    handleRemoveQuestion,
    handleMoveQuestion,
  };
};
