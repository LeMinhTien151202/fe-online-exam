import React from 'react';
import { Table, Typography, Card, Tag, Alert } from 'antd';
import { CheckCircleTwoTone, MinusOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { AdminTableWrapper } from '../../../styles/admin-shared.styles';
import { ROLE_LABEL } from '@/shared/auth/roleAccess';

const { Title, Text } = Typography;

// Mô tả quyền CỐ ĐỊNH theo vai trò, khớp @PreAuthorize ở backend.
// Đây là bảng CHỈ ĐỌC: phân quyền không cấu hình động, muốn đổi phải sửa vai trò người dùng.
const ACCESS_ROWS: { area: string; admin: boolean; teacher: boolean; student: boolean }[] = [
  { area: 'Tổng quan hệ thống', admin: true, teacher: false, student: false },
  { area: 'Quản lý người dùng', admin: true, teacher: false, student: false },
  { area: 'Cài đặt hệ thống', admin: true, teacher: false, student: false },
  { area: 'Quản lý thông báo', admin: true, teacher: false, student: false },
  { area: 'Ngân hàng câu hỏi', admin: true, teacher: true, student: false },
  { area: 'Bộ đề thi', admin: true, teacher: true, student: false },
  { area: 'Tài liệu học tập', admin: true, teacher: true, student: false },
  { area: 'Quản lý Q&A', admin: true, teacher: true, student: false },
  { area: 'Chấm điểm & kết quả', admin: true, teacher: true, student: false },
  { area: 'Làm bài / luyện thi', admin: false, teacher: false, student: true },
];

const Mark: React.FC<{ ok: boolean }> = ({ ok }) =>
  ok ? <CheckCircleTwoTone twoToneColor="#10b981" /> : <MinusOutlined style={{ color: '#cbd5e1' }} />;

const RoleInfo: React.FC = () => {
  return (
    <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ background: 'transparent', boxShadow: 'none' }}>
      <div
        style={{
          marginBottom: '1.25rem',
          background: '#f8fafc',
          padding: '1rem',
          borderRadius: 8,
          border: '1px solid #eef2f6',
        }}
      >
        <Title level={4} style={{ margin: 0, color: ADMIN_COLORS.primary }}>
          Quyền theo vai trò
        </Title>
        <Text type="secondary">
          Phân quyền cố định theo vai trò của mỗi tài khoản. Muốn thay đổi quyền, hãy đổi vai trò của
          người dùng ở tab "Danh sách người dùng".
        </Text>
      </div>

      <Alert
        type="info"
        showIcon
        style={{ marginBottom: '1.25rem' }}
        message="Đây là bảng tham khảo chỉ đọc — quyền được kiểm soát ở backend, không cấu hình trực tiếp tại đây."
      />

      <AdminTableWrapper>
        <Table
          rowKey="area"
          dataSource={ACCESS_ROWS}
          pagination={false}
          size="middle"
          columns={[
            {
              title: 'Chức năng',
              dataIndex: 'area',
              key: 'area',
              width: 260,
              render: (text: string) => <Text strong>{text}</Text>,
            },
            {
              title: <Tag color="red">{ROLE_LABEL.ADMIN}</Tag>,
              dataIndex: 'admin',
              key: 'admin',
              align: 'center',
              render: (ok: boolean) => <Mark ok={ok} />,
            },
            {
              title: <Tag color="blue">{ROLE_LABEL.TEACHER}</Tag>,
              dataIndex: 'teacher',
              key: 'teacher',
              align: 'center',
              render: (ok: boolean) => <Mark ok={ok} />,
            },
            {
              title: <Tag color="green">{ROLE_LABEL.STUDENT}</Tag>,
              dataIndex: 'student',
              key: 'student',
              align: 'center',
              render: (ok: boolean) => <Mark ok={ok} />,
            },
          ]}
        />
      </AdminTableWrapper>
    </Card>
  );
};

export default RoleInfo;
