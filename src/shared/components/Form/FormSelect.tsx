import React from 'react';
import { Form, Select, SelectProps, type FormItemProps } from 'antd';

interface FormSelectProps extends SelectProps {
  name: string;
  label?: string;
  required?: boolean;
  message?: string;
  rules?: FormItemProps['rules'];
}

export const FormSelect: React.FC<FormSelectProps> = ({ 
  name, 
  label, 
  required, 
  message, 
  rules = [],
  ...rest 
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      rules={[
        {
          required: required,
          message: message || `Vui lòng chọn ${label || 'thông tin này'}!`,
        },
        ...rules,
      ]}
    >
      <Select {...rest} />
    </Form.Item>
  );
};
