import { useState } from 'react';
import { Form, Modal, message } from 'antd';
import { initialMaterials } from '../services/mockData';

export const useMaterials = () => {
  const [materials, setMaterials] = useState(initialMaterials);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedMaterial, setSelectedMaterial] = useState<any>(null);
  const [form] = Form.useForm();

  const handleUploadClick = () => {
    form.resetFields();
    setIsDrawerOpen(true);
  };

  const handleSaveMaterial = (values: any) => {
    const newMaterial = {
      key: String(materials.length + 1),
      name: values.name || 'Tài liệu học tập mới',
      skill: values.skill || 'Grammar',
      format: 'pdf',
      uploader: 'Administrator',
      date: '03/06/2026',
      downloads: 0,
      size: '1.5 MB',
      status: 'approved',
      description: values.description || '',
    };
    setMaterials([newMaterial, ...materials]);
    setIsDrawerOpen(false);
    message.success('Đã đăng tải tài liệu học tập mới!');
  };

  const handleDelete = (key: string) => {
    Modal.confirm({
      title: 'Xoá tài liệu học tập này?',
      content: 'Tài liệu sẽ bị xoá vĩnh viễn và học viên không thể tải xuống nữa.',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        setMaterials(prev => prev.filter(m => m.key !== key));
        message.success('Đã xoá tài liệu thành công!');
      },
    });
  };

  return {
    materials,
    isDrawerOpen,
    setIsDrawerOpen,
    selectedMaterial,
    setSelectedMaterial,
    form,
    handleUploadClick,
    handleSaveMaterial,
    handleDelete,
  };
};
