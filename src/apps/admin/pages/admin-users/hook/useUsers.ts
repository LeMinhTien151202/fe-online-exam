import { useState } from 'react';
import { Modal, message } from 'antd';
import { initialStudents, initialPermissions } from '../services/mockData';

export const useUsers = () => {
  const [activeTab, setActiveTab] = useState('list');
  const [students, setStudents] = useState(initialStudents);
  const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [permissions, setPermissions] = useState(initialPermissions);

  const handleStatusChange = (checked: boolean, key: string) => {
    setStudents(prev =>
      prev.map(student => (student.key === key ? { ...student, active: checked } : student))
    );
    message.success('Cập nhật trạng thái người dùng thành công!');
  };

  const handleBulkLock = () => {
    Modal.confirm({
      title: `Khóa ${selectedRowKeys.length} học viên đã chọn?`,
      content: 'Những tài khoản này sẽ tạm thời không đăng nhập được vào hệ thống.',
      okText: 'Khoá tài khoản',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        setStudents(prev =>
          prev.map(st => (selectedRowKeys.includes(st.key) ? { ...st, active: false } : st))
        );
        setSelectedRowKeys([]);
        message.success('Đã khoá các tài khoản được chọn!');
      },
    });
  };

  const handleOpenDrawer = (record: any) => {
    setSelectedStudent(record);
    setDrawerOpen(true);
  };

  return {
    activeTab,
    setActiveTab,
    students,
    setStudents,
    selectedRowKeys,
    setSelectedRowKeys,
    selectedStudent,
    setSelectedStudent,
    drawerOpen,
    setDrawerOpen,
    permissions,
    setPermissions,
    handleStatusChange,
    handleBulkLock,
    handleOpenDrawer,
  };
};
