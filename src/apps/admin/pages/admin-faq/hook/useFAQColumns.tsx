import { Space, Button, Popconfirm, Tooltip, TableProps, Tag } from 'antd';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import { IFaq } from '../services/types';

export const useFAQColumns = (
    handleEdit: (record: IFaq) => void,
    handleDelete: (id: number) => void,
    handleView: (record: IFaq) => void
) => {
    const columns: TableProps<IFaq>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            align: 'center',
            render: (_, __, index: number) => index + 1,
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
            title: 'Thứ tự',
            dataIndex: 'sortOrder',
            key: 'sortOrder',
            width: 80,
            align: 'center',
        },
        {
            title: 'Trạng thái',
            dataIndex: 'isActive',
            key: 'isActive',
            width: 130,
            align: 'center',
            render: (isActive: boolean) => (
                <Tag color={isActive ? 'success' : 'default'}>{isActive ? 'Đang hiển thị' : 'Đã ẩn'}</Tag>
            )
        },
        {
            title: 'Thao tác',
            key: 'action',
            width: 140,
            align: 'center' as const,
            render: (_, record) => (
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
