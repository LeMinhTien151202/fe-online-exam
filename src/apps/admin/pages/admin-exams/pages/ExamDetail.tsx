import React from 'react';
import { Button, Card, Input, Space, Typography, Tag, Spin } from 'antd';
import { ArrowLeftOutlined, SaveOutlined, EyeInvisibleOutlined, GlobalOutlined } from '@ant-design/icons';
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
    readOnly,
    title,
    setTitle,
    description,
    setDescription,
    isSavingInfo,
    isTogglingActive,
    goBack,
    handleSaveInfo,
    handleToggleActive,
    handleSaveDuration,
    handleSavePart,
    handleAddQuestions,
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
            {readOnly ? 'Xem chi tiết đề thi' : 'Chỉnh sửa đề thi'}
          </Title>
          <Tag color="cyan">{UI_TYPE_LABEL[API_TYPE_TO_UI[exam.type]]}</Tag>
          <Tag color={exam.isActive ? 'success' : 'default'}>
            {exam.isActive ? 'Công khai' : 'Nháp'}
          </Tag>
        </Space>
      </S.Header>

      <Card title="Thông tin đề">
        <Space direction="vertical" size="large" style={{ width: '100%' }}>
          <div>
            <Text strong>Tiêu đề</Text>
            <Input
              size="large"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Nhập tiêu đề đề thi"
              className="mt-2"
              readOnly={readOnly}
            />
          </div>
          <div>
            <Text strong>Mô tả</Text>
            <TextArea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder={readOnly ? 'Không có mô tả' : 'Mô tả ngắn về mục tiêu, nội dung của đề thi (tuỳ chọn)'}
              className="mt-2"
              readOnly={readOnly}
            />
          </div>
          {!readOnly && (
            <div style={{ textAlign: 'right' }}>
              <Button type="primary" icon={<SaveOutlined />} loading={isSavingInfo} onClick={handleSaveInfo}>
                Lưu thông tin
              </Button>
            </div>
          )}
        </Space>
      </Card>

      {[...exam.sections]
        .sort((a, b) => a.orderIndex - b.orderIndex)
        .map((section) => (
          <ExamSectionCard
            key={section.id}
            section={section}
            readOnly={readOnly}
            onSaveDuration={handleSaveDuration}
            onSavePart={handleSavePart}
            onAddQuestions={handleAddQuestions}
            onRemoveQuestion={handleRemoveQuestion}
            onMoveQuestion={handleMoveQuestion}
          />
        ))}

      {/* Thanh trạng thái Nháp/Công khai đặt cuối trang cho dễ thấy & thao tác */}
      {!readOnly && (
        <Card variant="borderless">
          <S.PublishBar>
            <Space direction="vertical" size={0}>
              <Space size={8}>
                <Text strong>Trạng thái đề thi:</Text>
                <Tag color={exam.isActive ? 'success' : 'default'} style={{ margin: 0 }}>
                  {exam.isActive ? 'Công khai' : 'Nháp'}
                </Tag>
              </Space>
              <Text type="secondary">
                {exam.isActive
                  ? 'Học viên đang nhìn thấy và có thể làm đề này.'
                  : 'Đề đang ở chế độ nháp — học viên không nhìn thấy.'}
              </Text>
            </Space>
            <Button
              type={exam.isActive ? 'default' : 'primary'}
              danger={exam.isActive}
              size="large"
              icon={exam.isActive ? <EyeInvisibleOutlined /> : <GlobalOutlined />}
              loading={isTogglingActive}
              onClick={handleToggleActive}
            >
              {exam.isActive ? 'Chuyển về nháp (ẩn đề)' : 'Công khai đề thi'}
            </Button>
          </S.PublishBar>
        </Card>
      )}
    </S.Container>
  );
};

export default ExamDetail;
