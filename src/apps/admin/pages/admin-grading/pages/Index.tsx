import { EyeOutlined } from '@ant-design/icons';
import { Avatar,Button,Card,Space,Table,Tabs,Tag,Typography } from 'antd';
import React from 'react';
import { ADMIN_COLORS } from '../../../constants';
import { useGrading } from '../hook/useGrading';
import * as S from '../styles/styled';

const { Title, Text } = Typography;

const GradingIndex: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    filteredData,
    handleGrade,
  } = useGrading();

  const columns = [
    {
      title: 'Học viên',
      dataIndex: 'student',
      key: 'student',
      render: (text: string, record: any) => (
        <Space>
          <Avatar style={{ backgroundColor: ADMIN_COLORS.primary }}>{text.charAt(0)}</Avatar>
          <div>
            <Text strong style={{ fontSize: '13px' }}>{text}</Text>
            <div style={{ fontSize: '11px', color: ADMIN_COLORS.textSecondary }}>{record.email}</div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Đề thi / Bài luyện tập',
      dataIndex: 'test',
      key: 'test',
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skill',
      key: 'skill',
      render: (s: string) => {
        let color = 'blue';
        if (s === 'Speaking') color = 'orange';
        if (s === 'Writing') color = 'green';
        if (s === 'Reading') color = 'purple';
        if (s === 'Listening') color = 'cyan';
        return <Tag color={color}>{s}</Tag>;
      },
    },
    {
      title: 'Thời gian làm',
      dataIndex: 'duration',
      key: 'duration',
    },
    {
      title: 'Ngày nộp bài',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Điểm số tự động',
      dataIndex: 'score',
      key: 'score',
      render: (score: string) => (
        <span style={{ fontWeight: 700, color: ADMIN_COLORS.success }}>
          {score}
        </span>
      ),
    },
    {
      title: 'Chi tiết',
      key: 'actions',
      render: (record: any) => (
        <Button
          type="primary"
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleGrade(record.key)}
          style={{ background: ADMIN_COLORS.primary }}
        >
          Xem chi tiết
        </Button>
      ),
    },
  ];

  return (
    <S.Container>
      <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
        Kết quả thi thử & Lịch sử làm bài (Tự động chấm)
      </Title>

      <Card bordered={false}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'all',
              label: 'Tất cả kết quả',
            },
            {
              key: 'speaking',
              label: 'Speaking',
            },
            {
              key: 'writing',
              label: 'Writing',
            },
            {
              key: 'reading',
              label: 'Reading',
            },
            {
              key: 'listening',
              label: 'Listening',
            },
          ]}
        />

        <Table
          columns={columns}
          dataSource={filteredData}
          size="middle"
          pagination={{ pageSize: 10 }}
        />
      </Card>
    </S.Container>
  );
};

export default GradingIndex;
