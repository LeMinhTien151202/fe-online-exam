import axiosInstance from '@/configs/axios';

export interface ISetting {
  settingKey: string;
  settingValue: string;
}

// Các key thời gian thi thử (phút) theo seed BE
export const MOCK_DURATION_KEYS = [
  { key: 'MOCK_TEST_DURATION_GRAMMAR', label: 'Ngữ pháp & Từ vựng' },
  { key: 'MOCK_TEST_DURATION_LISTENING', label: 'Nghe' },
  { key: 'MOCK_TEST_DURATION_READING', label: 'Đọc hiểu' },
  { key: 'MOCK_TEST_DURATION_WRITING', label: 'Viết' },
  { key: 'MOCK_TEST_DURATION_SPEAKING', label: 'Nói' },
];

export const settingApi = {
  getAll: () => axiosInstance.get<ISetting[], ISetting[]>('/settings'),
  update: (key: string, settingValue: string) =>
    axiosInstance.patch<ISetting, ISetting>(`/settings/${key}`, { settingValue }),
};
