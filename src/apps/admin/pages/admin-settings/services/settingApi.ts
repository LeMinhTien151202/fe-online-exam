import axiosInstance from '@/configs/axios';

export interface ISetting {
  settingKey: string;
  settingValue: string;
}

export interface IUploadedFile {
  url: string;
  key: string;
  size: number;
  mimeType: string;
}

export const MOCK_DURATION_KEYS = [
  { key: 'MOCK_TEST_DURATION_GRAMMAR', label: 'Ngữ pháp & Từ vựng' },
  { key: 'MOCK_TEST_DURATION_LISTENING', label: 'Nghe' },
  { key: 'MOCK_TEST_DURATION_READING', label: 'Đọc hiểu' },
  { key: 'MOCK_TEST_DURATION_WRITING', label: 'Viết' },
  { key: 'MOCK_TEST_DURATION_SPEAKING', label: 'Nói' },
];

export const GENERAL_SETTING_KEYS = {
  appName: 'APP_NAME',
  appDescription: 'APP_DESCRIPTION',
  logoUrl: 'APP_LOGO_URL',
  faviconUrl: 'APP_FAVICON_URL',
  supportEmail: 'SUPPORT_EMAIL',
  supportPhone: 'SUPPORT_PHONE',
  primaryColor: 'PRIMARY_COLOR',
  secondaryColor: 'SECONDARY_COLOR',
  maxUploadMb: 'MAX_UPLOAD_MB',
} as const;

export const settingApi = {
  getAll: () => axiosInstance.get<ISetting[], ISetting[]>('/settings'),
  update: (key: string, settingValue: string) =>
    axiosInstance.patch<ISetting, ISetting>(`/settings/${key}`, { settingValue }),
  uploadImage: (file: File, prefix = 'settings') => {
    const formData = new FormData();
    formData.append('file', file);
    return axiosInstance.post<IUploadedFile, IUploadedFile>('/files/upload', formData, {
      params: { folder_type: 'images', prefix },
      headers: { 'Content-Type': null },
    });
  },
};
