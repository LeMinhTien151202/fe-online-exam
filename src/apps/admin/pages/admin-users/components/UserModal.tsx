import React from 'react';
import { Form, Input, Button, Modal, Select, DatePicker, Space, Divider, Typography, message } from 'antd';
import { SaveOutlined, UserOutlined, MailOutlined, PhoneOutlined, KeyOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';

const { Text, Title } = Typography;
const { Option } = Select;

interface UserModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: (values: any) => void;
    initialValues?: any;
}

const UserModal: React.FC<UserModalProps> = ({ open, onCancel, onSuccess, initialValues }) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (open) {
            form.setFieldsValue(initialValues || { package: 'free', status: 'active' });
        } else {
            form.resetFields();
        }
    }, [open, initialValues, form]);

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            onSuccess(values);
            message.success(initialValues ? 'Cập nhật thành công!' : 'Thêm học viên thành công!');
        } catch (error) {
            console.log('Validate Failed:', error);
        }
    };

    return (
        <Modal
            title={
                <div style={{ paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
                        {initialValues ? 'Chỉnh sửa học viên' : 'Thêm học viên mới'}
                    </Title>
                </div>
            }
            open={open}
            onCancel={onCancel}
            footer={[
                <Button key="cancel" onClick={onCancel} style={{ borderRadius: '6px' }}>
                    Hủy bỏ
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    icon={<SaveOutlined />}
                    onClick={handleSubmit}
                    style={{ background: ADMIN_COLORS.primary, borderRadius: '6px' }}
                >
                    {initialValues ? 'Lưu thay đổi' : 'Thêm mới'}
                </Button>
            ]}
            width={720}
            centered
            bodyStyle={{ paddingTop: '20px' }}
        >
            <Form
                form={form}
                layout="vertical"
                requiredMark="optional"
            >
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                    <div style={{ gridColumn: 'span 2' }}>
                        <Divider orientation={"left" as any} style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
                            <Space><UserOutlined /> THÔNG TIN CÁ NHÂN</Space>
                        </Divider>
                    </div>

                    <Form.Item
                        name="fullName"
                        label="Họ và tên"
                        rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
                    >
                        <Input placeholder="Nguyễn Văn A" style={{ borderRadius: '6px' }} />
                    </Form.Item>

                    <Form.Item
                        name="email"
                        label="Địa chỉ Email"
                        rules={[
                            { required: true, message: 'Vui lòng nhập email' },
                            { type: 'email', message: 'Email không hợp lệ' }
                        ]}
                    >
                        <Input prefix={<MailOutlined style={{ color: '#94a3b8' }} />} placeholder="example@gmail.com" />
                    </Form.Item>

                    <Form.Item name="phone" label="Số điện thoại">
                        <Input prefix={<PhoneOutlined style={{ color: '#94a3b8' }} />} placeholder="09xx xxx xxx" />
                    </Form.Item>

                    <Form.Item name="dob" label="Ngày sinh">
                        <DatePicker style={{ width: '100%', borderRadius: '6px' }} placeholder="Chọn ngày sinh" />
                    </Form.Item>

                    <div style={{ gridColumn: 'span 2' }}>
                        <Divider orientation={"left" as any} style={{ margin: '24px 0 16px 0', fontSize: '13px', color: '#64748b' }}>
                            <Space><KeyOutlined /> TÀI KHOẢN & PHÂN LOẠI</Space>
                        </Divider>
                    </div>

                    {!initialValues && (
                        <>
                            <Form.Item
                                name="password"
                                label="Mật khẩu"
                                rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }, { min: 6, message: 'Tối thiểu 6 ký tự' }]}
                            >
                                <Input.Password placeholder="••••••••" />
                            </Form.Item>
                            <Form.Item
                                name="confirmPassword"
                                label="Xác nhận mật khẩu"
                                dependencies={['password']}
                                rules={[
                                    { required: true, message: 'Vui lòng xác nhận mật khẩu' },
                                    ({ getFieldValue }) => ({
                                        validator(_, value) {
                                            if (!value || getFieldValue('password') === value) {
                                                return Promise.resolve();
                                            }
                                            return Promise.reject(new Error('Mật khẩu không khớp!'));
                                        },
                                    }),
                                ]}
                            >
                                <Input.Password placeholder="••••••••" />
                            </Form.Item>
                        </>
                    )}

                    <Form.Item name="package" label="Gói thành viên" rules={[{ required: true }]}>
                        <Select style={{ borderRadius: '6px' }}>
                            <Option value="free">Miễn phí (Free)</Option>
                            <Option value="pro">Chuyên nghiệp (Pro)</Option>
                            <Option value="premium">Cao cấp (Premium)</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item name="status" label="Trạng thái">
                        <Select>
                            <Option value="active">Đang hoạt động</Option>
                            <Option value="inactive">Đang bị khóa</Option>
                        </Select>
                    </Form.Item>
                </div>
            </Form>
        </Modal>
    );
};


export default UserModal;
