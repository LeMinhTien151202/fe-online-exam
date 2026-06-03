import { useState } from 'react';
import { message } from 'antd';
import { initialAuditLogs, initialPackages } from '../services/mockData';

export const useSettings = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [auditLogs] = useState(initialAuditLogs);
  const [packages] = useState(initialPackages);

  const handleSaveGeneral = () => {
    message.success('Đã lưu cấu hình cài đặt chung thành công!');
  };

  return {
    activeTab,
    setActiveTab,
    auditLogs,
    packages,
    handleSaveGeneral,
  };
};
