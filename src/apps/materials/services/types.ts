// Loại file API hỗ trợ (khớp FE_PHASE7)
export type FileType = 'PDF' | 'VIDEO';

// Kỹ năng: id (seed BE) -> nhãn tiếng Việt khớp các tab lọc của trang học viên
export const SKILL_ID_TO_LABEL: Record<number, string> = {
  1: 'Ngữ pháp & Từ vựng',
  2: 'Nghe',
  3: 'Đọc',
  4: 'Viết',
  5: 'Nói',
};

// Entity trả về từ GET /study-materials
export interface IStudyMaterial {
  id: number;
  title: string;
  fileUrl: string;
  fileType: FileType;
  durationSeconds: number | null;
  skillId: number | null;
  teacherId: number;
  deletedAt: string | null;
  skill?: { id: number; name: string; totalParts: number };
}

export interface IMaterialFilter {
  skillId?: number;
  fileType?: FileType;
  search?: string;
  page?: number;
  limit?: number;
}

// Shape hiển thị trên card (đã map từ IStudyMaterial)
export interface IMaterial {
  key: string;
  id: number;
  name: string;
  skill: string;
  kind: string; // nhóm định dạng suy từ đuôi file (pdf/word/excel/ppt/video/image/...)
  formatLabel: string; // nhãn hiển thị (PDF, Word, Video...)
  color: string; // màu icon theo định dạng
  bg: string; // nền icon theo định dạng
  fileUrl: string;
  size: string; // VIDEO -> thời lượng; còn lại -> "Tài liệu <định dạng>"
  description: string;
}
