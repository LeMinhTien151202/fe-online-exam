import React from 'react';
import { Form, Input, InputProps, type FormItemProps } from 'antd';

interface FormInputProps extends InputProps {
  name: string;
  label?: string;
  required?: boolean;
  message?: string;
  dependencies?: FormItemProps['dependencies'];
  rules?: FormItemProps['rules'];
}

export const FormInput: React.FC<FormInputProps> = ({ 
  name, 
  label, 
  required, 
  message, 
  dependencies,
  rules = [],
  ...rest 
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      dependencies={dependencies}
      rules={[
        {
          required: required,
          message: message || `Vui lòng nhập ${label || 'thông tin này'}!`,
        },
        ...rules,
      ]}
    >
      <Input {...rest} />
    </Form.Item>
  );
};
