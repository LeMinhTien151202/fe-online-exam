import React from 'react';
import { Button } from 'antd';
import { RobotOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const GradeButton = styled(Button)`
  border-radius: 2rem;
  border-color: #6366f1;
  background: #6366f1;
  box-shadow: 0 4px 6px -1px rgba(99, 102, 241, 0.25);
  font-weight: 600;
  padding-inline: 2rem;

  &:not(:disabled):hover {
    border-color: #4f46e5;
    background: #4f46e5;
  }
`;

interface AiGradeButtonProps {
  canGrade: boolean;
  loading: boolean;
  hasGrade: boolean;
  onGrade: () => void;
}

export const AiGradeButton: React.FC<AiGradeButtonProps> = ({
  canGrade,
  loading,
  hasGrade,
  onGrade,
}) => {
  return (
    <GradeButton
      type="primary"
      icon={<RobotOutlined />}
      size="large"
      loading={loading}
      disabled={!canGrade || loading}
      onClick={onGrade}
    >
      {hasGrade ? 'Chấm lại bằng AI' : 'Chấm bằng AI'}
    </GradeButton>
  );
};

export default AiGradeButton;
