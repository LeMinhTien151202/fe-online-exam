import { useState } from 'react';
import { message } from 'antd';
import { UploadRequestOption } from '@rc-component/upload/lib/interface';
import { initialAuditLogs, initialPackages } from '../services/mockData';
import { useUpdateSettingMutation } from '../services/settingQuery';
import { GENERAL_SETTING_KEYS, settingApi } from '../services/settingApi';
import {
  DEFAULT_GENERAL_SETTINGS,
  GeneralSettingsFormValues,
  useGeneralSettings,
} from './useGeneralSettings';

export type { GeneralSettingsFormValues } from './useGeneralSettings';

export const useSettings = () => {
  const [activeTab, setActiveTab] = useState('durations');
  const [auditLogs] = useState(initialAuditLogs);
  const [packages] = useState(initialPackages);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);

  const { settingMap, generalSettings, isLoading } = useGeneralSettings();
  const updateSetting = useUpdateSettingMutation();

  const handleSaveSetting = (key: string, value: string) => {
    updateSetting.mutate(
      { key, value },
      { onSuccess: () => message.success('Đã lưu cấu hình.') }
    );
  };

  const saveSetting = (key: string, value: string) =>
    updateSetting.mutateAsync({ key, value });

  const handleSaveGeneral = async (values: GeneralSettingsFormValues) => {
    const entries: Array<[string, string]> = [
      [GENERAL_SETTING_KEYS.appName, values.appName],
      [GENERAL_SETTING_KEYS.appDescription, values.appDescription],
      [GENERAL_SETTING_KEYS.logoUrl, values.logoUrl || ''],
      [GENERAL_SETTING_KEYS.faviconUrl, values.faviconUrl || ''],
      [GENERAL_SETTING_KEYS.supportEmail, values.supportEmail || ''],
      [GENERAL_SETTING_KEYS.supportPhone, values.supportPhone || ''],
      [GENERAL_SETTING_KEYS.primaryColor, values.primaryColor || DEFAULT_GENERAL_SETTINGS.primaryColor],
      [GENERAL_SETTING_KEYS.secondaryColor, values.secondaryColor || DEFAULT_GENERAL_SETTINGS.secondaryColor],
      [GENERAL_SETTING_KEYS.maxUploadMb, String(values.maxUploadMb ?? DEFAULT_GENERAL_SETTINGS.maxUploadMb)],
    ];

    try {
      await Promise.all(entries.map(([key, value]) => saveSetting(key, value)));
      message.success('Đã lưu cấu hình cài đặt chung.');
    } catch {
      message.error('Lưu cài đặt thất bại, vui lòng thử lại.');
    }
  };

  const handleUploadLogo = async (options: UploadRequestOption) => {
    const { file, onSuccess, onError } = options;
    setIsUploadingLogo(true);
    try {
      const uploaded = await settingApi.uploadImage(file as File, 'settings/logo');
      onSuccess?.(uploaded);
      message.success('Upload logo thành công.');
      return uploaded.url;
    } catch (error) {
      onError?.(error as Error);
      message.error('Upload logo thất bại.');
      throw error;
    } finally {
      setIsUploadingLogo(false);
    }
  };

  return {
    activeTab,
    setActiveTab,
    auditLogs,
    packages,
    settingMap,
    generalSettings,
    maxUploadMb: generalSettings.maxUploadMb,
    isLoadingSettings: isLoading,
    isSavingSetting: updateSetting.isPending,
    isUploadingLogo,
    handleSaveSetting,
    handleSaveGeneral,
    handleUploadLogo,
  };
};
