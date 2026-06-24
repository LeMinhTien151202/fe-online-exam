import { Space, Button, Popconfirm, Tooltip, TableProps, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';

export const useFAQColumns = (
    handleEdit: (record: any) => void,
    handleDelete: (id: any) => void,
    handleView: (record: any) => void
) => {
    const columns: TableProps<any>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 150,
            render: (cat: string) => <Tag color="blue" style={{ borderRadius: '4px' }}>{cat}</Tag>
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'question',
            key: 'question',
            ellipsis: true,
            render: (text: string) => <div style={{ fontWeight: 600, color: '#1e293b' }}>{text}</div>
        },
        {
            title: 'Nội dung trả lời',
            dataIndex: 'answer',
            key: 'answer',
            ellipsis: true,
            width: 300,
            render: (text: string) => <div style={{ color: '#64748b', fontSize: '13px' }}>{text}</div>
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 150,
            align: 'center',
            render: (status: string) => (
                <div className="custom-status-tag">
                    {status === 'active' ? 'Đang hiển thị' : 'Đã ẩn'}
                </div>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 140,
            align: 'center' as const,
            render: (_: any, record: any) => (
                <Space size={4}>
                    <Tooltip title="Xem chi tiết">
                        <Button
                            className="action-btn"
                            icon={<EyeOutlined />}
                            onClick={() => handleView(record)}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            className="action-btn edit"
                            icon={<EditOutlined />}
                            onClick={() => handleEdit(record)}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa câu hỏi này?"
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
