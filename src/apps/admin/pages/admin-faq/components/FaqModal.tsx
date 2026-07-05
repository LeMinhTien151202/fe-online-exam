import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, InputNumber } from 'antd';
import { ICreateFaqPayload, IFaq } from '../services/types';

interface FaqModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (values: ICreateFaqPayload) => void;
    initialValues?: IFaq | null;
    isSaving?: boolean;
}

const FaqModal: React.FC<FaqModalProps> = ({ visible, onCancel, onSuccess, initialValues, isSaving }) => {
    const [form] = Form.useForm<ICreateFaqPayload>();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue({
                question: initialValues.question,
                answer: initialValues.answer,
                category: initialValues.category,
                sortOrder: initialValues.sortOrder,
                isActive: initialValues.isActive,
            });
        } else if (visible) {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSuccess(values);
        } catch (error) {
            console.log('Validate Failed:', error);
        }
    };

    return (
        <Modal
            title={initialValues ? 'Chỉnh sửa Câu hỏi' : 'Thêm Câu hỏi mới'}
            open={visible}
            onCancel={onCancel}
            footer={[
                <Button key="back" onClick={onCancel}>Hủy</Button>,
                <Button key="submit" type="primary" loading={isSaving} style={{ background: '#1a365d' }} onClick={handleSubmit}>
                    {initialValues ? 'Cập nhật' : 'Đăng tải'}
                </Button>
            ]}
            width={700}
        >
            <Form form={form} layout="vertical" name="faq_form">
                <Form.Item
                    name="category"
                    label="Danh mục"
                    rules={[{ required: true, message: 'Vui lòng chọn danh mục!' }]}
                >
                    <Select placeholder="Chọn danh mục giải đáp">
                        <Select.Option value="Kỳ thi Aptis">Kỳ thi Aptis</Select.Option>
                        <Select.Option value="Tài khoản">Tài khoản</Select.Option>
                        <Select.Option value="Luyện thi Ngữ pháp">Luyện thi Ngữ pháp</Select.Option>
                        <Select.Option value="Thi thử">Thi thử</Select.Option>
                        <Select.Option value="Học phí & Gói học">Học phí & Gói học</Select.Option>
                    </Select>
                </Form.Item>

                <Form.Item
                    name="question"
                    label="Câu hỏi"
                    rules={[{ required: true, message: 'Vui lòng nhập câu hỏi!' }]}
                >
                    <Input placeholder="Nhập tiêu đề câu hỏi thắc mắc" />
                </Form.Item>

                <Form.Item
                    name="answer"
                    label="Câu trả lời"
                    rules={[{ required: true, message: 'Vui lòng nhập câu trả lời!' }]}
                >
                    <Input.TextArea rows={6} placeholder="Nhập nội dung giải đáp chi tiết" />
                </Form.Item>

                <Form.Item name="sortOrder" label="Thứ tự hiển thị" initialValue={0}>
                    <InputNumber min={0} style={{ width: '100%' }} placeholder="0" />
                </Form.Item>

                <Form.Item name="isActive" label="Trạng thái hiển thị" initialValue={true}>
                    <Select>
                        <Select.Option value={true}>Hiển thị</Select.Option>
                        <Select.Option value={false}>Ẩn</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FaqModal;
