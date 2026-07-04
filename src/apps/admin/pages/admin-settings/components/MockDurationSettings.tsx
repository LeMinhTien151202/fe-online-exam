import React, { useState } from 'react';
import { Card, InputNumber, Button, Space, Typography, Row, Col, Spin } from 'antd';
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

const DurationRow: React.FC<{ settingKey: string; label: string; initial: string; isSaving: boolean; onSave: (k: string, v: string) => void }> = ({
  settingKey,
  label,
  initial,
  isSaving,
  onSave,
}) => {
  const [loadedKey, setLoadedKey] = useState<string | null>(null);
  const [value, setValue] = useState<number>(0);

  // Nạp giá trị khi dữ liệu từ API về (điều chỉnh state lúc render)
  const initialNum = Number(initial) || 0;
  if (loadedKey !== settingKey + initial) {
    setLoadedKey(settingKey + initial);
    setValue(initialNum);
  }

  return (
    <Col xs={24} md={12}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12, padding: '10px 0' }}>
        <Text strong>{label}</Text>
        <Space>
          <InputNumber min={1} max={180} value={value} onChange={(v) => setValue(v ?? 0)} addonAfter="phút" />
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
    <Card bordered={false} style={{ marginTop: '1rem' }}>
      <Title level={5} style={{ marginBottom: 4 }}>Thời gian làm bài thi thử (theo kỹ năng)</Title>
      <Text type="secondary">Áp dụng cho đề thi thử (Mock Test). Đơn vị: phút.</Text>
      <Row gutter={32} style={{ marginTop: 16 }}>
        {MOCK_DURATION_KEYS.map((item) => (
          <DurationRow
            key={item.key}
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
