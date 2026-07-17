import React, { useState } from 'react';
import { Button, Card, Col, InputNumber, Row, Space, Spin, Typography } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { MOCK_DURATION_KEYS } from '../services/settingApi';

const { Title, Text } = Typography;

interface Props {
  settingMap: Record<string, string>;
  isLoading: boolean;
  isSaving: boolean;
  onSave: (key: string, value: string) => void;
}

const DurationRow: React.FC<{
  settingKey: string;
  label: string;
  initial: string;
  isSaving: boolean;
  onSave: (key: string, value: string) => void;
}> = ({ settingKey, label, initial, isSaving, onSave }) => {
  const [value, setValue] = useState<number>(() => Number(initial) || 0);

  return (
    <Col xs={24} md={12}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0' }}>
        <Text strong>{label}</Text>
        <Space>
          <InputNumber min={1} max={180} value={value} onChange={(next) => setValue(next ?? 0)} addonAfter="phút" />
          <Button size="small" icon={<SaveOutlined />} loading={isSaving} onClick={() => onSave(settingKey, String(value))}>
            Lưu
          </Button>
        </Space>
      </div>
    </Col>
  );
};

const MockDurationSettings: React.FC<Props> = ({ settingMap, isLoading, isSaving, onSave }) => {
  if (isLoading) return <Spin />;

  return (
    <Card variant="borderless" style={{ marginTop: '1rem' }}>
      <Title level={5} style={{ marginBottom: 4 }}>Thời gian làm bài thi thử theo kỹ năng</Title>
      <Text type="secondary">Áp dụng cho đề thi thử. Đơn vị: phút.</Text>
      <Row gutter={32} style={{ marginTop: 16 }}>
        {MOCK_DURATION_KEYS.map((item) => (
          <DurationRow
            key={`${item.key}-${settingMap[item.key] ?? '0'}`}
            settingKey={item.key}
            label={item.label}
            initial={settingMap[item.key] ?? '0'}
            isSaving={isSaving}
            onSave={onSave}
          />
        ))}
      </Row>
      <div style={{ marginTop: 12, color: ADMIN_COLORS.textSecondary }} />
    </Card>
  );
};

export default MockDurationSettings;
