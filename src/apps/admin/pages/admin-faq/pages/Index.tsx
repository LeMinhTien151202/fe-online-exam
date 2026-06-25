import React, { useState } from 'react';
import { Table, Space, Button, Popconfirm, Tag, Tooltip, Modal, Descriptions } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, EyeOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import * as S from '../styles/faqAdmin.styled';
import FaqModal from '../components/FaqModal';
import { AppPagination } from '@/shared/components/Pagination/Index';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';
import { useFAQColumns } from '../hook/useFAQColumns';

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

    const handleDelete = (id: number) => {
        setData(data.filter((item: any) => item.id !== id));
    };

    const handleEdit = (record: any) => {
        setEditingItem(record);
        setIsModalOpen(true);
    };

    const handleView = (record: any) => {
        setViewingItem(record);
        setIsPreviewOpen(true);
    };

    const handleAddOrEdit = (values: any) => {
        if (editingItem) {
            setData(data.map((item: any) => item.id === editingItem.id ? { ...item, ...values } : item));
        } else {
            setData([...data, { id: Date.now(), ...values }]);
        }
        setIsModalOpen(false);
        setEditingItem(null);
    };

    const columns = useFAQColumns(handleEdit, handleDelete, handleView);

    return (
        <div>
            <div style={{ marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: 700, color: '#1e293b', margin: 0 }}>Quản lý Q&A</h1>
                    <p style={{ color: '#64748b', margin: '4px 0 0 0' }}>Đăng tải và chỉnh sửa các câu hỏi giải đáp cho học viên</p>
                </div>
                <Button
                    type="primary"
                    icon={<PlusOutlined />}
                    style={{ borderRadius: '8px', background: '#1a365d' }}
                    onClick={() => {
                        setEditingItem(null);
                        setIsModalOpen(true);
                    }}
                >
                    Thêm câu hỏi
                </Button>
            </div>

            <AdminTableWrapper>
                <Table
                    columns={columns}
                    dataSource={data}
                    rowKey="id"
                    pagination={false}
                />
            </AdminTableWrapper>

            <AdminPaginationWrapper>
                <AppPagination
                    current={1}
                    total={data.length}
                    pageSize={10}
                    onChange={() => { }}
                />
            </AdminPaginationWrapper>

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
