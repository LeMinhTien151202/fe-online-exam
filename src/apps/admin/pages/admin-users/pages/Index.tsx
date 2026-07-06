import React from 'react';
import { Typography, Tabs } from 'antd';
import { ADMIN_COLORS } from '../../../constants';
import { useUsers } from '../hook/useUsers';
import { useUserColumns } from '../hook/useUserColumns';
import * as S from '../styles/styled';

import UserList from '../components/UserList';
import UserDetailModal from '../components/UserDetailModal';
import PermissionMatrix from '../components/PermissionMatrix';

const { Title } = Typography;

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
    detailOpen,
    setDetailOpen,
    permissions,
    setPermissions,
    handleStatusChange,
    handleCreate,
    handleOpenDetail,
  } = useUsers();

  const columns = useUserColumns(handleOpenDetail, handleStatusChange);

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

      <UserDetailModal
        open={detailOpen}
        onCancel={() => setDetailOpen(false)}
        student={selectedStudent}
      />
    </S.Container>
  );
};

export default UsersIndex;
