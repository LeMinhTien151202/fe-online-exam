import { message } from 'antd';
import {
  useCreateFaqMutation,
  useDeleteFaqMutation,
  useFaqsQuery,
  useUpdateFaqMutation,
} from '../services/faqQuery';
import { ICreateFaqPayload, IFaq } from '../services/types';
import { usePagination } from '@/shared/hooks/usePagination';

export const useFaq = () => {
  const { page, pageSize, onChange, reset } = usePagination(10);
  // Admin xem cả FAQ đang ẩn
  const { data, isLoading } = useFaqsQuery({ includeInactive: true, page, limit: pageSize });
  const createMutation = useCreateFaqMutation();
  const updateMutation = useUpdateFaqMutation();
  const deleteMutation = useDeleteFaqMutation();

  const faqs = data?.data ?? [];
  const total = data?.metaData?.total ?? 0;

  const handleSave = (values: ICreateFaqPayload, editingId?: number) => {
    if (editingId) {
      updateMutation.mutate(
        { id: editingId, payload: values },
        { onSuccess: () => message.success('Đã cập nhật FAQ.') }
      );
    } else {
      createMutation.mutate(values, {
        onSuccess: () => {
          reset();
          message.success('Đã thêm FAQ.');
        },
      });
    }
  };

  const handleDelete = (id: number) => {
    deleteMutation.mutate(id, { onSuccess: () => message.success('Đã xóa FAQ.') });
  };

  return {
    faqs: faqs as IFaq[],
    isLoading,
    total,
    page,
    pageSize,
    onPageChange: onChange,
    isSaving: createMutation.isPending || updateMutation.isPending,
    handleSave,
    handleDelete,
  };
};
