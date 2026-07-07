import { FileType } from './types';

// Nhóm định dạng file dùng để chọn icon/màu/nhãn hiển thị
export type FileKind = 'pdf' | 'word' | 'excel' | 'ppt' | 'video' | 'image' | 'audio' | 'archive' | 'text' | 'file';

export interface FileMeta {
  kind: FileKind;
  label: string;
  color: string;
  bg: string;
}

// Đuôi file -> nhóm
const EXT_TO_KIND: Record<string, FileKind> = {
  pdf: 'pdf',
  doc: 'word', docx: 'word',
  xls: 'excel', xlsx: 'excel', csv: 'excel',
  ppt: 'ppt', pptx: 'ppt',
  mp4: 'video', mov: 'video', avi: 'video', mkv: 'video', webm: 'video', m4v: 'video',
  jpg: 'image', jpeg: 'image', png: 'image', gif: 'image', webp: 'image', svg: 'image',
  mp3: 'audio', wav: 'audio', m4a: 'audio', ogg: 'audio',
  zip: 'archive', rar: 'archive', '7z': 'archive',
  txt: 'text', rtf: 'text',
};

// Nhóm -> nhãn + màu
export const KIND_META: Record<FileKind, { label: string; color: string; bg: string }> = {
  pdf: { label: 'PDF', color: '#ef4444', bg: '#fef2f2' },
  word: { label: 'Word', color: '#2563eb', bg: '#eff6ff' },
  excel: { label: 'Excel', color: '#16a34a', bg: '#f0fdf4' },
  ppt: { label: 'PowerPoint', color: '#ea580c', bg: '#fff7ed' },
  video: { label: 'Video', color: '#7c3aed', bg: '#f5f3ff' },
  image: { label: 'Ảnh', color: '#0891b2', bg: '#ecfeff' },
  audio: { label: 'Audio', color: '#db2777', bg: '#fdf2f8' },
  archive: { label: 'Nén', color: '#a16207', bg: '#fefce8' },
  text: { label: 'Văn bản', color: '#475569', bg: '#f8fafc' },
  file: { label: 'Tệp', color: '#475569', bg: '#f1f5f9' },
};

// Lấy đuôi file từ URL (bỏ query/hash)
const extFromUrl = (url: string): string => {
  const clean = (url || '').split(/[?#]/)[0];
  const seg = clean.substring(clean.lastIndexOf('/') + 1);
  const dot = seg.lastIndexOf('.');
  return dot >= 0 ? seg.substring(dot + 1).toLowerCase() : '';
};

// Ưu tiên suy từ đuôi file thật; nếu không nhận diện được thì dùng fileType thô của API
export const getFileMeta = (fileUrl: string, fileType: FileType): FileMeta => {
  const ext = extFromUrl(fileUrl);
  let kind = EXT_TO_KIND[ext];
  if (!kind) kind = fileType === 'VIDEO' ? 'video' : fileType === 'PDF' ? 'pdf' : 'file';
  return { kind, ...KIND_META[kind] };
};
