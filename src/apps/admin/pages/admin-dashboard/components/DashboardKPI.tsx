import React from 'react';
import { Card, Statistic, Tag, Typography } from 'antd';
import { ArrowUpOutlined, ArrowDownOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';

const { Text } = Typography;

interface KPICardProps {
  title: string;
  value: number;
  icon: React.ReactNode;
  trend: string;
  trendType: 'up' | 'down' | 'neutral';
  trendLabel: string;
}

export const KPICard: React.FC<KPICardProps> = ({ title, value, icon, trend, trendType, trendLabel }) => {
  return (
    <Card bordered={false} hoverable>
      <Statistic
        title={<span style={{ color: ADMIN_COLORS.textSecondary, fontWeight: 500 }}>{title}</span>}
        value={value}
        valueStyle={{ fontSize: '28px', fontWeight: 700, color: ADMIN_COLORS.textPrimary }}
        prefix={icon}
      />
      <div style={{ marginTop: '8px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        {trendType === 'up' && (
          <Tag color="success" icon={<ArrowUpOutlined />}>
            {trend}
          </Tag>
        )}
        {trendType === 'down' && (
          <Tag color="error" icon={<ArrowDownOutlined />}>
            {trend}
          </Tag>
        )}
        {trendType === 'neutral' && (
          <Tag color="warning">
            {trend}
          </Tag>
        )}
        <Text type="secondary" style={{ fontSize: '12px' }}>
          {trendLabel}
        </Text>
      </div>
    </Card>
  );
};
