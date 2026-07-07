import axiosInstance, { IApiEnvelope } from '@/configs/axios';
import { IQuestion } from '../../admin/pages/admin-questions/services/types';

// Reading = skillId 3. FE có 4 phần riêng biệt; phần 3 map sang API part 4,
// phần 4 map sang API part 5 (bỏ API part 3 vì trùng dạng ORDERING với part 2).
export const READING_SKILL_ID = 3;
export const FE_PART_TO_API: Record<number, number> = { 1: 1, 2: 2, 3: 4, 4: 5 };

export const readingApi = {
  // Lấy câu hỏi Reading theo phần (role check đã tắt ở BE dev nên học viên gọi được)
  listByPart: (fePart: number) =>
    axiosInstance.get<IApiEnvelope<IQuestion[]>, IApiEnvelope<IQuestion[]>>('/questions', {
      params: { skillId: READING_SKILL_ID, partNumber: FE_PART_TO_API[fePart], page: 1, limit: 50 },
      _rawEnvelope: true,
    }),
};
