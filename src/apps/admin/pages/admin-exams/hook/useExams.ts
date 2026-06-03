import { useState } from 'react';
import { Modal, message } from 'antd';
import { useNavigate } from '@tanstack/react-router';
import { initialPartExams, initialSetExams, initialFullExams } from '../services/mockData';

export const useExams = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('partial');
  const [partExams, setPartExams] = useState(initialPartExams);
  const [setExams, setSetExams] = useState(initialSetExams);
  const [fullExams, setFullExams] = useState(initialFullExams);

  const handleCreateNew = () => {
    navigate({ to: '/admin/exams/create' });
  };

  const handleDeletePart = (key: string) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xoá đề thi theo phần này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        setPartExams(prev => prev.filter(item => item.key !== key));
        message.success('Đã xoá đề thi theo phần thành công!');
      },
    });
  };

  const handleDeleteSet = (key: string) => {
    Modal.confirm({
      title: 'Bạn có chắc chắn muốn xoá bộ đề thi này?',
      content: 'Hành động này không thể hoàn tác.',
      okText: 'Xoá',
      okType: 'danger',
      cancelText: 'Huỷ',
      onOk: () => {
        setSetExams(prev => prev.filter(item => item.key !== key));
        message.success('Đã xoá bộ đề thi thành công!');
      },
    });
  };

  return {
    activeTab,
    setActiveTab,
    partExams,
    setExams,
    fullExams,
    handleCreateNew,
    handleDeletePart,
    handleDeleteSet,
  };
};
