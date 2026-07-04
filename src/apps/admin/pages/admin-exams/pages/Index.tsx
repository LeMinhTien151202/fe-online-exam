import React from 'react';
import { Card, Table, Tag, Button, Space, Typography, Tabs } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { useExams } from '../hook/useExams';
import { useExamColumns } from '../hook/useExamColumns';
import { ExamsHeader } from '../components/ExamsHeader';
import * as S from '../styles/styled';
import { AppPagination } from '@shared/components/Pagination/Index';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';

const { Text } = Typography;

const ExamsIndex: React.FC = () => {
  const {
    activeTab,
    setActiveTab,
    partExams,
    setExams,
    fullExams,
    isLoading,
    handleCreateNew,
    handleDelete,
    handleToggle,
    handleView,
  } = useExams();

  const { columnsPart, columnsSet, columnsFull } = useExamColumns(handleDelete, handleToggle, handleView);

  return (
    <S.Container>
      <ExamsHeader title="Danh sách bộ đề thi" buttonText="Tạo bộ đề mới" onCreateNew={handleCreateNew} />

      <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ background: 'transparent', boxShadow: 'none' }}>
        <Tabs
          activeKey={activeTab}
          onChange={setActiveTab}
          items={[
            {
              key: 'partial',
              label: 'Đề thi theo phần',
              children: (
                <>
                  <AdminTableWrapper>
                    <Table
                      columns={columnsPart}
                      dataSource={partExams}
                      size="middle"
                      pagination={false}
                      loading={isLoading}
                    />
                  </AdminTableWrapper>
                  <AdminPaginationWrapper>
                    <AppPagination
                      current={1}
                      total={partExams.length}
                      pageSize={10}
                      onChange={() => { }}
                    />
                  </AdminPaginationWrapper>
                </>
              ),
            },
            {
              key: 'set',
              label: 'Đề thi theo bộ đề',
              children: (
                <>
                  <AdminTableWrapper>
                    <Table
                      columns={columnsSet}
                      dataSource={setExams}
                      size="middle"
                      pagination={false}
                      loading={isLoading}
                    />
                  </AdminTableWrapper>
                  <AdminPaginationWrapper>
                    <AppPagination
                      current={1}
                      total={setExams.length}
                      pageSize={10}
                      onChange={() => { }}
                    />
                  </AdminPaginationWrapper>
                </>
              ),
            },
            {
              key: 'full',
              label: 'Đề thi thử liên tục (Full Test)',
              children: (
                <>
                  <AdminTableWrapper>
                    <Table
                      columns={columnsFull}
                      dataSource={fullExams}
                      size="middle"
                      pagination={false}
                      loading={isLoading}
                    />
                  </AdminTableWrapper>
                  <AdminPaginationWrapper>
                    <AppPagination
                      current={1}
                      total={fullExams.length}
                      pageSize={10}
                      onChange={() => { }}
                    />
                  </AdminPaginationWrapper>
                </>
              ),
            },
          ]}
        />
      </Card>
    </S.Container>
  );
};

export default ExamsIndex;
