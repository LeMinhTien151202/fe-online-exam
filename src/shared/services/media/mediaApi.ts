import axiosInstance from '@/configs/axios';

export type FileFolderType = 'images' | 'audio';

export interface IUploadedFile {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

// Upload file media dùng chung — khớp .docs/FE_MEDIA_UPLOAD_FLOW.md.
// multipart/form-data, field `file`; query folder_type + prefix (tuỳ chọn).
// KHÔNG tự set 'Content-Type': để null cho axios tự sinh boundary (ép thủ công -> 400).
export const mediaApi = {
  // Chỉ dành cho admin/teacher khi quản trị nội dung.
  upload: (file: File, folderType: FileFolderType, prefix?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<IUploadedFile, IUploadedFile>('/files/upload', formData, {
      params: { folder_type: folderType, ...(prefix ? { prefix } : {}) },
      headers: { 'Content-Type': null },
    });
  },

  // Học viên chỉ được upload audio bài làm. BE tự tạo prefix theo studentId từ access token.
  uploadStudentAnswerAudio: (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<IUploadedFile, IUploadedFile>('/files/student-answers', formData, {
      headers: { 'Content-Type': null },
    });
  },
};

// Tiện ích: upload 1 bản ghi âm (Blob từ MediaRecorder) -> trả URL công khai.
export const uploadAudioBlob = async (blob: Blob, prefix = 'speaking/mock', fileName?: string): Promise<string> => {
  // Giữ tham số để tương thích caller cũ; prefix thực tế do BE tự tạo theo studentId.
  void prefix;
  const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm';
  const name = fileName ?? `rec-${Date.now()}.${ext}`;
  const file = new File([blob], name, { type: blob.type || 'audio/webm' });
  const res = await mediaApi.uploadStudentAnswerAudio(file);
  return res.url;
};
