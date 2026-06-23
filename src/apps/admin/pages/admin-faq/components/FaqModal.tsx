import React, { useEffect } from 'react';
import { Modal, Form, Input, Select, Button, notification } from 'antd';

interface FaqModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (values: any) => void;
    initialValues?: any;
}

const FaqModal: React.FC<FaqModalProps> = ({ visible, onCancel, onSuccess, initialValues }) => {
    const [form] = Form.useForm();

    useEffect(() => {
        if (visible && initialValues) {
            form.setFieldsValue(initialValues);
        } else {
            form.resetFields();
        }
    }, [visible, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSuccess(values);
            notification.success({
                message: initialValues ? 'Cập nhật thành công' : 'Thêm mới thành công',
                description: 'Câu hỏi đã được lưu vào hệ thống Q&A.'
            });
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
                <Button key="submit" type="primary" style={{ background: '#1a365d' }} onClick={handleSubmit}>
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

                <Form.Item
                    name="status"
                    label="Trạng thái hiển thị"
                    initialValue="active"
                >
                    <Select>
                        <Select.Option value="active">Hiển thị</Select.Option>
                        <Select.Option value="hidden">Ẩn</Select.Option>
                    </Select>
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default FaqModal;
