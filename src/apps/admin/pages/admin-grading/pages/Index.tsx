import React from 'react';
import { Avatar, Card, Space, Table, Tabs, Tag, Typography } from 'antd';
import type { ColumnsType } from 'antd/es/table';
import { ADMIN_COLORS } from '../../../constants';
import { AdminTableWrapper } from '../../../styles/admin-shared.styles';
import { cefrTagColor, SKILL_NAME } from '@/shared/utils/cefrScale';
import type { ExamType } from '../../admin-exams/services/types';
import { useGrading } from '../hook/useGrading';
import type { IAdminAttempt } from '../services/types';
import * as S from '../styles/styled';

const { Title, Text } = Typography;

const EXAM_TYPE_META: Record<ExamType, { label: string; color: string }> = {
  MOCK_TEST: { label: 'Thi thử tổng hợp', color: 'purple' },
  SKILL_FULL_SET: { label: 'Trọn bộ kỹ năng', color: 'blue' },
  PART_PRACTICE: { label: 'Luyện theo phần', color: 'default' },
};

const formatDateTime = (iso: string | null) =>
  iso ? new Date(iso).toLocaleString('vi-VN', { hour12: false }) : '—';

// Bảng band CEFR từng kỹ năng (snapshot lúc nộp) — thay cho trang chi tiết cũ.
const SkillBreakdown: React.FC<{ attempt: IAdminAttempt }> = ({ attempt }) => {
  const skills = attempt.skillCefr ?? [];
  if (skills.length === 0) {
    return <Text type="secondary">Không có dữ liệu điểm chi tiết cho lượt nộp này.</Text>;
  }
  return (
    <Space size={[8, 8]} wrap>
      {skills.map((skill) => (
        <Tag key={skill.skillId} style={{ padding: '4px 10px', borderRadius: 6 }}>
          <Text strong>{skill.name || SKILL_NAME[skill.skillId] || `Kỹ năng ${skill.skillId}`}</Text>
          {': '}
          <Text>{skill.scaled}/50</Text>
          {skill.cefr ? (
            <Tag color={cefrTagColor(skill.cefr)} style={{ marginInlineStart: 8, marginInlineEnd: 0 }}>
              {skill.cefr}
            </Tag>
          ) : null}
        </Tag>
      ))}
    </Space>
  );
};

const GradingIndex: React.FC = () => {
  const { activeTab, setActiveTab, rows, total, page, pageSize, onPageChange, isLoading } = useGrading();

  const columns: ColumnsType<IAdminAttempt> = [
    {
      title: 'Học viên',
      key: 'student',
      render: (_, record) => {
        const email = record.student?.email ?? `#${record.studentId}`;
        return (
          <Space>
            <Avatar style={{ backgroundColor: ADMIN_COLORS.primary }}>{email.charAt(0).toUpperCase()}</Avatar>
            <Text strong style={{ fontSize: 13 }}>{email}</Text>
          </Space>
        );
      },
    },
    {
      title: 'Đề thi',
      key: 'exam',
      render: (_, record) => <Text>{record.exam?.title ?? `Đề #${record.examId}`}</Text>,
    },
    {
      title: 'Loại đề',
      key: 'type',
      render: (_, record) => {
        const meta = record.exam ? EXAM_TYPE_META[record.exam.type] : null;
        return meta ? <Tag color={meta.color}>{meta.label}</Tag> : <Text type="secondary">—</Text>;
      },
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'SUBMITTED' ? 'success' : 'default'}>
          {status === 'SUBMITTED' ? 'Đã nộp' : status}
        </Tag>
      ),
    },
    {
      title: 'Điểm tổng',
      dataIndex: 'totalScore',
      key: 'totalScore',
      align: 'center',
      render: (score: number | null) => (
        <span style={{ fontWeight: 700, color: ADMIN_COLORS.success }}>{score ?? '—'}</span>
      ),
    },
    {
      title: 'CEFR tổng',
      dataIndex: 'overallCefr',
      key: 'overallCefr',
      align: 'center',
      render: (cefr: IAdminAttempt['overallCefr']) =>
        cefr ? <Tag color={cefrTagColor(cefr)}>{cefr}</Tag> : <Text type="secondary">—</Text>,
    },
    {
      title: 'Ngày nộp bài',
      dataIndex: 'finishedAt',
      key: 'finishedAt',
      render: (date: string | null) => (
        <Text type="secondary" style={{ fontSize: 12 }}>{formatDateTime(date)}</Text>
      ),
    },
  ];

  return (
    <S.Container>
      <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
        Kết quả & Lịch sử thi (Tự động chấm)
      </Title>
      <Text type="secondary">
        Toàn bộ lượt nộp bài của học viên. Điểm và band CEFR do hệ thống tự động chấm khi nộp — mở rộng dòng để xem
        chi tiết từng kỹ năng.
      </Text>

      <Card bordered={false} style={{ marginTop: '1rem' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'all', label: 'Tất cả' },
            { key: 'mock', label: 'Thi thử tổng hợp' },
            { key: 'set', label: 'Trọn bộ kỹ năng' },
          ]}
        />

        <AdminTableWrapper>
          <Table<IAdminAttempt>
            rowKey="id"
            columns={columns}
            dataSource={rows}
            loading={isLoading}
            size="middle"
            expandable={{
              expandedRowRender: (record) => <SkillBreakdown attempt={record} />,
              rowExpandable: (record) => (record.skillCefr?.length ?? 0) > 0,
            }}
            pagination={{
              current: page,
              pageSize,
              total,
              showSizeChanger: false,
              onChange: onPageChange,
            }}
          />
        </AdminTableWrapper>
      </Card>
    </S.Container>
  );
};

export default GradingIndex;
