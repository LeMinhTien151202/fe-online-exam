import React, { useState } from 'react';
import { Table, Button, Space, Select } from 'antd';
import { PlusOutlined, CheckOutlined } from '@ant-design/icons';
import * as S from '../styles/styled';
import { useNotifications } from '../hook/useNotifications';
import { useNotificationColumns } from '../hook/useNotificationColumns';
import NotificationModal from '../components/NotificationModal';
import { AppPagination } from '@shared/components/Pagination/Index';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';

const AdminNotificationsPage: React.FC = () => {
    const {
        notifications,
        loading,
        total,
        page,
        pageSize,
        onPageChange,
        audience,
        setAudience,
        notificationType,
        setNotificationType,
        handleCreate,
        handleMarkRead,
        handleReadAll,
    } = useNotifications();
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
                    <Space wrap>
                        <Select
                            placeholder="Phạm vi"
                            style={{ width: 160 }}
                            allowClear
                            value={audience}
                            onChange={setAudience}
                            options={[
                                { label: 'Toàn hệ thống', value: 'broadcast' },
                                { label: 'Gửi riêng', value: 'personal' },
                            ]}
                        />
                        <Select
                            placeholder="Loại thông báo"
                            style={{ width: 180 }}
                            allowClear
                            value={notificationType}
                            onChange={setNotificationType}
                            options={[
                                { label: 'Hệ thống', value: 'SYSTEM' },
                                { label: 'Nhắc lịch thi', value: 'EXAM_REMINDER' },
                                { label: 'Kết quả chấm', value: 'GRADE_RESULT' },
                            ]}
                        />
                    </Space>
                    <Button icon={<CheckOutlined />} style={{ borderRadius: '8px' }} onClick={handleReadAll}>Đọc tất cả</Button>
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
                        current={page}
                        total={total}
                        pageSize={pageSize}
                        onChange={onPageChange}
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
