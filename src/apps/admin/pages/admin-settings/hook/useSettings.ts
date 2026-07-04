import { useMemo, useState } from 'react';
import { message } from 'antd';
import { initialAuditLogs, initialPackages } from '../services/mockData';
import { useSettingsQuery, useUpdateSettingMutation } from '../services/settingQuery';

export const useSettings = () => {
  const [activeTab, setActiveTab] = useState('durations');
  const [auditLogs] = useState(initialAuditLogs);
  const [packages] = useState(initialPackages);

  const { data: settings, isLoading } = useSettingsQuery();
  const updateSetting = useUpdateSettingMutation();

  // Map key -> value để tra nhanh
  const settingMap = useMemo(() => {
    const map: Record<string, string> = {};
    (settings ?? []).forEach((s) => {
      map[s.settingKey] = s.settingValue;
    });
    return map;
  }, [settings]);

  const handleSaveSetting = (key: string, value: string) => {
    updateSetting.mutate(
      { key, value },
      { onSuccess: () => message.success('Đã lưu cấu hình.') }
    );
  };

  const handleSaveGeneral = () => {
    message.success('Đã lưu cấu hình cài đặt chung thành công!');
  };

  return {
    activeTab,
    setActiveTab,
    auditLogs,
    packages,
    settingMap,
    isLoadingSettings: isLoading,
    isSavingSetting: updateSetting.isPending,
    handleSaveSetting,
    handleSaveGeneral,
  };
};
