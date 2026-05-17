import React from 'react';
import { Form, Button, Card, Space } from 'antd';
import { z } from 'zod';
import { 
  FormInput, 
  FormSelect, 
  FormDatePicker, 
  FormTextArea, 
  FormCheckbox 
} from '@/shared/components/Form';
import { zodValidator } from '@/shared/utils/zod';

// Định nghĩa schema validation bằng Zod
const registrationSchema = z.object({
  fullName: z.string().min(2, 'Họ tên phải có ít nhất 2 ký tự').max(50, 'Họ tên quá dài'),
  email: z.string().email('Email không hợp lệ'),
  course: z.string().min(1, 'Vui lòng chọn khóa học'),
  birthday: z.any().refine((val) => !!val, 'Vui lòng chọn ngày sinh'),
  note: z.string().optional(),
  agree: z.boolean().refine((val) => val === true, 'Bạn phải đồng ý với điều khoản'),
});

type RegistrationValues = z.infer<typeof registrationSchema>;

export const DemoForm: React.FC = () => {
  const [form] = Form.useForm();

  const onFinish = (values: RegistrationValues) => {
    console.log('Success:', values);
    // Thực tế sẽ call API ở Container thông qua callback props
  };

  return (
    <Card title="Demo Form Chung" style={{ maxWidth: 600, margin: '20px auto' }}>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ agree: false }}
      >
        <FormInput 
          name="fullName" 
          label="Họ và tên" 
          required 
          placeholder="Nhập họ và tên"
          rules={[zodValidator(registrationSchema.shape.fullName)]}
        />

        <FormInput 
          name="email" 
          label="Email" 
          required 
          placeholder="example@gmail.com"
          rules={[zodValidator(registrationSchema.shape.email)]}
        />

        <FormSelect
          name="course"
          label="Khóa học"
          required
          placeholder="Chọn khóa học"
          options={[
            { label: 'Aptis General', value: 'general' },
            { label: 'Aptis Advanced', value: 'advanced' },
            { label: 'Aptis for Teachers', value: 'teachers' },
          ]}
          rules={[zodValidator(registrationSchema.shape.course)]}
        />

        <FormDatePicker 
          name="birthday" 
          label="Ngày sinh" 
          required
          rules={[zodValidator(registrationSchema.shape.birthday)]}
        />

        <FormTextArea 
          name="note" 
          label="Ghi chú" 
          placeholder="Nhập ghi chú thêm..."
          rows={3}
        />

        <FormCheckbox 
          name="agree"
          rules={[zodValidator(registrationSchema.shape.agree)]}
        >
          Tôi đồng ý với các điều khoản của hệ thống
        </FormCheckbox>

        <Form.Item>
          <Space>
            <Button type="primary" htmlType="submit">
              Đăng ký ngay
            </Button>
            <Button onClick={() => form.resetFields()}>
              Nhập lại
            </Button>
          </Space>
        </Form.Item>
      </Form>
    </Card>
  );
};
