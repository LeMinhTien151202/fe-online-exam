import React from 'react';
import { Form, DatePicker, DatePickerProps } from 'antd';

interface FormDatePickerProps extends DatePickerProps {
  name: string;
  label?: string;
  required?: boolean;
  message?: string;
  rules?: any[];
}

export const FormDatePicker: React.FC<FormDatePickerProps> = ({ 
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
      <DatePicker className="w-full" {...rest} />
    </Form.Item>
  );
};
