import { DeleteOutlined,EditOutlined,EyeOutlined } from '@ant-design/icons';
import { Button,Progress,Space,TableProps,Tag,Tooltip,Typography } from 'antd';
import * as S from '../styles/styled';

const { Text } = Typography;

export const useQuestionColumns = (
    handleEdit: (record: any) => void,
    handleView: (record: any) => void,
    handleDelete?: (record: any) => void
) => {
    const columns: TableProps<any>['columns'] = [
        {
            title: 'TT',
            key: 'index',
            width: 60,
            render: (_: any, __: any, index: number) => index + 1,
        },
        {
            title: 'Nội dung',
            dataIndex: 'content',
            key: 'content',
            render: (text: string) => (
                <Tooltip title={text}>
                    <S.TextEllipsis style={{ maxWidth: 350, fontWeight: 500 }}>
                        {text}
                    </S.TextEllipsis>
                </Tooltip>
            ),
        },
        {
            title: 'Loại',
            dataIndex: 'type',
            key: 'type',
            render: (type: string) => <Tag color="geekblue" style={{ borderRadius: '4px' }}>{type}</Tag>,
            width: 100,
        },
        {
            title: 'Độ khó',
            dataIndex: 'difficulty',
            key: 'difficulty',
            render: (diff: string) => {
                const colors: Record<string, string> = { easy: 'success', medium: 'warning', hard: 'error' };
                const label: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
                return <Tag color={colors[diff]} style={{ borderRadius: '12px', padding: '0 10px' }}>{label[diff]}</Tag>;
            },
            width: 120,
        },
        {
            title: 'Hiệu suất',
            key: 'performance',
            render: (_: any, record: any) => (
                <div style={{ width: 120 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>Đúng: {record.successRate}%</span>
                        <span style={{ fontSize: '11px', color: '#64748b' }}>n={record.useCount}</span>
                    </div>
                    <Progress
                        percent={record.successRate}
                        size="small"
                        showInfo={false}
                        strokeColor={record.successRate < 40 ? '#ef4444' : '#10b981'}
                    />
                </div>
            ),
            width: 150,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            render: (status: string) => (
                <div className="custom-status-tag">
                    {status === 'active' ? 'Hoạt động' : 'Bản nháp'}
                </div>
            ),
            width: 120,
        },
        {
            title: 'Cập nhật',
            dataIndex: 'updatedAt',
            key: 'updatedAt',
            render: (date: string) => <span style={{ color: '#64748b', fontSize: '12px' }}>{date}</span>,
            width: 120,
        },
        {
            title: 'Thao tác',
            key: 'actions',
            align: 'center' as const,
            width: 150,
            render: (_: any, record: any) => (
                <Space>
                    <Tooltip title="Xem chi tiết">
                        <Button className="action-btn" icon={<EyeOutlined />} onClick={() => handleView(record)} />
                    </Tooltip>
                    <Tooltip title="Sửa">
                        <Button className="action-btn edit" icon={<EditOutlined />} onClick={() => handleEdit(record)} />
                    </Tooltip>
                    <Tooltip title="Xóa">
                        <Button className="action-btn delete" icon={<DeleteOutlined />} onClick={() => handleDelete?.(record)} />
                    </Tooltip>
                </Space>
            ),
        },
    ];

    return columns;
};
