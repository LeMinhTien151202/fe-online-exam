import React from 'react';
import { Form, Checkbox, CheckboxProps, type FormItemProps } from 'antd';

interface FormCheckboxProps extends CheckboxProps {
  name: string;
  label?: string;
  rules?: FormItemProps['rules'];
}

export const FormCheckbox: React.FC<FormCheckboxProps> = ({ 
  name, 
  label, 
  children,
  rules = [],
  ...rest 
}) => {
  return (
    <Form.Item
      name={name}
      label={label}
      valuePropName="checked"
      rules={rules}
    >
      <Checkbox {...rest}>{children}</Checkbox>
    </Form.Item>
  );
};
