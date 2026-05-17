import React from 'react';
import { Form, Button, Card } from 'antd';
import { z } from 'zod';
import { FormInput, FormSelect } from '@/shared/components/Form';
import { zodValidator } from '@/shared/utils/zod';

const schema = z.object({
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  email: z.string().email('Email không hợp lệ'),
  role: z.string().min(1, 'Vui lòng chọn vai trò'),
});

interface RegistrationFormProps {
  onSubmit: (values: any) => void;
  loading?: boolean;
}

export const RegistrationForm: React.FC<RegistrationFormProps> = ({ onSubmit, loading }) => {
  const [form] = Form.useForm();

  return (
    <Card title="Đăng ký tài khoản hệ thống" className="max-w-md mx-auto mt-10 shadow-lg">
      <Form
        form={form}
        layout="vertical"
        onFinish={onSubmit}
      >
        <FormInput 
          name="fullName" 
          label="Họ và tên" 
          placeholder="Nguyễn Văn A"
          rules={[zodValidator(schema.shape.fullName)]}
        />

        <FormInput 
          name="email" 
          label="Email" 
          placeholder="a@gmail.com"
          rules={[zodValidator(schema.shape.email)]}
        />

        <FormSelect
          name="role"
          label="Vai trò"
          placeholder="Chọn vai trò"
          options={[
            { label: 'Học viên', value: 'student' },
            { label: 'Giáo viên', value: 'teacher' },
          ]}
          rules={[zodValidator(schema.shape.role)]}
        />

        <Button 
          type="primary" 
          htmlType="submit" 
          block 
          size="large" 
          loading={loading}
          className="mt-4"
        >
          Đăng ký
        </Button>
      </Form>
    </Card>
  );
};
