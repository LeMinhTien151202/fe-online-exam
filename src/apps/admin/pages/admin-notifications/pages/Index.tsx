import React, { useState } from 'react';
import { Table, Button, Input, Space, Tag } from 'antd';
import { PlusOutlined, SearchOutlined, CheckOutlined } from '@ant-design/icons';
import * as S from '../styles/styled';
import { useNotifications } from '../hook/useNotifications';
import { useNotificationColumns } from '../hook/useNotificationColumns';
import NotificationModal from '../components/NotificationModal';
import { AppPagination } from '@shared/components/Pagination/Index';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';

const AdminNotificationsPage: React.FC = () => {
    const { notifications, loading, unreadCount, handleCreate, handleMarkRead, handleReadAll } = useNotifications();
    const [isModalOpen, setIsModalOpen] = useState(false);

    const columns = useNotificationColumns(handleMarkRead);

    return (
        <S.Container>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Quản lý thông báo</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Gửi tin tức, cập nhật đề thi và câu hỏi mới đến học viên</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ borderRadius: '8px', background: '#1a365d' }}
                    onClick={() => setIsModalOpen(true)}
                >
                    Gửi thông báo
                </Button>
            </div>

            <S.NotificationCard>
                <S.FilterBar>
                    <S.SearchWrapper>
                        <Input
                            placeholder="Tìm kiếm thông báo..."
                            prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
                            style={{ width: 300, borderRadius: '8px' }}
                        />
                    </S.SearchWrapper>
                    <Space>
                        <Tag color="orange">{unreadCount} chưa đọc</Tag>
                        <Button icon={<CheckOutlined />} style={{ borderRadius: '8px' }} onClick={handleReadAll}>Đọc tất cả</Button>
                    </Space>
                </S.FilterBar>

                <AdminTableWrapper>
                    <Table
                        columns={columns}
                        dataSource={notifications}
                        rowKey="id"
                        loading={loading}
                        pagination={false}
                    />
                </AdminTableWrapper>

                <AdminPaginationWrapper>
                    <AppPagination
                        current={1}
                        total={notifications.length}
                        pageSize={10}
                        onChange={() => { }}
                    />
                </AdminPaginationWrapper>
            </S.NotificationCard>

            <NotificationModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={(values) => {
                    handleCreate(values);
                    setIsModalOpen(false);
                }}
            />
        </S.Container>
    );
};

export default AdminNotificationsPage;
