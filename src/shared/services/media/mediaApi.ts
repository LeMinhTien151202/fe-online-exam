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
  upload: (file: File, folderType: FileFolderType, prefix?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<IUploadedFile, IUploadedFile>('/files/upload', formData, {
      params: { folder_type: folderType, ...(prefix ? { prefix } : {}) },
      headers: { 'Content-Type': null },
    });
  },
};

// Tiện ích: upload 1 bản ghi âm (Blob từ MediaRecorder) -> trả URL công khai.
export const uploadAudioBlob = async (blob: Blob, prefix = 'speaking/mock', fileName?: string): Promise<string> => {
  const ext = blob.type.includes('mp4') ? 'mp4' : blob.type.includes('ogg') ? 'ogg' : 'webm';
  const name = fileName ?? `rec-${Date.now()}.${ext}`;
  const file = new File([blob], name, { type: blob.type || 'audio/webm' });
  const res = await mediaApi.upload(file, 'audio', prefix);
  return res.url;
};
