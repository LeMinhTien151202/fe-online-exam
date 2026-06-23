import React, { useState } from 'react';
import { Table, Space, Button, Popconfirm, Tag, Tooltip } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { Modal, Descriptions } from 'antd';
import { ADMIN_COLORS } from '../../../constants';
import * as S from '../styles/faqAdmin.styled';
import FaqModal from '../components/FaqModal';
import { AppPagination } from '@shared/components/Pagination/Index';

const initialData = [
    {
        id: 1,
        category: 'Kỳ thi Aptis',
        question: 'Aptis ESOL là gì?',
        answer: 'Aptis ESOL là bài thi đánh giá trình độ tiếng Anh hiện đại được phát triển bởi Hội đồng Anh...',
        status: 'active'
    },
    {
        id: 2,
        category: 'Kỳ thi Aptis',
        question: 'Bao lâu thì có kết quả thi Aptis?',
        answer: 'Thông thường, kết quả thi Aptis trực tuyến sẽ có sau 2-5 ngày làm việc...',
        status: 'active'
    },
    {
        id: 3,
        category: 'Tài khoản',
        question: 'Làm thế nào để đổi mật khẩu?',
        answer: 'Bạn có thể vào mục "Cài đặt tài khoản" ở góc dưới bên trái...',
        status: 'active'
    },
];

const AdminFaqPage: React.FC = () => {
    const [data, setData] = useState(initialData);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<any>(null);
    const [viewingItem, setViewingItem] = useState<any>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const handleDelete = (id: number) => {
        setData(data.filter(item => item.id !== id));
    };

    const handleAddOrEdit = (values: any) => {
        if (editingItem) {
            setData(data.map(item => item.id === editingItem.id ? { ...item, ...values } : item));
        } else {
            setData([...data, { id: Date.now(), ...values }]);
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const columns = [
        {
            title: 'Danh mục',
            dataIndex: 'category',
            key: 'category',
            width: 150,
            render: (cat: string) => <Tag color="blue">{cat}</Tag>
        },
        {
            title: 'Câu hỏi',
            dataIndex: 'question',
            key: 'question',
            ellipsis: true,
            render: (text: string) => <strong>{text}</strong>
        },
        {
            title: 'Nội dung trả lời',
            dataIndex: 'answer',
            key: 'answer',
            ellipsis: true,
            width: 300,
        },
        {
            title: 'Trạng thái',
            dataIndex: 'status',
            key: 'status',
            width: 140,
            render: (status: string) => (
                <S.StatusBadge $status={status}>
                    {status === 'active' ? 'Đang hiển thị' : 'Đã ẩn'}
                </S.StatusBadge>
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
                            type="text"
                            icon={<EyeOutlined style={{ color: '#64748b' }} />}
                            onClick={() => {
                                setViewingItem(record);
                                setIsPreviewOpen(true);
                            }}
                        />
                    </Tooltip>
                    <Tooltip title="Chỉnh sửa">
                        <Button
                            type="text"
                            icon={<EditOutlined style={{ color: ADMIN_COLORS.primary }} />}
                            onClick={() => {
                                setEditingItem(record);
                                setIsModalOpen(true);
                            }}
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
                            <Button type="text" icon={<DeleteOutlined style={{ color: '#ef4444' }} />} />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div style={{ padding: '2rem' }}>
            <S.PageHeader>
                <div>
                    <h1>Quản lý Q&A</h1>
                    <p>Đăng tải và chỉnh sửa các câu hỏi giải đáp cho học viên</p>
                </div>
                <S.ActionButton onClick={() => {
                    setEditingItem(null);
                    setIsModalOpen(true);
                }}>
                    <PlusOutlined /> Thêm câu hỏi
                </S.ActionButton>
            </S.PageHeader>

            <S.TableContainer>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={false}
                />
                <AppPagination
                    current={currentPage}
                    total={data.length}
                    pageSize={pageSize}
                    onChange={(page: number, size: number) => {
                        setCurrentPage(page);
                        setPageSize(size);
                    }}
                />
            </S.TableContainer>

            <FaqModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={handleAddOrEdit}
                initialValues={editingItem}
            />

            <Modal
                title="Chi tiết câu hỏi giải đáp"
                open={isPreviewOpen}
                onCancel={() => setIsPreviewOpen(false)}
                footer={[
                    <Button key="close" onClick={() => setIsPreviewOpen(false)}>Đóng</Button>
                ]}
                width={600}
            >
                {viewingItem && (
                    <Descriptions column={1} bordered>
                        <Descriptions.Item label="Danh mục">
                            <Tag color="blue">{viewingItem.category}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Trạng thái">
                            <S.StatusBadge $status={viewingItem.status}>
                                {viewingItem.status === 'active' ? 'Đang hiển thị' : 'Đã ẩn'}
                            </S.StatusBadge>
                        </Descriptions.Item>
                        <Descriptions.Item label="Câu hỏi">
                            <div style={{ fontWeight: 700, color: ADMIN_COLORS.primary }}>{viewingItem.question}</div>
                        </Descriptions.Item>
                        <Descriptions.Item label="Nội dung trả lời">
                            <div style={{ whiteSpace: 'pre-wrap', lineHeight: 1.6 }}>{viewingItem.answer}</div>
                        </Descriptions.Item>
                    </Descriptions>
                )}
            </Modal>
        </div>
    );
};

export default AdminFaqPage;
