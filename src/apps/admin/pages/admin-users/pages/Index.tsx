import React from 'react';
import {
  Typography,
  Drawer,
  Tabs,
  Tag,
  Avatar,
  Space,
  Descriptions,
} from 'antd';
import { ADMIN_COLORS } from '../../../constants';
import { useUsers } from '../hook/useUsers';
import { useUserColumns } from '../hook/useUserColumns';
import { ROLE_LABEL } from '../services/types';
import * as S from '../styles/styled';

import UserList from '../components/UserList';
import PermissionMatrix from '../components/PermissionMatrix';

const { Title, Text } = Typography;

const UsersIndex: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    students,
    isLoading,
    total,
    page,
    pageSize,
    onPageChange,
    isCreating,
    selectedStudent,
    drawerOpen,
    setDrawerOpen,
    permissions,
    setPermissions,
    handleStatusChange,
    handleCreate,
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
        <UserList
          students={students}
          columns={columns}
          loading={isLoading}
          isCreating={isCreating}
          total={total}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onCreate={handleCreate}
        />
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
                {selectedStudent.name.charAt(0).toUpperCase()}
              </Avatar>
              <div>
                <Title level={4} style={{ margin: 0 }}>{selectedStudent.name}</Title>
                <Text type="secondary" style={{ display: 'block' }}>{selectedStudent.email}</Text>
                <Space style={{ marginTop: '4px' }}>
                  <Tag color="blue">{ROLE_LABEL[selectedStudent.role]}</Tag>
                  <Tag color="cyan">Mục tiêu: {selectedStudent.target}</Tag>
                </Space>
              </div>
            </S.DrawerHeader>

            <Descriptions column={1} bordered size="small">
              <Descriptions.Item label="Mã người dùng">#{selectedStudent.id}</Descriptions.Item>
              <Descriptions.Item label="Họ và tên">{selectedStudent.name}</Descriptions.Item>
              <Descriptions.Item label="Email">{selectedStudent.email}</Descriptions.Item>
              <Descriptions.Item label="Vai trò">{ROLE_LABEL[selectedStudent.role]}</Descriptions.Item>
              <Descriptions.Item label="Mục tiêu Aptis">{selectedStudent.target}</Descriptions.Item>
              <Descriptions.Item label="Chuỗi ngày (tạm tính)">🔥 {selectedStudent.streak} ngày</Descriptions.Item>
              <Descriptions.Item label="Ngày tham gia">{selectedStudent.registeredDate}</Descriptions.Item>
              <Descriptions.Item label="Trạng thái">
                <Tag color={selectedStudent.active ? 'success' : 'default'}>
                  {selectedStudent.active ? 'Hoạt động' : 'Bị khóa'}
                </Tag>
              </Descriptions.Item>
            </Descriptions>

            <Text type="secondary" style={{ fontSize: '12px' }}>
              Tiến độ học và lịch sử thi sẽ hiển thị khi có API thống kê. "Chuỗi ngày" hiện đang tạm tính.
            </Text>
          </div>
        )}
      </Drawer>
    </S.Container>
  );
};

export default UsersIndex;
