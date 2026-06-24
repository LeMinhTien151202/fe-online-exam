import React from 'react';
import { Table, Card, Input, Select, Button } from 'antd';
import { SearchOutlined, UploadOutlined } from '@ant-design/icons';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';
import { AppPagination } from '@shared/components/Pagination/Index';
import * as S from '../styles/styled';

interface QuestionTableProps {
    columns: any[];
    dataSource: any[];
    total: number;
}

const QuestionTable: React.FC<QuestionTableProps> = ({ columns, dataSource, total }) => {
    return (
        <Card bordered={false}>
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
                />
            </AdminTableWrapper>
            <AdminPaginationWrapper>
                <AppPagination
                    current={1}
                    total={total}
                    pageSize={10}
                    onChange={() => { }}
                />
            </AdminPaginationWrapper>
        </Card>
    );
};

export default QuestionTable;
