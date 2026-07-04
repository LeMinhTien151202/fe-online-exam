import React from 'react';
import { Button, Card, Input, Space, Typography, Tag, Spin } from 'antd';
import { ArrowLeftOutlined, SaveOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useExamDetail } from '../hook/useExamDetail';
import { API_TYPE_TO_UI } from '../services/types';
import ExamSectionCard from '../components/ExamSectionCard';
import * as S from '../styles/styled';

const { Title, Text } = Typography;
const { TextArea } = Input;

const UI_TYPE_LABEL: Record<string, string> = {
  partial: 'Đề theo phần',
  set: 'Đề theo bộ',
  full: 'Đề thi thử',
};

const ExamDetail: React.FC = () => {
  const {
    exam,
    isLoading,
    title,
    setTitle,
    description,
    setDescription,
    isSavingInfo,
    goBack,
    handleSaveInfo,
    handleToggleActive,
    handleSaveDuration,
    handleSavePart,
    handleRemoveQuestion,
    handleMoveQuestion,
  } = useExamDetail();

  if (isLoading) {
    return (
      <S.Container>
        <Spin />
      </S.Container>
    );
  }

  if (!exam) {
    return (
      <S.Container>
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={goBack} />
          <Text>Không tìm thấy đề thi.</Text>
        </Space>
      </S.Container>
    );
  }

  return (
    <S.Container>
      <S.Header>
        <Space size="middle">
          <Button icon={<ArrowLeftOutlined />} onClick={goBack} />
          <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
            Chi tiết đề thi
          </Title>
          <Tag color="cyan">{UI_TYPE_LABEL[API_TYPE_TO_UI[exam.type]]}</Tag>
          <Tag
            color={exam.isActive ? 'success' : 'default'}
            style={{ cursor: 'pointer' }}
            onClick={handleToggleActive}
          >
            {exam.isActive ? 'Công khai' : 'Nháp'} (bấm để đổi)
          </Tag>
        </Space>
      </S.Header>

      <Card title="Thông tin đề">
        <div className="mb-3">
          <Text strong>Tiêu đề</Text>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1" />
        </div>
        <div className="mb-3">
          <Text strong>Mô tả</Text>
          <TextArea rows={3} value={description} onChange={(e) => setDescription(e.target.value)} className="mt-1" />
        </div>
        <Button type="primary" icon={<SaveOutlined />} loading={isSavingInfo} onClick={handleSaveInfo}>
          Lưu thông tin
        </Button>
      </Card>

      {[...exam.sections]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((section) => (
          <ExamSectionCard
            key={section.id}
            section={section}
            onSaveDuration={handleSaveDuration}
            onSavePart={handleSavePart}
            onRemoveQuestion={handleRemoveQuestion}
            onMoveQuestion={handleMoveQuestion}
          />
        ))}
    </S.Container>
  );
};

export default ExamDetail;
