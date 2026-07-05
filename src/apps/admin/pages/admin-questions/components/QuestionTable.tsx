import React from 'react';
import { Table, Card, Input, Select, Button, TableProps } from 'antd';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';
import { AppPagination } from '@shared/components/Pagination/Index';
import * as S from '../styles/styled';

type QuestionRow = Record<string, unknown>;

interface QuestionTableProps {
    columns: TableProps<QuestionRow>['columns'];
    dataSource: QuestionRow[];
    total: number;
    page?: number;
    pageSize?: number;
    onPageChange?: (page: number, pageSize: number) => void;
    loading?: boolean;
}

const QuestionTable: React.FC<QuestionTableProps> = ({ columns, dataSource, total, page = 1, pageSize = 10, onPageChange, loading }) => {
    return (
        <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ background: 'transparent', boxShadow: 'none' }}>
            <S.FilterBar style={{ marginBottom: '1rem' }}>
                <Input placeholder="Tìm nội dung câu hỏi..." prefix={<SearchOutlined />} style={{ width: 280 }} />
                <Select placeholder="Độ khó" style={{ width: 120 }} allowClear>
                    <Select.Option value="easy">Dễ</Select.Option>
                    <Select.Option value="medium">Trung bình</Select.Option>
                    <Select.Option value="hard">Khó</Select.Option>
                </Select>
                <Select placeholder="Trạng thái" style={{ width: 120 }} allowClear>
                    <Select.Option value="active">Đang dùng</Select.Option>
                    <Select.Option value="draft">Bản nháp</Select.Option>
                </Select>
                <Button icon={<UploadOutlined />}>Import Excel</Button>
            </S.FilterBar>

            <AdminTableWrapper>
                <Table
                    columns={columns}
                    dataSource={dataSource}
                    pagination={false}
                    size="middle"
                    loading={loading}
                />
            </AdminTableWrapper>
            <AdminPaginationWrapper>
                <AppPagination
                    current={page}
                    total={total}
                    pageSize={pageSize}
                    onChange={onPageChange ?? (() => { })}
                />
            </AdminPaginationWrapper>
        </Card>
    );
};

export default QuestionTable;
