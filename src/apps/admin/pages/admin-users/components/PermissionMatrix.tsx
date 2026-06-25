import React from 'react';
import { Table, Checkbox, Button, Typography, Card, message } from 'antd';
import { SaveOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';
import { AppPagination } from '@shared/components/Pagination/Index';

const { Title, Text } = Typography;

interface PermissionMatrixProps {
    permissions: any[];
    setPermissions: React.Dispatch<React.SetStateAction<any[]>>;
}

const PermissionMatrix: React.FC<PermissionMatrixProps> = ({ permissions, setPermissions }) => {
    return (
        <Card bordered={false} styles={{ body: { padding: 0 } }} style={{ background: 'transparent', boxShadow: 'none' }}>
            <div style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.5rem',
                background: '#f8fafc',
                padding: '1rem',
                borderRadius: '8px',
                border: '1px solid #eef2f6'
            }}>
                <div>
                    <Title level={4} style={{ margin: 0, color: ADMIN_COLORS.primary }}>Ma trận Phân quyền Vai trò</Title>
                    <Text type="secondary">Cấp quyền chi tiết cho các nhóm vai trò trong hệ thống.</Text>
                </div>
                <Button
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={() => message.success('Đã lưu cấu hình phân quyền!')}
                    style={{ background: ADMIN_COLORS.primary, borderRadius: '8px' }}
                >
                    Lưu cấu hình
                </Button>
            </div>

            <AdminTableWrapper>
                <Table
                    dataSource={permissions}
                    pagination={false}
                    size="middle"
                    columns={[
                        {
                            title: 'Hành động / Quyền hạn',
                            dataIndex: 'action',
                            key: 'action',
                            width: 250,
                            render: (text: string) => <Text strong>{text}</Text>,
                        },
                        {
                            title: 'Super Admin',
                            dataIndex: 'superAdmin',
                            key: 'superAdmin',
                            align: 'center',
                            width: 150,
                            render: (val: boolean, record: any) => (
                                <Checkbox
                                    checked={val}
                                    onChange={(e) => {
                                        setPermissions(prev =>
                                            prev.map(p => (p.key === record.key ? { ...p, superAdmin: e.target.checked } : p))
                                        );
                                    }}
                                />
                            ),
                        },
                        {
                            title: 'Admin',
                            dataIndex: 'admin',
                            key: 'admin',
                            align: 'center',
                            width: 150,
                            render: (val: boolean, record: any) => (
                                <Checkbox
                                    checked={val}
                                    onChange={(e) => {
                                        setPermissions(prev =>
                                            prev.map(p => (p.key === record.key ? { ...p, admin: e.target.checked } : p))
                                        );
                                    }}
                                />
                            ),
                        },
                        {
                            title: 'Giáo viên',
                            dataIndex: 'teacher',
                            key: 'teacher',
                            align: 'center',
                            width: 150,
                            render: (val: boolean, record: any) => (
                                <Checkbox
                                    checked={val}
                                    onChange={(e) => {
                                        setPermissions(prev =>
                                            prev.map(p => (p.key === record.key ? { ...p, teacher: e.target.checked } : p))
                                        );
                                    }}
                                />
                            ),
                        },
                        {
                            title: 'Học viên',
                            dataIndex: 'student',
                            key: 'student',
                            align: 'center',
                            width: 150,
                            render: (val: boolean, record: any) => (
                                <Checkbox
                                    checked={val}
                                    onChange={(e) => {
                                        setPermissions(prev =>
                                            prev.map(p => (p.key === record.key ? { ...p, student: e.target.checked } : p))
                                        );
                                    }}
                                />
                            ),
                        },
                    ]}
                />
            </AdminTableWrapper>

            <AdminPaginationWrapper>
                <AppPagination
                    current={1}
                    total={permissions.length}
                    pageSize={10}
                    onChange={() => { }}
                />
            </AdminPaginationWrapper>
        </Card>
    );
};

export default PermissionMatrix;
