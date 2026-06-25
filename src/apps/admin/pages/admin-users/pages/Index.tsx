import React from 'react';
import {
  Typography,
  Drawer,
  Tabs,
  Progress,
  Tag,
  Avatar,
  Space,
  Table,
  Card,
} from 'antd';
import {
  TrophyOutlined,
  HistoryOutlined,
  FileOutlined,
} from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { useUsers } from '../hook/useUsers';
import { useUserColumns } from '../hook/useUserColumns';
import * as S from '../styles/styled';

import UserList from '../components/UserList';
import PermissionMatrix from '../components/PermissionMatrix';

const { Title, Text } = Typography;

const UsersIndex: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    students,
    selectedStudent,
    drawerOpen,
    setDrawerOpen,
    permissions,
    setPermissions,
    handleStatusChange,
    handleOpenDrawer,
  } = useUsers();

  const columns = useUserColumns(handleOpenDrawer, handleStatusChange);

  return (
    <S.Container>
      <S.Header>
        <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
          Quản lý người dùng
        </Title>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'list', label: 'Danh sách học viên' },
            { key: 'roles', label: 'Phân quyền & Vai trò' },
          ]}
        />
      </S.Header>

      {activeTab === 'list' ? (
        <UserList students={students} columns={columns} />
      ) : (
        <PermissionMatrix permissions={permissions} setPermissions={setPermissions} />
      )}

      {/* Student Detail Drawer */}
      <Drawer
        title={<Title level={4} style={{ margin: 0 }}>Hồ sơ Học viên</Title>}
        placement="right"
        width={640}
        onClose={() => setDrawerOpen(false)}
        open={drawerOpen}
      >
        {selectedStudent && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            <S.DrawerHeader>
              <Avatar size={64} style={{ backgroundColor: ADMIN_COLORS.primary, fontSize: '24px' }}>
                {selectedStudent.name.charAt(0)}
              </Avatar>
              <div>
                <Title level={4} style={{ margin: 0 }}>{selectedStudent.name}</Title>
                <Text type="secondary" style={{ display: 'block' }}>{selectedStudent.email}</Text>
                <Space style={{ marginTop: '4px' }}>
                  <Tag color="gold">{selectedStudent.package}</Tag>
                  <Tag color="cyan">Mục tiêu: {selectedStudent.target}</Tag>
                </Space>
              </div>
            </S.DrawerHeader>

            <Tabs
              items={[
                {
                  key: 'progress',
                  label: <Space><TrophyOutlined />Tiến độ học</Space>,
                  children: (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '0.5rem 0' }}>
                      {[
                        { label: 'Ngữ pháp & Từ vựng', percent: 85, color: '#f97316' },
                        { label: 'Đọc hiểu', percent: 70, color: '#0ea5e9' },
                        { label: 'Nghe', percent: 65, color: '#8b5cf6' },
                        { label: 'Nói', percent: 40, color: '#f43f5e' },
                        { label: 'Viết', percent: 55, color: '#10b981' },
                      ].map(item => (
                        <div key={item.label}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                            <Text>{item.label}</Text>
                            <Text strong>{item.percent}%</Text>
                          </div>
                          <Progress percent={item.percent} strokeColor={item.color} />
                        </div>
                      ))}
                    </div>
                  ),
                },
                {
                  key: 'history',
                  label: <Space><HistoryOutlined />Lịch sử thi</Space>,
                  children: (
                    <Table
                      dataSource={[
                        { key: '1', date: '01/06/2026', skill: 'Reading', test: 'Bộ đề Đọc #2', score: '42/50', time: '22:15' },
                        { key: '2', date: '28/05/2026', skill: 'Listening', test: 'Bộ đề Nghe #1', score: '35/50', time: '30:00' },
                        { key: '3', date: '25/05/2026', skill: 'Writing', test: 'Bộ đề Viết #4', score: '78/100', time: '45:00' },
                      ]}
                      pagination={false}
                      size="small"
                      columns={[
                        { title: 'Ngày làm', dataIndex: 'date', key: 'date' },
                        {
                          title: 'Kỹ năng',
                          dataIndex: 'skill',
                          key: 'skill',
                          render: (s: string) => (
                            <Tag color={s === 'Reading' ? 'blue' : s === 'Listening' ? 'purple' : 'green'}>{s}</Tag>
                          ),
                        },
                        { title: 'Bài thi', dataIndex: 'test', key: 'test' },
                        { title: 'Điểm', dataIndex: 'score', key: 'score' },
                      ]}
                    />
                  ),
                },
                {
                  key: 'files',
                  label: <Space><FileOutlined />Tài liệu tải</Space>,
                  children: (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', padding: '0.5rem 0' }}>
                      <Card size="small" hoverable>
                        <Space>
                          <span style={{ fontSize: '24px', color: '#ef4444' }}>📕</span>
                          <div>
                            <Text strong style={{ display: 'block', fontSize: '12px' }}>Aptis_Grammar_Master.pdf</Text>
                            <Text type="secondary" style={{ fontSize: '10px' }}>Tải ngày 24/05/2026</Text>
                          </div>
                        </Space>
                      </Card>
                      <Card size="small" hoverable>
                        <Space>
                          <span style={{ fontSize: '24px', color: '#3b82f6' }}>📘</span>
                          <div>
                            <Text strong style={{ display: 'block', fontSize: '12px' }}>Reading_Part3_Tips.docx</Text>
                            <Text type="secondary" style={{ fontSize: '10px' }}>Tải ngày 26/05/2026</Text>
                          </div>
                        </Space>
                      </Card>
                    </div>
                  ),
                },
              ]}
            />
          </div>
        )}
      </Drawer>
    </S.Container>
  );
};

export default UsersIndex;
