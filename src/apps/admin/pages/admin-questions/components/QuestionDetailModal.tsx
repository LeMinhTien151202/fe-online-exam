import React from 'react';
import { Modal, Descriptions, Tag, Divider, Typography, Space, Button } from 'antd';
import { FileTextOutlined, InfoCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';

const { Title, Text } = Typography;

interface QuestionDetailModalProps {
    open: boolean;
    onCancel: () => void;
    question: any;
}

const QuestionDetailModal: React.FC<QuestionDetailModalProps> = ({ open, onCancel, question }) => {
    if (!question) return null;

    const getDifficultyTag = (diff: string) => {
        const colors: Record<string, string> = { easy: 'success', medium: 'warning', hard: 'error' };
        const label: Record<string, string> = { easy: 'Dễ', medium: 'Trung bình', hard: 'Khó' };
        return <Tag color={colors[diff]} style={{ borderRadius: '12px' }}>{label[diff]}</Tag>;
    };

    return (
        <Modal
            title={
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <FileTextOutlined style={{ color: ADMIN_COLORS.primary }} />
                    <Title level={4} style={{ margin: 0 }}>Chi tiết câu hỏi</Title>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="close" type="primary" onClick={onCancel} style={{ background: ADMIN_COLORS.primary, borderRadius: '6px' }}>
                    Đóng
                </Button>
            ]}
            width={700}
            centered
        >
            <div style={{ paddingTop: '16px' }}>
                <Descriptions column={2} bordered size="small">
                    <Descriptions.Item label="Mã câu hỏi">#{question.id}</Descriptions.Item>
                    <Descriptions.Item label="Kỹ năng">
                        <Tag color="geekblue">{question.type}</Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Độ khó">
                        {getDifficultyTag(question.difficulty)}
                    </Descriptions.Item>
                    <Descriptions.Item label="Trạng thái">
                        <Tag color={question.status === 'active' ? 'success' : 'default'}>
                            {question.status === 'active' ? 'Đang hoạt động' : 'Bản nháp'}
                        </Tag>
                    </Descriptions.Item>
                    <Descriptions.Item label="Tỷ lệ đúng" span={2}>
                        <Space>
                            <Text strong style={{ color: ADMIN_COLORS.success }}>{question.successRate}%</Text>
                            <Text type="secondary">(Dựa trên {question.useCount} lượt thi)</Text>
                        </Space>
                    </Descriptions.Item>
                </Descriptions>

                <Divider orientation={"left" as any} style={{ margin: '24px 0 16px 0' }}>
                    <Space><InfoCircleOutlined /> NỘI DUNG ĐỀ BÀI</Space>
                </Divider>

                <div style={{
                    padding: '16px',
                    background: '#f8fafc',
                    borderRadius: '8px',
                    border: '1px solid #e2e8f0',
                    lineHeight: '1.6',
                    fontSize: '15px'
                }}>
                    {question.content}
                </div>

                <Divider orientation={"left" as any} style={{ margin: '24px 0 16px 0' }}>
                    <Space><CheckCircleOutlined /> ĐÁP ÁN</Space>
                </Divider>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {['A', 'B', 'C', 'D'].map((key) => {
                        const optKey = `opt${key}`;
                        const isCorrect = key === 'A'; // Assuming optA is always correct in this mock structure
                        return (
                            <div key={key} style={{
                                padding: '10px 12px',
                                borderRadius: '6px',
                                border: '1px solid',
                                borderColor: isCorrect ? '#bbf7d0' : '#e2e8f0',
                                background: isCorrect ? '#f0fdf4' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px'
                            }}>
                                <Tag color={isCorrect ? 'success' : 'default'}>{key}</Tag>
                                <Text style={{ color: isCorrect ? '#166534' : '#1e293b', fontWeight: isCorrect ? 600 : 400 }}>
                                    {question[optKey] || `Lựa chọn ${key}`}
                                </Text>
                            </div>
                        );
                    })}
                </div>
            </div>
        </Modal>
    );
};

export default QuestionDetailModal;
