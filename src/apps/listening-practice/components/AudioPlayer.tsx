import React from 'react';
import styled from 'styled-components';
import { Button } from 'antd';
import { CaretRightOutlined } from '@ant-design/icons';

const PlayerWrapper = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
  padding: 0.5rem 0;
`;

const PlayButton = styled(Button)`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  height: 40px;
  border-radius: 6px;
  font-weight: 600;
  color: #334155;
  border-color: #cbd5e1;
  padding: 0 1rem;
  
  &:hover {
    color: #0ea5e9;
    border-color: #0ea5e9;
  }
`;

const StatusText = styled.span`
  font-size: 0.95rem;
  color: #64748b;
  font-weight: 500;
  
  strong {
    color: #334155;
    font-weight: 700;
  }
`;

export const AudioPlayer: React.FC = () => {
  return (
    <PlayerWrapper>
      <PlayButton icon={<CaretRightOutlined />}>
        Play
      </PlayButton>
      <StatusText>
        Press Play to listen <strong>(Listened: 0/2 times)</strong>
      </StatusText>
    </PlayerWrapper>
  );
};
