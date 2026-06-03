import React from 'react';
import { Card, Table, Tag, Button, Space, Typography, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useExams } from '../hook/useExams';
import { ExamsHeader } from '../components/ExamsHeader';
import * as S from '../styles/styled';

const { Text } = Typography;

const ExamsIndex: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    partExams,
    setExams,
    fullExams,
    handleCreateNew,
    handleDeletePart,
    handleDeleteSet,
  } = useExams();

  const columnsPart = [
    {
      title: 'Tên bộ đề',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skill',
      key: 'skill',
      render: (s: string) => {
        const colors: Record<string, string> = { Reading: 'blue', Grammar: 'orange', Writing: 'green', Listening: 'purple', Speaking: 'red' };
        return <Tag color={colors[s] || 'cyan'}>{s}</Tag>;
      },
    },
    {
      title: 'Số câu',
      dataIndex: 'questionCount',
      key: 'questionCount',
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (d: number) => <span>{d} phút</span>,
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (diff: string) => {
        const colors: Record<string, string> = { easy: 'success', medium: 'warning', hard: 'error' };
        const label: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
        return <Tag color={colors[diff]}>{label[diff]}</Tag>;
      },
    },
    {
      title: 'Lượt thi',
      dataIndex: 'tryCount',
      key: 'tryCount',
    },
    {
      title: 'Điểm số TB',
      dataIndex: 'avgScore',
      key: 'avgScore',
      render: (score: string) => <Text strong>{score}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Công khai' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeletePart(record.key)} />
        </Space>
      ),
    },
  ];

  const columnsSet = [
    {
      title: 'Tên bộ đề',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Kỹ năng',
      dataIndex: 'skill',
      key: 'skill',
      render: (s: string) => {
        const colors: Record<string, string> = { Reading: 'blue', Grammar: 'orange', Writing: 'green', Listening: 'purple', Speaking: 'red' };
        return <Tag color={colors[s] || 'cyan'}>{s}</Tag>;
      },
    },
    {
      title: 'Số phần',
      dataIndex: 'partCount',
      key: 'partCount',
      render: (count: number) => <span>{count} phần</span>,
    },
    {
      title: 'Số câu',
      dataIndex: 'questionCount',
      key: 'questionCount',
    },
    {
      title: 'Thời gian',
      dataIndex: 'duration',
      key: 'duration',
      render: (d: number) => <span>{d} phút</span>,
    },
    {
      title: 'Độ khó',
      dataIndex: 'difficulty',
      key: 'difficulty',
      render: (diff: string) => {
        const colors: Record<string, string> = { easy: 'success', medium: 'warning', hard: 'error' };
        const label: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
        return <Tag color={colors[diff]}>{label[diff]}</Tag>;
      },
    },
    {
      title: 'Lượt thi',
      dataIndex: 'tryCount',
      key: 'tryCount',
    },
    {
      title: 'Điểm số TB',
      dataIndex: 'avgScore',
      key: 'avgScore',
      render: (score: string) => <Text strong>{score}</Text>,
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Công khai' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: (record: any) => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} onClick={() => handleDeleteSet(record.key)} />
        </Space>
      ),
    },
  ];

  const columnsFull = [
    {
      title: 'Tên đề thi thử',
      dataIndex: 'name',
      key: 'name',
      render: (text: string) => <Text strong>{text}</Text>,
    },
    {
      title: 'Cấu trúc bài thi',
      dataIndex: 'skills',
      key: 'skills',
      render: (skills: string[]) => (
        <Space wrap>
          {skills.map(s => <Tag key={s} color="blue" style={{ fontSize: '11px' }}>{s}</Tag>)}
        </Space>
      ),
    },
    {
      title: 'Thời lượng',
      dataIndex: 'duration',
      key: 'duration',
      render: (d: number) => <Text strong>{d} phút</Text>,
    },
    {
      title: 'Lượt thi',
      dataIndex: 'tryCount',
      key: 'tryCount',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'success' : 'default'}>
          {status === 'active' ? 'Công khai' : 'Nháp'}
        </Tag>
      ),
    },
    {
      title: 'Hành động',
      key: 'actions',
      render: () => (
        <Space>
          <Button type="text" icon={<EyeOutlined />} />
          <Button type="text" icon={<EditOutlined />} />
          <Button type="text" danger icon={<DeleteOutlined />} />
        </Space>
      ),
    },
  ];

  return (
    <S.Container>
      <ExamsHeader title="Danh sách bộ đề thi" buttonText="Tạo bộ đề mới" onCreateNew={handleCreateNew} />

      <Card bordered={false}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'partial',
              label: 'Đề thi theo phần',
              children: (
                <Table
                  columns={columnsPart}
                  dataSource={partExams}
                  size="middle"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'set',
              label: 'Đề thi theo bộ đề',
              children: (
                <Table
                  columns={columnsSet}
                  dataSource={setExams}
                  size="middle"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
            {
              key: 'full',
              label: 'Đề thi thử liên tục (Full Test)',
              children: (
                <Table
                  columns={columnsFull}
                  dataSource={fullExams}
                  size="middle"
                  pagination={{ pageSize: 10 }}
                />
              ),
            },
          ]}
        />
      </Card>
    </S.Container>
  );
};

export default ExamsIndex;
