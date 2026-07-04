import { Button, Tooltip, TableProps, Tag } from 'antd';
import { CheckOutlined } from '@ant-design/icons';
import { INotification, NOTIFICATION_TYPE_LABEL } from '../services/types';

export const useNotificationColumns = (handleMarkRead: (id: number) => void) => {
    const columns: TableProps<INotification>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            render: (_, __, index: number) => index + 1,
        },
        {
            title: 'Thông báo',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record) => (
                <div style={{ maxWidth: 420 }}>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {record.message}
                    </div>
                </div>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'notificationType',
            key: 'notificationType',
            render: (type: INotification['notificationType']) => <Tag color="blue" style={{ borderRadius: '4px' }}>{NOTIFICATION_TYPE_LABEL[type]}</Tag>,
            width: 140,
        },
        {
            title: 'Phạm vi',
            dataIndex: 'receiverId',
            key: 'receiverId',
            render: (receiverId: number | null) =>
                receiverId == null ? <Tag color="purple">Toàn hệ thống</Tag> : <Tag>Gửi riêng #{receiverId}</Tag>,
            width: 140,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isRead',
            key: 'isRead',
            render: (isRead: boolean) => (
                <Tag color={isRead ? 'default' : 'success'}>{isRead ? 'Đã đọc' : 'Chưa đọc'}</Tag>
            ),
            width: 120,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => <span style={{ color: '#64748b', fontSize: '13px' }}>{new Date(date).toLocaleString('vi-VN')}</span>,
            width: 180,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center' as const,
            render: (_, record) => (
                <Tooltip title={record.receiverId == null ? 'Thông báo broadcast không đánh dấu riêng được' : 'Đánh dấu đã đọc'}>
                    <Button
                        className="action-btn"
                        icon={<CheckOutlined />}
                        disabled={record.isRead || record.receiverId == null}
                        onClick={() => handleMarkRead(record.id)}
                    />
                </Tooltip>
            ),
        },
    ];

    return columns;
};
