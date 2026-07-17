import { useMemo } from 'react';
import { useSettingsQuery } from '../services/settingQuery';
import { GENERAL_SETTING_KEYS } from '../services/settingApi';

export interface GeneralSettingsFormValues {
  appName: string;
  appDescription: string;
  logoUrl: string;
  faviconUrl: string;
  supportEmail: string;
  supportPhone: string;
  primaryColor: string;
  secondaryColor: string;
  maxUploadMb: number;
}

export const DEFAULT_GENERAL_SETTINGS: GeneralSettingsFormValues = {
  appName: 'Aptis Prep Online',
  appDescription: 'Nền tảng luyện thi thử Aptis tốt nhất Việt Nam',
  logoUrl: '/image.png',
  faviconUrl: '',
  supportEmail: 'support@aptisprep.vn',
  supportPhone: '',
  primaryColor: '#1a365d',
  secondaryColor: '#3b5b8c',
  maxUploadMb: 50,
};

/**
 * Hook dùng chung: đọc bảng settings và trả về cấu hình chung đã parse.
 * Được cả trang cài đặt (form) và AdminLayout (áp dụng tên/logo/màu) sử dụng.
 */
export const useGeneralSettings = () => {
  const { data: settings, isLoading } = useSettingsQuery();

  const settingMap = useMemo(() => {
    const map: Record<string, string> = {};
    (settings ?? []).forEach((s) => {
      map[s.settingKey] = s.settingValue;
    });
    return map;
  }, [settings]);

  const generalSettings = useMemo<GeneralSettingsFormValues>(() => ({
    appName: settingMap[GENERAL_SETTING_KEYS.appName] || DEFAULT_GENERAL_SETTINGS.appName,
    appDescription: settingMap[GENERAL_SETTING_KEYS.appDescription] ?? DEFAULT_GENERAL_SETTINGS.appDescription,
    logoUrl: settingMap[GENERAL_SETTING_KEYS.logoUrl] || DEFAULT_GENERAL_SETTINGS.logoUrl,
    faviconUrl: settingMap[GENERAL_SETTING_KEYS.faviconUrl] ?? DEFAULT_GENERAL_SETTINGS.faviconUrl,
    supportEmail: settingMap[GENERAL_SETTING_KEYS.supportEmail] ?? DEFAULT_GENERAL_SETTINGS.supportEmail,
    supportPhone: settingMap[GENERAL_SETTING_KEYS.supportPhone] ?? DEFAULT_GENERAL_SETTINGS.supportPhone,
    primaryColor: settingMap[GENERAL_SETTING_KEYS.primaryColor] || DEFAULT_GENERAL_SETTINGS.primaryColor,
    secondaryColor: settingMap[GENERAL_SETTING_KEYS.secondaryColor] || DEFAULT_GENERAL_SETTINGS.secondaryColor,
    maxUploadMb: Number(settingMap[GENERAL_SETTING_KEYS.maxUploadMb] || DEFAULT_GENERAL_SETTINGS.maxUploadMb),
  }), [settingMap]);

  return { settingMap, generalSettings, isLoading };
};
