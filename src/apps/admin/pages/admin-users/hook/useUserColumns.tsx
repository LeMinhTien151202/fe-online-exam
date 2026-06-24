import React from 'react';
import { Space, Button, Tag, Avatar, Typography, Progress, TableProps } from 'antd';
import { EyeOutlined, LockOutlined, UnlockOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';

const { Text } = Typography;

export const useUserColumns = (
    handleOpenDrawer: (record: any) => void,
    handleStatusChange: (checked: boolean, key: string) => void
) => {
    const columns: TableProps<any>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Học viên',
            dataIndex: 'name',
            key: 'name',
            render: (text: string, record: any) => (
                <Space>
                    <Avatar style={{ backgroundColor: ADMIN_COLORS.primary }}>{text.charAt(0)}</Avatar>
                    <div>
                        <Text strong style={{ fontSize: '13px', color: '#1e293b' }}>{text}</Text>
                        <div style={{ fontSize: '11px', color: ADMIN_COLORS.textSecondary }}>{record.email}</div>
                    </div>
                </Space>
            ),
        },
        {
            title: 'Gói thành viên',
            dataIndex: 'package',
            key: 'package',
            render: (pkg: string) => (
                <Tag color={pkg === 'Premium' ? 'gold' : pkg === 'Pro' ? 'blue' : 'default'} style={{ borderRadius: '4px' }}>
                    {pkg}
                </Tag>
            ),
        },
        {
            title: 'Tiến độ ôn tập',
            dataIndex: 'progress',
            key: 'progress',
            render: (prog: number) => (
                <div style={{ width: 140 }}>
                    <Progress percent={prog} size="small" strokeColor={ADMIN_COLORS.primary} showInfo={false} />
                    <div style={{ fontSize: '10px', textAlign: 'right', marginTop: '2px', color: '#64748b' }}>{prog}%</div>
                </div>
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
            render: (target: string) => (
                <Tag color="cyan" style={{ fontWeight: 600 }}>
                    {target}
                </Tag>
            ),
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
            render: (active: boolean) => (
                <div className="custom-status-tag" style={{
                    borderColor: active ? '#86efac' : '#d1d5db',
                    background: active ? '#f0fdf4' : '#f9fafb',
                    color: active ? '#166534' : '#64748b'
                }}>
                    {active ? 'Hoạt động' : 'Bị khóa'}
                </div>
            ),
            width: 130,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center' as const,
            width: 120,
            render: (record: any) => (
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
