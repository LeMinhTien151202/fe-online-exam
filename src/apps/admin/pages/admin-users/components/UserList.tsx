import React from 'react';
import { Table, Button, Input, Select, DatePicker, Space, Card } from 'antd';
import { SearchOutlined, DownloadOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import * as S from '../styles/styled';
import { AppPagination } from '@shared/components/Pagination/Index';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';
import UserModal from './UserModal';

const { RangePicker } = DatePicker;

interface UserListProps {
    students: any[];
    columns: any[];
}

const UserList: React.FC<UserListProps> = ({ students, columns }) => {
    const [isModalOpen, setIsModalOpen] = React.useState(false);

    return (
        <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ background: 'transparent', boxShadow: 'none' }}>
            <S.FilterBar>
                <S.FilterRow>
                    <Input
                        placeholder="Tìm tên hoặc email..."
                        prefix={<SearchOutlined />}
                        style={{ width: 220 }}
                    />
                    <Select placeholder="Chọn gói" style={{ width: 120 }} allowClear>
                        <Select.Option value="free">Miễn phí</Select.Option>
                        <Select.Option value="pro">Pro</Select.Option>
                        <Select.Option value="premium">Premium</Select.Option>
                    </Select>
                    <Select placeholder="Trạng thái" style={{ width: 120 }} allowClear>
                        <Select.Option value="active">Hoạt động</Select.Option>
                        <Select.Option value="inactive">Bị khóa</Select.Option>
                    </Select>
                    <Select placeholder="Mục tiêu" style={{ width: 100 }} allowClear>
                        <Select.Option value="B1">B1</Select.Option>
                        <Select.Option value="B2">B2</Select.Option>
                        <Select.Option value="C">C</Select.Option>
                    </Select>
                    <RangePicker style={{ width: 260 }} />
                </S.FilterRow>
                <Space>
                    <Button
                        type="primary"
                        style={{ background: ADMIN_COLORS.primary, borderRadius: '8px' }}
                        onClick={() => setIsModalOpen(true)}
                    >
                        Thêm học viên
                    </Button>
                    <Button icon={<DownloadOutlined />} style={{ borderRadius: '8px' }}>Xuất Excel</Button>
                </Space>
            </S.FilterBar>

            <AdminTableWrapper>
                <Table
                    columns={columns}
                    dataSource={students}
                    pagination={false}
                    size="middle"
                />
            </AdminTableWrapper>

            <AdminPaginationWrapper>
                <AppPagination
                    current={1}
                    total={students.length}
                    pageSize={10}
                    onChange={() => { }}
                />
            </AdminPaginationWrapper>

            <UserModal
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={(values) => {
                    console.log(values);
                    setIsModalOpen(false);
                }}
            />
        </Card>
    );
};

export default UserList;
