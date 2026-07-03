import React from 'react';
import { Modal, Form, Input } from 'antd';
import { useChangePasswordMutation } from '@apps/auth/services/authQuery';
import * as S from '../styles/profile.styled';

interface ChangePasswordModalProps {
    isOpen: boolean;
    onClose: () => void;
}

interface ChangePasswordFormValues {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({ isOpen, onClose }) => {
    const [form] = Form.useForm<ChangePasswordFormValues>();
    const changePasswordMutation = useChangePasswordMutation();

    const handleSubmit = (values: ChangePasswordFormValues) => {
        changePasswordMutation.mutate(
            { oldPassword: values.currentPassword, newPassword: values.newPassword },
            {
                onSuccess: () => {
                    onClose();
                    form.resetFields();
                },
            }
        );
    };

    return (
        <Modal
            title={<span style={{ fontWeight: 800, color: '#1A233A' }}>Đổi mật khẩu</span>}
            open={isOpen}
            onCancel={onClose}
            footer={null}
            centered
            width={400}
        >
            <Form
                form={form}
                layout="vertical"
                onFinish={handleSubmit}
                style={{ marginTop: '1.5rem' }}
            >
                <Form.Item
                    label="Mật khẩu hiện tại"
                    name="currentPassword"
                    rules={[{ required: true, message: 'Vui lòng nhập mật khẩu hiện tại' }]}
                >
                    <Input.Password placeholder="••••••••" style={{ borderRadius: '0.375rem' }} />
                </Form.Item>

                <Form.Item
                    label="Mật khẩu mới"
                    name="newPassword"
                    rules={[
                        { required: true, message: 'Vui lòng nhập mật khẩu mới' },
                        { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
                    ]}
                >
                    <Input.Password placeholder="••••••••" style={{ borderRadius: '0.375rem' }} />
                </Form.Item>

                <Form.Item
                    label="Xác nhận mật khẩu mới"
                    name="confirmPassword"
                    dependencies={['newPassword']}
                    rules={[
                        { required: true, message: 'Vui lòng xác nhận mật khẩu mới' },
                        ({ getFieldValue }) => ({
                            validator(_, value) {
                                if (!value || getFieldValue('newPassword') === value) {
                                    return Promise.resolve();
                                }
                                return Promise.reject(new Error('Mật khẩu xác nhận không khớp!'));
                            },
                        }),
                    ]}
                >
                    <Input.Password placeholder="••••••••" style={{ borderRadius: '0.375rem' }} />
                </Form.Item>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '2rem' }}>
                    <S.CancelButton type="button" style={{ padding: '0.5rem 1.25rem' }} onClick={onClose}>
                        Hủy
                    </S.CancelButton>
                    <S.SaveButton type="submit" style={{ padding: '0.5rem 1.25rem' }} disabled={changePasswordMutation.isPending}>
                        {changePasswordMutation.isPending ? 'Đang xử lý...' : 'Cập nhật'}
                    </S.SaveButton>
                </div>
            </Form>
        </Modal>
    );
};

export default ChangePasswordModal;
