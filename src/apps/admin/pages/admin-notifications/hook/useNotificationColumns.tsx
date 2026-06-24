import { Space, Button, Popconfirm, Tooltip, TableProps, Tag } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';

export const useNotificationColumns = (handleEdit: (record: any) => void, handleDelete: (id: string) => void) => {
    const columns: TableProps<any>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Thông báo',
            dataIndex: 'title',
            key: 'title',
            render: (text: string, record: any) => (
                <div style={{ maxWidth: 400 }}>
                    <div style={{ fontWeight: 600, color: '#1e293b', fontSize: '14px' }}>{text}</div>
                    <div style={{ fontSize: '12px', color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {record.content}
                    </div>
                </div>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag color="blue" style={{ borderRadius: '4px' }}>{type}</Tag>,
            width: 140,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <div className="custom-status-tag">
                    {status === 'published' ? 'Đã gửi' : status === 'scheduled' ? 'Hẹn giờ' : 'Bản nháp'}
                </div>
            ),
            width: 150,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            render: (date: string) => <span style={{ color: '#64748b', fontSize: '13px', fontWeight: 500 }}>{date}</span>,
            width: 180,
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 120,
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            className="action-btn edit"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa thông báo này?"
                        onConfirm={() => handleDelete(record.id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button className="action-btn delete" icon={<DeleteOutlined />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return columns;
};
