import React from 'react';
import { Modal, Form, Input, Select, DatePicker, Radio } from 'antd';

interface NotificationModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (values: any) => void;
    initialValues?: any;
}

const NotificationModal: React.FC<NotificationModalProps> = ({
    visible,
    onCancel,
    onSuccess,
    initialValues,
}) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (visible) {
            if (initialValues) {
                form.setFieldsValue(initialValues);
            } else {
                form.resetFields();
            }
        }
    }, [visible, initialValues, form]);

    const handleSubmit = () => {
        form.validateFields().then(values => {
            onSuccess(values);
            form.resetFields();
        });
    };

    return (
        <Modal
            title={initialValues ? 'Chỉnh sửa thông báo' : 'Tạo thông báo mới'}
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText={initialValues ? 'Lưu thay đổi' : 'Gửi thông báo'}
            cancelText="Hủy"
            width={600}
        >
            <Form
                form={form}
                layout="vertical"
                initialValues={{
                    type: 'exam',
                    status: 'published',
                    recipientType: 'all'
                }}
            >
                <Form.Item
                    name="title"
                    label="Tiêu đề thông báo"
                    rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}
                >
                    <Input placeholder="Ví dụ: Cập nhật bộ đề thi Reading mới" />
                </Form.Item>

                <Form.Item
                    name="type"
                    label="Loại thông báo"
                    rules={[{ required: true }]}
                >
                    <Select options={[
                        { label: 'Hệ thống', value: 'system' },
                        { label: 'Đề thi mới', value: 'exam' },
                        { label: 'Câu hỏi mới', value: 'question' },
                        { label: 'Khuyến mãi / Ưu đãi', value: 'promotion' },
                    ]} />
                </Form.Item>

                <Form.Item
                    name="content"
                    label="Nội dung thông báo"
                    rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}
                >
                    <Input.TextArea rows={4} placeholder="Nhập nội dung chi tiết gửi đến học viên..." />
                </Form.Item>

                <Form.Item
                    name="recipientType"
                    label="Đối tượng nhận"
                >
                    <Radio.Group>
                        <Radio value="all">Tất cả học viên</Radio>
                        <Radio value="specific" disabled>Học viên cụ thể (Coming soon)</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    name="status"
                    label="Chế độ gửi"
                >
                    <Radio.Group>
                        <Radio value="published">Gửi ngay</Radio>
                        <Radio value="draft">Lưu nháp</Radio>
                        <Radio value="scheduled">Hẹn giờ</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) => prevValues.status !== currentValues.status}
                >
                    {({ getFieldValue }) =>
                        getFieldValue('status') === 'scheduled' ? (
                            <Form.Item
                                name="publishAt"
                                label="Thời gian gửi"
                                rules={[{ required: true, message: 'Vui lòng chọn thời gian' }]}
                            >
                                <DatePicker showTime style={{ width: '100%' }} />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NotificationModal;
