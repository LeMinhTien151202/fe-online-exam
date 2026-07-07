import React from 'react';
import { Card, Table, Tabs } from 'antd';
import { useExams } from '../hook/useExams';
import { useExamColumns } from '../hook/useExamColumns';
import { ExamsHeader } from '../components/ExamsHeader';
import * as S from '../styles/styled';
import { AppPagination } from '@shared/components/Pagination/Index';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';

const ExamsIndex: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    partExams,
    setExams,
    fullExams,
    total,
    page,
    pageSize,
    onPageChange,
    isLoading,
    handleCreateNew,
    handleDelete,
    handleToggle,
    handleView,
    handleEdit,
  } = useExams();

  const { columnsPart, columnsSet, columnsFull } = useExamColumns(handleDelete, handleToggle, handleView, handleEdit);

  const renderTab = (columns: typeof columnsPart, dataSource: unknown[]) => (
    <>
      <AdminTableWrapper>
        <Table
          columns={columns as React.ComponentProps<typeof Table>['columns']}
          dataSource={dataSource}
          size="middle"
          pagination={false}
          loading={isLoading}
        />
      </AdminTableWrapper>
      <AdminPaginationWrapper>
        <AppPagination current={page} total={total} pageSize={pageSize} onChange={onPageChange} />
      </AdminPaginationWrapper>
    </>
  );

  return (
    <S.Container>
      <ExamsHeader title="Danh sách bộ đề thi" buttonText="Tạo bộ đề mới" onCreateNew={handleCreateNew} />

      <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ background: 'transparent', boxShadow: 'none' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            { key: 'partial', label: 'Đề thi theo phần', children: renderTab(columnsPart, partExams) },
            { key: 'set', label: 'Đề thi theo bộ đề', children: renderTab(columnsSet, setExams) },
            { key: 'full', label: 'Đề thi thử liên tục (Full Test)', children: renderTab(columnsFull, fullExams) },
          ]}
        />
      </Card>
    </S.Container>
  );
};

export default ExamsIndex;
