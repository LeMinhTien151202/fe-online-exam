import React, { useState } from 'react';
import { Table, Button, Tag, Modal, Descriptions } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import * as S from '../styles/faqAdmin.styled';
import FaqModal from '../components/FaqModal';
import { AppPagination } from '@/shared/components/Pagination/Index';
import { AdminTableWrapper, AdminPaginationWrapper } from '../../../styles/admin-shared.styles';
import { useFAQColumns } from '../hook/useFAQColumns';
import { useFaq } from '../hook/useFaq';
import { ICreateFaqPayload, IFaq } from '../services/types';

const AdminFaqPage: React.FC = () => {
    const { faqs, isLoading, total, page, pageSize, onPageChange, isSaving, handleSave, handleDelete } = useFaq();
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [editingItem, setEditingItem] = useState<IFaq | null>(null);
    const [viewingItem, setViewingItem] = useState<IFaq | null>(null);

    const handleEdit = (record: IFaq) => {
        setEditingItem(record);
        setIsModalOpen(true);
    };

    const handleView = (record: IFaq) => {
        setViewingItem(record);
        setIsPreviewOpen(true);
    };

    const handleSubmit = (values: ICreateFaqPayload) => {
        handleSave(values, editingItem?.id);
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
                    dataSource={faqs}
                    rowKey="id"
                    loading={isLoading}
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

            <FaqModal
                visible={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                onSuccess={handleSubmit}
                initialValues={editingItem}
                isSaving={isSaving}
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
                            <S.StatusBadge $status={viewingItem.isActive ? 'active' : 'hidden'}>
                                {viewingItem.isActive ? 'Đang hiển thị' : 'Đã ẩn'}
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
