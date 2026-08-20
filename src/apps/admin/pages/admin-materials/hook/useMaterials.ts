import { useMemo, useState } from 'react';
import { Modal } from 'antd';
import { toast } from '../../../../../configs/toast';
import {
  useCreateMaterialMutation,
  useDeleteMaterialMutation,
  useMaterialsQuery,
  useUpdateMaterialMutation,
} from '../services/materialQuery';
import { FE_SKILL_TO_ID, FileType, ID_TO_FE_SKILL, IMaterial } from '../services/types';
import { usePagination } from '@/shared/hooks/usePagination';
import { MaterialFormValues } from '../components/MaterialModal';

const mapToCard = (material: IMaterial) => ({
  ...material,
  key: String(material.id),
  name: material.title,
  skillLabel: material.skill?.name || (material.skillId ? ID_TO_FE_SKILL[material.skillId] : '') || '',
  format: material.fileType.toLowerCase(),
});

export const useMaterials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingMaterial, setEditingMaterial] = useState<IMaterial | null>(null);
  const [search, setSearch] = useState('');
  const [skillId, setSkillId] = useState<number | undefined>();
  const [fileType, setFileType] = useState<FileType | undefined>();
  const { page, pageSize, onChange, reset } = usePagination(12);

  const { data, isLoading } = useMaterialsQuery({ page, limit: pageSize, search: search || undefined, skillId, fileType });
  const createMutation = useCreateMaterialMutation();
  const updateMutation = useUpdateMaterialMutation();
  const deleteMutation = useDeleteMaterialMutation();

  const materials = useMemo(() => (data?.data ?? []).map(mapToCard), [data]);
  const total = data?.metaData?.total ?? 0;

  const openCreate = () => {
    setEditingMaterial(null);
    setIsModalOpen(true);
  };

  const openEdit = (material: IMaterial) => {
    setEditingMaterial(material);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setEditingMaterial(null);
  };

  const handleSaveMaterial = async (values: MaterialFormValues) => {
    const payload = {
      title: values.title.trim(),
      fileUrl: values.fileUrl.trim(),
      fileType: values.fileType,
      skillId: FE_SKILL_TO_ID[values.skill],
      durationSeconds: values.fileType === 'VIDEO' ? Number(values.durationSeconds) : null,
    };
    if (editingMaterial) {
      await updateMutation.mutateAsync({ id: editingMaterial.id, payload });
      closeModal();
      toast.success('Đã cập nhật tài liệu.');
      return;
    }
    await createMutation.mutateAsync(payload);
    closeModal();
    reset();
    toast.success('Đã thêm tài liệu học tập.');
  };

  const handleDelete = (id: number) => {
    Modal.confirm({
      title: 'Xoá tài liệu học tập này?',
      content: 'Bản ghi sẽ bị xóa và object storage sẽ được dọn nếu không còn nơi nào sử dụng.',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => deleteMutation.mutate(id, { onSuccess: () => toast.success('Đã xoá tài liệu.') }),
    });
  };

  const changeSearch = (value: string) => { setSearch(value); reset(); };
  const changeSkill = (value?: number) => { setSkillId(value); reset(); };
  const changeFileType = (value?: FileType) => { setFileType(value); reset(); };

  return {
    materials, isLoading, total, page, pageSize, onPageChange: onChange,
    search, skillId, fileType, changeSearch, changeSkill, changeFileType,
    isModalOpen, editingMaterial, closeModal,
    isSaving: createMutation.isPending || updateMutation.isPending,
    openCreate, openEdit, handleSaveMaterial, handleDelete,
  };
};
