import React from 'react';
import { Form, Input } from 'antd';
import { TextAreaProps } from 'antd/es/input';

const { TextArea } = Input;

interface FormTextAreaProps extends TextAreaProps {
  name: string;
  label?: string;
  required?: boolean;
  message?: string;
  rules?: any[];
}

export const FormTextArea: React.FC<FormTextAreaProps> = ({ 
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
          message: message || `Vui lòng nhập ${label || 'thông tin này'}!`,
        },
        ...rules,
      ]}
    >
      <TextArea {...rest} />
    </Form.Item>
  );
};
