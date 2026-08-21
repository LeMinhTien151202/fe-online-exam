import React from 'react';
import { Form, Switch, SwitchProps, type FormItemProps } from 'antd';

interface FormSwitchProps extends SwitchProps {
  name: string;
  label?: string;
  rules?: FormItemProps['rules'];
}

export const FormSwitch: React.FC<FormSwitchProps> = ({ 
  name, 
  label, 
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
      <Switch {...rest} />
    </Form.Item>
  );
};
