import React from 'react';
import { Modal, Form, Input, Select, Radio, InputNumber } from 'antd';
import { ICreateNotificationPayload, NotificationType } from '../services/types';

interface NotificationModalProps {
    visible: boolean;
    onCancel: () => void;
    onSuccess: (values: ICreateNotificationPayload) => void;
}

interface FormValues {
    notificationType: NotificationType;
    title: string;
    message: string;
    scope: 'all' | 'specific';
    receiverId?: number;
}

const NotificationModal: React.FC<NotificationModalProps> = ({ visible, onCancel, onSuccess }) => {
    const [form] = Form.useForm<FormValues>();

    React.useEffect(() => {
        if (visible) form.resetFields();
    }, [visible, form]);

    const handleSubmit = () => {
        form.validateFields().then((values) => {
            onSuccess({
                notificationType: values.notificationType,
                title: values.title,
                message: values.message,
                ...(values.scope === 'specific' && values.receiverId ? { receiverId: values.receiverId } : {}),
            });
            form.resetFields();
        });
    };

    return (
        <Modal
            title="Gửi thông báo mới"
            open={visible}
            onCancel={onCancel}
            onOk={handleSubmit}
            okText="Gửi thông báo"
            cancelText="Hủy"
            width={600}
        >
            <Form form={form} layout="vertical" initialValues={{ notificationType: 'SYSTEM', scope: 'all' }}>
                <Form.Item name="title" label="Tiêu đề" rules={[{ required: true, message: 'Vui lòng nhập tiêu đề' }]}>
                    <Input placeholder="Ví dụ: Bảo trì hệ thống" />
                </Form.Item>

                <Form.Item name="notificationType" label="Loại thông báo" rules={[{ required: true }]}>
                    <Select
                        options={[
                            { label: 'Hệ thống', value: 'SYSTEM' },
                            { label: 'Nhắc lịch thi', value: 'EXAM_REMINDER' },
                            { label: 'Kết quả chấm', value: 'GRADE_RESULT' },
                        ]}
                    />
                </Form.Item>

                <Form.Item name="message" label="Nội dung" rules={[{ required: true, message: 'Vui lòng nhập nội dung' }]}>
                    <Input.TextArea rows={4} placeholder="Nhập nội dung gửi đến học viên..." />
                </Form.Item>

                <Form.Item name="scope" label="Phạm vi gửi">
                    <Radio.Group>
                        <Radio value="all">Toàn hệ thống (broadcast)</Radio>
                        <Radio value="specific">Gửi riêng 1 học viên</Radio>
                    </Radio.Group>
                </Form.Item>

                <Form.Item
                    noStyle
                    shouldUpdate={(prev, cur) => prev.scope !== cur.scope}
                >
                    {({ getFieldValue }) =>
                        getFieldValue('scope') === 'specific' ? (
                            <Form.Item name="receiverId" label="ID học viên nhận" rules={[{ required: true, message: 'Nhập ID học viên' }]}>
                                <InputNumber style={{ width: '100%' }} min={1} placeholder="Ví dụ: 5" />
                            </Form.Item>
                        ) : null
                    }
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default NotificationModal;
