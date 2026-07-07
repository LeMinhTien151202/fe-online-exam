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

interface AudioPlayerProps {
  src?: string | null;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src }) => {
  // Có URL thật -> phát audio thật; không có -> giữ nút giả (mock)
  if (src) {
    return (
      <PlayerWrapper>
        <audio src={src} controls style={{ width: '100%' }} />
      </PlayerWrapper>
    );
  }
  return (
    <PlayerWrapper>
      <PlayButton icon={<CaretRightOutlined />}>
        Play
      </PlayButton>
      <StatusText>
        Press Play to listen <strong>(Chưa có audio)</strong>
      </StatusText>
    </PlayerWrapper>
  );
};
