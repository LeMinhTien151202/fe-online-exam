import { useMemo } from 'react';
import { useState } from 'react';
import { Form, Modal, message } from 'antd';
import {
  useCreateMaterialMutation,
  useDeleteMaterialMutation,
  useMaterialsQuery,
} from '../services/materialQuery';
import { FE_SKILL_TO_ID, FileType, ID_TO_FE_SKILL, IMaterial } from '../services/types';
import { usePagination } from '@/shared/hooks/usePagination';

interface MaterialFormValues {
  title: string;
  fileUrl: string;
  fileType: FileType;
  skill: string;
  durationSeconds?: number;
}

const mapToCard = (m: IMaterial) => ({
  key: String(m.id),
  id: m.id,
  name: m.title,
  skill: m.skill?.name || (m.skillId ? ID_TO_FE_SKILL[m.skillId] : '') || '',
  format: m.fileType === 'VIDEO' ? 'video' : 'pdf',
  fileType: m.fileType,
  fileUrl: m.fileUrl,
  durationSeconds: m.durationSeconds,
});

export const useMaterials = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const { page, pageSize, onChange, reset } = usePagination(12);
  const [form] = Form.useForm<MaterialFormValues>();

  const { data, isLoading } = useMaterialsQuery({ page, limit: pageSize });
  const createMutation = useCreateMaterialMutation();
  const deleteMutation = useDeleteMaterialMutation();

  const materials = useMemo(() => (data?.data ?? []).map(mapToCard), [data]);
  const total = data?.metaData?.total ?? 0;

  const handleUploadClick = () => {
    form.resetFields();
    setIsDrawerOpen(true);
  };

  const handleSaveMaterial = (values: MaterialFormValues) => {
    createMutation.mutate(
      {
        title: values.title,
        fileUrl: values.fileUrl,
        fileType: values.fileType,
        skillId: FE_SKILL_TO_ID[values.skill],
        ...(values.fileType === 'VIDEO' && values.durationSeconds
          ? { durationSeconds: values.durationSeconds }
          : {}),
      },
      {
        onSuccess: () => {
          setIsDrawerOpen(false);
          reset();
          message.success('Đã thêm tài liệu học tập.');
        },
      }
    );
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: 'Xoá tài liệu học tập này?',
      content: 'Tài liệu sẽ bị xoá và học viên không thể xem nữa.',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () =>
        deleteMutation.mutate(Number(key), {
          onSuccess: () => message.success('Đã xoá tài liệu.'),
        }),
    });
  };

  return {
    materials,
    isLoading,
    total,
    page,
    pageSize,
    onPageChange: onChange,
    isDrawerOpen,
    setIsDrawerOpen,
    form,
    isSaving: createMutation.isPending,
    handleUploadClick,
    handleSaveMaterial,
    handleDelete,
  };
};
