import React from 'react';
import { Space, Button, Tag, Avatar, Typography, TableProps } from 'antd';
import { EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import { IUserRow, ROLE_LABEL, UserRole } from '../services/types';

const { Text } = Typography;

const ROLE_COLOR: Record<UserRole, string> = {
    ADMIN: 'red',
    TEACHER: 'blue',
    STUDENT: 'default',
};

export const useUserColumns = (
    handleOpenDrawer: (record: IUserRow) => void,
    handleStatusChange: (checked: boolean, key: string) => void
) => {
    const columns: TableProps<IUserRow>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            render: (_, __, index: number) => index + 1,
        },
        {
            title: 'Người dùng',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record) => (
                <Space>
                    <Avatar style={{ backgroundColor: ADMIN_COLORS.primary }}>{text.charAt(0).toUpperCase()}</Avatar>
                    <div>
                        <Text strong style={{ fontSize: '13px', color: '#1e293b' }}>{text}</Text>
                        <div style={{ fontSize: '11px', color: ADMIN_COLORS.textSecondary }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Vai trò',
            dataIndex: 'role',
            key: 'role',
            render: (role: UserRole) => (
                <Tag color={ROLE_COLOR[role]} style={{ borderRadius: '4px' }}>{ROLE_LABEL[role]}</Tag>
            ),
        },
        {
            title: 'Chuỗi ngày',
            dataIndex: 'streak',
            key: 'streak',
            render: (streak: number) => (
                <Space>
                    <span>🔥</span>
                    <Text strong>{streak} ngày</Text>
                </Space>
            ),
        },
        {
            title: 'Mục tiêu',
            dataIndex: 'target',
            key: 'target',
            render: (target: string) => <Tag color="cyan" style={{ fontWeight: 600 }}>{target}</Tag>,
        },
        {
            title: 'Tham gia',
            dataIndex: 'registeredDate',
            key: 'registeredDate',
            render: (date: string) => <span style={{ fontSize: '12px', color: '#64748b' }}>{date}</span>,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'active',
            key: 'active',
            width: 130,
            render: (active: boolean) => (
                <div className="custom-status-tag" style={{
                    borderColor: active ? '#86efac' : '#d1d5db',
                    background: active ? '#f0fdf4' : '#f9fafb',
                    color: active ? '#166534' : '#64748b'
                }}>
                    {active ? 'Hoạt động' : 'Bị khóa'}
                </div>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center' as const,
            width: 120,
            render: (_, record) => (
                <Space>
                    <Button
                        className="action-btn edit"
                        icon={<EyeOutlined />}
                        onClick={() => handleOpenDrawer(record)}
                    />
                    <Button
                        className={`action-btn ${record.active ? 'delete' : ''}`}
                        icon={record.active ? <LockOutlined /> : <UnlockOutlined />}
                        onClick={() => handleStatusChange(!record.active, record.key)}
                    />
                </Space>
            ),
        },
    ];

    return columns;
};
