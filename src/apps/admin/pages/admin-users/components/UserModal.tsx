import React from 'react';
import { Form, Input, Button, Modal, Select, Space, Divider, Typography } from 'antd';
import { SaveOutlined, UserOutlined, MailOutlined, KeyOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';

const { Title } = Typography;
const { Option } = Select;

interface UserModalProps {
    open: boolean;
    onCancel: () => void;
    onSuccess: (values: { fullName: string; email: string; password: string; role: 'ADMIN' | 'TEACHER' | 'STUDENT' }) => void;
    isSaving?: boolean;
}

const UserModal: React.FC<UserModalProps> = ({ open, onCancel, onSuccess, isSaving }) => {
    const [form] = Form.useForm();

    React.useEffect(() => {
        if (open) form.setFieldsValue({ role: 'STUDENT' });
        else form.resetFields();
    }, [open, form]);

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
            title={
                <div style={{ paddingBottom: '12px', borderBottom: '1px solid #f1f5f9' }}>
                    <Title level={4} style={{ margin: 0, color: '#1e293b' }}>
                        Thêm người dùng mới
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
                    loading={isSaving}
                    onClick={handleSubmit}
                    style={{ background: ADMIN_COLORS.primary, borderRadius: '6px' }}
                >
                    Thêm mới
                </Button>
            ]}
            width={640}
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
                        <Divider orientation={"left" as never} style={{ margin: '0 0 16px 0', fontSize: '13px', color: '#64748b' }}>
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

                    <Form.Item name="role" label="Vai trò" rules={[{ required: true }]}>
                        <Select style={{ borderRadius: '6px' }}>
                            <Option value="STUDENT">Học viên</Option>
                            <Option value="TEACHER">Giáo viên</Option>
                            <Option value="ADMIN">Quản trị</Option>
                        </Select>
                    </Form.Item>

                    <div style={{ gridColumn: 'span 2' }}>
                        <Divider orientation={"left" as never} style={{ margin: '24px 0 16px 0', fontSize: '13px', color: '#64748b' }}>
                            <Space><KeyOutlined /> MẬT KHẨU</Space>
                        </Divider>
                    </div>

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
                </div>
            </Form>
        </Modal>
    );
};


export default UserModal;
