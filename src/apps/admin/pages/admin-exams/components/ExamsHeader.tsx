import React from 'react';
import { Button, Typography } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { ADMIN_COLORS } from '../../../constants';
import * as S from '../styles/styled';

const { Title } = Typography;

interface ExamsHeaderProps {
  title: string;
  onCreateNew: () => void;
  buttonText: string;
}

export const ExamsHeader: React.FC<ExamsHeaderProps> = ({ title, onCreateNew, buttonText }) => {
  return (
    <S.Header>
      <Title level={3} style={{ margin: 0, color: ADMIN_COLORS.textPrimary }}>
        {title}
      </Title>
      <Button
        type="primary"
        icon={<PlusOutlined />}
        onClick={onCreateNew}
        style={{ background: ADMIN_COLORS.primary }}
      >
        {buttonText}
      </Button>
    </S.Header>
  );
};
